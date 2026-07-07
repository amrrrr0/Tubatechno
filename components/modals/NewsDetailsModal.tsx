"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string | null;
  status: string;
  views: number;
  published_at: string | null;
  created_at: string;
}

interface Props {
  news: NewsItem;
  onClose: () => void;
}

const NewsDetailsModal: React.FC<Props> = ({ news, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock background scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const publishDate = news.published_at
    ? new Date(news.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(news.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const keywordsArray = news.seo_keywords
    ? news.seo_keywords.split(",").map((k) => k.trim())
    : [];

  const titleLength = news.seo_title.length;
  const descLength = news.seo_description.length;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col scrollbar-thin bg-white"
        style={{
          boxShadow: "0 32px 80px rgba(0,4,15,0.25), 0 0 0 1px rgba(0,180,216,0.12)",
          animation: "cardRise 360ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header Image or Gradient Background */}
        <div className="relative w-full h-[220px] bg-slate-900 overflow-hidden flex-shrink-0">
          <img
            src={news.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"}
            alt={news.title}
            className="w-full h-full object-cover opacity-80"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />

          {/* Close button inside image header */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/80 transition-all cursor-pointer font-bold"
            aria-label="Tutup"
            style={{ fontSize: "18px", lineHeight: 1 }}
          >
            ×
          </button>

          {/* Title and metadata over image bottom */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className={`inline-block px-2.5 py-0.5 rounded-full font-poppins font-semibold text-[10px] uppercase tracking-wider mb-2 text-white ${
              news.status === "published" ? "bg-emerald-500" : "bg-amber-500"
            }`}>
              {news.status === "published" ? "Published" : "Draft"}
            </span>
            <h1 className="font-poppins font-bold text-[18px] sm:text-[22px] leading-tight text-white drop-shadow-md">
              {news.title}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 sm:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-500 font-poppins border-b border-gray-100 pb-3 flex-shrink-0">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Penulis: <strong className="text-gray-800">{news.author}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {publishDate}
            </span>
          </div>

          {/* Article Text Content */}
          <p className="font-poppins text-[14px] sm:text-[15px] leading-[26px] text-gray-700 whitespace-pre-line flex-1">
            {news.content}
          </p>

          {/* SEO Metadata Insight Panel */}
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-[#e0f7fa] rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-[14px] text-primary-dark uppercase tracking-wider">
                SEO Search Engine Optimization Preview
              </h3>
            </div>

            {/* Google Search Snippet Simulation */}
            <div className="bg-white border border-gray-150 p-4 rounded-xl mb-4 shadow-sm">
              <span className="font-poppins text-[11px] text-gray-400 block mb-1">
                Google Search Result Preview:
              </span>
              <div className="text-[14px] leading-tight text-[#1a0dab] font-sans hover:underline cursor-pointer font-medium mb-0.5 truncate">
                {news.seo_title}
              </div>
              <div className="text-[12px] text-[#006621] font-sans truncate mb-1">
                https://helionexus.co.id/news/{news.slug}
              </div>
              <p className="text-[13px] leading-snug text-[#545454] font-sans font-normal line-clamp-2">
                {news.seo_description}
              </p>
            </div>

            {/* Technical SEO Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] font-poppins text-gray-600 mb-3">
              <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-lg border border-slate-100">
                <span>Meta Title Length:</span>
                <span className={`font-semibold ${titleLength > 60 ? "text-amber-500" : "text-emerald-500"}`}>
                  {titleLength} chars {titleLength > 60 ? "⚠️" : "✓"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-lg border border-slate-100">
                <span>Meta Description Length:</span>
                <span className={`font-semibold ${descLength > 160 ? "text-amber-500" : "text-emerald-500"}`}>
                  {descLength} chars {descLength > 160 ? "⚠️" : "✓"}
                </span>
              </div>
            </div>

            {/* Keywords */}
            {keywordsArray.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="font-poppins text-[11px] text-gray-400 mr-1.5">SEO Keywords:</span>
                {keywordsArray.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#e0f7fa]/60 text-[#0077b6] text-[10px] font-poppins border border-[#00b4d8]/10"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[11px] font-poppins text-gray-400 italic pt-1">
                Tidak ada meta keyword tambahan yang ditentukan.
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-poppins font-semibold text-[13px] text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewsDetailsModal;
