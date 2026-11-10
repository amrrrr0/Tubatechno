"use client";

import React from "react";
import { FleavaHeroCanvas } from "./FleavaHeroCanvas";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[90vh] lg:h-[calc(100vh-76px)] min-h-[660px] flex items-center overflow-hidden bg-transparent"
    >
      {/* Full-Bleed 3D Kinetic Canvas across entire Hero background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <FleavaHeroCanvas />
      </div>

      {/* Subtle Ambient Radial Lighting in Logo White-Blue & Cyan */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#00b4d8]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[700px] h-[700px] bg-[#0077b6]/8 rounded-full blur-[180px] pointer-events-none" />

      {/* Slide Layer Overlay: Bold, Balanced & Expansive */}
      <div className="w-full max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-full flex flex-col justify-between py-8 lg:py-12 relative z-10 font-jakarta pointer-events-none">
        {/* Core Slide Content */}
        <div className="my-auto max-w-3xl lg:max-w-[800px] xl:max-w-[880px]">
          {/* Master Headline: Bold, Confident Scale */}
          <h1 className="font-jakarta font-extrabold text-[44px] ss:text-[56px] md:text-[68px] lg:text-[78px] xl:text-[88px] 2xl:text-[94px] text-slate-900 tracking-[-0.035em] leading-[1.04] mb-7">
            Rekayasa Sistem. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#0077b6] to-[#0284c7] font-semibold italic">
              Presisi Arsitektur.
            </span>
          </h1>

          {/* Subtitle: High-Contrast & Readable */}
          <p className="font-jakarta text-[16px] sm:text-[18px] md:text-[19.5px] text-slate-600 leading-[1.75] max-w-[620px] mb-10 font-normal">
            TubaTechno adalah studio software developer independen asal Surakarta. Kami melayani jasa pembuatan website kustom, penyewaan web &amp; sistem bisnis siap pakai, aplikasi mobile, hingga pemeliharaan infrastruktur digital terpadu.
          </p>

          {/* Action Buttons: Clean & Prominent */}
          <div className="flex flex-wrap items-center gap-4.5 w-full sm:w-auto font-jakarta pointer-events-auto">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[14.5px] text-white bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#023e8a] shadow-[0_4px_20px_rgba(0,180,216,0.25)] hover:shadow-[0_6px_28px_rgba(0,180,216,0.4)] transition-all duration-200 text-center cursor-pointer select-none"
            >
              <span>Konsultasi Proyek</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="#product"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-[14.5px] text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#00b4d8] shadow-xs transition-all duration-200 text-center cursor-pointer select-none"
            >
              <span>Eksplorasi Portofolio</span>
            </a>
          </div>
        </div>

        {/* Minimalist Slide Footer Strip */}
        <div className="w-full flex items-center justify-between pt-5 border-t border-slate-200/90 text-[12px] text-slate-500 select-none pointer-events-auto font-jakarta">
          <div className="flex items-center gap-3">
            <span className="text-slate-700 font-semibold tracking-wide">STUDIO REKAYASA PERANGKAT LUNAK</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500">SURAKARTA, INDONESIA</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors">
            <span className="font-medium">GULIR KE BAWAH</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
