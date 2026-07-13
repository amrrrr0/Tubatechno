"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getApiUrl } from "@/utils/api";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  
  const [syncing, setSyncing] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID tidak ditemukan di URL.");
      setSyncing(false);
      return;
    }

    const syncPayment = async () => {
      try {
        // Sync status via backend (with redirect params for query fallback)
        const res = await fetch(getApiUrl(`/api/payment/sync/${orderId}?${searchParams.toString()}`));
        const data = await res.json();
        
        if (data.success) {
          setStatus(data.status);
          
          // Fetch order details for display
          const orderRes = await fetch(getApiUrl(`/api/payment/simulate-info/${orderId}`));
          const orderData = await orderRes.json();
          if (orderData.success) {
            setOrder(orderData.data);
          }
        } else {
          setError(data.message || "Gagal sinkronisasi status pembayaran.");
        }
      } catch (err) {
        setError("Terjadi kesalahan koneksi saat memproses status.");
      } finally {
        setSyncing(false);
      }
    };

    void syncPayment();
  }, [orderId]);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  if (syncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-poppins px-4">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-500 font-medium text-sm">Memverifikasi pembayaran Anda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-poppins p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden text-slate-800 p-6 flex flex-col items-center text-center">
        
        {error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-slate-800 font-bold text-lg mb-2">Sinkronisasi Tertunda</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              {error}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-slate-800 font-bold text-lg mb-1">Pembayaran Berhasil!</h3>
            <p className="text-slate-400 text-xs mb-6">Terima kasih atas pembayaran Anda.</p>

            {order && (
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Order ID</span>
                  <span className="text-slate-800 font-bold">{order.order_id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Pelanggan</span>
                  <span className="text-slate-800 font-semibold">{order.customer_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Layanan/Paket</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[200px]">{order.package_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2 mt-2">
                  <span className="text-slate-500 font-bold">Total Terbayar</span>
                  <span className="text-[#0077b6] font-extrabold text-base">{formatRupiah(order.amount)}</span>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096b4] hover:to-[#005f73] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#00b4d8]/10 text-center"
          >
            Kembali ke Beranda
          </Link>
          {order && (
            <button
              onClick={() => router.push(`/admin/dashboard`)}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center"
            >
              Ke Dashboard Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-poppins px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#00b4d8]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
