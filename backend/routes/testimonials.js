const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Helper parsing CSV yang aman (menangani double quotes dan multiline cells)
function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

// Fungsi sinkronisasi utama Google Sheets CSV
async function syncGoogleSheet() {
  try {
    const [settings] = await db.query("SELECT key_value FROM settings WHERE key_name = 'gsheet_csv_url'");
    const csvUrl = settings[0]?.key_value;
    if (!csvUrl || !csvUrl.trim().startsWith("http")) {
      return { success: false, message: "URL Google Sheets CSV belum dikonfigurasi." };
    }

    console.log(`[GSheet Sync] Mengambil data dari URL: ${csvUrl}`);
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Skip baris pertama (header)
    if (rows.length <= 1) {
      return { success: true, message: "Tidak ada data respon di spreadsheet.", count: 0 };
    }

    const header = rows[0].map(h => h.trim().toLowerCase());
    
    // Temukan indeks kolom secara fleksibel
    const nameIdx = header.findIndex(h => h.includes("nama") || h.includes("name"));
    const titleIdx = header.findIndex(h => h.includes("jabatan") || h.includes("peran") || h.includes("title") || h.includes("role") || h.includes("instansi"));
    const contentIdx = header.findIndex(h => h.includes("testimoni") || h.includes("ulasan") || h.includes("content") || h.includes("review") || h.includes("saran"));
    const ratingIdx = header.findIndex(h => h.includes("rating") || h.includes("bintang") || h.includes("skor") || h.includes("nilai"));

    if (nameIdx === -1 || titleIdx === -1 || contentIdx === -1) {
      console.warn("[GSheet Sync] Format kolom tidak terdeteksi otomatis.", header);
      return { success: false, message: "Format kolom spreadsheet tidak cocok. Pastikan ada kolom nama, jabatan, dan testimoni." };
    }

    let insertCount = 0;
    let duplicateCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) continue;

      const name = (row[nameIdx] || "").trim();
      const title = (row[titleIdx] || "").trim();
      const content = (row[contentIdx] || "").trim();
      
      if (!name || !title || !content) continue;

      let ratingNum = 5;
      if (ratingIdx !== -1 && row[ratingIdx]) {
        const rawVal = row[ratingIdx].trim();
        // Coba konversi dari bintang atau kata ke nilai angka
        const ratingMap = { "sangat bagus": 5, "bagus": 4, "cukup": 3, "kurang": 2, "buruk": 1 };
        if (ratingMap[rawVal.toLowerCase()] !== undefined) {
          ratingNum = ratingMap[rawVal.toLowerCase()];
        } else {
          const val = parseInt(rawVal) || 5;
          ratingNum = Math.min(5, Math.max(1, val));
        }
      }

      // Cek apakah sudah pernah disimpan
      const [existing] = await db.query(
        "SELECT id FROM testimonials WHERE name = ? AND content = ?",
        [name, content]
      );

      if (existing.length > 0) {
        duplicateCount++;
        continue;
      }

      // Auto-generate DiceBear avatar
      const avatarSeed = encodeURIComponent(name.replace(/\s+/g, ""));
      const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}`;

      await db.query(
        `INSERT INTO testimonials (name, title, content, avatar, rating, approved) VALUES (?, ?, ?, ?, ?, 1)`,
        [name, title, content, avatar, ratingNum]
      );
      insertCount++;
    }

    console.log(`[GSheet Sync] Selesai. Ditambahkan: ${insertCount}, Duplikat: ${duplicateCount}`);
    return { success: true, inserted: insertCount, duplicates: duplicateCount };
  } catch (err) {
    console.error("[GSheet Sync] Gagal sinkronisasi:", err);
    return { success: false, error: err.message };
  }
}

// ── GET /api/testimonials ─────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    // Jalankan sinkronisasi asinkronus (di latar belakang) agar loading website tetap cepat
    syncGoogleSheet().catch(err => console.error("Latar belakang sync gagal:", err));

    const [rows] = await db.query(
      `SELECT id, name, title, content, avatar, rating, created_at
       FROM testimonials
       WHERE approved = 1
       ORDER BY created_at DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── GET /api/testimonials/settings ─────────────────────────────
