"use client";
import React, { useState } from "react";

interface UnitUsaha {
  id: string;
  title: string;
  tagline: string;
  category: string;
  features: string[];
  isFeatured: boolean;
  btnClass: string;
  cardClass: string;
  checkBg: string;
  checkIcon: string;
  checkBorder: string;
  glowEffect?: React.ReactNode;
}

const unitUsahaList: UnitUsaha[] = [
  {
    id: "tirta",
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
    cardClass: "bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]",
    btnClass: "bg-white hover:bg-primary-dark border border-primary-dark/20 hover:border-primary-dark text-primary-dark hover:text-white",
    checkBg: "bg-cyan-50",
    checkIcon: "text-[#00b4d8]",
    checkBorder: "border-cyan-200/60"
  },
  {
    id: "boga",
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
    cardClass: "bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]",
    btnClass: "bg-white hover:bg-primary-dark border border-primary-dark/20 hover:border-primary-dark text-primary-dark hover:text-white",
    checkBg: "bg-cyan-50",
    checkIcon: "text-[#00b4d8]",
    checkBorder: "border-cyan-200/60"
  },
  {
    id: "helio",
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
    cardClass: "bg-gradient-to-b from-[#ecfeff] to-white border-2 border-[#00b4d8]/40 shadow-[0_20px_50px_rgba(0,246,255,0.06)] hover:border-[#00b4d8]/70",
    btnClass: "bg-gradient-to-r from-[#00f6ff] to-[#0077b6] text-primary-dark hover:brightness-110 shadow-[0_4px_15px_rgba(0,246,255,0.2)] hover:shadow-[0_10px_25px_rgba(0,246,255,0.3)] font-extrabold border border-[#00f6ff]/30",
    checkBg: "bg-cyan-50",
    checkIcon: "text-[#00b4d8]",
    checkBorder: "border-cyan-200/60",
    glowEffect: (
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00f6ff]/3 to-transparent opacity-60 pointer-events-none" />
    )
  },
  {
    id: "bmt",
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
    cardClass: "bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]",
    btnClass: "bg-white hover:bg-primary-dark border border-primary-dark/20 hover:border-primary-dark text-primary-dark hover:text-white",
    checkBg: "bg-cyan-50",
    checkIcon: "text-[#00b4d8]",
    checkBorder: "border-cyan-200/60"
  }
];

