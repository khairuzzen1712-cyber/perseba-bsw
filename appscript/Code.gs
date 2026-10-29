/**
 * ==========================================================================
 * PERSEBA DUSUN BARATSAWAH - GOOGLE APPS SCRIPT
 * File: Code.gs
 * Fungsi: Controller Web App, REST API (doGet / doPost), & Jembatan Database
 * ==========================================================================
 */

/**
 * Menangani permintaan HTTP GET
 * 1. Jika dibuka di browser langsung: menampilkan halaman Portal Web App (Index.html)
 * 2. Jika dipanggil sebagai API (oleh website atau script): mengembalikan data JSON
 */
function doGet(e) {
  try {
    e = e || { parameter: {} };
    var action = e.parameter.action || "";

    // JIKA AKSES SEBAGAI API DARI WEBSITE
    if (action === "get_data" || action === "download_backup" || e.parameter.api === "true") {
      return kirimDataWebsiteJson();
    }

    if (action === "get_contacts") {
      return kirimDataPesanKontakJson();
    }

    if (action === "ping" || action === "test") {
      return jsonResponse({
        status: "success",
        message: "⚡ Google Apps Script PERSEBA aktif dan terhubung!",
        timestamp: new Date().toISOString(),
        spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName()
      });
    }

    // JIKA DIAKSES LANGSUNG LEWAT BROWSER -> TAMPILKAN WEB APP INDEX.HTML
    var template = HtmlService.createTemplateFromFile("Index");
    var html = template.evaluate();
    html.setTitle("Portal & Database PERSEBA Baratsawah");
    html.addMetaTag("viewport", "width=device-width, initial-scale=1");
    html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return html;

  } catch (err) {
    return jsonResponse({
      status: "error",
      message: "Terjadi kesalahan di server Apps Script: " + err.toString()
    });
  }
}

/**
 * Menangani permintaan HTTP POST
 * Menerima kiriman form kontak dari pengunjung website & sinkronisasi data website
 */
function doPost(e) {
  try {
    var raw = e && e.postData ? e.postData.contents : null;
    var data = {};

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (ex) {
        data = (e && e.parameter) ? e.parameter : {};
      }
    } else {
      data = (e && e.parameter) ? e.parameter : {};
    }

    var action = data.action || "contact_form";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ---------------------------------------------------------
    // AKSI 1: Simpan Pesan Kontak Masuk dari Form Website
    // ---------------------------------------------------------
    if (action === "contact_form") {
      var sheetKontak = ss.getSheetByName("Pesan_Kontak");
      if (!sheetKontak) {
        setupDatabase();
        sheetKontak = ss.getSheetByName("Pesan_Kontak");
      }

      var waktu = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd-MM-yyyy HH:mm:ss");
      var nama = (data.nama || "-").toString().trim();
      var telp = (data.telp || "-").toString().trim();
      var pesan = (data.pesan || "-").toString().trim();

      sheetKontak.appendRow([
        waktu,
        nama,
        "'" + telp,
        pesan,
        "Baru",
        "Diterima via formulir website"
      ]);

      // Kirim notifikasi email ke Admin jika diaktifkan di sheet Pengaturan
      try {
        kirimNotifikasiEmailAdmin(nama, telp, pesan, waktu);
      } catch (mailErr) {
        Logger.log("Email notifikasi tidak terkirim: " + mailErr.message);
      }

      return jsonResponse({
        status: "success",
        message: "Pesan kontak berhasil dicatat di Google Sheets PERSEBA",
        timestamp: waktu
      });
    }

    // ---------------------------------------------------------
    // AKSI 2: Simpan / Cadangkan Seluruh Data Website (JSON Backup)
    // ---------------------------------------------------------
    if (action === "sync_website_data") {
      var sheetData = ss.getSheetByName("Data_Website");
      if (!sheetData) {
        setupDatabase();
        sheetData = ss.getSheetByName("Data_Website");
      }

      var payloadString = typeof data.payload === "string" ? data.payload : JSON.stringify(data.payload || {});
      var updateTime = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd-MM-yyyy HH:mm:ss");

      sheetData.getRange("A2").setValue(payloadString);
      sheetData.getRange("B2").setValue(updateTime);
      sheetData.getRange("C2").setValue("Sinkronisasi otomatis berhasil");

      return jsonResponse({
        status: "success",
        message: "Data website berhasil disinkronkan ke Google Sheets pada " + updateTime,
        timestamp: updateTime
      });
    }

    // ---------------------------------------------------------
    // AKSI 3: Uji Koneksi Sederhana
    // ---------------------------------------------------------
    if (action === "test_connection") {
      return jsonResponse({
        status: "success",
        message: "Uji koneksi POST berhasil! Google Apps Script siap menerima data.",
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({
      status: "error",
      message: "Aksi '" + action + "' tidak dikenali"
    });

  } catch (err) {
    return jsonResponse({
      status: "error",
      message: "Gagal memproses POST: " + err.toString()
    });
  }
}

// =========================================================================
// HELPER FUNCTIONS & REST API HANDLERS
// =========================================================================

/**
 * Format respons menjadi objek JSON
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Mengambil JSON data website dari sheet Data_Website
 */
function kirimDataWebsiteJson() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = ss.getSheetByName("Data_Website");

  if (!sheetData || sheetData.getLastRow() < 2) {
    return jsonResponse({
      status: "success",
      message: "Sheet Data_Website belum memiliki data tersimpan",
      data: null
    });
  }

  var jsonVal = sheetData.getRange("A2").getValue();
  var lastUpdate = sheetData.getRange("B2").getValue();
  var parsed = null;

  try {
    parsed = typeof jsonVal === "string" ? JSON.parse(jsonVal) : jsonVal;
  } catch (e) {
    parsed = jsonVal;
  }

  return jsonResponse({
    status: "success",
    timestamp: lastUpdate,
    data: parsed
  });
}

/**
 * Mengambil daftar pesan kontak dalam format JSON
 */
function kirimDataPesanKontakJson() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Pesan_Kontak");

  if (!sheet || sheet.getLastRow() < 2) {
    return jsonResponse({
      status: "success",
      total: 0,
      data: []
    });
  }

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  var list = [];

  for (var i = rows.length - 1; i >= 0; i--) {
    list.push({
      row: i + 2,
      waktu: rows[i][0],
      nama: rows[i][1],
      telp: rows[i][2],
      pesan: rows[i][3],
      status: rows[i][4],
      catatan: rows[i][5]
    });
  }

  return jsonResponse({
    status: "success",
    total: list.length,
    data: list
  });
}

