"use client";

import React, { useState } from "react";

interface Capability {
  number: string;
  category: string;
  badge: string;
  title: string;
  tagline: string;
  desc: string;
  metric: string;
  scope: string[];
  tags: string[];
  ctaLabel: string;
}

const capabilities: Capability[] = [
  {
    number: "01",
    category: "JASA PEMBUATAN WEB",
    badge: "Full IP & Kustom",
    title: "Pembuatan Website & Sistem Informasi Kustom",
    tagline: "Company Profile · Toko Online · Portal Bisnis · Web App Kustom",
    desc: "Layanan pembuatan website profesional yang dirancang khusus sesuai identitas dan alur bisnis Anda. Memiliki tampilan eksklusif, navigasi cepat, optimasi SEO untuk kemudahan pencarian Google, dan 100% kepemilikan aset digital tanpa biaya lisensi tersembunyi.",
    metric: "100% Hak Milik Source Code · SEO & Mobile Friendly",
    scope: [
      "Website Profil Perusahaan (Company Profile) Eksklusif & Responsif",
      "Toko Online (E-Commerce) dengan Integrasi Payment Gateway & Ongkir",
      "Sistem Informasi Manajemen, Dashboard Admin & Portal Bisnis",
      "Optimasi Kecepatan Loading (Core Web Vitals) & Kepatuhan SEO Google",
    ],
    tags: ["Next.js", "React", "Laravel / PHP", "Tailwind CSS", "MySQL / PostgreSQL", "REST API"],
    ctaLabel: "Konsultasi Pembuatan Web",
  },
  {
    number: "02",
    category: "PENYEWAAN WEB & SAAS",
    badge: "Mulai 24 Jam",
    title: "Penyewaan Website & Sistem Bisnis Siap Pakai",
    tagline: "Hemat Modal Awal · All-In Server & Perawatan · Langsung Aktif",
    desc: "Solusi efisien bagi UMKM, instansi, dan pelaku usaha yang ingin langsung go-digital tanpa modal pembuatan yang besar. Cukup berlangganan bulanan atau tahunan terjangkau, seluruh kebutuhan teknis—mulai domain, server cloud cepat, hingga perbaikan rutin—kami kelola penuh.",
    metric: "Siap Operasional 24 Jam · All-In Hosting, Domain & Maintenance",
    scope: [
      "Website & Sistem Siap Pakai Langsung Tayang Tanpa Menunggu Lama",
      "Paket Langganan Fleksibel (Bulanan / Tahunan) dengan Biaya Ringan",
      "Sudah Termasuk Domain Bisnis, Cloud Hosting NVMe Cepat & SSL",
      "Gratis Pemeliharaan Rutin, Backup Data Harian Otomatis & Bantuan Teknis",
    ],
    tags: ["SaaS Siap Pakai", "Cloud Hosting NVMe", "SSL Otomatis", "Free Maintenance", "Backup Terjadwal"],
    ctaLabel: "Pilih Paket Sewa Web",
  },
  {
    number: "03",
    category: "APLIKASI MOBILE",
    badge: "Android & iOS",
    title: "Pembuatan Aplikasi Mobile (Android & iOS)",
    tagline: "Aplikasi Bisnis · Portal Layanan Pelanggan · Kasir / POS Seluler",
    desc: "Pengembangan aplikasi seluler berkinerja tinggi untuk perangkat Android dan iOS. Menghadirkan antarmuka modern, navigasi intuitif, sinkronisasi data cloud real-time, dan pendampingan penuh hingga aplikasi resmi terbit di Google Play Store dan Apple App Store.",
    metric: "Cross-Platform Cepat · Publikasi Play Store & App Store",
    scope: [
      "Aplikasi Seluler Kustom untuk Platform Android (Play Store) & iOS (App Store)",
      "Fitur Notifikasi Push Otomatis, Otentikasi Pengguna & Sinkronisasi Cloud",
      "Integrasi Backend Cloud, Database Terenkripsi & Akses Cepat",
      "Perancangan UI/UX Interaktif yang Memudahkan Interaksi Pengguna",
    ],
    tags: ["Flutter", "React Native", "Android & iOS", "Firebase", "API Gateway", "Push Notification"],
    ctaLabel: "Konsultasi Aplikasi Mobile",
  },
  {
    number: "04",
    category: "IT SUPPORT & MAINTENANCE",
    badge: "SLA Uptime 99.9%",
    title: "Pemeliharaan Website & IT Support Terpadu",
    tagline: "Perawatan Rutin · Pembersihan Bug · Optimasi Server & Keamanan",
    desc: "Dukungan teknis menyeluruh untuk memastikan website dan sistem digital bisnis Anda selalu beroperasi lancar, aman dari serangan siber, dan selalu up-to-date. Kami siap menangani perbaikan kendala teknis, audit keamanan, migrasi server, hingga pendampingan darurat.",
    metric: "Jaminan Uptime 99.9% · Monitoring & Perlindungan Sistem 24/7",
    scope: [
      "Monitoring Server & Uptime 24/7 untuk Mencegah Website Down",
      "Audit & Proteksi Keamanan Siber (Pembersihan Malware & Anti-DDoS)",
      "Pembaruan Konten Berkala, Optimasi Kecepatan & Patching Bug",
      "Migrasi Server Cloud, Manajemen Backup Rutin & Dukungan Prioritas",
    ],
    tags: ["Cloud VPS / Linux", "Cloudflare Protection", "Database Backup", "Bug Fixing", "Speed Optimization"],
    ctaLabel: "Konsultasi IT Support",
  },
];

