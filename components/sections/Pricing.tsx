"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/style";
import { getApiUrl } from "@/utils/api";
import PricingForm from "../forms/PricingForm";
// import { motion } from "framer-motion";
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

// --- DATA STRUCTURES ---

const saasProducts = [
  "SIM Sekolah",
  "HRM (Human Resource Management)",
  "ERP UMKM",
  "POS (Point of Sales)",
  "E-Learning",
  "SIM Akademik",
  "Document Management System",
  "Klinik Management",
  "Hotel Management",
  "Laundry Management",
];

const customDevExamples = [
  "Website Company Profile",
  "Sistem Informasi",
  "Aplikasi Mobile Android/iOS",
  "Dashboard Monitoring",
  "IoT Dashboard",
  "ERP",
  "CRM",
  "Marketplace",
];

const hostingPackages = [
  { name: "Basic", target: "UMKM", capacity: "1 Website", price: "Rp99.000/bln" },
  { name: "Business", target: "Perusahaan", capacity: "10 Website", price: "Rp299.000/bln" },
  { name: "Enterprise", target: "Startup", capacity: "Unlimited", price: "Rp799.000/bln" },
  { name: "Dedicated Server", target: "Perusahaan Besar", capacity: "Unlimited", price: "Custom" },
];

const hostingFacilities = [
  "SSD NVMe", "SSL Gratis", "Backup", "Monitoring", "Email Bisnis", "Domain", "Support 24/7"
];

const domainFeatures = [
  "Domain .com", "Domain .id", "Email Bisnis", "SSL", "DNS Management"
];

const iotSolutions = [
  "Monitoring Ruang Server", "Smart Building", "Smart School", "Smart Office", "Smart Farming", "Monitoring Listrik", "Dashboard IoT"
];

const networkingServices = [
  "Instalasi Jaringan", "Fiber Optic", "Mikrotik", "Cisco", "Access Point", "Server Installation", "Rack Server", "CCTV", "Maintenance"
];

// (Pricing plans are now fetched from API)

const calculateDiscount = (original: string, current: string) => {
  const origNum = parseInt(original.replace(/\D/g, ''));
  const currNum = parseInt(current.replace(/\D/g, ''));
  if (origNum && currNum && origNum > currNum) {
    return Math.round(((origNum - currNum) / origNum) * 100);
  }
  return 0;
};

// --- COMPONENT ---

