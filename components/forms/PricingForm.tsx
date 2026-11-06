"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getApiUrl } from "@/utils/api";

interface PricingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editData?: {
    id: number;
    name: string;
    price: string;
    original_price?: string;
    period: string;
    billing_type: "monthly" | "annual" | "lifetime";
    features: string[];
    is_popular: boolean;
  } | null;
}

const PricingForm: React.FC<PricingFormProps> = ({ isOpen, onClose, onSave, editData }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [period, setPeriod] = useState("");
  const [billingType, setBillingType] = useState<"monthly" | "annual" | "lifetime">("monthly");
  const [isPopular, setIsPopular] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPrice(editData.price);
      setOriginalPrice(editData.original_price || "");
      setPeriod(editData.period || "");
      setBillingType(editData.billing_type);
      setIsPopular(editData.is_popular);
      setFeatures(editData.features.length > 0 ? [...editData.features] : [""]);
    } else {
      setName("");
      setPrice("");
      setOriginalPrice("");
      setPeriod("");
      setBillingType("monthly");
      setIsPopular(false);
      setFeatures([""]);
    }
    setError("");
  }, [editData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, ""]);
  
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || features.every(f => !f.trim())) {
      setError("Nama, Harga, dan minimal 1 Fitur wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      price: price.trim(),
      original_price: originalPrice.trim(),
      period: period.trim(),
      billing_type: billingType,
      is_popular: isPopular,
      features: features.filter(f => f.trim() !== "")
    };

    try {
      const url = editData ? getApiUrl(`/api/pricing/${editData.id}`) : getApiUrl("/api/pricing");
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan.");

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-jakarta font-bold text-[18px] text-primary-dark">
            {editData ? "Edit Paket Harga" : "Tambah Paket Harga Baru"}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-[14px] font-medium flex items-start gap-3">
              <svg width="20" height="20" className="shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form id="pricing-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Nama Paket <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Starter, Business, Enterprise"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Tipe Tagihan <span className="text-rose-500">*</span></label>
                <select
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                >
                  <option value="monthly">Sewa Bulanan</option>
                  <option value="annual">Sewa Tahunan</option>
                  <option value="lifetime">Beli Putus (Lifetime)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Harga <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Misal: Rp299.000 atau Custom"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Harga Normal (Dicoret) <span className="text-slate-400 font-normal">(Opsional)</span></label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Misal: Rp499.000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Periode <span className="text-slate-400 font-normal">(Opsional)</span></label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Misal: /bulan, /sekali bayar"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Daftar Fitur <span className="text-rose-500">*</span></label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Fitur ${index + 1}`}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                    />
                    {features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(index)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFeature} className="mt-3 text-[13px] font-semibold text-[#00b4d8] hover:text-[#0096b4] flex items-center gap-1.5 transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Fitur
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none ${isPopular ? 'bg-indigo-500' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPopular ? 'translate-x-2.5' : '-translate-x-2.5'}`} />
              </button>
              <label className="text-[13px] font-medium text-slate-700 cursor-pointer" onClick={() => setIsPopular(!isPopular)}>
                Tandai sebagai Paket Paling Diminati (Beri label & warna khusus)
              </label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl font-jakarta font-medium text-[13px] text-slate-600 hover:bg-slate-200 transition-colors">
            Batal
          </button>
          <button type="submit" form="pricing-form" disabled={loading} className="px-6 py-2.5 rounded-xl font-jakarta font-bold text-[13px] text-white bg-[#00b4d8] hover:bg-[#0096b4] shadow-md shadow-[#00b4d8]/20 transition-all flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : "Simpan Paket"}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  return null;
};

export default PricingForm;
