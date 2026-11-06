import { MetadataRoute } from "next";
import { getApiUrl } from "@/utils/api";
import { staticNews } from "@/constants/staticData";

export const dynamic = "force-static";

interface NewsItem {
  slug: string;
  updated_at?: string;
  created_at: string;
  published_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL production TubaTechno
  const baseUrl = "https://tubatechno.web.id";

  // 1. Jalur statis utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }
  ];

  // 2. Jalur artikel berita dinamis dari database
  // Catatan: pada static export, bagian ini dijalankan sekali saat build.
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"));
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      newsRoutes = data.data.map((item: NewsItem) => {
        const dateStr = item.published_at || item.created_at;
        return {
          url: `${baseUrl}/news/${item.slug}`,
          lastModified: dateStr ? new Date(dateStr) : new Date(),
          changeFrequency: "monthly",
          priority: 0.64,
        };
      });
    }
  } catch (err) {
    console.error("Gagal memuat rute berita untuk sitemap:", err);
  }

  if (newsRoutes.length === 0) {
    newsRoutes = staticNews.map((item) => {
      const dateStr = item.published_at || item.created_at;
      return {
        url: `${baseUrl}/news/${item.slug}`,
        lastModified: dateStr ? new Date(dateStr) : new Date(),
        changeFrequency: "monthly",
        priority: 0.64,
      };
    });
  }

  return [...staticRoutes, ...newsRoutes];
}
