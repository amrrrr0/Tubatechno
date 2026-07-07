"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getApiUrl } from "@/utils/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const NewsForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    image_url: "",
    status: "draft",
    slug: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });

  const [showSeo, setShowSeo] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock background scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(getApiUrl("/api/news"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // If empty, backend will auto-generate
          slug: form.slug.trim() || undefined,
          seo_title: form.seo_title.trim() || undefined,
          seo_description: form.seo_description.trim() || undefined,
          seo_keywords: form.seo_keywords.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Terjadi kesalahan.");
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch {
      setErrorMsg("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      setSubmitStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "transparent" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full overflow-y-auto rounded-[24px] flex flex-col scrollbar-thin bg-white transition-all duration-300"
        style={{
          maxWidth: showSeo ? "1160px" : "840px",
          maxHeight: "90vh",
          boxShadow: "0 32px 80px rgba(0,4,15,0.22), 0 0 0 1px rgba(0,180,216,0.10)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Decorative top bar */}
        <div className="h-[5px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#005f73,#00b4d8,#0077b6)" }} />

        {submitStatus === "success" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8 flex-1">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-200">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-[18px] text-emerald-600">Berhasil Disimpan!</h3>
            <p className="font-poppins text-[14px] text-gray-500 mt-2 max-w-[280px]">
              Berita Anda telah berhasil ditambahkan ke database CMS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            {/* Split layout container */}
            <div className="flex flex-col md:flex-row flex-1">
              
              {/* Left Column (Inputs) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white">
                <div>
                  {/* Header Row */}
                  <div className="flex items-center gap-2.5 mb-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <h2 className="font-poppins font-bold text-[18px] text-primary-dark">
                      Tambah Berita & Artikel
                    </h2>
                  </div>

                  {/* Judul Berita */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                      Judul Berita <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                        className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Penulis */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                      Penulis <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="author"
                        required
                        value={form.author}
                        onChange={handleChange}
                        className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Konten / Isi Berita */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                      Konten / Isi Berita <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      required
                      rows={6}
                      value={form.content}
                      onChange={handleChange}
                      className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all resize-none bg-gray-50/40 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Controls & SEO) */}
              <div
                className="bg-[#f8fafc] p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-150 flex flex-col justify-between transition-all duration-300"
                style={{ width: showSeo ? "640px" : "320px" }}
              >
                <div className="flex flex-col md:flex-row gap-6 h-full">
                  {/* Sub-column 1: Status & Image URL */}
                  <div className="flex-1 min-w-[260px] flex flex-col justify-between">
                    <div>
                      {/* Status Berita */}
                      <div className="flex flex-col gap-1.5 mb-5">
                        <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                          Status Berita
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 z-10 pointer-events-none">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          </span>
                          <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full font-poppins text-[14px] text-primary-dark border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                          >
                            <option value="draft">Draft (Simpan Internal)</option>
                            <option value="published">Published (Tampilkan Publik)</option>
                          </select>
                        </div>
                      </div>

                      {/* URL Gambar Header */}
                      <div className="flex flex-col gap-1.5 mb-5">
                        <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                          URL Gambar Header
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </span>
                          <input
                            type="url"
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/... (atau kosongkan)"
                            className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                        <span className="text-[12px] text-gray-400 font-poppins mt-0.5">Opsional</span>
                      </div>

                      {/* Divider Line */}
                      <div className="h-px bg-gray-200/80 my-5" />

                      {/* SEO Collapsible Section Button */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => setShowSeo(!showSeo)}
                          className="w-full flex items-center justify-between font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em] hover:text-primary-dark transition-all py-1 cursor-pointer"
                        >
                          <span>Konfigurasi SEO Lanjutan</span>
                          <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            className={`transition-transform duration-200 ${showSeo ? "rotate-180" : ""}`}
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Error Alert inside first sub-column if any */}
                    {submitStatus === "error" && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 mt-4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p className="font-poppins text-[12px] text-rose-600 leading-normal font-medium">{errorMsg}</p>
                      </div>
                    )}
                  </div>

                  {/* Sub-column 2: SEO Fields (Conditional) */}
                  {showSeo && (
                    <div className="flex-1 min-w-[260px] flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-gray-200 pt-5 md:pt-0 md:pl-6 transition-all duration-300">
                      <div className="flex flex-col gap-1">
                        <label className="font-poppins font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                          Kustom URL Slug
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            placeholder="contoh-url-slug"
                            className="w-full font-poppins text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-poppins font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                          Meta Title
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="seo_title"
                            value={form.seo_title}
                            onChange={handleChange}
                            placeholder="Maks 60 karakter"
                            className="w-full font-poppins text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-poppins font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                          Meta Description
                        </label>
                        <textarea
                          name="seo_description"
                          rows={2}
                          value={form.seo_description}
                          onChange={handleChange}
                          placeholder="Maks 160 karakter"
                          className="w-full font-poppins text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 resize-none disabled:opacity-60"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-poppins font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                          Meta Keywords
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="seo_keywords"
                            value={form.seo_keywords}
                            onChange={handleChange}
                            placeholder="Pisahkan dengan koma"
                            className="w-full font-poppins text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer containing Batal & Simpan Berita */}
            <div className="bg-white px-6 md:px-8 py-4 border-t border-gray-150 flex justify-end gap-3 flex-shrink-0 rounded-b-[24px]">
              <button
                type="button"
                onClick={onClose}
                disabled={submitStatus === "loading"}
                className="px-6 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-white bg-slate-500 hover:bg-slate-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="px-6 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
              >
                {submitStatus === "loading" && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {submitStatus === "loading" ? "Menyimpan..." : "Simpan Berita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default NewsForm;
