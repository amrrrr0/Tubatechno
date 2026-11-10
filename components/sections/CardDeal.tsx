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

    setLoading(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/api/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          notes: messageText.trim(),
          service_type: "Konsultasi Umum (Portofolio)",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName("");
        setContact("");
        setMessageText("");
      } else {
        setError(data.message || "Gagal mengirimkan pesan. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kendala koneksi ke server. Silakan hubungi kami via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center bg-sky-50/70 border border-sky-100 rounded-2xl animate-fadeIn">
        <div className="w-12 h-12 bg-[#0077b6] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h4 className="text-[18px] font-bold text-slate-900 font-jakarta">Pesan Terkirim</h4>
        <p className="text-[13.5px] text-slate-600 mt-2 max-w-sm mx-auto font-jakarta">
          Terima kasih. Tim konsultan rekayasa TubaTechno akan menelaah kebutuhan Anda dan menghubungi kembali dalam 1 hari kerja.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-5 px-5 py-2 text-xs font-semibold text-[#0077b6] bg-white border border-sky-200 rounded-lg hover:bg-sky-50 transition-all font-jakarta cursor-pointer"
        >
          Kirim Pesan Lainnya
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-jakarta">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Nama Lengkap / Instansi <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Budi Santoso / PT Solusi Bersama"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all placeholder:text-slate-400"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Kontak (WhatsApp / Email Aktif) <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="08123456789 atau email@perusahaan.com"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all placeholder:text-slate-400"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Gambaran Kebutuhan Sistem / Proyek <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Jelaskan kebutuhan aplikasi, sistem informasi, atau tantangan bisnis yang ingin Anda selesaikan..."
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all placeholder:text-slate-400 resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-[#0077b6] transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Memproses...</span>
          </>
        ) : (
          <span>Kirim Formulir Konsultasi</span>
        )}
      </button>
    </form>
  );
};

