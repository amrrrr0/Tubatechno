"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/utils/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  packagePrice: string;
  packageId?: number;
  amount: number;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function PaymentModal({
  isOpen,
  onClose,
  packageName,
  packagePrice,
  packageId,
  amount,
}: PaymentModalProps) {
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [orderId, setOrderId] = useState("");

  /* ── Reset saat ditutup ── */
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setForm({ name: "", email: "", phone: "", notes: "" });
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  /* ── Validasi form ── */
  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
    if (!form.phone.trim()) e.phone = "Nomor WhatsApp wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Kirim Pemesanan ── */
  const handlePay = async () => {
    if (!validate()) return;
    setStep("processing");

    try {
      // Buat data order di database
      const orderRes = await fetch(getApiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          email: form.email,
          phone: form.phone,
          package_id: packageId,
          package_name: packageName,
          amount,
          notes: form.notes,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error("Gagal membuat order");

      setOrderId(orderData.order_id);
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden font-jakarta text-slate-800">

        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-slate-800 font-bold text-lg">Formulir Pemesanan</h2>
            <p className="text-slate-500 text-xs mt-0.5">{packageName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">

          {/* ── Step: Form ── */}
          {step === "form" && (
            <>
              {/* Paket info */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-slate-800 font-bold text-sm">{packageName}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 uppercase tracking-wider font-semibold">Paket Pilihan</p>
                </div>
                <div className="text-right">
                  <p className="text-[#0077b6] font-extrabold text-base">{packagePrice}</p>
                  {amount > 0 && <p className="text-slate-400 text-xs mt-0.5">{formatRupiah(amount)}</p>}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                {[
                  { key: "name", label: "Nama Lengkap", type: "text", placeholder: "Nama Anda..." },
                  { key: "email", label: "Email Aktif", type: "email", placeholder: "email@domain.com" },
                  { key: "phone", label: "Nomor WhatsApp", type: "tel", placeholder: "08xxxxxxxxxx" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-slate-600 text-xs font-bold mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all ${
                        errors[key as keyof typeof form]
                          ? "border-rose-300 focus:border-rose-500"
                          : "border-slate-200 focus:border-[#00b4d8]/40"
                      }`}
                    />
                    {errors[key as keyof typeof form] && (
                      <p className="text-rose-500 text-xs mt-1">{errors[key as keyof typeof form]}</p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1.5 uppercase tracking-wide">Catatan Kebutuhan (Opsional)</label>
                  <textarea
                    placeholder="Tulis instruksi khusus atau kustomisasi di sini..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#00b4d8]/40 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handlePay}
                className="w-full mt-6 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096b4] hover:to-[#005f73] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#00b4d8]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Kirim Pemesanan
              </button>
              <p className="text-center text-slate-400 text-[11px] mt-3">
                *Pesanan Anda akan langsung diverifikasi dan dihubungi oleh Admin
              </p>
            </>
          )}

          {/* ── Step: Processing ── */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <svg className="animate-spin h-10 w-10 text-[#00b4d8]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-slate-700 font-bold text-sm">Sedang mengirim pesanan...</p>
              <p className="text-slate-400 text-xs">Mohon tunggu sebentar</p>
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Pemesanan Berhasil!</h3>
                <p className="text-slate-500 text-xs">
                  ID Pesanan: <code className="text-[#0077b6] font-bold bg-[#00b4d8]/10 px-2 py-0.5 rounded">{orderId}</code>
                </p>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed max-w-sm">
                  Terima kasih. Pesanan Anda telah tersimpan di sistem. Admin kami akan segera memverifikasi data Anda dan mengirimkan **Link Pembayaran Resmi** melalui WhatsApp atau Email.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-2.5 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white font-bold rounded-xl hover:-translate-y-0.5 transition-all shadow-md shadow-[#00b4d8]/10 text-sm"
              >
                Selesai
              </button>
            </div>
          )}

          {/* ── Step: Error ── */}
          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Gagal Mengirim Pesanan</h3>
                <p className="text-slate-400 text-xs">Ada kendala koneksi, silakan coba kirim ulang.</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("form")}
                  className="px-5 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all text-xs"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-slate-400 text-xs font-semibold hover:text-slate-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
