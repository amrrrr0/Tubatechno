const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/testimonials", require("./routes/testimonials"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HelioNexus Backend API v1.0" });
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
  console.log(`🚀 HelioNexus Backend berjalan di http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/testimonials`);
});
