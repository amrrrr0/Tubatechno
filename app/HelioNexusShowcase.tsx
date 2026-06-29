"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";

export default function HelioNexusShowcase() {
  const [isLoading, setIsLoading]         = useState(true);
  const [activeTab, setActiveTab]         = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData]           = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors]       = useState({ name: "", email: "", subject: "", message: "" });
  const [formSuccess, setFormSuccess]     = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [showSimawaDropdown, setShowSimawaDropdown] = useState(false);

  const handleLoadingDone = useCallback(() => setIsLoading(false), []);

  // Navbar shrink on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: update activeTab when sections enter viewport
  useEffect(() => {
    const sections = ["home", "solutions", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (e: React.FormEvent) => {
    e.preventDefault();
    const err = { name: "", email: "", subject: "", message: "" };
    let bad = false;
    if (!formData.name.trim() || formData.name.trim().length < 2) { err.name = "Please enter your full name."; bad = true; }
    if (!/\S+@\S+\.\S+/.test(formData.email))                    { err.email = "Please enter a valid email address."; bad = true; }
    if (!formData.subject.trim())                                 { err.subject = "Please enter a subject."; bad = true; }
    if (!formData.message.trim())                                 { err.message = "Please enter your message."; bad = true; }
    setFormErrors(err);
    if (!bad) { setFormSuccess(true); setFormErrors({ name: "", email: "", subject: "", message: "" }); }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) setFormErrors(p => ({ ...p, [name]: "" }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#121A2E] overflow-x-hidden selection:bg-[#E05300] selection:text-white">
      {isLoading && <LoadingScreen onDone={handleLoadingDone} />}

      {/* ─── NAV ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none">
        <div className={`pointer-events-auto header-morph-transition flex items-center justify-between relative ${
          isScrolled
            ? "w-[90%] max-w-[850px] bg-white/75 backdrop-blur-md border border-neutral-200/40 rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.06)] h-[52px] mt-4 px-6"
            : "w-full bg-transparent border-b border-transparent h-[74px] px-6 md:px-12"
        }`}>
          {/* Logo & Wordmark */}
          <a href="#home" className="flex items-center gap-2.5 cursor-pointer shrink-0 header-child-transition">
            <Image src="/images/logo-symbol.png" alt="Helio Nexus Logo" width={isScrolled ? 26 : 32} height={isScrolled ? 26 : 32} className="object-contain header-child-transition" />
            <div className={`font-sans font-bold tracking-tight leading-none header-child-transition flex items-baseline ${
              isScrolled ? "text-[16px]" : "text-[20px]"
            }`}>
              <span className="text-[#FE670D] transition-colors duration-500">Helio</span>
              <span className="text-[#323E7A] transition-colors duration-500 ml-1">Nexus</span>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-2 text-[14px] font-medium header-child-transition">
            {([["home","Home"],["solutions","Solutions"],["contact","Contact"]] as [string,string][]).map(([id, lbl]) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className={`cursor-pointer header-child-transition ${
                    isScrolled
                      ? isActive
                        ? "bg-[#F3F4F6] text-[#121A2E] px-4 py-1.5 rounded-full text-xs font-semibold"
                        : "text-neutral-500 hover:text-black px-3 py-1.5 text-xs"
                      : isActive
                        ? "text-[#E05300] font-semibold px-4 py-2"
                        : "text-[#4B5563] hover:text-[#121A2E] px-4 py-2"
                  }`}>
                  {lbl}
                </button>
              );
            })}
          </nav>

          <button onClick={() => scrollTo("contact")}
            className={`btn-primary rounded-full cursor-pointer header-child-transition ${
              isScrolled ? "!h-8 !px-4 text-[11px]" : "h-9 px-6 text-[12px]"
            }`}>
            Consult Now
          </button>

          {/* Mobile burger */}
          <button onClick={() => setMobileMenuOpen(o => !o)} aria-label="menu"
            className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px] cursor-pointer">
            <span className={`w-[22px] h-[2px] bg-[#121A2E] rounded transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`w-[22px] h-[2px] bg-[#121A2E] rounded transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-[22px] h-[2px] bg-[#121A2E] rounded transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>

          {/* Mobile dropdown menu inside the click-enabled container */}
          {mobileMenuOpen && (
            <div className={`absolute left-0 right-0 w-full animate-fade-in px-6 pt-4 pb-6 flex flex-col gap-3 transition-all duration-300 ${
              isScrolled 
                ? "top-[58px] bg-white/95 backdrop-blur-lg border border-neutral-200/50 rounded-2xl shadow-xl text-[#121A2E]" 
                : "top-[70px] bg-white border-b border-neutral-100 shadow-md"
            }`}>
              {[["home","Home"],["solutionsOverview"],["solutions","Solutions"],["contact","Contact"]].map(([id, lbl]) => (
                <button key={id} onClick={() => scrollTo(id)} 
                  className="text-left text-[14px] font-semibold py-2.5 border-b border-neutral-100 text-neutral-600 hover:text-[#E05300] cursor-pointer">
                  {lbl}
                </button>
              ))}
              <button onClick={() => scrollTo("contact")} className="btn-primary mt-2 w-full h-11 rounded-full">Consult Now</button>
            </div>
          )}
        </div>
      </header>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-[85vh] flex items-center overflow-hidden bg-white border-b border-neutral-100">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/umpkubuildingv3.png" alt="Helio Nexus Campus Illustration" fill priority className="object-cover object-center" />
          {/* Light gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 container-helio w-full pt-28 md:pt-36 pb-16">
          <div className="max-w-[620px]">
            {/* Headline */}
            <h1 className="text-[clamp(32px,4.5vw,56px)] font-extrabold leading-[1.1] tracking-tight text-[#121A2E] mb-6">
              Bangun Inovasi Digital Bersama <span className="text-[#FE670D]">Helio</span> <span className="text-[#323E7A]">Nexus</span>
            </h1>

            <p className="text-base md:text-lg text-[#4B5563] leading-relaxed mb-10 max-w-[540px]">
              <span className="text-[#FE670D] font-semibold">Helio</span> <span className="text-[#323E7A] font-semibold">Nexus</span> adalah startup teknologi yang berfokus pada pengembangan aplikasi, sistem informasi, dan website. Kami membantu institusi pendidikan, perusahaan, dan organisasi dalam membangun solusi digital yang inovatif, aman, dan sesuai dengan kebutuhan.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("contact")}
                className="btn-primary h-12 px-8 text-[13px] rounded-full">
                Consult Now
              </button>
              <button onClick={() => scrollTo("solutions")}
                className="btn-secondary h-12 px-8 text-[13px] rounded-full">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE HELIO NEXUS DIGITAL NERVOUS SYSTEM ──────────────────── */}
      <section className="py-20 bg-white flex justify-center px-4 md:px-8">
        <div className="w-full max-w-[800px] text-center flex flex-col items-center">
          <h2 className="text-[28px] md:text-[38px] font-bold text-[#121A2E] leading-tight mb-4">
            Mitra Teknologi untuk Transformasi Digital
          </h2>
          <p className="text-sm md:text-base text-neutral-600 max-w-[680px] leading-relaxed mb-8">
            Kami percaya bahwa setiap ide memiliki potensi besar. <span className="text-[#FE670D] font-semibold">Helio</span> <span className="text-[#323E7A] font-semibold">Nexus</span> hadir untuk mengubah ide tersebut menjadi produk digital yang modern, fungsional, dan siap digunakan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Website Profesional", "Aplikasi Modern", "Sistem Terintegrasi"].map((pill) => (
              <span key={pill} className="px-5 py-2.5 bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold rounded-full shadow-xs">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTIONS (HN Business Units Cards) ──────────────────────── */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-[#FFF0E6] to-[#EBF3FC] border-t border-b border-neutral-200/30">
        <div className="container-helio max-w-[1200px]">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#121A2E] text-center mb-16">
            <span className="text-[#FE670D]">Helio</span> <span className="text-[#323E7A]">Nexus</span> Business Units
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {/* Card 1: EDUAPP */}
            <div className="flex flex-col items-center bg-white border border-neutral-200/50 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="mb-6">
                <Image src="/images/eduapp.png" alt="EDUAPP Logo" width={96} height={96} className="object-contain" />
              </div>
              <h3 className="text-[20px] font-bold text-[#121A2E] mb-3">EDUAPP</h3>
              <p className="text-sm text-neutral-600 text-center mb-6 leading-relaxed">
                Aplikasi manajemen sekolah berbasis web dan aplikasi yang mengintegrasikan administrasi akademik, HRM, e-Rapor, pengarsipan dokumen, serta berbagai kebutuhan operasional sekolah dalam satu sistem.
              </p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-[12px] h-9 px-6 rounded-full w-full text-center flex items-center justify-center mt-auto"
              >
                View Details
              </a>
            </div>

            {/* Card 2: SIMAWA */}
            <div className="flex flex-col items-center bg-white border border-neutral-200/50 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="mb-6 h-[96px] flex items-center justify-center">
                <Image src="/images/simawa.png" alt="SIMAWA Logo" width={96} height={96} className="object-contain" />
              </div>
              <h3 className="text-[20px] font-bold text-[#121A2E] mb-3">SIMAWA</h3>
              <p className="text-sm text-neutral-600 text-center mb-6 leading-relaxed">
                Sistem Informasi Manajemen Organisasi Mahasiswa sebuah platform digital terintegrasi yang dirancang khusus untuk mengelola, memantau, dan menyinkronkan seluruh aktivitas organisasi mahasiswa dan layanan kemahasiswaan di tingkat perguruan tinggi.
              </p>
              
              {!showSimawaDropdown ? (
                <button
                  onClick={() => setShowSimawaDropdown(true)}
                  className="btn-primary text-[12px] h-9 px-6 rounded-full w-full text-center flex items-center justify-center mt-auto"
                >
                  View Details
                </button>
              ) : (
                <div className="flex gap-2 w-full mt-auto animate-fadeIn">
                  <a
                    href="https://sysma.umpku.ac.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-[12px] h-9 px-3 rounded-full flex-1 text-center flex items-center justify-center"
                  >
                    Admin
                  </a>
                  <a
                    href="https://simawa.umpku.ac.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-[12px] h-9 px-3 rounded-full flex-1 text-center flex items-center justify-center"
                  >
                    User
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION (HUMAN & CLEAN LAYOUT) ────────────────────── */}
      <section id="contact" className="py-20 bg-white">
        <div className="container-helio max-w-[1050px]">
          <div className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.06)] grid grid-cols-1 md:grid-cols-[1.1fr_1.4fr]">
            
            {/* Left Side: Gradient Info Panel */}
            <div className="bg-gradient-to-br from-[#FFF0E6] to-[#EBF3FC] text-[#121A2E] p-8 md:p-12 flex flex-col justify-between border-r border-neutral-100">
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-200/40 flex items-center justify-center text-[#E05300] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500 uppercase tracking-widest font-semibold">Phone</span>
                    <span className="text-[16px] font-bold text-[#121A2E]">+62 813 9089 5886</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-200/40 flex items-center justify-center text-[#E05300] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500 uppercase tracking-widest font-semibold">Email</span>
                    <span className="text-[16px] font-bold text-[#121A2E]">arfazaim0202@gmail.com</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-200/40 flex items-center justify-center text-[#E05300] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500 uppercase tracking-widest font-semibold">Location</span>
                    <span className="text-[16px] font-bold text-[#121A2E]">Surakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: White Consultation Form */}
            <div className="bg-white p-8 md:p-12">
              {formSuccess ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-[#E05300] flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[#E05300]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#121A2E] mb-2">Request Sent Successfully</h3>
                  <p className="text-sm text-neutral-500 max-w-[320px] mb-8 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Our team will review your consultation request and contact you at <strong>{formData.email}</strong>.
                  </p>
                  <button onClick={() => { setFormData({ name: "", email: "", subject: "", message: "" }); setFormSuccess(false); }}
                    className="btn-secondary h-11 px-6 rounded-full text-xs">
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={validate} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" id="name" name="name" value={formData.name} onChange={onChange}
                        placeholder="Nama Lengkap"
                        className={`input-text rounded-full !bg-neutral-50 border-neutral-200 focus:border-[#E05300] focus:!bg-white ${formErrors.name ? "error-state" : ""}`} />
                      {formErrors.name && <span className="text-xs text-red-500 mt-1.5 block px-2">{formErrors.name}</span>}
                    </div>

                    <div>
                      <input type="email" id="email" name="email" value={formData.email} onChange={onChange}
                        placeholder="Email"
                        className={`input-text rounded-full !bg-neutral-50 border-neutral-200 focus:border-[#E05300] focus:!bg-white ${formErrors.email ? "error-state" : ""}`} />
                      {formErrors.email && <span className="text-xs text-red-500 mt-1.5 block px-2">{formErrors.email}</span>}
                    </div>
                  </div>

                  <div>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={onChange}
                    placeholder="Subjek"
                    className={`input-text rounded-full !bg-neutral-50 border-neutral-200 focus:border-[#E05300] focus:!bg-white ${formErrors.subject ? "error-state" : ""}`} />
                    {formErrors.subject && <span className="text-xs text-red-500 mt-1.5 block px-2">{formErrors.subject}</span>}
                  </div>

                  <div>
                    <textarea id="message" name="message" value={formData.message} onChange={onChange}
                      placeholder="Pesan"
                      className={`textarea-custom rounded-[20px] !bg-neutral-50 border-neutral-200 focus:border-[#E05300] focus:!bg-white ${formErrors.message ? "error-state" : ""}`} />
                    {formErrors.message && <span className="text-xs text-red-500 mt-1.5 block px-2">{formErrors.message}</span>}
                  </div>

                  <button type="submit" className="btn-primary w-full h-12 text-[13px] rounded-full justify-center transition-all">
                    Send Consultation Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-gradient-to-br from-[#FFF0E6] to-[#EBF3FC] text-[#121A2E] pt-16 pb-8 border-t border-neutral-200">
        <div className="container-helio max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-neutral-200/60">
            
            {/* Col 1: Brand Info (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/logo-symbol.png" alt="Helio Nexus" width={36} height={36} className="object-contain" />
                <div className="font-sans font-bold text-[24px] tracking-tight leading-none">
                  <span className="text-[#FE670D]">Helio</span>
                  <span className="text-[#323E7A] ml-1">Nexus</span>
                </div>
              </div>
              <p className="text-[13px] text-neutral-600 leading-relaxed max-w-[340px]">
                Mitra terpercaya dalam pengembangan website, aplikasi, dan solusi digital modern yang dirancang untuk membantu bisnis, institusi, dan organisasi tumbuh di era transformasi digital.
              </p>
            </div>
            
            {/* Col 2: Quick Links (3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Quick Links</span>
              <ul className="space-y-2.5 text-[13px] text-neutral-600 font-semibold">
                {["EDUAPP", "SIMAWA"].map((link) => (
                  <li key={link}>
                    <a href="#solutions" className="hover:text-[#E05300] transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact Info (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Contact Info</span>
              <ul className="space-y-3 text-[13px] text-neutral-600">
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-bold text-neutral-500">Phone:</span>
                  <a href="tel:+6281390895886" className="hover:text-[#E05300] font-semibold transition-colors">+62 813 9089 5886</a>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-bold text-neutral-500">Email:</span>
                  <a href="mailto:arfazaim0202@gmail.com" className="hover:text-[#E05300] font-semibold transition-colors">arfazaim0202@gmail.com</a>
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-bold text-neutral-500">Location:</span>
                  <span>Surakarta, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Policies */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
            <p>&copy; 2026 Helio Nexus. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#overview" className="hover:text-[#E05300] transition-colors duration-200">Terms of Service</a>
              <a href="#overview" className="hover:text-[#E05300] transition-colors duration-200">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
