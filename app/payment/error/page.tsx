"use client";

import { Suspense } from "react";
import Link from "next/link";

function ErrorContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-poppins p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-slate-800 font-bold text-lg mb-1">Pembayaran Gagal</h3>
        <p className="text-slate-400 text-xs mb-6">Terjadi kesalahan saat memproses pembayaran. Silakan coba kembali beberapa saat lagi.</p>

        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096b4] hover:to-[#005f73] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#00b4d8]/10 text-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-poppins px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#00b4d8]" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
