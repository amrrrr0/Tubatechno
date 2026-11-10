"use client";

import React from "react";
import { footerLinks, socialMedia } from "@/constants";
import Image from "next/image";

const Footer: React.FC = () => {
  const handleFooterClick = () => {
    window.location.href = "/admin/login";
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200/90 pt-16 pb-12 text-slate-600 relative z-10 font-jakarta">
      <div className="max-w-[1480px] 2xl:max-w-[1640px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full">
          {/* Brand Column */}
          <div className="flex-1 flex flex-col items-start max-w-[380px]">
            <a href="#home" className="flex items-center gap-3 select-none no-underline group cursor-pointer">
              {/* Custom Tulang + Bawang Motif Logo (matching Navbar) */}
              <div className="w-[34px] h-[34px] rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shadow-xs group-hover:border-[#00b4d8] transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 3C9 3 5 7.5 5 13C5 18 9 22.5 14 25C19 22.5 23 18 23 13C23 7.5 19 3 14 3Z"
                    stroke="#0077b6"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 6V22M9.5 9.5C11 11.5 12.5 14 14 17C15.5 14 17 11.5 18.5 9.5"
                    stroke="#00b4d8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="14" cy="5" r="1.5" fill="#0077b6" />
                </svg>
              </div>

              <span className="font-extrabold text-[20px] text-slate-900 tracking-[-0.02em]">
                Tuba<span className="text-[#00b4d8] font-bold">Techno</span>
              </span>
            </a>

            <p className="font-normal text-slate-600 text-[14px] leading-relaxed mt-4">
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
                <h4 className="font-bold text-[13px] text-slate-900 uppercase tracking-wider">
                  {footerLink.title}
                </h4>
                <ul className="list-none flex flex-col gap-3">
                  {footerLink.links.map((link) => (
                    <li
                      key={link.name}
                      className="font-medium text-[13.5px] text-slate-500 hover:text-[#0077b6] cursor-pointer transition-colors duration-200"
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
        <div className="w-full h-[1px] bg-slate-100" />

        {/* Bottom Section */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
          <p
            onClick={handleFooterClick}
            className="font-normal text-slate-500 hover:text-slate-800 text-[13px] transition-colors select-none text-center sm:text-left leading-relaxed cursor-pointer"
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
                className="w-5 h-5 object-contain opacity-50 hover:opacity-100 transition-all duration-200 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
