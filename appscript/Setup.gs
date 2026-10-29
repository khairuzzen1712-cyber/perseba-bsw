/**
 * ==========================================================================
 * PERSEBA DUSUN BARATSAWAH - GOOGLE APPS SCRIPT
 * File: Setup.gs
 * Fungsi: Inisialisasi awal database Google Spreadsheet & menu otomatis
 * ==========================================================================
 */

/**
 * Menu otomatis yang muncul di bilah menu Google Sheets saat spreadsheet dibuka
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ PERSEBA Web')
    .addItem('🚀 Setup / Perbarui Struktur Spreadsheet', 'setupDatabase')
    .addItem('📊 Cek Status & Info Database', 'tampilkanInfoDatabase')
    .addItem('🧹 Buat Contoh Pesan Uji Coba', 'buatContohPesan')
    .addToUi();
}

/**
 * Inisialisasi otomatis lembar kerja (Sheets) dan header kolom
 * Jalankan fungsi ini pertama kali setelah membuat Google Spreadsheet baru!
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Atur zona waktu ke Asia/Jakarta (WIB)
  try {
    ss.setSpreadsheetTimeZone("Asia/Jakarta");
  } catch (e) {
    Logger.log("Zona waktu default digunakan: " + e.message);
  }

  // -------------------------------------------------------------
  // 1. SHEET: Pesan_Kontak (Menampung formulir kontak dari website)
  // -------------------------------------------------------------
  var sheetKontak = ss.getSheetByName("Pesan_Kontak");
  if (!sheetKontak) {
    sheetKontak = ss.insertSheet("Pesan_Kontak");
  }

  // Jika sheet masih baru atau kosong, buat header
  if (sheetKontak.getLastRow() === 0) {
    var headersKontak = [
      ["Waktu (WIB)", "Nama Pengirim", "No. WhatsApp / Telp", "Isi Pesan", "Status Pesan", "Catatan Admin"]
    ];
    sheetKontak.getRange(1, 1, 1, 6).setValues(headersKontak);
    sheetKontak.getRange(1, 1, 1, 6)
      .setFontWeight("bold")
      .setBackground("#15803d") // Hijau PERSEBA
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    
    sheetKontak.setRowHeight(1, 38);
    sheetKontak.setFrozenRows(1);
    
    // Atur lebar kolom
    sheetKontak.setColumnWidth(1, 170); // Waktu
    sheetKontak.setColumnWidth(2, 190); // Nama
    sheetKontak.setColumnWidth(3, 160); // WhatsApp
    sheetKontak.setColumnWidth(4, 380); // Pesan
    sheetKontak.setColumnWidth(5, 130); // Status
    sheetKontak.setColumnWidth(6, 200); // Catatan

    // Atur dropdown status pesan (Baru, Dibaca, Dibalas, Selesai)
    var ruleStatus = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Baru", "Dibaca", "Dibalas", "Selesai"], true)
      .setAllowInvalid(false)
      .build();
    sheetKontak.getRange("E2:E500").setDataValidation(ruleStatus);
  }

  // -------------------------------------------------------------
  // 2. SHEET: Data_Website (Cadangan cloud & sinkronisasi konten)
  // -------------------------------------------------------------
  var sheetData = ss.getSheetByName("Data_Website");
  if (!sheetData) {
    sheetData = ss.insertSheet("Data_Website");
  }

  if (sheetData.getLastRow() === 0) {
    var headersData = [
      ["KONTEN_JSON_LENGKAP", "TERAKHIR_DIPERBARUI", "KETERANGAN_STATUS"]
    ];
    sheetData.getRange(1, 1, 1, 3).setValues(headersData);
    sheetData.getRange(1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#d97706") // Amber / Gold PERSEBA
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    sheetData.setRowHeight(1, 38);
    sheetData.setFrozenRows(1);
    sheetData.setColumnWidth(1, 550);
    sheetData.setColumnWidth(2, 200);
    sheetData.setColumnWidth(3, 250);

    // Placeholder data
    sheetData.getRange("A2").setValue('{"keterangan":"Siap menerima sinkronisasi dari website PERSEBA"}');
    sheetData.getRange("B2").setValue(Utilities.formatDate(new Date(), "Asia/Jakarta", "dd-MM-yyyy HH:mm:ss"));
    sheetData.getRange("C2").setValue("Menunggu sinkronisasi pertama");
  }

  // -------------------------------------------------------------
  // 3. SHEET: Pengaturan (Konfigurasi notifikasi & identitas)
  // -------------------------------------------------------------
  var sheetSetting = ss.getSheetByName("Pengaturan");
  if (!sheetSetting) {
    sheetSetting = ss.insertSheet("Pengaturan");
  }

  if (sheetSetting.getLastRow() === 0) {
    var headersSetting = [
      ["Parameter", "Nilai", "Keterangan"]
    ];
    sheetSetting.getRange(1, 1, 1, 3).setValues(headersSetting);
    sheetSetting.getRange(1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#1e293b")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheetSetting.setRowHeight(1, 34);
    sheetSetting.setFrozenRows(1);
    sheetSetting.setColumnWidth(1, 240);
    sheetSetting.setColumnWidth(2, 300);
    sheetSetting.setColumnWidth(3, 300);

    var settingsData = [
      ["NAMA_ORGANISASI", "PERSEBA (Persatuan Remaja Barat Sawah)", "Identitas resmi organisasi"],
      ["DESA_DUSUN", "Dusun Baratsawah, Desa Gunungteguh, Bawean", "Lokasi sekretariat"],
      ["NOTIFIKASI_EMAIL_AKTIF", "FALSE", "Ubah jadi TRUE jika ingin email saat pesan baru masuk"],
      ["EMAIL_ADMIN", Session.getActiveUser().getEmail() || "admin@baratsawah.id", "Alamat email penerima notifikasi"],
      ["NOMOR_WA_ADMIN", "6281234567890", "Nomor WhatsApp pengurus untuk tindak lanjut pesan"]
    ];
    sheetSetting.getRange(2, 1, settingsData.length, 3).setValues(settingsData);
  }

  // Hapus Sheet1 bawaan default jika sudah ada sheet lain dan kosong
  try {
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
      ss.deleteSheet(defaultSheet);
    }
  } catch (err) {
    // Abaikan jika tidak ada atau tidak bisa dihapus
  }

  // Tampilkan notifikasi berhasil di Google Spreadsheet
  try {
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      "✅ Inisialisasi Berhasil!",
      "Struktur database PERSEBA Baratsawah telah siap:\n\n" +
      "1. Sheet 'Pesan_Kontak' (Formulir Masuk)\n" +
      "2. Sheet 'Data_Website' (Sinkronisasi Konten)\n" +
      "3. Sheet 'Pengaturan' (Konfigurasi Admin)\n\n" +
      "Langkah selanjutnya:\n" +
      "Klik tombol 'Deploy' > 'New deployment' > Web app untuk mendapatkan Web App URL.",
      ui.ButtonSet.OK
    );
  } catch (e) {
    Logger.log("Inisialisasi selesai via script.");
  }

  return {
    status: "success",
    message: "Struktur database PERSEBA siap digunakan"
  };
}

/**
 * Menampilkan ringkasan info database di Google Sheets
 */
function tampilkanInfoDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetKontak = ss.getSheetByName("Pesan_Kontak");
  var sheetData = ss.getSheetByName("Data_Website");
  
  var totalPesan = sheetKontak ? Math.max(0, sheetKontak.getLastRow() - 1) : 0;
  var lastUpdate = sheetData && sheetData.getLastRow() >= 2 ? sheetData.getRange("B2").getValue() : "Belum ada";

  var ui = SpreadsheetApp.getUi();
  ui.alert(
    "📊 Status Database PERSEBA",
    "• Nama Spreadsheet: " + ss.getName() + "\n" +
    "• Total Pesan Masuk: " + totalPesan + " pesan\n" +
    "• Terakhir Sinkron Website: " + lastUpdate + "\n" +
    "• ID Spreadsheet: " + ss.getId(),
    ui.ButtonSet.OK
  );
}

/**
 * Membuat 1 data contoh pesan kontak untuk menguji tampilan
 */
function buatContohPesan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetKontak = ss.getSheetByName("Pesan_Kontak");
  if (!sheetKontak) {
    setupDatabase();
    sheetKontak = ss.getSheetByName("Pesan_Kontak");
  }

  var waktu = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd-MM-yyyy HH:mm:ss");
  sheetKontak.appendRow([
    waktu,
    "Ahmad Fauzi (Warga Dusun)",
    "'081234567890",
    "Halo pengurus PERSEBA, terima kasih atas kegiatan bersih lingkungan kemarin. Semoga makin kompak selalu!",
    "Baru",
    "Contoh pesan uji coba"
  ]);

  var ui = SpreadsheetApp.getUi();
  ui.alert("✅ Berhasil!", "1 pesan uji coba berhasil ditambahkan ke sheet Pesan_Kontak.", ui.ButtonSet.OK);
}
