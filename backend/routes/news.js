const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Helper to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/(^-|-$)/g, ""); // Trim - from start and end
}

// ── GET /api/news ─────────────────────────────────────────────
// Returns all news articles. Optional query parameter: status (published, draft, all)
// Default is showing published news first, ordered by publication date/creation date
router.get("/", async (req, res) => {
  const { status = "published" } = req.query;
  
  try {
    let query = "SELECT * FROM news";
    let params = [];

    if (status !== "all") {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY published_at DESC, created_at DESC";

    const [rows] = await db.query(query, params);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/news error:", err);
    return res.status(500).json({ success: false, message: "Gagal mengambil data berita." });
  }
});

// ── GET /api/news/:slug ────────────────────────────────────────
// Retrieve a single news article by its unique SEO slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM news WHERE slug = ?", [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Berita tidak ditemukan." });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(`GET /api/news/${slug} error:`, err);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail berita." });
  }
});

// ── GET /api/news/id/:id ──────────────────────────────────────
// Retrieve a single news article by its primary key ID
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Berita tidak ditemukan." });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(`GET /api/news/id/${id} error:`, err);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail berita." });
  }
});

// ── POST /api/news ────────────────────────────────────────────
// Create a new news article
router.post("/", async (req, res) => {
  const {
    title,
    slug,
    content,
    image_url,
    author,
    seo_title,
    seo_description,
    seo_keywords,
    status = "draft"
  } = req.body;

  // Validation
  if (!title?.trim() || !content?.trim() || !author?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Judul, konten, dan penulis wajib diisi."
    });
  }

  // Generate or format slug
  let finalSlug = slug?.trim() ? generateSlug(slug) : generateSlug(title);
  if (!finalSlug) {
    return res.status(400).json({
      success: false,
      message: "Gagal membuat slug unik dari judul yang diberikan."
    });
  }

  // Set default SEO fields if not provided
  const finalSeoTitle = seo_title?.trim() ? seo_title.trim() : `${title.trim()} | TubaTechno`;
  const finalSeoDescription = seo_description?.trim() 
    ? seo_description.trim() 
    : content.trim().substring(0, 160).replace(/<[^>]*>/g, ""); // Strip HTML if any
  const finalSeoKeywords = seo_keywords?.trim() ? seo_keywords.trim() : null;

  // Publication date setting
  const publishedAt = status === "published" ? new Date() : null;

  try {
    // Check if slug is unique
    const [existing] = await db.query("SELECT id FROM news WHERE slug = ?", [finalSlug]);
    if (existing.length > 0) {
      // Append random number or suffix to make it unique, or return error. Let's return error for clean control
      return res.status(400).json({
        success: false,
        message: `Slug '${finalSlug}' sudah digunakan. Silakan masukkan slug atau judul lain.`
      });
    }

    const [result] = await db.query(
      `INSERT INTO news (title, slug, content, image_url, author, seo_title, seo_description, seo_keywords, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        finalSlug,
        content.trim(),
        image_url?.trim() || null,
        author.trim(),
        finalSeoTitle,
        finalSeoDescription,
        finalSeoKeywords,
        status,
        publishedAt
      ]
    );

    const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [result.insertId]);
    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("POST /api/news error:", err);
    return res.status(500).json({ success: false, message: "Gagal menyimpan berita." });
  }
});

// ── PUT /api/news/:id ─────────────────────────────────────────
// Update an existing news article
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    content,
    image_url,
    author,
    seo_title,
    seo_description,
    seo_keywords,
    status
  } = req.body;

  try {
    // Check if news exists
    const [existingNews] = await db.query("SELECT * FROM news WHERE id = ?", [id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ success: false, message: "Berita tidak ditemukan." });
    }

    const currentNews = existingNews[0];

    // Build fields to update dynamically
    let updateFields = [];
    let params = [];

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ success: false, message: "Judul tidak boleh kosong." });
      updateFields.push("title = ?");
      params.push(title.trim());
    }

    if (slug !== undefined) {
      let finalSlug = slug.trim() ? generateSlug(slug) : (title ? generateSlug(title) : currentNews.slug);
      // Validate uniqueness if slug changed
      if (finalSlug !== currentNews.slug) {
        const [existing] = await db.query("SELECT id FROM news WHERE slug = ? AND id != ?", [finalSlug, id]);
        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Slug '${finalSlug}' sudah digunakan oleh berita lain.`
          });
        }
      }
      updateFields.push("slug = ?");
      params.push(finalSlug);
    }

    if (content !== undefined) {
      if (!content.trim()) return res.status(400).json({ success: false, message: "Konten tidak boleh kosong." });
      updateFields.push("content = ?");
      params.push(content.trim());
    }

    if (image_url !== undefined) {
      updateFields.push("image_url = ?");
      params.push(image_url?.trim() || null);
    }

    if (author !== undefined) {
      if (!author.trim()) return res.status(400).json({ success: false, message: "Penulis tidak boleh kosong." });
      updateFields.push("author = ?");
      params.push(author.trim());
    }

    if (seo_title !== undefined) {
      updateFields.push("seo_title = ?");
      params.push(seo_title.trim() || `${(title || currentNews.title).trim()} | TubaTechno`);
    }

    if (seo_description !== undefined) {
      updateFields.push("seo_description = ?");
      params.push(seo_description.trim() || (content || currentNews.content).trim().substring(0, 160).replace(/<[^>]*>/g, ""));
    }

    if (seo_keywords !== undefined) {
      updateFields.push("seo_keywords = ?");
      params.push(seo_keywords.trim() || null);
    }

    if (status !== undefined) {
      if (status !== "draft" && status !== "published") {
        return res.status(400).json({ success: false, message: "Status harus 'draft' atau 'published'." });
      }
      updateFields.push("status = ?");
      params.push(status);

      // Handle published_at logic: if status changes to published, set published_at
      if (status === "published" && currentNews.status !== "published") {
        updateFields.push("published_at = ?");
        params.push(new Date());
      } else if (status === "draft") {
        // Option to reset publication date if reverted to draft
        updateFields.push("published_at = NULL");
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada field data yang diubah." });
    }

    const queryStr = `UPDATE news SET ${updateFields.join(", ")} WHERE id = ?`;
    params.push(id);

    await db.query(queryStr, params);

    const [updatedRow] = await db.query("SELECT * FROM news WHERE id = ?", [id]);
    return res.json({ success: true, data: updatedRow[0] });
  } catch (err) {
    console.error("PUT /api/news error:", err);
    return res.status(500).json({ success: false, message: "Gagal memperbarui berita." });
  }
});

// ── DELETE /api/news/:id ──────────────────────────────────────
// Delete a news article by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT id FROM news WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Berita tidak ditemukan." });
    }

    await db.query("DELETE FROM news WHERE id = ?", [id]);
    return res.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/news error:", err);
    return res.status(500).json({ success: false, message: "Gagal menghapus berita." });
  }
});

// ── POST /api/news/id/:id/view ────────────────────────────────
// Increment views count of a news article
router.post("/id/:id/view", async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT id FROM news WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Berita tidak ditemukan." });
    }

    await db.query("UPDATE news SET views = views + 1 WHERE id = ?", [id]);
    return res.json({ success: true, message: "Views berhasil diperbarui." });
  } catch (err) {
    console.error("POST /api/news/id/:id/view error:", err);
    return res.status(500).json({ success: false, message: "Gagal memperbarui views." });
  }
});

module.exports = router;
