# 🚀 Panduan Deploy Website PERSEBA ke Vercel (vercel.app)

Aplikasi **Remaja Dusun Baratsawah (PERSEBA)** ini siap di-deploy secara online dan gratis menggunakan **Vercel**.

---

## 📋 Langkah-Langkah Deploy ke Vercel (5 Menit)

### 1. Unggah Repositori ke GitHub
Pastikan seluruh file proyek ini sudah berada di repositori GitHub Anda (misalnya repositori `perseba-baratsawah`).
Jika belum:
1. Buat repository baru di [github.com/new](https://github.com/new).
2. Unggah atau *push* seluruh file proyek ini ke GitHub Anda.

### 2. Hubungkan ke Vercel
1. Buka situs **[vercel.com](https://vercel.com)** dan masuk (login) menggunakan akun GitHub Anda.
2. Di dashboard Vercel, klik tombol **Add New...** > **Project**.
3. Pilih repositori GitHub **`perseba-baratsawah`** (atau nama repo Anda), lalu klik **Import**.

### 3. Pengaturan Build & Output (Otomatis Terdeteksi)
Vercel akan secara otomatis mendeteksi bahwa proyek ini menggunakan **Vite**. Pengaturan default berikut sudah disiapkan melalui file `vercel.json`:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Anda tidak perlu mengubah apa pun, langsung klik tombol **Deploy**.

### 4. Selesai! 🎉
Tunggu proses build selama beberapa detik. Vercel akan memberikan tautan online gratis berakhiran **`.vercel.app`** (misalnya `https://perseba-baratsawah.vercel.app`). Website Anda kini sudah online 24 jam dan dapat diakses oleh seluruh warga Dusun Baratsawah, perantau Bawean, dan masyarakat luas!

---

## 💡 Catatan Penting untuk Integrasi Google Sheets & Drive
Karena autentikasi Google Sheets menggunakan Firebase Auth & Google OAuth client-side token, pastikan Anda menambahkan domain Vercel Anda (`*.vercel.app`) ke daftar Authorized JavaScript Origins / Redirect URIs di Google Cloud Console jika diperlukan, atau cukup gunakan akun Google Anda yang sudah terverifikasi saat mengklik tombol **Sign in with Google** di menu CMS website.
