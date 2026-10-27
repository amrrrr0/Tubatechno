"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getApiUrl } from "@/utils/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const StarSelector: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Buruk", "Kurang", "Cukup", "Bagus", "Sangat Bagus"];
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={s <= (hovered || value) ? "#f59e0b" : "none"}
            stroke={s <= (hovered || value) ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="ml-1 font-poppins text-[12px] text-amber-600 font-semibold">
          {labels[hovered || value]}
        </span>
      )}
    </div>
  );
};

const PublicTestimonialForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", title: "", content: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  const avatarSeed = form.name.trim().replace(/\s+/g, "");
  const avatarUrl = avatarSeed
    ? `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(avatarSeed)}`
    : "";

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.title.trim() || !form.content.trim()) {
      setErrorMsg("Nama, jabatan, dan isi testimoni wajib diisi.");
      return;
    }
    if (form.content.trim().length < 20) {
      setErrorMsg("Testimoni minimal 20 karakter.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(getApiUrl("/api/testimonials"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Terjadi kesalahan.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch {
      setErrorMsg("Tidak dapat terhubung ke server. Coba lagi.");
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[620px] rounded-[24px] bg-white shadow-[0_24px_70px_rgba(0,4,15,0.22)] overflow-hidden border border-slate-100">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: "linear-gradient(90deg,#005f73,#00b4d8,#0077b6)" }} />

        <div className="px-7 pt-9 pb-0 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-poppins font-bold text-slate-800 text-[20px]">Tulis Testimoni</h3>
              <p className="font-poppins text-[13px] text-slate-400 mt-1">
                Bagikan pengalaman Anda bersama HelioTechno
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Success */}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 pb-9">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-poppins font-bold text-[17px] text-slate-800">Terima Kasih!</p>
                <p className="font-poppins text-[13px] text-slate-500 mt-1.5">
                  Testimoni Anda telah berhasil dikirim dan akan segera tampil.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {status !== "success" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-6">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[12.5px] font-poppins">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Avatar Preview */}
              {avatarUrl && (
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-contain bg-white border border-slate-200"
                  />
                  <div>
                    <p className="font-poppins font-semibold text-[13px] text-slate-700">{form.name}</p>
                    <p className="font-poppins text-[10.5px] text-slate-400">Avatar otomatis dari nama Anda</p>
                  </div>
                </div>
              )}

              {/* Nama + Jabatan row */}
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.07em]">
                    Nama <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={80}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.07em]">
                    Jabatan / Peran <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Pemilik UMKM, Mahasiswa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.07em]">Rating</label>
                <StarSelector value={form.rating} onChange={(v) => setForm(p => ({ ...p, rating: v }))} />
              </div>

              {/* Isi Testimoni */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.07em]">
                  Testimoni <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="content"
                  rows={4}
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan HelioTechno..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all resize-none leading-relaxed"
                  value={form.content}
                  onChange={handleChange}
                />
                <div className="flex justify-between">
                  <span className="text-[10.5px] font-poppins text-slate-400">Minimal 20 karakter</span>
                  <span className={`text-[10.5px] font-poppins ${form.content.length >= 20 ? "text-emerald-500" : "text-slate-400"}`}>
                    {form.content.length} karakter
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {status !== "success" && (
          <div className="flex items-center justify-end gap-2.5 px-7 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={status === "loading"}
              className="px-5 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="px-6 py-2.5 rounded-xl font-poppins font-bold text-[13px] text-white bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed shadow-md shadow-cyan-600/15 transition-all cursor-pointer flex items-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Kirim Testimoni
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PublicTestimonialForm;
