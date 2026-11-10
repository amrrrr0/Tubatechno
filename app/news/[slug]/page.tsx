import React from "react";
import styles from "@/styles/style";
import { Navbar, Footer } from "@/components";
import { getApiUrl } from "@/utils/api";
import { staticNews } from "@/constants/staticData";
import ScrollReveal from "@/components/ScrollReveal";
import ViewCounter from "./ViewCounter";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"));
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((item: any) => ({ slug: item.slug }));
    }
  } catch {
    // Backend unreachable during build
  }
  return staticNews.map((item) => ({ slug: item.slug }));
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string | null;
  status: string;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const res = await fetch(getApiUrl(`/api/news/${slug}`), {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    if (data.success && data.data) return data.data;
  } catch (err) {
    console.error("Gagal mengambil detail berita di server:", err);
  }
  const fallback = staticNews.find((n) => n.slug === slug);
  return (fallback as NewsItem) || null;
}

async function getOtherPublishedNews(excludeId: number): Promise<NewsItem[]> {
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"), {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.filter((item: NewsItem) => item.id !== excludeId);
    }
  } catch (err) {
    console.error("Gagal mengambil berita lain di server:", err);
  }
  return staticNews.filter((item) => item.id !== excludeId) as NewsItem[];
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Tubatechno",
      description: "Maaf, artikel yang Anda cari tidak dapat ditemukan di portal kami.",
    };
  }

  const title = "Tubatechno";
  const description = news.seo_description || news.content.substring(0, 160).replace(/<[^>]*>/g, "");
  const keywords = news.seo_keywords || "tubatechno, berita, iot, software house";
  const imageUrl = news.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/news/${slug}`,
      images: [{ url: imageUrl }],
      publishedTime: news.published_at || news.created_at,
      modifiedTime: news.updated_at || news.created_at,
      authors: [news.author],
      siteName: "TubaTechno",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return (
      <main className="bg-[#f8fafc] text-slate-900 w-full min-h-screen flex flex-col justify-between font-jakarta">
        <div className={`${styles.paddingX} ${styles.flexCenter} bg-[#f8fafc]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <h2 className="font-jakarta font-bold text-[24px] text-slate-900">Artikel Tidak Ditemukan</h2>
          <p className="font-jakarta text-[14px] text-slate-600 max-w-[400px]">
            Maaf, artikel yang Anda cari tidak ada atau telah dihapus.
          </p>
          <a
            href="/news"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0077b6] text-white font-jakarta font-semibold text-[13px] transition-all shadow-xs"
          >
            Kembali ke Berita
          </a>
        </div>

        <div className={`bg-white border-t border-slate-200/90 ${styles.paddingX}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </main>
    );
  }

  const otherNewsList = await getOtherPublishedNews(news.id);

  const publishDate = news.published_at
    ? new Date(news.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(news.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const keywordsArray = news.seo_keywords
    ? news.seo_keywords.split(",").map((k) => k.trim())
    : [];

  const readingTime = getReadingTime(news.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": news.seo_description || news.content.substring(0, 160).replace(/<[^>]*>/g, ""),
    "image": [
      news.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    ],
    "datePublished": news.published_at || news.created_at,
    "dateModified": news.updated_at || news.created_at,
    "author": [
      {
        "@type": "Person",
        "name": news.author || "Tim TubaTechno"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "TubaTechno",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tubatechno.co/assets/brand/logo-icon.png"
      }
    }
  };

  return (
    <main className="motion-page bg-[#f8fafc] text-slate-900 w-full overflow-hidden min-h-screen flex flex-col justify-between font-jakarta">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewCounter id={news.id} />

      <div className={`${styles.paddingX} ${styles.flexCenter} bg-[#f8fafc]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`${styles.paddingX} flex-1 py-10 sm:py-14`}>
        <div className={`${styles.boxWidth}`}>
          <ScrollReveal variant="fade-up" duration={700}>
            <div className="mb-6 flex flex-col gap-3">
              <nav className="flex text-[12px] font-jakarta text-slate-500 items-center gap-1.5 select-none">
                <a href="/" className="hover:text-slate-900 transition-colors">Beranda</a>
                <span className="text-slate-300">/</span>
                <a href="/news" className="hover:text-slate-900 transition-colors">Berita</a>
                <span className="text-slate-300">/</span>
                <span className="text-[#0077b6] font-semibold truncate max-w-[200px] sm:max-w-xs">{news.title}</span>
              </nav>

              <a
                href="/news"
                className="inline-flex items-center gap-2 font-jakarta font-semibold text-[13px] text-slate-600 hover:text-[#0077b6] transition-colors group w-fit"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="group-hover:-translate-x-1 transition-transform"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Kembali ke Semua Berita
              </a>
            </div>
          </ScrollReveal>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <ScrollReveal variant="fade-up" duration={900} delay={100}>
              <aside className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_2px_8px_rgba(0,119,182,0.02)]">
                  <h3 className="font-jakarta font-bold text-[12px] text-[#0077b6] uppercase tracking-wider mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Berita Lainnya</span>
                    <span className="text-[11px] font-normal text-slate-400 lowercase">{otherNewsList.length} artikel</span>
                  </h3>

                  <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {otherNewsList.map((item) => (
                      <a
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group block p-2.5 rounded-xl hover:bg-sky-50/50 border border-transparent hover:border-sky-100 transition-all duration-150"
                      >
                        <h4 className="font-jakarta font-medium text-[13px] leading-snug text-slate-700 group-hover:text-[#0077b6] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {item.author}
                        </span>
                      </a>
                    ))}

                    {otherNewsList.length === 0 && (
                      <p className="text-[12px] font-jakarta text-slate-400 italic py-2 select-none">
                        Tidak ada berita lain.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </ScrollReveal>

            {/* Article */}
            <ScrollReveal variant="fade-up" duration={1000} delay={60}>
              <article className="flex-1 bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_2px_12px_rgba(0,119,182,0.03)]">
                <div className="relative w-full h-[280px] sm:h-[380px] bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(news.image_url ? news.image_url.replace(/^https?:\/\/localhost:5000/, "") : null) || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-10">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 rounded-full font-jakarta font-semibold text-[11px] uppercase tracking-wider text-[#0077b6] bg-sky-50 border border-sky-100">
                      Berita &amp; Artikel
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-jakarta text-slate-500 select-none">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {readingTime} menit baca
                    </span>
                  </div>

                  <h1 className="font-jakarta font-extrabold text-[24px] sm:text-[32px] leading-tight text-slate-900 mb-4">
                    {news.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-500 font-jakarta border-b border-slate-100 pb-5 mb-6">
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Penulis: <strong className="text-slate-800 font-medium">{news.author}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {publishDate}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {news.views + 1} tayangan
                    </span>
                  </div>

                  <p className="font-jakarta text-[14.5px] sm:text-[15.5px] leading-[28px] text-slate-700 whitespace-pre-line">
                    {news.content}
                  </p>

                  {keywordsArray.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-100">
                      <span className="font-jakarta text-[12px] text-slate-500 mr-2">Topik:</span>
                      {keywordsArray.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-sky-50 text-[#0077b6] text-[11px] font-jakarta border border-sky-100"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <ScrollReveal variant="fade-up" duration={800}>
        <div className={`bg-white border-t border-slate-200/90 ${styles.paddingX}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
