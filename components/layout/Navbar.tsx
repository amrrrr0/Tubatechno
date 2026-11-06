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
      if (window.scrollY > 30) {
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
    <header
      className={`fixed top-0 left-0 right-0 z-[999] w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#060913]/92 backdrop-blur-2xl border-b border-slate-800/80 shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
          : "bg-[#060913]/60 backdrop-blur-md border-b border-slate-800/40"
      }`}
    >
      <div className="w-full max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-[68px] sm:h-[76px] flex items-center justify-between font-jakarta">
        {/* Brand Logo - Sleek & Balanced */}
        <a
          href={getLinkHref("home")}
          className="flex items-center gap-2.5 select-none cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
        >
          <Image
            src={logo}
            alt="TubaTechno"
            width={30}
            height={30}
            style={{ width: "30px", height: "30px" }}
            className="object-contain"
          />
          <span className="font-extrabold text-[18px] sm:text-[20px] text-white tracking-tight">
            Tuba<span className="text-[#38bdf8] font-bold">Techno</span>
          </span>
        </a>

        {/* Navigation Links - Refined Typography */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((nav) => (
            <div key={nav.id}>
              {(nav as any).externalUrl ? (
                <a
                  href={(nav as any).externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all duration-200"
                >
                  {nav.title}
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (nav as any).route ? (
                <Link
                  href={(nav as any).route}
                  className="px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all duration-200 block"
                >
                  {nav.title}
                </Link>
              ) : (
                <a
                  href={getLinkHref(nav.id)}
                  className="px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all duration-200 block"
                >
                  {nav.title}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Button - Sleek & Refined */}
        <div className="hidden sm:flex items-center">
          <a
            href={getLinkHref("contact")}
            className="px-5 py-2 rounded-xl font-bold text-[12.5px] text-slate-950 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] hover:from-[#7dd3fc] hover:to-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.25)] hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] transition-all duration-200 cursor-pointer select-none"
          >
            Konsultasi Proyek →
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setToggle((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            <Image
              src={toggle ? close : menu}
              alt="menu"
              className="object-contain brightness-200"
              width={20}
              height={20}
            />
          </button>

          {toggle && (
            <div className="p-5 bg-[#0b1120]/95 backdrop-blur-2xl border border-slate-800 shadow-2xl absolute top-16 right-4 min-w-[200px] rounded-2xl z-[1000] flex flex-col gap-3 font-jakarta">
              <ul className="list-none flex flex-col gap-1.5 w-full">
                {navLinks.map((nav) => (
                  <li key={nav.id} className="w-full">
                    {(nav as any).externalUrl ? (
                      <a
                        href={(nav as any).externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setToggle(false)}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium text-[13.5px]"
                      >
                        <span>{nav.title}</span>
                        <span className="text-xs text-slate-500">↗</span>
                      </a>
                    ) : (nav as any).route ? (
                      <Link
                        href={(nav as any).route}
                        onClick={() => setToggle(false)}
                        className="block px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium text-[13.5px]"
                      >
                        {nav.title}
                      </Link>
                    ) : (
                      <a
                        href={getLinkHref(nav.id)}
                        onClick={() => setToggle(false)}
                        className="block px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium text-[13.5px]"
                      >
                        {nav.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="pt-2.5 border-t border-slate-800">
                <a
                  href={getLinkHref("contact")}
                  onClick={() => setToggle(false)}
                  className="block text-center bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-slate-950 font-bold text-[12.5px] py-2 rounded-xl transition-all"
                >
                  Konsultasi Proyek →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
