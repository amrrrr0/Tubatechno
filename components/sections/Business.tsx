"use client";

import React from "react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  category: string;
  badge: string;
  title: string;
  desc: string;
  scope: string[];
  tags: string[];
  highlight: string;
  ctaLabel: string;
  ctaHref: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const services: ServiceItem[] = [
  {
    id: "01",
    category: "Full IP & Kustom",
    badge: "Bespoke Engineering",
    title: "Pembuatan Website & Sistem Informasi Kustom",
    desc: "Dirancang khusus dari nol mengikuti proses dan model bisnis Anda — tanpa template generik. Kode bersih, terstruktur, berkinerja tinggi, dan 100% kepemilikan source code milik Anda tanpa biaya lisensi tersembunyi.",
    scope: [
      "Website Korporat & Company Profile Responsif",
      "Sistem Informasi Manajemen, ERP & Dashboard",
      "Toko Online (E-Commerce) & Payment Gateway",
      "Optimasi Kecepatan Loading & Kepatuhan SEO Google",
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Laravel / PHP", "PostgreSQL"],
    highlight: "100% Hak Milik Source Code",
    ctaLabel: "Konsultasi Web Kustom",
    ctaHref: "#contact",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
        <line x1="11" y1="7" x2="11.01" y2="7" />
      </svg>
    ),
  },
  {
    id: "02",
    category: "Sewa Siap Pakai",
    badge: "Mulai 24 Jam",
    title: "Penyewaan Website & Sistem Bisnis All-In",
    desc: "Solusi cepat bagi UMKM, instansi, dan bisnis yang ingin langsung online tanpa modal pembuatan besar. Seluruh kebutuhan teknis — domain bisnis, server cloud NVMe super cepat, SSL, hingga backup rutin — kami kelola penuh.",
    scope: [
      "Website & Sistem Siap Pakai Langsung Aktif 24 Jam",
      "Sudah Termasuk Domain Bisnis & Cloud NVMe Cepat",
      "Gratis Pemeliharaan Rutin & Backup Data Harian",
      "Pilihan Langganan Fleksibel (Bulanan / Tahunan)",
    ],
    tags: ["SaaS Siap Pakai", "Cloud NVMe", "SSL Otomatis", "Free Maintenance", "Backup Terjadwal"],
    highlight: "Mulai Rp 199rb /bulan",
    ctaLabel: "Pilih Paket Sewa Web",
    ctaHref: "/pricing",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <polyline points="13 11 16 14 13 17" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    ),
  },
  {
    id: "03",
    category: "Android & iOS",
    badge: "Cross-Platform",
    title: "Pembuatan Aplikasi Mobile Multiplatform",
    desc: "Aplikasi seluler berkinerja tinggi untuk perangkat Android dan iOS. Menghadirkan antarmuka modern, navigasi intuitif, notifikasi push real-time, sinkronisasi cloud, serta asistensi rilis di Play Store & App Store.",
    scope: [
      "Aplikasi Mobile untuk Google Play Store & Apple App Store",
      "Notifikasi Push Otomatis & Otentikasi Multi-Level",
      "Sinkronisasi Cloud Real-Time & Arsitektur Offline-First",
      "Desain UI/UX Eksklusif Berorientasi Pengalaman Pengguna",
    ],
    tags: ["Flutter", "React Native", "Android & iOS", "Firebase", "REST API", "Push Notification"],
    highlight: "Terbit di Play Store & App Store",
    ctaLabel: "Konsultasi Aplikasi Mobile",
    ctaHref: "#contact",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="9" y1="5" x2="15" y2="5" />
      </svg>
    ),
  },
  {
    id: "04",
    category: "SLA Uptime 99.9%",
    badge: "Monitoring 24/7",
    title: "Pemeliharaan Website & IT Support Terpadu",
    desc: "Dukungan teknis menyeluruh agar sistem digital bisnis Anda selalu beroperasi lancar, aman dari ancaman siber, dan selalu mutakhir. Kami siap menangani perbaikan bug, audit keamanan, migrasi server, dan pendampingan darurat.",
    scope: [
      "Monitoring Server & Uptime 24/7 untuk Mencegah Down",
      "Audit Keamanan Siber & Proteksi Malware / Anti-DDoS",
      "Pembaruan Konten Berkala, Optimasi Speed & Patching",
      "Migrasi Cloud Server Tanpa Downtime & Dukungan Prioritas",
    ],
    tags: ["Cloud VPS / Linux", "Cloudflare Protection", "Database Backup", "Bug Fixing", "Speed Optimization"],
    highlight: "Jaminan Uptime 99.9%",
    ctaLabel: "Konsultasi IT Support",
    ctaHref: "#contact",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export const Business: React.FC = () => {
  return (
    <section id="features" className="w-full py-20 sm:py-28 relative z-10 font-jakarta scroll-mt-28 sm:scroll-mt-32">
      {/* Section Header: Direct, Human & Confident */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          LAYANAN &amp; KAPABILITAS TEKNOLOGI
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.14] tracking-[-0.03em]">
          Solusi Rekayasa IT untuk <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Pertumbuhan Bisnis Nyata.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-600 mt-4 leading-[1.75] font-normal max-w-2xl">
          Dari website kustom berkemampuan tinggi, sistem sewa siap pakai tanpa beban modal awal, hingga aplikasi mobile dan infrastruktur cloud terpadu.
        </p>
      </div>

      {/* Modern 2x2 Architectural Capability Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_20px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 overflow-hidden hover:-translate-y-1 font-jakarta p-6 sm:p-8"
            >
              {/* Top Accent Gradient Line on Hover */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#00b4d8] to-[#0077b6] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <div>
                {/* Top Meta Row */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/70 border border-sky-100 flex items-center justify-center text-[#0077b6] group-hover:scale-105 group-hover:bg-sky-100/70 transition-all duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md">
                      #{service.id}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-[20px] sm:text-[23px] font-bold text-slate-900 group-hover:text-[#0077b6] transition-colors tracking-tight leading-snug">
                  {service.title}
                </h3>
                <p className="text-[14px] sm:text-[14.5px] text-slate-600 leading-relaxed font-normal mt-3">
                  {service.desc}
                </p>

                {/* Deliverables Checklist */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    Deliverables &amp; Ruang Lingkup
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.scope.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[13px] text-slate-700 leading-snug">
                        <svg
                          className="w-4 h-4 text-[#00b4d8] shrink-0 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Ecosystem Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 text-[11.5px] font-medium font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action Row */}
              <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-[#00b4d8]" />
                  <span>{service.highlight}</span>
                </div>

                <a
                  href={service.ctaHref}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0077b6] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
                >
                  {service.ctaLabel}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Business;
