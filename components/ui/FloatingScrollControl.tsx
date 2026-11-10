"use client";

import React, { useEffect, useState } from "react";

export const FloatingScrollControl: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
        setScrollProgress(pct);
      }
      setIsVisible(scrollTop > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[950] font-jakarta transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="group relative w-12 h-12 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_8px_24px_rgba(0,119,182,0.12)] hover:shadow-[0_12px_32px_rgba(0,180,216,0.22)] flex items-center justify-center transition-all cursor-pointer focus:outline-none"
        aria-label="Kembali ke atas"
      >
        {/* SVG Circular Scroll Progress Ring */}
        <svg className="w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="url(#scroll_gradient_pill)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
          <defs>
            <linearGradient id="scroll_gradient_pill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Upward Chevron Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-700 group-hover:text-[#0077b6] transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-y-0.5 transition-transform"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>

        {/* Floating Tooltip Pill on Hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md">
          {scrollProgress}% &middot; Ke Atas
        </span>
      </button>
    </div>
  );
};

export default FloatingScrollControl;
