import React from "react";

const CTA: React.FC = () => {
  return (
    <section id="location" className="w-full py-20 sm:py-28 flex flex-col font-jakarta border-t border-slate-200/80">
      {/* Section Header: Uniform Pattern */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          KANTOR PUSAT &amp; LOKASI
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.12] tracking-[-0.03em]">
          Studio Rekayasa di <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Surakarta, Indonesia.
          </span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-slate-600 mt-4 leading-[1.75] font-normal max-w-2xl">
          Kunjungi studio kami atau jadwalkan pertemuan teknis langsung bersama tim perekayasa perangkat lunak TubaTechno.
        </p>
      </div>

      {/* Map Container - Full width, relative for floating card */}
      <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/90">
        {/* Google Maps Embed */}
        <iframe
          src="https://maps.google.com/maps?q=-7.533599,110.816948(Head+Office)&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi TubaTechno - Head Office"
        />

        {/* Floating Office Info Card */}
        <div className="absolute bottom-6 left-4 md:left-6 w-[280px] md:w-[320px] bg-white/95 rounded-2xl shadow-[0_12px_36px_rgba(0,119,182,0.08)] overflow-hidden z-10 border border-slate-200/90 backdrop-blur-xl">
          {/* Campus Photo Image */}
          <div className="w-full h-[140px] relative overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/images/campus-illustration.png" 
              alt="TubaTechno Head Office" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          </div>

          {/* Card Text Content */}
          <div className="p-5 bg-white">
            <span className="text-[10px] font-semibold text-[#0077b6] uppercase tracking-wider block mb-1">
              HEAD OFFICE
            </span>
            <h3 className="font-bold text-[16px] text-slate-900 mb-1.5">
              TubaTechno Studio
            </h3>
            <p className="font-normal text-[12.5px] text-slate-600 leading-relaxed">
              Jl. Tulang Bawang Tengah No. 26, Kadipiro, Banjarsari, Surakarta 57136
            </p>
          </div>
        </div>

        {/* Pin label popup */}
        <div className="absolute top-[calc(50%-75px)] left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center select-none pointer-events-none">
          <div className="flex items-center bg-white text-slate-900 border-slate-200 font-semibold text-[12px] px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,119,182,0.12)] border whitespace-nowrap">
            Kantor Pusat TubaTechno
          </div>
          <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 transform rotate-45 -mt-1.5" />
        </div>
      </div>
    </section>
  );
};

export default CTA;
