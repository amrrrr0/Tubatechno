"use client";

import styles from "@/styles/style";
import { logo } from "@/public/assets";
import { footerLinks, socialMedia } from "@/constants";
import Image from "next/image";

const Footer: React.FC = () => {
  const handleFooterClick = () => {
    window.dispatchEvent(new CustomEvent("trigger-admin-login"));
  };

  return (
    <footer className="w-full bg-white border-t border-slate-100 pt-16 pb-12 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-16 flex flex-col gap-12">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full">
          {/* Brand Column */}
          <div className="flex-1 flex flex-col items-start max-w-[340px]">
            <div className="flex items-center gap-2.5 select-none">
              <Image
                src={logo}
                alt="HelioNexus Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-poppins font-bold text-[20px] text-slate-800 tracking-tight">
                Helio<span className="text-[#00b4d8]">Nexus</span>
              </span>
            </div>
            <p className="font-poppins font-normal text-slate-400 text-[14px] leading-relaxed mt-4.5">
              Solusi teknologi inovatif, tepercaya, dan kolaboratif dari Universitas Muhammadiyah PKU Surakarta.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap gap-8 lg:gap-4">
            {footerLinks.map((footerLink) => (
              <div
                key={footerLink.id}
                className="flex flex-col min-w-[140px] gap-4"
              >
                <h4 className="font-poppins font-bold text-[14px] text-slate-800 uppercase tracking-wider">
                  {footerLink.title}
                </h4>
                <ul className="list-none flex flex-col gap-3">
                  {footerLink.links.map((link) => (
                    <li
                      key={link.name}
                      className="font-poppins font-medium text-[13.5px] text-slate-400 hover:text-[#00b4d8] cursor-pointer transition-colors duration-200"
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
            className="font-poppins font-normal text-slate-400 text-[13px] hover:text-slate-700 transition-colors cursor-pointer select-none text-center sm:text-left leading-relaxed"
          >
            &copy; 2026 HelioNexus - Universitas Muhammadiyah PKU Surakarta. All Rights Reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {socialMedia.map((social) => (
              <Image
                src={social.icon}
                key={social.id}
                alt={social.id}
                className="w-5 h-5 object-contain brightness-0 opacity-40 hover:opacity-80 transition-all duration-200 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
