"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/utils/api";

type NewOrderForm = {
  customer_name: string;
  email: string;
  phone: string;
  package_select: string;
  package_custom_name: string;
  payment_term: string;
  amount: string;
  notes: string;
  work_start_date: string;
  work_end_date: string;
  spk_pdf_path: string;
};

const emptyOrderForm: NewOrderForm = {
  customer_name: "",
  email: "",
  phone: "",
  package_select: "Starter",
  package_custom_name: "",
  payment_term: "Lunas",
  amount: "",
  notes: "",
  work_start_date: "",
  work_end_date: "",
  spk_pdf_path: "",
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "chart"
    | "plus"
    | "logout"
    | "home"
    | "copy"
    | "trash"
    | "link"
    | "menu"
    | "close"
    | "edit"
    | "search"
    | "bell"
    | "user"
    | "cash"
    | "check";
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths = {
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-7" />
      </>
    ),
    cash: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M7 12h.01M17 12h.01" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <rect x="2" y="2" width="13" height="13" rx="2" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1.15 1.15" />
        <path d="M14 11a5 5 0 00-7.07 0l-2 2A5 5 0 0012 20.07l1.15-1.15" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0116 0" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9" />
      </>
    ),
  };

  return <svg {...common}>{paths[name as keyof typeof paths]}</svg>;
}