export const CardDeal: React.FC = () => {
  const [unitUsahaList, setUnitUsahaList] = useState<UnitUsaha[]>(staticUnits);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"bisnis" | "contact">("bisnis");

  // Admin CRUD states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitUsaha | null>(null);

  const fetchBusinessUnits = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl("/api/business-units"));
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Map backend keys to camelCase
        const mapped: UnitUsaha[] = data.data.map((item: any) => ({
          id: item.id,
          slug: item.slug || "",
          title: item.title,
          tagline: item.tagline,
          category: item.category,
          features: Array.isArray(item.features)
            ? item.features
            : typeof item.features === "string"
            ? JSON.parse(item.features)
            : [],
          isFeatured: Boolean(item.is_featured || item.isFeatured),
          logoUrl: item.logo_type || item.logoUrl || "",
          websiteUrl: item.website_url || item.websiteUrl || "#",
          client: item.client,
          telemetry: item.telemetry,
          sla: item.sla,
        }));
        setUnitUsahaList(mapped);
      } else {
        setUnitUsahaList(staticUnits);
      }
    } catch {
      setUnitUsahaList(staticUnits);
    }
  }, []);

  useEffect(() => {
    fetchBusinessUnits();
  }, [fetchBusinessUnits]);

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };
    checkAdmin();
    window.addEventListener("admin-state-changed", checkAdmin);
    return () => window.removeEventListener("admin-state-changed", checkAdmin);
  }, []);

  const handleDeleteClick = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus unit usaha ini?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/business-units/${id}`), {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBusinessUnits();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (unit: UnitUsaha) => {
    setEditingUnit({
      ...unit,
      logoUrl: unit.logoUrl || "",
      websiteUrl: unit.websiteUrl || "#",
    });
    setIsFormOpen(true);
  };

  // Bespoke Project Metadata Resolver (Checks both slug and title)
  const getProjectData = (unit: UnitUsaha) => {
    const combined = `${unit.slug || ""} ${unit.title || ""}`.toLowerCase();

    if (combined.includes("simawa")) {
      return {
        type: "simawa" as const,
        domain: "simawa.umpku.ac.id",
        client: unit.client || "Universitas Muhammadiyah PKU Surakarta",
        category: "Sistem Informasi Kemahasiswaan & Prestasi",
        liveUrl: "https://simawa.umpku.ac.id/",
        statusBadge: "Live Production",
        techStack: ["Next.js 15", "Laravel 11", "MySQL", "Tailwind CSS", "RBAC"],
        narrative: "Menggantikan birokrasi berkas fisik manual dengan platform terpusat satu pintu untuk pendataan prestasi, verifikasi beasiswa, dan tata kelola ormawa di seluruh fakultas.",
        impactNote: "1.240+ Mahasiswa Terhubung",
      };
    }

    if (combined.includes("mawasting") || combined.includes("boga")) {
      return {
        type: "mawasting" as const,
        domain: "mawasting.health.id",
        client: unit.client || "Institusi Layanan Kesehatan & Posyandu Mitra",
        category: "HealthTech & Telemetri Ibu Hamil",
        liveUrl: "#",
        statusBadge: "Standar WHO Aktif",
        techStack: ["React Native", "Node.js", "PostgreSQL", "Telemetri WHO", "PWA"],
        narrative: "Aplikasi e-rekam medis antenatal care (ANC) untuk bidan dan kader posyandu dalam memantau parameter vital ibu hamil serta deteksi dini faktor risiko stunting berstandar WHO.",
        impactNote: "Kurva Pertumbuhan WHO Terintegrasi",
      };
    }

    // Default: EDUAPP
    return {
      type: "eduapp" as const,
      domain: "eduapp.platform.id",
      client: unit.client || "Ekosistem Sekolah & Yayasan Pendidikan",
      category: "EdTech & Manajemen Edukasi",
      liveUrl: "#",
      statusBadge: "Multi-Role LMS",
      techStack: ["React", "Express.js", "MySQL", "Socket.io", "Cloud NVMe"],
      narrative: "Platform terpadu yang menyatukan kegiatan belajar mengajar, absensi siswa real-time, bank soal interaktif, dan kalkulasi otomatis rapor digital dalam satu ekosistem multi-tenant.",
      impactNote: "Otomasi Rapor & Absensi Terpadu",
    };
  };

  return (
    <section id="product" className="flex flex-col items-center py-20 sm:py-28 w-full relative overflow-hidden border-t border-slate-200/80 font-jakarta">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mb-12 sm:mb-16 relative z-10">
        <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
          STUDI KASUS SISTEM PRODUKSI
        </span>
        <h2 className="font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.12] tracking-[-0.03em]">
          Studi Kasus &amp; Sistem <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">
            Operasional Klien.
          </span>
        </h2>
        <p className="font-normal text-slate-600 text-[15px] sm:text-[17px] leading-[1.75] max-w-2xl mt-4">
          Aplikasi dan sistem informasi berkinerja tinggi yang kami kembangkan dan telah beroperasi aktif mendukung institusi pendidikan serta layanan kesehatan.
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
            Katalog Studi Kasus ({unitUsahaList.length})
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
        {/* 1. KATALOG PORTOFOLIO: Bespoke Software Case Studies         */}
        {/* ============================================================ */}
        {activeTab === "bisnis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {unitUsahaList.map((unit) => {
              const project = getProjectData(unit);
              const uniqueFeatures = Array.from(new Set(unit.features)).slice(0, 3);

              return (
                <Card3DTilt key={unit.id} className="h-full rounded-3xl">
                  <div className="group relative flex flex-col justify-between h-full rounded-3xl bg-white border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_4px_24px_rgba(0,119,182,0.04)] hover:shadow-[0_16px_40px_rgba(0,180,216,0.10)] transition-all duration-300 overflow-hidden font-jakarta">
                    {/* Top Accent Gradient Bar on Hover */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#00b4d8] via-[#0077b6] to-[#00b4d8] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-30" />

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-40">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white/95 hover:bg-sky-50 text-slate-700 hover:text-[#0077b6] border border-slate-200 flex items-center justify-center transition-all cursor-pointer text-xs shadow-xs"
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
                          className="w-7 h-7 rounded-lg bg-white/95 hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer text-xs shadow-xs"
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

                    {/* 1. Realistic System Viewport / Dashboard Mockup Header */}
                    <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-100">
                      {project.type === "simawa" && (
                        <div className="rounded-2xl bg-slate-900 text-white p-3.5 sm:p-4 font-sans overflow-hidden shadow-2xs border border-slate-800">
                          {/* Mini browser chrome */}
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-mono text-slate-400 ml-1.5 truncate max-w-[140px]">simawa.umpku.ac.id</span>
                            </div>
                            <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                              Live System
                            </span>
                          </div>
                          {/* Viewport content */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-sky-400">Portal Kemahasiswaan UMPKU</span>
                              <span className="text-slate-400 text-[9.5px] font-mono">1.240 Mahasiswa</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 text-[9.5px]">
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Ormawa</div>
                                <div className="font-bold text-white text-[12px]">38 Unit</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Prestasi</div>
                                <div className="font-bold text-white text-[12px]">342 Data</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Validasi</div>
                                <div className="font-bold text-emerald-400 text-[12px]">99.2%</div>
                              </div>
                            </div>
                            <div className="bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-[9px] text-slate-300">
                              <span className="truncate">SK Prestasi Mahasiswa Nasional 2026</span>
                              <span className="text-emerald-400 font-mono font-semibold">Tervalidasi</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {project.type === "mawasting" && (
                        <div className="rounded-2xl bg-slate-900 text-white p-3.5 sm:p-4 font-sans overflow-hidden shadow-2xs border border-slate-800">
                          {/* Mini browser chrome */}
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-mono text-slate-400 ml-1.5 truncate max-w-[140px]">mawasting.health.id</span>
                            </div>
                            <span className="text-cyan-400 font-mono text-[9px] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                              ANC Telemetry
                            </span>
                          </div>
                          {/* Viewport content */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-cyan-300">Rekam Medis ANC &amp; Gizi Ibu</span>
                              <span className="text-slate-400 text-[9.5px] font-mono">Standar WHO</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 text-[9.5px]">
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Tekanan Darah</div>
                                <div className="font-bold text-emerald-400 text-[12px]">118/75</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Kadar Hb</div>
                                <div className="font-bold text-white text-[12px]">12.4 g/dL</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">LILA</div>
                                <div className="font-bold text-white text-[12px]">25.5 cm</div>
                              </div>
                            </div>
                            <div className="bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-[9px] text-slate-300">
                              <span className="truncate">Deteksi Risiko Dini Stunting</span>
                              <span className="text-emerald-400 font-mono font-semibold">Risiko Rendah</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {project.type === "eduapp" && (
                        <div className="rounded-2xl bg-slate-900 text-white p-3.5 sm:p-4 font-sans overflow-hidden shadow-2xs border border-slate-800">
                          {/* Mini browser chrome */}
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-mono text-slate-400 ml-1.5 truncate max-w-[140px]">eduapp.platform.id</span>
                            </div>
                            <span className="text-indigo-300 font-mono text-[9px] bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                              LMS Multi-Role
                            </span>
                          </div>
                          {/* Viewport content */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-sky-300">Sistem Akademik &amp; Rapor Digital</span>
                              <span className="text-slate-400 text-[9.5px] font-mono">420 Siswa</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 text-[9.5px]">
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Kehadiran</div>
                                <div className="font-bold text-emerald-400 text-[12px]">98.4%</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Bank Soal</div>
                                <div className="font-bold text-white text-[12px]">1.850 Butir</div>
                              </div>
                              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center">
                                <div className="text-slate-400 text-[9px]">Rapor Digital</div>
                                <div className="font-bold text-white text-[12px]">Otomatis</div>
                              </div>
                            </div>
                            <div className="bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-[9px] text-slate-300">
                              <span className="truncate">Rekapitulasi Penilaian Semester</span>
                              <span className="text-sky-400 font-mono font-semibold">Tersinkron</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Project Body Details */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                      <div>
                        {/* Client Accreditation Chip */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11.5px] text-slate-700 font-medium mb-3 max-w-full">
                          <svg className="w-3.5 h-3.5 text-[#0077b6] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="truncate">{project.client}</span>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="font-bold text-[22px] sm:text-[23px] text-slate-900 tracking-tight group-hover:text-[#0077b6] transition-colors leading-snug">
                          {unit.title}
                        </h3>
                        <p className="text-[11.5px] font-mono text-[#0077b6] font-semibold mt-1">
                          {project.category}
                        </p>

                        <p className="text-[13.5px] text-slate-600 leading-relaxed font-normal mt-3">
                          {project.narrative}
                        </p>

                        {/* Key Capabilities Highlights */}
                        <div className="my-5 pt-4 border-t border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                            Kapabilitas Terverifikasi
                          </span>
                          <div className="space-y-2">
                            {uniqueFeatures.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-[12.5px] text-slate-700 leading-snug">
                                <div className="w-4 h-4 rounded-full bg-sky-50 text-[#00b4d8] flex items-center justify-center shrink-0 mt-0.5">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3. Action CTA */}
                      <div className="pt-4 border-t border-slate-100">
                        {project.liveUrl && project.liveUrl !== "#" ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl font-bold text-[13px] bg-slate-900 hover:bg-[#0077b6] text-white transition-all flex items-center justify-center cursor-pointer no-underline shadow-xs"
                          >
                            Buka {project.domain}
                          </a>
                        ) : (
                          <div className="w-full py-2.5 px-4 rounded-xl font-medium text-[12px] bg-slate-50 text-slate-600 border border-slate-200/80 text-center select-none flex items-center justify-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span>Sistem Privat Institusi Mitra</span>
                          </div>
                        )}
                      </div>
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
