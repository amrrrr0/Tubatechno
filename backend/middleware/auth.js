const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "helionexus_secret";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kedaluwarsa." });
  }
}

module.exports = { requireAuth };
