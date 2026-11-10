"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  id: string;
  target: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  desc: string;
}

const statsData: StatItem[] = [
  {
    id: "s1",
    target: 50,
    suffix: "+",
    label: "Sistem & Aplikasi Dirilis",
    desc: "Produk web & seluler berskala produksi",
  },
  {
    id: "s2",
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Jaminan Uptime SLA Cloud",
    desc: "Arsitektur berkeandalan tinggi",
  },
  {
    id: "s3",
    target: 30,
    suffix: "+",
    label: "Klien & Mitra Institusi",
    desc: "Pendidikan, kesehatan & bisnis",
  },
  {
    id: "s4",
    target: 20,
    prefix: "< ",
    suffix: "ms",
    label: "Rata-rata Latensi Respons",
    desc: "Optimasi performa Core Web Vitals",
  },
];

export const LiveStats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate numbers with requestAnimationFrame
          const duration = 1600; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(
              statsData.map((stat) => {
                return stat.target * easeProgress;
              })
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts(statsData.map((stat) => stat.target));
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={containerRef} className="w-full my-8 sm:my-14 relative z-10 font-jakarta">
      <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(0,119,182,0.04)] p-6 sm:p-9 lg:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {statsData.map((stat, idx) => {
            const currentVal = counts[idx];
            const formatted = stat.decimals
              ? currentVal.toFixed(stat.decimals)
              : Math.round(currentVal);

            return (
              <div
                key={stat.id}
                className={`flex flex-col text-left ${
                  idx !== 0 ? "pt-5 sm:pt-0 sm:pl-7 lg:pl-8" : ""
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-[32px] sm:text-[40px] lg:text-[44px] text-slate-900 tracking-tight leading-none font-mono">
                    {stat.prefix}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6]">
                      {formatted}
                    </span>
                    {stat.suffix}
                  </span>
                </div>
                <span className="font-bold text-[13.5px] sm:text-[14.5px] text-slate-800 mt-2.5 leading-snug">
                  {stat.label}
                </span>
                <span className="text-[12px] text-slate-500 mt-1 leading-relaxed hidden sm:block">
                  {stat.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;
