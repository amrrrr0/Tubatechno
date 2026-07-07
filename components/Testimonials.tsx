"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import TestimonialForm, { TestimonialEditData } from "./TestimonialForm";
import PublicTestimonialForm from "./PublicTestimonialForm";

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

const CARD_W = 320;
const CARD_H = 350;

const TestimonialCard: React.FC<CardProps> = ({ t, isAdmin, onEdit, onDelete }) => (
  <div
    className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#00b4d8]/30 hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden flex-shrink-0"
    style={{
      boxShadow: "0 2px 16px rgba(0,4,15,0.06)",
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
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
    <div className="flex items-start justify-between mb-3 flex-shrink-0">
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

    {/* Content — fixed lines */}
    <p
      className="font-poppins font-normal text-[14px] leading-[22px] text-[#374151] flex-1 mb-4 overflow-hidden"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 6,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {t.content}
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-3.5 border-t border-gray-100 flex-shrink-0">
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100 border-2 border-white"
          style={{ boxShadow: "0 2px 8px rgba(0,180,216,0.15)" }}
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
      </div>
      <div className="min-w-0">
        <h4 className="font-poppins font-semibold text-[14px] leading-tight text-primary-dark truncate">{t.name}</h4>
        <p className="font-poppins text-[12px] leading-[18px] text-dimWhite truncate">{t.title}</p>
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
          animation: `testimonials-scroll ${testimonials.length * 8}s linear infinite`,
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

// ── Static Grid (≤ 3 testimonials) — equal height CSS grid ───
const StaticGrid: React.FC<{
  testimonials: Testimonial[];
  isAdmin: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: number) => void;
}> = ({ testimonials, isAdmin, onEdit, onDelete }) => (
  <div
    className="flex flex-wrap justify-center gap-5 w-full"
    style={{ alignItems: "stretch" }}
  >
    {testimonials.map((t) => (
      <TestimonialCard key={t.id} t={t} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </div>
);

// ── Main Testimonials section ─────────────────────────────────
const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPublicForm, setShowPublicForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialEditData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      try { setIsAdmin(!!localStorage.getItem("admin_session")); } catch { setIsAdmin(false); }
    };
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    document.addEventListener("admin_session_changed", checkAdmin);
    return () => {
      window.removeEventListener("storage", checkAdmin);
      document.removeEventListener("admin_session_changed", checkAdmin);
    };
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("http://localhost:5000/api/testimonials");
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
      const res = await fetch(`http://localhost:5000/api/testimonials/${deleteConfirmId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setTestimonials(prev => prev.filter(t => t.id !== deleteConfirmId));
    } catch { /* ignore */ }
    finally { setDeleteConfirmId(null); }
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

      <section id="clients" className="sm:py-16 py-10 flex flex-col relative">
        <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient pointer-events-none" />

        {/* Header */}
        <div className="w-full flex justify-between items-end md:flex-row flex-col sm:mb-10 mb-8 relative z-[1] gap-6">
          <div>
            <h1 className="font-poppins font-semibold xs:text-[48px] text-[30px] text-primary-dark xs:leading-[76.8px] leading-[42px]">
              Apa Kata Mitra <br className="sm:block hidden" /> Tentang HelioNexus.
            </h1>
            <p className="font-poppins font-normal text-dimWhite text-[15px] sm:text-[17px] leading-[26px] sm:leading-[30px] max-w-[450px] mt-3">
              Testimoni nyata dari pelaku UMKM dan instansi yang telah mendigitalisasi operasional mereka bersama solusi teknologi kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0 self-start md:self-auto">
            {/* Public: open Google Form */}
            <a
              href="https://forms.gle/pctZiieNbLgiWihdA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-semibold text-[14px] text-white bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] transition-all shadow-md shadow-[#00b4d8]/20 cursor-pointer whitespace-nowrap no-underline"
              aria-label="Tulis testimoni"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Tulis Testimoni
            </a>

            {/* Admin only */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleAddClick}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-poppins font-semibold text-[13px] text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Manual
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-[1] w-full">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="font-poppins text-[14px] text-dimWhite">Memuat testimoni...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <p className="font-poppins text-[14px] text-dimWhite">
                Tidak dapat memuat testimoni. Pastikan backend berjalan.
              </p>
              <button onClick={fetchTestimonials} className="font-poppins text-[13px] text-[#00b4d8] hover:underline cursor-pointer">
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
              <p className="font-poppins text-[14px] text-dimWhite text-center">
                Belum ada testimoni. Jadilah yang pertama!
              </p>
              <button
                type="button"
                onClick={() => setShowPublicForm(true)}
                className="font-poppins text-[13px] text-[#00b4d8] hover:underline cursor-pointer"
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
          <p className="text-center font-poppins text-[12px] text-dimWhite mt-6 relative z-[1]">
            Gerakkan kursor ke atas kartu untuk berhenti sejenak &nbsp;·&nbsp; {testimonials.length} testimoni
          </p>
        )}
      </section>

      {/* Public submit form */}
      {showPublicForm && (
        <PublicTestimonialForm
          onClose={() => setShowPublicForm(false)}
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
              <p className="font-poppins font-bold text-slate-800 text-[16px]">Hapus Testimoni?</p>
              <p className="font-poppins text-[13px] text-slate-500 mt-1.5">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl font-poppins font-bold text-[13px] text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-md shadow-red-500/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonials;
