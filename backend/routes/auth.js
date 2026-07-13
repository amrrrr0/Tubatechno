const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "helionexus_secret";
const JWT_EXPIRES = "8h";

/**
 * POST /api/auth/login
 * Body: { password }
 */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password diperlukan." });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Password salah." });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  res.json({
    success: true,
    token,
    expiresIn: JWT_EXPIRES,
  });
});

/**
 * GET /api/auth/verify
 * Header: Authorization: Bearer <token>
 */
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, role: decoded.role });
  } catch {
    res.status(401).json({ success: false, message: "Token tidak valid atau sudah kedaluwarsa." });
  }
});

module.exports = router;
