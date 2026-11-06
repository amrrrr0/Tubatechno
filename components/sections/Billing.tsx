"use client";

import React from "react";

const workflowStages = [
  {
    step: "01",
    phase: "Tahap 1",
    title: "Perancangan Arsitektur",
    desc: "Pemetaan kebutuhan operasional ke dalam cetak biru teknis, pemilihan tech stack optimal, dan perancangan skema data berkeandalan tinggi.",
    deliverables: ["Cetak Biru Arsitektur Sistem", "Desain Skema Basis Data", "Dokumen Spesifikasi Teknis"],
  },
  {
    step: "02",
    phase: "Tahap 2",
    title: "Rekayasa Kode Bersih & Modular",
    desc: "Pengembangan komponen terisolasi berstandar industri, penerapan type-safety, dan integrasi pipeline CI/CD untuk pengujian berkala.",
    deliverables: ["Clean Architecture Codebase", "Otomasi Pengujian CI/CD", "Integrasi Modul Terpisah"],
  },
  {
    step: "03",
    phase: "Tahap 3",
    title: "Pengujian & Audit Ketahanan",
    desc: "Uji penetrasi keamanan data, verifikasi enkripsi at-rest/in-transit, serta simulasi lonjakan trafik untuk memastikan performa tetap stabil.",
    deliverables: ["Simulasi Uji Beban P99", "Audit Keamanan & Celah Enkripsi", "Optimasi Kueri & Latensi"],
  },
  {
    step: "04",
    phase: "Tahap 4",
    title: "Penerapan Produksi & Garansi",
    desc: "Rilis sistem ke lingkungan produksi tanpa gangguan layanan, pemantauan telemetri aktif, dan penyerahan dokumentasi teknis lengkap.",
    deliverables: ["Deployment Zero-Downtime", "Dokumentasi Lengkap Sistem", "Dukungan Teknis Pasca Rilis"],
  },
];

const qualityPillars = [
  {
    number: "01",
    title: "Kepemilikan Penuh (100% IP)",
    desc: "Seluruh source code, skema basis data, dan aset digital diserahkan penuh kepada klien tanpa ketergantungan lisensi tertutup.",
  },
  {
    number: "02",
    title: "Standar Keamanan Berlapis",
    desc: "Penerapan enkripsi data at-rest & in-transit, isolasi peran pengguna bertingkat, dan mitigasi ancaman siber berstandar industri.",
  },
  {
    number: "03",
    title: "Dokumentasi Arsitektur Lengkap",
    desc: "Dokumentasi API terperinci, manual pengoperasian, dan cetak biru arsitektur data agar tim internal klien dapat mengelola sistem secara mandiri.",
  },
  {
    number: "04",
    title: "Garansi & Pemeliharaan Pasca Rilis",
    desc: "Pendampingan teknis terjadwal dan respons cepat pasca peluncuran untuk menjamin stabilitas dan kelancaran bisnis Anda.",
  },
];

export const Billing: React.FC = () => {
  return (
    <section id="billing" className="w-full py-20 sm:py-28 relative z-10 font-jakarta border-t border-slate-800/80">
      {/* Section Header: Direct & Confident */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#38bdf8] uppercase mb-3 block">
          STANDAR MUTU & METODOLOGI REKAYASA
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-white leading-[1.12] tracking-[-0.03em]">
          Keandalan Arsitektur. <br className="hidden sm:inline" />
          <span className="text-[#38bdf8] font-light italic">
            Keamanan Tanpa Kompromi.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-300 mt-4 leading-[1.75] font-normal max-w-2xl">
          Kami tidak mengambil jalan pintas. Setiap sistem dibangun dengan prinsip kode bersih, kepemilikan mandiri bagi klien, dan ketahanan terhadap lonjakan beban operasional riil.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 1. SIKLUS REKAYASA PRODUKSI: 4 Clean Linear Stages           */}
      {/* ============================================================ */}
      <div className="w-full mb-16 sm:mb-20">
        <div className="rounded-2xl bg-[#070b14]/90 border border-slate-800/80 p-7 sm:p-10 backdrop-blur-xl">
          <div className="pb-6 mb-8 border-b border-slate-800/70">
            <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">
              Siklus Rekayasa & Alur Kerja Produksi
            </h3>
            <p className="text-[14px] text-slate-400 mt-1">
              Tahapan sistematis dari validasi konsep hingga sistem aktif beroperasi di server produksi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowStages.map((ws) => (
              <div
                key={ws.step}
                className="flex flex-col justify-between p-6 rounded-xl bg-[#050811]/80 border border-slate-800/80 hover:border-sky-500/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-wider">
                      {ws.phase}
                    </span>
                    <span className="text-[16px] font-bold text-slate-500">
                      {ws.step}
                    </span>
                  </div>

                  <h4 className="font-bold text-[17px] text-white tracking-tight mb-2">
                    {ws.title}
                  </h4>

                  <p className="text-[13px] text-slate-300 leading-relaxed font-normal mb-5">
                    {ws.desc}
                  </p>

                  <div className="space-y-1.5 pt-4 border-t border-slate-800/60">
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Keluaran:
                    </span>
                    {ws.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-[12px] text-slate-300">
                        <span className="text-[#38bdf8] font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PILAR STANDAR MUTU: 4 Clean Minimalist Guarantee Cards     */}
      {/* ============================================================ */}
      <div className="w-full">
        <div className="mb-6">
          <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#38bdf8] block mb-1">
            KOMITMEN KUALITAS
          </span>
          <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">
            4 Jaminan Integritas Sistem untuk Klien
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {qualityPillars.map((pillar) => (
            <div
              key={pillar.number}
              className="p-6 rounded-xl bg-[#070b14]/80 border border-slate-800/80 hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-[#38bdf8] block mb-3">
                  {pillar.number}
                </span>

                <h4 className="font-bold text-[16px] text-white tracking-tight mb-2">
                  {pillar.title}
                </h4>

                <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Billing;