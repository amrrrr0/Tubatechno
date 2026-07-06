import { people01, people02, people03, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star } from "@/public/assets";

export const navLinks = [
    {
        id: "home",
        title: "Beranda",
    },
    {
        id: "features",
        title: "Keunggulan",
    },
    {
        id: "product",
        title: "Layanan",
    },
    {
        id: "clients",
        title: "Mitra & Testimoni",
    },
];

export const features = [
    {
        id: "feature-1",
        icon: star,
        title: "Inovasi Akademis",
        content:
            "Dikembangkan di bawah naungan Universitas Muhammadiyah PKU Surakarta, menggabungkan riset mutakhir dengan teknologi industri.",
    },
    {
        id: "feature-2",
        icon: shield,
        title: "Sistem Aman & Teruji",
        content:
            "Kami memprioritaskan keamanan data dan stabilitas sistem di setiap baris kode yang kami rancang untuk kelancaran operasional Anda.",
    },
    {
        id: "feature-3",
        icon: send,
        title: "Solusi Kustom & Tepat Guna",
        content:
            "Setiap aplikasi dirancang spesifik untuk menjawab tantangan unik bisnis Anda, menjamin kegunaan maksimal bagi pengguna akhir.",
    },
];

export const feedback = [
    {
        id: "feedback-1",
        content:
            "Layanan web development HelioNexus sangat responsif. Web kustom kami membantu digitalisasi transaksi koperasi dengan sangat cepat dan mudah dipahami anggota.",
        name: "Dr. H. Ahmad Fauzi",
        title: "Ketua Koperasi Mitra Surakarta",
        img: people01,
    },
    {
        id: "feedback-2",
        content:
            "Integrasi IoT dari HelioNexus untuk otomatisasi sistem pemantauan klinik kami bekerja sangat akurat. Timnya sangat komunikatif dan profesional.",
        name: "Rina Astuti, S.Kep.",
        title: "Kepala Administrasi Klinik PKU",
        img: people02,
    },
    {
        id: "feedback-3",
        content:
            "Desain UI/UX aplikasi mobile yang dibuat sangat modern dan elegan. Pengguna kami sangat menyukai navigasinya yang intuitif dan estetik.",
        name: "Budi Prasetyo, M.T.",
        title: "Direktur PT Tekno Inovasi",
        img: people03,
    },
];

export const stats = [
    {
        id: "stats-1",
        title: "Proyek Selesai",
        value: "50+",
    },
    {
        id: "stats-2",
        title: "Klien & Mitra",
        value: "30+",
    },
    {
        id: "stats-3",
        title: "Kepuasan Klien",
        value: "99%",
    },
];

export const footerLinks = [
    {
        id: "footerLinks-1",
        title: "Layanan Kami",
        links: [
            {
                name: "Web Development",
                link: "#product",
            },
            {
                name: "Mobile Development",
                link: "#product",
            },
            {
                name: "UI/UX Design",
                link: "#product",
            },
            {
                name: "Kecerdasan Buatan (AI)",
                link: "#product",
            },
            {
                name: "Internet of Things (IoT)",
                link: "#product",
            },
        ],
    },
    {
        id: "footerLinks-2",
        title: "Komunitas & Riset",
        links: [
            {
                name: "UMPKU Surakarta",
                link: "https://itspkusurakarta.ac.id/",
            },
            {
                name: "UMKM Mitra",
                link: "#clients",
            },
            {
                name: "Publikasi Teknologi",
                link: "#",
            },
            {
                name: "Kemitraan Strategis",
                link: "#",
            },
            {
                name: "Program Magang",
                link: "#",
            },
        ],
    },
    {
        id: "footerLinks-3",
        title: "Hubungi Kami",
        links: [
            {
                name: "Konsultasi Gratis",
                link: "#home",
            },
            {
                name: "Hubungi Tim Ahli",
                link: "#",
            },
        ],
    },
];

export const socialMedia = [
    {
        id: "social-media-1",
        icon: instagram,
        link: "https://www.instagram.com/",
    },
    {
        id: "social-media-2",
        icon: facebook,
        link: "https://www.facebook.com/",
    },
    {
        id: "social-media-3",
        icon: twitter,
        link: "https://www.twitter.com/",
    },
    {
        id: "social-media-4",
        icon: linkedin,
        link: "https://www.linkedin.com/",
    },
];

export const clients = [
    {
        id: "client-1",
        logo: airbnb,
    },
    {
        id: "client-2",
        logo: binance,
    },
    {
        id: "client-3",
        logo: coinbase,
    },
    {
        id: "client-4",
        logo: dropbox,
    },
];