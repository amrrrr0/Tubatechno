import styles from "@/styles/style";
import { Navbar, Footer, News } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";
import { getApiUrl } from "@/utils/api";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Semua Berita & Artikel Teknologi Terbaru | TubaTechno",
  description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno. Dapatkan artikel edukatif gratis.",
  keywords: "tubatechno, berita teknologi, iot indonesia, software house surakarta, umpk",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Semua Berita & Artikel Teknologi Terbaru | TubaTechno",
    description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno. Dapatkan artikel edukatif gratis.",
    type: "website",
    url: "/news",
    siteName: "TubaTechno",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semua Berita & Artikel Teknologi Terbaru | TubaTechno",
    description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno.",
  }
};

async function getPublishedNews() {
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"), {
       // Don't cache on server so it updates instantly
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error("Gagal mengambil berita di server:", err);
    return [];
  }
}

export default async function NewsPage() {
  const initialNews = await getPublishedNews();

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
                className="inline-flex items-center gap-2 font-jakarta font-semibold text-[13px] text-dimWhite hover:text-[#00b4d8] transition-colors group"
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
            <News isDashboard={false} initialNews={initialNews} />
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
