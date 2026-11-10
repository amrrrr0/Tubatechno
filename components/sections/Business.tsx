"use client";

import React from "react";
import Link from "next/link";

export const Business: React.FC = () => {
  return (
    <section id="features" className="w-full py-20 sm:py-28 relative z-10 font-jakarta scroll-mt-28 sm:scroll-mt-32">
      {/* Section Header: Direct, Human & High-Craft */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          LAYANAN REKAYASA DIGITAL
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.14] tracking-[-0.03em]">
          Solusi Arsitektur Sistem untuk <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Kebutuhan Bisnis Nyata.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-600 mt-4 leading-[1.75] font-normal max-w-2xl">
          Dari pengembangan sistem kustom berkapabilitas tinggi dengan 100% kepemilikan kode, platform sewa siap pakai tanpa beban modal, hingga aplikasi mobile terintegrasi.
        </p>
      </div>

      {/* Asymmetric Engineering Bento Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 w-full">
        {/* ============================================================ */}
        {/* 1. FLAGSHIP HERO CARD: Web & Custom Enterprise System (Spans 12 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-12 rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_24px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 overflow-hidden relative group">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#00b4d8] via-[#0077b6] to-[#00b4d8] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          <div className="p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-100/80 text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  Rekayasa Kustom · Full IP Ownership
                </div>

                <h3 className="text-[24px] sm:text-[30px] font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#0077b6] transition-colors">
                  Pembuatan Website &amp; Sistem Informasi Kustom
                </h3>

                <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed font-normal mt-4">
                  Dirancang dari nol mengikuti proses kerja unik institusi Anda—tanpa ketergantungan template pasaran atau plugin rentan. Seluruh kode sumber, basis data, dan hak kekayaan intelektual (IP) diserahkan 100% utuh tanpa biaya royalti tersembunyi.
                </p>

                {/* Key Architectural Differentiators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-50 text-[#0077b6] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-[13px] block">Kode Bersih &amp; Modular</span>
                      <span className="text-slate-500 text-[12px]">Type-safe, mudah dipelihara, dan siap diskalakan.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-50 text-[#0077b6] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-[13px] block">Kecepatan Sub-Detik</span>
                      <span className="text-slate-500 text-[12px]">Optimasi Core Web Vitals untuk pengalaman instan.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-50 text-[#0077b6] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-[13px] block">Otentikasi &amp; RBAC Aman</span>
                      <span className="text-slate-500 text-[12px]">Pembatasan hak akses berjenjang dan proteksi data.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-50 text-[#0077b6] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-[13px] block">Integrasi API &amp; Payment</span>
                      <span className="text-slate-500 text-[12px]">Sinkronisasi multi-sistem, gateway, dan analitik.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-[#0077b6] text-white text-[13.5px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  Konsultasi Arsitektur Web Kustom
                </a>
                <span className="text-[12px] text-slate-500 font-mono">
                  SLA Garansi Pasca Rilis &middot; Full Source Code
                </span>
              </div>
            </div>

            {/* Right Interactive Architecture Blueprint Visualization */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/40 border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11.5px] font-mono font-semibold text-slate-700">Production Architecture</span>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-50 text-[#0077b6] px-2 py-0.5 rounded border border-sky-100">
                    High Concurrency
                  </span>
                </div>

                {/* Architecture Layers */}
                <div className="space-y-3 font-mono text-[11.5px]">
                  {/* Layer 1: Client Experience */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                      <span>Frontend Experience</span>
                      <span className="text-emerald-600 font-semibold">&lt;100ms TTFB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Next.js 15 &middot; React &middot; Tailwind</span>
                      <span className="text-slate-500 text-[10.5px]">Edge Optimized</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1 text-[#00b4d8]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>

                  {/* Layer 2: API & Logic */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                      <span>Business Logic &amp; Security</span>
                      <span className="text-[#0077b6] font-semibold">RBAC Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Laravel 11 / Express &middot; RESTful API</span>
                      <span className="text-slate-500 text-[10.5px]">Stateless Auth</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1 text-[#00b4d8]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>

                  {/* Layer 3: Persistence & Cloud */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                      <span>Data Persistence</span>
                      <span className="text-slate-500">Auto Backup</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">MySQL 8 / PostgreSQL &middot; NVMe Cloud</span>
                      <span className="text-emerald-600 font-semibold text-[10.5px]">99.9% Uptime</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Audit Kualitas: Standar Clean Code</span>
                  <span className="text-emerald-600 font-bold">100% Passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. COMPANION CARD: Penyewaan Sistem & Website Siap Pakai (4 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_24px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                Siap Beroperasi 24 Jam
              </span>
              <span className="text-[12px] font-bold text-slate-900 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                Rp 199rb<span className="text-slate-500 font-normal text-[10px]">/bln</span>
              </span>
            </div>

            <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-[#0077b6] transition-colors tracking-tight leading-snug">
              Penyewaan Website &amp; Sistem Bisnis All-In
            </h3>

            <p className="text-[13.5px] text-slate-600 leading-relaxed font-normal mt-3">
              Solusi tanpa modal pembuatan besar bagi UMKM, instansi, dan toko bisnis yang ingin langsung memiliki website resmi. Seluruh urusan teknis—domain, hosting NVMe kencang, sertifikat SSL, dan perawatan rutin—kami kelola penuh.
            </p>

            <div className="mt-5 space-y-2.5 pt-5 border-t border-slate-100 text-[12.5px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Langsung aktif dalam 24 jam tanpa antre</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Termasuk domain bisnis &amp; hosting NVMe cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Gratis backup otomatis &amp; perbaikan kendala</span>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-100">
            <Link
              href="/pricing"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-[13px] bg-slate-900 hover:bg-[#0077b6] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              Pilih Paket Sewa Sistem
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. COMPANION CARD: Pembuatan Aplikasi Mobile (4 cols)         */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_24px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider">
                Android &amp; iOS Multiplatform
              </span>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">
                Store Ready
              </span>
            </div>

            <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-[#0077b6] transition-colors tracking-tight leading-snug">
              Pembuatan Aplikasi Mobile
            </h3>

            <p className="text-[13.5px] text-slate-600 leading-relaxed font-normal mt-3">
              Aplikasi seluler berkinerja tinggi untuk operasional internal, portal pelanggan, atau aplikasi layanan. Antarmuka modern yang nyaman dipakai, sinkronisasi data cloud real-time, dan asistensi terbit di Google Play Store &amp; App Store.
            </p>

            <div className="mt-5 space-y-2.5 pt-5 border-t border-slate-100 text-[12.5px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Flutter &amp; React Native berkinerja tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Notifikasi push otomatis &amp; otentikasi aman</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Arsitektur offline-first dengan auto sync</span>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-100">
            <a
              href="#contact"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-[13px] bg-slate-900 hover:bg-[#0077b6] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              Konsultasi Aplikasi Mobile
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. COMPANION CARD: Managed Cloud & IT Support (4 cols)        */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_24px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider">
                Monitoring 24/7 Terpadu
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                99.9% Uptime
              </span>
            </div>

            <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-[#0077b6] transition-colors tracking-tight leading-snug">
              Pemeliharaan Website &amp; IT Support
            </h3>

            <p className="text-[13.5px] text-slate-600 leading-relaxed font-normal mt-3">
              Dukungan teknis menyeluruh agar sistem digital bisnis Anda selalu aman dari ancaman siber, bebas down, dan berkinerja stabil. Menangani perbaikan bug mendadak, audit keamanan, migrasi cloud server, serta pemulihan darurat.
            </p>

            <div className="mt-5 space-y-2.5 pt-5 border-t border-slate-100 text-[12.5px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Pengawasan server 24 jam mencegah downtime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Proteksi malware, firewall &amp; mitigasi DDoS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                <span>Migrasi cloud lancar tanpa kehilangan data</span>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-slate-100">
            <a
              href="#contact"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-[13px] bg-slate-900 hover:bg-[#0077b6] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              Konsultasi IT Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
