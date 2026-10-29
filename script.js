import {
  auth,
  subscribeAuth,
  loginWithGoogle,
  logoutGoogle,
  listDriveSpreadsheets,
  createPersebaSpreadsheet,
  appendContactMessageToSheet,
  fetchContactMessagesFromSheet,
  updateMessageStatusInSheet,
  uploadWebsiteContentToSheet,
  downloadWebsiteContentFromSheet
} from './src/googleSheetsService.ts';

/**
 * ==========================================================================
 * REMAJA DUSUN BARATSAWAH (PERSEBA) - JAVASCRIPT & CMS ENGINE
 * Sistem Terintegrasi: Pengelolaan Konten, Penambahan, Pengeditan & Eksekusi Live
 * ==========================================================================
 */

// ==========================================
// 1. DATA MASTER DEFAULT (BAWAAN SISTEM)
// ==========================================
const DEFAULT_PERSEBA_STATE = {
  hero: {
    tagline: "Gunungteguh · Sangkapura · Bawean · Gresik",
    titlePart1: "REMAJA DUSUN",
    titlePart2: "BARATSAWAH",
    description: "“Wadah kreativitas, kebersamaan, kepedulian, dan kontribusi remaja Dusun Baratsawah untuk membangun kampung yang aktif, solid, kreatif, dan berdaya.”",
    stats: [
      { id: "stat_1", angka: "120+", label: "Jumlah Anggota" },
      { id: "stat_2", angka: "35+", label: "Jumlah Kegiatan" },
      { id: "stat_3", angka: "6", label: "Program Aktif" },
      { id: "stat_4", angka: "100%", label: "Guyub & Rukun" }
    ]
  },
  tentang: {
    judul: "Persatuan Remaja Se Baratsawah (PERSEBA)",
    ringkasan1: "“Remaja Dusun Baratsawah merupakan wadah bagi generasi muda untuk berkumpul, berkreasi, bersilaturahmi, mengembangkan potensi, serta ikut berkontribusi dalam berbagai kegiatan sosial dan kemasyarakatan di Dusun Baratsawah.”",
    ringkasan2: "Terletak di kawasan asri Desa Gunungteguh, Kecamatan Sangkapura, Pulau Bawean, PERSEBA senantiasa menjadi motor penggerak gotong royong, menjaga kelestarian tradisi leluhur, serta menghadirkan inovasi positif untuk kemajuan kampung tercinta.",
    visi: "“Mewujudkan generasi muda Dusun Baratsawah yang kompak, kreatif, peduli, berakhlak, dan aktif dalam membangun kampung.”",
    misi: [
      "Mempererat persaudaraan dan silaturahmi antarremaja.",
      "Mengembangkan kreativitas dan potensi generasi muda.",
      "Mengadakan kegiatan positif dan bermanfaat.",
      "Meningkatkan kepedulian terhadap lingkungan dan masyarakat.",
      "Mendorong partisipasi remaja dalam pembangunan kampung."
    ]
  },
  kegiatan: [
    {
      id: 1,
      nama: "Gotong Royong Bersih Dusun & Penghijauan",
      kategori: "Gotong Royong",
      tanggal: "12 Oktober 2026",
      lokasi: "Jl. Poros Dusun Baratsawah",
      gambar: "/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg",
      deskripsi: "Aksi bersih-bersih lingkungan dusun, pembersihan saluran air, serta penanaman bibit pohon perindang bersama warga dan pemuda.",
      detailLengkap: "Kegiatan gotong royong rutin yang diikuti oleh puluhan pemuda dan warga Baratsawah. Dimulai pukul 06.30 WIB dengan pembagian zona kerja, mulai dari gapura masuk hingga perbatasan dusun. Acara diakhiri dengan sarapan tumpeng bersama sebagai wujud rasa syukur dan kebersamaan."
    },
    {
      id: 2,
      nama: "Turnamen Bola Voli Antar RT Perseba Cup",
      kategori: "Olahraga",
      tanggal: "20 Oktober 2026",
      lokasi: "Lapangan Voli Dusun Baratsawah",
      gambar: "/src/assets/images/kegiatan_olahraga_1790430748985.jpg",
      deskripsi: "Ajang olahraga persahabatan pemuda untuk menjunjung tinggi sportivitas, kesehatan, dan mempererat tali silaturahmi antar pemuda.",
      detailLengkap: "Kompetisi persahabatan bola voli antar RT se-Dusun Baratsawah dalam rangka menyemarakkan persatuan generasi muda. Pertandingan diadakan setiap sore hari pukul 15.30 WIB dengan antusiasme penonton dan pendukung dari seluruh warga."
    },
    {
      id: 3,
      nama: "Peringatan Maulid Nabi & Shalawat Bersama",
      kategori: "Keagamaan",
      tanggal: "28 September 2026",
      lokasi: "Masjid / Musholla Baratsawah",
      gambar: "/src/assets/images/kegiatan_keagamaan_1790430762760.jpg",
      deskripsi: "Lantunan shalawat, pengajian umum, dan santunan untuk memupuk generasi muda yang berakhlak mulia dan religius.",
      detailLengkap: "Acara keagamaan tahunan menyambut Maulid Nabi Muhammad SAW dengan menghadirkan penceramah agama serta penampilan hadrah dan shalawatan dari grup remaja Dusun Baratsawah. Dihadiri oleh tokoh agama, tokoh masyarakat, dan ratusan warga."
    },
    {
      id: 4,
      nama: "Bakti Sosial & Santunan Anak Yatim",
      kategori: "Bakti Sosial",
      tanggal: "15 November 2026",
      lokasi: "Balai Pertemuan Baratsawah",
      gambar: "/src/assets/images/hero_perseba_bawean_1790430721713.jpg",
      deskripsi: "Penyaluran paket sembako dan santunan pendidikan bagi adik-adik yatim serta lansia pra-sejahtera di lingkungan dusun.",
      detailLengkap: "Program kepedulian sosial yang digalang dari donasi swadaya pemuda, perantau Bawean, dan para dermawan. Bertujuan meringankan beban keluarga yang membutuhkan serta memupuk kepekaan sosial sejak dini."
    },
    {
      id: 5,
      nama: "Semarak HUT RI: Lomba Rakyat & Malam Puncak",
      kategori: "Kemerdekaan",
      tanggal: "17 Agustus 2026",
      lokasi: "Area Terbuka Dusun Baratsawah",
      gambar: "/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg",
      deskripsi: "Rangkaian perlombaan tradisional anak-anak dan warga, ditutup dengan malam apresiasi seni pemuda kampung.",
      detailLengkap: "Perayaan kemerdekaan yang meriah dengan berbagai lomba tradisional seperti tarik tambang, balap karung helm, makan kerupuk, serta pentas tari dan musik akustik karya remaja di panggung gembira kemerdekaan."
    },
    {
      id: 6,
      nama: "Silaturahmi Akbar Pemuda & Perantau Bawean",
      kategori: "Silaturahmi",
      tanggal: "03 Mei 2026",
      lokasi: "Pendopo Dusun Baratsawah",
      gambar: "/src/assets/images/hero_perseba_bawean_1790430721713.jpg",
      deskripsi: "Temu kangen dan dialog pemuda kampung dengan saudara perantau untuk bertukar gagasan kemajuan kampung halaman.",
      detailLengkap: "Forum diskusi santai dan ramah tamah yang mempertemukan pemuda yang menetap di kampung dengan para perantau Bawean yang sedang mudik. Menghasilkan berbagai inisiatif program kerja produktif untuk dusun."
    }
  ],
  galeri: [
    {
      id: 1,
      judul: "Gotong Royong Membersihkan Saluran Air",
      kategori: "Gotong Royong",
      gambar: "/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg"
    },
    {
      id: 2,
      judul: "Latihan Rutin Bola Voli Sore",
      kategori: "Olahraga",
      gambar: "/src/assets/images/kegiatan_olahraga_1790430748985.jpg"
    },
    {
      id: 3,
      judul: "Malam Shalawatan & Pengajian Pemuda",
      kategori: "Keagamaan",
      gambar: "/src/assets/images/kegiatan_keagamaan_1790430762760.jpg"
    },
    {
      id: 4,
      judul: "Kebersamaan Anggota Pemuda di Bukit Baratsawah",
      kategori: "Kegiatan Remaja",
      gambar: "/src/assets/images/hero_perseba_bawean_1790430721713.jpg"
    },
    {
      id: 5,
      judul: "Penyaluran Bantuan Sembako Berkah",
      kategori: "Sosial",
      gambar: "/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg"
    },
    {
      id: 6,
      judul: "Turnamen Olahraga Pemuda Kampung",
      kategori: "Acara Kampung",
      gambar: "/src/assets/images/kegiatan_olahraga_1790430748985.jpg"
    }
  ],
  berita: [
    {
      id: 1,
      judul: "Pendaftaran Kepanitiaan Peringatan Hari Besar Islam Dibuka",
      kategori: "Pengumuman",
      tanggal: "24 September 2026",
      ringkasan: "Dibutuhkan rekan-rekan pemuda yang siap berkontribusi dalam divisi acara, perlengkapan, konsumsi, dan publikasi.",
      kontenLengkap: "Dalam rangka menyukseskan peringatan hari besar yang akan datang, pengurus PERSEBA membuka pendaftaran kepanitiaan terbuka bagi seluruh pemuda dan pemudi Dusun Baratsawah. Silakan hubungi Sekretaris atau mendaftar melalui form kontak."
    },
    {
      id: 2,
      judul: "Hasil Musyawarah Pemuda: Fokus Penguatan Fasilitas Olahraga",
      kategori: "Berita Kegiatan",
      tanggal: "18 September 2026",
      ringkasan: "Musyawarah bulanan menyepakati revitalisasi jaring pengaman dan pengecatan ulang lapangan voli dusun.",
      kontenLengkap: "Musyawarah yang dihadiri oleh pengurus inti dan perwakilan tiap RT menghasilkan kesepakatan bersama untuk melakukan perbaikan fasilitas sarana olahraga pemuda secara swadaya mulai awal bulan depan."
    },
    {
      id: 3,
      judul: "Sosialisasi Bahaya Narkoba dan Edukasi Internet Positif untuk Remaja",
      kategori: "Informasi Remaja",
      tanggal: "10 September 2026",
      ringkasan: "Kegiatan edukatif bekerja sama dengan pihak puskesmas dan aparat desa setempat untuk membentengi masa depan generasi muda.",
      kontenLengkap: "Penyuluhan pentingnya menjaga pergaulan sehat, menjauhi narkotika, serta memanfaatkan internet dan media sosial secara bijak untuk karya produktif dan kemajuan ekonomi kreatif pemuda."
    }
  ],
  agenda: [
    {
      id: 1,
      nama: "Latihan / Rapat Remaja",
      hari: "12",
      bulan: "Okt",
      lokasi: "Dusun Baratsawah (Balai Dusun)",
      waktu: "19.00 WIB - Selesai"
    },
    {
      id: 2,
      nama: "Latihan Voli Bersama",
      hari: "18",
      bulan: "Okt",
      lokasi: "Lapangan Voli Baratsawah",
      waktu: "15.30 WIB"
    },
    {
      id: 3,
      nama: "Khataman & Shalawat Malam Jumat",
      hari: "25",
      bulan: "Okt",
      lokasi: "Musholla Baratsawah",
      waktu: "Ba'da Isya"
    }
  ],
  struktur: [
    { id: 1, peran: "Kepala Dusun", nama: "Bapak Dusun Baratsawah", catatan: "Pelindung Organisasi", foto: "" },
    { id: 2, peran: "Pembina Pemuda", nama: "Tokoh Masyarakat / Agama", catatan: "Pengarah Kebijakan", foto: "" },
    { id: 3, peran: "Ketua Umum", nama: "Ahmad Fauzi", catatan: "Masa Bakti 2026 - 2028", foto: "" },
    { id: 4, peran: "Wakil Ketua", nama: "M. Rizki Bawean", catatan: "Masa Bakti 2026 - 2028", foto: "" },
    { id: 5, peran: "Sekretaris", nama: "Nurul Hidayah", catatan: "Administrasi & Surat", foto: "" },
    { id: 6, peran: "Bendahara", nama: "Siti Fatimah", catatan: "Keuangan & Kas Dusun", foto: "" },
    { id: 7, peran: "Koord. Keagamaan", nama: "Ust. Hamdan", catatan: "Seksi Rohani", foto: "" },
    { id: 8, peran: "Koord. Olahraga", nama: "Hendra Wahyudi", catatan: "Seksi Pemuda & Atlet", foto: "" },
    { id: 9, peran: "Koord. Sosial & Humas", nama: "Budi Santoso", catatan: "Hubungan Warga", foto: "" },
    { id: 10, peran: "Seluruh Anggota", nama: "Remaja Se-Baratsawah", catatan: "Kekuatan Utama Dusun", foto: "" }
  ],
  proker: [
    {
      id: 1,
      bidang: "1. Bidang Keagamaan",
      status: "Aktif",
      deskripsi: "Meningkatkan keimanan dan ketakwaan pemuda melalui kegiatan ibadah berjamaah dan peringatan hari besar Islam.",
      poin: [
        "Rutinan Shalawat & Hadrah mingguan",
        "Peringatan Maulid Nabi & Isra Mi'raj",
        "Tadarus Al-Qur'an & Pesantren Kilat Ramadhan"
      ]
    },
    {
      id: 2,
      bidang: "2. Bidang Olahraga",
      status: "Aktif",
      deskripsi: "Menjaga kebugaran jasmani dan memupuk sportivitas melalui turnamen dan latihan rutin.",
      poin: [
        "Turnamen Voli Antar RT Perseba Cup",
        "Futsal & Sepakbola persahabatan antar dusun",
        "Perawatan sarana dan lapangan olahraga dusun"
      ]
    },
    {
      id: 3,
      bidang: "3. Bidang Sosial",
      status: "Selesai",
      deskripsi: "Aksi kemanusiaan, bakti sosial, dan kepedulian terhadap warga yang tertimpa musibah atau membutuhkan.",
      poin: [
        "Penyaluran santunan sembako berkah",
        "Penggalangan dana tanggap darurat warga",
        "Layanan bantuan tenaga saat hajatan warga"
      ]
    },
    {
      id: 4,
      bidang: "4. Bidang Lingkungan",
      status: "Aktif",
      deskripsi: "Mewujudkan Dusun Baratsawah yang asri, bersih, hijau, dan nyaman untuk ditinggali seluruh warga.",
      poin: [
        "Jumat Bersih & gotong royong saluran air",
        "Penanaman pohon peneduh & tanaman hias",
        "Edukasi pengelolaan sampah rumah tangga"
      ]
    },
    {
      id: 5,
      bidang: "5. Bidang Kreativitas",
      status: "Akan Datang",
      deskripsi: "Pemberdayaan keterampilan digital, seni budaya lokal, dan promosi potensi kampung.",
      poin: [
        "Pengembangan media informasi dan medsos kampung",
        "Pentas seni dan kreasi anak-anak muda",
        "Pelatihan desain grafis dan dokumentasi foto/video"
      ]
    },
    {
      id: 6,
      bidang: "6. Bidang Kepemudaan",
      status: "Akan Datang",
      deskripsi: "Kaderisasi organisasi, kepemimpinan, dan membangun jejaring dengan pemuda se-Pulau Bawean.",
      poin: [
        "Musyawarah pemuda bulanan & evaluasi",
        "Kaderisasi anggota baru remaja dusun",
        "Forum silaturahmi pemuda lintas desa di Sangkapura"
      ]
    }
  ],
  kontak: {
    namaOrganisasi: "PERSEBA BARATSAWAH",
    alamat: "Dusun Baratsawah, Desa Gunungteguh, Kecamatan Sangkapura, Pulau Bawean, Kabupaten Gresik, Jawa Timur, Indonesia · Kode Pos 61181",
    whatsapp: "6281234567890",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    email: "kontak@baratsawah.id",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.8878235777174!2d112.6375!3d-5.8425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2ddb60098fa5972d%3A0x8677c77cbb650f14!2sGunungteguh%2C%20Kec.%20Sangkapura%2C%20Kabupaten%20Gresik%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
  },
  integrasi: {
    appScriptUrl: "",
    autoSyncContactForm: true,
    lastSync: "",
    activeSpreadsheetId: "",
    activeSpreadsheetTitle: "",
    activeSpreadsheetUrl: ""
  }
};

