"use client";
import React, { useState, useEffect, useCallback } from "react";
import BusinessForm from "../forms/BusinessForm";

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
}

// Fallback static list in case backend is offline
const staticUnits: UnitUsaha[] = [
  {
    id: 1,
    slug: "tirta",
    title: "UMPKU Tirta",
    tagline: "Air Minum Alami & Higienis",
    category: "Layanan Umum",
    features: [
      "Sumber air pegunungan alami",
      "Proses filtrasi ultra-modern",
      "Sertifikasi Halal & BPOM resmi",
      "Kemasan praktis berbagai ukuran",
      "Distribusi cepat area Surakarta"
    ],
    isFeatured: false,
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3105/3105807.png",
    websiteUrl: "#"
  },
  {
    id: 2,
    slug: "boga",
    title: "UMPKU Boga",
    tagline: "Kuliner Sehat & Katering Premium",
    category: "Layanan Umum",
    features: [
      "Katering kustom event & rapat",
      "Bahan masakan segar & organik",
      "Cita rasa Nusantara & Modern",
      "Higienitas tinggi terakreditasi",
      "Penyediaan konsumsi kampus rutin"
    ],
    isFeatured: false,
    logoUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    websiteUrl: "#"
  },
  {
    id: 3,
    slug: "helio",
    title: "HelioNexus",
    tagline: "Techno Creative & Software House",
    category: "Solusi Digital",
    features: [
      "Web & Mobile App custom",
      "Integrasi IoT Industri",
      "Implementasi Kecerdasan Buatan (AI)",
      "UI/UX Design modern & responsif",
      "Konsultasi IT & digitalisasi UMKM"
    ],
    isFeatured: true,
    logoUrl: "https://cdn-icons-png.flaticon.com/512/606/606547.png",
    websiteUrl: "https://helionexus.co"
  },
  {
    id: 4,
    slug: "bmt",
    title: "BMT UMPKU",
    tagline: "Finansial Mikro & Simpanan Syariah",
    category: "Koperasi Syariah",
    features: [
      "Simpanan syariah aman & amanah",
      "Pembiayaan modal UMKM lokal",
      "Bagi hasil kompetitif & transparan",
      "Layanan jemput bola nasabah",
      "Kemitraan usaha produktif civitas"
    ],
    isFeatured: false,
    logoUrl: "https://cdn-icons-png.flaticon.com/512/2953/2953363.png",
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
    
    // Simulate sending message
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setName("");
      setContact("");
      setMessageText("");
    } catch (err) {
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h5 className="font-poppins font-bold text-slate-800 text-[16px] mb-1.5">Pesan Berhasil Terkirim</h5>
        <p className="font-poppins text-xs text-slate-400 max-w-[280px] leading-relaxed">
          Terima kasih telah menghubungi kami. Tim kami akan segera menanggapi pesan Anda secepatnya.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 px-5 py-2 text-xs font-bold text-white bg-primary-dark hover:bg-primary-dark/95 rounded-full shadow-md transition-colors cursor-pointer"
        >
          Kirim Pesan Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-rose-500 text-xs font-semibold font-poppins">{error}</p>
      )}
      <div>
        <label htmlFor="contact_name" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap</label>
        <input
          type="text"
          id="contact_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama lengkap Anda"
          className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all"
        />
      </div>
      <div>
        <label htmlFor="contact_info" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Email atau No. WhatsApp</label>
        <input
          type="text"
          id="contact_info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="contoh@mail.com atau 0812345..."
          className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all"
        />
      </div>
      <div>
        <label htmlFor="contact_message" className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Pesan Anda</label>
        <textarea
          id="contact_message"
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Tuliskan kebutuhan sistem kustom atau detail diskusi proyek Anda di sini..."
          className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] text-white font-poppins font-bold text-[12px] transition-all cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-80 shadow-md shadow-[#00b4d8]/10"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Mengirim Pesan...
          </>
        ) : (
          "Kirim Pesan Sekarang"
        )}
      </button>
    </form>
  );
};

