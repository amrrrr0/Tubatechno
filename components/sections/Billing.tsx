"use client";

import React, { useEffect, useState } from "react";
import styles, { layout } from "@/styles/style";

interface BusinessUnit {
  id: number;
  title: string;
  category: string;
  tagline: string;
}

const staticFallbackUnits: BusinessUnit[] = [
  { id: 1, title: "UMPKU Tirta", category: "Layanan Umum", tagline: "Air Minum Alami" },
  { id: 2, title: "UMPKU Boga", category: "Layanan Umum", tagline: "Kuliner & Katering" },
  { id: 3, title: "HelioNexus", category: "Solusi Digital", tagline: "Software House" },
];

const Billing: React.FC = () => {
  const [units, setUnits] = useState<BusinessUnit[]>(staticFallbackUnits);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/business-units");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setUnits(data.data);
        }
      } catch (err) {
        console.warn("Koneksi gagal ke API unit bisnis di Billing. Menggunakan data statis.", err);
      }
    };
    fetchUnits();
  }, []);

  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={`${layout.sectionImgReverse} min-h-[480px] w-full flex justify-center items-center`}>
        {/* Controlled Relative Bounds Wrapper to keep cards nicely composed and never flying apart */}
        <div className="relative w-full max-w-[480px] h-[400px] flex-shrink-0">
          
          {/* Floating Card 1: Unit Bisnis Utama (Dynamic Data) */}
          <div className="motion-float-card absolute top-[10px] right-[10px] z-[6] w-[260px] bg-white border border-gray-100 p-5 rounded-[20px] shadow-2xl hover:scale-[1.02] transition-transform duration-300 select-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[9px] h-[9px] rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="font-poppins font-bold text-[14.5px] text-primary-dark">Unit Bisnis Utama</h4>
            </div>
            <ul className="space-y-3">
              {units.slice(0, 3).map((unit) => (
                <li key={unit.id} className="flex justify-between items-center text-[12.5px] text-dimWhite border-b border-gray-50 pb-2">
                  <span className="font-medium text-slate-700 truncate max-w-[120px]">{unit.title}</span>
                  <span className="text-[9.5px] bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-bold select-none whitespace-nowrap">
                    {unit.category}
                  </span>
                </li>
              ))}
              {units.length === 0 && (
                <li className="text-[12.5px] text-slate-400 text-center py-2">Belum ada data unit</li>
              )}
            </ul>
          </div>

          {/* Floating Card 2: Unit Proyek & Produk (Static) */}
          <div className="motion-float-card motion-delay-2 absolute top-[150px] left-[10px] z-[5] w-[260px] bg-white border border-gray-100 p-5 rounded-[20px] shadow-xl hover:scale-[1.02] transition-transform duration-300 select-none">
            <h4 className="font-poppins font-bold text-[14.5px] text-primary-dark mb-4">Unit Proyek & Produk</h4>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-700">Web Apps Koperasi</p>
                  <p className="text-[10px] text-dimWhite">Mitra UMKM Surakarta</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold select-none">Selesai</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                <div>
                  <p className="font-bold text-xs text-slate-700">Sistem IoT Monitoring</p>
                  <p className="text-[10px] text-dimWhite">Universitas UMPKU</p>
                </div>
                <span className="text-[10px] bg-cyan-50 text-[#00b4d8] px-2 py-0.5 rounded-full font-bold select-none">Aktif</span>
              </div>
            </div>
          </div>

          {/* Floating Toast Notification */}
          <div className="motion-float-card motion-delay-3 absolute bottom-[20px] right-[20px] z-[7] bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300 select-none">
            <span className="text-emerald-500 font-extrabold text-[13px]">✓</span>
            <span className="text-[11px] text-emerald-800 font-bold">Semua Unit Bisnis Siap Melayani</span>
          </div>

        </div>

        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient" />
      </div>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          Layanan Web & <br className="sm:block hidden" /> Mobile Development.
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Kami merancang dan mengembangkan website profil perusahaan, e-commerce, hingga aplikasi mobile Android dan iOS yang cepat, responsif, serta aman. Akselerasi pertumbuhan bisnis Anda dengan platform digital yang tepat.
        </p>

        {/* Service Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 mt-8 max-w-[470px]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-poppins text-[13.5px] font-semibold text-slate-700">Responsive Web Dev</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-poppins text-[13.5px] font-semibold text-slate-700">Android & iOS Apps</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-poppins text-[13.5px] font-semibold text-slate-700">UI/UX Design Modern</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-poppins text-[13.5px] font-semibold text-slate-700">Integrasi AI & IoT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billing;
