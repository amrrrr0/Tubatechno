const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Ensure uploads directory exists ───────────────────────────
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "logos");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Multer Storage Config ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (PNG, JPG, JPEG, GIF, WEBP, SVG) yang diperbolehkan."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
});

// ── POST /api/upload/logo ──────────────────────────────────────
router.post("/logo", upload.single("logo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah." });
    }

    const fileUrl = `http://localhost:5000/uploads/logos/${req.file.filename}`;
    return res.json({
      success: true,
      message: "Logo berhasil diunggah.",
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (err) {
    console.error("POST /api/upload/logo error:", err);
    return res.status(500).json({ success: false, message: "Gagal mengunggah file." });
  }
});

// ── Error handler middleware ───────────────────────────────────
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "Ukuran file maksimal 2MB." });
  }
  return res.status(400).json({ success: false, message: err.message || "Upload gagal." });
});

module.exports = router;
