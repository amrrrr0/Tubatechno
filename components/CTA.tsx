import React from "react";
import styles from "@/styles/style";

const CTA: React.FC = () => {
  return (
    <section id="contact" className={`${styles.marginY} w-full flex flex-col px-4 md:px-8`}>
      {/* Location Header and Map */}
      <div className="w-full">
        <div className="mb-8">
          <h4 className="font-poppins font-semibold text-[12px] tracking-[0.15em] text-dimWhite uppercase mb-1">
            LOKASI KAMI
          </h4>
          <h2 className="font-poppins font-bold text-[32px] md:text-[42px] text-primary-dark leading-tight">
            Surakarta, Indonesia
          </h2>
        </div>

        <div className="relative w-full h-[380px] md:h-[480px] rounded-[24px] overflow-hidden shadow-lg border border-gray-200/50 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_48%,#e0f2fe_100%)]">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-[8%] top-[18%] h-[1px] w-[88%] rotate-[-8deg] bg-cyan-200" />
            <div className="absolute left-[3%] top-[54%] h-[1px] w-[94%] rotate-[10deg] bg-slate-200" />
            <div className="absolute left-[20%] top-[8%] h-[90%] w-[1px] rotate-[18deg] bg-cyan-200" />
            <div className="absolute right-[24%] top-[5%] h-[86%] w-[1px] rotate-[-15deg] bg-slate-200" />
            <div className="absolute left-[10%] bottom-[18%] h-[82px] w-[82px] rounded-full border border-cyan-200" />
            <div className="absolute right-[12%] top-[16%] h-[126px] w-[126px] rounded-full border border-slate-200" />
          </div>

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <div className="relative mb-5 h-20 w-20">
              <span className="absolute inset-0 rounded-full bg-cyan-300/30 animate-ping" />
              <span className="absolute inset-3 rounded-full bg-white shadow-[0_18px_50px_rgba(0,180,216,0.24)]" />
              <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00b4d8]" />
            </div>
            <h3 className="font-poppins text-[24px] font-bold text-primary-dark">
              ITS PKU Muhammadiyah Surakarta
            </h3>
            <p className="mt-2 max-w-[420px] font-poppins text-[15px] leading-[24px] text-dimWhite">
              Jl. Tulang Bawang Tengah No. 26, Kadipiro, Banjarsari, Surakarta.
            </p>
            <a
              href="https://www.openstreetmap.org/?mlat=-7.5408&mlon=110.8190#map=15/-7.5408/110.8190"
              target="_blank"
              rel="noreferrer"
              className="mt-6 rounded-full bg-primary-dark px-6 py-3 font-poppins text-[14px] font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-black"
            >
              Buka Peta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
