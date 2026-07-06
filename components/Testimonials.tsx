"use client";

import React, { useEffect, useState, useCallback } from "react";
import TestimonialForm from "./TestimonialForm";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
  created_at: string;
}

// ── Single testimonial card ───────────────────────────────────
const TestimonialCard: React.FC<{ t: Testimonial; delay: number }> = ({ t, delay }) => (
  <div
    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white border border-gray-100 hover:border-[#00b4d8]/30 hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden"
    style={{
      animationDelay: `${delay}ms`,
      boxShadow: "0 2px 16px rgba(0,4,15,0.06)",
    }}
  >
    {/* Left accent bar */}
    <div
      className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: "linear-gradient(180deg,#00b4d8,#0077b6)" }}
    />

    {/* Top row: quote icon + stars */}
    <div className="flex items-start justify-between mb-4">
      <svg width="28" height="20" viewBox="0 0 36 26" fill="none" className="opacity-30 flex-shrink-0">
        <path d="M0 26V16.12C0 11.63 1.064 8.04 3.192 5.36C5.384 2.62 8.576.8 12.768 0L14.4 3.68C11.89 4.23 9.896 5.36 8.408 7.08C6.984 8.8 6.272 10.9 6.272 13.376H12.768V26H0ZM20.992 26V16.12C20.992 11.63 22.056 8.04 24.184 5.36C26.376 2.62 29.568.8 33.76 0L35.392 3.68C32.89 4.23 30.888 5.36 29.4 7.08C27.976 8.8 27.264 10.9 27.264 13.376H33.76V26H20.992Z" fill="#00b4d8"/>
      </svg>
      {/* 5 stars — filled based on actual rating */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24"
            fill={s <= t.rating ? "#f59e0b" : "none"}
            stroke={s <= t.rating ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    </div>

    {/* Content */}
    <p className="font-poppins font-normal text-[14px] sm:text-[15px] leading-[24px] sm:leading-[26px] text-[#374151] flex-1 mb-6">
      {t.content}
    </p>

    {/* Author row */}
    <div className="flex flex-row items-center gap-3 pt-4 border-t border-gray-100">
      <div className="relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.name)}`}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover bg-gray-100 border-2 border-white"
          style={{ boxShadow: "0 2px 8px rgba(0,180,216,0.15)" }}
        />
        {/* Online dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
      </div>
      <div className="min-w-0">
        <h4 className="font-poppins font-semibold text-[14px] leading-tight text-primary-dark truncate">
          {t.name}
        </h4>
        <p className="font-poppins font-normal text-[12px] leading-[18px] text-dimWhite truncate">
          {t.title}
        </p>
      </div>
    </div>
  </div>
);


// ── Main Testimonials section ─────────────────────────────────
const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("http://localhost:5000/api/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return (
    <section id="clients" className="sm:py-16 py-10 flex flex-col relative">
      {/* Background gradient orb */}
      <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient pointer-events-none" />

      {/* Header row */}
      <div className="w-full flex justify-between items-end md:flex-row flex-col sm:mb-10 mb-8 relative z-[1] gap-6">
        <div>
          <h1 className="font-poppins font-semibold xs:text-[48px] text-[30px] text-primary-dark xs:leading-[76.8px] leading-[42px]">
            Apa Kata Mitra <br className="sm:block hidden" /> Tentang HelioNexus.
          </h1>
          <p className="font-poppins font-normal text-dimWhite text-[15px] sm:text-[17px] leading-[26px] sm:leading-[30px] max-w-[450px] mt-3">
            Testimoni nyata dari pelaku UMKM dan instansi yang telah mendigitalisasi operasional mereka bersama solusi teknologi kami.
          </p>
        </div>

        {/* CTA button */}
        <button
          onClick={() => setShowForm(true)}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-poppins font-semibold text-[14px] text-white bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#005f73] hover:to-[#0077b6] transition-all shadow-md shadow-[#00b4d8]/20 cursor-pointer whitespace-nowrap self-start md:self-auto"
          aria-label="Buka form kirim testimoni"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tulis Testimoni
        </button>
      </div>

      {/* Cards grid */}
      <div className="relative z-[1] w-full">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <svg className="animate-spin h-6 w-6 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-poppins text-[14px] text-dimWhite">Memuat testimoni...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <p className="font-poppins text-[14px] text-dimWhite">
              Tidak dapat memuat testimoni. Pastikan backend berjalan.
            </p>
            <button
              onClick={fetchTestimonials}
              className="font-poppins text-[13px] text-[#00b4d8] hover:underline cursor-pointer"
            >
              Coba lagi →
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-wrap gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} t={t} delay={i * 80} />
            ))}
            {testimonials.length === 0 && (
              <p className="font-poppins text-[14px] text-dimWhite py-8">
                Belum ada testimoni. Jadilah yang pertama!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Testimonial form modal */}
      {showForm && (
        <TestimonialForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchTestimonials}
        />
      )}
    </section>
  );
};

export default Testimonials;