const CardDeal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bisnis" | "contact">("bisnis");
  const [email, setEmail] = useState("arfazaim0202@gmail.com");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pesan terkirim!\nEmail: ${email}\nPesan: ${message}`);
    setMessage("");
  };

  return (
    <section className="flex flex-col items-center py-20 px-4 md:px-8 w-full bg-white relative overflow-hidden">
      {/* Decorative light spotlights matching tech theme */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00b4d8]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#00b4d8]/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-[800px] mb-16 relative z-10 font-jakarta">
        <h2 className="font-jakarta font-extrabold xs:text-[44px] text-[32px] text-primary-dark leading-[54px] mb-4 tracking-tight">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
            {unitUsahaList.map((unit) => (
              <div
                key={unit.id}
                className={`group relative flex flex-col justify-between rounded-[28px] p-8 w-full max-w-[280px] transition-all duration-500 ease-out hover:-translate-y-2.5 ${unit.cardClass} ${
                  unit.isFeatured ? "min-h-[460px] lg:-translate-y-2" : "min-h-[430px]"
                }`}
              >
                {unit.glowEffect}

                <div>
                  {/* Header Info */}
                  <div className="mb-6">
                    <span className="text-[10px] font-extrabold text-[#00b4d8] uppercase tracking-widest block mb-2">
                      {unit.category}
                    </span>
                    <h4 className="font-jakarta font-extrabold text-[24px] text-primary-dark tracking-tight mb-1">
                      {unit.title}
                    </h4>
                    <p className="font-jakarta font-normal text-[12px] text-dimWhite min-h-[36px] leading-tight">
                      {unit.tagline}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className={`w-full font-jakarta font-extrabold text-[13px] py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mb-8 ${unit.btnClass}`}
                  >
                    <span>Hubungi Unit</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-100 mb-8" />

                  {/* Features list */}
                  <ul className="space-y-4">
                    {unit.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[12px] text-primary-dark font-semibold">
                        {/* Circle Checkmark Icon */}
                        <span className={`flex-shrink-0 w-4 h-4 rounded-full ${unit.checkBg} border ${unit.checkBorder} flex items-center justify-center mt-0.5`}>
                          <svg className={`w-2.5 h-2.5 ${unit.checkIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
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
            ))}
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
          <div className="w-full flex flex-col lg:flex-row gap-10 bg-slate-50/30 p-6 md:p-10 rounded-[32px] border border-gray-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-sm">
            
            {/* Left Column: Contact Cards */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="mb-4">
                <span className="text-[11px] font-extrabold text-[#00b4d8] uppercase tracking-[0.2em] block mb-2">
                  Dapatkan Bantuan
                </span>
                <h3 className="font-jakarta font-extrabold text-[32px] text-primary-dark tracking-tight leading-tight">
                  Mulai Rencana Proyek Digital Anda
                </h3>
                <p className="font-jakarta font-normal text-dimWhite text-[15px] leading-[24px] mt-3">
                  Konsultasikan kebutuhan teknologi, web development, aplikasi mobile, maupun solusi IoT bisnis Anda secara gratis dengan tim ahli HelioNexus.
                </p>
              </div>

              {/* Email Card */}
              <div className="flex items-center gap-4 bg-white/70 border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center bg-cyan-50 p-3.5 rounded-xl border border-cyan-100/50">
                  <svg className="w-6 h-6 text-[#00b4d8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-jakarta font-bold text-[12px] text-gray-400 uppercase tracking-wide">Email</h5>
                  <p className="font-jakarta font-bold text-[16px] text-primary-dark mt-0.5">info@itspku.ac.id</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-center gap-4 bg-white/70 border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center bg-cyan-50 p-3.5 rounded-xl border border-cyan-100/50">
                  <svg className="w-6 h-6 text-[#00b4d8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-jakarta font-bold text-[12px] text-gray-400 uppercase tracking-wide">Telepon</h5>
                  <p className="font-jakarta font-bold text-[16px] text-primary-dark mt-0.5">(0271) 734955</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-center gap-4 bg-white/70 border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center bg-cyan-50 p-3.5 rounded-xl border border-cyan-100/50">
                  <svg className="w-6 h-6 text-[#00b4d8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-jakarta font-bold text-[12px] text-gray-400 uppercase tracking-wide">Lokasi</h5>
                  <p className="font-jakarta font-bold text-[14px] text-primary-dark mt-0.5">Jl. Tulang Bawang Tengah No. 26, Kadipiro, Banjarsari, Surakarta</p>
                </div>
              </div>
            </div>

            {/* Right Column: Modern Contact Form */}
            <div className="flex-1 bg-white border border-gray-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                
                {/* Full Name Input */}
                <div className="flex flex-col space-y-1.5">
                  <label className="font-jakarta font-bold text-[11px] tracking-wider text-gray-400 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="font-jakarta font-medium text-[15px] text-primary-dark w-full bg-transparent border-b border-gray-200 focus:border-[#00b4d8] focus:outline-none py-2 transition-colors placeholder-gray-300"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col space-y-1.5">
                  <label className="font-jakarta font-bold text-[11px] tracking-wider text-gray-400 uppercase">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-jakarta font-medium text-[15px] text-primary-dark w-full bg-transparent border-b border-gray-200 focus:border-[#00b4d8] focus:outline-none py-2 transition-colors"
                  />
                </div>

                {/* Subject Input */}
                <div className="flex flex-col space-y-1.5">
                  <label className="font-jakarta font-bold text-[11px] tracking-wider text-gray-400 uppercase">
                    Subjek Proyek
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Web Development, Aplikasi IoT"
                    className="font-jakarta font-medium text-[15px] text-primary-dark w-full bg-transparent border-b border-gray-200 focus:border-[#00b4d8] focus:outline-none py-2 transition-colors placeholder-gray-300"
                  />
                </div>

                {/* Message TextArea */}
                <div className="flex flex-col space-y-1.5">
                  <label className="font-jakarta font-bold text-[11px] tracking-wider text-gray-400 uppercase">
                    Pesan Anda
                  </label>
                  <textarea
                    placeholder="Ceritakan kebutuhan proyek teknologi Anda secara rinci..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="font-jakarta font-normal text-[15px] text-primary-dark w-full bg-transparent border-b border-gray-200 focus:border-[#00b4d8] focus:outline-none py-2 resize-none placeholder-gray-300 transition-colors"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-primary-dark text-white hover:bg-black font-jakarta font-bold text-[15px] rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer hover:-translate-y-0.5"
                  >
                    Kirim Pesan Sekarang
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CardDeal;
