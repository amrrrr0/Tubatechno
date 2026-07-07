"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface BusinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editData?: {
    id: number;
    title: string;
    tagline: string;
    category: string;
    features: string[];
    isFeatured: boolean;
    logoUrl: string;
    websiteUrl: string;
  } | null;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ isOpen, onClose, onSave, editData }) => {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setTagline(editData.tagline);
      setCategory(editData.category);
      setLogoUrl(editData.logoUrl || "");
      setLogoPreview(editData.logoUrl || "");
      setWebsiteUrl(editData.websiteUrl || "");
      setIsFeatured(editData.isFeatured);
      setFeatures(editData.features.length > 0 ? [...editData.features] : [""]);
    } else {
      setTitle("");
      setTagline("");
      setCategory("");
      setLogoUrl("");
      setLogoPreview("");
      setWebsiteUrl("");
      setIsFeatured(false);
      setFeatures([""]);
    }
    setError("");
  }, [editData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── File Upload Handler ────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError("Hanya file gambar (PNG, JPG, GIF, WEBP, SVG) yang diperbolehkan.");
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB.");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploadLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload/logo", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Upload gagal.");

      setLogoUrl(data.url);
      setLogoPreview(data.url);
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah gambar.");
      setLogoPreview("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveLogo = () => {
    setLogoUrl("");
    setLogoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Features ──────────────────────────────────────────────
  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (index: number) => {
    const next = features.filter((_, i) => i !== index);
    setFeatures(next.length === 0 ? [""] : next);
  };
  const handleFeatureChange = (index: number, value: string) => {
    const next = [...features];
    next[index] = value;
    setFeatures(next);
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !tagline.trim() || !category.trim()) {
      setError("Nama unit, slogan, dan kategori wajib diisi.");
      return;
    }
    const filteredFeatures = features.map(f => f.trim()).filter(Boolean);
    if (filteredFeatures.length === 0) {
      setError("Minimal tambahkan 1 fitur atau layanan.");
      return;
    }

    setLoading(true);
    const payload = {
      title: title.trim(),
      tagline: tagline.trim(),
      category: category.trim(),
      features: filteredFeatures,
      isFeatured,
      logoUrl: logoUrl.trim(),
      websiteUrl: websiteUrl.trim() || "#"
    };

    try {
      const url = editData
        ? `http://localhost:5000/api/business-units/${editData.id}`
        : "http://localhost:5000/api/business-units";

      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal menyimpan.");

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: "transparent" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full overflow-y-auto rounded-[24px] flex flex-col scrollbar-thin bg-white transition-all duration-300"
        style={{
          maxWidth: "1140px",
          maxHeight: "90vh",
          boxShadow: "0 32px 80px rgba(0,4,15,0.22), 0 0 0 1px rgba(0,180,216,0.10)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Decorative top bar */}
        <div className="h-[5px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#005f73,#00b4d8,#0077b6)" }} />

        {/* Split layout */}
        <div className="flex flex-col md:flex-row flex-1">

          {/* Left Column — Main Fields */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-5 bg-white">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <h2 className="font-poppins font-bold text-[18px] text-primary-dark">
                {editData ? "Edit Unit Bisnis" : "Tambah Unit Bisnis"}
              </h2>
            </div>

            {/* Nama Unit */}
            <div className="flex flex-col gap-1.5">
              <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                Nama Unit Bisnis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: UMPKU Tirta"
                className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Slogan */}
            <div className="flex flex-col gap-1.5">
              <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                Slogan / Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Air Minum Alami & Higienis"
                className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
              />
            </div>

            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Layanan Umum, Solusi Digital"
                className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>

            {/* Website URL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                URL Website Unit
                <span className="ml-1.5 font-normal normal-case text-slate-400">— tombol &quot;Selengkapnya&quot; akan membuka link ini</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </span>
                <input
                  type="url"
                  placeholder="https://website-unit.com"
                  className="w-full font-poppins text-[14px] text-primary-dark placeholder:text-gray-300 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all bg-gray-50/40"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column — Logo + Fitur + Toggle */}
          <div className="bg-[#f8fafc] p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-150 flex flex-col justify-between" style={{ width: "620px" }}>
            <div className="flex flex-col md:flex-row gap-6 w-full h-full">
              
              {/* Left Sub-column: Logo Upload & Jadikan Unggulan */}
              <div className="flex-1 min-w-[260px] flex flex-col gap-4">
                {/* ── LOGO UPLOAD ── */}
                <div className="flex flex-col gap-2">
                  <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                    Logo Unit (PNG / JPG / SVG)
                  </label>
                  <div
                    className={`relative w-full h-[120px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                      isDragging
                        ? "border-cyan-400 bg-cyan-50/50 scale-[1.01]"
                        : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/5"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {logoPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoPreview}
                          alt="logo preview"
                          className="w-12 h-12 object-contain rounded-xl"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        {uploadLoading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <span className="text-[10px] font-poppins text-slate-400">Klik atau seret untuk ganti</span>
                      </>
                    ) : (
                      <>
                        {uploadLoading ? (
                          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="3" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                        <div className="text-center px-2">
                          <p className="font-poppins font-semibold text-[11.5px] text-slate-600">Klik untuk pilih gambar</p>
                          <p className="font-poppins text-[9.5px] text-slate-400 mt-0.5 leading-tight">atau seret &amp; lepas</p>
                        </div>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml" className="hidden" onChange={handleFileInputChange} />
                  {logoPreview && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-[10px] font-poppins text-slate-500 truncate">{logoUrl || logoPreview}</div>
                      <button type="button" onClick={handleRemoveLogo} className="px-2 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-poppins font-semibold cursor-pointer transition-colors flex-shrink-0 border border-red-100">Hapus</button>
                    </div>
                  )}
                </div>

                {/* Jadikan Unggulan toggle */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/70 rounded-xl">
                  <div>
                    <span className="text-[12px] font-poppins font-bold text-slate-700">Jadikan Unggulan</span>
                    <span className="block text-[10px] font-poppins text-slate-400 mt-0.5">Sorotan warna &amp; glow</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="font-poppins text-[12px] text-rose-600 leading-normal font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px bg-gray-200/80 self-stretch" />

              {/* Right Sub-column: Daftar Fitur / Layanan */}
              <div className="flex-1 min-w-[260px] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-poppins font-semibold text-[11px] text-dimWhite uppercase tracking-[0.08em]">
                    Daftar Fitur / Layanan <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-[11px] font-poppins font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer flex items-center gap-1"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Tambah Baris
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-poppins text-slate-400 font-semibold w-4 text-right flex-shrink-0">{idx + 1}</span>
                      <input
                        type="text"
                        placeholder={`Fitur atau layanan ke-${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-[12.5px] font-poppins text-primary-dark placeholder:text-gray-300 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all"
                        value={feature}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors cursor-pointer text-xs border border-red-100/80"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 md:px-8 py-4 border-t border-gray-150 flex justify-end gap-3 flex-shrink-0 rounded-b-[24px]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-white bg-slate-500 hover:bg-slate-600 disabled:opacity-50 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadLoading}
            className="px-6 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Simpan Unit</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BusinessForm;