function Sidebar({
  open,
  onClose,
  onLogout,
  currentPath,
  collapsed,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentPath: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const itemBase =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 cursor-pointer";
  const itemActive = "bg-[#0077b6]/8 text-[#0077b6]";
  const itemInactive = "text-stone-500 hover:bg-stone-100/80 hover:text-stone-900";

  // Inline SVG logo icon (TubaTechno: Tulang + Bawang)
  const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sidebar_io_grad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f6ff" />
          <stop offset="45%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#0077b6" />
        </linearGradient>
        <linearGradient id="sidebar_io_bone_grad" x1="24" y1="18" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0096c7" />
          <stop offset="100%" stopColor="#023e8a" />
        </linearGradient>
        <linearGradient id="sidebar_io_arc_grad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f6ff" />
          <stop offset="100%" stopColor="#00b4d8" />
        </linearGradient>
      </defs>
      <path d="M 32 5 C 28 17, 8 25, 8 41 C 8 51, 18 58, 28 58 C 21 54, 15 46, 15 39 C 15 27, 27 16, 32 5 Z" fill="url(#sidebar_io_grad)" />
      <path d="M 32 5 C 36 17, 56 25, 56 41 C 56 51, 46 58, 36 58 C 43 54, 49 46, 49 39 C 49 27, 37 16, 32 5 Z" fill="url(#sidebar_io_grad)" />
      <path d="M 32 14 C 29 22, 18 28, 18 39 C 18 45, 22 50, 27 51" stroke="url(#sidebar_io_arc_grad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 32 14 C 35 22, 46 28, 46 39 C 46 45, 42 50, 37 51" stroke="url(#sidebar_io_arc_grad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="27" cy="23" r="4.2" fill="url(#sidebar_io_bone_grad)" />
      <circle cx="37" cy="23" r="4.2" fill="url(#sidebar_io_bone_grad)" />
      <circle cx="26" cy="46" r="4.6" fill="url(#sidebar_io_bone_grad)" />
      <circle cx="38" cy="46" r="4.6" fill="url(#sidebar_io_bone_grad)" />
      <path d="M 28 23 L 36 23 L 34.2 46 L 29.8 46 Z" fill="url(#sidebar_io_bone_grad)" />
      <rect x="30.5" y="27" width="3" height="15" rx="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="32" cy="34.5" r="3.2" fill="url(#sidebar_io_grad)" />
      <circle cx="32" cy="34.5" r="1.6" fill="#ffffff" />
      <circle cx="32" cy="5.5" r="2.2" fill="url(#sidebar_io_grad)" />
      <circle cx="32" cy="5.5" r="1.2" fill="#ffffff" />
    </svg>  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-[999] flex flex-col bg-white border-r border-stone-100 transition-all duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-[64px]" : "w-[272px]"}`}
      >
        {/* Logo area */}
        <div className={`flex h-[68px] items-center border-b border-stone-100 transition-all duration-300 ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}>
          {!collapsed && (
            <Link href="/admin/login" className="flex items-center gap-3 select-none">
              <LogoIcon />
              <div>
                <span className="block text-[15px] font-extrabold tracking-tight text-stone-900 leading-none">
                  Tuba<span className="text-[#00b4d8]">Techno</span>
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mt-0.5">
                  Admin Portal
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin/login" className="flex items-center justify-center select-none">
              <LogoIcon />
            </Link>
          )}
          <button
            className="hidden lg:flex rounded-xl p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 cursor-pointer transition-colors"
            onClick={onToggleCollapse}
            type="button"
            title={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
            </svg>
          </button>
          <button
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 lg:hidden cursor-pointer transition-colors"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-5 space-y-1">

          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Menu</p>
          )}

          <Link
            href="/admin/dashboard"
            className={`${itemBase} ${currentPath === "dashboard" ? itemActive : itemInactive} ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Dashboard" : undefined}
          >
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${currentPath === "dashboard" ? "bg-[#0077b6]/10 text-[#0077b6]" : "text-stone-400 group-hover:text-stone-600"}`}>
              <Icon name="chart" className="h-4 w-4" />
            </span>
            {!collapsed && "Dashboard"}
          </Link>

          <Link
            href="/admin/dashboard/input-order"
            className={`${itemBase} ${currentPath === "input-order" ? itemActive : itemInactive} ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Input Order Baru" : undefined}
          >
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${currentPath === "input-order" ? "bg-[#0077b6]/10 text-[#0077b6]" : "text-stone-400 group-hover:text-stone-600"}`}>
              <Icon name="plus" className="h-4 w-4" />
            </span>
            {!collapsed && "Input Order Baru"}
          </Link>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem("isAdmin", "true");
              window.dispatchEvent(new CustomEvent("admin-state-changed"));
              window.location.href = "/";
            }}
            className={`${itemBase} ${itemInactive} text-left w-full ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Edit CMS" : undefined}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-stone-400 group-hover:text-stone-600 transition-colors">
              <Icon name="edit" className="h-4 w-4" />
            </span>
            {!collapsed && "Edit CMS"}
          </button>

          <Link
            href="/"
            className={`${itemBase} ${itemInactive} ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Lihat Website" : undefined}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-stone-400 group-hover:text-stone-600 transition-colors">
              <Icon name="home" className="h-4 w-4" />
            </span>
            {!collapsed && "Lihat Website"}
          </Link>

          <div className="h-px bg-stone-100 mx-2 my-3" />

          {!collapsed && (
            <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Akun</p>
          )}

          <button
            type="button"
            onClick={onLogout}
            className={`${itemBase} ${itemInactive} text-left w-full hover:text-rose-600 hover:bg-rose-50/60 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Keluar" : undefined}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-stone-400 group-hover:text-rose-500 transition-colors">
              <Icon name="logout" className="h-4 w-4" />
            </span>
            {!collapsed && "Keluar"}
          </button>

        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-stone-100 px-5 py-4">
            <p className="text-[10px] text-stone-400 leading-relaxed">
              TubaTechno &copy; {new Date().getFullYear()}
            </p>
          </div>
        )}
      </aside>

      {open && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-[998] bg-stone-900/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}
    </>
  );
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function InputOrderPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputStep, setInputStep] = useState<"form" | "generating" | "success">("form");
  const [generatedLinkInfo, setGeneratedLinkInfo] = useState<{
    order_id: string;
    customer_name: string;
    phone: string;
    package_name: string;
    amount: number;
    payment_link: string;
  } | null>(null);
  const [newOrderForm, setNewOrderForm] = useState<NewOrderForm>(emptyOrderForm);
  const [uploadingSpk, setUploadingSpk] = useState(false);
  const [inputErrors, setInputErrors] = useState<Partial<NewOrderForm>>({});
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router, token]);

  const validateForm = () => {
    const errors: Partial<NewOrderForm> = {};

    if (!newOrderForm.customer_name.trim()) errors.customer_name = "Nama pelanggan wajib diisi";
    if (!newOrderForm.email.trim() || !/\S+@\S+\.\S+/.test(newOrderForm.email)) errors.email = "Email tidak valid";
    if (!newOrderForm.phone.trim()) errors.phone = "Nomor telepon wajib diisi";
    if (newOrderForm.package_select === "Kustom" && !newOrderForm.package_custom_name.trim()) {
      errors.package_custom_name = "Nama paket kustom wajib diisi";
    }
    if (!newOrderForm.amount.trim() || Number.isNaN(Number(newOrderForm.amount)) || Number(newOrderForm.amount) <= 0) {
      errors.amount = "Nominal harus lebih dari 0";
    }

    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSpkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Hanya berkas PDF yang diperbolehkan.");
      event.target.value = "";
      return;
    }

    setUploadingSpk(true);
    const formData = new FormData();
    formData.append("spk", file);

    try {
      const response = await fetch(getApiUrl("/api/orders/upload-spk"), {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success && data.filename) {
        setNewOrderForm((form) => ({ ...form, spk_pdf_path: data.filename }));
        alert("Berkas SPK PDF berhasil diunggah.");
      } else {
        alert(data.message || "Gagal mengunggah berkas.");
        event.target.value = "";
      }
    } catch {
      alert("Terjadi kesalahan koneksi saat mengunggah SPK.");
      event.target.value = "";
    } finally {
      setUploadingSpk(false);
    }
  };

  const handleInputOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !validateForm()) return;

    setSubmittingOrder(true);
    setInputStep("generating");

    try {
      const selectedPackageName =
        newOrderForm.package_select === "Kustom" ? newOrderForm.package_custom_name : newOrderForm.package_select;
      const finalPackageName = `${selectedPackageName} (${newOrderForm.payment_term})`;
      const rawAmount = Number(newOrderForm.amount);

      const orderResponse = await fetch(getApiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: newOrderForm.customer_name,
          email: newOrderForm.email,
          phone: newOrderForm.phone,
          package_name: finalPackageName,
          amount: rawAmount,
          notes: newOrderForm.notes,
          work_start_date: newOrderForm.work_start_date || null,
          work_end_date: newOrderForm.work_end_date || null,
          spk_pdf_path: newOrderForm.spk_pdf_path || null,
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Gagal menginput order.");
      }

      const createdOrderId = orderData.order_id;
      const paymentResponse = await fetch(getApiUrl("/api/payment/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: createdOrderId,
          customer_name: newOrderForm.customer_name,
          email: newOrderForm.email,
          phone: newOrderForm.phone,
          package_name: finalPackageName,
          amount: rawAmount,
        }),
      });
      const paymentData = await paymentResponse.json();

      if (paymentData.success && paymentData.redirect_url) {
        setGeneratedLinkInfo({
          order_id: createdOrderId,
          customer_name: newOrderForm.customer_name,
          phone: newOrderForm.phone,
          package_name: finalPackageName,
          amount: rawAmount,
          payment_link: paymentData.redirect_url,
        });
        setInputStep("success");
      } else {
        alert("Order berhasil dibuat, tetapi link pembayaran belum berhasil dibuat otomatis.");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan.");
      setInputStep("form");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link pembayaran berhasil disalin.");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new CustomEvent("admin-state-changed"));
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-[#0077b6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-stone-700">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} currentPath="input-order" collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((c) => !c)} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[64px]" : "lg:ml-[272px]"}`}>
        <header className="sticky top-0 z-[80] flex w-full border-b border-stone-100 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6 w-full">
            <div className="flex w-full items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
              <button
                type="button"
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 cursor-pointer flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Toggle Sidebar"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>

              {/* header title removed */}
            </div>

            <div className="flex w-full items-center justify-between gap-4 px-4 py-3 lg:w-auto lg:justify-end lg:px-0 lg:py-4">
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  Kembali ke Dashboard
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer flex-shrink-0"
                  title="Notifikasi Pembayaran"
                >
                  <Icon name="bell" className="h-5 w-5" />
                </Link>

                {/* User avatar only */}
                <div className="hidden h-10 w-10 sm:grid place-items-center rounded-full bg-stone-100 text-stone-600 border border-stone-200/40 flex-shrink-0">
                  <Icon name="user" className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-6 lg:p-8">
          <div className="rounded-2xl border border-stone-200/60 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-stone-100 px-8 py-6">
              <h2 className="text-xl font-bold text-stone-900">Formulir Pesanan Manual</h2>
              <p className="mt-1.5 text-sm text-stone-400">Buat tagihan client, unggah SPK PDF, dan generate Midtrans Snap billing secara langsung.</p>
            </div>

            {inputStep === "form" && (
              <form onSubmit={handleInputOrderSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Nama Pelanggan"
                    error={inputErrors.customer_name}
                    input={
                      <input
                        value={newOrderForm.customer_name}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, customer_name: event.target.value }))}
                        className="form-input"
                        placeholder="Masukkan nama lengkap client..."
                      />
                    }
                  />
                  <FormField
                    label="Email"
                    error={inputErrors.email}
                    input={
                      <input
                        type="email"
                        value={newOrderForm.email}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, email: event.target.value }))}
                        className="form-input"
                        placeholder="email@client.com"
                      />
                    }
                  />
                  <FormField
                    label="Nomor WhatsApp"
                    error={inputErrors.phone}
                    input={
                      <input
                        value={newOrderForm.phone}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, phone: event.target.value }))}
                        className="form-input"
                        placeholder="Contoh: 081234567890"
                      />
                    }
                  />
                  <FormField
                    label="Nominal Harga (IDR)"
                    error={inputErrors.amount}
                    input={
                      <input
                        type="number"
                        value={newOrderForm.amount}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, amount: event.target.value }))}
                        className="form-input"
                        placeholder="Contoh: 2500000"
                      />
                    }
                  />
                  <FormField
                    label="Paket Layanan"
                    error={inputErrors.package_select}
                    input={
                      <select
                        value={newOrderForm.package_select}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, package_select: event.target.value }))}
                        className="form-input cursor-pointer"
                      >
                        <option value="Starter">Starter (Sewa)</option>
                        <option value="Business">Business (Sewa)</option>
                        <option value="Enterprise">Enterprise (Sewa)</option>
                        <option value="Basic License">Basic License (Lifetime)</option>
                        <option value="Professional">Professional (Lifetime)</option>
                        <option value="Kustom">Kustom Paket...</option>
                      </select>
                    }
                  />
                  <FormField
                    label="Termin Pembayaran"
                    error={inputErrors.payment_term}
                    input={
                      <select
                        value={newOrderForm.payment_term}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, payment_term: event.target.value }))}
                        className="form-input cursor-pointer"
                      >
                        <option value="Lunas">Lunas</option>
                        <option value="DP">DP (Down Payment)</option>
                        <option value="Termin 1">Termin 1</option>
                        <option value="Termin 2">Termin 2</option>
                        <option value="Termin 3">Termin 3</option>
                      </select>
                    }
                  />
                  {newOrderForm.package_select === "Kustom" && (
                    <FormField
                      label="Nama Paket Kustom"
                      error={inputErrors.package_custom_name}
                      input={
                        <input
                          value={newOrderForm.package_custom_name}
                          onChange={(event) => setNewOrderForm((form) => ({ ...form, package_custom_name: event.target.value }))}
                          className="form-input"
                          placeholder="Nama paket kustom..."
                        />
                      }
                    />
                  )}
                  <FormField
                    label="Tanggal Mulai Kerja"
                    error={inputErrors.work_start_date}
                    input={
                      <input
                        type="date"
                        value={newOrderForm.work_start_date}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, work_start_date: event.target.value }))}
                        className="form-input cursor-pointer"
                      />
                    }
                  />
                  <FormField
                    label="Tanggal Selesai Kerja"
                    error={inputErrors.work_end_date}
                    input={
                      <input
                        type="date"
                        value={newOrderForm.work_end_date}
                        onChange={(event) => setNewOrderForm((form) => ({ ...form, work_end_date: event.target.value }))}
                        className="form-input cursor-pointer"
                      />
                    }
                  />
                  <FormField
                    label="Unggah Berkas PDF"
                    error={inputErrors.spk_pdf_path}
                    input={
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleSpkUpload}
                        disabled={uploadingSpk}
                        className="form-input file:mr-3 file:py-0.5 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-stone-200 file:text-stone-850 file:hover:bg-stone-300 file:cursor-pointer disabled:opacity-50"
                      />
                    }
                    helper={newOrderForm.spk_pdf_path ? "Berkas SPK berhasil terunggah." : uploadingSpk ? "Mengunggah berkas..." : undefined}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      label="Catatan Tambahan (Opsional)"
                      error={inputErrors.notes}
                      input={
                        <textarea
                          value={newOrderForm.notes}
                          onChange={(event) => setNewOrderForm((form) => ({ ...form, notes: event.target.value }))}
                          className="form-input min-h-24 resize-none"
                          placeholder="Tulis detail instruksi tambahan di sini..."
                        />
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0077b6] hover:bg-[#005f73] text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submittingOrder ? "Memproses Order..." : "Buat Order & Tautan Pembayaran"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOrderForm(emptyOrderForm);
                      setInputErrors({});
                    }}
                    className="px-5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            )}

            {inputStep === "generating" && (
              <div className="grid min-h-80 place-items-center p-10 text-center">
                <div>
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-100 border-t-[#0077b6]" />
                  <h3 className="mt-5 text-base font-bold text-stone-900">Memproses pesanan...</h3>
                  <p className="mt-2 text-xs text-stone-400">Sedang menyimpan data order dan meminta tautan pembayaran Midtrans.</p>
                </div>
              </div>
            )}

            {inputStep === "success" && generatedLinkInfo && (
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Icon name="check" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Pesanan Manual Berhasil Dibuat</h3>
                  <p className="mt-1 text-xs text-stone-400">ID Transaksi: {generatedLinkInfo.order_id}</p>
                </div>

                <div className="max-w-md mx-auto rounded-xl border border-stone-200/60 bg-stone-50/50 p-5 text-left text-xs space-y-2.5">
                  <p className="flex justify-between gap-4 border-b border-stone-200/40 pb-2">
                    <span className="text-stone-400">Pelanggan</span>
                    <strong className="text-stone-900">{generatedLinkInfo.customer_name}</strong>
                  </p>
                  <p className="flex justify-between gap-4 border-b border-stone-200/40 pb-2">
                    <span className="text-stone-400">Paket</span>
                    <strong className="text-stone-900">{generatedLinkInfo.package_name}</strong>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-stone-400">Total Tagihan</span>
                    <strong className="text-[#0077b6] text-sm">{formatRupiah(generatedLinkInfo.amount)}</strong>
                  </p>
                </div>

                <div className="max-w-md mx-auto grid gap-3 sm:grid-cols-2 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedLinkInfo.payment_link)}
                    className="h-11 rounded-lg bg-[#0077b6] hover:bg-[#005f73] text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Salin Link Pembayaran
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${generatedLinkInfo.phone.replace(/\D/g, "")}&text=${encodeURIComponent(
                      `Halo ${generatedLinkInfo.customer_name},\n\nBerikut link pembayaran resmi Midtrans untuk paket ${generatedLinkInfo.package_name} TubaTechno:\n\n${generatedLinkInfo.payment_link}\n\nTerima kasih.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 inline-flex items-center justify-center rounded-lg border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Kirim Link via WhatsApp
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputStep("form");
                      setGeneratedLinkInfo(null);
                      setNewOrderForm(emptyOrderForm);
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors animate-pulse"
                  >
                    Buat Transaksi Baru Lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FormField({
  label,
  input,
  error,
  helper,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</span>
      {input}
      {error ? <span className="mt-1 block text-[10px] font-semibold text-rose-600">{error}</span> : null}
      {helper ? <span className="mt-1 block text-[10px] font-semibold text-emerald-600">{helper}</span> : null}
    </label>
  );
}
