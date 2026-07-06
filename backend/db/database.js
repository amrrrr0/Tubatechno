const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "testimonials.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// ── Create table ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    title      TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    avatar     TEXT,
    rating     INTEGER NOT NULL DEFAULT 5,
    approved   INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ── Seed default testimonials if table is empty ──────────────
const count = db.prepare("SELECT COUNT(*) as c FROM testimonials").get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO testimonials (name, title, content, avatar, rating, approved)
    VALUES (@name, @title, @content, @avatar, @rating, 1)
  `);

  const seed = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  seed([
    {
      name: "Dr. H. Ahmad Fauzi",
      title: "Ketua Koperasi Mitra Surakarta",
      content:
        "Layanan web development HelioNexus sangat responsif. Web kustom kami membantu digitalisasi transaksi koperasi dengan sangat cepat dan mudah dipahami anggota.",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=AhmadFauzi",
      rating: 5,
    },
    {
      name: "Rina Astuti, S.Kep.",
      title: "Kepala Administrasi Klinik PKU",
      content:
        "Integrasi IoT dari HelioNexus untuk otomatisasi sistem pemantauan klinik kami bekerja sangat akurat. Timnya sangat komunikatif dan profesional.",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=RinaAstuti",
      rating: 5,
    },
    {
      name: "Budi Prasetyo, M.T.",
      title: "Direktur PT Tekno Inovasi",
      content:
        "Desain UI/UX aplikasi mobile yang dibuat sangat modern dan elegan. Pengguna kami sangat menyukai navigasinya yang intuitif dan estetik.",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=BudiPrasetyo",
      rating: 5,
    },
  ]);

  console.log("✅ Database seeded with 3 default testimonials.");
}

module.exports = db;
