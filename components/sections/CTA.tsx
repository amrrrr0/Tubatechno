import React from "react";
import styles from "@/styles/style";

const CTA: React.FC = () => {
  return (
    <section id="location" className={`${styles.marginY} w-full flex flex-col`}>
      {/* Location Header */}
      <div className="mb-8">
        <span className="font-poppins font-semibold text-[11px] tracking-[0.15em] text-[#00b4d8] uppercase mb-1.5 block">
          LOKASI KAMI
        </span>
        <h2 className="font-poppins font-bold text-[32px] md:text-[40px] text-primary-dark leading-tight">
          Surakarta, Indonesia
        </h2>
      </div>

      {/* Map Container - Full width, relative for floating card */}
      <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        {/* Google Maps Embed */}
        <iframe
          src="https://maps.google.com/maps?q=-7.533599,110.816948(Head+Office)&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi HelioTechno - Head Office"
        />

        {/* Floating Office Info Card — overlaid bottom-left like gits.id */}
        <div className="absolute bottom-6 left-4 md:left-6 w-[260px] md:w-[280px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,4,15,0.15)] overflow-hidden z-10 border border-slate-100">
          
          {/* Campus Photo Image */}
          <div className="w-full h-[140px] relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/images/campus-illustration.png" 
              alt="HelioTechno Head Office" 
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
          </div>

          {/* Card Text Content */}
          <div className="p-4 bg-white">
            <h3 className="font-poppins font-bold text-[15px] text-primary-dark mb-1">
              Head Office
            </h3>
            <p className="font-poppins font-normal text-[12.5px] text-dimWhite leading-[1.5]">
              Jl. Tulang Bawang Tengah No. 26, Kadipiro, Banjarsari, Surakarta 57136
            </p>
          </div>
        </div>

        {/* Pin label popup (decorative tooltip hovering neatly above the red map pin) */}
        <div className="absolute top-[calc(50%-75px)] left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center select-none pointer-events-none">
          <div className="flex items-center bg-white text-primary-dark font-poppins font-semibold text-[12px] px-4 py-1.5 rounded-full shadow-[0_6px_20px_rgba(0,4,15,0.12)] border border-slate-100 whitespace-nowrap gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
            Head Office
          </div>
          {/* Tooltip pointer triangle */}
          <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-100 transform rotate-45 -mt-1.5 shadow-[2px_2px_4px_rgba(0,0,0,0.02)]" />
        </div>
      </div>
    </section>
  );
};

export default CTA;