// ==========================================
// 2. STATE MANAGER & PERSISTENCE
// ==========================================
const STORAGE_KEY = "perseba_app_state_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PERSEBA_STATE));
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PERSEBA_STATE,
      ...parsed,
      hero: { ...DEFAULT_PERSEBA_STATE.hero, ...(parsed.hero || {}) },
      tentang: { ...DEFAULT_PERSEBA_STATE.tentang, ...(parsed.tentang || {}) },
      kontak: { ...DEFAULT_PERSEBA_STATE.kontak, ...(parsed.kontak || {}) },
      integrasi: { ...DEFAULT_PERSEBA_STATE.integrasi, ...(parsed.integrasi || {}) }
    };
  } catch (e) {
    console.error("Gagal memuat state dari LocalStorage:", e);
    return JSON.parse(JSON.stringify(DEFAULT_PERSEBA_STATE));
  }
}

let APP_STATE = loadState();

function saveState(showNotification = true, notificationMsg = "Perubahan berhasil disimpan & dieksekusi!") {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE));
    renderAllWebsite();
    if (showNotification) tampilkanToast(notificationMsg);
  } catch (e) {
    console.error("Gagal menyimpan ke LocalStorage:", e);
    tampilkanToast("Terjadi kendala saat menyimpan data.");
  }
}

// ==========================================
// 3. INISIALISASI APLIKASI UTAMA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initDarkMode();
  renderAllWebsite();
  initSearch();
  initLightbox();
  initContactForm();
  initBackToTop();
  initModals();
  initAdminCms();
  initGoogleSites();
  initGoogleSheetsIntegration();
});

// ==========================================
// 4. RENDERING SELURUH WEBSITE SECARA DINAMIS
// ==========================================
function renderAllWebsite() {
  renderHero();
  renderTentang();
  renderKegiatan("Semua");
  renderGaleri("Semua");
  renderBerita();
  renderAgenda();
  renderStruktur();
  renderProker();
  renderKontak();
}

function renderHero() {
  const heroTag = document.getElementById("heroTagText");
  const heroTitle = document.getElementById("heroTitleText");
  const heroLead = document.getElementById("heroLeadText");
  const statsContainer = document.getElementById("heroStatsContainer");

  if (heroTag) {
    heroTag.innerHTML = `
      <span class="hero-tag-dot"></span>
      <span>${APP_STATE.hero.tagline}</span>
    `;
  }

  if (heroTitle) {
    heroTitle.innerHTML = `${APP_STATE.hero.titlePart1} <span>${APP_STATE.hero.titlePart2}</span>`;
  }

  if (heroLead) {
    heroLead.textContent = APP_STATE.hero.description;
  }

  if (statsContainer && APP_STATE.hero.stats) {
    statsContainer.innerHTML = APP_STATE.hero.stats.map(s => `
      <div class="stat-item">
        <span class="stat-number">${s.angka}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join("");
  }
}

function renderTentang() {
  const aboutTitle = document.getElementById("aboutTitleText");
  const aboutIntro = document.getElementById("aboutIntroText");
  const aboutSec = document.getElementById("aboutSecondaryText");
  const visiQuote = document.getElementById("visiQuoteText");
  const misiList = document.getElementById("misiListContainer");

  if (aboutTitle) aboutTitle.textContent = APP_STATE.tentang.judul;
  if (aboutIntro) aboutIntro.textContent = APP_STATE.tentang.ringkasan1;
  if (aboutSec) aboutSec.textContent = APP_STATE.tentang.ringkasan2;
  if (visiQuote) visiQuote.textContent = APP_STATE.tentang.visi;

  if (misiList && APP_STATE.tentang.misi) {
    misiList.innerHTML = APP_STATE.tentang.misi.map((m, idx) => `
      <li>
        <span class="misi-list-num">${idx + 1}</span>
        <span>${m}</span>
      </li>
    `).join("");
  }
}

function renderKegiatan(kategoriFilter = "Semua") {
  const container = document.getElementById("kegiatanGrid");
  if (!container) return;

  const data = APP_STATE.kegiatan || [];
  const filtered = (kategoriFilter === "Semua")
    ? data
    : data.filter(k => k.kategori.toLowerCase() === kategoriFilter.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>Belum ada kegiatan untuk kategori "<strong>${kategoriFilter}</strong>".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="card kegiatan-card">
      <div class="kegiatan-thumb">
        <img src="${item.gambar || '/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg'}" alt="${item.nama}" loading="lazy" />
        <span class="kegiatan-category">${item.kategori}</span>
      </div>
      <div class="kegiatan-body">
        <div class="kegiatan-meta">
          <span>📅 ${item.tanggal}</span>
          <span>·</span>
          <span>📍 ${item.lokasi}</span>
        </div>
        <h3 class="kegiatan-name">${item.nama}</h3>
        <p class="kegiatan-desc">${item.deskripsi}</p>
        <div>
          <button class="btn btn-outline btn-sm" onclick="bukaDetailKegiatan(${item.id})">
            Lihat Detail
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

window.filterKegiatanBy = function(kategori, btnEl) {
  const buttons = document.querySelectorAll("#filterKegiatanContainer .filter-btn");
  buttons.forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderKegiatan(kategori);
};

let currentGalleryIndex = 0;
let activeGalleryList = [];

function renderGaleri(kategoriFilter = "Semua") {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  const data = APP_STATE.galeri || [];
  activeGalleryList = (kategoriFilter === "Semua")
    ? data
    : data.filter(g => g.kategori.toLowerCase() === kategoriFilter.toLowerCase());

  if (activeGalleryList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>Tidak ada foto untuk kategori ini.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = activeGalleryList.map((foto, index) => `
    <div class="gallery-item" onclick="openLightbox(${index})">
      <img src="${foto.gambar || '/src/assets/images/hero_perseba_bawean_1790430721713.jpg'}" alt="${foto.judul}" loading="lazy" />
      <div class="gallery-overlay">
        <span class="gallery-item-cat">${foto.kategori}</span>
        <h4 class="gallery-item-title">${foto.judul}</h4>
      </div>
    </div>
  `).join("");
}

window.filterGaleriBy = function(kategori, btnEl) {
  const buttons = document.querySelectorAll("#filterGaleriContainer .filter-btn");
  buttons.forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderGaleri(kategori);
};

function renderBerita(searchQuery = "") {
  const container = document.getElementById("newsListContainer");
  if (!container) return;

  const data = APP_STATE.berita || [];
  const filtered = data.filter(item => {
    const q = searchQuery.toLowerCase();
    return item.judul.toLowerCase().includes(q) ||
           item.ringkasan.toLowerCase().includes(q) ||
           item.kategori.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 2rem; text-align: center; color: var(--text-muted);">
        <p>Tidak ditemukan informasi yang cocok dengan kata kunci "<strong>${searchQuery}</strong>".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="card news-card">
      <div class="news-badge">${item.kategori} · ${item.tanggal}</div>
      <h3 class="news-title">${item.judul}</h3>
      <p class="news-summary">${item.ringkasan}</p>
      <div>
        <button class="btn btn-outline btn-sm" onclick="bukaDetailBerita(${item.id})">
          Baca Selengkapnya
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </article>
  `).join("");
}

function renderAgenda() {
  const container = document.getElementById("agendaListContainer");
  if (!container) return;

  const data = APP_STATE.agenda || [];
  if (data.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Belum ada agenda terdekat yang dijadwalkan.</p>`;
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="agenda-item">
      <div class="agenda-date-box">
        <span class="agenda-day">${item.hari}</span>
        <span class="agenda-month">${item.bulan}</span>
      </div>
      <div class="agenda-details">
        <h4 class="agenda-event-name">${item.nama}</h4>
        <div class="agenda-meta">
          <span>📍 ${item.lokasi}</span>
          <span>⏰ ${item.waktu}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderStruktur() {
  const container = document.getElementById("orgHierarchyContainer");
  if (!container) return;

  const data = APP_STATE.struktur || [];
  if (data.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Belum ada data pengurus.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="org-row">
      ${data.map(item => `
        <div class="org-card">
          <div class="org-avatar">
            ${item.foto 
              ? `<img src="${item.foto}" alt="${item.nama}" />` 
              : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
          </div>
          <span class="org-role">${item.peran}</span>
          <h4 class="org-name">${item.nama}</h4>
          <span class="org-note">${item.catatan || ''}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProker() {
  const container = document.getElementById("prokerGridContainer");
  if (!container) return;

  const data = APP_STATE.proker || [];
  if (data.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Belum ada program kerja yang ditambahkan.</p>`;
    return;
  }

  container.innerHTML = data.map((item, idx) => {
    let statusClass = "status-aktif";
    if (item.status === "Selesai") statusClass = "status-selesai";
    if (item.status === "Akan Datang") statusClass = "status-datang";

    const poinList = Array.isArray(item.poin) ? item.poin : [];

    return `
      <div class="proker-card">
        <div class="proker-header">
          <div class="proker-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
          </div>
          <span class="status-badge ${statusClass}">${item.status}</span>
        </div>
        <h3 class="proker-title">${item.bidang}</h3>
        <p class="proker-desc">${item.deskripsi}</p>
        <ul class="proker-items">
          ${poinList.map(p => `<li>${p}</li>`).join("")}
        </ul>
      </div>
    `;
  }).join("");
}

function renderKontak() {
  const orgTitle = document.getElementById("kontakOrgTitle");
  const addressText = document.getElementById("kontakAddressText");
  const waLink = document.getElementById("kontakWaLink");
  const igLink = document.getElementById("kontakIgLink");
  const fbLink = document.getElementById("kontakFbLink");
  const ytLink = document.getElementById("kontakYtLink");
  const emailLink = document.getElementById("kontakEmailLink");
  const mapIframe = document.getElementById("kontakMapIframe");

  const k = APP_STATE.kontak;
  if (orgTitle && k.namaOrganisasi) orgTitle.textContent = k.namaOrganisasi;
  if (addressText && k.alamat) {
    addressText.innerHTML = `<p>${k.alamat}</p>`;
  }
  if (waLink && k.whatsapp) {
    waLink.href = `https://wa.me/${k.whatsapp}`;
  }
  if (igLink && k.instagram) igLink.href = k.instagram;
  if (fbLink && k.facebook) fbLink.href = k.facebook;
  if (ytLink && k.youtube) ytLink.href = k.youtube;
  if (emailLink && k.email) emailLink.href = `mailto:${k.email}`;
  if (mapIframe && k.mapsEmbed) mapIframe.src = k.mapsEmbed;
}

// ==========================================
// 5. NAVIGASI, MOBILE MENU & SMOOTH SCROLL
// ==========================================
function initNavbar() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const desktopLinks = document.querySelectorAll(".nav-link");

  function openMenu() {
    mobileDrawer.classList.add("is-active");
    mobileNavOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileDrawer.classList.remove("is-active");
    mobileNavOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeMenu);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 120;
    const sections = document.querySelectorAll("section[id]");

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
        mobileLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  });
}

// ==========================================
// 6. DARK MODE TOGGLE
// ==========================================
function initDarkMode() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem("perseba_theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("perseba_theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });

  function updateThemeIcon(isDark) {
    toggleBtn.innerHTML = isDark
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  }
}

