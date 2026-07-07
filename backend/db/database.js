const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let pool;
let initPromise = null;

async function initDB() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "helionexus";
  const port = process.env.DB_PORT || 3306;

  console.log(`🔌 Menghubungkan ke MySQL di ${host}:${port}...`);

  // 1. Hubungkan ke MySQL tanpa memilih database terlebih dahulu
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    port
  });

  // 2. Buat database jika belum ada
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.end();

  // 3. Buat pool koneksi ke database yang sudah dibuat/ada
  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // 4. Buat tabel jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      title VARCHAR(150) NOT NULL,
      content TEXT NOT NULL,
      avatar VARCHAR(255),
      rating INT NOT NULL DEFAULT 5,
      approved TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 5. Cek data default dan seed jika kosong untuk testimonials
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM testimonials");
  if (rows[0].count === 0) {
    const seedData = [
      [
        "Dr. H. Ahmad Fauzi",
        "Ketua Koperasi Mitra Surakarta",
        "Layanan web development HelioNexus sangat responsif. Web kustom kami membantu digitalisasi transaksi koperasi dengan sangat cepat dan mudah dipahami anggota.",
        "https://api.dicebear.com/9.x/notionists/svg?seed=AhmadFauzi",
        5,
        1
      ],
      [
        "Rina Astuti, S.Kep.",
        "Kepala Administrasi Klinik PKU",
        "Integrasi IoT dari HelioNexus untuk otomatisasi sistem pemantauan klinik kami bekerja sangat akurat. Timnya sangat komunikatif dan profesional.",
        "https://api.dicebear.com/9.x/notionists/svg?seed=RinaAstuti",
        5,
        1
      ],
      [
        "Budi Prasetyo, M.T.",
        "Direktur PT Tekno Inovasi",
        "Desain UI/UX aplikasi mobile yang dibuat sangat modern dan elegan. Pengguna kami sangat menyukai navigasinya yang intuitif dan estetik.",
        "https://api.dicebear.com/9.x/notionists/svg?seed=BudiPrasetyo",
        5,
        1
      ]
    ];

    await pool.query(
      `INSERT INTO testimonials (name, title, content, avatar, rating, approved) VALUES ?`,
      [seedData]
    );

    console.log("✅ Database MySQL di-seed dengan 3 testimoni default.");
  }

  // 6. Buat tabel news jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(255),
      author VARCHAR(100) NOT NULL,
      seo_title VARCHAR(255),
      seo_description TEXT,
      seo_keywords VARCHAR(255),
      status VARCHAR(20) DEFAULT 'draft',
      views INT DEFAULT 0,
      published_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_news_slug (slug),
      INDEX idx_news_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 6b. Cek apakah kolom views sudah ada di tabel news, jika belum tambahkan
  try {
    await pool.query("SELECT views FROM news LIMIT 1");
  } catch (err) {
    console.log("⚠️ Kolom 'views' tidak ditemukan di tabel news. Melakukan migrasi...");
    await pool.query("ALTER TABLE news ADD COLUMN views INT DEFAULT 0");
    console.log("✅ Kolom 'views' berhasil ditambahkan ke tabel news.");
  }

  // 7. Cek data default news dan seed jika kosong
  const [newsRows] = await pool.query("SELECT COUNT(*) as count FROM news");
  if (newsRows[0].count === 0) {
    const newsSeedData = [
      [
        "HelioNexus Luncurkan Solusi IoT Pintar untuk Digitalisasi Klinik Kesehatan",
        "helionexus-luncurkan-solusi-iot-pintar-untuk-digitalisasi-klinik-kesehatan",
        "Dalam upaya mempercepat transformasi digital di sektor kesehatan, HelioNexus resmi merilis sistem otomatisasi pemantauan klinik berbasis IoT. Sistem ini memungkinkan pemantauan suhu, kelembaban, dan status peralatan medis secara real-time. Melalui teknologi ini, pengelola klinik dapat meningkatkan keselamatan pasien dan efisiensi operasional harian. Layanan IoT ini telah terintegrasi dengan dashboard analitik berbasis web yang mudah digunakan oleh para tenaga medis.",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
        "Tim Humas HelioNexus",
        "Solusi IoT Pintar untuk Digitalisasi Klinik | HelioNexus",
        "HelioNexus merilis solusi IoT terbaru untuk otomatisasi dan digitalisasi klinik kesehatan guna meningkatkan efisiensi dan keamanan pasien.",
        "iot klinik, digitalisasi kesehatan, helionexus, otomatisasi klinik, sistem pemantauan iot",
        "published",
        154,
        new Date()
      ],
      [
        "Pentingnya Desain UI/UX Modern untuk Aplikasi Mobile UMKM",
        "pentingnya-desain-ui-ux-modern-untuk-aplikasi-mobile-umkm",
        "Desain UI/UX bukan sekadar tentang estetika visual, melainkan kunci utama kenyamanan pengguna saat berinteraksi dengan aplikasi mobile. Bagi UMKM, antarmuka yang intuitif dan mudah dipahami dapat meningkatkan retensi pelanggan hingga 40%. HelioNexus berkomitmen mendukung UMKM naik kelas dengan menghadirkan layanan desain UI/UX kelas dunia serta pengembangan aplikasi mobile berkinerja tinggi yang disesuaikan dengan kebutuhan pasar lokal.",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        "Budi Prasetyo",
        "Pentingnya UI/UX Modern untuk Aplikasi Mobile UMKM",
        "Mengapa desain UI/UX krusial untuk kesuksesan aplikasi mobile UMKM? Temukan analisis mendalam dan solusi praktis dari tim HelioNexus.",
        "ui ux umkm, aplikasi mobile, desain antarmuka, helionexus, digitalisasi bisnis",
        "published",
        88,
        new Date()
      ]
    ];

    await pool.query(
      `INSERT INTO news (title, slug, content, image_url, author, seo_title, seo_description, seo_keywords, status, views, published_at) VALUES ?`,
      [newsSeedData]
    );

    console.log("✅ Database MySQL di-seed dengan 2 berita default.");
  }

  // 6c. Buat tabel business_units jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS business_units (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(150) NOT NULL,
      tagline VARCHAR(255) NOT NULL,
      category VARCHAR(150) NOT NULL,
      features TEXT NOT NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      logo_type VARCHAR(255) NOT NULL DEFAULT 'star',
      website_url VARCHAR(255) NOT NULL DEFAULT '#',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Migrasi kolom logo_type (memperpanjang ke 255) & menambahkan website_url jika belum ada
  try {
    await pool.query("ALTER TABLE business_units MODIFY COLUMN logo_type VARCHAR(255) NOT NULL DEFAULT 'star'");
  } catch (err) {
    console.log("⚠️ Gagal memodifikasi kolom logo_type:", err.message);
  }

  try {
    await pool.query("SELECT website_url FROM business_units LIMIT 1");
  } catch (err) {
    console.log("⚠️ Kolom 'website_url' tidak ditemukan di tabel business_units. Melakukan migrasi...");
    await pool.query("ALTER TABLE business_units ADD COLUMN website_url VARCHAR(255) NOT NULL DEFAULT '#'");
    console.log("✅ Kolom 'website_url' berhasil ditambahkan ke tabel business_units.");
  }

  // 6d. Cek data default business_units dan seed jika kosong
  const [businessRows] = await pool.query("SELECT COUNT(*) as count FROM business_units");
  if (businessRows[0].count === 0) {
    const businessSeedData = [
      [
        "tirta",
        "UMPKU Tirta",
        "Air Minum Alami & Higienis",
        "Layanan Umum",
        JSON.stringify([
          "Sumber air pegunungan alami",
          "Proses filtrasi ultra-modern",
          "Sertifikasi Halal & BPOM resmi",
          "Kemasan praktis berbagai ukuran",
          "Distribusi cepat area Surakarta"
        ]),
        0,
        "https://cdn-icons-png.flaticon.com/512/3105/3105807.png",
        "#"
      ],
      [
        "boga",
        "UMPKU Boga",
        "Kuliner Sehat & Katering Premium",
        "Layanan Umum",
        JSON.stringify([
          "Katering kustom event & rapat",
          "Bahan masakan segar & organik",
          "Cita rasa Nusantara & Modern",
          "Higienitas tinggi terakreditasi",
          "Penyediaan konsumsi kampus rutin"
        ]),
        0,
        "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
        "#"
      ],
      [
        "helio",
        "HelioNexus",
        "Techno Creative & Software House",
        "Solusi Digital",
        JSON.stringify([
          "Web & Mobile App custom",
          "Integrasi IoT Industri",
          "Implementasi Kecerdasan Buatan (AI)",
          "UI/UX Design modern & responsif",
          "Konsultasi IT & digitalisasi UMKM"
        ]),
        1,
        "https://cdn-icons-png.flaticon.com/512/606/606547.png",
        "https://helionexus.co"
      ],
      [
        "bmt",
        "BMT UMPKU",
        "Finansial Mikro & Simpanan Syariah",
        "Koperasi Syariah",
        JSON.stringify([
          "Simpanan syariah aman & amanah",
          "Pembiayaan modal UMKM lokal",
          "Bagi hasil kompetitif & transparan",
          "Layanan jemput bola nasabah",
          "Kemitraan usaha produktif civitas"
        ]),
        0,
        "https://cdn-icons-png.flaticon.com/512/2953/2953363.png",
        "#"
      ]
    ];

    await pool.query(
      `INSERT INTO business_units (slug, title, tagline, category, features, is_featured, logo_type, website_url) VALUES ?`,
      [businessSeedData]
    );

    console.log("✅ Database MySQL di-seed dengan 4 unit bisnis default.");
  }

  // 6d. Buat tabel settings jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key_name VARCHAR(100) PRIMARY KEY,
      key_value TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Pastikan ada nilai default untuk gsheet_csv_url jika belum ada
  const [settingsRows] = await pool.query("SELECT COUNT(*) as count FROM settings WHERE key_name = 'gsheet_csv_url'");
  if (settingsRows[0].count === 0) {
    await pool.query("INSERT INTO settings (key_name, key_value) VALUES ('gsheet_csv_url', 'https://docs.google.com/spreadsheets/d/1AUBCbn-CdArfspvHv3fKppcJoYv6rtRp0LcS0R0CELE/export?format=csv')");
  }
}

function ensureDB() {
  if (!initPromise) {
    initPromise = initDB();
  }
  return initPromise;
}

// Jalankan inisialisasi awal saat modul di-load
ensureDB().catch(err => {
  console.error("❌ Gagal menginisialisasi database MySQL:", err);
});

module.exports = {
  query: async (sql, params) => {
    await ensureDB();
    return pool.query(sql, params);
  }
};
