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

  if (!isOpen) return null;

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

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      {/* Modal — centered, max-width 680px, single column */}
      <div className="relative bg-white w-full max-w-[680px] rounded-[24px] shadow-[0_24px_70px_rgba(0,4,15,0.22)] overflow-hidden z-10 border border-slate-100 my-auto">
        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: "linear-gradient(90deg, #005f73, #00b4d8, #0077b6)" }} />

        {/* Scrollable body */}
        <div className="px-8 pt-10 pb-6 flex flex-col gap-5 max-h-[88vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-poppins font-bold text-slate-800 text-[19px] leading-tight">
                {editData ? "Edit Unit Bisnis" : "Tambah Unit Bisnis"}
              </h3>
              <p className="font-poppins text-xs text-slate-400 mt-0.5">Isi data unit usaha UMPKU</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-poppins flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── LOGO UPLOAD (Centered) ────────────────────────── */}
          <div className="flex flex-col items-center gap-3">
            <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em] self-start">
              Logo Unit (PNG / JPG / SVG)
            </label>

            {/* Drop zone / preview */}
            <div
              className={`relative w-full h-[160px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                isDragging
                  ? "border-cyan-400 bg-cyan-50/50 scale-[1.01]"
                  : "border-slate-200 bg-slate-50/50 hover:border-cyan-300 hover:bg-cyan-50/20"
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
                    className="w-20 h-20 object-contain rounded-xl"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <span className="text-[11px] font-poppins text-slate-400">Klik atau seret untuk ganti</span>
                </>
              ) : (
                <>
                  {uploadLoading ? (
                    <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-poppins font-semibold text-[13px] text-slate-600">
                      Klik untuk pilih gambar
                    </p>
                    <p className="font-poppins text-[11px] text-slate-400 mt-0.5">
                      atau seret & lepas di sini · Maks. 2MB · PNG, JPG, SVG
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Remove button + URL field row */}
            {logoPreview && (
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[11.5px] font-poppins text-slate-500 truncate">
                  {logoUrl || logoPreview}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-[11px] font-poppins font-semibold cursor-pointer transition-colors flex-shrink-0 border border-red-100"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* ── FIELDS ────────────────────────────────────────── */}
          {/* Nama Unit */}
          <div className="flex flex-col gap-1.5">
            <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
              Nama Unit Bisnis <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: UMPKU Tirta"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Slogan */}
          <div className="flex flex-col gap-1.5">
            <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
              Slogan / Tagline <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Air Minum Alami & Higienis"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1.5">
            <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
              Kategori <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Layanan Umum, Solusi Digital"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </div>

          {/* Website URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
              URL Website Unit
              <span className="ml-1.5 font-normal normal-case text-slate-400">— tombol "Selengkapnya" akan membuka link ini</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </span>
              <input
                type="url"
                placeholder="https://website-unit.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-[13.5px] font-poppins text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Unggulan toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div>
              <span className="text-[13px] font-poppins font-bold text-slate-700">Jadikan Unggulan</span>
              <span className="block text-[11px] font-poppins text-slate-400 mt-0.5">Sorotan warna cyan & glow pada kartu</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Features builder */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-poppins font-semibold text-[11px] text-slate-500 uppercase tracking-[0.08em]">
                Daftar Fitur / Layanan <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-[11px] font-poppins font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Tambah Baris
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-0.5">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                    <span className="text-[10px] font-poppins text-slate-400 font-semibold">{idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    placeholder={`Fitur atau layanan ke-${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/40 text-[12.5px] font-poppins text-slate-700 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all"
                    value={feature}
                    onChange={e => handleFeatureChange(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors cursor-pointer text-xs border border-red-100/80"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 px-8 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadLoading}
            className="px-6 py-2.5 rounded-xl font-poppins font-bold text-[13px] text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Simpan Unit
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BusinessForm;
