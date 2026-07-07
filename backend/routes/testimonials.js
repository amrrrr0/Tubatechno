const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ── GET /api/testimonials ─────────────────────────────────────
router.get("/", async (req, res) => {
  try {
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

// ── POST /api/testimonials ────────────────────────────────────
// Dipakai oleh: admin form manual + Google Apps Script webhook
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

  // Clamp rating 1–5
  const safeRating = Math.min(5, Math.max(1, ratingNum));

  // Auto-generate DiceBear avatar
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
// Dipanggil oleh Google Apps Script saat ada respons Google Form baru
// Body: { secret, name, title, content, rating }
router.post("/gform-webhook", async (req, res) => {
  // Secret key untuk keamanan — cocokkan dengan yang di Apps Script
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
    // Cek duplikat (name + content yang sama dalam 5 menit terakhir)
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
