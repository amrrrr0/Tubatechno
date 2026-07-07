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
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
      <div className={`${styles.flexCenter} md:flex-row flex-col mb-8 w-full`}>
        <div className="flex-1 flex flex-col justify-start mr-10">
          <div className="flex items-center gap-2 select-none">
            <Image
              src={logo}
              alt="HelioNexus"
              width={40}
              height={40}
              className="w-[40px] h-[40px] object-contain"
            />
            <span className="font-poppins font-bold text-[22px] text-primary-dark tracking-wide">
              Helio<span className="text-[#00b4d8] font-semibold">Nexus</span>
            </span>
          </div>
          <p className={`${styles.paragraph} mt-4 max-w-[310px]`}>
            Solusi teknologi inovatif, tepercaya, dan kolaboratif dari Universitas Muhammadiyah PKU Surakarta.
          </p>
        </div>
        <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
          {footerLinks.map((footerLink) => (
            <div
              key={footerLink.id}
              className="flex flex-col ss:my-0 my-4 mix-w-[150px]"
            >
              <h4
                className={`font-poppins font-medium text-[18px] leading-[27px] text-primary-dark`}
              >
                {footerLink.title}
              </h4>
              <ul className="list-none mt-4">
                {footerLink.links.map((link, index) => (
                  <li
                    key={link.name}
                    className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-[#00b4d8] cursor-pointer ${index !== footerLink.links.length - 1 ? "mb-4" : "mb-0"
                      }`}
                  >
                    {link.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-gray-200">
        <p
          onClick={handleFooterClick}
          className="font-poppins font-normal text-center text-[18px] leading-[27px] text-dimWhite hover:text-primary-dark transition-colors cursor-pointer select-none"
        >
          © 2026 HelioNexus - Universitas Muhammadiyah PKU Surakarta. All Rights Reserved.
        </p>
        <div className="flex flex-row md:mt-0 mt-6">
          {socialMedia.map((social, index) => (
            <Image
              src={social.icon}
              key={social.id}
              alt={social.id}
              className={`w-[21px] h-[21px] object-contain brightness-0 opacity-60 hover:opacity-100 transition-all duration-200 cursor-pointer ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Footer;