const CardDeal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bisnis" | "contact">("bisnis");
  
  // Dynamic business units states
  const [unitUsahaList, setUnitUsahaList] = useState<UnitUsaha[]>(staticUnits);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitUsaha | null>(null);

  // Fetch business units from API
  const fetchBusinessUnits = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/business-units");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Map API response: logoUrl comes from logo_type field, websiteUrl from website_url
        const mapped = data.data.map((u: any) => ({
          ...u,
          logoUrl: u.logoUrl || u.logo_type || "",
          websiteUrl: u.websiteUrl || u.website_url || "#"
        }));
        setUnitUsahaList(mapped);
      } else {
        setUnitUsahaList(staticUnits);
      }
    } catch (err) {
      console.warn("Koneksi gagal ke API unit bisnis. Menggunakan data statis bawaan.", err);
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
      const res = await fetch(`http://localhost:5000/api/business-units/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchBusinessUnits();
      } else {
        alert(data.message || "Gagal menghapus.");
      }
    } catch (err) {
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


  // Render logo: PNG image if URL provided, fallback to placeholder icon
  const renderLogo = (logoUrl: string) => {
    if (logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("/"))) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt="logo"
          className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
          onError={e => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }
    // Default placeholder
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  };

  return (
    <section id="contact" className="flex flex-col items-center py-20 px-4 md:px-8 w-full bg-white relative overflow-hidden">
      {/* Decorative light spotlights matching tech theme */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00b4d8]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#00b4d8]/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-[800px] mb-12 relative z-10 font-jakarta">
        <h2 className="font-poppins font-semibold xs:text-[44px] text-[32px] text-primary-dark leading-[54px] mb-4 tracking-tight">
          Unit Bisnis UMPKU
        </h2>
        <p className="font-jakarta font-normal text-dimWhite text-[16px] leading-[28px] max-w-[650px]">
          Sinergi unit usaha Universitas Muhammadiyah PKU Surakarta untuk menyajikan layanan profesional bernilai sosial-ekonomi tinggi.
        </p>

        {/* Decorative Toggle */}
        <div className="inline-flex p-1 bg-gray-100 border border-gray-200/80 rounded-full mt-8 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("bisnis")}
            className={`px-5 py-2 text-xs font-bold rounded-full font-jakarta shadow-md transition-all duration-300 cursor-pointer ${
              activeTab === "bisnis"
                ? "text-white bg-primary-dark"
                : "text-gray-500 hover:text-primary-dark bg-transparent shadow-none"
            }`}
          >
            Bisnis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-5 py-2 text-xs font-bold rounded-full font-jakarta shadow-md transition-all duration-300 cursor-pointer ${
              activeTab === "contact"
                ? "text-white bg-primary-dark"
                : "text-gray-500 hover:text-primary-dark bg-transparent shadow-none"
            }`}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Admin Tambah Bisnis Button */}
      {activeTab === "bisnis" && isAdmin && (
        <div className="flex justify-center mb-8 relative z-10">
          <button
            type="button"
            onClick={() => {
              setEditingUnit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-semibold text-[14px] text-white bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] transition-all shadow-md shadow-[#00b4d8]/20 cursor-pointer whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Unit Bisnis
          </button>
        </div>
      )}

      {/* Dynamic Tab Content Wrapper */}
      <div className="relative w-full max-w-[1150px] min-h-[520px] z-10 font-jakarta">
        {/* Bisnis Tab Content */}
        <div
          className={`w-full transition-all duration-500 ease-out transform ${
            activeTab === "bisnis"
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-x-12 scale-95 pointer-events-none absolute top-0 left-0"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {unitUsahaList.map((unit) => {
              // Compute visual styles based on isFeatured configuration dynamically
              const cardClass = unit.isFeatured 
                ? "bg-gradient-to-b from-[#ecfeff] to-white border-2 border-[#00b4d8]/40 shadow-[0_20px_50px_rgba(0,246,255,0.06)] hover:border-[#00b4d8]/70"
                : "bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]";

              const btnClass = unit.isFeatured
                ? "bg-gradient-to-r from-[#00f6ff] to-[#0077b6] text-primary-dark hover:brightness-110 shadow-[0_4px_15px_rgba(0,246,255,0.2)] hover:shadow-[0_10px_25px_rgba(0,246,255,0.3)] font-extrabold border border-[#00f6ff]/30"
                : "bg-white hover:bg-primary-dark border border-primary-dark/20 hover:border-primary-dark text-primary-dark hover:text-white";

              const glowEffect = unit.isFeatured
                ? <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00f6ff]/3 to-transparent opacity-60 pointer-events-none" />
                : null;

              return (
                <div
                  key={unit.id}
                  className={`group relative flex flex-col justify-between rounded-[28px] p-8 w-full max-w-[280px] transition-all duration-500 ease-out hover:-translate-y-2.5 ${cardClass} ${
                    unit.isFeatured ? "min-h-[500px] lg:-translate-y-2" : "min-h-[470px]"
                  }`}
                >
                  {glowEffect}

                  {/* Admin actions (Edit / Delete) */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-lg bg-white/95 hover:bg-white text-slate-600 hover:text-cyan-600 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer shadow-sm text-xs font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(unit);
                        }}
                        title="Edit Unit Usaha"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-lg bg-red-50/95 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 flex items-center justify-center transition-all cursor-pointer shadow-sm text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(unit.id);
                        }}
                        title="Hapus Unit Usaha"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Header Info */}
                    <div className="mb-6 flex flex-col items-center text-center">
                      {/* Brand Logo Circle Wrapper */}
                      <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center border shadow-sm mb-4 flex-shrink-0 overflow-hidden mx-auto ${
                        unit.isFeatured
                          ? "bg-[#ecfeff] border-[#00b4d8]/20"
                          : "bg-slate-50 border-slate-100"
                      }`}>
                        {renderLogo(unit.logoUrl)}
                      </div>

                      <span className="text-[10px] font-extrabold text-[#00b4d8] uppercase tracking-widest block mb-2">
                        {unit.category}
                      </span>
                      <h4 className="font-jakarta font-extrabold text-[22px] text-primary-dark tracking-tight mb-1">
                        {unit.title}
                      </h4>
                      <p className="font-jakarta font-normal text-[12px] text-dimWhite min-h-[36px] leading-tight mt-1">
                        {unit.tagline}
                      </p>
                    </div>

                    {/* Website Link Button */}
                    <a
                      href={unit.websiteUrl && unit.websiteUrl !== "#" ? unit.websiteUrl : undefined}
                      target={unit.websiteUrl && unit.websiteUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={e => { if (!unit.websiteUrl || unit.websiteUrl === "#") e.preventDefault(); }}
                      className={`w-full font-jakarta font-extrabold text-[13px] py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mb-6 no-underline ${btnClass} ${
                        (!unit.websiteUrl || unit.websiteUrl === "#") ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5"
                      }`}
                    >
                      <span>Selengkapnya</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-gray-100 mb-6" />

                    {/* Features list */}
                    <ul className="space-y-3">
                      {unit.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[12px] text-primary-dark font-semibold">
                          {/* Circle Checkmark Icon */}
                          <span className={`flex-shrink-0 w-4 h-4 rounded-full bg-cyan-50 border border-cyan-200/60 flex items-center justify-center mt-0.5`}>
                            <svg className="w-2.5 h-2.5 text-[#00b4d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="leading-tight text-dimWhite group-hover:text-primary-dark transition-colors duration-300">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Tab Content */}
        <div
          className={`w-full transition-all duration-500 ease-out transform ${
            activeTab === "contact"
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-x-12 scale-95 pointer-events-none absolute top-0 left-0"
          }`}
        >
          {/* Transparent container without gray card background/border */}
          <div className="w-full flex flex-col lg:flex-row gap-12 pt-6">
            
            {/* Column 1: Info & Links (42% width on lg) */}
            <div className="w-full lg:w-[42%] flex flex-col justify-between text-left gap-6">
              <div>
                <span className="text-[11px] font-extrabold text-[#00b4d8] uppercase tracking-widest block mb-3">
                  Hubungi Kami
                </span>
                <h3 className="font-poppins font-extrabold text-[28px] md:text-[36px] text-slate-800 leading-tight tracking-tight">
                  Mari Mulai <br />Sesuatu yang Hebat.
                </h3>
                <p className="font-poppins font-normal text-slate-400 text-[14px] leading-relaxed mt-4">
                  Punya ide proyek digital, kebutuhan sistem kustom, atau sekadar ingin berdiskusi? Tim teknologi HelioNexus siap membantu mewujudkannya.
                </p>
              </div>

              {/* Instant Contact Links */}
              <div className="flex flex-col gap-3.5 mt-2">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/contact flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(0,4,15,0.015)] hover:border-emerald-500/20 hover:shadow-[0_8px_20px_rgba(16,185,129,0.05)] hover:-translate-y-0.5 transition-all duration-300 no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/30 group-hover/contact:scale-105 transition-transform duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-poppins font-bold text-slate-700 text-[13px]">WhatsApp</h4>
                      <p className="font-poppins text-[11px] text-slate-400 mt-0.5">+62 812-3456-7890</p>
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/contact:bg-emerald-500 group-hover/contact:text-white transition-all duration-300 text-xs font-bold">→</span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:info@umpku.ac.id" 
                  className="group/contact flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(0,4,15,0.015)] hover:border-cyan-500/20 hover:shadow-[0_8px_20px_rgba(6,182,212,0.05)] hover:-translate-y-0.5 transition-all duration-300 no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-500 flex items-center justify-center border border-cyan-100/30 group-hover/contact:scale-105 transition-transform duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-poppins font-bold text-slate-700 text-[13px]">Email Korespondensi</h4>
                      <p className="font-poppins text-[11px] text-slate-400 mt-0.5">info@umpku.ac.id</p>
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/contact:bg-cyan-500 group-hover/contact:text-white transition-all duration-300 text-xs font-bold">→</span>
                </a>

                {/* Address Map Link */}
                <a 
                  href="https://maps.google.com/?q=Jl.+Tulang+Bawang+V+No.+25,+Kadipiro,+Banjarsari,+Surakarta" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/contact flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(0,4,15,0.015)] hover:border-indigo-500/20 hover:shadow-[0_8px_20px_rgba(99,102,241,0.05)] hover:-translate-y-0.5 transition-all duration-300 no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/30 group-hover/contact:scale-105 transition-transform duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-poppins font-bold text-slate-700 text-[13px]">Kantor Pusat</h4>
                      <p className="font-poppins text-[11px] text-slate-400 mt-0.5 leading-normal max-w-[200px] truncate">
                        Jl. Tulang Bawang V No. 25, Surakarta
                      </p>
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/contact:bg-indigo-500 group-hover/contact:text-white transition-all duration-300 text-xs font-bold">→</span>
                </a>
              </div>
            </div>

            {/* Column 2: Direct Contact Form (58% width on lg) */}
            <div className="w-full lg:w-[58%] bg-white border border-slate-150 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_rgba(15,23,42,0.03)] flex flex-col justify-center">
              <h4 className="font-poppins font-bold text-[15px] text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
                Hubungi Langsung
              </h4>
              <ContactForm />
            </div>

          </div>
        </div>
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
