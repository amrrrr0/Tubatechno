"use client";

import React, { useState, useEffect, useCallback } from "react";
import BusinessForm from "../forms/BusinessForm";
import { getApiUrl } from "@/utils/api";
import { Card3DTilt } from "../ui/Card3DTilt";

interface UnitUsaha {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  features: string[];
  isFeatured: boolean;
  logoUrl: string;
  websiteUrl: string;
  client?: string;
  telemetry?: string;
  sla?: string;
}

// Fallback static list in case backend is offline
const staticUnits: UnitUsaha[] = [
  {
    id: 1,
    slug: "simawa",
    title: "SIMAWA",
    tagline: "Sistem Informasi Kemahasiswaan & Akademik Terpadu",
    category: "Sistem Informasi Akademik",
    client: "Universitas Muhammadiyah PKU Surakarta",
    telemetry: "Portal Terintegrasi Mahasiswa & Dosen",
    sla: "Beroperasi Aktif di Lingkungan Kampus",
    features: [
      "Portal terintegrasi mahasiswa, dosen, dan rektorat",
      "Manajemen data beasiswa, registrasi, dan prestasi",
      "Keamanan data terenkripsi dan pembatasan peran akses (RBAC)",
      "Dashboard pelaporan dan analitik akademik berkala"
    ],
    isFeatured: true,
    logoUrl: "",
    websiteUrl: "https://simawa.umpku.ac.id/"
  },
  {
    id: 2,
    slug: "mawasting",
    title: "MAWASTING",
    tagline: "Platform Telemetri Pemantauan Gizi & Pencegahan Stunting",
    category: "HealthTech & Telemetri",
    client: "Institusi Layanan Kesehatan & Posyandu",
    telemetry: "Sinkronisasi Standar Pertumbuhan WHO",
    sla: "Integrasi Data Posyandu ke Puskesmas",
    features: [
      "Pemantauan status gizi balita real-time berbasis standar WHO",
      "Sistem peringatan dini (early warning) deteksi risiko stunting",
      "Sinkronisasi data langsung antara posyandu dan puskesmas",
      "Histori rekam medis gizi anak dan grafik pertumbuhan"
    ],
    isFeatured: false,
    logoUrl: "",
    websiteUrl: "#"
  },
  {
    id: 3,
    slug: "eduapp",
    title: "EDUAPP",
    tagline: "Ekosistem Pembelajaran Digital & Manajemen Edukasi",
    category: "EdTech & Asesmen",
    client: "Ekosistem Sekolah & Yayasan Pendidikan",
    telemetry: "Akses Multi-Peran (Guru, Siswa, Wali Murid)",
    sla: "Asesmen Digital & Pelaporan Otomatis",
    features: [
      "Solusi pembelajaran digital interaktif dan bank soal terpusat",
      "Sistem asesmen digital dan pelaporan rapor otomatis",
      "Portal multi-peran terpisah untuk guru, siswa, dan wali murid",
      "Akses responsif lintas web desktop dan perangkat seluler"
    ],
    isFeatured: false,
    logoUrl: "",
    websiteUrl: "#"
  }
];

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !messageText.trim()) {
      setError("Semua kolom formulir wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setName("");
      setContact("");
      setMessageText("");
    } catch {
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center font-jakarta">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h5 className="font-bold text-slate-900 text-[18px] mb-2">Pesan Berhasil Terkirim</h5>
        <p className="text-sm text-slate-600 max-w-[320px] leading-relaxed">
          Terima kasih telah menghubungi TubaTechno. Tim rekayasa kami akan segera merespons pesan Anda secepatnya.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Kirim Pesan Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-jakarta">
      {error && (
        <p className="text-rose-500 text-xs font-semibold">{error}</p>
      )}
      <div>
        <label htmlFor="contact_name" className="block text-[12px] font-semibold text-slate-700 mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="contact_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Anda atau perwakilan instansi"
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 rounded-xl px-4 py-3 text-xs outline-none transition-all"
        />
      </div>
      <div>
        <label htmlFor="contact_info" className="block text-[12px] font-semibold text-slate-700 mb-2">
          Email atau Nomor WhatsApp
        </label>
        <input
          type="text"
          id="contact_info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="contoh@perusahaan.com atau 0812345..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 rounded-xl px-4 py-3 text-xs outline-none transition-all"
        />
      </div>
      <div>
        <label htmlFor="contact_message" className="block text-[12px] font-semibold text-slate-700 mb-2">
          Kebutuhan Proyek / Sistem
        </label>
        <textarea
          id="contact_message"
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Jelaskan gambaran sistem kustom, tantangan teknis, atau target waktu pengerjaan..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 rounded-xl px-4 py-3 text-xs outline-none transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#023e8a] text-white font-bold text-[13px] transition-all cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm shadow-[#00b4d8]/20"
      >
        <span>{loading ? "Mengirim Pesan..." : "Kirim Konsultasi Proyek"}</span>
      </button>
    </form>
  );
};

