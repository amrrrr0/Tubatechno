"use client";

import { useEffect, useState } from "react";

export default function AdminFloatingBar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Sync initial state
    setIsAdmin(localStorage.getItem("isAdmin") === "true");

    const handleSync = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };

    window.addEventListener("admin-state-changed", handleSync);
    return () => window.removeEventListener("admin-state-changed", handleSync);
  }, []);

  const handleExit = () => {
    if (confirm("Keluar dari Mode Edit CMS?")) {
      localStorage.removeItem("isAdmin");
      setIsAdmin(false);
      window.dispatchEvent(new CustomEvent("admin-state-changed"));
      window.location.reload();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] w-[90%] max-w-xl animate-bounce-subtle">
      <div className="bg-white/95 border border-[#00b4d8]/30 backdrop-blur-xl rounded-2xl px-5 py-3.5 shadow-2xl flex items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00b4d8] animate-pulse" />
          <div>
            <p className="text-slate-800 text-xs font-bold font-poppins tracking-wide uppercase">Mode Edit CMS Aktif</p>
            <p className="text-slate-400 text-[10px] hidden sm:block">Kelola teks/gambar langsung di halaman ini</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href="/admin/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#00b4d8]/10 border border-slate-200 text-slate-700 font-poppins font-bold text-xs transition-all flex items-center gap-1.5 hover:text-[#00b4d8]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </a>
          <button
            onClick={handleExit}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-poppins font-bold text-xs transition-all"
          >
            Keluar Edit
          </button>
        </div>
      </div>
    </div>
  );
}
