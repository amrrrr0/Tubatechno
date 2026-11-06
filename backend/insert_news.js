const db = require("./db/database");

async function insertNews() {
  const title = "TubaTechno: Software House Profesional Menghadirkan Solusi Digital Terpadu di Era Modern";
  const slug = "tubatechno-software-house-profesional-solusi-digital";
  const content = `Surakarta - TubaTechno, software house inovatif yang berfokus pada pengembangan produk digital, solusi enterprise, dan business development, resmi memperluas portofolio layanannya. Dengan kepercayaan dari berbagai klien terkemuka termasuk Universitas Muhammadiyah PKU Surakarta, instansi kesehatan, hingga UMKM nasional, TubaTechno menghadirkan solusi teknologi mutakhir.

Dengan semangat inovasi dan keunggulan teknis, TubaTechno menawarkan berbagai layanan unggulan, mulai dari pengembangan aplikasi Web dan Mobile, desain UI/UX yang intuitif, hingga implementasi teknologi modern seperti Artificial Intelligence (AI) dan Internet of Things (IoT).

Tim ahli di TubaTechno berkomitmen untuk mengubah kebutuhan dan ide-ide brilian klien menjadi produk digital yang fungsional, aman, dan berdaya saing tinggi. "Kami tidak hanya sekadar membangun perangkat lunak, tetapi kami membangun solusi nyata yang mempercepat transformasi bisnis klien kami," tutur perwakilan tim TubaTechno.

Bagi Anda yang sedang mencari mitra pengembangan teknologi dan pembuatan web tepercaya, TubaTechno adalah jawaban yang tepat untuk mewujudkan visi digital bisnis Anda.`;
  const author = "Admin TubaTechno";
  const image_url = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const status = "published";
  const seo_title = "TubaTechno Software House & Business Technology Partner";
  const seo_description = "TubaTechno adalah Software House profesional dan mitra business development terpercaya yang menyediakan solusi Web, Mobile App, AI, dan IoT.";
  const seo_keywords = "software house, tubatechno, web development, mobile app, ai, iot, software dev, business dev";

  try {
    const query = `
      INSERT INTO news 
      (title, slug, content, image_url, author, status, seo_title, seo_description, seo_keywords, published_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [title, slug, content, image_url, author, status, seo_title, seo_description, seo_keywords];
    
    await db.query(query, params);
    console.log("Berita berhasil ditambahkan!");
    process.exit(0);
  } catch (error) {
    console.error("Error inserting news:", error);
    process.exit(1);
  }
}

insertNews();
