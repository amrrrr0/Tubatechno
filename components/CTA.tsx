import React from "react";
import styles from "@/styles/style";

const CTA: React.FC = () => {
  return (
    <section id="location" className={`${styles.marginY} w-full flex flex-col`}>
      {/* Location Header */}
      <div className="mb-6 px-4 md:px-8">
        <h4 className="font-poppins font-semibold text-[12px] tracking-[0.15em] text-dimWhite uppercase mb-1">
          LOKASI KAMI
        </h4>
        <h2 className="font-poppins font-bold text-[32px] md:text-[42px] text-primary-dark leading-tight">
          Surakarta, Indonesia
        </h2>
      </div>

      {/* Map Container - Full width, relative for floating card */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        {/* Google Maps Embed */}
        <iframe
          src="https://maps.google.com/maps?q=ITS+PKU+Muhammadiyah+Surakarta&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi HelioNexus - ITS PKU Muhammadiyah Surakarta"
        />

        {/* Floating Office Info Card — overlaid bottom-left like gits.id */}
        <div className="absolute bottom-6 left-4 md:left-8 w-[260px] md:w-[300px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden z-10">
          {/* Office Photo Placeholder */}
          <div className="w-full h-[140px] bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] relative overflow-hidden flex items-end">
            {/* Illustrated building using divs */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-1.5">
              {/* Building 1 */}
              <div className="w-10 h-20 bg-[#0ea5e9]/80 rounded-t-md relative">
                <div className="absolute inset-x-0 top-2 flex flex-wrap gap-0.5 px-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white/30 rounded-sm" />
                  ))}
                </div>
              </div>
              {/* Building 2 - taller */}
              <div className="w-14 h-28 bg-[#0077b6]/90 rounded-t-lg relative">
                <div className="absolute inset-x-0 top-2 flex flex-wrap gap-0.5 px-1.5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2 bg-white/30 rounded-sm" />
                  ))}
                </div>
              </div>
              {/* Building 3 */}
              <div className="w-10 h-16 bg-[#0ea5e9]/70 rounded-t-md relative">
                <div className="absolute inset-x-0 top-2 flex flex-wrap gap-0.5 px-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white/30 rounded-sm" />
                  ))}
                </div>
              </div>
            </div>
            {/* Sky gradient overlay */}
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#bfdbfe]/60 to-transparent" />
            {/* Ground */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-[#4ade80]/40" />
          </div>

          {/* Card Text Content */}
          <div className="p-4">
            <h3 className="font-poppins font-bold text-[16px] text-primary-dark mb-1">
              Head Office
            </h3>
            <p className="font-poppins font-normal text-[13px] text-dimWhite leading-[1.5]">
              Jl. Tulang Bawang Tengah No. 26, Kadipiro, Banjarsari, Surakarta 57136
            </p>
          </div>
        </div>

        {/* Pin label popup (decorative, like gits.id) */}
        <div className="absolute bottom-[calc(50%-20px)] left-1/2 -translate-x-1/2 -translate-y-4 z-10 hidden md:flex items-center bg-white text-primary-dark font-poppins font-semibold text-[13px] px-3.5 py-1.5 rounded-full shadow-lg border border-gray-200/60 whitespace-nowrap gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00b4d8] flex-shrink-0" />
          Head Office
          <button type="button" className="text-gray-400 hover:text-gray-600 ml-1 font-normal text-[16px] leading-none cursor-pointer" aria-label="Tutup">×</button>
        </div>

        {/* Scroll-to-top button like gits.id */}
        <a
          href="#home"
          className="absolute bottom-6 right-4 md:right-8 z-10 w-11 h-11 rounded-full bg-primary-dark text-white flex items-center justify-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all text-[18px] font-bold"
          aria-label="Kembali ke atas"
        >
          ↑
        </a>
      </div>
    </section>
  );
};

export default CTA;
