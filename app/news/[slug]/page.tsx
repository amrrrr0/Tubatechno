import React from "react";
import styles from "@/styles/style";
import { Navbar, Footer } from "@/components";
import { getApiUrl } from "@/utils/api";
import ScrollReveal from "@/components/ScrollReveal";
import ViewCounter from "./ViewCounter";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
      cache: "no-store",
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error("Gagal mengambil detail berita di server:", err);
    return null;
  }
}

async function getOtherPublishedNews(excludeId: number): Promise<NewsItem[]> {
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"), {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success) {
      return data.data.filter((item: NewsItem) => item.id !== excludeId);
    }
    return [];
  } catch (err) {
    console.error("Gagal mengambil berita lain di server:", err);
    return [];
  }
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 225; // Average adult reading speed
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Artikel Tidak Ditemukan | TubaTechno",
      description: "Maaf, artikel yang Anda cari tidak dapat ditemukan di portal kami.",
    };
  }

  const title = `${news.seo_title || news.title} | TubaTechno`;
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
      <main className="bg-primary w-full min-h-screen flex flex-col justify-between">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <h2 className="font-jakarta font-bold text-[24px] text-primary-dark">Artikel Tidak Ditemukan</h2>
          <p className="font-jakarta text-[14px] text-dimWhite max-w-[400px]">
            Maaf, artikel yang Anda cari tidak ada atau telah dihapus.
          </p>
          <a
            href="/news"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-jakarta font-semibold text-[13px] transition-all shadow-md shadow-blue-500/20"
          >
            Kembali ke Berita
          </a>
        </div>

        <div className={`bg-primary ${styles.paddingX}`}>
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

  // JSON-LD Schema Markup
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
    <main className="motion-page bg-primary w-full overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* View counter client component */}
      <ViewCounter id={news.id} />

      {/* Navbar */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      {/* Content */}
      <div className={`bg-primary ${styles.paddingX} flex-1 pb-16`}>
        <div className={`${styles.boxWidth} mt-8`}>

          {/* Breadcrumbs & Back button */}
          <ScrollReveal variant="fade-up" duration={700}>
            <div className="mb-6 flex flex-col gap-3">
              {/* Remah Roti (Breadcrumbs) */}
              <nav className="flex text-[11px] font-jakarta text-dimWhite/65 items-center gap-1.5 select-none tracking-wide">
                <a href="/" className="hover:text-[#00b4d8] transition-colors">Beranda</a>
                <span className="text-gray-600">/</span>
                <a href="/news" className="hover:text-[#00b4d8] transition-colors">Berita</a>
                <span className="text-gray-600">/</span>
                <span className="text-[#00b4d8] font-semibold truncate max-w-[200px] sm:max-w-xs">{news.title}</span>
              </nav>

              <a
                href="/news"
                className="inline-flex items-center gap-2 font-jakarta font-semibold text-[13px] text-dimWhite hover:text-[#00b4d8] transition-colors group w-fit"
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

          {/* Two-Column Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar */}
            <ScrollReveal variant="fade-up" duration={900} delay={100}>
              <aside className="w-full lg:w-[220px] xl:w-[260px] flex-shrink-0">
                <div className="sticky top-6">
                  <h3 className="font-jakarta font-bold text-[13px] text-[#00b4d8] uppercase tracking-wider mb-4 pb-2.5 border-b border-gray-800 select-none">
                    Berita Lainnya
                  </h3>

                  <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                    {otherNewsList.map((item) => (
                      <a
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group block py-1 transition-all duration-200"
                      >
                        <h4 className="font-jakarta font-medium text-[13.5px] leading-snug text-dimWhite group-hover:text-[#00b4d8] transition-colors line-clamp-2">
                          • {item.title}
                        </h4>
                      </a>
                    ))}

                    {otherNewsList.length === 0 && (
                      <p className="text-[12px] font-jakarta text-gray-500 italic py-2 select-none">
                        Tidak ada berita lain.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </ScrollReveal>

            {/* Article */}
            <ScrollReveal variant="fade-up" duration={1000} delay={60}>
              <article className="flex-1 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-slate-100/40">

                {/* Image Header */}
                <div className="relative w-full h-[280px] sm:h-[360px] bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"}
                    alt={news.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Article Content */}
                <div className="p-6 sm:p-10">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 rounded-full font-jakarta font-semibold text-[10px] uppercase tracking-wider text-white bg-[#00b4d8]">
                      Berita &amp; Artikel
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-jakarta text-gray-400 select-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {readingTime} menit membaca
                    </span>
                  </div>

                  <h1 className="font-jakarta font-bold text-[22px] sm:text-[28px] leading-tight text-primary-dark mb-4">
                    {news.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-500 font-jakarta border-b border-gray-100 pb-5 mb-6">
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Penulis: <strong className="text-gray-800">{news.author}</strong>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {publishDate}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {news.views + 1} dilihat
                    </span>
                  </div>

                  {/* Body */}
                  <p className="font-jakarta text-[14px] sm:text-[15px] leading-[26px] text-gray-700 whitespace-pre-line">
                    {news.content}
                  </p>

                  {/* Keywords */}
                  {keywordsArray.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-100">
                      <span className="font-jakarta text-[12px] text-gray-400 mr-2">Tags:</span>
                      {keywordsArray.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#e0f7fa]/60 text-[#0077b6] text-[11px] font-jakarta border border-[#00b4d8]/10"
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

      {/* Footer */}
      <ScrollReveal variant="fade-up" duration={800}>
        <div className={`bg-primary ${styles.paddingX}`}>
          <div className={`${styles.boxWidth}`}>
            <Footer />
          </div>
        </div>
      </ScrollReveal>

    </main>
  );
}
