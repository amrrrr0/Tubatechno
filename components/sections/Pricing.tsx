"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/style";
import { getApiUrl } from "@/utils/api";
import { staticPricingPackages } from "@/constants/staticData";
import PricingForm from "../forms/PricingForm";

const motion = {
  div: ({ initial, animate, transition, variants, whileInView, viewport, ...props }: any) => <div {...props} />
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const calculateDiscount = (original: string, current: string) => {
  const origNum = parseInt(original.replace(/\D/g, ''));
  const currNum = parseInt(current.replace(/\D/g, ''));
  if (origNum && currNum && origNum > currNum) {
    return Math.round(((origNum - currNum) / origNum) * 100);
  }
  return 0;
};

const Pricing: React.FC = () => {
  const [billingMode, setBillingMode] = useState<"monthly" | "annual" | "lifetime">("monthly");
  const [packages, setPackages] = useState<any[]>(staticPricingPackages);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");

    const handleSync = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };
    window.addEventListener("admin-state-changed", handleSync);
    return () => window.removeEventListener("admin-state-changed", handleSync);
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl("/api/pricing"));
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPackages(data.data);
        } else {
          setPackages(staticPricingPackages);
        }
      } catch {
        setPackages(staticPricingPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus paket harga ini?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/pricing/${id}`), { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert(data.message || "Gagal menghapus paket.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const handleEdit = (pkg: any) => {
    setEditData(pkg);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const filteredPackages = packages.filter(p => p.billing_type === billingMode);

  return (
    <section className="pt-0 pb-24 w-full relative flex flex-col items-center bg-transparent overflow-hidden font-jakarta">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#00b4d8]/8 via-[#0077b6]/4 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-[1280px] mx-auto px-4 md:px-8 w-full">
        
        {/* ================================================= */}
        {/* PART 1: KATALOG LAYANAN (PUTIH BIRU THEME)        */}
        {/* ================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14 w-full pt-2"
        >
          <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
            PAKET &amp; MODEL KERJASAMA DEVELOPER
          </span>
          <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-slate-900 leading-[1.14] tracking-[-0.03em] max-w-[800px] mx-auto mb-4">
            Investasi Transparan untuk <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#0077b6] italic">Hasil yang Terukur.</span>
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[17px] text-slate-600 leading-relaxed max-w-[650px] mx-auto font-normal">
            Pilih skema kerjasama yang paling sesuai dengan fase bisnis Anda — dari sistem berlangganan hemat modal hingga pengembangan kustom kepemilikan penuh.
          </p>
        </motion.div>

        {/* Top Grid for Services */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-7 w-full mb-14"
        >
          {/* Card 1: Software & Web Siap Pakai */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md transition-all duration-300 flex flex-col h-full group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-[#0077b6] flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-[#0077b6] group-hover:text-white transition-all">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-jakarta font-bold text-[20px] text-slate-900 mb-2">Website &amp; Sistem Siap Pakai</h3>
            <p className="text-slate-600 text-[13.5px] mb-6 leading-relaxed font-normal">
              Aplikasi bisnis siap pakai dengan sistem sewa/langganan. Anda fokus jualan, seluruh server dan maintenance kami kelola.
            </p>
            <div className="flex-grow">
              <ul className="space-y-3.5">
                {["Sistem Informasi Sekolah & Akademik", "ERP / POS Kasir untuk UMKM & Bisnis", "Toko Online & E-Commerce Siap Tayang", "Sistem Manajemen Klinik & Hotel"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13.5px] text-slate-700 font-normal">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[12px] text-slate-500 font-medium block">Langganan Mulai</span>
                <span className="font-jakarta font-extrabold text-[20px] text-[#0077b6]">
                  Rp 199rb <span className="text-[13px] text-slate-500 font-normal">/bulan</span>
                </span>
              </div>
              <a href="/#contact" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0077b6] hover:text-[#023e8a] transition-colors">
                <span>Konsultasi</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Card 2: Aplikasi & Web Custom */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#00b4d8] shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md transition-all duration-300 flex flex-col h-full group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-[#0077b6] flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-[#0077b6] group-hover:text-white transition-all">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-jakarta font-bold text-[20px] text-slate-900 mb-2">Aplikasi &amp; Web Kustom</h3>
            <p className="text-slate-600 text-[13.5px] mb-6 leading-relaxed font-normal">
              Solusi digital khusus yang dibangun dari nol sesuai alur kerja bisnis Anda dengan 100% kepemilikan source code mandiri.
            </p>
            <div className="flex-grow">
              <ul className="space-y-3.5">
                {[
                  "Website Company Profile Eksklusif & Cepat",
                  "Aplikasi Mobile Android & iOS (Play / App Store)",
                  "Dashboard Analitik, Portal Bisnis & Web App",
                  "Integrasi API, Payment Gateway & Otomasi"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13.5px] text-slate-700 font-normal">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[12px] text-slate-500 font-medium block">Investasi Mulai</span>
                <span className="font-jakarta font-extrabold text-[20px] text-slate-900">
                  Rp 5 Juta <span className="text-[12px] text-slate-500 font-normal">(One-Time)</span>
                </span>
              </div>
              <a href="/#contact" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0077b6] hover:text-[#023e8a] transition-colors">
                <span>Mulai Diskusi</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Stack of 3 Small Cards */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col gap-4 w-full h-full justify-between"
          >
            {/* Identitas Online */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#00b4d8]/40 shadow-xs transition-all flex-1">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-[#0077b6] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <h3 className="font-jakarta font-bold text-[16px] text-slate-900">Identitas Online &amp; Domain</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Domain .com / .id</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Email Bisnis</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Keamanan SSL</span>
              </div>
            </div>

            {/* Smart Solutions */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#00b4d8]/40 shadow-xs transition-all flex-1">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-[#0077b6] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-jakarta font-bold text-[16px] text-slate-900">Smart Solutions &amp; IoT</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Telemetri Real-Time</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Dashboard Monitoring</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Smart Office</span>
              </div>
            </div>

            {/* Jaringan & IT Support */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#00b4d8]/40 shadow-xs transition-all flex-1">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-[#0077b6] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-jakarta font-bold text-[16px] text-slate-900">IT Support &amp; Maintenance</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Uptime 99.9%</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Patching &amp; Anti-DDoS</span>
                <span className="text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Backup Harian</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Cloud Hosting Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white rounded-2xl border border-slate-200/90 mb-20 flex flex-col lg:flex-row overflow-hidden shadow-[0_4px_24px_rgba(0,119,182,0.04)]"
        >
          {/* Left Content */}
          <div className="lg:w-[45%] bg-sky-50/50 p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200/90">
            <div className="w-14 h-14 rounded-xl bg-white border border-sky-100 text-[#0077b6] flex items-center justify-center mb-6 shadow-xs">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="font-jakarta font-bold text-[22px] md:text-[26px] text-slate-900 mb-3 leading-tight">
              Cloud Hosting &amp; Infrastruktur Terkelola
            </h3>
            <p className="text-slate-600 text-[14px] leading-relaxed mb-8 font-normal">
              Infrastruktur server cloud berkecepatan tinggi dengan proteksi berlapis agar website dan sistem bisnis Anda online 24/7 tanpa gangguan.
            </p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              {["SSD NVMe Ultra Cepat", "Gratis SSL Otomatis", "Backup Data Berkala", "Monitoring & Support 24/7"].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[13px] font-medium text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-[#00b4d8]/15 text-[#0077b6] flex items-center justify-center shrink-0">
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Packages Content */}
          <div className="lg:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <h4 className="font-jakarta font-bold text-[16px] text-slate-900 mb-6">
              Pilihan Kapasitas Hosting Sesuai Kebutuhan
            </h4>
            
            <div className="flex-grow flex flex-col justify-center space-y-2">
              {/* Starter Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-slate-100 gap-3">
                <div className="w-full md:w-5/12">
                  <div className="font-jakarta font-bold text-[15px] text-slate-900">Starter</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">Pas untuk Company Profile &amp; Portofolio</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-600 text-[13px] font-medium">
                  1 Website · 10 GB SSD NVMe
                </div>
                <div className="w-full md:w-3/12 md:text-right font-jakarta font-bold text-[16px] text-[#0077b6]">
                  Rp 99rb<span className="text-[12px] text-slate-500 font-normal">/bln</span>
                </div>
              </div>

              {/* Business Row (Active) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-4.5 px-4 bg-sky-50/70 rounded-xl border border-[#00b4d8]/50 gap-3 relative">
                <div className="w-full md:w-5/12 flex flex-wrap items-center gap-2">
                  <div className="font-jakarta font-bold text-[15px] text-slate-900">Business</div>
                  <span className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Favorit
                  </span>
                  <div className="text-[12px] text-slate-500 mt-0.5 w-full">Ideal untuk UMKM &amp; Perusahaan Aktif</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-700 text-[13px] font-medium">
                  10 Website · 50 GB SSD NVMe
                </div>
                <div className="w-full md:w-3/12 md:text-right font-jakarta font-bold text-[17px] text-[#0077b6]">
                  Rp 299rb<span className="text-[12px] text-slate-500 font-normal">/bln</span>
                </div>
              </div>

              {/* Enterprise Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-3">
                <div className="w-full md:w-5/12">
                  <div className="font-jakarta font-bold text-[15px] text-slate-900">Enterprise</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">Performa Tinggi &amp; Dedicated Resource</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-600 text-[13px] font-medium">
                  Unlimited · High CPU &amp; RAM
                </div>
                <div className="w-full md:w-3/12 md:text-right font-jakarta font-bold text-[16px] text-[#0077b6]">
                  Rp 799rb<span className="text-[12px] text-slate-500 font-normal">/bln</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6 pt-5 border-t border-slate-100">
              <p className="text-[13px] text-slate-500 font-normal">
                Butuh server VPS atau spesifikasi khusus?{" "}
                <a href="/#contact" className="text-[#0077b6] font-semibold hover:underline">
                  Diskusikan Bersama Kami
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-200/80 mb-20" />

        {/* ================================================= */}
        {/* PART 2: MODEL PENJUALAN APLIKASI (PRICING TIERS)  */}
        {/* ================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 w-full relative"
        >
          {isAdmin && (
            <div className="absolute right-0 top-0">
              <button 
                onClick={handleAdd}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[13px] font-jakarta font-bold hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Paket
              </button>
            </div>
          )}
          
          <span className="font-jakarta font-semibold text-[12px] tracking-[0.2em] text-[#0077b6] uppercase mb-3 block">
            SKEMA INVESTASI FLEKSIBEL
          </span>
          <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[44px] text-slate-900 leading-tight mb-4 tracking-[-0.03em]">
            Pilih Model Pembayaran yang Sesuai
          </h2>
          
          {/* Custom Toggle Switch */}
          <div className="relative grid grid-cols-3 mt-7 bg-slate-200/80 p-1.5 rounded-full border border-slate-300/80 shadow-inner w-[95%] max-w-[650px] mx-auto select-none">
            {/* Sliding Background Pill */}
            <div 
              className={`absolute top-[6px] bottom-[6px] left-0 w-[calc(33.333%-4px)] bg-white border border-slate-200/60 rounded-full shadow-md transition-transform duration-300 ease-out ${
                billingMode === "monthly" 
                  ? "translate-x-[6px]" 
                  : billingMode === "annual"
                    ? "translate-x-[calc(100%+6px)]"
                    : "translate-x-[calc(200%+6px)]"
              }`} 
            />
            
            <button
              onClick={() => setBillingMode("monthly")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-jakarta font-bold text-[12px] md:text-[14px] transition-colors cursor-pointer ${
                billingMode === "monthly" ? "text-[#0077b6]" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sewa Bulanan
            </button>
            <button
              onClick={() => setBillingMode("annual")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-jakarta font-bold text-[12px] md:text-[14px] transition-colors cursor-pointer ${
                billingMode === "annual" ? "text-[#0077b6]" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sewa Tahunan
            </button>
            <button
              onClick={() => setBillingMode("lifetime")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-jakarta font-bold text-[12px] md:text-[14px] transition-colors cursor-pointer ${
                billingMode === "lifetime" ? "text-[#0077b6]" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Beli Putus (Kustom)
            </button>
          </div>
          
          {/* Helper caption */}
          <div className="min-h-[60px] mt-5 flex justify-center items-start">
            <p className="font-jakarta text-[13.5px] md:text-[14.5px] text-slate-600 max-w-[600px] mx-auto font-normal">
              {billingMode === "monthly" 
                ? "Bayar bulanan hemat tanpa beban modal besar. Seluruh urusan server, domain, dan pemeliharaan kami tangani penuh."
                : billingMode === "annual"
                  ? "Bayar tahunan lebih hemat dan praktis. Solusi tepat untuk keberlanjutan operasional bisnis Anda."
                  : "Bayar sekali di awal dengan 100% kepemilikan source code dan arsitektur mandiri untuk aset digital tim Anda."}
            </p>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full relative z-20"
        >
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-[#00b4d8] mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-slate-500 font-medium font-jakarta text-[14px]">Memuat paket harga...</span>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 font-jakarta text-[14px]">
              Belum ada paket harga tersedia untuk kategori ini.
            </div>
          ) : (
            filteredPackages.map((plan, index) => (
              <motion.div
                key={plan.id || index}
                variants={itemVariants}
                className={`relative flex flex-col p-8 md:p-9 rounded-2xl transition-all duration-300 ${
                  plan.is_popular
                    ? "bg-white border-2 border-[#00b4d8] shadow-[0_8px_32px_rgba(0,180,216,0.12)] ring-1 ring-[#00b4d8]/20 md:-translate-y-3"
                    : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md"
                }`}
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button 
                      onClick={() => handleEdit(plan)} 
                      className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0077b6] rounded-xl transition-colors cursor-pointer" 
                      title="Edit Paket"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)} 
                      className="p-2 bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 rounded-xl transition-colors cursor-pointer" 
                      title="Hapus Paket"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex flex-col flex-1 h-full relative">
                  <div className="flex flex-col items-start mb-4 relative z-10">
                    {plan.is_popular && (
                      <span className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white text-[10.5px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                        Rekomendasi Utama
                      </span>
                    )}
                    <h3 className="font-jakarta font-bold text-[22px] md:text-[24px] text-slate-900">{plan.name}</h3>
                  </div>

                  <div className="mb-8 relative z-10">
                    {plan.original_price && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-jakarta text-[14px] font-normal line-through text-slate-400">
                          {plan.original_price}
                        </div>
                        {(() => {
                          const discount = calculateDiscount(plan.original_price, plan.price);
                          if (discount > 0) {
                            return (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#0077b6] border border-sky-200">
                                Hemat {discount}%
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                    <span className={`font-jakarta font-extrabold text-slate-900 tracking-tight ${plan.price === "Custom" ? "text-[36px]" : "text-[34px] xl:text-[38px]"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="font-jakarta text-[13.5px] text-slate-500 block mt-1">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow flex-1 relative z-10">
                    <p className="font-jakarta font-semibold text-[13px] text-slate-500 uppercase tracking-wider mb-4">
                      Fitur Termasuk:
                    </p>
                    <ul className="space-y-3.5 min-h-[260px]">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0 w-4.5 h-4.5 rounded-full bg-sky-50 text-[#0077b6] flex items-center justify-center">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="font-jakarta text-[13.5px] text-slate-600 leading-snug font-normal">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="/#contact"
                    className={`mt-8 w-full py-3.5 rounded-xl font-jakarta font-bold text-[14px] flex items-center justify-center transition-all duration-200 text-center relative z-10 ${
                      plan.is_popular
                        ? "bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#023e8a] text-white shadow-md shadow-[#00b4d8]/20"
                        : "bg-slate-900 hover:bg-[#0077b6] text-white shadow-xs"
                    }`}
                  >
                    Mulai Konsultasi
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <PricingForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSave={() => setRefreshTrigger(prev => prev + 1)} 
        editData={editData} 
      />
    </section>
  );
};

export default Pricing;
