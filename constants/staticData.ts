export interface StaticNewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string | null;
  status: string;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

export const staticNews: StaticNewsItem[] = [
  {
    id: 5,
    title: "TubaTechno: Software House Profesional Menghadirkan Solusi Digital Terpadu di Era Modern",
    slug: "tubatechno-software-house-profesional-solusi-digital",
    content: "Surakarta - TubaTechno, software house inovatif yang berfokus pada pengembangan produk digital, solusi enterprise, dan business development, resmi memperluas portofolio layanannya. Dengan kepercayaan dari berbagai klien terkemuka termasuk Universitas Muhammadiyah PKU Surakarta, instansi kesehatan, hingga UMKM nasional, TubaTechno menghadirkan solusi teknologi mutakhir.\n\nDengan semangat inovasi dan keunggulan teknis, TubaTechno menawarkan berbagai layanan unggulan, mulai dari pengembangan aplikasi Web dan Mobile, desain UI/UX yang intuitif, hingga implementasi teknologi modern seperti Artificial Intelligence (AI) dan Internet of Things (IoT).\n\nTim ahli di TubaTechno berkomitmen untuk mengubah kebutuhan dan ide-ide brilian klien menjadi produk digital yang fungsional, aman, dan berdaya saing tinggi. \"Kami tidak hanya sekadar membangun perangkat lunak, tetapi kami membangun solusi nyata yang mempercepat transformasi bisnis klien kami,\" tutur perwakilan tim TubaTechno.\n\nBagi Anda yang sedang mencari mitra pengembangan teknologi dan pembuatan web tepercaya, TubaTechno adalah jawaban yang tepat untuk mewujudkan visi digital bisnis Anda.",
    image_url: "/uploads/logos/logo-1783609908201-nha6al.jpg",
    author: "Admin TubaTechno",
    seo_title: "TubaTechno Software House & Business Technology Partner",
    seo_description: "TubaTechno adalah Software House profesional dan mitra business development terpercaya yang menyediakan solusi Web, Mobile App, AI, dan IoT.",
    seo_keywords: "software house, tubatechno, web development, mobile app, ai, iot, software dev, business dev",
    status: "published",
    published_at: "2026-07-09T15:06:33.000Z",
    created_at: "2026-07-09T15:06:33.000Z",
    views: 48
  },
  {
    id: 4,
    title: "TubaTechno Hadirkan Dashboard Analitik Baru",
    slug: "dashboard-analitik-tubatechno",
    content: "Sistem analitik baru ini memberikan visibilitas penuh bagi para mitra bisnis kami untuk melacak data performa dan konversi mereka secara langsung dari dashboard kami dengan visualisasi real-time yang mutakhir.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    author: "Dev Team",
    seo_title: "Dashboard Analitik Baru TubaTechno | Solusi Bisnis",
    seo_description: "TubaTechno meluncurkan dashboard analitik baru untuk mempermudah mitra bisnis melacak data konversi secara real-time.",
    seo_keywords: "dashboard, analitik, tubatechno, digitalisasi",
    status: "published",
    published_at: "2026-07-07T07:40:18.000Z",
    created_at: "2026-07-07T07:40:18.000Z",
    views: 22
  },
  {
    id: 2,
    title: "Pentingnya Desain UI/UX Modern untuk Aplikasi Mobile UMKM",
    slug: "pentingnya-desain-ui-ux-modern-untuk-aplikasi-mobile-umkm",
    content: "Desain UI/UX bukan sekadar tentang estetika visual, melainkan kunci utama kenyamanan pengguna saat berinteraksi dengan aplikasi mobile. Bagi UMKM, antarmuka yang intuitif dan mudah dipahami dapat meningkatkan retensi pelanggan hingga 40%. TubaTechno berkomitmen mendukung UMKM naik kelas dengan menghadirkan layanan desain UI/UX kelas dunia serta pengembangan aplikasi mobile berkinerja tinggi yang disesuaikan dengan kebutuhan pasar lokal.",
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    author: "Budi Prasetyo",
    seo_title: "Pentingnya UI/UX Modern untuk Aplikasi Mobile UMKM",
    seo_description: "Mengapa desain UI/UX krusial untuk kesuksesan aplikasi mobile UMKM? Temukan analisis mendalam dan solusi praktis dari tim TubaTechno.",
    seo_keywords: "ui ux umkm, aplikasi mobile, desain antarmuka, tubatechno, digitalisasi bisnis",
    status: "published",
    published_at: "2026-07-07T07:25:42.000Z",
    created_at: "2026-07-07T07:25:41.000Z",
    views: 17
  },
  {
    id: 1,
    title: "TubaTechno Luncurkan Solusi IoT Pintar untuk Digitalisasi Klinik Kesehatan",
    slug: "tubatechno-luncurkan-solusi-iot-pintar-untuk-digitalisasi-klinik-kesehatan",
    content: "Dalam upaya mempercepat transformasi digital di sektor kesehatan, TubaTechno resmi merilis sistem otomatisasi pemantauan klinik berbasis IoT. Sistem ini memungkinkan pemantauan suhu, kelembaban, dan status peralatan medis secara real-time. Melalui teknologi ini, pengelola klinik dapat meningkatkan keselamatan pasien dan efisiensi operasional harian. Layanan IoT ini telah terintegrasi dengan dashboard analitik berbasis web yang mudah digunakan oleh para tenaga medis.",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    author: "Tim Humas TubaTechno",
    seo_title: "Solusi IoT Pintar untuk Digitalisasi Klinik | TubaTechno",
    seo_description: "TubaTechno merilis solusi IoT terbaru untuk otomatisasi dan digitalisasi klinik kesehatan guna meningkatkan efisiensi dan keamanan pasien.",
    seo_keywords: "iot klinik, digitalisasi kesehatan, tubatechno, otomatisasi klinik, sistem pemantauan iot",
    status: "published",
    published_at: "2026-07-07T07:25:42.000Z",
    created_at: "2026-07-07T07:25:41.000Z",
    views: 12
  }
];

