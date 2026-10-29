# 🚀 Panduan Google Apps Script - PERSEBA Dusun Baratsawah

Paket file ini berisi 3 file inti untuk diaplikasikan langsung di **Google Apps Script**:

| Nama File | Tipe di Apps Script | Fungsi Utama |
|---|---|---|
| **`Setup.gs`** | File Skrip (`.gs`) | Inisialisasi otomatis lembar `Pesan_Kontak`, `Data_Website`, `Pengaturan`, menu atas di Google Sheets |
| **`Code.gs`** | File Skrip (`.gs`) | Backend controller: `doGet()`, `doPost()`, API sinkronisasi, dan web app server |
| **`Index.html`** | File HTML (`.html`) | Tampilan dashboard monitoring pesan warga & status website saat Web App dibuka di browser |

---

## 📋 Langkah Memasang di Google Apps Script (5 Menit)

### 1. Buat Spreadsheet Baru
1. Buka browser dan kunjungi: **[sheets.new](https://sheets.new)**
2. Beri nama spreadsheet Anda, misalnya: **Database PERSEBA Baratsawah**

### 2. Buka Editor Google Apps Script
1. Pada menu atas Google Sheets, klik **Ekstensi (Extensions)** > **Apps Script**.
2. Anda akan diarahkan ke layar editor kode Google Apps Script.

### 3. Masukkan 3 File Ini:

#### A. File Pertama: `Setup.gs`
1. Di sebelah kiri editor, klik tombol **+** di samping "Files" (File) > pilih **Script**.
2. Beri nama file: `Setup` (akan menjadi `Setup.gs`).
3. Salin seluruh isi dari file `Setup.gs` lalu tempelkan ke editor.

#### B. File Kedua: `Code.gs`
1. Di file bawaan `Code.gs` (atau buat baru jika belum ada), hapus kode default `function myFunction() {}`.
2. Salin seluruh isi dari file `Code.gs` lalu tempelkan ke editor.

#### C. File Ketiga: `Index.html`
1. Klik tombol **+** di samping "Files" (File) > pilih **HTML**.
2. Beri nama file: `Index` (Google Apps Script akan menyimpannya sebagai `Index.html`).
3. Hapus kode default HTML yang ada, lalu salin dan tempelkan seluruh isi file `Index.html`.

### 4. Jalankan Inisialisasi Database Pertama Kali
1. Di menu fungsi atas editor Apps Script (sebelah tombol *Debug*), pilih fungsi **`setupDatabase`**.
2. Klik tombol **Run (Jalankan)**.
3. Klik **Review permissions (Tinjau Izin)** > pilih akun Google Anda > klik *Advanced* (Lanjutan) > klik *Go to ... (unsafe / lanjutkan)* > klik **Allow (Izinkan)**.
4. Buka kembali tab Google Sheets Anda, 3 lembar kerja (`Pesan_Kontak`, `Data_Website`, `Pengaturan`) dan menu khusus **⚡ PERSEBA Web** telah siap secara otomatis!

### 5. Deploy / Penerapan sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy (Terapkan)** > pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi ⚙️ di sebelah *Select type* > pilih **Web app**.
3. Isi konfigurasi:
   - **Description**: `Web App PERSEBA v1`
   - **Execute as (Jalankan sebagai)**: `Me (akun Google saya)`
   - **Who has access (Siapa yang memiliki akses)**: **`Anyone (Siapa saja)`** *(Sangat penting agar formulir kontak website dapat mengirim pesan tanpa harus login)*
4. Klik **Deploy (Terapkan)**.
5. Salin **Web app URL** yang muncul (berakhiran `/exec`).

### 6. Hubungkan ke Website
1. Buka website PERSEBA > klik **Kelola Konten** (masukkan password: `@perseba`).
2. Masuk ke menu **⚡ Integrasi Google Sheets**.
3. Tempel **Web app URL** ke kolom input > klik **Simpan Konfigurasi Integrasi**.
4. Klik tombol **Kirim Seluruh Data Website ke Google Sheets** untuk sinkronisasi pertama kali. Selesai!

---

## 🌐 Panduan Menerapkan Langsung ke Google Sites (sites.google.com)

Ada 2 cara mudah memasang website ini di **Google Sites**:

### Cara 1: Sematkan Berdasarkan URL (Rekomendasi Paling Praktis)
1. Buka situs Anda di **[sites.google.com](https://sites.google.com)**.
2. Di panel sebelah kanan, klik tab **Sisipkan (Insert)** > pilih **Sematkan (Embed)** (`< >`).
3. Pilih tab **Berdasarkan URL (By URL)**.
4. Tempelkan URL website PERSEBA Anda.
5. Pilih opsi **Seluruh halaman (Whole page)**, lalu klik **Sisipkan (Insert)**.
6. Tarik titik sudut frame biru agar melebar penuh (Full Width) dan setinggi halaman.
7. Klik tombol biru **Publikasikan (Publish)** di kanan atas.

### Cara 2: Sematkan dengan Kode Iframe HTML
1. Di Google Sites, klik tab **Sisipkan (Insert)** > **Sematkan (Embed)**.
2. Pilih tab **Sematkan kode (Embed code)**.
3. Masukkan kode berikut (ganti `URL_WEBSITE_ANDA` dengan URL web Anda):
```html
<iframe 
  src="URL_WEBSITE_ANDA" 
  style="width: 100%; height: 1000px; border: none; border-radius: 12px;" 
  allow="fullscreen; clipboard-read; clipboard-write; geolocation"
  loading="lazy">
</iframe>
```
4. Klik **Berikutnya (Next)** > klik **Sisipkan (Insert)**.
5. Sesuaikan lebar bingkai dan klik **Publikasikan (Publish)**.

