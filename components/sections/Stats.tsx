"use client";

import React from "react";

const statsData = [
  {
    id: "stats-1",
    value: "50+",
    label: "Sistem & Aplikasi Dirilis",
    desc: "Produk web & mobile berskala produksi",
  },
  {
    id: "stats-2",
    value: "99.9%",
    label: "Uptime & Stabilitas Sistem",
    desc: "Keandalan arsitektur cloud teruji",
  },
  {
    id: "stats-3",
    value: "30+",
    label: "Klien & Mitra Korporasi",
    desc: "Pendidikan, kesehatan & enterprise",
  },
  {
    id: "stats-4",
    value: "< 20ms",
    label: "Rata-rata Latensi Respons",
    desc: "Optimasi performa tingkat kode",
  },
];

const Stats: React.FC = () => {
  return (
    <section className="w-full my-6 sm:my-10 relative z-10">
      <div className="w-full rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/70">
          {statsData.map((stat, index) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                index !== 0 ? "pt-6 sm:pt-0 sm:pl-8" : ""
              }`}
            >
              <span className="font-jakarta font-extrabold text-[32px] sm:text-[42px] text-white tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                {stat.value}
              </span>
              <span className="font-jakarta font-semibold text-[13px] sm:text-[14px] text-sky-400 mt-2.5">
                {stat.label}
              </span>
              <span className="font-jakarta text-[11px] sm:text-[12px] text-slate-500 mt-1 hidden sm:block">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
