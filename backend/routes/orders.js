const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Multer Storage Configuration for SPK PDF ──────────────────────
const uploadDir = path.join(__dirname, "../uploads/spk");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "spk-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Hanya berkas PDF yang diperbolehkan!"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // limit 10MB
});

// ── POST /api/orders/upload-spk — upload SPK PDF (admin/publik) ──
router.post("/upload-spk", upload.single("spk"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada berkas yang diunggah." });
    }
    res.json({
      success: true,
      filename: req.file.filename,
      filepath: `/uploads/spk/${req.file.filename}`,
      message: "Berkas SPK PDF berhasil diunggah."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Gagal mengunggah berkas." });
  }
});

// ── GET /api/orders — list semua order (admin only) ──────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = "";
    const params = [];
    if (status && status !== "all") {
      where = "WHERE status = ?";
      params.push(status);
    }

    const [rows] = await db.query(
      `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM orders ${where}`,
      params
    );

    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil data orders." });
  }
});

// ── GET /api/orders/notifications — notifikasi pembayaran terbaru (admin) ──
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, order_id, customer_name, email, package_name, amount, status, paid_at, created_at
       FROM orders
       WHERE status = 'paid'
       ORDER BY paid_at DESC
       LIMIT 10`
    );
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil notifikasi." });
  }
});

// ── GET /api/orders/stats — statistik ringkas (admin only) ───────
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const [[{ total_orders }]] = await db.query("SELECT COUNT(*) as total_orders FROM orders");
    const [[{ total_revenue }]] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) as total_revenue FROM orders WHERE status = 'paid'"
    );
    const [[{ pending }]] = await db.query(
      "SELECT COUNT(*) as pending FROM orders WHERE status = 'pending'"
    );
    const [[{ paid }]] = await db.query(
      "SELECT COUNT(*) as paid FROM orders WHERE status = 'paid'"
    );
    const [[{ cancelled }]] = await db.query(
      "SELECT COUNT(*) as cancelled FROM orders WHERE status IN ('cancelled', 'expired', 'deny')"
    );

    // Revenue 6 bulan terakhir
    const [monthly] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COALESCE(SUM(amount), 0) as revenue,
        COUNT(*) as count
      FROM orders
      WHERE status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        total_orders: Number(total_orders),
        total_revenue: Number(total_revenue),
        pending: Number(pending),
        paid: Number(paid),
        cancelled: Number(cancelled),
        monthly,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil statistik." });
  }
});

// ── POST /api/orders — buat order baru (publik) ──────────────────
router.post("/", async (req, res) => {
  try {
    const {
      customer_name,
      email,
      phone,
      package_id,
      package_name,
      amount,
      notes,
      work_start_date,
      work_end_date,
      spk_pdf_path,
    } = req.body;

    if (!customer_name || !email || !phone || !package_name || !amount) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const orderId = `HN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    await db.query(
      `INSERT INTO orders 
       (order_id, customer_name, email, phone, package_id, package_name, amount, status, notes, work_start_date, work_end_date, spk_pdf_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [
        orderId, customer_name, email, phone, package_id || null, package_name, amount, notes || null,
        work_start_date || null, work_end_date || null, spk_pdf_path || null
      ]
    );

    res.json({ success: true, order_id: orderId, message: "Order berhasil dibuat." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal membuat order." });
  }
});

// ── PATCH /api/orders/:id/status — update status manual (admin) ──
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "cancelled", "processing"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Status tidak valid." });
    }

    await db.query(
      "UPDATE orders SET status = ?, paid_at = ? WHERE id = ?",
      [status, status === "paid" ? new Date() : null, req.params.id]
    );

    res.json({ success: true, message: "Status berhasil diperbarui." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal update status." });
  }
});

// ── DELETE /api/orders/:id — hapus order (admin) ─────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Order berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menghapus order." });
  }
});

module.exports = router;
