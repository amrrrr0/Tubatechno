"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NewsForm from "../forms/NewsForm";
import { getApiUrl } from "@/utils/api";
import { staticNews } from "@/constants/staticData";

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
}

const NewsCard: React.FC<{ item: NewsItem; onClick: () => void; onEdit?: () => void; onDelete?: () => void; delay: number; isAdmin: boolean }> = ({
  item,
  onClick,
  onEdit,
  onDelete,
  delay,
  isAdmin,
}) => {
  const publishDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date(item.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const excerpt =
    item.content.length > 120
      ? item.content.substring(0, 120) + "..."
      : item.content;

  // Modern cover image selection (uses Unsplash or default abstract image)
  const coverImage =
    (item.image_url ? item.image_url.replace(/^https?:\/\/localhost:5000/, "") : null) ||
    `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80`;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#070b14]/90 border border-slate-800/80 hover:border-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/5 backdrop-blur-xl font-jakarta hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: "0 4px 20px rgba(0,4,15,0.04)",
      }}
    >
      {/* Top hover accent bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#00b4d8] to-[#0077b6] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10" />
      {/* Article Image Header */}
      <div className="relative w-full h-[180px] overflow-hidden bg-[#050811]">
        <img
          src={coverImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        {/* Status indicator badge - only visible to admin */}
        {isAdmin && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full font-jakarta font-semibold text-[9px] uppercase tracking-wider text-white ${
                item.status === "published"
                  ? "bg-emerald-500/90 border border-emerald-400/20 shadow-lg"
                  : "bg-amber-500/90 border border-amber-400/20 shadow-lg"
              }`}
            >
              {item.status}
            </span>
          </div>
        )}

        {isAdmin && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
              title="Edit Berita"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg shadow-black/10"
              title="Hapus Berita"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </button>
          </div>
        )}

        {/* Date badge */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 bg-black/60 backdrop-blur-md border border-white/10">
          {publishDate}
        </span>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Author tag */}
          <div className="flex items-center gap-2 mb-3 text-[12px] text-slate-400 font-medium">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{item.author}</span>
          </div>

          {/* Title */}
          <h3 className="font-jakarta font-bold text-[16px] leading-[22px] text-white group-hover:text-[#38bdf8] transition-colors mb-3 line-clamp-2">
            {item.title}
          </h3>

          {/* Excerpt */}
          <p className="font-jakarta font-normal text-[13px] leading-[20px] text-slate-300 mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* SEO Keywords Display */}
          {item.seo_keywords && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.seo_keywords.split(",").slice(0, 3).map((keyword, i) => (
                <span key={i} className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                  {keyword.trim()}
                </span>
              ))}
              {item.seo_keywords.split(",").length > 3 && (
                <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-medium">...</span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Clean views & Read Link */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/60 text-[12px] text-slate-400 font-jakarta">
          <span>{item.views || 0} pembaca</span>
          <span className="text-[#38bdf8] group-hover:text-white flex items-center gap-1 transition-colors font-semibold text-[12.5px]">
            Baca Selengkapnya
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </span>
        </div>
      </div>
    </div>
  );
};

interface NewsProps {
  isDashboard?: boolean;
  initialNews?: NewsItem[];
}

const News: React.FC<NewsProps> = ({ isDashboard = false, initialNews }) => {
  const router = useRouter();

  const [allNews, setAllNews] = useState<NewsItem[]>(initialNews || staticNews);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(!initialNews);
  const [error, setError] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editNews, setEditNews] = useState<NewsItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Admin settings
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminLogout, setShowAdminLogout] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetching all (both draft and published) to filter client side
      const res = await fetch(getApiUrl("/api/news?status=all"));
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAllNews(data.data);
      } else {
        setAllNews(staticNews);
      }
    } catch {
      setAllNews(staticNews);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialNews) {
      fetchNews();
    }
  }, [fetchNews, initialNews]);

  // Read admin state on mount
  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    if (stored === "true") {
      setIsAdmin(true);
      fetchNews(); // Refetch to get drafts if admin
    }
  }, [fetchNews]);

  // Listen to custom event from Footer
  useEffect(() => {
    const handleAdminTrigger = () => {
      const stored = localStorage.getItem("isAdmin") === "true";
      if (stored) {
        setShowAdminLogout(true);
      } else {
        setShowAdminLogin(true);
      }
    };
    window.addEventListener("trigger-admin-login", handleAdminTrigger);
    return () => {
      window.removeEventListener("trigger-admin-login", handleAdminTrigger);
    };
  }, []);

  const handleAdminSuccess = () => {
    localStorage.setItem("isAdmin", "true");
    setIsAdmin(true);
    window.dispatchEvent(new CustomEvent("admin-state-changed"));
  };

  const handleAdminLogoutConfirm = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setStatusFilter("all"); // Reset filter back to all
    window.dispatchEvent(new CustomEvent("admin-state-changed"));
  };

  // Click handler that navigates to the separate full details page
  const handleNewsClick = (newsItem: NewsItem) => {
    router.push(`/news/${newsItem.slug}`);
  };

  const handleEditClick = (newsItem: NewsItem) => {
    setEditNews(newsItem);
    setShowForm(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?")) {
      try {
        const res = await fetch(getApiUrl(`/api/news/${id}`), { method: "DELETE" });
        if (res.ok) {
          fetchNews();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Client-side filtering and sorting logic based on Search and Status Filter and Admin status
  useEffect(() => {
    let result = [...allNews];

    if (isDashboard) {
      // Dashboard ALWAYS only shows published news to avoid drafts leaking onto the front page
      result = result.filter((item) => item.status === "published");
    } else {
      if (!isAdmin) {
        // If not admin, only show published news (drafts are hidden completely)
        result = result.filter((item) => item.status === "published");
      } else {
        // If admin, filter by the selected tab status
        if (statusFilter !== "all") {
          result = result.filter((item) => item.status === statusFilter);
        }
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
      );
    }

    // Tab-specific sorting rules:
    if (isDashboard || statusFilter === "all") {
      // "Semua Berita" / Dashboard: Sort by most popular (views DESC)
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (statusFilter === "published") {
      // "Telah Terbit" (Published): Sort by publication date (published_at DESC)
      result.sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (statusFilter === "draft") {
      // "Draft": Sort by created_at DESC (newest first)
      result.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }

    setFilteredNews(result);
  }, [allNews, searchQuery, statusFilter, isAdmin, isDashboard]);

  const tabs = isAdmin
    ? [
        { key: "all", label: "Semua Berita" },
        { key: "published", label: "Telah Terbit" },
        { key: "draft", label: "Draft" },
      ]
    : [
        { key: "all", label: "Semua Berita" },
        { key: "published", label: "Telah Terbit" },
      ];

  const displayedNews = isDashboard ? filteredNews.slice(0, 3) : filteredNews;

  return (
    <section id="news" className="sm:py-16 py-10 flex flex-col relative border-t border-slate-800/80">
      {/* Background gradients */}
      <div className="absolute z-[0] w-[40%] h-[40%] -left-[20%] rounded-full blue__gradient pointer-events-none opacity-40" />

      {/* Header Row */}
      <div className="w-full flex flex-col items-center text-center sm:mb-14 mb-10 relative z-[1] font-jakarta">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#38bdf8] uppercase mb-3 block">
          PUBLIKASI & WAWASAN TEKNOLOGI
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-white leading-[1.12] tracking-[-0.03em]">
          Artikel & Catatan Rekayasa <br className="hidden sm:inline" />
          <span className="text-[#38bdf8] font-light italic">
            Terbaru.
          </span>
        </h2>
        <p className="font-normal text-slate-300 text-[15px] sm:text-[17px] leading-[1.75] max-w-2xl mt-4">
          Eksplorasi wawasan industri, arsitektur perangkat lunak, dan catatan rilis teknologi dari tim TubaTechno.
        </p>

        {/* CTA write news - Only visible to Admin on the full page (not dashboard) */}
        {!isDashboard && isAdmin && (
          <button
            onClick={() => { setEditNews(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-jakarta font-semibold text-[14px] text-white bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] transition-all shadow-md shadow-[#00b4d8]/20 cursor-pointer whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Berita
          </button>
        )}
      </div>

      {/* Filter and Search Bar Row - Hidden in Dashboard */}
      {!isDashboard && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 relative z-[1] w-full">
          {/* Tabs for filters */}
          <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl w-full sm:w-auto shadow-[inset_0_1px_3px_rgba(0,4,15,0.03)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                className={`flex-1 sm:flex-initial px-4.5 py-2 text-[12px] font-semibold font-jakarta rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-white text-primary-dark shadow-[0_2px_8px_rgba(0,4,15,0.08)] border border-slate-200/50"
                    : "text-dimWhite hover:text-primary-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-[320px]">
            <input
              type="text"
              placeholder="Cari berita, konten, atau penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 pl-10 font-jakarta text-[13px] text-primary-dark placeholder:text-gray-400 focus:outline-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] transition-all shadow-[0_2px_16px_rgba(0,4,15,0.06)]"
            />
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.5"
              className="absolute left-3.5 top-3.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      )}

      {/* Grid of news cards */}
      <div className="relative z-[1] w-full">
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-6 w-6 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-jakarta text-[14px] text-dimWhite">Memuat berita CMS...</span>
          </div>
        )}

        {error && !loading && displayedNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 border border-slate-800 rounded-2xl bg-[#070b14]/90 backdrop-blur-xl">
            <p className="font-jakarta text-[14px] text-dimWhite">
              Gagal memuat berita. Harap pastikan server backend menyala.
            </p>
            <button
              onClick={fetchNews}
              className="font-jakarta text-[13px] text-[#00b4d8] hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Coba Ulang
            </button>
          </div>
        )}

        {!loading && displayedNews.length > 0 && (
          <div className="flex flex-wrap gap-5">
            {displayedNews.map((news, index) => (
              <NewsCard
                key={news.id}
                item={news}
                delay={index * 80}
                isAdmin={isAdmin}
                onClick={() => handleNewsClick(news)}
                onEdit={() => handleEditClick(news)}
                onDelete={() => handleDeleteConfirm(news.id)}
              />
            ))}

            {displayedNews.length === 0 && (
              <div className="w-full text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <p className="font-jakarta text-[14px] text-dimWhite">
                  Tidak ada berita yang ditemukan.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Berita Lainnya button below grid - Visible in Dashboard */}
      {isDashboard && filteredNews.length > 0 && (
        <div className="flex justify-center mt-12 relative z-[1]">
          <Link
            href="/news"
            className="px-7 py-3.5 rounded-xl font-bold text-[13.5px] bg-[#070b14] hover:bg-slate-900 text-white border border-slate-800 hover:border-[#38bdf8]/50 transition-all shadow-md inline-flex items-center gap-2 group/btn"
          >
            <span>Lihat Semua Artikel</span>
            <span className="text-[#38bdf8] transition-transform group-hover/btn:translate-x-1">↗</span>
          </Link>
        </div>
      )}

      {/* Render modals conditionally */}
      {showForm && (
        <NewsForm
          onClose={() => { setShowForm(false); setEditNews(null); }}
          onSuccess={fetchNews}
          editData={editNews}
        />
      )}

      {/* Admin PIN Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminSuccess}
        />
      )}

      {/* Admin Logout Confirmation Modal */}
      {showAdminLogout && (
        <AdminLogoutModal
          onClose={() => setShowAdminLogout(false)}
          onConfirm={handleAdminLogoutConfirm}
        />
      )}
    </section>
  );
};

/* ── Admin Login Modal Component ───────────────────────── */
interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyPress = (num: string) => {
    setErrorMsg("");
    setPin((prev) => {
      if (prev.length < 4) {
        return prev + num;
      }
      return prev;
    });
  };

  // Automatically submit when PIN reaches 4 characters
  useEffect(() => {
    if (pin.length === 4) {
      // Checking PIN: year of the copyright 2026!
      if (pin === "2026") {
        onSuccess();
        onClose();
      } else {
        setErrorMsg("Sandi PIN salah! Silakan coba lagi.");
        setPin("");
      }
    }
  }, [pin, onClose, onSuccess]);

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
    setErrorMsg("");
  };

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      } else if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (key === "Delete" || key === "Escape") {
        e.preventDefault();
        if (key === "Escape") {
          onClose();
        } else {
          handleClear();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[340px] overflow-hidden rounded-[24px] bg-white flex flex-col p-6 border border-gray-100"
        style={{
          boxShadow: "0 32px 80px rgba(0,4,15,0.22), 0 0 0 1px rgba(0,180,216,0.10)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Decorative Top Line */}
        <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#005f73] to-[#00b4d8]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-dimWhite hover:text-primary-dark hover:bg-gray-100 transition-all cursor-pointer font-bold"
          style={{ fontSize: "18px", lineHeight: 1 }}
        >
          ×
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mt-3 mb-5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#e0f7fa] flex items-center justify-center mb-3 border border-[#00b4d8]/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 className="font-jakarta font-bold text-[17px] text-primary-dark">
            Mode Administrator
          </h3>
          <p className="font-jakarta text-[11.5px] text-dimWhite mt-1.5 leading-normal max-w-[240px]">
            Masukkan 4 digit PIN angka untuk mengakses panel kelola CMS
          </p>
        </div>

        {/* PIN Display Indicators */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 border ${
                  pin.length > idx
                    ? "bg-[#0077b6] border-[#0077b6] scale-110"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            ))}
          </div>
          {errorMsg && (
            <p className="text-[11.5px] font-jakarta text-rose-500 font-semibold mt-1">
              {errorMsg}
            </p>
          )}
        </div>

        {/* PIN pad */}
        <div className="grid grid-cols-3 gap-2.5 mb-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-11 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 active:scale-95 font-jakarta font-bold text-[15px] text-primary-dark flex items-center justify-center transition-all cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-11 rounded-xl text-[11px] font-jakarta font-bold text-gray-500 hover:text-primary-dark hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-11 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 active:scale-95 font-jakarta font-bold text-[15px] text-primary-dark flex items-center justify-center transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-11 rounded-xl font-jakarta font-bold text-gray-500 hover:text-primary-dark hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ── Admin Logout Modal Component ───────────────────────── */
const AdminLogoutModal: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({
  onClose,
  onConfirm,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[350px] overflow-hidden rounded-[28px] bg-white flex flex-col p-7 border border-slate-100"
        style={{
          boxShadow: "0 30px 70px rgba(15,23,42,0.18), 0 0 0 1px rgba(0,0,0,0.02)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Top Decorative Line */}
        <div className="absolute top-0 inset-x-0 h-[4.5px] bg-gradient-to-r from-red-500 to-rose-600" />
        
        {/* Warning Icon Center */}
        <div className="flex flex-col items-center mt-2 mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4.5 text-rose-500 shadow-sm shadow-rose-100/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h3 className="font-jakarta font-bold text-[18px] text-slate-800 tracking-tight">
            Keluar Mode Admin?
          </h3>
          <p className="font-jakarta text-[12px] text-slate-400 mt-2 leading-relaxed px-1">
            Anda akan kehilangan hak akses kelola CMS seperti mengedit berita, unit bisnis, dan testimoni.
          </p>
        </div>
        
        {/* Actions Button */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-jakarta font-semibold text-[13px] text-slate-500 transition-all cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 font-jakarta font-bold text-[13px] text-white transition-all cursor-pointer text-center shadow-lg shadow-rose-600/15 hover:shadow-rose-600/25"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default News;