/**
 * Mengirimkan email notifikasi ke admin jika diizinkan
 */
function kirimNotifikasiEmailAdmin(nama, telp, pesan, waktu) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetSetting = ss.getSheetByName("Pengaturan");
  if (!sheetSetting) return;

  var settingRows = sheetSetting.getDataRange().getValues();
  var aktif = false;
  var emailTujuan = "";

  for (var i = 1; i < settingRows.length; i++) {
    if (settingRows[i][0] === "NOTIFIKASI_EMAIL_AKTIF" && String(settingRows[i][1]).toUpperCase() === "TRUE") {
      aktif = true;
    }
    if (settingRows[i][0] === "EMAIL_ADMIN") {
      emailTujuan = String(settingRows[i][1]).trim();
    }
  }

  if (aktif && emailTujuan && emailTujuan.indexOf("@") !== -1) {
    var subject = "📬 Pesan Baru dari Website PERSEBA: " + nama;
    var body = "Ada pesan masuk baru di website PERSEBA Dusun Baratsawah:\n\n" +
               "Waktu: " + waktu + "\n" +
               "Pengirim: " + nama + "\n" +
               "No. Telp / WA: " + telp + "\n" +
               "Isi Pesan:\n" + pesan + "\n\n" +
               "---\n" +
               "Buka Google Spreadsheet untuk mengelola: " + ss.getUrl();
    
    MailApp.sendEmail(emailTujuan, subject, body);
  }
}

// =========================================================================
// FUNGSI UNTUK PEMANGGILAN DARI INDEX.HTML (google.script.run)
// =========================================================================

/**
 * Mendapatkan ringkasan statistik untuk dashboard Web App
 */
function getWebAppData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetKontak = ss.getSheetByName("Pesan_Kontak");
  var sheetData = ss.getSheetByName("Data_Website");

  var totalPesan = 0;
  var pesanBaru = 0;
  var pesanList = [];

  if (sheetKontak && sheetKontak.getLastRow() >= 2) {
    var dataKontak = sheetKontak.getRange(2, 1, sheetKontak.getLastRow() - 1, 6).getValues();
    totalPesan = dataKontak.length;

    for (var i = dataKontak.length - 1; i >= 0; i--) {
      var st = String(dataKontak[i][4] || "Baru").trim();
      if (st.toLowerCase() === "baru") {
        pesanBaru++;
      }
      if (pesanList.length < 25) { // Tampilkan 25 pesan terbaru di dashboard
        pesanList.push({
          row: i + 2,
          waktu: dataKontak[i][0],
          nama: dataKontak[i][1],
          telp: dataKontak[i][2],
          pesan: dataKontak[i][3],
          status: st,
          catatan: dataKontak[i][5] || ""
        });
      }
    }
  }

  var lastSync = "Belum pernah sinkron";
  if (sheetData && sheetData.getLastRow() >= 2) {
    lastSync = sheetData.getRange("B2").getValue() || lastSync;
  }

  return {
    spreadsheetName: ss.getName(),
    spreadsheetUrl: ss.getUrl(),
    totalPesan: totalPesan,
    pesanBaru: pesanBaru,
    lastSync: lastSync,
    pesanList: pesanList
  };
}

/**
 * Memperbarui status pesan langsung dari Web App
 */
function updateStatusPesanDariWeb(row, newStatus) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Pesan_Kontak");
  if (!sheet) return { success: false, message: "Sheet Pesan_Kontak tidak ditemukan" };

  row = parseInt(row, 10);
  if (row >= 2 && row <= sheet.getLastRow()) {
    sheet.getRange(row, 5).setValue(newStatus);
    return { success: true, message: "Status baris " + row + " diubah menjadi " + newStatus };
  }
  return { success: false, message: "Nomor baris tidak valid" };
}

/**
 * Menjalankan setup database langsung dari Web App
 */
function panggilSetupDariWeb() {
  setupDatabase();
  return {
    success: true,
    message: "Struktur spreadsheet berhasil diinisialisasi ulang!"
  };
}
