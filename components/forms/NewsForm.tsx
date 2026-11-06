"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getApiUrl } from "@/utils/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  editData?: any; // Add editData prop
}

const NewsForm: React.FC<Props> = ({ onClose, onSuccess, editData }) => {
  const isEdit = !!editData;
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

  // Pre-fill form if editing
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        content: editData.content || "",
        author: editData.author || "",
        image_url: editData.image_url || "",
        status: editData.status || "draft",
        slug: editData.slug || "",
        seo_title: editData.seo_title || "",
        seo_description: editData.seo_description || "",
        seo_keywords: editData.seo_keywords || "",
      });
      if (editData.seo_keywords) {
        const firstKwd = editData.seo_keywords.split(",")[0].trim();
        setFocusKeyword(firstKwd);
      }
    }
  }, [editData]);

  const [showSeo, setShowSeo] = useState(true);
  const [focusKeyword, setFocusKeyword] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("mobile");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleFixSlug = () => {
    const clean = form.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .replace(/(^-|-$)/g, ""); // Trim - from start and end
    setForm(prev => ({ ...prev, slug: clean }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMsg("");

    try {
      const url = isEdit ? getApiUrl(`/api/news/${editData.id}`) : getApiUrl("/api/news");
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("logo", file); // The endpoint expects 'logo' field name

    try {
      const res = await fetch(getApiUrl("/api/upload/logo"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setForm(prev => ({ ...prev, image_url: data.url }));
      } else {
        setErrorMsg(data.message || "Gagal mengunggah gambar.");
      }
    } catch (err) {
      setErrorMsg("Tidak dapat terhubung ke server upload.");
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be uploaded again if needed
      if (e.target) e.target.value = '';
    }
  };

  // SEO Analysis calculations
  const seoTitleLength = form.seo_title.trim() ? form.seo_title.length : (form.title.trim() ? form.title.length + 13 : 0);
  const seoDescLength = form.seo_description.trim() ? form.seo_description.length : Math.min(160, form.content.replace(/<[^>]*>/g, "").length);
  const isTitleLengthOk = seoTitleLength >= 40 && seoTitleLength <= 60;
  const isDescLengthOk = seoDescLength >= 120 && seoDescLength <= 160;
  const isSlugValid = !form.slug || /^[a-z0-9-]+$/.test(form.slug);

  const getWordCount = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const getKeywordCount = (text: string, keyword: string) => {
    if (!keyword.trim() || !text.trim()) return 0;
    const escapedKwd = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(escapedKwd, "gi"); // Search globally case-insensitive
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const wordCount = getWordCount(form.content);
  const keywordCount = getKeywordCount(form.content, focusKeyword);
  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

  const hasKeywordInTitle = focusKeyword.trim() ? (form.seo_title || form.title).toLowerCase().includes(focusKeyword.toLowerCase()) : false;
  const hasKeywordInDesc = focusKeyword.trim() ? (form.seo_description || (form.content.substring(0, 160))).toLowerCase().includes(focusKeyword.toLowerCase()) : false;
  const hasKeywordInContent = focusKeyword.trim() ? form.content.toLowerCase().includes(focusKeyword.toLowerCase()) : false;

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
            <h3 className="font-jakarta font-bold text-[18px] text-emerald-600">Berhasil Disimpan!</h3>
            <p className="font-jakarta text-[14px] text-gray-500 mt-2 max-w-[280px]">
              {isEdit ? "Berita Anda telah berhasil diperbarui di database." : "Berita Anda telah berhasil ditambahkan ke database."}
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
                    <h2 className="font-jakarta font-bold text-[18px] text-primary-dark">
                      {isEdit ? "Edit Berita & Artikel" : "Tambah Berita & Artikel"}
                    </h2>
                  </div>

                  {/* Judul Berita */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
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
                        className="w-full font-jakarta text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Penulis */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
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
                        className="w-full font-jakarta text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Konten / Isi Berita */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                      Konten / Isi Berita <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      required
                      rows={6}
                      value={form.content}
                      onChange={handleChange}
                      className="w-full font-jakarta text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all resize-none bg-gray-50/40 disabled:opacity-60"
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
                        <label className="font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                          {isEdit ? "Perbarui Berita" : "Simpan Berita"}
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
                            className="w-full font-jakarta text-[14px] text-primary-dark border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                          >
                            <option value="draft">Draft (Simpan Internal)</option>
                            <option value="published">Published (Tampilkan Publik)</option>
                          </select>
                        </div>
                      </div>

                      {/* URL Gambar Header */}
                      <div className="flex flex-col gap-1.5 mb-5">
                        <label className="font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                          URL Gambar Header
                        </label>
                        <div className="relative flex gap-2">
                          <div className="relative flex-1">
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
                              placeholder="URL atau unggah ->"
                              className="w-full font-jakarta text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                            />
                          </div>
                          
                          {/* Upload Button */}
                          <div className="relative flex-shrink-0">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              disabled={uploadingImage}
                              title="Unggah Gambar Lokal"
                            />
                            <button
                              type="button"
                              disabled={uploadingImage}
                              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#e0f7fa]/60 text-[#0077b6] border border-[#00b4d8]/20 hover:bg-[#cbf1f6] hover:border-[#00b4d8]/40 transition-colors pointer-events-none"
                            >
                              {uploadingImage ? (
                                <svg className="animate-spin h-5 w-5 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <span className="text-[12px] text-gray-400 font-jakarta mt-0.5 flex justify-between">
                          <span>Tempel URL atau unggah file.</span>
                          <span>(Maks 2MB)</span>
                        </span>
                      </div>

                      {/* Divider Line */}
                      <div className="h-px bg-gray-200/80 my-5" />

                      {/* SEO Collapsible Section Button */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => setShowSeo(!showSeo)}
                          className="w-full flex items-center justify-between font-jakarta font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em] hover:text-primary-dark transition-all py-1 cursor-pointer"
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
                        <p className="font-jakarta text-[12px] text-rose-600 leading-normal font-medium">{errorMsg}</p>
                      </div>
                    )}
                  </div>

                  {/* Sub-column 2: SEO Fields (Conditional) */}
                  {showSeo && (
                    <div className="flex-1 min-w-[260px] flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-gray-200 pt-5 md:pt-0 md:pl-6 transition-all duration-300">
                      {/* URL Slug */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label className="font-jakarta font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                            Kustom URL Slug
                          </label>
                          {!isSlugValid && (
                            <button
                              type="button"
                              onClick={handleFixSlug}
                              className="px-2 py-0.5 rounded bg-amber-500 text-white font-jakarta text-[9px] font-bold hover:bg-amber-600 transition-colors active:scale-95 cursor-pointer"
                              title="Bersihkan slug otomatis"
                            >
                              Auto-Fix
                            </button>
                          )}
                        </div>
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
                            className={`w-full font-jakarta text-[13px] text-primary-dark placeholder:text-gray-300 border ${isSlugValid ? "border-gray-200" : "border-red-400 focus:border-red-500 focus:ring-red-500/15"} rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60`}
                          />
                        </div>
                        {!isSlugValid && (
                          <span className="text-[9.5px] font-jakarta text-red-500 font-semibold mt-0.5">
                            * Slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-).
                          </span>
                        )}
                      </div>

                      {/* Meta Title */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label className="font-jakarta font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                            Meta Title
                          </label>
                          <span className={`text-[9px] font-bold font-jakarta px-1.5 py-0.5 rounded ${
                            seoTitleLength > 60 ? "bg-red-100 text-red-600 border border-red-200" :
                            seoTitleLength >= 40 ? "bg-emerald-100 text-emerald-600 border border-emerald-200" :
                            "bg-amber-100 text-amber-600 border border-amber-200"
                          }`}>
                            {seoTitleLength} / 60
                          </span>
                        </div>
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
                            className="w-full font-jakarta text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label className="font-jakarta font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
                            Meta Description
                          </label>
                          <span className={`text-[9px] font-bold font-jakarta px-1.5 py-0.5 rounded ${
                            seoDescLength > 160 ? "bg-red-100 text-red-600 border border-red-200" :
                            seoDescLength >= 120 ? "bg-emerald-100 text-emerald-600 border border-emerald-200" :
                            "bg-amber-100 text-amber-600 border border-amber-200"
                          }`}>
                            {seoDescLength} / 160
                          </span>
                        </div>
                        <textarea
                          name="seo_description"
                          rows={2}
                          value={form.seo_description}
                          onChange={handleChange}
                          placeholder="Maks 160 karakter"
                          className="w-full font-jakarta text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 resize-none disabled:opacity-60"
                        />
                      </div>

                      {/* Meta Keywords */}
                      <div className="flex flex-col gap-1">
                        <label className="font-jakarta font-semibold text-[10px] text-dimWhite uppercase tracking-[0.08em]">
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
                            className="w-full font-jakarta text-[13px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      {/* SEO Real-Time Analyzer Card */}
                      <div className="p-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-2.5">
                        <span className="font-jakarta font-bold text-[10px] text-[#0077b6] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2 select-none">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                          SEO Real-Time Analyzer
                        </span>

                        <div className="flex flex-col gap-2.5 font-jakarta text-[11px] text-gray-600">
                          {/* Focus Keyword input */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-500">Kata Kunci Fokus:</span>
                            <input
                              type="text"
                              placeholder="Ketik kata kunci..."
                              value={focusKeyword}
                              onChange={(e) => setFocusKeyword(e.target.value)}
                              className="px-2.5 py-1 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:border-[#00b4d8] w-36 bg-gray-50/50 font-jakarta"
                            />
                          </div>

                          {/* Analysis Checklist */}
                          <div className="flex flex-col gap-2 pt-1 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${isTitleLengthOk ? "bg-emerald-500" : "bg-amber-500"}`}>
                                {isTitleLengthOk ? "✓" : "!"}
                              </span>
                              <span>Panjang Judul SEO: {seoTitleLength}/60 karakter</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${isDescLengthOk ? "bg-emerald-500" : "bg-amber-500"}`}>
                                {isDescLengthOk ? "✓" : "!"}
                              </span>
                              <span>Panjang Deskripsi: {seoDescLength}/160 karakter</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${isSlugValid ? "bg-emerald-500" : "bg-red-500"}`}>
                                {isSlugValid ? "✓" : "✗"}
                              </span>
                              <span className={isSlugValid ? "" : "text-red-500 font-semibold"}>URL Slug: {isSlugValid ? "Valid" : "Format Salah"}</span>
                            </div>

                            {focusKeyword.trim() ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${hasKeywordInTitle ? "bg-emerald-500" : "bg-amber-500"}`}>
                                    {hasKeywordInTitle ? "✓" : "!"}
                                  </span>
                                  <span>Kata kunci di Judul: {hasKeywordInTitle ? "Ditemukan" : "Tidak ada"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${hasKeywordInDesc ? "bg-emerald-500" : "bg-amber-500"}`}>
                                    {hasKeywordInDesc ? "✓" : "!"}
                                  </span>
                                  <span>Kata kunci di Deskripsi: {hasKeywordInDesc ? "Ditemukan" : "Tidak ada"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white select-none ${hasKeywordInContent && keywordDensity >= 0.8 && keywordDensity <= 2.5 ? "bg-emerald-500" : "bg-amber-500"}`}>
                                    {hasKeywordInContent && keywordDensity >= 0.8 && keywordDensity <= 2.5 ? "✓" : "!"}
                                  </span>
                                  <span>
                                    Kepadatan Kata Kunci: {keywordDensity.toFixed(1)}% ({keywordCount}x)
                                    {keywordDensity > 2.5 ? " - Terlalu Tinggi!" : keywordDensity < 0.8 ? " - Terlalu Rendah" : " - Optimal"}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="text-[9.5px] text-slate-400 italic mt-1 leading-normal select-none">
                                * Masukkan kata kunci fokus di atas untuk menganalisis kepadatan kata dan optimasi SEO halaman.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Google Search Mockup Snippet */}
                      <div className="p-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-2.5">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2 select-none">
                          <span className="font-jakarta font-bold text-[10px] text-[#0077b6] uppercase tracking-wider flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            Google SERP Preview
                          </span>
                          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => setPreviewMode("mobile")}
                              className={`px-2 py-0.5 text-[9px] font-jakarta font-semibold rounded-md transition-all cursor-pointer ${previewMode === "mobile" ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-gray-400 hover:text-gray-600"}`}
                            >
                              Mobile
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewMode("desktop")}
                              className={`px-2 py-0.5 text-[9px] font-jakarta font-semibold rounded-md transition-all cursor-pointer ${previewMode === "desktop" ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-gray-400 hover:text-gray-600"}`}
                            >
                              Desktop
                            </button>
                          </div>
                        </div>

                        {previewMode === "mobile" ? (
                          <div className="p-3 border border-slate-100 rounded-xl bg-white flex flex-col font-sans max-w-[270px] select-none text-left">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
                              <span className="font-semibold text-gray-800">TubaTechno</span>
                              <span>›</span>
                              <span>news</span>
                              <span>›</span>
                              <span className="truncate max-w-[70px]">{form.slug || "slug-berita"}</span>
                            </div>
                            <h4 className="text-[#1a0dab] font-medium text-[14px] leading-tight hover:underline mb-1 line-clamp-2">
                              {form.seo_title || (form.title ? `${form.title} | TubaTechno` : "Judul Berita | TubaTechno")}
                            </h4>
                            <p className="text-[#4d5156] text-[11px] leading-relaxed line-clamp-3">
                              {form.seo_description || (form.content ? form.content.substring(0, 140).replace(/<[^>]*>/g, "") : "Deskripsi SEO akan muncul di sini...")}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 border border-slate-100 rounded-xl bg-white flex flex-col font-sans select-none text-left">
                            <div className="text-[11px] text-gray-500 mb-0.5 flex items-center gap-1">
                              <span>http://localhost:3000</span>
                              <span>›</span>
                              <span>news</span>
                              <span>›</span>
                              <span className="truncate max-w-[120px]">{form.slug || "slug-berita"}</span>
                            </div>
                            <h4 className="text-[#1a0dab] text-[16px] font-medium leading-normal hover:underline mb-1">
                              {form.seo_title || (form.title ? `${form.title} | TubaTechno` : "Judul Berita | TubaTechno")}
                            </h4>
                            <p className="text-[#4d5156] text-[12px] leading-relaxed line-clamp-2">
                              {form.seo_description || (form.content ? form.content.substring(0, 150).replace(/<[^>]*>/g, "") : "Deskripsi SEO akan muncul di sini...")}
                            </p>
                          </div>
                        )}
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
                className="px-6 py-2.5 rounded-xl font-jakarta font-semibold text-[13px] text-white bg-slate-500 hover:bg-slate-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="px-6 py-2.5 rounded-xl font-jakarta font-semibold text-[13px] text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
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
