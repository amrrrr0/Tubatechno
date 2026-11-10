"use client";

import React from "react";

const workflowStages = [
  {
    step: "01",
    phase: "Tahap 01",
    title: "Analisis Kebutuhan & Cetak Biru",
    desc: "Pemetaan proses operasional bisnis ke dalam arsitektur teknis, desain skema data terstruktur, dan validasi spesifikasi sebelum pengembangan kode dimulai.",
    meta: "Spesifikasi Teknis & Skema Data",
  },
  {
    step: "02",
    phase: "Tahap 02",
    title: "Rekayasa Kode Bersih & Modular",
    desc: "Pengembangan komponen terisolasi berstandar Clean Architecture, penerapan prinsip type-safety, dan integrasi pipeline CI/CD untuk pengujian berkala.",
    meta: "Clean Architecture & CI/CD",
  },
  {
    step: "03",
    phase: "Tahap 03",
    title: "Uji Ketahanan & Audit Keamanan",
    desc: "Simulasi lonjakan beban trafik nyata, audit celah keamanan, dan verifikasi enkripsi data untuk menjamin sistem tetap tangguh dalam kondisi operasional puncak.",
    meta: "Audit Keamanan & Uji Beban",
  },
  {
    step: "04",
    phase: "Tahap 04",
    title: "Peluncuran & Alih Pengetahuan",
    desc: "Deployment lingkungan produksi tanpa gangguan layanan, penyerahan seluruh dokumentasi teknis, serta pendampingan tim internal agar mandiri mengelola sistem.",
    meta: "Zero-Downtime & Dokumentasi",
  },
];

const qualityCommitments = [
  {
    title: "Kepemilikan Penuh (100% IP)",
    desc: "Seluruh kode sumber, skema basis data, dan aset digital diserahkan utuh tanpa royalti atau lisensi vendor tertutup.",
    icon: (
      <svg className="w-5 h-5 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Standar Keamanan Berlapis",
    desc: "Enkripsi data at-rest & in-transit, pembatasan hak akses berbasis peran (RBAC), dan mitigasi ancaman siber berstandar industri.",
    icon: (
      <svg className="w-5 h-5 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Dokumentasi & Kemandirian",
    desc: "Panduan teknis API terperinci dan manual pengoperasian komprehensif agar tim Anda dapat mengelola sistem secara berdaya.",
    icon: (
      <svg className="w-5 h-5 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "Garansi Pasca Peluncuran",
    desc: "Dukungan teknis aktif terjadwal dan komitmen respons cepat pasca rilis untuk menjamin kelangsungan operasional bisnis tanpa cemas.",
    icon: (
      <svg className="w-5 h-5 text-[#0077b6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export const Billing: React.FC = () => {
  return (
    <section id="billing" className="w-full py-20 sm:py-28 relative z-10 font-jakarta border-t border-slate-200/80">
      {/* Section Header: Direct, Professional & Confident */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          STANDAR MUTU &amp; METODOLOGI REKAYASA
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.12] tracking-[-0.03em]">
          Disiplin Arsitektur. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Ketahanan Tanpa Kompromi.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-600 mt-4 leading-[1.75] font-normal max-w-2xl">
          Setiap produk yang kami bangun melewati tahapan rekayasa berstandar industri—menjamin kode yang terawat, keamanan data berlapis, dan perlindungan penuh atas investasi digital Anda.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 1. SIKLUS REKAYASA PRODUKSI: Connected Engineering Timeline  */}
      {/* ============================================================ */}
      <div className="w-full mb-16 sm:mb-20">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,119,182,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-7 mb-8 sm:mb-12 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0077b6] block mb-2">
                ALUR KERJA REKAYASA
              </span>
              <h3 className="text-[22px] sm:text-[26px] font-bold text-slate-900 tracking-tight">
                Dari Cetak Biru Teknis hingga Produksi Stabil
              </h3>
            </div>
            <span className="text-[12px] font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
              Metodologi Agile &amp; Clean Architecture
            </span>
          </div>

          {/* Stepper Timeline with Connecting Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {workflowStages.map((ws, idx) => (
              <div key={ws.step} className="relative flex flex-col justify-between">
                <div>
                  {/* Step Indicator & Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center font-mono font-bold text-[13px] text-[#0077b6] shadow-2xs">
                      {ws.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      {ws.phase}
                    </span>
                  </div>

                  <h4 className="font-bold text-[17px] sm:text-[18px] text-slate-900 tracking-tight leading-snug mb-2.5">
                    {ws.title}
                  </h4>

                  <p className="text-[13.5px] text-slate-600 leading-relaxed font-normal mb-5">
                    {ws.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11.5px] font-mono text-[#0077b6] font-semibold block">
                    {ws.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. JAMINAN INTEGRITAS SISTEM: Single Cohesive Trust Panel    */}
      {/* ============================================================ */}
      <div className="w-full">
        <div className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-10 lg:p-12">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0077b6] block mb-2">
              KOMITMEN KUALITAS
            </span>
            <h3 className="text-[22px] sm:text-[26px] font-bold text-slate-900 tracking-tight">
              4 Jaminan Integritas Sistem untuk Klien
            </h3>
            <p className="text-[14px] text-slate-600 mt-2 leading-relaxed">
              Kami memegang teguh integritas hasil kerja dengan kepastian kepemilikan dan transparansi menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityCommitments.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100/80 flex items-center justify-center mb-4 shadow-2xs">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[16px] text-slate-900 tracking-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billing;
