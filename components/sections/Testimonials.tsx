"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import TestimonialForm, { TestimonialEditData } from "../forms/TestimonialForm";
import { getApiUrl } from "@/utils/api";
import { staticTestimonials } from "@/constants/staticData";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
  created_at: string;
}

// ── Single testimonial card ───────────────────────────────────
interface CardProps {
  t: Testimonial;
  isAdmin: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: number) => void;
}

const TestimonialCard: React.FC<CardProps> = ({ t, isAdmin, onEdit, onDelete }) => (
  <div
    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#00b4d8] hover:shadow-md font-jakarta transition-all duration-300 cursor-default overflow-hidden flex-shrink-0"
    style={{
      boxShadow: "0 2px 12px rgba(0,119,182,0.03)",
      width: "clamp(280px, 30vw, 340px)",
      height: "260px"
    }}
  >
    {/* Left accent bar */}
    <div
      className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: "linear-gradient(180deg,#00b4d8,#0077b6)" }}
    />

    {/* Admin Actions */}
    {isAdmin && (
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          type="button"
          onClick={() => onEdit(t)}
          title="Edit"
          className="w-7 h-7 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0077b6] border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs text-xs"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(t.id)}
          title="Hapus"
          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs text-xs"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    )}

    {/* Top row */}
    <div className="flex items-start justify-between mb-2 flex-shrink-0">
      <svg width="28" height="20" viewBox="0 0 36 26" fill="none" className="opacity-30 flex-shrink-0">
        <path d="M0 26V16.12C0 11.63 1.064 8.04 3.192 5.36C5.384 2.62 8.576.8 12.768 0L14.4 3.68C11.89 4.23 9.896 5.36 8.408 7.08C6.984 8.8 6.272 10.9 6.272 13.376H12.768V26H0ZM20.992 26V16.12C20.992 11.63 22.056 8.04 24.184 5.36C26.376 2.62 29.568.8 33.76 0L35.392 3.68C32.89 4.23 30.888 5.36 29.4 7.08C27.976 8.8 27.264 10.9 27.264 13.376H33.76V26H20.992Z" fill="#00b4d8"/>
      </svg>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24"
            fill={s <= t.rating ? "#f59e0b" : "none"}
            stroke={s <= t.rating ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    </div>

    {/* Content */}
    <p className="font-jakarta font-normal text-[14px] leading-relaxed text-slate-600 flex-1 my-3 overflow-hidden line-clamp-4">
      {t.content}
    </p>

    {/* Author row */}
    <div className="flex flex-row items-center gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover bg-slate-50 border border-slate-200"
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
      </div>
      <div className="min-w-0">
        <h4 className="font-jakarta font-bold text-[14px] leading-tight text-slate-900 truncate">{t.name}</h4>
        <p className="font-jakarta text-[12px] leading-[18px] text-slate-500 truncate">{t.title}</p>
      </div>
    </div>
  </div>
);

// ── Infinite Marquee Carousel (> 3 testimonials) ──────────────
const InfiniteMarquee: React.FC<{
  testimonials: Testimonial[];
  isAdmin: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: number) => void;
}> = ({ testimonials, isAdmin, onEdit, onDelete }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const triTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div
      className="w-full overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Edge gradient fades in bone white */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#f8fafc] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#f8fafc] to-transparent" />

      <div
        ref={trackRef}
        className="flex gap-6 py-4"
        style={{
          width: "max-content",
          animation: "testimonials-scroll 45s linear infinite",
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {triTestimonials.map((t, index) => (
          <TestimonialCard
            key={`${t.id}-${index}`}
            t={t}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form modal
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialEditData | null>(null);

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Google Sheets sync modal
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncUrl, setSyncUrl] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const check = () => setIsAdmin(localStorage.getItem("isAdmin") === "true");
    check();
    window.addEventListener("admin-state-changed", check);
    return () => window.removeEventListener("admin-state-changed", check);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/testimonials?approved=1"));
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setTestimonials(data.data);
      } else {
        setTestimonials(staticTestimonials);
      }
    } catch {
      setTestimonials(staticTestimonials);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleEditClick = (t: Testimonial) => {
    setEditingTestimonial({ id: t.id, name: t.name, title: t.title, content: t.content, rating: t.rating });
    setShowAdminForm(true);
  };

  const handleAddClick = () => {
    setEditingTestimonial(null);
    setShowAdminForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId === null) return;
    try {
      const res = await fetch(getApiUrl(`/api/testimonials/${deleteConfirmId}`), { method: "DELETE" });
      const data = await res.json();
      if (data.success) setTestimonials(prev => prev.filter(t => t.id !== deleteConfirmId));
    } catch { /* ignore */ }
    finally { setDeleteConfirmId(null); }
  };

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncLoading(true);
    setSyncMessage("");
    setSyncStatus("idle");

    try {
      const saveRes = await fetch(getApiUrl("/api/testimonials/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gsheet_csv_url: syncUrl })
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.message || "Gagal menyimpan URL.");

      const syncRes = await fetch(getApiUrl("/api/testimonials/sync-gsheet"), {
        method: "POST"
      });
      const syncData = await syncRes.json();
      if (!syncData.success) {
        setSyncStatus("error");
        setSyncMessage(syncData.message || "Gagal sinkronisasi data.");
      } else {
        setSyncStatus("success");
        setSyncMessage(syncData.message || "Sinkronisasi berhasil!");
        fetchTestimonials();
      }
    } catch (err: any) {
      setSyncStatus("error");
      setSyncMessage(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setSyncLoading(false);
    }
  };

  const useCarousel = testimonials.length > 3;

  return (
    <>
      <style>{`
        @keyframes testimonials-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>

      <section id="clients" className="py-20 sm:py-28 flex flex-col relative border-t border-slate-200/80 font-jakarta">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-20 font-jakarta relative z-[1]">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
            REPUTASI &amp; KEPERCAYAAN MITRA
          </span>
          <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.12] tracking-[-0.03em]">
            Pengalaman Nyata. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
              Kemitraan Jangka Panjang.
            </span>
          </h2>
          <p className="font-normal text-slate-600 text-[15px] sm:text-[17px] leading-[1.75] max-w-2xl mt-4">
            Testimoni otentik dari institusi dan bisnis yang telah mempercayakan perancangan sistem serta infrastruktur digitalnya kepada TubaTechno.
          </p>

          {/* Admin buttons */}
          {isAdmin && (
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <button
                type="button"
                onClick={handleAddClick}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-jakarta text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Tambah Testimoni
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSyncModal(true);
                  setSyncMessage("");
                  setSyncStatus("idle");
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-jakarta text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                Sinkron Google Sheets
              </button>
            </div>
          )}
        </div>

        {/* Testimonials Display */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-[#00b4d8] border-t-transparent animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-jakarta text-sm">
            Belum ada testimoni yang ditampilkan.
          </div>
        ) : useCarousel ? (
          <InfiniteMarquee
            testimonials={testimonials}
            isAdmin={isAdmin}
            onEdit={handleEditClick}
            onDelete={(id) => setDeleteConfirmId(id)}
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1440px] mx-auto px-4">
            {testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                t={t}
                isAdmin={isAdmin}
                onEdit={handleEditClick}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Admin Testimonial Form Modal */}
      {showAdminForm && (
        <TestimonialForm
          onClose={() => setShowAdminForm(false)}
          onSuccess={fetchTestimonials}
          editData={editingTestimonial}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirmId(null)}
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl font-jakarta text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-900 text-[16px] mb-2">Hapus Testimoni?</h4>
            <p className="text-slate-600 text-[13px] mb-6 leading-relaxed">
              Tindakan ini permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Sync Modal */}
      {showSyncModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={(e) => e.target === e.currentTarget && setShowSyncModal(false)}
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl font-jakarta">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-[16px]">Sinkronisasi Google Sheets</h3>
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSyncSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  Link CSV Publik Google Sheets
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                  value={syncUrl}
                  onChange={(e) => setSyncUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00b4d8] rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all"
                />
              </div>

              {syncMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    syncStatus === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {syncMessage}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={syncLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#023e8a] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {syncLoading ? "Menyinkronkan..." : "Mulai Sinkron"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonials;
