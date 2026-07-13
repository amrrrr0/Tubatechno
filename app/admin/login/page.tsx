"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Cek jika sudah login
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) setLoggedIn(true);
  }, []);

  // Keyboard input listener untuk PIN
  useEffect(() => {
    if (loggedIn || loading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      } else if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (key === "Escape" || key === "Delete") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loggedIn, loading]);

  const handleKeyPress = (num: string) => {
    setError("");
    setPin((prev) => {
      if (prev.length < 4) {
        return prev + num;
      }
      return prev;
    });
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  // Submit otomatis saat PIN mencapai 4 digit
  useEffect(() => {
    if (pin.length === 4) {
      submitPin(pin);
    }
  }, [pin]); // eslint-disable-line

  const submitPin = async (enteredPin: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: enteredPin }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setLoggedIn(true);
      } else {
        setError(data.message || "PIN yang dimasukkan salah.");
        setPin("");
      }
    } catch {
      setError("Gagal terhubung ke server.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLoggedIn(false);
    setPin("");
  };

  const handleEditCms = () => {
    localStorage.setItem("isAdmin", "true");
    window.dispatchEvent(new CustomEvent("admin-state-changed"));
    router.push("/");
  };

  /* ── Setelah login: tampilkan 2 pilihan (TEMA TERANG) ── */
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f9fc] via-white to-white flex items-center justify-center p-6 font-poppins">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#0077b6] flex items-center justify-center shadow-md shadow-[#00b4d8]/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-slate-800 font-extrabold text-[22px] tracking-tight">HelioNexus</span>
            </div>
            <p className="text-slate-500 text-sm">Selamat datang, Admin. Silakan pilih menu manajemen:</p>
          </div>

          {/* Cards pilihan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {/* Pilihan 1: Edit CMS */}
            <button
              onClick={handleEditCms}
              className="text-left group relative bg-white border border-slate-100 hover:border-[#00b4d8]/40 rounded-3xl p-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,180,216,0.08)] hover:-translate-y-1 w-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00b4d8]/10 text-[#00b4d8] flex items-center justify-center mb-5 group-hover:bg-[#00b4d8] group-hover:text-white transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-1.5">Edit CMS</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Kelola konten visual, teks berita, testimoni, paket harga, dan informasi unit bisnis.
              </p>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </button>

            {/* Pilihan 2: Admin Dashboard */}
            <a
              href="/admin/dashboard"
              className="group relative bg-white border border-slate-100 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:-translate-y-1 block"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-1.5">Admin Dashboard</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Laporan penjualan, rekapitulasi transaksi, ekspor data CSV, dan integrasi payment gateway.
              </p>
              <span className="absolute top-5 right-5 text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                UPDATE
              </span>
            </a>
          </div>

          {/* Logout */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
            >
              Keluar dari Sesi Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form Login PIN (TEMA TERANG) ── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fc] via-white to-white flex items-center justify-center p-6 font-poppins relative">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#0077b6] flex items-center justify-center shadow-md shadow-[#00b4d8]/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-slate-800 font-extrabold text-[22px] tracking-tight">HelioNexus</span>
          </div>
          <h1 className="text-slate-800 font-bold text-lg">Akses Pengelola</h1>
          <p className="text-slate-400 text-xs mt-1">Masukkan 4-digit PIN untuk melanjutkan</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 flex flex-col items-center">
          
          {/* PIN Indicators */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  pin.length > index
                    ? "bg-[#00b4d8] border-[#00b4d8] scale-110"
                    : "bg-slate-50 border-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-6 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center gap-2">
              <span className="text-rose-600 text-xs font-medium">{error}</span>
            </div>
          )}

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                disabled={loading}
                className="w-16 h-16 rounded-full bg-slate-50 hover:bg-[#00b4d8]/10 hover:text-[#00b4d8] text-slate-700 font-bold text-xl flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="w-16 h-16 rounded-full text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50"
            >
              HAPUS
            </button>
            {/* 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress("0")}
              disabled={loading}
              className="w-16 h-16 rounded-full bg-slate-50 hover:bg-[#00b4d8]/10 hover:text-[#00b4d8] text-slate-700 font-bold text-xl flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50"
            >
              0
            </button>
            {/* Backspace */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-16 h-16 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-6">
          HelioNexus Pengelola © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
