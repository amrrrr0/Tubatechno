"use client";

import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const TestimonialForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", title: "", content: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [hovered, setHovered] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.message || "Terjadi kesalahan."); setStatus("error"); return; }
      setStatus("success");
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch {
      setErrorMsg("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "transparent" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-3xl"
        style={{
          background: "#fff",
          boxShadow: "0 32px 80px rgba(0,4,15,0.22), 0 0 0 1px rgba(0,180,216,0.10)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Decorative top bar */}
        <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg,#005f73,#00b4d8,#0077b6)" }} />

        {/* Floating avatar preview */}
        <div className="flex flex-col items-center pt-8 pb-2 px-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-4 border-white overflow-hidden"
            style={{ background: "linear-gradient(135deg,#e0f7fa,#b2ebf2)", boxShadow: "0 8px 24px rgba(0,180,216,0.18)" }}
          >
            {form.name ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(form.name.replace(/\s+/g, ""))}`}
                alt="avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <h2 className="font-poppins font-bold text-[20px] text-primary-dark text-center leading-tight">
            Bagikan Pengalaman Anda
          </h2>
          <p className="font-poppins text-[13px] text-dimWhite mt-1 text-center">
            Ceritakan bagaimana HelioNexus membantu bisnis Anda tumbuh
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-dimWhite hover:text-primary-dark hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Tutup"
          style={{ fontSize: "20px", lineHeight: 1 }}
        >
          ×
        </button>

        {/* Divider */}
        <div className="mx-8 mt-4 mb-0 h-px bg-gray-100" />

        <div className="px-8 py-6">
          {status === "success" ? (
            /* ── Success state ───────────────────────── */
            <div className="flex flex-col items-center py-8 gap-4">
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", boxShadow: "0 8px 24px rgba(16,185,129,0.2)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-poppins font-bold text-[17px] text-primary-dark">Testimoni Terkirim!</p>
                <p className="font-poppins text-[13px] text-dimWhite mt-1">
                  Terima kasih atas kepercayaan Anda kepada HelioNexus.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ───────────────────────────────── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Name input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[12px] text-dimWhite uppercase tracking-[0.08em]">
                  Nama Lengkap <span className="text-[#00b4d8]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="contoh: Ahmad Fauzi"
                    required
                    maxLength={80}
                    disabled={status === "loading"}
                    className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[12px] text-dimWhite uppercase tracking-[0.08em]">
                  Jabatan / Instansi <span className="text-[#00b4d8]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                  </span>
                  <input
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="contoh: CEO PT Maju Bersama"
                    required
                    maxLength={100}
                    disabled={status === "loading"}
                    className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[12px] text-dimWhite uppercase tracking-[0.08em]">
                  Penilaian <span className="text-[#00b4d8]">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={status === "loading"}
                      onClick={() => setForm((p) => ({ ...p, rating: star }))}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="p-0.5 transition-transform hover:scale-110 cursor-pointer disabled:cursor-not-allowed"
                      aria-label={`Beri rating ${star} bintang`}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill={(hovered || form.rating) >= star ? "#f59e0b" : "none"}
                        stroke={(hovered || form.rating) >= star ? "#f59e0b" : "#d1d5db"}
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-all duration-150"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 font-poppins text-[13px] text-dimWhite">
                    {["" , "Buruk", "Kurang", "Cukup", "Bagus", "Sangat Bagus!"][hovered || form.rating]}
                  </span>
                </div>
              </div>

              {/* Testimonial textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="font-poppins font-semibold text-[12px] text-dimWhite uppercase tracking-[0.08em]">
                  Testimoni <span className="text-[#00b4d8]">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Ceritakan pengalaman Anda bekerja sama dengan HelioNexus..."
                  required
                  minLength={20}
                  rows={4}
                  disabled={status === "loading"}
                  className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 resize-none disabled:opacity-60"
                />
                {/* Character count bar */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1 rounded-full bg-gray-100 mr-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (form.content.length / 200) * 100)}%`,
                        background: form.content.length < 20
                          ? "#fca5a5"
                          : form.content.length < 100
                          ? "#00b4d8"
                          : "#059669",
                      }}
                    />
                  </div>
                  <span className={`font-poppins text-[11px] flex-shrink-0 ${form.content.length < 20 ? "text-red-400" : "text-dimWhite"}`}>
                    {form.content.length} / min. 20
                  </span>
                </div>
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="font-poppins text-[13px] text-red-600">{errorMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-xl font-poppins font-semibold text-[14px] text-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                style={{
                  background: "linear-gradient(90deg,#0077b6,#00b4d8)",
                  boxShadow: "0 8px 24px rgba(0,180,216,0.25)",
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Kirim Testimoni
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </span>
                )}
              </button>

              <p className="font-poppins text-[11px] text-center text-dimWhite -mt-1">
                Avatar akan dibuat otomatis dari nama Anda 🎨
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialForm;