export const CardDeal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bisnis" | "contact">("bisnis");
  const [unitUsahaList, setUnitUsahaList] = useState<UnitUsaha[]>(staticUnits);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitUsaha | null>(null);

  // Fetch business units from API
  const fetchBusinessUnits = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/business-units"), {
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((u: any) => ({
          ...u,
          logoUrl: u.logoUrl || u.logo_type || "",
          websiteUrl: u.websiteUrl || u.website_url || "#"
        }));
        setUnitUsahaList(mapped);
      } else {
        setUnitUsahaList(staticUnits);
      }
    } catch {
      setUnitUsahaList(staticUnits);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchBusinessUnits();
  }, [fetchBusinessUnits]);

  // Read admin state & listen to event
  useEffect(() => {
    const checkAdmin = () => {
      const stored = localStorage.getItem("isAdmin") === "true";
      setIsAdmin(stored);
    };

    checkAdmin();
    window.addEventListener("admin-state-changed", checkAdmin);
    return () => {
      window.removeEventListener("admin-state-changed", checkAdmin);
    };
  }, []);

  // Listen to hash change for scrolling to contact form
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#contact") {
        setActiveTab("contact");
        setTimeout(() => {
          const element = document.getElementById("contact");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Delete handler
  const handleDeleteClick = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus unit bisnis ini secara permanen?")) {
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/api/business-units/${id}`), {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchBusinessUnits();
      } else {
        alert(data.message || "Gagal menghapus.");
      }
    } catch {
      alert("Gagal menghubungi server.");
    }
  };

  const handleEditClick = (unit: UnitUsaha) => {
    setEditingUnit({
      ...unit,
      logoUrl: unit.logoUrl || "",
      websiteUrl: unit.websiteUrl || "#"
    });
    setIsFormOpen(true);
  };

  // Custom refined architectural glyphs
  const renderProjectGlyph = (unit: UnitUsaha) => {
    if (unit.logoUrl && (unit.logoUrl.startsWith("http") || unit.logoUrl.startsWith("/"))) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={unit.logoUrl}
          alt={unit.title}
          className="w-6 h-6 object-contain"
        />
      );
    }

    const key = (unit.slug || unit.title).toLowerCase();
    if (key.includes("simawa")) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      );
    }
    if (key.includes("mawasting")) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    );
  };

  return (
    <section id="product" className="flex flex-col items-center py-20 sm:py-28 w-full relative overflow-hidden border-t border-slate-200/80 font-jakarta">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mb-12 sm:mb-16 relative z-10">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          PORTOFOLIO SISTEM TERAPLIKASI
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.12] tracking-[-0.03em]">
          Studi Kasus &amp; Sistem <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Produksi Mandiri.
          </span>
        </h2>
        <p className="font-normal text-slate-600 text-[15px] sm:text-[17px] leading-[1.75] max-w-2xl mt-4">
          Kompilasi sistem kustom berkinerja tinggi yang kami rancang dan terapkan secara langsung pada operasional mitra institusi dan klien kami.
        </p>

        {/* Minimalist Switcher */}
        <div className="inline-flex p-1 bg-slate-200/80 border border-slate-300/80 rounded-xl mt-8 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("bisnis")}
            className={`px-5 py-2 text-xs font-bold rounded-lg font-jakarta transition-all duration-200 cursor-pointer ${
              activeTab === "bisnis"
                ? "text-slate-900 bg-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Katalog Portofolio ({unitUsahaList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-5 py-2 text-xs font-bold rounded-lg font-jakarta transition-all duration-200 cursor-pointer ${
              activeTab === "contact"
                ? "text-slate-900 bg-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Konsultasi Proyek
          </button>
        </div>
      </div>

      {/* Admin Add Business Button */}
      {activeTab === "bisnis" && isAdmin && (
        <div className="flex justify-center mb-8 relative z-10">
          <button
            type="button"
            onClick={() => {
              setEditingUnit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Unit Sistem
          </button>
        </div>
      )}

      {/* Dynamic Tab Content Wrapper */}
      <div className="w-full max-w-[1440px] z-10 font-jakarta">
        {/* ============================================================ */}
        {/* 1. KATALOG PORTOFOLIO: 3 Expansive Columns                   */}
        {/* ============================================================ */}
        {activeTab === "bisnis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
            {unitUsahaList.map((unit, index) => {
              const fallbackClient = index === 0
                ? "Universitas Muhammadiyah PKU Surakarta"
                : index === 1
                ? "Institusi Layanan Kesehatan & Posyandu"
                : "Ekosistem Sekolah & Yayasan";

              return (
                <Card3DTilt key={unit.id} className="h-full rounded-2xl">
                  <div className="group relative flex flex-col justify-between h-full p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md transition-all duration-300">
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0077b6] border border-slate-200 flex items-center justify-center transition-all cursor-pointer text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(unit);
                          }}
                          title="Edit"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(unit.id);
                          }}
                          title="Hapus"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div>
                      {/* Top Bar: Icon + Category */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0077b6] group-hover:scale-105 group-hover:bg-[#0077b6] group-hover:text-white transition-all duration-300">
                          {renderProjectGlyph(unit)}
                        </div>
                        <span className="text-[11px] font-semibold text-[#0077b6] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                          {unit.category || `Studi Kasus 0${index + 1}`}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-bold text-[24px] sm:text-[26px] text-slate-900 tracking-tight mb-2 group-hover:text-[#0077b6] transition-colors">
                        {unit.title}
                      </h3>
                      <p className="text-[14px] text-slate-600 leading-relaxed font-normal mb-6">
                        {unit.tagline}
                      </p>

                      {/* Client Badge */}
                      <div className="py-2.5 px-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[12px] text-slate-700 mb-6">
                        <span className="text-slate-500 block text-[10.5px] uppercase tracking-wider mb-0.5">Mitra / Klien:</span>
                        <span className="font-medium text-slate-900">{unit.client || fallbackClient}</span>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-2.5 pt-1 mb-6 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2 pt-2">
                          Ruang Lingkup Sistem:
                        </span>
                        {unit.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-600 leading-snug">
                            <span className="text-[#00b4d8] font-bold leading-none mt-1">•</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="pt-5 border-t border-slate-100">
                      {unit.websiteUrl && unit.websiteUrl !== "#" ? (
                        <a
                          href={unit.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl font-bold text-[13px] bg-slate-50 hover:bg-[#0077b6] text-[#0077b6] hover:text-white border border-slate-200 hover:border-[#0077b6] transition-all flex items-center justify-center cursor-pointer no-underline"
                        >
                          Kunjungi Sistem Langsung
                        </a>
                      ) : (
                        <div className="w-full py-3 px-4 rounded-xl font-medium text-[12px] bg-slate-50 text-slate-500 border border-slate-200 text-center select-none flex items-center justify-center gap-1.5">
                          <span>Sistem Private Mitra</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. KONSULTASI PROYEK TAB: Contact Hub                         */}
        {/* ============================================================ */}
        {activeTab === "contact" && (
          <div id="contact" className="w-full flex flex-col lg:flex-row gap-10 sm:gap-12 pt-4">
            {/* Left: Contact Specs */}
            <div className="w-full lg:w-[42%] flex flex-col justify-between text-left gap-6">
              <div>
                <span className="text-[12px] font-semibold text-[#0077b6] uppercase tracking-[0.2em] block mb-3">
                  KONSULTASI TEKNOLOGI
                </span>
                <h3 className="font-extrabold text-[28px] md:text-[36px] text-slate-900 leading-tight tracking-tight mb-4">
                  Diskusikan Kebutuhan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">Teknologi Anda.</span>
                </h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">
                  Punya kebutuhan sistem kustom, arsitektur berskala besar, atau ingin merekayasa ulang infrastruktur digital yang sudah ada? Tim rekayasa TubaTechno siap berdiskusi.
                </p>
              </div>

              {/* Instant Contact Channels */}
              <div className="flex flex-col gap-3.5 mt-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/contact flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xs transition-all no-underline"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover/contact:scale-105 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13.5px]">WhatsApp Langsung</h4>
                      <p className="text-[12px] text-slate-500 mt-0.5">+62 812-3456-7890</p>
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:contact@tubatechno.com"
                  className="group/contact flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/90 hover:border-[#00b4d8]/50 hover:shadow-xs transition-all no-underline"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0077b6] flex items-center justify-center border border-sky-100 group-hover/contact:scale-105 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13.5px]">Email Resmi</h4>
                      <p className="text-[12px] text-slate-500 mt-0.5">contact@tubatechno.com</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Contact Form Console */}
            <div className="w-full lg:w-[58%] bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,119,182,0.04)]">
              <div className="pb-4 mb-6 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-[16px]">Formulir Konsultasi Proyek</h4>
                <p className="text-xs text-slate-500 mt-1">Kami akan mempelajari kebutuhan Anda dan membalas dalam waktu maksimal 1 hari kerja.</p>
              </div>
              <ContactForm />
            </div>
          </div>
        )}
      </div>

      {/* Admin Business Unit CRUD modal form */}
      <BusinessForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUnit(null);
        }}
        onSave={fetchBusinessUnits}
        editData={editingUnit}
      />
    </section>
  );
};

export default CardDeal;
