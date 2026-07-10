const db = require("./db/database");

async function insertNews() {
  const title = "HelioNexus: Inovasi Software House dari Universitas Muhammadiyah PKU Surakarta Siap Menghadapi Era Digital";
  const slug = "helionexus-inovasi-software-house-umuka";
  const content = `Surakarta - Universitas Muhammadiyah PKU Surakarta (UMUKA) kembali menorehkan prestasi melalui unit usahanya, HelioNexus. Sebagai sebuah Software House yang inovatif, HelioNexus hadir untuk memberikan solusi digital yang komprehensif bagi berbagai sektor bisnis dan instansi.

Dengan semangat kolaborasi dan inovasi, HelioNexus menawarkan berbagai layanan unggulan, mulai dari pengembangan aplikasi Web dan Mobile, desain UI/UX yang intuitif, hingga implementasi teknologi mutakhir seperti Artificial Intelligence (AI) dan Internet of Things (IoT).

Tim ahli di HelioNexus berkomitmen untuk mengubah ide-ide brilian klien menjadi produk digital yang fungsional dan berdaya saing tinggi. "Kami tidak hanya sekadar membangun perangkat lunak, tetapi kami membangun solusi nyata yang dapat mempercepat transformasi digital klien kami," tutur perwakilan HelioNexus.

Peluncuran HelioNexus ini diharapkan dapat memberikan dampak positif bagi ekosistem startup dan digital di Indonesia, khususnya di kawasan Surakarta dan sekitarnya. Dengan dukungan penuh dari institusi pendidikan tinggi, HelioNexus siap menjadi mitra teknologi terpercaya bagi perusahaan skala kecil, menengah, hingga skala enterprise.

Bagi Anda yang sedang mencari mitra pengembangan teknologi, HelioNexus adalah jawaban yang tepat untuk mewujudkan visi digital bisnis Anda.`;
  const author = "Admin HelioNexus";
  const image_url = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const status = "published";
  const seo_title = "HelioNexus Software House UMUKA Surakarta";
  const seo_description = "HelioNexus adalah Software House inovatif dari Universitas Muhammadiyah PKU Surakarta yang menyediakan solusi Web, Mobile App, AI, dan IoT.";
  const seo_keywords = "software house, helionexus, umuka surakarta, web development, mobile app, ai, iot";

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