router.get("/settings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT key_value FROM settings WHERE key_name = 'gsheet_csv_url'");
    return res.json({ success: true, gsheet_csv_url: rows[0]?.key_value || "" });
  } catch (err) {
    console.error("GET /api/testimonials/settings error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/testimonials/settings ────────────────────────────
router.post("/settings", async (req, res) => {
  const { gsheet_csv_url } = req.body;
  try {
    await db.query(
      "INSERT INTO settings (key_name, key_value) VALUES ('gsheet_csv_url', ?) ON DUPLICATE KEY UPDATE key_value = ?",
      [gsheet_csv_url || "", gsheet_csv_url || ""]
    );
    return res.json({ success: true, message: "Setting Google Sheet berhasil diperbarui." });
  } catch (err) {
    console.error("POST /api/testimonials/settings error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/testimonials/sync-gsheet ─────────────────────────
router.post("/sync-gsheet", async (req, res) => {
  const result = await syncGoogleSheet();
  if (result.success) {
    return res.json({ success: true, message: `Sinkronisasi berhasil. Ditambahkan: ${result.inserted}, Duplikat diabaikan: ${result.duplicates}` });
  } else {
    return res.status(500).json({ success: false, message: result.message || "Gagal sinkronisasi.", error: result.error });
  }
});

// ── POST /api/testimonials ────────────────────────────────────
router.post("/", async (req, res) => {
  const { name, title, content, rating } = req.body;
  const ratingNum = parseInt(rating) || 5;

  if (!name?.trim() || !title?.trim() || !content?.trim()) {
    return res.status(400).json({ success: false, message: "Nama, jabatan, dan testimoni wajib diisi." });
  }
  if (content.trim().length < 5) {
    return res.status(400).json({ success: false, message: "Testimoni terlalu singkat." });
  }
  if (name.trim().length > 80) {
    return res.status(400).json({ success: false, message: "Nama terlalu panjang." });
  }

  const safeRating = Math.min(5, Math.max(1, ratingNum));
  const avatarSeed = encodeURIComponent(name.trim().replace(/\s+/g, ""));
  const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}`;

  try {
    const [result] = await db.query(
      `INSERT INTO testimonials (name, title, content, avatar, rating, approved) VALUES (?, ?, ?, ?, ?, 1)`,
      [name.trim(), title.trim(), content.trim(), avatar, safeRating]
    );
    const [rows] = await db.query("SELECT * FROM testimonials WHERE id = ?", [result.insertId]);
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("POST /api/testimonials error:", err);
    return res.status(500).json({ success: false, message: "Gagal menyimpan testimoni." });
  }
});

// ── POST /api/testimonials/gform-webhook ─────────────────────
router.post("/gform-webhook", async (req, res) => {
  const WEBHOOK_SECRET = process.env.GFORM_WEBHOOK_SECRET || "helionexus-gform-secret-2024";
  const { secret, name, title, content, rating } = req.body;

  if (secret !== WEBHOOK_SECRET) {
    return res.status(403).json({ success: false, message: "Akses ditolak." });
  }

  if (!name?.trim() || !title?.trim() || !content?.trim()) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap dari Google Form." });
  }

  const ratingNum = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const avatarSeed = encodeURIComponent(name.trim().replace(/\s+/g, ""));
  const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}`;

  try {
    const [existing] = await db.query(
      `SELECT id FROM testimonials WHERE name = ? AND content = ? AND created_at > NOW() - INTERVAL 5 MINUTE`,
      [name.trim(), content.trim()]
    );
    if (existing.length > 0) {
      return res.json({ success: true, message: "Duplikat diabaikan.", duplicate: true });
    }

    const [result] = await db.query(
      `INSERT INTO testimonials (name, title, content, avatar, rating, approved) VALUES (?, ?, ?, ?, ?, 1)`,
      [name.trim(), title.trim(), content.trim(), avatar, ratingNum]
    );

    console.log(`[GForm Webhook] Testimoni baru dari ${name.trim()} (id: ${result.insertId})`);
    return res.json({ success: true, message: "Testimoni dari Google Form berhasil disimpan.", id: result.insertId });
  } catch (err) {
    console.error("POST /api/testimonials/gform-webhook error:", err);
    return res.status(500).json({ success: false, message: "Gagal menyimpan." });
  }
});

// ── PUT /api/testimonials/:id ─────────────────────────────────
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, content, rating } = req.body;
  const ratingNum = parseInt(rating) || 5;

  if (!name?.trim() || !title?.trim() || !content?.trim()) {
    return res.status(400).json({ success: false, message: "Nama, jabatan, dan testimoni wajib diisi." });
  }

  const [existing] = await db.query("SELECT * FROM testimonials WHERE id = ?", [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan." });
  }

  const avatarSeed = encodeURIComponent(name.trim().replace(/\s+/g, ""));
  const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}`;

  try {
    await db.query(
      `UPDATE testimonials SET name = ?, title = ?, content = ?, avatar = ?, rating = ? WHERE id = ?`,
      [name.trim(), title.trim(), content.trim(), avatar, Math.min(5, Math.max(1, ratingNum)), id]
    );
    const [updated] = await db.query("SELECT * FROM testimonials WHERE id = ?", [id]);
    return res.json({ success: true, data: updated[0] });
  } catch (err) {
    console.error("PUT /api/testimonials/:id error:", err);
    return res.status(500).json({ success: false, message: "Gagal memperbarui." });
  }
});

// ── DELETE /api/testimonials/:id ──────────────────────────────
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT id FROM testimonials WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan." });
    }
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
    return res.json({ success: true, message: "Testimoni berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/testimonials/:id error:", err);
    return res.status(500).json({ success: false, message: "Gagal menghapus." });
  }
});

module.exports = router;
