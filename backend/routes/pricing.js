const express = require("express");
const router = express.Router();
const db = require("../db/database");

// 1. Dapatkan semua data (bisa difilter berdasarkan type)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query; // 'subscription' atau 'lifetime'
    
    let query = "SELECT * FROM pricing_packages ORDER BY id ASC";
    let params = [];

    if (type) {
      query = "SELECT * FROM pricing_packages WHERE billing_type = ? ORDER BY id ASC";
      params = [type];
    }

    const [rows] = await db.query(query, params);
    
    // Parse JSON fitur
    const packages = rows.map(pkg => ({
      ...pkg,
      features: JSON.parse(pkg.features),
      is_popular: Boolean(pkg.is_popular)
    }));

    res.json({ success: true, data: packages });
  } catch (error) {
    console.error("Error GET /api/pricing:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data paket." });
  }
});

// 2. Tambah data baru
router.post("/", async (req, res) => {
  try {
    const { name, price, original_price, period, billing_type, features, is_popular } = req.body;

    if (!name || !price || !billing_type || !features) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const featuresJson = JSON.stringify(features);
    const isPopularInt = is_popular ? 1 : 0;

    const [result] = await db.query(
      `INSERT INTO pricing_packages (name, price, original_price, period, billing_type, features, is_popular) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, price, original_price || "", period || "", billing_type, featuresJson, isPopularInt]
    );

    res.status(201).json({ 
      success: true, 
      message: "Paket berhasil ditambahkan.",
      id: result.insertId 
    });
  } catch (error) {
    console.error("Error POST /api/pricing:", error);
    res.status(500).json({ success: false, message: "Gagal menambah paket." });
  }
});

// 3. Edit data
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, original_price, period, billing_type, features, is_popular } = req.body;

    if (!name || !price || !billing_type || !features) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const featuresJson = JSON.stringify(features);
    const isPopularInt = is_popular ? 1 : 0;

    const [result] = await db.query(
      `UPDATE pricing_packages 
       SET name = ?, price = ?, original_price = ?, period = ?, billing_type = ?, features = ?, is_popular = ? 
       WHERE id = ?`,
      [name, price, original_price || "", period || "", billing_type, featuresJson, isPopularInt, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Paket tidak ditemukan." });
    }

    res.json({ success: true, message: "Paket berhasil diperbarui." });
  } catch (error) {
    console.error("Error PUT /api/pricing:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui paket." });
  }
});

// 4. Hapus data
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM pricing_packages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Paket tidak ditemukan." });
    }

    res.json({ success: true, message: "Paket berhasil dihapus." });
  } catch (error) {
    console.error("Error DELETE /api/pricing:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus paket." });
  }
});

module.exports = router;
