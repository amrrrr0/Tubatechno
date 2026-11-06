"use client";

import React from "react";
import { footerLinks, socialMedia } from "@/constants";
import Image from "next/image";

const Footer: React.FC = () => {
  const handleFooterClick = () => {
    window.location.href = "/admin/login";
  };

  return (
    <footer className="w-full bg-[#04060d] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative z-10 font-jakarta">
      <div className="max-w-[1480px] 2xl:max-w-[1640px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full">
          {/* Brand Column */}
          <div className="flex-1 flex flex-col items-start max-w-[380px]">
            <a href="#home" className="flex items-center gap-3 select-none no-underline group cursor-pointer">
              {/* Custom Tulang + Bawang Motif Logo (matching Navbar) */}
              <div className="w-[32px] h-[32px] rounded-lg bg-gradient-to-br from-[#0c1a2e] to-[#040914] border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:border-[#38bdf8] transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 3C9 3 5 7.5 5 13C5 18 9 22.5 14 25C19 22.5 23 18 23 13C23 7.5 19 3 14 3Z"
                    stroke="#38bdf8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 6V22M9.5 9.5C11 11.5 12.5 14 14 17C15.5 14 17 11.5 18.5 9.5"
                    stroke="#ffffff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="14" cy="5" r="1.5" fill="#38bdf8" />
                </svg>
              </div>

              <span className="font-extrabold text-[20px] text-white tracking-[-0.02em]">
                Tuba<span className="text-[#38bdf8] font-bold">Techno</span>
              </span>
            </a>

            <p className="font-normal text-slate-300 text-[14px] leading-relaxed mt-4">
              Studio rekayasa perangkat lunak independen asal Surakarta. Kami merancang arsitektur sistem berskala besar, platform web berkinerja tinggi, dan infrastruktur digital presisi.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap gap-8 lg:gap-6">
            {footerLinks.map((footerLink) => (
              <div
                key={footerLink.id}
                className="flex flex-col min-w-[140px] gap-4"
              >
                <h4 className="font-bold text-[13px] text-white uppercase tracking-wider">
                  {footerLink.title}
                </h4>
                <ul className="list-none flex flex-col gap-3">
                  {footerLink.links.map((link) => (
                    <li
                      key={link.name}
                      className="font-medium text-[13.5px] text-slate-400 hover:text-[#38bdf8] cursor-pointer transition-colors duration-200"
                    >
                      {link.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-800/80" />

        {/* Bottom Section */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
          <p
            onClick={handleFooterClick}
            className="font-normal text-slate-400 text-[13px] transition-colors select-none text-center sm:text-left leading-relaxed"
          >
            &copy; 2026 TubaTechno. Seluruh hak cipta dilindungi undang-undang.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {socialMedia.map((social) => (
              <Image
                src={social.icon}
                key={social.id}
                alt={social.id}
                className="w-5 h-5 object-contain brightness-200 opacity-40 hover:opacity-100 hover:brightness-100 transition-all duration-200 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;