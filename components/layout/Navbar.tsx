"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { close, logo, menu } from "@/public/assets";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkHref = (id: string) => {
    return isHome ? `#${id}` : `/#${id}`;
  };

  return (
    // Outer spacer container to preserve layout flow and prevent content jumps
    <div className="w-full h-[80px] sm:h-[96px] relative">
      {/* Centering wrapper that transitions its top positioning smoothly */}
      <div
        className={`fixed left-0 right-0 z-[999] flex justify-center transition-all duration-500 ease-out px-4 ${
          scrolled ? "top-4" : "top-0"
        }`}
      >
        {/* Nav element that morphs its dimensions, paddings, background, and borders */}
        <nav
          className={`transition-all duration-500 ease-out flex justify-between items-center ${
            scrolled
              ? "w-full max-w-[1200px] rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-md bg-white/90 border border-gray-200/40"
              : "w-full max-w-[1280px] py-6 px-4 bg-transparent border-b border-transparent"
          }`}
        >
          {/* Brand Logo - Consistent colors */}
          <a
            href={getLinkHref("home")}
            className="flex items-center gap-2 select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          >
            <Image
              src={logo}
              alt="HelioNexus"
              width={28}
              height={28}
              style={{ width: "28px", height: "28px" }}
              className="object-contain"
            />
            <span className="font-jakarta font-extrabold text-[17px] text-primary-dark tracking-wide">
              Helio<span className="text-[#00b4d8] font-semibold">Nexus</span>
            </span>
          </a>

          {/* Navigation Links - Consistent text color */}
          <ul className="list-none sm:flex hidden justify-end items-center flex-1">
                      {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-jakarta font-semibold cursor-pointer text-[14px] text-primary-dark hover:text-[#00b4d8] transition-colors duration-200 ${
                  index === navLinks.length - 1 ? "mr-0" : "mr-8"
                }`}
              >
                {(nav as any).externalUrl ? (
                  <a
                    href={(nav as any).externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    {nav.title}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (nav as any).route ? (
                  <Link href={(nav as any).route}>{nav.title}</Link>
                ) : (
                  <a href={getLinkHref(nav.id)}>{nav.title}</a>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Button - Consistent dark style */}
          <div className="sm:flex hidden items-center ml-6">
            <a
              href={getLinkHref("contact")}
              className="bg-primary-dark text-white hover:bg-black font-jakarta font-extrabold text-[12px] px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="sm:hidden flex items-center">
            <Image
              src={toggle ? close : menu}
              alt="menu"
              className="object-contain cursor-pointer"
              width={24}
              height={24}
              onClick={() => setToggle((prev) => !prev)}
            />
            <div
              className={`${toggle ? "flex" : "hidden"}
                p-6 bg-white border border-gray-100 shadow-lg absolute top-16 right-4 min-w-[140px] rounded-xl sidebar z-[1000]`}
            >
              <ul className="list-none flex flex-col justify-end items-center flex-1">
                                {navLinks.map((nav, index) => (
                  <li
                    key={nav.id}
                    className={`font-jakarta font-semibold cursor-pointer text-[14px] text-primary-dark hover:text-[#00b4d8] transition-colors duration-200 ${
                      index === navLinks.length - 1 ? "mb-0" : "mb-4"
                    }`}
                  >
                    {(nav as any).externalUrl ? (
                      <a
                        href={(nav as any).externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setToggle(false)}
                        className="flex items-center gap-1"
                      >
                        {nav.title}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (nav as any).route ? (
                      <Link href={(nav as any).route} onClick={() => setToggle(false)}>
                        {nav.title}
                      </Link>
                    ) : (
                      <a href={getLinkHref(nav.id)} onClick={() => setToggle(false)}>
                        {nav.title}
                      </a>
                    )}
                  </li>
                ))}
                {/* Mobile Hubungi Kami CTA */}
                <li className="mt-4 w-full">
                  <a
                    href={getLinkHref("contact")}
                    onClick={() => setToggle(false)}
                    className="block text-center bg-primary-dark text-white hover:bg-black font-jakarta font-bold text-[12.5px] py-2 rounded-lg transition-all duration-350"
                  >
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
