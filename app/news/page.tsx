"use client";

import { useEffect } from "react";
import styles from "@/styles/style";
import { Navbar, Footer, News } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";

export default function NewsPage() {
  useEffect(() => {
    document.title = "Daftar Berita | HelioNexus";
  }, []);

  return (
    <main className="motion-page bg-primary w-full overflow-hidden min-h-screen flex flex-col justify-between">

      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} flex-1 pb-16`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal>
            <div className="mt-8 mb-4">
              <a
                href="/"
                className="inline-flex items-center gap-2 font-poppins font-semibold text-[13px] text-dimWhite hover:text-[#00b4d8] transition-colors group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="group-hover:-translate-x-1 transition-transform">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Kembali ke Beranda
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <News isDashboard={false} />
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal>
        <div className={`bg-primary ${styles.paddingX}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </ScrollReveal>

    </main>
  );
}