export const Business: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="features" className="w-full py-20 sm:py-28 relative z-10 font-jakarta scroll-mt-28 sm:scroll-mt-32">
      {/* Section Header: Direct, Human & Confident */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#38bdf8] uppercase mb-3 block">
          LAYANAN & SOLUSI TEKNOLOGI IT
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-white leading-[1.14] tracking-[-0.03em]">
          Solusi Pengembang IT untuk <br className="hidden sm:inline" />
          <span className="text-[#38bdf8] font-light italic">
            Pertumbuhan Bisnis Nyata.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-300 mt-4 leading-[1.75] font-normal max-w-2xl">
          Kami menyediakan layanan pengembangan perangkat lunak komprehensif — mulai dari pembuatan website kustom, sistem sewa web siap pakai, aplikasi mobile, hingga pemeliharaan infrastruktur IT terpadu.
        </p>
      </div>

      {/* Structured Capability Rows */}
      <div className="w-full space-y-3.5 sm:space-y-4">
        {capabilities.map((cap, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={cap.number}
              className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                isOpen
                  ? "bg-[#070b14]/95 border-[#38bdf8]/50 shadow-[0_10px_30px_rgba(56,189,248,0.08)]"
                  : "bg-[#070b14]/70 border-slate-800/80 hover:border-slate-700/80 hover:bg-[#070b14]/90"
              }`}
            >
              {/* Row Header Trigger */}
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full p-5 sm:p-7 flex items-center justify-between text-left group transition-all cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 pr-4">
                  {/* Number Badge */}
                  <span
                    className={`font-mono text-[13px] sm:text-[14px] font-bold px-3 py-1 rounded-lg border transition-colors shrink-0 ${
                      isOpen
                        ? "bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]"
                        : "bg-slate-900/90 border-slate-800 text-slate-400 group-hover:text-[#38bdf8] group-hover:border-slate-700"
                    }`}
                  >
                    {cap.number}
                  </span>

                  {/* Title & Tagline Stacked Vertically */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3
                      className={`text-[18px] sm:text-[21px] lg:text-[23px] font-bold tracking-tight transition-colors leading-snug ${
                        isOpen ? "text-[#38bdf8]" : "text-white group-hover:text-[#38bdf8]"
                      }`}
                    >
                      {cap.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-slate-400 font-normal mt-1 truncate">
                      {cap.tagline}
                    </p>
                  </div>
                </div>

                {/* Right Column: Badge & Chevron */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="hidden md:inline-flex text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                    {cap.badge}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "border-[#38bdf8]/60 bg-[#38bdf8]/15 text-[#38bdf8] rotate-180"
                        : "border-slate-800 bg-slate-900 text-slate-400 group-hover:border-slate-700 group-hover:text-white"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Row Expanded Specification Panel */}
              {isOpen && (
                <div className="px-5 sm:px-7 pb-7 sm:pb-8 pt-0 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 pt-6 border-t border-slate-800/80">
                    {/* Column 1: Deskripsi & Pendekatan Teknis */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-[0.18em] block mb-2.5">
                          DESKRIPSI & KEUNGGULAN LAYANAN
                        </span>
                        <p className="text-[14.5px] sm:text-[15px] text-slate-300 leading-relaxed font-normal mb-5">
                          {cap.desc}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#050811] border border-slate-800/80 text-[12px] text-slate-300 font-mono mb-6">
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                          <span>{cap.metric}</span>
                        </div>
                      </div>

                      <div>
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-[#38bdf8] text-white hover:text-[#38bdf8] text-[13px] font-semibold transition-all group/btn shadow-sm"
                        >
                          <span>{cap.ctaLabel}</span>
                          <svg
                            className="w-3.5 h-3.5 text-[#38bdf8] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Column 2: Ruang Lingkup Layanan */}
                    <div className="lg:col-span-4">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3.5">
                        Ruang Lingkup & Deliverables
                      </span>
                      <div className="space-y-3">
                        {cap.scope.map((item, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-3 text-[13.5px] text-slate-300 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Ekosistem & Stack Terverifikasi */}
                    <div className="lg:col-span-3">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3.5">
                        Teknologi & Ekosistem
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cap.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1.5 rounded-lg bg-[#050811] border border-slate-800 text-slate-300 text-[12px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Business;
