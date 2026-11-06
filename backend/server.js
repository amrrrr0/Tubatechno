const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files for uploads ──────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/news", require("./routes/news"));
app.use("/api/business-units", require("./routes/business"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/pricing", require("./routes/pricing"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payment", require("./routes/payment"));


// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "TubaTechno Backend API v1.0" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 TubaTechno Backend berjalan di http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/testimonials`);
});