export interface StaticTestimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
  approved?: number;
  created_at: string;
}

export const staticTestimonials: StaticTestimonial[] = [
  {
    id: 1,
    name: "Dr. H. Ahmad Fauzi",
    title: "Ketua Koperasi Mitra Surakarta",
    content: "Layanan web development TubaTechno sangat responsif. Web kustom kami membantu digitalisasi transaksi koperasi dengan sangat cepat dan mudah dipahami anggota.",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=AhmadFauzi",
    rating: 5,
    approved: 1,
    created_at: "2026-07-07T07:00:13.000Z"
  },
  {
    id: 3,
    name: "Budi Prasetyo, M.T.",
    title: "Direktur PT Tekno Inovasi",
    content: "Desain UI/UX aplikasi mobile yang dibuat sangat modern dan elegan. Pengguna kami sangat menyukai navigasinya yang intuitif dan estetik.",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=BudiPrasetyo",
    rating: 5,
    approved: 1,
    created_at: "2026-07-07T07:00:13.000Z"
  },
  {
    id: 12,
    name: "ZAIM",
    title: "CEO",
    content: "MANTAP BETUL SANGAT KEREN DAN RESPONSIF, SANGAT GEN Z ABLE SEKALI, PENGERJAANNYA CEPAT DAN TERSTRUKTUR",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ZAIM",
    rating: 5,
    approved: 1,
    created_at: "2026-07-07T13:24:55.000Z"
  },
  {
    id: 13,
    name: "Khumaidi",
    title: "BOS KATUL",
    content: "Pelayanan luar biasa, tim yang kompeten, dan hasil kerja yang sangat memuaskan. TubaTechno adalah mitra terbaik untuk segala kebutuhan inovasi digital. Sangat puas dengan hasilnya!",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Khumaidi",
    rating: 4,
    approved: 1,
    created_at: "2026-07-07T13:33:05.000Z"
  },
  {
    id: 14,
    name: "SUSI",
    title: "SEKRETARIS JENDERAL",
    content: "OMAIGATTT SOO GOOD BANGETTT PRODUCTNYA, PENGERJAAN CEPAT UI MANTAP DAN EXPERIENCE YANG DIDAPET SERUU BANGETTT",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=SUSI",
    rating: 4,
    approved: 1,
    created_at: "2026-07-07T13:38:11.000Z"
  },
  {
    id: 15,
    name: "Muhammad Hanif Prabowo",
    title: "CEO MF.KONVEKSI",
    content: "Keren dan sangat membantu untuk digitalisasi sistem bisnis dan operasional kami.",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=MuhammadHanifPrabowo",
    rating: 5,
    approved: 1,
    created_at: "2026-07-07T14:24:48.000Z"
  }
];

