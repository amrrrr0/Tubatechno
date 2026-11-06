"use client";

import React from "react";
import { FleavaHeroCanvas } from "./FleavaHeroCanvas";

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[90vh] lg:h-[calc(100vh-76px)] min-h-[660px] flex items-center overflow-hidden"
    >
      {/* Full-Bleed 3D Kinetic Canvas across entire Hero background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <FleavaHeroCanvas />
      </div>

      {/* Subtle Ambient Radial Lighting in Deep Blue & Black */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#38bdf8]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[700px] h-[700px] bg-[#0284c7]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Slide Layer Overlay: Bold, Balanced & Expansive */}
      <div className="w-full max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-full flex flex-col justify-between py-8 lg:py-12 relative z-10 font-jakarta pointer-events-none">
        {/* Core Slide Content */}
        <div className="my-auto max-w-3xl lg:max-w-[800px] xl:max-w-[880px]">
          {/* Master Headline: Bold, Confident Scale */}
          <h1 className="font-jakarta font-extrabold text-[44px] ss:text-[56px] md:text-[68px] lg:text-[78px] xl:text-[88px] 2xl:text-[94px] text-white tracking-[-0.035em] leading-[1.04] mb-7 drop-shadow-[0_4px_24px_rgba(4,6,13,0.85)]">
            Rekayasa Sistem. <br />
            <span className="text-[#38bdf8] font-light italic">
              Presisi Arsitektur.
            </span>
          </h1>

          {/* Subtitle: High-Contrast & Readable */}
          <p className="font-jakarta text-[16px] sm:text-[18px] md:text-[19.5px] text-slate-200/90 leading-[1.75] max-w-[620px] mb-10 font-normal drop-shadow-[0_2px_12px_rgba(4,6,13,0.95)]">
            TubaTechno adalah studio software developer independen asal Surakarta. Kami melayani jasa pembuatan website kustom, penyewaan web & sistem siap pakai, aplikasi mobile, hingga pemeliharaan infrastruktur digital terpadu untuk bisnis Anda.
          </p>

          {/* Action Buttons: Clean & Prominent */}
          <div className="flex flex-wrap items-center gap-4.5 w-full sm:w-auto font-jakarta pointer-events-auto">
            <a
              href="#contact"
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-[15px] text-slate-950 bg-white hover:bg-slate-100 transition-all duration-200 shadow-[0_0_24px_rgba(56,189,248,0.25)] hover:shadow-[0_0_36px_rgba(56,189,248,0.45)] text-center cursor-pointer select-none"
            >
              Konsultasi Proyek ↗
            </a>
            <a
              href="#product"
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-semibold text-[15px] text-white bg-[#080d1a]/85 hover:bg-[#0c1426] border border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-200 text-center cursor-pointer select-none backdrop-blur-md"
            >
              Eksplorasi Portofolio
            </a>
          </div>
        </div>

        {/* Minimalist Slide Footer Strip */}
        <div className="w-full flex items-center justify-between pt-5 border-t border-slate-800/60 text-[12px] text-slate-400 select-none pointer-events-auto font-jakarta">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium tracking-wide">STUDIO REKAYASA PERANGKAT LUNAK</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hidden sm:inline text-slate-400">SURAKARTA, INDONESIA</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <span>GULIR KE BAWAH</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