// ==========================================
// 7. LIGHTBOX & MODAL DETAIL
// ==========================================
function initLightbox() {
  const lightbox = document.getElementById("lightboxModal");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!lightbox) return;

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => navigateLightbox(-1));
  nextBtn?.addEventListener("click", () => navigateLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

window.openLightbox = function(index) {
  const lightbox = document.getElementById("lightboxModal");
  const imgEl = document.getElementById("lightboxImg");
  const captionEl = document.getElementById("lightboxCaption");
  if (!lightbox || !imgEl || !captionEl) return;

  currentGalleryIndex = index;
  const item = activeGalleryList[currentGalleryIndex];
  if (!item) return;

  imgEl.src = item.gambar;
  captionEl.textContent = `${item.judul} (${item.kategori})`;
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

function closeLightbox() {
  const lightbox = document.getElementById("lightboxModal");
  if (lightbox) {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}

function navigateLightbox(direction) {
  currentGalleryIndex += direction;
  if (currentGalleryIndex < 0) currentGalleryIndex = activeGalleryList.length - 1;
  if (currentGalleryIndex >= activeGalleryList.length) currentGalleryIndex = 0;

  const item = activeGalleryList[currentGalleryIndex];
  const imgEl = document.getElementById("lightboxImg");
  const captionEl = document.getElementById("lightboxCaption");

  if (item && imgEl && captionEl) {
    imgEl.src = item.gambar;
    captionEl.textContent = `${item.judul} (${item.kategori})`;
  }
}

function initModals() {
  const modal = document.getElementById("detailModal");
  const closeBtn = document.getElementById("detailModalClose");
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }
}

window.bukaDetailKegiatan = function(id) {
  const item = APP_STATE.kegiatan.find(k => k.id === id);
  if (!item) return;

  const modal = document.getElementById("detailModal");
  const title = document.getElementById("detailModalTitle");
  const body = document.getElementById("detailModalBody");

  title.textContent = item.nama;
  body.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <img src="${item.gambar}" alt="${item.nama}" style="border-radius: var(--radius-md); width: 100%; max-height: 280px; object-fit: cover;" />
    </div>
    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
      <span>📅 ${item.tanggal}</span>
      <span>📍 ${item.lokasi}</span>
      <span>🏷️ ${item.kategori}</span>
    </div>
    <p style="font-size: 1rem; line-height: 1.7; color: var(--text-main); margin-bottom: 1.25rem;">
      ${item.detailLengkap || item.deskripsi}
    </p>
    <a href="#kontak" onclick="tutupDetailModal()" class="btn btn-primary btn-sm" style="display: inline-flex;">
      Hubungi Panitia / Pengurus
    </a>
  `;

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.bukaDetailBerita = function(id) {
  const item = APP_STATE.berita.find(b => b.id === id);
  if (!item) return;

  const modal = document.getElementById("detailModal");
  const title = document.getElementById("detailModalTitle");
  const body = document.getElementById("detailModalBody");

  title.textContent = item.judul;
  body.innerHTML = `
    <div style="font-size: 0.85rem; color: var(--accent); font-weight: 700; margin-bottom: 0.75rem;">
      ${item.kategori} · ${item.tanggal}
    </div>
    <p style="font-size: 1rem; line-height: 1.8; color: var(--text-main); margin-bottom: 1.5rem;">
      ${item.kontenLengkap || item.ringkasan}
    </p>
    <button onclick="tutupDetailModal()" class="btn btn-outline btn-sm">
      Tutup
    </button>
  `;

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

window.tutupDetailModal = function() {
  const modal = document.getElementById("detailModal");
  if (modal) {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
};

function initSearch() {
  const searchInput = document.getElementById("infoSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    renderBerita(e.target.value.trim());
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("formNama").value.trim();
    const telp = document.getElementById("formTelp").value.trim();
    const pesan = document.getElementById("formPesan").value.trim();

    if (!nama || !pesan) {
      tampilkanToast("Mohon lengkapi nama dan pesan Anda!");
      return;
    }

    // 1. Simpan langsung ke Google Spreadsheet aktif via Google Sheets API
    const activeSheetId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
    if (activeSheetId) {
      appendContactMessageToSheet(activeSheetId, { nama, telp, pesan })
        .then(() => {
          console.log("Pesan berhasil ditulis langsung ke tab Pesan_Kontak Google Sheets!");
        })
        .catch(err => {
          console.warn("Sheets API direct write notice:", err);
        });
    }

    // 2. Jika integrasi Google Apps Script juga aktif, kirim salinan cadangan
    const gasUrl = APP_STATE.integrasi && APP_STATE.integrasi.appScriptUrl;
    const isAutoSync = APP_STATE.integrasi && APP_STATE.integrasi.autoSyncContactForm !== false;
    
    if (gasUrl && isAutoSync) {
      try {
        fetch(gasUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "contact_form",
            nama: nama,
            telp: telp,
            pesan: pesan
          })
        }).catch(err => console.log("Google Apps Script sync log:", err));
      } catch (err) {
        console.log("GAS fetch err:", err);
      }
    }

    const noWaAdmin = APP_STATE.kontak.whatsapp || "6281234567890";
    const textWa = `Halo Pengurus PERSEBA Baratsawah, perkenalkan saya ${nama} (${telp || '-'}). Pesan: ${pesan}`;
    const urlWa = `https://wa.me/${noWaAdmin}?text=${encodeURIComponent(textWa)}`;

    tampilkanToast("✅ Pesan Anda dicatat & diteruskan ke WhatsApp Pengurus...");
    form.reset();

    setTimeout(() => {
      window.open(urlWa, "_blank");
    }, 800);
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function tampilkanToast(pesan) {
  let toast = document.getElementById("toastNotice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = pesan;
  toast.classList.add("is-active");

  setTimeout(() => {
    toast.classList.remove("is-active");
  }, 3500);
}

// ==========================================================================
// 8. APLIKASI PENGELOLA KONTEN (ADMIN CMS STUDIO) DENGAN KATA SANDI
// ==========================================================================
const ADMIN_PASSWORD_HASH = "@perseba";

function isAdminAuthenticated() {
  return sessionStorage.getItem("perseba_admin_auth") === "true";
}

function handleOpenAdminRequest() {
  if (isAdminAuthenticated()) {
    openAdminCmsStudio();
  } else {
    bukaAdminAuthModal();
  }
}

function bukaAdminAuthModal() {
  const authModal = document.getElementById("adminAuthModal");
  const passInput = document.getElementById("adminAuthPassword");
  const errEl = document.getElementById("authErrorMessage");

  if (errEl) {
    errEl.style.display = "none";
    errEl.textContent = "";
  }
  if (passInput) {
    passInput.value = "";
  }
  if (authModal) {
    authModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => passInput?.focus(), 150);
  }
}

window.tutupAdminAuthModal = function() {
  const authModal = document.getElementById("adminAuthModal");
  if (authModal) {
    authModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
};

window.verifyAdminPassword = function() {
  const passInput = document.getElementById("adminAuthPassword");
  const errEl = document.getElementById("authErrorMessage");
  const val = passInput ? passInput.value.trim() : "";

  if (val === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem("perseba_admin_auth", "true");
    tutupAdminAuthModal();
    openAdminCmsStudio();
    tampilkanToast("🔓 Akses Pengurus Diterima. Selamat datang di Panel CMS!");
  } else {
    if (errEl) {
      errEl.textContent = "Kata sandi salah! Silakan periksa kembali.";
      errEl.style.display = "block";
    }
    if (passInput) {
      passInput.focus();
      passInput.select();
    }
  }
};

window.toggleAuthPasswordVisibility = function() {
  const passInput = document.getElementById("adminAuthPassword");
  const eyeIconSvg = document.getElementById("eyeIconSvg");
  if (!passInput) return;

  if (passInput.type === "password") {
    passInput.type = "text";
    if (eyeIconSvg) {
      eyeIconSvg.innerHTML = `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>`;
    }
  } else {
    passInput.type = "password";
    if (eyeIconSvg) {
      eyeIconSvg.innerHTML = `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`;
    }
  }
};

window.logoutAdmin = function() {
  sessionStorage.removeItem("perseba_admin_auth");
  closeAdminCmsStudio();
  tampilkanToast("🔒 Mode pengelola berhasil dikunci.");
};

function openAdminCmsStudio() {
  const adminModal = document.getElementById("adminCmsModal");
  if (!adminModal) return;
  populateAdminForms();
  renderAllAdminLists();
  adminModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeAdminCmsStudio() {
  const adminModal = document.getElementById("adminCmsModal");
  if (adminModal) {
    adminModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}

function initAdminCms() {
  const openBtn = document.getElementById("openAdminBtn");
  const mobileOpenBtn = document.getElementById("mobileOpenAdminBtn");
  const floatingBtn = document.getElementById("floatingAdminBtn");
  const closeBtn = document.getElementById("closeAdminModalBtn");
  const saveLiveBtn = document.getElementById("adminSaveLiveBtn");

  if (openBtn) openBtn.addEventListener("click", handleOpenAdminRequest);
  if (mobileOpenBtn) mobileOpenBtn.addEventListener("click", handleOpenAdminRequest);
  if (floatingBtn) floatingBtn.addEventListener("click", handleOpenAdminRequest);
  if (closeBtn) closeBtn.addEventListener("click", closeAdminCmsStudio);

  if (saveLiveBtn) {
    saveLiveBtn.addEventListener("click", () => {
      eksekusiDanSegarkan();
    });
  }

  // Admin Tab Navigation
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".admin-tab-pane").forEach(pane => {
        pane.classList.remove("active");
      });

      const activePane = document.getElementById(tabTarget);
      if (activePane) activePane.classList.add("active");
    });
  });
}

function populateAdminForms() {
  // Beranda
  const hero = APP_STATE.hero;
  if (document.getElementById("adminHeroTagline")) document.getElementById("adminHeroTagline").value = hero.tagline || "";
  if (document.getElementById("adminHeroTitle1")) document.getElementById("adminHeroTitle1").value = hero.titlePart1 || "";
  if (document.getElementById("adminHeroTitle2")) document.getElementById("adminHeroTitle2").value = hero.titlePart2 || "";
  if (document.getElementById("adminHeroDesc")) document.getElementById("adminHeroDesc").value = hero.description || "";

  if (hero.stats && hero.stats.length >= 4) {
    if (document.getElementById("adminStat1")) document.getElementById("adminStat1").value = hero.stats[0].angka;
    if (document.getElementById("adminStat2")) document.getElementById("adminStat2").value = hero.stats[1].angka;
    if (document.getElementById("adminStat3")) document.getElementById("adminStat3").value = hero.stats[2].angka;
    if (document.getElementById("adminStat4")) document.getElementById("adminStat4").value = hero.stats[3].angka;
  }

  // Profil
  const profil = APP_STATE.tentang;
  if (document.getElementById("adminProfilJudul")) document.getElementById("adminProfilJudul").value = profil.judul || "";
  if (document.getElementById("adminProfilRingkasan1")) document.getElementById("adminProfilRingkasan1").value = profil.ringkasan1 || "";
  if (document.getElementById("adminProfilRingkasan2")) document.getElementById("adminProfilRingkasan2").value = profil.ringkasan2 || "";
  if (document.getElementById("adminProfilVisi")) document.getElementById("adminProfilVisi").value = profil.visi || "";
  if (document.getElementById("adminProfilMisi")) document.getElementById("adminProfilMisi").value = (profil.misi || []).join("\n");

  // Kontak
  const kontak = APP_STATE.kontak;
  if (document.getElementById("adminKontakNama")) document.getElementById("adminKontakNama").value = kontak.namaOrganisasi || "";
  if (document.getElementById("adminKontakAlamat")) document.getElementById("adminKontakAlamat").value = kontak.alamat || "";
  if (document.getElementById("adminKontakWa")) document.getElementById("adminKontakWa").value = kontak.whatsapp || "";
  if (document.getElementById("adminKontakEmail")) document.getElementById("adminKontakEmail").value = kontak.email || "";
  if (document.getElementById("adminKontakIg")) document.getElementById("adminKontakIg").value = kontak.instagram || "";
  if (document.getElementById("adminKontakFb")) document.getElementById("adminKontakFb").value = kontak.facebook || "";
  if (document.getElementById("adminKontakYt")) document.getElementById("adminKontakYt").value = kontak.youtube || "";
  if (document.getElementById("adminKontakMaps")) document.getElementById("adminKontakMaps").value = kontak.mapsEmbed || "";

  // Integrasi Google Apps Script
  const integrasi = APP_STATE.integrasi || {};
  const inputUrl = document.getElementById("inputAppsScriptUrl");
  const checkAutoSync = document.getElementById("checkAutoSyncContact");
  if (inputUrl) inputUrl.value = integrasi.appScriptUrl || "";
  if (checkAutoSync) checkAutoSync.checked = integrasi.autoSyncContactForm !== false;
  updateGasStatusUI();
  updateActiveSheetUI();
  if (APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId) {
    handleSegarkanPesanSheets(false);
  }
}

function renderAllAdminLists() {
  renderAdminKegiatanList();
  renderAdminGaleriList();
  renderAdminBeritaList();
  renderAdminAgendaList();
  renderAdminStrukturList();
  renderAdminProkerList();
}

// ----------------------------------------------------
// SAVE HANDLERS FOR FIXED FORMS
// ----------------------------------------------------
window.simpanTabBeranda = function() {
  APP_STATE.hero.tagline = document.getElementById("adminHeroTagline").value.trim();
  APP_STATE.hero.titlePart1 = document.getElementById("adminHeroTitle1").value.trim();
  APP_STATE.hero.titlePart2 = document.getElementById("adminHeroTitle2").value.trim();
  APP_STATE.hero.description = document.getElementById("adminHeroDesc").value.trim();

  APP_STATE.hero.stats = [
    { id: "stat_1", angka: document.getElementById("adminStat1").value.trim(), label: "Jumlah Anggota" },
    { id: "stat_2", angka: document.getElementById("adminStat2").value.trim(), label: "Jumlah Kegiatan" },
    { id: "stat_3", angka: document.getElementById("adminStat3").value.trim(), label: "Program Aktif" },
    { id: "stat_4", angka: document.getElementById("adminStat4").value.trim(), label: "Guyub & Rukun" }
  ];

  saveState(true, "✅ Teks Beranda & Statistik berhasil diperbarui!");
};

window.simpanTabProfil = function() {
  APP_STATE.tentang.judul = document.getElementById("adminProfilJudul").value.trim();
  APP_STATE.tentang.ringkasan1 = document.getElementById("adminProfilRingkasan1").value.trim();
  APP_STATE.tentang.ringkasan2 = document.getElementById("adminProfilRingkasan2").value.trim();
  APP_STATE.tentang.visi = document.getElementById("adminProfilVisi").value.trim();

  const misiText = document.getElementById("adminProfilMisi").value.trim();
  APP_STATE.tentang.misi = misiText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  saveState(true, "✅ Profil, Visi & Misi berhasil diperbarui!");
};

window.simpanTabKontak = function() {
  APP_STATE.kontak.namaOrganisasi = document.getElementById("adminKontakNama").value.trim();
  APP_STATE.kontak.alamat = document.getElementById("adminKontakAlamat").value.trim();
  APP_STATE.kontak.whatsapp = document.getElementById("adminKontakWa").value.trim().replace(/[^0-9]/g, '');
  APP_STATE.kontak.email = document.getElementById("adminKontakEmail").value.trim();
  APP_STATE.kontak.instagram = document.getElementById("adminKontakIg").value.trim();
  APP_STATE.kontak.facebook = document.getElementById("adminKontakFb").value.trim();
  APP_STATE.kontak.youtube = document.getElementById("adminKontakYt").value.trim();
  APP_STATE.kontak.mapsEmbed = document.getElementById("adminKontakMaps").value.trim();

  saveState(true, "✅ Kontak & Media Sosial berhasil diperbarui!");
};

// ----------------------------------------------------
// RENDER ADMIN LISTS
// ----------------------------------------------------
function renderAdminKegiatanList() {
  const container = document.getElementById("adminKegiatanList");
  if (!container) return;

  const list = APP_STATE.kegiatan || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada kegiatan. Klik tombol Tambah di atas.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <img src="${item.gambar}" alt="${item.nama}" class="admin-item-thumb" />
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.nama}</span>
          <div class="admin-item-meta">
            <span>🏷️ ${item.kategori}</span>
            <span>📅 ${item.tanggal}</span>
            <span>📍 ${item.lokasi}</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditKegiatan(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('kegiatan', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function renderAdminGaleriList() {
  const container = document.getElementById("adminGaleriList");
  if (!container) return;

  const list = APP_STATE.galeri || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada foto galeri.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <img src="${item.gambar}" alt="${item.judul}" class="admin-item-thumb" />
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.judul}</span>
          <div class="admin-item-meta">
            <span>🏷️ ${item.kategori}</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditGaleri(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('galeri', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function renderAdminBeritaList() {
  const container = document.getElementById("adminBeritaList");
  if (!container) return;

  const list = APP_STATE.berita || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada berita / pengumuman.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.judul}</span>
          <div class="admin-item-meta">
            <span>🏷️ ${item.kategori}</span>
            <span>📅 ${item.tanggal}</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditBerita(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('berita', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function renderAdminAgendaList() {
  const container = document.getElementById("adminAgendaList");
  if (!container) return;

  const list = APP_STATE.agenda || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada agenda terdekat.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <div class="agenda-date-box" style="width: 2.75rem; height: 3rem;">
          <span style="font-size: 1.1rem; line-height: 1;">${item.hari}</span>
          <span style="font-size: 0.65rem;">${item.bulan}</span>
        </div>
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.nama}</span>
          <div class="admin-item-meta">
            <span>📍 ${item.lokasi}</span>
            <span>⏰ ${item.waktu}</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditAgenda(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('agenda', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function renderAdminStrukturList() {
  const container = document.getElementById("adminStrukturList");
  if (!container) return;

  const list = APP_STATE.struktur || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada susunan pengurus.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        ${item.foto 
          ? `<img src="${item.foto}" alt="${item.nama}" class="admin-item-thumb" style="border-radius: 50%;" />`
          : `<div class="admin-item-thumb admin-item-thumb-placeholder" style="border-radius: 50%;">👤</div>`}
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.nama}</span>
          <div class="admin-item-meta">
            <span style="color: var(--primary); font-weight: 700;">${item.peran}</span>
            <span>${item.catatan || ''}</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditPengurus(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('struktur', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function renderAdminProkerList() {
  const container = document.getElementById("adminProkerList");
  if (!container) return;

  const list = APP_STATE.proker || [];
  if (list.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Belum ada program kerja.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="admin-item-card">
      <div class="admin-item-info">
        <div class="admin-item-titles">
          <span class="admin-item-name">${item.bidang}</span>
          <div class="admin-item-meta">
            <span class="status-badge ${item.status === 'Selesai' ? 'status-selesai' : (item.status === 'Akan Datang' ? 'status-datang' : 'status-aktif')}">${item.status}</span>
            <span>${item.deskripsi.substring(0, 60)}...</span>
          </div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-sm btn-edit-outline" onclick="bukaModalEditProker(${item.id})">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger-outline" onclick="hapusItem('proker', ${item.id})">
          🗑️ Hapus
        </button>
      </div>
    </div>
  `).join("");
}

// ----------------------------------------------------
// DYNAMIC SUBMODAL CRUD CONTROLLER
// ----------------------------------------------------
let activeSubmodalType = null;
let activeSubmodalId = null;

function bukaAdminSubmodal(title, htmlContent, type, id = null) {
  const submodal = document.getElementById("adminSubmodal");
  const submodalTitle = document.getElementById("submodalTitle");
  const submodalBody = document.getElementById("adminSubmodalBody");

  activeSubmodalType = type;
  activeSubmodalId = id;

  submodalTitle.textContent = title;
  submodalBody.innerHTML = htmlContent;
  submodal.classList.add("is-open");
}

window.tutupAdminSubmodal = function() {
  const submodal = document.getElementById("adminSubmodal");
  if (submodal) {
    submodal.classList.remove("is-open");
  }
  activeSubmodalType = null;
  activeSubmodalId = null;
};

// Helper upload gambar ke Base64
window.handleImageUpload = function(inputEl, targetInputId, previewImgId) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const targetInput = document.getElementById(targetInputId);
    const previewImg = document.getElementById(previewImgId);

    if (targetInput) targetInput.value = dataUrl;
    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.style.display = "block";
    }
  };
  reader.readAsDataURL(file);
};

// 1. Kegiatan CRUD
window.bukaModalTambahKegiatan = function() {
  bukaAdminSubmodal("Tambah Kegiatan Baru", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Kegiatan *</label>
        <input type="text" id="subKegiatanNama" class="admin-input" required placeholder="Contoh: Senam Sehat Bersama Warga" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Kategori *</label>
          <select id="subKegiatanKategori" class="admin-select" required>
            <option value="Keagamaan">Keagamaan</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Bakti Sosial">Bakti Sosial</option>
            <option value="Gotong Royong">Gotong Royong</option>
            <option value="Kemerdekaan">Kemerdekaan</option>
            <option value="Silaturahmi">Silaturahmi</option>
            <option value="Kepemudaan">Kepemudaan</option>
            <option value="Event Kampung">Event Kampung</option>
          </select>
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Pelaksanaan *</label>
          <input type="text" id="subKegiatanTanggal" class="admin-input" required placeholder="Contoh: 15 November 2026" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Lokasi Kegiatan *</label>
        <input type="text" id="subKegiatanLokasi" class="admin-input" required placeholder="Contoh: Dusun Baratsawah" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Foto / Gambar Kegiatan</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subKegiatanGambar" class="admin-input" placeholder="Tautan URL gambar atau pilih berkas di bawah..." value="/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg" />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subKegiatanGambar', 'subKegiatanPreview')" />
          <img id="subKegiatanPreview" src="/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg" class="admin-preview-img" alt="Pratinjau" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Deskripsi Singkat *</label>
        <textarea id="subKegiatanDesc" class="admin-textarea" required placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."></textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Detail Lengkap Kegiatan</label>
        <textarea id="subKegiatanDetail" class="admin-textarea" placeholder="Uraian lengkap untuk jendela modal rincian..."></textarea>
      </div>
    </div>
  `, "kegiatan", null);
};

window.bukaModalEditKegiatan = function(id) {
  const item = APP_STATE.kegiatan.find(k => k.id === id);
  if (!item) return;

  bukaAdminSubmodal("Edit Kegiatan", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Kegiatan *</label>
        <input type="text" id="subKegiatanNama" class="admin-input" required value="${item.nama}" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Kategori *</label>
          <select id="subKegiatanKategori" class="admin-select" required>
            ${["Keagamaan", "Olahraga", "Bakti Sosial", "Gotong Royong", "Kemerdekaan", "Silaturahmi", "Kepemudaan", "Event Kampung"].map(cat => `
              <option value="${cat}" ${item.kategori === cat ? 'selected' : ''}>${cat}</option>
            `).join("")}
          </select>
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Pelaksanaan *</label>
          <input type="text" id="subKegiatanTanggal" class="admin-input" required value="${item.tanggal}" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Lokasi Kegiatan *</label>
        <input type="text" id="subKegiatanLokasi" class="admin-input" required value="${item.lokasi}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Foto / Gambar Kegiatan</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subKegiatanGambar" class="admin-input" value="${item.gambar}" />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subKegiatanGambar', 'subKegiatanPreview')" />
          <img id="subKegiatanPreview" src="${item.gambar}" class="admin-preview-img" alt="Pratinjau" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Deskripsi Singkat *</label>
        <textarea id="subKegiatanDesc" class="admin-textarea" required>${item.deskripsi}</textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Detail Lengkap Kegiatan</label>
        <textarea id="subKegiatanDetail" class="admin-textarea">${item.detailLengkap || item.deskripsi}</textarea>
      </div>
    </div>
  `, "kegiatan", id);
};

// 2. Galeri CRUD
window.bukaModalTambahGaleri = function() {
  bukaAdminSubmodal("Tambah Foto Galeri Baru", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Judul Foto *</label>
        <input type="text" id="subGaleriJudul" class="admin-input" required placeholder="Contoh: Kerja Bakti Pemuda di Balai" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Kategori Foto *</label>
        <select id="subGaleriKategori" class="admin-select" required>
          <option value="Kegiatan Remaja">Kegiatan Remaja</option>
          <option value="Olahraga">Olahraga</option>
          <option value="Keagamaan">Keagamaan</option>
          <option value="Sosial">Sosial</option>
          <option value="Gotong Royong">Gotong Royong</option>
          <option value="Acara Kampung">Acara Kampung</option>
        </select>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Berkas / URL Foto</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subGaleriGambar" class="admin-input" placeholder="Tautan URL gambar atau unggah dari perangkat..." value="/src/assets/images/hero_perseba_bawean_1790430721713.jpg" />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subGaleriGambar', 'subGaleriPreview')" />
          <img id="subGaleriPreview" src="/src/assets/images/hero_perseba_bawean_1790430721713.jpg" class="admin-preview-img" alt="Pratinjau" />
        </div>
      </div>
    </div>
  `, "galeri", null);
};

window.bukaModalEditGaleri = function(id) {
  const item = APP_STATE.galeri.find(g => g.id === id);
  if (!item) return;

  bukaAdminSubmodal("Edit Foto Galeri", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Judul Foto *</label>
        <input type="text" id="subGaleriJudul" class="admin-input" required value="${item.judul}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Kategori Foto *</label>
        <select id="subGaleriKategori" class="admin-select" required>
          ${["Kegiatan Remaja", "Olahraga", "Keagamaan", "Sosial", "Gotong Royong", "Acara Kampung"].map(cat => `
            <option value="${cat}" ${item.kategori === cat ? 'selected' : ''}>${cat}</option>
          `).join("")}
        </select>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Berkas / URL Foto</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subGaleriGambar" class="admin-input" value="${item.gambar}" />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subGaleriGambar', 'subGaleriPreview')" />
          <img id="subGaleriPreview" src="${item.gambar}" class="admin-preview-img" alt="Pratinjau" />
        </div>
      </div>
    </div>
  `, "galeri", id);
};

// 3. Berita & Informasi CRUD
window.bukaModalTambahBerita = function() {
  bukaAdminSubmodal("Tambah Informasi / Berita Baru", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Judul Informasi / Pengumuman *</label>
        <input type="text" id="subBeritaJudul" class="admin-input" required placeholder="Contoh: Jadwal Pembagian Bantuan Sembako" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Kategori *</label>
          <select id="subBeritaKategori" class="admin-select" required>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Agenda Terdekat">Agenda Terdekat</option>
            <option value="Berita Kegiatan">Berita Kegiatan</option>
            <option value="Informasi Remaja">Informasi Remaja</option>
          </select>
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Rilis *</label>
          <input type="text" id="subBeritaTanggal" class="admin-input" required placeholder="Contoh: 26 September 2026" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Ringkasan Singkat *</label>
        <textarea id="subBeritaRingkasan" class="admin-textarea" required placeholder="Ringkasan untuk kartu berita depan..."></textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Isi Konten Lengkap</label>
        <textarea id="subBeritaKonten" class="admin-textarea" placeholder="Isi pesan lengkap saat diklik Baca Selengkapnya..."></textarea>
      </div>
    </div>
  `, "berita", null);
};

window.bukaModalEditBerita = function(id) {
  const item = APP_STATE.berita.find(b => b.id === id);
  if (!item) return;

  bukaAdminSubmodal("Edit Informasi", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Judul Informasi / Pengumuman *</label>
        <input type="text" id="subBeritaJudul" class="admin-input" required value="${item.judul}" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Kategori *</label>
          <select id="subBeritaKategori" class="admin-select" required>
            ${["Pengumuman", "Agenda Terdekat", "Berita Kegiatan", "Informasi Remaja"].map(cat => `
              <option value="${cat}" ${item.kategori === cat ? 'selected' : ''}>${cat}</option>
            `).join("")}
          </select>
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Rilis *</label>
          <input type="text" id="subBeritaTanggal" class="admin-input" required value="${item.tanggal}" />
        </div>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Ringkasan Singkat *</label>
        <textarea id="subBeritaRingkasan" class="admin-textarea" required>${item.ringkasan}</textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Isi Konten Lengkap</label>
        <textarea id="subBeritaKonten" class="admin-textarea">${item.kontenLengkap || item.ringkasan}</textarea>
      </div>
    </div>
  `, "berita", id);
};

// 4. Agenda CRUD
window.bukaModalTambahAgenda = function() {
  bukaAdminSubmodal("Tambah Agenda Terdekat", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Agenda / Kegiatan *</label>
        <input type="text" id="subAgendaNama" class="admin-input" required placeholder="Contoh: Rapat Koordinasi HUT RI" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Hari (Angka) *</label>
          <input type="text" id="subAgendaHari" class="admin-input" required placeholder="Contoh: 14" />
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Bulan (Singkatan) *</label>
          <input type="text" id="subAgendaBulan" class="admin-input" required placeholder="Contoh: Nov / Des" />
        </div>
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Lokasi *</label>
          <input type="text" id="subAgendaLokasi" class="admin-input" required placeholder="Contoh: Balai Pertemuan" />
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Waktu / Jam *</label>
          <input type="text" id="subAgendaWaktu" class="admin-input" required placeholder="Contoh: 19.30 WIB - Selesai" />
        </div>
      </div>
    </div>
  `, "agenda", null);
};

window.bukaModalEditAgenda = function(id) {
  const item = APP_STATE.agenda.find(a => a.id === id);
  if (!item) return;

  bukaAdminSubmodal("Edit Agenda Terdekat", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Agenda / Kegiatan *</label>
        <input type="text" id="subAgendaNama" class="admin-input" required value="${item.nama}" />
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Tanggal Hari (Angka) *</label>
          <input type="text" id="subAgendaHari" class="admin-input" required value="${item.hari}" />
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Bulan (Singkatan) *</label>
          <input type="text" id="subAgendaBulan" class="admin-input" required value="${item.bulan}" />
        </div>
      </div>
      <div class="admin-form-grid admin-form-grid-2">
        <div class="admin-field-group">
          <label class="admin-label">Lokasi *</label>
          <input type="text" id="subAgendaLokasi" class="admin-input" required value="${item.lokasi}" />
        </div>
        <div class="admin-field-group">
          <label class="admin-label">Waktu / Jam *</label>
          <input type="text" id="subAgendaWaktu" class="admin-input" required value="${item.waktu}" />
        </div>
      </div>
    </div>
  `, "agenda", id);
};

// 5. Struktur Pengurus CRUD
window.bukaModalTambahPengurus = function() {
  bukaAdminSubmodal("Tambah Pengurus Baru", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Lengkap Pengurus *</label>
        <input type="text" id="subStrukturNama" class="admin-input" required placeholder="Contoh: Muhammad Ali" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Jabatan / Peran *</label>
        <input type="text" id="subStrukturPeran" class="admin-input" required placeholder="Contoh: Koord. Humas / Anggota" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Catatan / Masa Bakti</label>
        <input type="text" id="subStrukturCatatan" class="admin-input" placeholder="Contoh: Masa Bakti 2026 - 2028" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Foto Pengurus</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subStrukturFoto" class="admin-input" placeholder="Tautan URL foto atau unggah..." />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subStrukturFoto', 'subStrukturPreview')" />
          <img id="subStrukturPreview" src="" class="admin-preview-img" style="display:none; width: 100px; height: 100px; border-radius: 50%;" alt="Pratinjau Foto" />
        </div>
      </div>
    </div>
  `, "struktur", null);
};

window.bukaModalEditPengurus = function(id) {
  const item = APP_STATE.struktur.find(s => s.id === id);
  if (!item) return;

  bukaAdminSubmodal("Edit Data Pengurus", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Lengkap Pengurus *</label>
        <input type="text" id="subStrukturNama" class="admin-input" required value="${item.nama}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Jabatan / Peran *</label>
        <input type="text" id="subStrukturPeran" class="admin-input" required value="${item.peran}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Catatan / Masa Bakti</label>
        <input type="text" id="subStrukturCatatan" class="admin-input" value="${item.catatan || ''}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Foto Pengurus</label>
        <div class="admin-img-picker-box">
          <input type="text" id="subStrukturFoto" class="admin-input" value="${item.foto || ''}" />
          <input type="file" accept="image/*" onchange="handleImageUpload(this, 'subStrukturFoto', 'subStrukturPreview')" />
          <img id="subStrukturPreview" src="${item.foto || ''}" class="admin-preview-img" style="${item.foto ? '' : 'display:none;'} width: 100px; height: 100px; border-radius: 50%;" alt="Pratinjau Foto" />
        </div>
      </div>
    </div>
  `, "struktur", id);
};

// 6. Program Kerja CRUD
window.bukaModalTambahProker = function() {
  bukaAdminSubmodal("Tambah Program Kerja", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Bidang Program *</label>
        <input type="text" id="subProkerBidang" class="admin-input" required placeholder="Contoh: 7. Bidang Seni & Budaya" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Status Program *</label>
        <select id="subProkerStatus" class="admin-select" required>
          <option value="Aktif">Aktif</option>
          <option value="Selesai">Selesai</option>
          <option value="Akan Datang">Akan Datang</option>
        </select>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Deskripsi Program *</label>
        <textarea id="subProkerDesc" class="admin-textarea" required placeholder="Penjelasan tujuan bidang..."></textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Daftar Poin Kegiatan (Satu baris per poin)</label>
        <textarea id="subProkerPoin" class="admin-textarea" placeholder="Poin kegiatan 1\nPoin kegiatan 2"></textarea>
      </div>
    </div>
  `, "proker", null);
};

window.bukaModalEditProker = function(id) {
  const item = APP_STATE.proker.find(p => p.id === id);
  if (!item) return;

  const poinText = (item.poin || []).join("\n");

  bukaAdminSubmodal("Edit Program Kerja", `
    <div class="admin-form-grid">
      <div class="admin-field-group">
        <label class="admin-label">Nama Bidang Program *</label>
        <input type="text" id="subProkerBidang" class="admin-input" required value="${item.bidang}" />
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Status Program *</label>
        <select id="subProkerStatus" class="admin-select" required>
          ${["Aktif", "Selesai", "Akan Datang"].map(s => `
            <option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>
          `).join("")}
        </select>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Deskripsi Program *</label>
        <textarea id="subProkerDesc" class="admin-textarea" required>${item.deskripsi}</textarea>
      </div>
      <div class="admin-field-group">
        <label class="admin-label">Daftar Poin Kegiatan (Satu baris per poin)</label>
        <textarea id="subProkerPoin" class="admin-textarea">${poinText}</textarea>
      </div>
    </div>
  `, "proker", id);
};

// SUBMIT ADMIN SUBMODAL
window.submitAdminSubmodal = function() {
  if (!activeSubmodalType) return;

  if (activeSubmodalType === "kegiatan") {
    const nama = document.getElementById("subKegiatanNama").value.trim();
    const kategori = document.getElementById("subKegiatanKategori").value;
    const tanggal = document.getElementById("subKegiatanTanggal").value.trim();
    const lokasi = document.getElementById("subKegiatanLokasi").value.trim();
    const gambar = document.getElementById("subKegiatanGambar").value.trim() || "/src/assets/images/kegiatan_gotong_royong_1790430736799.jpg";
    const deskripsi = document.getElementById("subKegiatanDesc").value.trim();
    const detailLengkap = document.getElementById("subKegiatanDetail").value.trim();

    if (activeSubmodalId) {
      const idx = APP_STATE.kegiatan.findIndex(k => k.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.kegiatan[idx] = { ...APP_STATE.kegiatan[idx], nama, kategori, tanggal, lokasi, gambar, deskripsi, detailLengkap };
      }
    } else {
      const newId = Date.now();
      APP_STATE.kegiatan.unshift({ id: newId, nama, kategori, tanggal, lokasi, gambar, deskripsi, detailLengkap });
    }
    renderAdminKegiatanList();
    saveState(true, "✅ Data Kegiatan berhasil disimpan & dieksekusi!");
  } 
  else if (activeSubmodalType === "galeri") {
    const judul = document.getElementById("subGaleriJudul").value.trim();
    const kategori = document.getElementById("subGaleriKategori").value;
    const gambar = document.getElementById("subGaleriGambar").value.trim() || "/src/assets/images/hero_perseba_bawean_1790430721713.jpg";

    if (activeSubmodalId) {
      const idx = APP_STATE.galeri.findIndex(g => g.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.galeri[idx] = { ...APP_STATE.galeri[idx], judul, kategori, gambar };
      }
    } else {
      const newId = Date.now();
      APP_STATE.galeri.unshift({ id: newId, judul, kategori, gambar });
    }
    renderAdminGaleriList();
    saveState(true, "✅ Foto Galeri berhasil disimpan & dieksekusi!");
  }
  else if (activeSubmodalType === "berita") {
    const judul = document.getElementById("subBeritaJudul").value.trim();
    const kategori = document.getElementById("subBeritaKategori").value;
    const tanggal = document.getElementById("subBeritaTanggal").value.trim();
    const ringkasan = document.getElementById("subBeritaRingkasan").value.trim();
    const kontenLengkap = document.getElementById("subBeritaKonten").value.trim();

    if (activeSubmodalId) {
      const idx = APP_STATE.berita.findIndex(b => b.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.berita[idx] = { ...APP_STATE.berita[idx], judul, kategori, tanggal, ringkasan, kontenLengkap };
      }
    } else {
      const newId = Date.now();
      APP_STATE.berita.unshift({ id: newId, judul, kategori, tanggal, ringkasan, kontenLengkap });
    }
    renderAdminBeritaList();
    saveState(true, "✅ Berita / Pengumuman berhasil disimpan & dieksekusi!");
  }
  else if (activeSubmodalType === "agenda") {
    const nama = document.getElementById("subAgendaNama").value.trim();
    const hari = document.getElementById("subAgendaHari").value.trim();
    const bulan = document.getElementById("subAgendaBulan").value.trim();
    const lokasi = document.getElementById("subAgendaLokasi").value.trim();
    const waktu = document.getElementById("subAgendaWaktu").value.trim();

    if (activeSubmodalId) {
      const idx = APP_STATE.agenda.findIndex(a => a.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.agenda[idx] = { ...APP_STATE.agenda[idx], nama, hari, bulan, lokasi, waktu };
      }
    } else {
      const newId = Date.now();
      APP_STATE.agenda.push({ id: newId, nama, hari, bulan, lokasi, waktu });
    }
    renderAdminAgendaList();
    saveState(true, "✅ Agenda Terdekat berhasil disimpan & dieksekusi!");
  }
  else if (activeSubmodalType === "struktur") {
    const nama = document.getElementById("subStrukturNama").value.trim();
    const peran = document.getElementById("subStrukturPeran").value.trim();
    const catatan = document.getElementById("subStrukturCatatan").value.trim();
    const foto = document.getElementById("subStrukturFoto").value.trim();

    if (activeSubmodalId) {
      const idx = APP_STATE.struktur.findIndex(s => s.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.struktur[idx] = { ...APP_STATE.struktur[idx], nama, peran, catatan, foto };
      }
    } else {
      const newId = Date.now();
      APP_STATE.struktur.push({ id: newId, nama, peran, catatan, foto });
    }
    renderAdminStrukturList();
    saveState(true, "✅ Data Pengurus berhasil disimpan & dieksekusi!");
  }
  else if (activeSubmodalType === "proker") {
    const bidang = document.getElementById("subProkerBidang").value.trim();
    const status = document.getElementById("subProkerStatus").value;
    const deskripsi = document.getElementById("subProkerDesc").value.trim();
    const poinRaw = document.getElementById("subProkerPoin").value.trim();
    const poin = poinRaw.split("\n").map(p => p.trim()).filter(p => p.length > 0);

    if (activeSubmodalId) {
      const idx = APP_STATE.proker.findIndex(p => p.id === activeSubmodalId);
      if (idx !== -1) {
        APP_STATE.proker[idx] = { ...APP_STATE.proker[idx], bidang, status, deskripsi, poin };
      }
    } else {
      const newId = Date.now();
      APP_STATE.proker.push({ id: newId, bidang, status, deskripsi, poin });
    }
    renderAdminProkerList();
    saveState(true, "✅ Program Kerja berhasil disimpan & dieksekusi!");
  }

  tutupAdminSubmodal();
};

// DELETE ITEM HANDLER
window.hapusItem = function(type, id) {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  if (type === "kegiatan") {
    APP_STATE.kegiatan = APP_STATE.kegiatan.filter(item => item.id !== id);
    renderAdminKegiatanList();
  } else if (type === "galeri") {
    APP_STATE.galeri = APP_STATE.galeri.filter(item => item.id !== id);
    renderAdminGaleriList();
  } else if (type === "berita") {
    APP_STATE.berita = APP_STATE.berita.filter(item => item.id !== id);
    renderAdminBeritaList();
  } else if (type === "agenda") {
    APP_STATE.agenda = APP_STATE.agenda.filter(item => item.id !== id);
    renderAdminAgendaList();
  } else if (type === "struktur") {
    APP_STATE.struktur = APP_STATE.struktur.filter(item => item.id !== id);
    renderAdminStrukturList();
  } else if (type === "proker") {
    APP_STATE.proker = APP_STATE.proker.filter(item => item.id !== id);
    renderAdminProkerList();
  }

  saveState(true, "🗑️ Data berhasil dihapus!");
};

// ----------------------------------------------------
// BACKUP, RESTORE & EXPORT CONTROLLER
// ----------------------------------------------------
window.eksekusiDanSegarkan = function() {
  saveState(true, "🚀 Seluruh data website berhasil dieksekusi dan diterapkan secara langsung!");
};

window.unduhBackupJson = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(APP_STATE, null, 2));
  const dlAnchor = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `perseba_data_backup_${dateStr}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  tampilkanToast("📥 Berkas backup JSON berhasil diunduh!");
};

window.pulihkanDariJson = function(fileInput) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && typeof parsed === "object") {
        APP_STATE = { ...DEFAULT_PERSEBA_STATE, ...parsed };
        saveState(true, "✅ Data berhasil dipulihkan dari berkas JSON!");
        populateAdminForms();
        renderAllAdminLists();
      } else {
        alert("Format berkas JSON tidak valid.");
      }
    } catch (err) {
      alert("Gagal membaca berkas JSON: " + err.message);
    }
  };
  reader.readAsText(file);
  fileInput.value = "";
};

window.salinKodeJavascript = function() {
  const code = `const DEFAULT_PERSEBA_STATE = ${JSON.stringify(APP_STATE, null, 2)};`;
  navigator.clipboard.writeText(code).then(() => {
    tampilkanToast("📋 Kode data JavaScript berhasil disalin ke clipboard!");
  }).catch(() => {
    tampilkanToast("Gagal menyalin ke clipboard. Silakan unduh file JSON.");
  });
};

window.resetKeDataAwal = function() {
  if (!confirm("Peringatan: Seluruh data hasil editan Anda akan dikembalikan ke data bawaan awal. Lanjutkan?")) {
    return;
  }
  APP_STATE = JSON.parse(JSON.stringify(DEFAULT_PERSEBA_STATE));
  saveState(true, "🔄 Seluruh data berhasil direset ke pengaturan awal!");
  populateAdminForms();
  renderAllAdminLists();
};

// ----------------------------------------------------
// GOOGLE APPS SCRIPT & GOOGLE SHEETS CONTROLLER
// ----------------------------------------------------
// ==========================================
// 11. INTEGRASI LANGSUNG GOOGLE SHEETS & WORKSPACE API
// ==========================================
let currentGoogleUser = null;
let currentGoogleToken = null;

function initGoogleSheetsIntegration() {
  subscribeAuth((user, token) => {
    currentGoogleUser = user;
    currentGoogleToken = token;
    updateGoogleAuthUI(user);
    updateActiveSheetUI();
    if (user && APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId) {
      handleSegarkanPesanSheets(false);
    }
  });
}

function updateGoogleAuthUI(user) {
  const signedOutCard = document.getElementById("googleAuthSignedOut");
  const signedInCard = document.getElementById("googleAuthSignedIn");
  const nameEl = document.getElementById("googleUserName");
  const emailEl = document.getElementById("googleUserEmail");
  const avatarImg = document.getElementById("googleUserAvatar");
  const avatarPlaceholder = document.getElementById("googleUserAvatarPlaceholder");

  if (user) {
    if (signedOutCard) signedOutCard.style.display = "none";
    if (signedInCard) signedInCard.style.display = "flex";
    if (nameEl) nameEl.textContent = user.displayName || "Pengurus PERSEBA";
    if (emailEl) emailEl.textContent = user.email || "-";

    if (user.photoURL && avatarImg) {
      avatarImg.src = user.photoURL;
      avatarImg.style.display = "block";
      if (avatarPlaceholder) avatarPlaceholder.style.display = "none";
    } else {
      if (avatarImg) avatarImg.style.display = "none";
      if (avatarPlaceholder) {
        avatarPlaceholder.style.display = "flex";
        avatarPlaceholder.textContent = (user.email ? user.email[0].toUpperCase() : "P");
      }
    }
  } else {
    if (signedOutCard) signedOutCard.style.display = "flex";
    if (signedInCard) signedInCard.style.display = "none";
  }
}

function updateActiveSheetUI() {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  const activeTitle = (APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetTitle) || "Database PERSEBA Dusun Baratsawah";
  const activeUrl = (APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetUrl) || (activeId ? `https://docs.google.com/spreadsheets/d/${activeId}/edit` : "#");
  const lastSync = (APP_STATE.integrasi && APP_STATE.integrasi.lastSync) || "Belum pernah";

  const titleEl = document.getElementById("textActiveSheetTitle");
  const idEl = document.getElementById("textActiveSheetId");
  const btnBuka = document.getElementById("btnBukaGoogleSheetLive");
  const statusBadge = document.getElementById("sheetActiveStatusBadge");
  const textSync = document.getElementById("textTerakhirSinkronSheets");
  const manualInput = document.getElementById("inputManualSpreadsheetId");

  if (textSync) textSync.textContent = `Terakhir Sinkron: ${lastSync}`;
  if (manualInput && activeId) manualInput.value = activeId;

  if (activeId) {
    if (titleEl) titleEl.textContent = activeTitle;
    if (idEl) idEl.textContent = activeId;
    if (btnBuka) {
      btnBuka.href = activeUrl;
      btnBuka.style.display = "inline-flex";
    }
    if (statusBadge) {
      statusBadge.className = "sheets-status-pill connected";
      statusBadge.textContent = "🟢 Terhubung & Aktif";
    }
  } else {
    if (titleEl) titleEl.textContent = "Belum ada spreadsheet yang dipilih";
    if (idEl) idEl.textContent = "Tidak ada";
    if (btnBuka) btnBuka.style.display = "none";
    if (statusBadge) {
      statusBadge.className = "sheets-status-pill disconnected";
      statusBadge.textContent = "⚪ Belum Ditautkan";
    }
  }
}

window.handleGoogleSignIn = async function() {
  try {
    tampilkanToast("🔑 Membuka jendela login akun Google...");
    const { user } = await loginWithGoogle();
    tampilkanToast(`🎉 Berhasil masuk sebagai: ${user.email}`);
    handleMuatSpreadsheetDrive();
  } catch (err) {
    console.error("Gagal masuk Google:", err);
    tampilkanToast("Batal masuk atau terjadi kendala pada login Google.");
  }
};

window.handleGoogleSignOut = async function() {
  try {
    await logoutGoogle();
    tampilkanToast("🚪 Berhasil keluar dari akun Google.");
  } catch (err) {
    console.error("Gagal logout:", err);
  }
};

window.handleBuatSpreadsheetBaru = async function() {
  if (!auth.currentUser) {
    tampilkanToast("⚠️ Silakan klik 'Sign in with Google' terlebih dahulu!");
    return;
  }

  const judul = prompt("Masukkan nama spreadsheet baru:", "Database PERSEBA Dusun Baratsawah");
  if (!judul) return;

  tampilkanToast("🚀 Sedang membuat Google Spreadsheet baru di Google Drive Anda...");

  try {
    const res = await createPersebaSpreadsheet(judul);
    if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
    APP_STATE.integrasi.activeSpreadsheetId = res.id;
    APP_STATE.integrasi.activeSpreadsheetTitle = res.title;
    APP_STATE.integrasi.activeSpreadsheetUrl = res.url;
    APP_STATE.integrasi.lastSync = new Date().toLocaleString("id-ID");

    saveState(true, `🎉 Spreadsheet '${res.title}' berhasil dibuat & ditautkan!`);
    updateActiveSheetUI();
    handleSegarkanPesanSheets();
  } catch (err) {
    console.error("Gagal membuat spreadsheet:", err);
    tampilkanToast(`Gagal membuat spreadsheet: ${err.message}`);
  }
};

window.handleMuatSpreadsheetDrive = async function() {
  if (!auth.currentUser) {
    tampilkanToast("⚠️ Silakan masuk dengan akun Google terlebih dahulu.");
    return;
  }

  const selectEl = document.getElementById("selectDriveSpreadsheet");
  if (selectEl) selectEl.innerHTML = `<option value="">⏳ Memuat daftar spreadsheet dari Drive...</option>`;

  try {
    const files = await listDriveSpreadsheets();
    if (!selectEl) return;

    if (files.length === 0) {
      selectEl.innerHTML = `<option value="">(Tidak ditemukan file spreadsheet di Drive Anda)</option>`;
      tampilkanToast("Belum ada file spreadsheet di Drive. Anda bisa klik 'Buat Spreadsheet PERSEBA Otomatis'.");
      return;
    }

    selectEl.innerHTML = `<option value="">-- Pilih salah satu spreadsheet (${files.length} ditemukan) --</option>` +
      files.map(f => `<option value="${f.id}" data-url="${f.webViewLink || ''}" data-name="${f.name}">${f.name}</option>`).join("");
    tampilkanToast(`📁 Berhasil memuat ${files.length} file spreadsheet dari Google Drive Anda.`);
  } catch (err) {
    console.error("Gagal membaca Drive:", err);
    if (selectEl) selectEl.innerHTML = `<option value="">(Gagal memuat: periksa izin Drive)</option>`;
    tampilkanToast("Gagal membaca Google Drive: " + err.message);
  }
};

window.handleTerapkanPilihanDrive = function() {
  const selectEl = document.getElementById("selectDriveSpreadsheet");
  if (!selectEl || !selectEl.value) {
    tampilkanToast("⚠️ Pilih salah satu spreadsheet dari dropdown terlebih dahulu.");
    return;
  }

  const opt = selectEl.options[selectEl.selectedIndex];
  const sheetId = selectEl.value;
  const sheetName = opt.getAttribute("data-name") || "Google Spreadsheet";
  const sheetUrl = opt.getAttribute("data-url") || `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
  APP_STATE.integrasi.activeSpreadsheetId = sheetId;
  APP_STATE.integrasi.activeSpreadsheetTitle = sheetName;
  APP_STATE.integrasi.activeSpreadsheetUrl = sheetUrl;

  saveState(true, `✅ Spreadsheet '${sheetName}' berhasil dijadikan database aktif!`);
  updateActiveSheetUI();
  handleSegarkanPesanSheets();
};

window.handleSimpanManualSpreadsheetId = function() {
  const inputEl = document.getElementById("inputManualSpreadsheetId");
  let val = inputEl ? inputEl.value.trim() : "";
  if (!val) {
    tampilkanToast("⚠️ Masukkan Spreadsheet ID atau URL Google Sheets.");
    return;
  }

  const match = val.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) val = match[1];

  if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
  APP_STATE.integrasi.activeSpreadsheetId = val;
  APP_STATE.integrasi.activeSpreadsheetTitle = "Google Spreadsheet Terpilih";
  APP_STATE.integrasi.activeSpreadsheetUrl = `https://docs.google.com/spreadsheets/d/${val}/edit`;

  saveState(true, "✅ Spreadsheet ID berhasil disimpan!");
  updateActiveSheetUI();
  handleSegarkanPesanSheets();
};

window.handleSegarkanPesanSheets = async function(showToast = true) {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  const tableBody = document.getElementById("sheetsPesanTableBody");
  if (!tableBody) return;

  if (!activeId) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Belum ada spreadsheet aktif. Silakan buat atau pilih spreadsheet di atas.</td></tr>`;
    return;
  }

  if (!auth.currentUser) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Silakan klik tombol "Sign in with Google" di atas untuk melihat isi pesan spreadsheet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">⏳ Mengambil pesan terbaru dari Google Sheets...</td></tr>`;

  try {
    const list = await fetchContactMessagesFromSheet(activeId);
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">Belum ada pesan kontak masuk di tab 'Pesan_Kontak'.</td></tr>`;
      if (showToast) tampilkanToast("Tab Pesan_Kontak masih kosong.");
      return;
    }

    tableBody.innerHTML = list.map(item => {
      const cleanWa = (item.telp || "").replace(/[^0-9]/g, "");
      const waLink = cleanWa ? `<a href="https://wa.me/${cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa}" target="_blank" class="btn btn-outline btn-sm" style="color:#16a34a; font-weight:700; padding:0.2rem 0.5rem; font-size:0.75rem;">💬 ${item.telp}</a>` : item.telp;

      return `
        <tr>
          <td style="white-space: nowrap; font-size: 0.8rem; color: var(--text-muted);">${item.waktu}</td>
          <td><strong>${item.nama}</strong></td>
          <td>${waLink}</td>
          <td style="max-width: 320px; line-height: 1.45;">${item.pesan}</td>
          <td>
            <select class="sheets-status-select" onchange="handleUbahStatusPesanSheets(${item.row}, this.value)">
              <option value="Baru" ${item.status === "Baru" ? "selected" : ""}>🔴 Baru</option>
              <option value="Dibaca" ${item.status === "Dibaca" ? "selected" : ""}>🟡 Dibaca</option>
              <option value="Dibalas" ${item.status === "Dibalas" ? "selected" : ""}>🔵 Dibalas</option>
              <option value="Selesai" ${item.status === "Selesai" ? "selected" : ""}>🟢 Selesai</option>
            </select>
          </td>
          <td>
            <a href="https://wa.me/${cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa}?text=${encodeURIComponent('Halo ' + item.nama + ', kami dari pengurus PERSEBA menindaklanjuti pesan Anda...')}" target="_blank" class="btn btn-primary btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">
              Balas WA
            </a>
          </td>
        </tr>
      `;
    }).join("");

    if (showToast) tampilkanToast(`📬 Berhasil memuat ${list.length} pesan dari Google Sheets!`);
  } catch (err) {
    console.error("Gagal membaca pesan:", err);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #dc2626;">Gagal membaca pesan dari spreadsheet: ${err.message}</td></tr>`;
  }
};

window.handleUbahStatusPesanSheets = async function(row, newStatus) {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  if (!activeId) return;

  try {
    await updateMessageStatusInSheet(activeId, row, newStatus);
    tampilkanToast(`✅ Status baris ${row} diubah menjadi '${newStatus}' di Google Sheets!`);
  } catch (err) {
    console.error("Gagal update status:", err);
    tampilkanToast(`Gagal mengubah status: ${err.message}`);
  }
};

window.handleKirimPesanUjiCoba = async function() {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  if (!activeId) {
    tampilkanToast("⚠️ Belum ada spreadsheet aktif. Buat atau pilih spreadsheet terlebih dahulu.");
    return;
  }

  const nama = prompt("Nama pengirim uji coba:", "Warga Dusun Baratsawah");
  if (!nama) return;
  const pesan = prompt("Isi pesan aspirasi:", "Semangat selalu pemuda Baratsawah! Kegiatan pembersihan lingkungan kemarin sangat bermanfaat.");
  if (!pesan) return;

  try {
    tampilkanToast("🚀 Mengirim pesan ke Google Sheets...");
    await appendContactMessageToSheet(activeId, {
      nama: nama,
      telp: "081234567890",
      pesan: pesan
    });
    tampilkanToast("🎉 Pesan uji coba berhasil ditulis ke Google Sheets!");
    handleSegarkanPesanSheets();
  } catch (err) {
    console.error("Gagal mengirim pesan uji:", err);
    tampilkanToast(`Gagal mengirim: ${err.message}`);
  }
};

// MANDATORY CONFIRMATION FOR DESTRUCTIVE ACTIONS (WORKSPACE INTEGRATION SKILL COMPLIANCE)
window.handleUnggahKeGoogleSheets = async function() {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  if (!activeId) {
    tampilkanToast("⚠️ Silakan pilih atau buat spreadsheet terlebih dahulu di atas.");
    return;
  }

  const confirmed = window.confirm(
    "⚠️ KONFIRMASI PENYIMPANAN DATA:\n\n" +
    "Apakah Anda yakin ingin MENCADANGKAN seluruh konten website saat ini ke Google Sheets (Tab 'Data_Website')?\n\n" +
    "Tindakan ini akan menimpa data cadangan sebelumnya di spreadsheet dengan data saat ini."
  );
  if (!confirmed) return;

  tampilkanToast("🚀 Mengunggah seluruh konten website ke Google Sheets...");
  try {
    const waktu = await uploadWebsiteContentToSheet(activeId, APP_STATE);
    if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
    APP_STATE.integrasi.lastSync = waktu;
    saveState(true, `✅ Seluruh data website berhasil dicadangkan ke Google Sheets pada ${waktu}!`);
    updateActiveSheetUI();
  } catch (err) {
    console.error("Gagal mengunggah konten:", err);
    tampilkanToast(`Gagal mencadangkan: ${err.message}`);
  }
};

window.handleTarikDariGoogleSheets = async function() {
  const activeId = APP_STATE.integrasi && APP_STATE.integrasi.activeSpreadsheetId;
  if (!activeId) {
    tampilkanToast("⚠️ Silakan pilih atau buat spreadsheet terlebih dahulu di atas.");
    return;
  }

  const confirmed = window.confirm(
    "⚠️ PERINGATAN MEMULIHKAN DATA:\n\n" +
    "Apakah Anda yakin ingin MEMULIHKAN konten website dari Google Sheets (Tab 'Data_Website')?\n\n" +
    "Tindakan ini akan menimpa seluruh konten saat ini di website dengan versi yang tersimpan di spreadsheet."
  );
  if (!confirmed) return;

  tampilkanToast("📥 Mengambil data cadangan dari Google Sheets...");
  try {
    const res = await downloadWebsiteContentFromSheet(activeId);
    APP_STATE = { ...DEFAULT_PERSEBA_STATE, ...res.data };
    if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
    APP_STATE.integrasi.activeSpreadsheetId = activeId;
    APP_STATE.integrasi.lastSync = res.lastSync;

    saveState(true, `🎉 Konten website berhasil dipulihkan dari Google Sheets (Versi: ${res.lastSync})!`);
    populateAdminForms();
    renderAllAdminLists();
    updateActiveSheetUI();
  } catch (err) {
    console.error("Gagal memulihkan:", err);
    tampilkanToast(`Gagal memulihkan data: ${err.message}`);
  }
};

// Backwards compatibility for Apps Script
function updateGasStatusUI() {
  const integrasi = APP_STATE.integrasi || {};
  const indicator = document.getElementById("gasStatusIndicator");
  const statusText = document.getElementById("gasStatusText");
  const lastSyncText = document.getElementById("gasLastSyncText");
  
  if (integrasi.appScriptUrl && integrasi.appScriptUrl.startsWith("http")) {
    if (indicator) indicator.classList.add("is-connected");
    if (statusText) statusText.innerHTML = `Status Integrasi: <span style="color: #16a34a; font-weight: 700;">Terkonfigurasi</span>`;
    if (lastSyncText) lastSyncText.textContent = integrasi.lastSync ? `Terakhir disinkronkan: ${integrasi.lastSync}` : "Belum ada sinkronisasi data yang dijalankan";
  } else {
    if (indicator) indicator.classList.remove("is-connected");
    if (statusText) statusText.innerHTML = `Status Integrasi: <span style="color: #d97706; font-weight: 700;">Belum Dikonfigurasi</span>`;
    if (lastSyncText) lastSyncText.textContent = "Masukkan URL Web App Google Apps Script di bawah untuk mulai menghubungkan";
  }
}

window.simpanPengaturanAppsScript = function() {
  const inputUrl = document.getElementById("inputAppsScriptUrl");
  const checkAutoSync = document.getElementById("checkAutoSyncContact");
  
  const urlVal = inputUrl ? inputUrl.value.trim() : "";
  const autoSyncVal = checkAutoSync ? checkAutoSync.checked : true;
  
  if (urlVal && !urlVal.startsWith("http")) {
    tampilkanToast("⚠️ URL harus diawali dengan https://");
    return;
  }
  
  if (!APP_STATE.integrasi) APP_STATE.integrasi = {};
  APP_STATE.integrasi.appScriptUrl = urlVal;
  APP_STATE.integrasi.autoSyncContactForm = autoSyncVal;
  
  saveState(true, "✅ Pengaturan Integrasi Google Apps Script berhasil disimpan!");
  updateGasStatusUI();
};

window.tesKoneksiAppsScript = async function() {
  const url = APP_STATE.integrasi && APP_STATE.integrasi.appScriptUrl;
  if (!url) {
    tampilkanToast("⚠️ URL Google Apps Script belum diisi. Masukkan URL lalu simpan.");
    return;
  }
  
  tampilkanToast("🔄 Menguji koneksi ke Google Apps Script...");
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "success") {
      tampilkanToast("🎉 Koneksi Berhasil! Google Apps Script merespons dengan baik.");
      updateGasStatusUI();
    } else {
      tampilkanToast("⚠️ Google Apps Script merespons: " + (data.message || "Status tidak dikenal"));
    }
  } catch (err) {
    tampilkanToast("ℹ️ Sinyal pengujian dikirim ke Apps Script! Pastikan setting Who has access: Anyone.");
  }
};

window.salinKodeGoogleAppsScript = function() {
  salinKodeGasAktif();
};

let CURRENT_GAS_TAB = "setup";

window.pilihGasTab = function(type) {
  CURRENT_GAS_TAB = type;
  
  const btnSetup = document.getElementById("btnGasTabSetup");
  const btnCode = document.getElementById("btnGasTabCode");
  const btnHtml = document.getElementById("btnGasTabHtml");

  const paneSetup = document.getElementById("paneGasSetup");
  const paneCode = document.getElementById("paneGasCode");
  const paneHtml = document.getElementById("paneGasHtml");

  if (btnSetup) btnSetup.classList.toggle("is-active", type === "setup");
  if (btnCode) btnCode.classList.toggle("is-active", type === "code");
  if (btnHtml) btnHtml.classList.toggle("is-active", type === "html");

  if (paneSetup) paneSetup.classList.toggle("is-active", type === "setup");
  if (paneCode) paneCode.classList.toggle("is-active", type === "code");
  if (paneHtml) paneHtml.classList.toggle("is-active", type === "html");
};

window.salinKodeGasAktif = function() {
  let targetId = "codeGasSetup";
  let fileName = "Setup.gs";

  if (CURRENT_GAS_TAB === "code") {
    targetId = "codeGasCode";
    fileName = "Code.gs";
  } else if (CURRENT_GAS_TAB === "html") {
    targetId = "codeGasHtml";
    fileName = "Index.html";
  }

  const el = document.getElementById(targetId);
  const code = el ? el.textContent : "";

  if (!code) {
    tampilkanToast("⚠️ Konten kode tidak ditemukan.");
    return;
  }

  navigator.clipboard.writeText(code).then(() => {
    tampilkanToast(`📋 Isi file ${fileName} berhasil disalin ke clipboard!`);
  }).catch(() => {
    tampilkanToast(`Gagal menyalin otomatis. Silakan tandai teks ${fileName} dan salin manual.`);
  });
};

window.unduhFileGasAktif = function() {
  let targetId = "codeGasSetup";
  let fileName = "Setup.gs";
  let mimeType = "text/javascript";

  if (CURRENT_GAS_TAB === "code") {
    targetId = "codeGasCode";
    fileName = "Code.gs";
    mimeType = "text/javascript";
  } else if (CURRENT_GAS_TAB === "html") {
    targetId = "codeGasHtml";
    fileName = "Index.html";
    mimeType = "text/html";
  }

  const el = document.getElementById(targetId);
  const code = el ? el.textContent : "";
  if (!code) return;

  const blob = new Blob([code], { type: mimeType });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  tampilkanToast(`📥 File ${fileName} berhasil diunduh ke komputer Anda!`);
};

window.bukaSheetTerkait = function() {
  window.open("https://sheets.google.com", "_blank");
};

// ==========================================
// 12. PENGELOLA INTEGRASI & SEMATAN GOOGLE SITES
// ==========================================
function initGoogleSites() {
  setTimeout(() => {
    perbaruiKodeSites();
  }, 300);
}

window.perbaruiKodeSites = function() {
  const urlInput = document.getElementById("inputSitesTargetUrl");
  const heightSelect = document.getElementById("selectSitesHeight");
  const codePre = document.getElementById("codeSitesIframeDisplay");
  if (!codePre) return;

  if (urlInput && !urlInput.value) {
    let current = window.location.href;
    if (window.location.origin && window.location.origin !== "null" && !window.location.origin.includes("about:")) {
      current = window.location.origin + (window.location.pathname || "/");
    }
    urlInput.value = current;
  }

  const url = (urlInput && urlInput.value.trim()) ? urlInput.value.trim() : window.location.href;
  const height = (heightSelect && heightSelect.value) ? heightSelect.value : "1000px";

  const iframeSnippet = `<iframe 
  src="${url}" 
  style="width: 100%; height: ${height}; min-height: 700px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);" 
  allow="fullscreen; clipboard-read; clipboard-write; geolocation" 
  loading="lazy" 
  title="Website Remaja Dusun Baratsawah PERSEBA">
</iframe>`;

  codePre.textContent = iframeSnippet;
};

window.salinKodeIframeSites = function() {
  const codePre = document.getElementById("codeSitesIframeDisplay");
  if (!codePre) return;
  const code = codePre.textContent;

  navigator.clipboard.writeText(code).then(() => {
    tampilkanToast("📋 Kode Sematan (Iframe) Google Sites berhasil disalin ke clipboard!");
  }).catch(() => {
    tampilkanToast("Silakan tandai kode iframe di atas dan salin manual (Ctrl+C).");
  });
};

window.salinUrlSitesLangsung = function() {
  const urlInput = document.getElementById("inputSitesTargetUrl");
  const url = (urlInput && urlInput.value.trim()) ? urlInput.value.trim() : window.location.href;

  navigator.clipboard.writeText(url).then(() => {
    tampilkanToast("🔗 URL Website berhasil disalin! Siap ditempel di Google Sites.");
  }).catch(() => {
    tampilkanToast("Silakan salin manual URL di kolom input.");
  });
};

window.bukaTabGoogleSites = function() {
  function switchToSitesTab() {
    openAdminCmsStudio();
    const tabBtns = document.querySelectorAll(".admin-tab-btn");
    tabBtns.forEach(b => b.classList.remove("active"));
    const targetBtn = document.querySelector('.admin-tab-btn[data-tab="tab-googlesites"]');
    if (targetBtn) targetBtn.classList.add("active");

    document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.classList.remove("active"));
    const targetPane = document.getElementById("tab-googlesites");
    if (targetPane) targetPane.classList.add("active");

    perbaruiKodeSites();
  }

  if (isAdminAuthenticated()) {
    switchToSitesTab();
  } else {
    bukaAdminAuthModal();
    const origVerify = window.verifyAdminPassword;
    window.verifyAdminPassword = function() {
      const passInput = document.getElementById("adminAuthPassword");
      const errEl = document.getElementById("authErrorMessage");
      const val = passInput ? passInput.value.trim() : "";
      if (val === ADMIN_PASSWORD_HASH) {
        sessionStorage.setItem("perseba_admin_auth", "true");
        tutupAdminAuthModal();
        switchToSitesTab();
        tampilkanToast("🔓 Selamat datang di Panduan Penerapan Google Sites!");
        window.verifyAdminPassword = origVerify;
      } else {
        if (errEl) {
          errEl.textContent = "Kata sandi salah! Silakan coba lagi.";
          errEl.style.display = "block";
        }
      }
    };
  }
};