export interface StaticPricingPackage {
  id: number;
  name: string;
  price: string;
  original_price: string;
  period: string;
  billing_type: "monthly" | "annual" | "lifetime";
  features: string[];
  is_popular: number | boolean;
}

export const staticPricingPackages: StaticPricingPackage[] = [
  {
    id: 1,
    name: "Starter",
    price: "Rp299.000",
    original_price: "",
    period: "/bulan",
    billing_type: "monthly",
    features: ["25 User", "1 Admin", "Cloud Hosting", "Backup Harian", "SSL", "Update Sistem", "Support"],
    is_popular: 0
  },
  {
    id: 2,
    name: "Business",
    price: "Rp799.000",
    original_price: "Rp999.999",
    period: "/bulan",
    billing_type: "monthly",
    features: ["150 User", "Multi Admin", "Domain Gratis", "Cloud Hosting", "Backup", "API", "Prioritas Support"],
    is_popular: 1
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    original_price: "",
    period: "",
    billing_type: "monthly",
    features: ["Unlimited User", "Unlimited Cabang", "Dedicated Server", "Custom Fitur", "Integrasi API", "Training", "SLA"],
    is_popular: 0
  },
  {
    id: 7,
    name: "Starter",
    price: "Rp2.990.000",
    original_price: "",
    period: "/tahun",
    billing_type: "annual",
    features: ["25 User", "1 Admin", "Cloud Hosting", "Backup Harian", "SSL", "Update Sistem", "Support"],
    is_popular: 0
  },
  {
    id: 8,
    name: "Business",
    price: "Rp7.990.000",
    original_price: "",
    period: "/tahun",
    billing_type: "annual",
    features: ["150 User", "Multi Admin", "Domain Gratis", "Cloud Hosting", "Backup", "API", "Prioritas Support"],
    is_popular: 1
  },
  {
    id: 9,
    name: "Enterprise",
    price: "Custom",
    original_price: "",
    period: "",
    billing_type: "annual",
    features: ["Unlimited User", "Dedicated Account Manager", "Private Cloud Cluster", "Integrasi ERP Kustom", "Audit Keamanan", "SLA 99.9%"],
    is_popular: 0
  },
  {
    id: 4,
    name: "Basic License",
    price: "Rp12.000.000",
    original_price: "",
    period: "/sekali bayar",
    billing_type: "lifetime",
    features: ["Source Code", "Instalasi", "Dokumentasi", "1 Tahun Support"],
    is_popular: 0
  },
  {
    id: 5,
    name: "Professional",
    price: "Rp25.000.000",
    original_price: "",
    period: "/sekali bayar",
    billing_type: "lifetime",
    features: ["Source Code", "Custom Branding", "Training", "2 Tahun Support"],
    is_popular: 1
  },
  {
    id: 6,
    name: "Enterprise",
    price: "Custom",
    original_price: "",
    period: "Pricing",
    billing_type: "lifetime",
    features: ["Source Code", "Custom Development", "Integrasi Sistem", "Multi Cabang", "Maintenance"],
    is_popular: 0
  }
];
