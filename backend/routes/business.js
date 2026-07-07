const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ── GET /api/business-units ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, slug, title, tagline, category, features, is_featured, logo_type, website_url, created_at
       FROM business_units
       ORDER BY is_featured DESC, created_at ASC`
    );

    const data = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || "[]"),
      isFeatured: !!row.is_featured,
      logoUrl: row.logo_type,
      websiteUrl: row.website_url || "#"
    }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error("GET /api/business-units error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/business-units ──────────────────────────────────
router.post("/", async (req, res) => {
  const { title, tagline, category, features, isFeatured, logoUrl, websiteUrl } = req.body;

  if (!title?.trim() || !tagline?.trim() || !category?.trim()) {
    return res.status(400).json({ success: false, message: "Nama Unit, Slogan, dan Kategori wajib diisi." });
  }

  const featuresArr = Array.isArray(features) ? features : [];
  const logo = logoUrl?.trim() || "";
  const website = websiteUrl?.trim() || "#";
  const featured = isFeatured ? 1 : 0;

  const baseSlug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  try {
    const [result] = await db.query(
      `INSERT INTO business_units (slug, title, tagline, category, features, is_featured, logo_type, website_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title.trim(), tagline.trim(), category.trim(), JSON.stringify(featuresArr), featured, logo, website]
    );

    const [rows] = await db.query("SELECT * FROM business_units WHERE id = ?", [result.insertId]);
    const newRow = rows[0];

    return res.json({
      success: true,
      message: "Unit Bisnis berhasil ditambahkan.",
      data: {
        ...newRow,
        features: JSON.parse(newRow.features || "[]"),
        isFeatured: !!newRow.is_featured,
        logoUrl: newRow.logo_type,
        websiteUrl: newRow.website_url || "#"
      }
    });
  } catch (err) {
    console.error("POST /api/business-units error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── PUT /api/business-units/:id ───────────────────────────────
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, tagline, category, features, isFeatured, logoUrl, websiteUrl } = req.body;

  if (!title?.trim() || !tagline?.trim() || !category?.trim()) {
    return res.status(400).json({ success: false, message: "Nama Unit, Slogan, dan Kategori wajib diisi." });
  }

  const featuresArr = Array.isArray(features) ? features : [];
  const logo = logoUrl?.trim() || "";
  const website = websiteUrl?.trim() || "#";
  const featured = isFeatured ? 1 : 0;

  try {
    const [existing] = await db.query("SELECT * FROM business_units WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Unit Bisnis tidak ditemukan." });
    }

    await db.query(
      `UPDATE business_units
       SET title = ?, tagline = ?, category = ?, features = ?, is_featured = ?, logo_type = ?, website_url = ?
       WHERE id = ?`,
      [title.trim(), tagline.trim(), category.trim(), JSON.stringify(featuresArr), featured, logo, website, id]
    );

    const [updated] = await db.query("SELECT * FROM business_units WHERE id = ?", [id]);
    const updatedRow = updated[0];

    return res.json({
      success: true,
      message: "Unit Bisnis berhasil diperbarui.",
      data: {
        ...updatedRow,
        features: JSON.parse(updatedRow.features || "[]"),
        isFeatured: !!updatedRow.is_featured,
        logoUrl: updatedRow.logo_type,
        websiteUrl: updatedRow.website_url || "#"
      }
    });
  } catch (err) {
    console.error("PUT /api/business-units error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── DELETE /api/business-units/:id ────────────────────────────
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT * FROM business_units WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Unit Bisnis tidak ditemukan." });
    }

    await db.query("DELETE FROM business_units WHERE id = ?", [id]);
    return res.json({ success: true, message: "Unit Bisnis berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/business-units error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
