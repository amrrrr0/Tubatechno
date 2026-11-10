import styles from "@/styles/style";
import { Navbar, Footer, News } from "@/components";
import ScrollReveal from "@/components/ScrollReveal";
import { getApiUrl } from "@/utils/api";
import { staticNews } from "@/constants/staticData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tubatechno",
  description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno. Dapatkan wawasan teknologi berkualitas.",
  keywords: "tubatechno, berita teknologi, iot indonesia, software house surakarta, umpk",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Tubatechno",
    description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno.",
    type: "website",
    url: "/news",
    siteName: "Tubatechno",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tubatechno",
    description: "Pantau wawasan industri, solusi IoT, dan rilis teknologi terbaru dari tim TubaTechno.",
  }
};

async function getPublishedNews() {
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"), {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return (data.success && Array.isArray(data.data) && data.data.length > 0) ? data.data : staticNews;
  } catch (err) {
    console.error("Gagal mengambil berita di server:", err);
    return staticNews;
  }
}

export default async function NewsPage() {
  const initialNews = await getPublishedNews();

  return (
    <main className="motion-page bg-[#f8fafc] text-slate-900 w-full overflow-hidden min-h-screen flex flex-col justify-between">
      <div className={`${styles.paddingX} ${styles.flexCenter} bg-[#f8fafc]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`${styles.paddingX} flex-1 py-10 sm:py-14`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal>
            <div className="mb-6">
              <a
                href="/"
                className="inline-flex items-center gap-2 font-jakarta font-semibold text-[13px] text-slate-600 hover:text-[#0077b6] transition-colors group"
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
        <div className={`bg-white border-t border-slate-200/90 ${styles.paddingX}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
