import { MetadataRoute } from "next";
import { getApiUrl } from "@/utils/api";

export const dynamic = "force-dynamic";

interface NewsItem {
  slug: string;
  updated_at?: string;
  created_at: string;
  published_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL production HelioTechno
  const baseUrl = "http://localhost:3000"; // Can be updated to production domain when ready

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
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(getApiUrl("/api/news?status=published"), {
      cache: "no-store",
    });
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

  return [...staticRoutes, ...newsRoutes];
}
