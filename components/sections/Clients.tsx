"use client";

import React from "react";
import { clients } from "@/constants";

const Clients: React.FC = () => {
  // Duplicate array to ensure seamless infinite scrolling
  const marqueeClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="w-full py-14 sm:py-16 border-t border-slate-200/80 overflow-hidden relative font-jakarta">
      {/* Label */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
          DIPERCAYA OLEH MITRA INSTITUSI &amp; EKOSISTEM BISNIS
        </span>
      </div>

      <div
        className="flex justify-center items-center overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)"
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes clients-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 4)); }
          }
          `
        }} />
        <div 
          className="flex w-max items-center"
          style={{
            animation: "clients-scroll 40s linear infinite"
          }}
        >
          {marqueeClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="flex flex-col items-center justify-center gap-2.5 px-8 sm:px-12 py-2 min-w-[120px] sm:min-w-[150px] flex-shrink-0 group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.logo}
                alt={client.name}
                className="h-[34px] sm:h-[44px] w-auto object-contain opacity-40 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-[12px] font-semibold text-slate-500 group-hover:text-slate-900 tracking-tight transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
