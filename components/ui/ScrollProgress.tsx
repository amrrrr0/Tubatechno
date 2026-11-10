"use client";

import React, { useEffect, useState } from "react";

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(pct);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-[68px] sm:top-[76px] left-0 right-0 h-[2.5px] z-[998] pointer-events-none bg-slate-200/40"
    >
      <div
        className="h-full bg-gradient-to-r from-[#00b4d8] via-[#0077b6] to-[#00b4d8] transition-all duration-75 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Leading glowing pulse dot */}
        {scrollProgress > 2 && scrollProgress < 99 && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00f6ff] shadow-[0_0_8px_#00b4d8]" />
        )}
      </div>
    </div>
  );
};

export default ScrollProgress;
