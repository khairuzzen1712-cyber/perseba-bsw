import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Inisialisasi Firebase App (idempotent)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider dengan seluruh scope Workspace Google Drive & Sheets yang telah disetujui
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/drive');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// In-Memory Token Caching (TIDAK disimpan di localStorage / sessionStorage sesuai pedoman keamanan)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface AuthStateListener {
  (user: User | null, token: string | null): void;
}

const listeners: AuthStateListener[] = [];

// Listener status otentikasi Firebase
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    cachedAccessToken = null;
    notifyListeners(null, null);
    return;
  }

  // Jika token belum di-cache tapi user sudah ada (misal session persist)
  if (!cachedAccessToken && !isSigningIn) {
    notifyListeners(user, null);
  } else {
    notifyListeners(user, cachedAccessToken);
  }
});

function notifyListeners(user: User | null, token: string | null) {
  listeners.forEach((listener) => {
    try {
      listener(user, token);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

export function subscribeAuth(callback: AuthStateListener) {
  listeners.push(callback);
  callback(auth.currentUser, cachedAccessToken);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export async function loginWithGoogle(): Promise<{ user: User; accessToken: string }> {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan Access Token OAuth dari Firebase Google Auth.');
    }
    cachedAccessToken = credential.accessToken;
    notifyListeners(result.user, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

export async function logoutGoogle(): Promise<void> {
  await signOut(auth);
  cachedAccessToken = null;
  notifyListeners(null, null);
}

export async function getValidAccessToken(): Promise<string> {
  if (cachedAccessToken) return cachedAccessToken;
  // Jika tidak ada token di memori, minta login ulang
  throw new Error('Sesi autentikasi Google kedaluwarsa atau belum masuk. Silakan klik "Sign in with Google" terlebih dahulu.');
}

// =========================================================================
// GOOGLE SHEETS & GOOGLE DRIVE API CALLS
// =========================================================================

export interface DriveSpreadsheetItem {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface PesanKontakRow {
  row: number;
  waktu: string;
  nama: string;
  telp: string;
  pesan: string;
  status: string;
  catatan?: string;
}

/**
 * Mencari spreadsheet milik user di Google Drive
 */
export async function listDriveSpreadsheets(): Promise<DriveSpreadsheetItem[]> {
  const token = await getValidAccessToken();
  const q = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal membaca daftar Google Sheets dari Drive: ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Membuat Spreadsheet Baru khusus PERSEBA Baratsawah dengan struktur tab lengkap
 */
export async function createPersebaSpreadsheet(customTitle = 'Database PERSEBA Dusun Baratsawah'): Promise<{ id: string; url: string; title: string }> {
  const token = await getValidAccessToken();
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';

  const body = {
    properties: {
      title: customTitle,
      locale: 'id_ID',
      timeZone: 'Asia/Jakarta'
    },
    sheets: [
      {
        properties: {
          sheetId: 0,
          title: 'Pesan_Kontak',
          gridProperties: { rowCount: 100, columnCount: 6, frozenRowCount: 1 }
        }
      },
      {
        properties: {
          sheetId: 1,
          title: 'Data_Website',
          gridProperties: { rowCount: 10, columnCount: 4, frozenRowCount: 1 }
        }
      },
      {
        properties: {
          sheetId: 2,
          title: 'Pengaturan',
          gridProperties: { rowCount: 20, columnCount: 3, frozenRowCount: 1 }
        }
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal membuat spreadsheet baru: ${errText}`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl;

  // Inisialisasi Header & Data Default ke Sheet yang baru dibuat
  await initializeSheetData(spreadsheetId, token);

  return {
    id: spreadsheetId,
    url: spreadsheetUrl,
    title: customTitle
  };
}

/**
 * Inisialisasi format tabel dan nilai default ke spreadsheet
 */
async function initializeSheetData(spreadsheetId: string, token: string) {
  // 1. Tulis Header ke Pesan_Kontak
  const headersKontak = [
    ['Waktu (WIB)', 'Nama Pengirim', 'Nomor WhatsApp', 'Pesan Aspirasi / Saran', 'Status', 'Catatan Admin']
  ];
  await updateSheetValues(spreadsheetId, 'Pesan_Kontak!A1:F1', headersKontak, token);

  // 2. Tulis Header ke Data_Website
  const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const headersData = [
    ['Bagian', 'Data JSON Cadangan', 'Terakhir Sinkron', 'Pengubah'],
    ['FULL_WEBSITE_STATE', '{"info":"Database siap menerima sinkronisasi"}', nowStr, auth.currentUser?.email || 'admin']
  ];
  await updateSheetValues(spreadsheetId, 'Data_Website!A1:D2', headersData, token);

  // 3. Tulis Header ke Pengaturan
  const headersSetting = [
    ['Parameter', 'Nilai', 'Keterangan'],
    ['NAMA_ORGANISASI', 'PERSEBA (Persatuan Remaja Barat Sawah)', 'Identitas resmi organisasi pemuda'],
    ['DUSUN_DESA', 'Dusun Baratsawah, Desa Gunungteguh, Bawean', 'Wilayah pengabdian'],
    ['NOTIFIKASI_EMAIL', 'TRUE', 'Kirim notifikasi email saat pesan kontak baru masuk'],
    ['EMAIL_PENGURUS', auth.currentUser?.email || 'admin@baratsawah.id', 'Email penerima laporan'],
    ['WHATSAPP_ADMIN', '6281234567890', 'Nomor WhatsApp hotline pemuda']
  ];
  await updateSheetValues(spreadsheetId, 'Pengaturan!A1:C6', headersSetting, token);

  // Format Header dengan warna hijau dan font tebal via batchUpdate
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          // Warna Header Pesan_Kontak
          {
            repeatCell: {
              range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.08, green: 0.5, blue: 0.24 }, // Hijau Perseba
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          // Lebar Kolom Pesan_Kontak
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 160 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 320 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 110 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, properties: { pixelSize: 220 }, fields: 'pixelSize' } }
        ]
      })
    });
  } catch (fmtErr) {
    console.warn('Formatting batchUpdate skipped:', fmtErr);
  }
}

async function updateSheetValues(spreadsheetId: string, range: string, values: any[][], token: string) {
  const encRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encRange}?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menulis nilai ke ${range}: ${err}`);
  }
  return await res.json();
}

/**
 * Menambahkan Pesan Formulir Kontak Warga ke Sheet Pesan_Kontak
 */
export async function appendContactMessageToSheet(
  spreadsheetId: string,
  message: { nama: string; telp: string; pesan: string }
): Promise<any> {
  const token = await getValidAccessToken();
  const range = encodeURIComponent('Pesan_Kontak!A:F');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const nowWib = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const rowValues = [
    [nowWib, message.nama, message.telp, message.pesan, 'Baru', 'Masuk via Formulir Website']
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: rowValues })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menyimpan pesan ke Google Sheets: ${err}`);
  }

  return await res.json();
}

/**
 * Membaca Daftar Pesan Kontak Masuk dari Google Sheets
 */
export async function fetchContactMessagesFromSheet(spreadsheetId: string): Promise<PesanKontakRow[]> {
  const token = await getValidAccessToken();
  const range = encodeURIComponent('Pesan_Kontak!A2:F200');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membaca data Pesan_Kontak: ${err}`);
  }

  const data = await res.json();
  const rows = data.values || [];

  return rows.map((r: any[], idx: number) => ({
    row: idx + 2,
    waktu: r[0] || '-',
    nama: r[1] || 'Warga Tanpa Nama',
    telp: r[2] || '-',
    pesan: r[3] || '',
    status: r[4] || 'Baru',
    catatan: r[5] || ''
  }));
}

/**
 * Memperbarui status pesan (Baru, Dibaca, Dibalas, Selesai)
 */
export async function updateMessageStatusInSheet(
  spreadsheetId: string,
  rowIndex: number,
  newStatus: string
): Promise<void> {
  const token = await getValidAccessToken();
  const range = encodeURIComponent(`Pesan_Kontak!E${rowIndex}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [[newStatus]] })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal memperbarui status pesan di baris ${rowIndex}: ${err}`);
  }
}

/**
 * Menyinkronkan (Unggah) seluruh konten website ke Google Sheets (Tab Data_Website)
 */
export async function uploadWebsiteContentToSheet(
  spreadsheetId: string,
  appState: any
): Promise<string> {
  const token = await getValidAccessToken();
  const nowWib = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const userEmail = auth.currentUser?.email || 'admin';

  // Sanitasi data agar aman disimpan dalam cell Google Sheets
  const serialized = JSON.stringify(appState);

  const range = encodeURIComponent('Data_Website!A2:D2');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [
        ['FULL_WEBSITE_STATE', serialized, nowWib, userEmail]
      ]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal mengunggah data website ke Google Sheets: ${err}`);
  }

  return nowWib;
}

/**
 * Menarik (Download) konten website dari Google Sheets (Tab Data_Website)
 */
export async function downloadWebsiteContentFromSheet(spreadsheetId: string): Promise<{ data: any; lastSync: string; author: string }> {
  const token = await getValidAccessToken();
  const range = encodeURIComponent('Data_Website!A2:D2');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membaca data website dari sheet: ${err}`);
  }

  const json = await res.json();
  const row = (json.values && json.values[0]) || [];

  if (!row[1]) {
    throw new Error('Tab Data_Website di spreadsheet Anda belum memiliki data cadangan. Silakan lakukan Unggah Data terlebih dahulu.');
  }

  try {
    const parsedData = JSON.parse(row[1]);
    return {
      data: parsedData,
      lastSync: row[2] || '-',
      author: row[3] || '-'
    };
  } catch (parseErr) {
    throw new Error('Data di baris B2 Google Sheets bukan JSON yang valid.');
  }
}
