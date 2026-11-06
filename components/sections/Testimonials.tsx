"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import TestimonialForm, { TestimonialEditData } from "../forms/TestimonialForm";
import { getApiUrl } from "@/utils/api";

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
    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#070b14]/90 border border-slate-800/80 hover:border-sky-500/40 hover:shadow-2xl backdrop-blur-xl font-jakarta transition-all duration-300 cursor-default overflow-hidden flex-shrink-0"
    style={{
      boxShadow: "0 2px 16px rgba(0,4,15,0.06)",
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
          className="w-7 h-7 rounded-lg bg-white hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-sm text-xs font-bold"
        >✎</button>
        <button
          type="button"
          onClick={() => onDelete(t.id)}
          title="Hapus"
          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-red-100 flex items-center justify-center transition-all cursor-pointer shadow-sm text-xs"
        >✕</button>
      </div>
    )}

    {/* Top row */}
    <div className="flex items-start justify-between mb-2 flex-shrink-0">
      <svg width="28" height="20" viewBox="0 0 36 26" fill="none" className="opacity-30 flex-shrink-0">
        <path d="M0 26V16.12C0 11.63 1.064 8.04 3.192 5.36C5.384 2.62 8.576.8 12.768 0L14.4 3.68C11.89 4.23 9.896 5.36 8.408 7.08C6.984 8.8 6.272 10.9 6.272 13.376H12.768V26H0ZM20.992 26V16.12C20.992 11.63 22.056 8.04 24.184 5.36C26.376 2.62 29.568.8 33.76 0L35.392 3.68C32.89 4.23 30.888 5.36 29.4 7.08C27.976 8.8 27.264 10.9 27.264 13.376H33.76V26H20.992Z" fill="#38bdf8"/>
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

    {/* Content with line-clamp to fit height cleanly */}
    <p className="font-jakarta font-normal text-[14px] sm:text-[15px] leading-[22px] text-slate-300 flex-1 my-3 overflow-hidden line-clamp-4 leading-relaxed font-normal text-[14px]">
      {t.content}
    </p>

    {/* Author row */}
    <div className="flex flex-row items-center gap-3 pt-3 border-t border-slate-800/60 flex-shrink-0">
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100 border-2 border-slate-700"
          style={{ boxShadow: "0 2px 8px rgba(0,180,216,0.15)" }}
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-700" />
      </div>
      <div className="min-w-0">
        <h4 className="font-jakarta font-semibold text-[14px] leading-tight text-white truncate font-bold text-[14.5px]">{t.name}</h4>
        <p className="font-jakarta text-[12px] leading-[18px] text-slate-400 truncate text-[12px]">{t.title}</p>
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

  // Duplicate enough times to ensure seamless loop
  const repeated = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-6"
        style={{
          width: "max-content",
          animationName: "testimonials-scroll",
          animationDuration: `${testimonials.length * 8}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {repeated.map((t, i) => (
          <TestimonialCard
            key={`${t.id}-${i}`}
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

// ── Static Grid (≤ 3 testimonials) ───────────────────────────
const StaticGrid: React.FC<{
  testimonials: Testimonial[];
  isAdmin: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: number) => void;
}> = ({ testimonials, isAdmin, onEdit, onDelete }) => (
  <div className="flex flex-wrap justify-center gap-5 w-full">
    {testimonials.map((t) => (
      <div key={t.id} style={{ width: "clamp(280px, 30%, 340px)" }}>
        <TestimonialCard t={t} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
      </div>
    ))}
  </div>
);

// ── Main Testimonials section ─────────────────────────────────
const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPublicFormOpen, setIsPublicFormOpen] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncUrl, setSyncUrl] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialEditData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Ambil data settings gsheet
  const fetchSyncUrl = async () => {
    try {
      const res = await fetch(getApiUrl("/api/testimonials/settings"));
      const data = await res.json();
      if (data.success) {
        setSyncUrl(data.gsheet_csv_url || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showSyncModal) {
      fetchSyncUrl();
      setSyncMessage("");
      setSyncStatus("idle");
    }
  }, [showSyncModal]);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        const adminStatus = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(adminStatus);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    window.addEventListener("admin-state-changed", checkAdmin);
    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("admin-state-changed", checkAdmin);
    };
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(getApiUrl("/api/testimonials"));
      const data = await res.json();
      if (data.success) setTestimonials(data.data);
      else setError(true);
    } catch { setError(true); }
    finally { setLoading(false); }
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
      // 1. Simpan URL ke tabel settings
      const saveRes = await fetch(getApiUrl("/api/testimonials/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gsheet_csv_url: syncUrl })
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.message || "Gagal menyimpan URL.");

      // 2. Trigger sync di backend
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
        fetchTestimonials(); // Refresh testimoni
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
      {/* Inject keyframe animation */}
      <style>{`
        @keyframes testimonials-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>

      <section id="clients" className="py-20 sm:py-28 flex flex-col relative border-t border-slate-800/80 font-jakarta">
        <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient pointer-events-none" />

        {/* Header */}
                {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-20 font-jakarta relative z-[1]">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-[#38bdf8] uppercase mb-3 block">
            REPUTASI & KEPERCAYAAN MITRA
          </span>
          <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-white leading-[1.12] tracking-[-0.03em]">
            Apa Kata Klien Tentang <br className="hidden sm:inline" />
            <span className="text-[#38bdf8] font-light italic">
              TubaTechno.
            </span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-slate-300 mt-4 leading-[1.75] font-normal max-w-2xl">
            Pengalaman nyata mitra institusi dan bisnis yang telah mendigitalisasi arsitektur operasional mereka bersama solusi teknologi kami.
          </p>

          {/* Admin only buttons */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAddClick}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-jakarta font-semibold text-[13px] text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Manual
              </button>
              <button
                type="button"
                onClick={() => setShowSyncModal(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-jakarta font-semibold text-[13px] text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                Sync Google Sheet
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-[1] w-full">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="font-jakarta text-[14px] text-dimWhite">Memuat testimoni...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <p className="font-jakarta text-[14px] text-dimWhite">
                Tidak dapat memuat testimoni. Pastikan backend berjalan.
              </p>
              <button onClick={fetchTestimonials} className="font-jakarta text-[13px] text-[#00b4d8] hover:underline cursor-pointer">
                Coba lagi →
              </button>
            </div>
          )}

          {!loading && !error && testimonials.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-12 w-full">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="font-jakarta text-[14px] text-dimWhite text-center">
                Belum ada testimoni. Jadilah yang pertama!
              </p>
              <button
                type="button"
                onClick={() => setIsPublicFormOpen(true)}
                className="font-jakarta text-[13px] text-[#00b4d8] hover:underline cursor-pointer"
              >
                Tulis testimoni sekarang →
              </button>
            </div>
          )}

          {!loading && !error && testimonials.length > 0 && (
            useCarousel ? (
              <InfiniteMarquee
                testimonials={testimonials}
                isAdmin={isAdmin}
                onEdit={handleEditClick}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ) : (
              <StaticGrid
                testimonials={testimonials}
                isAdmin={isAdmin}
                onEdit={handleEditClick}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            )
          )}
        </div>

        {/* Hint badge when carousel is active */}
        {!loading && !error && useCarousel && (
          <p className="text-center font-jakarta text-[12px] text-dimWhite mt-6 relative z-[1]">
            Gerakkan kursor ke atas kartu untuk berhenti sejenak &nbsp;·&nbsp; {testimonials.length} testimoni
          </p>
        )}
      </section>

      {/* Public submit form */}
      {isPublicFormOpen && (
        <TestimonialForm
          isPublic={true}
          onClose={() => setIsPublicFormOpen(false)}
          onSuccess={fetchTestimonials}
        />
      )}

      {/* Admin form (add/edit) */}
      {showAdminForm && (
        <TestimonialForm
          onClose={() => { setShowAdminForm(false); setEditingTestimonial(null); }}
          onSuccess={fetchTestimonials}
          editData={editingTestimonial}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(3px)" }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[380px] flex flex-col items-center gap-5 border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-jakarta font-bold text-slate-800 text-[16px]">Hapus Testimoni?</p>
              <p className="font-jakarta text-[13px] text-slate-500 mt-1.5">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl font-jakarta font-semibold text-[13px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl font-jakarta font-bold text-[13px] text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-md shadow-red-500/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
          {/* Sync Google Sheet Modal */}
      {showSyncModal && (
        <div
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(3px)" }}
          onClick={() => setShowSyncModal(false)}
        >
          <div
            className="relative bg-white w-full max-w-[580px] rounded-[24px] shadow-[0_24px_70px_rgba(0,4,15,0.22)] overflow-hidden border border-slate-100 p-7 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: "linear-gradient(90deg, #005f73, #00b4d8, #0077b6)" }} />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-jakarta font-bold text-slate-800 text-[19px]">Sinkronisasi Google Sheet</h3>
                <p className="font-jakarta text-xs text-slate-400 mt-1">Hubungkan spreadsheet respon Google Form secara langsung</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {syncMessage && (
              <div className={`p-3 border rounded-xl text-xs font-jakarta flex items-center gap-2 ${
                syncStatus === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                  : "bg-red-50 border-red-200 text-red-600"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${syncStatus === "success" ? "bg-emerald-600" : "bg-red-600"}`} />
                {syncMessage}
              </div>
            )}

            {/* Petunjuk cara mendapatkan CSV link */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col gap-2">
              <h4 className="font-jakarta font-bold text-xs text-slate-700">💡 Cara Mendapatkan URL CSV Google Sheets:</h4>
              <ol className="list-decimal pl-4 text-[11px] font-jakarta text-slate-500 space-y-1.5 leading-relaxed">
                <li>Buka Google Spreadsheet respon Form Anda.</li>
                <li>Klik menu <b>File</b> → <b>Share</b> → <b>Publish to web</b>.</li>
                <li>Ubah pilihan format <b>Web Page</b> menjadi <b>Comma-separated values (.csv)</b>.</li>
                <li>Klik tombol <b>Publish</b>, lalu salin (copy) link URL yang muncul.</li>
                <li>Tempel (paste) link tersebut ke kotak input di bawah ini.</li>
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSyncSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-jakarta font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
                  URL Publik CSV (.csv)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[13px] font-jakarta text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  value={syncUrl}
                  onChange={e => setSyncUrl(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  disabled={syncLoading}
                  className="px-4 py-2 rounded-xl font-jakarta font-semibold text-[12.5px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={syncLoading}
                  className="px-5 py-2.5 rounded-xl font-jakarta font-bold text-[12.5px] text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 shadow-md shadow-cyan-600/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  {syncLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                      Menyinkronkan...
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                      </svg>
                      Simpan & Sync Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      )}
    </>
  );
};

export default Testimonials;
