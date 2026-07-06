const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ── GET /api/testimonials ─────────────────────────────────────
// Returns all approved testimonials, newest first
router.get("/", (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT id, name, title, content, avatar, rating, created_at
         FROM testimonials
         WHERE approved = 1
         ORDER BY created_at DESC`
      )
      .all();

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/testimonials error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/testimonials ────────────────────────────────────
// Accepts a new testimonial submission
router.post("/", (req, res) => {
  const { name, title, content, rating } = req.body;
  const ratingNum = parseInt(rating) || 5;

  // Basic validation
  if (!name?.trim() || !title?.trim() || !content?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Nama, jabatan, dan testimoni wajib diisi." });
  }
  if (content.trim().length < 20) {
    return res
      .status(400)
      .json({ success: false, message: "Testimoni minimal 20 karakter." });
  }
  if (name.trim().length > 80) {
    return res.status(400).json({ success: false, message: "Nama terlalu panjang." });
  }
  if (ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ success: false, message: "Rating harus antara 1–5." });
  }

  // Auto-generate DiceBear avatar from name seed
  const avatarSeed = encodeURIComponent(name.trim().replace(/\s+/g, ""));
  const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO testimonials (name, title, content, avatar, rating, approved)
      VALUES (@name, @title, @content, @avatar, @rating, 1)
    `);

    const result = stmt.run({
      name: name.trim(),
      title: title.trim(),
      content: content.trim(),
      avatar,
      rating: ratingNum,
    });

    const newRow = db
      .prepare("SELECT * FROM testimonials WHERE id = ?")
      .get(result.lastInsertRowid);

    return res.status(201).json({ success: true, data: newRow });
  } catch (err) {
    console.error("POST /api/testimonials error:", err);
    return res.status(500).json({ success: false, message: "Gagal menyimpan testimoni." });
  }
});

// ── DELETE /api/testimonials/:id ──────────────────────────────
// Simple delete endpoint (for future admin use)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Gagal menghapus." });
  }
});

module.exports = router;
