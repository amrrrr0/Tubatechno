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

    // Master fallback PIN '2026', '1234', '0000'
    if (["2026", "1234", "0000"].includes(enteredPin)) {
      try {
        const res = await fetch(getApiUrl("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: enteredPin }),
        });
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem("admin_token", data.token);
          setLoggedIn(true);
          setLoading(false);
          return;
        }
      } catch {
        // Backend offline fallback
      }
      localStorage.setItem("admin_token", "static_admin_token_tubatechno");
      setLoggedIn(true);
      setLoading(false);
      return;
    }

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
        setError(data.message || "PIN yang dimasukkan salah. (Default: 0000)");
        setPin("");
      }
    } catch {
      setError("Server backend tidak terhubung. Gunakan PIN master '0000'.");
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

  /* ── Setelah login: tampilkan 2 pilihan (Putih Tulang / White-Blue) ── */
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-jakarta">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-slate-900 font-extrabold text-[24px] tracking-tight">
                Tuba<span className="text-[#00b4d8]">Techno</span>
              </span>
            </div>
            <p className="text-slate-600 text-sm">Selamat datang di Panel Pengelola. Silakan tentukan tujuan:</p>
          </div>

          {/* Cards pilihan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {/* Pilihan 1: Edit CMS */}
            <button
              onClick={handleEditCms}
              className="text-left group relative bg-white border border-slate-200/90 hover:border-[#00b4d8]/50 rounded-2xl p-6 transition-all duration-200 shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md hover:-translate-y-0.5 w-full cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0077b6] flex items-center justify-center mb-4 group-hover:bg-[#0077b6] group-hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-[16px] mb-1.5">Mode Edit CMS</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed">
                Kelola konten visual, teks berita, portofolio proyek, paket harga, dan rilis artikel.
              </p>
              <div className="absolute top-5 right-5 text-slate-400 group-hover:text-[#0077b6] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </button>

            {/* Pilihan 2: Admin Dashboard */}
            <a
              href="/admin/dashboard"
              className="group relative bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 shadow-[0_2px_12px_rgba(0,119,182,0.03)] hover:shadow-md hover:-translate-y-0.5 block"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-[16px] mb-1.5">Dashboard Transaksi</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed">
                Laporan pesanan masuk, rekapitulasi pembayaran, ekspor berkas, dan manajemen klien.
              </p>
              <div className="absolute top-5 right-5 text-slate-400 group-hover:text-emerald-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </a>
          </div>

          {/* Logout */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              Keluar dari Sesi Pengelola
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form Login PIN (Putih Tulang / White-Blue) ── */
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-jakarta relative">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 select-none">
            <span className="text-slate-900 font-extrabold text-[24px] tracking-tight">
              Tuba<span className="text-[#00b4d8]">Techno</span>
            </span>
          </div>
          <h1 className="text-slate-900 font-bold text-[17px]">Akses Pengelola</h1>
          <p className="text-slate-600 text-[13px] mt-0.5">Masukkan 4-digit PIN keamanan (default: 0000)</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,119,182,0.04)] flex flex-col items-center">
          
          {/* PIN Indicators */}
          <div className="flex justify-center gap-3.5 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                  pin.length > index
                    ? "bg-[#00b4d8] border-[#00b4d8] scale-110"
                    : "bg-slate-100 border-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-rose-600 text-xs font-medium">{error}</span>
            </div>
          )}

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                disabled={loading}
                className="w-16 h-16 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-[#0077b6] font-semibold text-lg flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50 border border-slate-200/60 cursor-pointer"
              >
                {num}
              </button>
            ))}
            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="w-16 h-16 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50 cursor-pointer"
            >
              HAPUS
            </button>
            {/* 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress("0")}
              disabled={loading}
              className="w-16 h-16 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 hover:text-[#0077b6] font-semibold text-lg flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50 border border-slate-200/60 cursor-pointer"
            >
              0
            </button>
            {/* Backspace */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-16 h-16 rounded-xl text-slate-500 hover:text-slate-700 flex items-center justify-center active:scale-95 transition-all select-none disabled:opacity-50 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-[11px] mt-6">
          TubaTechno Pengelola &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
