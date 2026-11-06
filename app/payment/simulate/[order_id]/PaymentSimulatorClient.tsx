"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiUrl } from "@/utils/api";

interface OrderData {
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  package_name: string;
  amount: number;
  status: "pending" | "paid" | "processing" | "cancelled" | "expired" | "deny";
  payment_method: string | null;
  created_at: string;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const PAYMENT_CATEGORIES = [
  {
    id: "va",
    name: "Transfer Virtual Account",
    methods: [
      { id: "BCA VA", name: "BCA Virtual Account", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg", code: "98765" },
      { id: "Mandiri VA", name: "Mandiri Virtual Account", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg", code: "89622" },
      { id: "BNI VA", name: "BNI Virtual Account", logo: "https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg", code: "90234" },
      { id: "BRI VA", name: "BRI Virtual Account", logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg", code: "80211" },
    ]
  },
  {
    id: "ewallet",
    name: "E-Wallet & QRIS",
    methods: [
      { id: "QRIS", name: "QRIS / QR GPN", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" },
      { id: "GoPay", name: "GoPay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" },
      { id: "ShopeePay", name: "ShopeePay", logo: "https://upload.wikimedia.org/wikipedia/commons/e/fe/ShopeePay_logo.svg" },
    ]
  },
  {
    id: "cc",
    name: "Kartu Kredit",
    methods: [
      { id: "Credit Card", name: "Visa / Mastercard / JCB", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" }
    ]
  }
];

export default function PaymentSimulatorClient() {
  const params = useParams();
  const orderId = (params?.order_id as string) || "preview";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // State navigasi di simulator
  const [selectedMethod, setSelectedMethod] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>("va");

  const fetchOrderInfo = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/payment/simulate-info/${orderId}`));
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || "Order tidak ditemukan.");
      }
    } catch {
      setError("Gagal memuat informasi simulasi pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && orderId !== "preview") {
      fetchOrderInfo();
    } else {
      setLoading(false);
    }
  }, [orderId]); // eslint-disable-line

  const handleSimulatePayment = async (status: "success" | "fail", methodName?: string) => {
    setProcessing(true);
    try {
      const res = await fetch(getApiUrl("/api/payment/simulate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          status,
          payment_method: status === "success" ? (methodName || "SIMULATOR_BANK") : null
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          status === "success"
            ? `Pembayaran sukses disimulasikan menggunakan ${methodName || "Bank"}!`
            : "Transaksi berhasil dibatalkan."
        );
        setSelectedMethod(null);
        fetchOrderInfo();
      } else {
        alert("Gagal melakukan simulasi: " + data.message);
      }
    } catch {
      alert("Gagal terhubung ke server simulasi.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-jakarta">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-slate-500 text-sm">Menghubungkan gerbang pembayaran...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-jakarta p-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-sm text-center shadow-xl shadow-slate-100/50">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-slate-800 font-bold text-base mb-2">Pemesanan Tidak Ditemukan</h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">{error || "Pemesanan tidak valid."}</p>
          <a href="/" className="px-6 py-2.5 bg-[#00b4d8] text-white hover:bg-[#0096b4] rounded-xl text-xs font-bold transition-all inline-block shadow-md shadow-[#00b4d8]/10">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-jakarta p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden text-slate-800">
        
        {/* Banner Gerbang Pembayaran Simulasi */}
        <div className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white px-6 py-5 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide block">SANDBOX GATEWAY</span>
              <span className="text-[10px] opacity-85 uppercase font-bold tracking-wider">Metode Pembayaran</span>
            </div>
          </div>
          <span className="text-[9px] font-extrabold bg-white/25 border border-white/30 text-white px-2.5 py-0.5 rounded-full tracking-wider">
            LOCAL MOCK
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {/* Success Status Alert */}
          {successMessage && (
            <div className="mb-6 px-4 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-xs font-semibold leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Rincian Tagihan */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Order ID</span>
              <code className="text-[#0077b6] font-bold bg-[#00b4d8]/10 px-2 py-0.5 rounded text-[10px]">{order.order_id}</code>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Pelanggan</span>
              <span className="text-slate-800 font-bold">{order.customer_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Layanan/Paket</span>
              <span className="text-slate-800 font-semibold truncate max-w-[200px]">{order.package_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2 mt-2">
              <span className="text-slate-500 font-bold">Total Pembayaran</span>
              <span className="text-[#0077b6] font-extrabold text-base">{formatRupiah(order.amount)}</span>
            </div>
          </div>

          {/* STATUS PAYMENT SUDAH DI-BAYAR/BATAL */}
          {order.status !== "pending" ? (
            <div className="text-center py-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                order.status === "paid"
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-500"
                  : "bg-rose-50 border border-rose-100 text-rose-500"
              }`}>
                {order.status === "paid" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              <h4 className="font-extrabold text-slate-800 text-base mb-1">
                {order.status === "paid" ? "Pembayaran Sukses!" : "Transaksi Dibatalkan"}
              </h4>
              <p className="text-slate-400 text-xs mb-6">
                Metode: <strong className="text-slate-600 uppercase font-bold">{order.payment_method || "Simulasi"}</strong>
              </p>
              <button
                onClick={() => window.close()}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
              >
                Tutup Halaman Pembayaran
              </button>
            </div>
          ) : (
            /* MODAL JIKA PENDING (PROSES CHECKOUT) */
            <>
              {/* JIKA BELUM PILIH METODE */}
              {!selectedMethod ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Pilih Cara Pembayaran</h3>
                  <div className="space-y-4">
                    {PAYMENT_CATEGORIES.map(category => (
                      <div key={category.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                        {/* Category Header */}
                        <button
                          onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                          className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-left text-xs font-bold text-slate-600 transition-colors"
                        >
                          {category.name}
                          <svg
                            className={`transform transition-transform duration-200 ${activeCategory === category.id ? "rotate-180" : ""}`}
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {/* Category Methods */}
                        {activeCategory === category.id && (
                          <div className="divide-y divide-slate-100">
                            {category.methods.map(method => (
                              <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method)}
                                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-8 bg-white rounded border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden">
                                    <img src={method.logo} alt={method.name} className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-700">{method.name}</span>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Batal Button */}
                  <button
                    onClick={() => handleSimulatePayment("fail")}
                    className="w-full mt-6 py-3 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Batalkan Transaksi Ini
                  </button>
                </div>
              ) : (
                /* JIKA SUDAH PILIH METODE (DETAIL PEMBAYARAN SIMULASI) */
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <button
                      onClick={() => setSelectedMethod(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Metode Pilihan</span>
                      <span className="text-slate-800 font-extrabold text-sm">{selectedMethod.name}</span>
                    </div>
                  </div>

                  {/* VIRTUAL ACCOUNT VIEW */}
                  {selectedMethod.code && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                        <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Nomor Virtual Account</span>
                        <code className="text-[#0077b6] text-xl font-extrabold tracking-wider">{selectedMethod.code}{order.phone ? order.phone.slice(-6) : "123456"}</code>
                        <span className="text-[10px] text-slate-400 block mt-2">Gunakan nomor VA di atas untuk simulasi transfer</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 space-y-2 px-1">
                        <p className="font-bold text-slate-700">Instruksi Transfer:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Buka Mobile/Internet Banking Anda (Simulasi).</li>
                          <li>Pilih menu **Transfer ke Virtual Account**.</li>
                          <li>Masukkan nomor virtual account di atas.</li>
                          <li>Konfirmasi nominal pembayaran sebesar **{formatRupiah(order.amount)}**.</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* QRIS VIEW */}
                  {selectedMethod.id === "QRIS" && (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-48 h-48 border border-slate-200 rounded-2xl p-3 bg-white shadow-inner flex items-center justify-center relative">
                        <div className="w-full h-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="1.5">
                            <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/>
                            <rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>
                            <path d="M10 5h4M5 10h4M10 14h4"/>
                          </svg>
                        </div>
                        <span className="absolute bottom-2 text-[8px] font-extrabold text-slate-400 tracking-wider">TUBAPAY QRIS</span>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Pindai kode QRIS di atas melalui aplikasi e-wallet atau m-banking Anda untuk menyelesaikan pembayaran.
                      </p>
                    </div>
                  )}

                  {/* GOPAY / SHOPEEPAY VIEW */}
                  {(selectedMethod.id === "GoPay" || selectedMethod.id === "ShopeePay") && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#00b4d8]/10 text-[#0077b6] flex items-center justify-center mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <h4 className="text-xs font-bold text-slate-700">Membuka Aplikasi {selectedMethod.name}...</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Sistem akan mengarahkan Anda ke aplikasi {selectedMethod.name} terinstall untuk menyelesaikan pemindaian sidik jari/PIN pembayaran.
                      </p>
                    </div>
                  )}

                  {/* CREDIT CARD VIEW */}
                  {selectedMethod.id === "Credit Card" && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kartu (Simulasi)</label>
                          <input type="text" value="4111 2222 3333 4444" disabled className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Masa Berlaku</label>
                            <input type="text" value="12 / 29" disabled className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                            <input type="text" value="123" disabled className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTION TRIGGER PAYMENT SIMULATION */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSimulatePayment("success", selectedMethod.name)}
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {processing ? (
                        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Simulasikan Bayar Lunas ({selectedMethod.id})
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedMethod(null)}
                      disabled={processing}
                      className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold text-center transition-colors"
                    >
                      Kembali ke Pilihan Pembayaran
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
            TubaTechno Technology Center · Sandbox Mode
          </p>
        </div>
      </div>
    </div>
  );
}
