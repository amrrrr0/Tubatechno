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
          ? "bg-[#f8fafc]/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,119,182,0.05)]"
          : "bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200/60"
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
          <span className="font-extrabold text-[18px] sm:text-[20px] text-slate-900 tracking-tight">
            Tuba<span className="text-[#00b4d8] font-bold">Techno</span>
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
                  className="flex items-center px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-600 hover:text-[#0077b6] hover:bg-sky-50 transition-all duration-200"
                >
                  {nav.title}
                </a>
              ) : (nav as any).route ? (
                <Link
                  href={(nav as any).route}
                  className="px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-600 hover:text-[#0077b6] hover:bg-sky-50 transition-all duration-200 block"
                >
                  {nav.title}
                </Link>
              ) : (
                <a
                  href={getLinkHref(nav.id)}
                  className="px-3 py-1.5 rounded-lg font-medium text-[13.5px] text-slate-600 hover:text-[#0077b6] hover:bg-sky-50 transition-all duration-200 block"
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
            className="flex items-center px-5 py-2.5 rounded-xl font-bold text-[12.5px] text-white bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#023e8a] shadow-[0_2px_12px_rgba(0,180,216,0.25)] hover:shadow-[0_4px_16px_rgba(0,180,216,0.35)] transition-all duration-200 cursor-pointer select-none"
          >
            Konsultasi Proyek
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setToggle((prev) => !prev)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle Navigation"
          >
            {toggle ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {toggle && (
            <div className="p-5 bg-white/98 backdrop-blur-2xl border border-slate-200 shadow-xl absolute top-16 right-4 min-w-[220px] rounded-2xl z-[1000] flex flex-col gap-3 font-jakarta">
              <ul className="list-none flex flex-col gap-1.5 w-full">
                {navLinks.map((nav) => (
                  <li key={nav.id} className="w-full">
                    {(nav as any).externalUrl ? (
                      <a
                        href={(nav as any).externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setToggle(false)}
                        className="flex items-center px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-700 hover:text-[#0077b6] hover:bg-sky-50 transition-colors"
                      >
                        {nav.title}
                      </a>
                    ) : (nav as any).route ? (
                      <Link
                        href={(nav as any).route}
                        onClick={() => setToggle(false)}
                        className="px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-700 hover:text-[#0077b6] hover:bg-sky-50 transition-colors block"
                      >
                        {nav.title}
                      </Link>
                    ) : (
                      <a
                        href={getLinkHref(nav.id)}
                        onClick={() => setToggle(false)}
                        className="px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-700 hover:text-[#0077b6] hover:bg-sky-50 transition-colors block"
                      >
                        {nav.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href={getLinkHref("contact")}
                onClick={() => setToggle(false)}
                className="w-full mt-1 py-2.5 rounded-xl font-bold text-[12.5px] text-white bg-gradient-to-r from-[#00b4d8] to-[#0077b6] shadow-sm text-center block"
              >
                Konsultasi Proyek
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