const Pricing: React.FC = () => {
  const [billingMode, setBillingMode] = useState<"monthly" | "annual" | "lifetime">("monthly");
  const [packages, setPackages] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Sync initial admin state
    setIsAdmin(localStorage.getItem("isAdmin") === "true");

    // Listen for state changes
    const handleAdminSync = () => setIsAdmin(localStorage.getItem("isAdmin") === "true");
    window.addEventListener("admin-state-changed", handleAdminSync);

    // Listen for the secret trigger from Footer
    const handleAdminTrigger = () => {
      const stored = localStorage.getItem("isAdmin") === "true";
      if (stored) {
        if (window.confirm("Keluar dari Mode Admin? Anda akan kehilangan hak akses kelola CMS.")) {
          localStorage.removeItem("isAdmin");
          setIsAdmin(false);
          window.dispatchEvent(new CustomEvent("admin-state-changed"));
        }
      } else {
        const pin = window.prompt("Masukkan PIN Admin:");
        if (pin === "2026") {
          localStorage.setItem("isAdmin", "true");
          setIsAdmin(true);
          window.dispatchEvent(new CustomEvent("admin-state-changed"));
        } else if (pin !== null) {
          alert("Sandi PIN salah! Silakan coba lagi.");
        }
      }
    };
    window.addEventListener("trigger-admin-login", handleAdminTrigger);

    return () => {
      window.removeEventListener("admin-state-changed", handleAdminSync);
      window.removeEventListener("trigger-admin-login", handleAdminTrigger);
    };
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl("/api/pricing"));
        const data = await res.json();
        if (data.success) {
          setPackages(data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data pricing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus paket harga ini?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/pricing/${id}`), { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Gagal menghapus: " + data.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
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
    <section className={`pt-0 pb-24 w-full relative flex flex-col items-center bg-transparent overflow-hidden font-jakarta`}>
      {/* Decorative gradients */}
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-[1280px] mx-auto px-4 md:px-8 w-full">
        
        {/* ================================================= */}
        {/* PART 1: KATALOG LAYANAN (REDESIGN)                */}
        {/* ================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 w-full pt-0 mt-[-10px]"
        >
          <h2 className="font-poppins font-extrabold text-[36px] md:text-[44px] text-primary-dark leading-tight mb-6 tracking-tight max-w-[800px] mx-auto">
            Solusi Digital yang <br className="hidden md:block"/>
            <span className="text-[#00b4d8]">Terasa Lebih Personal.</span>
          </h2>
          <p className="font-jakarta text-[15px] md:text-[16px] text-slate-500 leading-relaxed max-w-[650px] mx-auto">
            Kami hadir untuk membantu bisnis Anda tumbuh lebih cepat dengan teknologi yang mudah digunakan, andal, dan selalu mendukung kebutuhan Anda.
          </p>
        </motion.div>

        {/* Top Grid for Services */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full mb-12"
        >
          
          {/* Card 1: Software Siap Pakai */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,180,216,0.08)] transition-all duration-300 flex flex-col h-full border border-slate-50"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l5.09-5.09L16.5 10.5 10 17z"/>
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-[18px] text-primary-dark mb-3">Software Siap Pakai</h3>
            <p className="text-slate-500 text-[13.5px] mb-8 leading-relaxed">
              Aplikasi bisnis praktis dengan sistem berlangganan. Anda fokus jualan, kami urus teknologinya.
            </p>
            <div className="flex-grow">
              <ul className="space-y-4">
                {["Sistem Informasi Sekolah", "ERP untuk UMKM & Bisnis", "Platform Kasir (POS)", "Sistem Laundry & Hotel"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13.5px] text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8 mt-4 border-t border-slate-100 flex items-end gap-2">
              <span className="text-[12px] text-slate-400 font-medium mb-1.5">Langganan Mulai</span>
              <span className="font-poppins font-bold text-[18px] text-[#00b4d8]">Rp 199rb <span className="text-[13px] text-slate-400 font-medium">/bulan</span></span>
            </div>
          </motion.div>

          {/* Card 2: Aplikasi Custom */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-300 flex flex-col h-full border border-slate-50"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-[18px] text-primary-dark mb-3">Aplikasi Custom</h3>
            <p className="text-slate-500 text-[13.5px] mb-8 leading-relaxed">
              Punya ide unik? Kami bangunkan aplikasi khusus yang dirancang mengikuti alur kerja tim Anda.
            </p>
            <div className="flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[13.5px] text-slate-600 font-medium">
                  <div className="mt-1 shrink-0 bg-emerald-100 p-0.5 rounded-full text-emerald-500">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  Website & Company Profile Modern
                </li>
                <li className="flex items-start gap-3 text-[13.5px] text-slate-600 font-medium">
                  <div className="mt-1 shrink-0 bg-emerald-100 p-0.5 rounded-full text-emerald-500">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  Aplikasi Mobile Android & iOS
                </li>
                <li className="flex items-start gap-3 text-[13.5px] text-slate-600 font-medium">
                  <div className="mt-1 shrink-0 bg-emerald-100 p-0.5 rounded-full text-emerald-500">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  </div>
                  Dashboard Analitik Data & IoT
                </li>
              </ul>
            </div>
            <div className="pt-8 mt-4 border-t border-slate-100 flex items-end gap-2">
              <span className="text-[12px] text-slate-400 font-medium mb-1.5">Investasi Mulai</span>
              <span className="font-poppins font-bold text-[18px] text-emerald-500">Rp 5 Juta</span>
            </div>
          </motion.div>

          {/* Stack of 3 Small Cards */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col gap-6 w-full h-full justify-between"
          >
            {/* Identitas Online */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <h3 className="font-poppins font-bold text-[16px] text-primary-dark">Identitas Online</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Domain .com / .id</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Email Bisnis</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Keamanan SSL</span>
              </div>
            </div>

            {/* Smart Solutions */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="font-poppins font-bold text-[16px] text-primary-dark">Smart Solutions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Smart Building</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Sistem Monitoring</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">IoT Dashboard</span>
              </div>
            </div>

            {/* Jaringan & Infra */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="font-poppins font-bold text-[16px] text-primary-dark">Jaringan & Infra</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Fiber Optic</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">Hotspot Management</span>
                <span className="text-slate-500 text-[11px] font-medium px-3 py-1.5 rounded-full border border-slate-200">CCTV IP</span>
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
          className="w-full bg-white rounded-[40px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100 mb-20 flex flex-col lg:flex-row overflow-hidden"
        >
          
          {/* Left Content (Matches Hero Color) */}
          <div className="lg:w-[45%] bg-gradient-to-br from-[#e6f7fa] to-[#f0f9fc] p-8 md:p-12 flex flex-col justify-center relative">
            <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center mb-6 shadow-lg shadow-teal-900/20">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="font-poppins font-bold text-[22px] md:text-[28px] text-primary-dark mb-4 leading-tight">
              Cloud Hosting yang Bisa Diandalkan
            </h3>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-10">
              Rumah yang aman untuk website dan aplikasi Anda. Kami mengelola server dengan performa tinggi agar bisnis Anda online 24/7 tanpa kendala.
            </p>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {["Penyimpanan SSD", "Gratis SSL", "Backup Rutin", "Support 24/7"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[13.5px] font-semibold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Packages Content (White Area) */}
          <div className="lg:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <h4 className="font-poppins font-bold text-[16px] text-primary-dark mb-6">Pilih Paket Sesuai Kebutuhan</h4>
            
            <div className="flex-grow flex flex-col justify-center space-y-0">
              
              {/* Starter Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-slate-100 gap-4">
                <div className="w-full md:w-5/12">
                  <div className="font-poppins font-bold text-[15px] text-primary-dark">Starter</div>
                  <div className="text-[12px] text-slate-400 mt-0.5">Pas untuk Blog & UMKM Pemula</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-500 text-[13px] font-medium">
                  1 Website + 10GB
                </div>
                <div className="w-full md:w-3/12 md:text-right font-poppins font-bold text-[16px] text-teal-800">
                  Rp 99rb<span className="text-[12px] text-slate-400">/bln</span>
                </div>
              </div>

              {/* Business Row (Active) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-slate-100 gap-4 relative">
                {/* Active Indicator positioned exactly on the left edge of the white section */}
                <div className="absolute left-[-32px] md:left-[-48px] top-0 bottom-0 w-1.5 bg-teal-600 rounded-r-md hidden md:block"></div>
                <div className="w-full md:w-5/12 flex flex-wrap items-center gap-2">
                  <div className="font-poppins font-bold text-[15px] text-primary-dark">Business</div>
                  <span className="bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Favorit</span>
                  <div className="text-[12px] text-slate-400 mt-0.5 w-full">Untuk Perusahaan & Startup</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-500 text-[13px] font-medium">
                  10 Website + 50GB
                </div>
                <div className="w-full md:w-3/12 md:text-right font-poppins font-bold text-[16px] text-teal-800">
                  Rp 299rb<span className="text-[12px] text-slate-400">/bln</span>
                </div>
              </div>

              {/* Enterprise Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between py-5 gap-4">
                <div className="w-full md:w-5/12">
                  <div className="font-poppins font-bold text-[15px] text-primary-dark">Enterprise</div>
                  <div className="text-[12px] text-slate-400 mt-0.5">Resource Luas tanpa Batas</div>
                </div>
                <div className="w-full md:w-4/12 text-slate-500 text-[13px] font-medium">
                  Unlimited + High CPU
                </div>
                <div className="w-full md:w-3/12 md:text-right font-poppins font-bold text-[16px] text-teal-800">
                  Rp 799rb<span className="text-[12px] text-slate-400">/bln</span>
                </div>
              </div>

            </div>
            
            <div className="text-center mt-6 pt-6 border-t border-slate-100">
              <p className="text-[13px] text-slate-500 font-medium">
                Butuh server khusus (Dedicated)? <a href="/#contact" className="text-teal-700 font-bold hover:underline">Hubungi Kami</a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-20" />


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
                className="bg-[#00b4d8] text-white px-5 py-2 rounded-xl text-[13px] font-poppins font-bold hover:bg-[#0096b4] shadow-md shadow-[#00b4d8]/20 transition-all flex items-center gap-2"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Paket
              </button>
            </div>
          )}
          
          <span className="font-poppins font-bold text-[12px] tracking-[0.2em] text-[#00b4d8] uppercase mb-4 block">
            Model Penjualan Aplikasi
          </span>
          <h2 className="font-poppins font-extrabold text-[36px] md:text-[44px] text-primary-dark leading-tight mb-6 tracking-tight">
            Pilih Pembayaran yang Paling Cocok
          </h2>
          
          {/* Custom Toggle Switch */}
          <div className="relative grid grid-cols-3 mt-6 bg-slate-100/80 p-[6px] rounded-full border border-slate-200 shadow-inner w-[95%] max-w-[650px] mx-auto">
            {/* Sliding Background Pill */}
            <div 
              className={`absolute top-[6px] bottom-[6px] left-0 w-[calc(33.333%-4px)] bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                billingMode === "monthly" 
                  ? "translate-x-[6px]" 
                  : billingMode === "annual"
                    ? "translate-x-[calc(100%+6px)]"
                    : "translate-x-[calc(200%+6px)]"
              }`} 
            />
            
            <button
              onClick={() => setBillingMode("monthly")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-poppins font-bold text-[12px] md:text-[14px] transition-colors duration-400 ${
                billingMode === "monthly" ? "text-[#00b4d8]" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sewa Bulanan
            </button>
            <button
              onClick={() => setBillingMode("annual")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-poppins font-bold text-[12px] md:text-[14px] transition-colors duration-400 ${
                billingMode === "annual" ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sewa Tahunan
            </button>
            <button
              onClick={() => setBillingMode("lifetime")}
              className={`relative z-10 py-2.5 md:py-3 rounded-full font-poppins font-bold text-[12px] md:text-[14px] transition-colors duration-400 ${
                billingMode === "lifetime" ? "text-indigo-500" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Beli Putus (Lifetime)
            </button>
          </div>
          
          {/* Fixed height wrapper to prevent page jumping */}
          <div className="min-h-[90px] md:min-h-[60px] mt-6 flex justify-center items-start">
            <p className="font-jakarta text-[13px] md:text-[14px] text-slate-500 max-w-[600px] mx-auto transition-opacity duration-300">
              {billingMode === "monthly" 
                ? "Bayar bulanan ringan, cocok untuk bisnis yang baru mulai. Sudah termasuk server dan perawatan."
                : billingMode === "annual"
                  ? "Bayar tahunan lebih hemat 20%! Solusi tepat untuk bisnis yang mencari efisiensi jangka panjang."
                  : "Cukup bayar sekali di awal. Dapatkan source code lengkap untuk dikelola tim IT internal Anda sendiri."}
            </p>
          </div>
        </motion.div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes switchFade {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-switch {
            animation: switchFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-20"
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
                className={`relative flex flex-col p-8 md:p-10 rounded-[32px] transition-all duration-500 ${
                  plan.is_popular
                    ? "bg-primary-dark text-white shadow-[0_20px_60px_rgba(0,4,15,0.15)] md:-translate-y-4 border border-primary-dark"
                    : "bg-white text-primary-dark shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2"
                }`}
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <button onClick={() => handleEdit(plan)} className="p-2 bg-white/10 hover:bg-white text-slate-300 hover:text-[#00b4d8] rounded-xl shadow-sm border border-white/20 backdrop-blur-sm transition-colors" title="Edit Paket">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="p-2 bg-white/10 hover:bg-rose-500 text-slate-300 hover:text-white rounded-xl shadow-sm border border-white/20 backdrop-blur-sm transition-colors" title="Hapus Paket">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

                <div key={billingMode} className="animate-switch flex flex-col flex-1 h-full relative">

              {/* Card Background Glow for Popular */}
              {plan.is_popular && (
                <div className={`absolute inset-0 rounded-[32px] opacity-20 pointer-events-none bg-gradient-to-b ${
                  billingMode === "monthly" ? "from-[#00b4d8]/40" : billingMode === "annual" ? "from-emerald-500/40" : "from-indigo-500/40"
                } to-transparent`} />
              )}

              <div className="flex flex-col items-start mb-4 relative z-10">
                {plan.is_popular && (
                  <span className={`text-white text-[10px] md:text-[11px] tracking-widest uppercase font-extrabold px-3.5 py-1.5 rounded-full shadow-md mb-3 ${
                    billingMode === "monthly" ? "bg-gradient-to-r from-[#00b4d8] to-[#0077b6]" : billingMode === "annual" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-indigo-500 to-purple-600"
                  }`}>
                    ★ Paling Diminati
                  </span>
                )}
                <h3 className="font-poppins font-bold text-[22px] md:text-[26px]">{plan.name}</h3>
              </div>

              <div className="mb-10 relative z-10">
                {plan.original_price && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`font-poppins text-[15px] font-medium line-through ${plan.is_popular ? "text-white/60" : "text-slate-400"}`}>
                      {plan.original_price}
                    </div>
                    {(() => {
                      const discount = calculateDiscount(plan.original_price, plan.price);
                      if (discount > 0) {
                        return (
                          <span className={`text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${plan.is_popular ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}>
                            Hemat {discount}%
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                <span className={`font-poppins font-bold tracking-tight ${plan.price === "Custom" ? "text-[40px]" : "text-[36px] xl:text-[40px]"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`font-jakarta text-[14px] ml-1 block mt-1 ${plan.is_popular ? "text-slate-300" : "text-slate-500"}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <div className="flex-grow flex-1 relative z-10">
                <p className={`font-poppins font-semibold text-[14px] mb-5 ${plan.is_popular ? "text-white" : "text-primary-dark"}`}>
                  Fitur Termasuk:
                </p>
                <ul className="space-y-4 min-h-[320px]">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.is_popular 
                          ? billingMode === "monthly" ? "bg-[#00b4d8]/20 text-[#00f6ff]" : billingMode === "annual" ? "bg-emerald-500/30 text-emerald-100" : "bg-indigo-500/30 text-indigo-200"
                          : billingMode === "monthly" ? "bg-cyan-50 text-cyan-600" : billingMode === "annual" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                      }`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className={`font-jakarta text-[14px] font-medium leading-tight ${plan.is_popular ? "text-slate-200" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="/#contact"
                className={`mt-10 w-full py-4 rounded-2xl font-poppins font-bold text-[14px] flex items-center justify-center transition-all duration-300 text-center relative z-10 ${
                  plan.is_popular
                    ? billingMode === "monthly" 
                      ? "bg-[#00b4d8] text-white hover:bg-[#0096b4] shadow-md shadow-[#00b4d8]/30"
                      : billingMode === "annual"
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/30"
                        : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/30"
                    : "bg-slate-50 text-primary-dark hover:bg-slate-100 border border-slate-200"
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
