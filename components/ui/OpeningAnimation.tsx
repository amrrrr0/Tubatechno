"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { logo } from "@/public/assets";

export const OpeningAnimation: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock scroll during animation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Organic easing speed: faster at start, smooth near end
        const step = prev < 60 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 4) + 1;
        return Math.min(100, prev + step);
      });
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Small pause at 100% then trigger smooth curtain slide
      const timer = setTimeout(() => {
        setIsClosing(true);
      }, 200);

      // Remove from DOM after curtain slide transition completes
      const exitTimer = setTimeout(() => {
        setIsFinished(true);
        document.body.style.overflow = "";
      }, 950);

      return () => {
        clearTimeout(timer);
        clearTimeout(exitTimer);
      };
    }
  }, [progress]);

  if (isFinished) return null;

  const getStatusText = (val: number) => {
    if (val < 35) return "Memuat modul antarmuka...";
    if (val < 70) return "Inisialisasi sistem rekayasa...";
    if (val < 100) return "Menghubungkan layanan...";
    return "Sistem siap operasional";
  };

  return (
    <aside
      aria-label="Memuat TubaTechno"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f8fafc] font-jakarta select-none transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isClosing ? "-translate-y-full pointer-events-none" : "translate-y-0"
      }`}
    >
      {/* Soft Ambient White-Blue Lighting Halo */}
      <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#00b4d8]/20 via-[#0077b6]/15 to-transparent blur-[120px] pointer-events-none animate-pulse" />

      {/* Main Brand Content Box */}
      <div
        className={`relative z-10 flex flex-col items-center text-center transition-all duration-500 px-6 ${
          isClosing ? "opacity-0 -translate-y-6" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Glowing Logo Icon Container */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Subtle pulse ring */}
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#00b4d8]/20 to-[#0077b6]/20 blur-md animate-pulse" />

          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,180,216,0.15)] flex items-center justify-center p-3">
            <Image
              src={logo}
              alt="TubaTechno"
              width={54}
              height={54}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-extrabold text-[26px] sm:text-[32px] text-slate-900 tracking-tight leading-none">
          Tuba<span className="text-[#00b4d8]">Techno</span>
        </h1>

        <p className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.25em] text-[#0077b6] font-semibold mt-2">
          Software Engineering Studio
        </p>

        {/* Minimal Progress Bar & Counter */}
        <div className="w-[230px] sm:w-[270px] mt-8 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 truncate max-w-[190px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse shrink-0" />
              <span className="truncate">{getStatusText(progress)}</span>
            </span>
            <span className="font-bold text-slate-900 font-mono">{progress}%</span>
          </div>

          {/* Thin Progress Track */}
          <div className="w-full h-[3px] bg-slate-200/80 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] rounded-full transition-all duration-75 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip button if user wants immediate access */}
        <button
          type="button"
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              setIsFinished(true);
              document.body.style.overflow = "";
            }, 500);
          }}
          className="mt-8 text-[10.5px] font-mono text-slate-400 hover:text-slate-700 transition-colors cursor-pointer tracking-wider uppercase"
        >
          Lewati
        </button>
      </div>

      {/* Bottom Architectural Signature */}
      <div
        className={`absolute bottom-6 inset-x-0 text-center text-[10.5px] font-mono text-slate-400 tracking-widest uppercase transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-80"
        }`}
      >
        Surakarta, ID &middot; High Performance Digital Architecture
      </div>
    </aside>
  );
};

export default OpeningAnimation;
