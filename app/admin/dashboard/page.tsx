"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/utils/api";

interface Stats {
  total_orders: number;
  total_revenue: number;
  pending: number;
  paid: number;
  cancelled: number;
  monthly: { month: string; revenue: number; count: number }[];
}

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  package_name: string;
  amount: number;
  status: "pending" | "paid" | "processing" | "cancelled" | "expired" | "deny";
  payment_method: string | null;
  payment_link: string | null;
  paid_at: string | null;
  created_at: string;
  work_start_date?: string | null;
  work_end_date?: string | null;
  spk_pdf_path?: string | null;
}


interface PaymentNotif {
  id: number;
  order_id: string;
  customer_name: string;
  email: string;
  package_name: string;
  amount: number;
  paid_at: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; badge: string; dot: string; color: string }> = {
  pending: {
    label: "Menunggu",
    badge: "bg-warning-50 text-warning-700 ring-warning-600/20",
    dot: "bg-amber-500",
    color: "text-stone-600",
  },
  paid: {
    label: "Lunas",
    badge: "bg-success-50 text-success-700 ring-success-600/20",
    dot: "bg-emerald-500",
    color: "text-stone-900 font-semibold",
  },
  processing: {
    label: "Diproses",
    badge: "bg-brand-50 text-brand-700 ring-brand-600/20",
    dot: "bg-sky-500",
    color: "text-stone-600",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-error-50 text-error-700 ring-error-600/20",
    dot: "bg-stone-300",
    color: "text-stone-400",
  },
  expired: {
    label: "Kedaluwarsa",
    badge: "bg-gray-100 text-gray-600 ring-gray-500/20",
    dot: "bg-stone-300",
    color: "text-stone-400",
  },
  deny: {
    label: "Ditolak",
    badge: "bg-error-50 text-error-700 ring-error-600/20",
    dot: "bg-stone-300",
    color: "text-stone-400",
  },
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "chart"
    | "cash"
    | "clock"
    | "check"
    | "plus"
    | "download"
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
    | "filter"
    | "dots"
    | "arrow-up"
    | "arrow-down";
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
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
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
    filter: (
      <>
        <path d="M3 6h18" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>
    ),
    dots: (
      <>
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </>
    ),
    "arrow-up": (
      <>
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </>
    ),
    "arrow-down": (
      <>
        <path d="M12 5v14" />
        <path d="M19 12l-7 7-7-7" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function NotificationPanel({
  notifications,
  loading,
  onClose,
}: {
  notifications: PaymentNotif[];
  loading: boolean;
  onClose: () => void;
}) {
  const formatRp = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/60 z-[200] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-stone-900">Notifikasi Pembayaran</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Transaksi yang berhasil terbayar</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors" type="button">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[340px] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center text-xs text-stone-400">Memuat notifikasi...</div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-50">
              <svg className="h-6 w-6 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-stone-500">Belum ada pembayaran</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Notifikasi muncul saat order lunas</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-50">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50/40 transition-colors">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
                  <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.5 2.5L16 9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">{n.customer_name}</p>
                  <p className="text-[10px] text-stone-500 truncate">{n.package_name}</p>
                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{formatRp(n.amount)}</p>
                </div>
                <span className="text-[9px] text-stone-400 flex-shrink-0 mt-0.5">{timeAgo(n.paid_at || n.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-stone-100 px-4 py-2.5">
        <Link href="/admin/dashboard" className="block text-center text-[10.5px] font-semibold text-[#0077b6] hover:text-[#005f73] transition-colors">Lihat semua order &rarr;</Link>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="px-6 first:pl-0 last:pr-0">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</span>
      <p className="mt-2 text-2xl font-bold tracking-tight text-stone-900">{value}</p>
      <p className="mt-1.5 text-[10.5px] font-medium text-stone-450">{helper}</p>
    </div>
  );
}

function RevenueChart({ data }: { data: Stats["monthly"] }) {
  const max = Math.max(...data.map((item) => item.revenue), 1);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const formatRpCompact = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}rb`;
    return String(v);
  };

  if (!data.length) {
    return (
      <div className="grid h-72 place-items-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/30 text-xs font-semibold text-stone-400 mt-6">
        Belum ada data transaksi bulanan.
      </div>
    );
  }

  const gridRatios = [1, 0.75, 0.5, 0.25];

  return (
    <div className="relative mt-6 flex gap-0">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between pb-7 pr-3 text-right" style={{ height: 220 }}>
        {gridRatios.map((r) => (
          <span key={r} className="text-[9px] font-bold text-stone-300 leading-none">
            {formatRpCompact(max * r)}
          </span>
        ))}
      </div>

      {/* Chart area */}
      <div className="relative flex-1 min-w-0">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-0 top-0 flex flex-col justify-between pointer-events-none" style={{ height: 220 }}>
          {gridRatios.map((r) => (
            <div key={r} className="w-full border-t border-stone-100" />
          ))}
        </div>

        {/* Bars row */}
        <div className="relative flex items-end justify-around gap-1.5" style={{ height: 220 }}>
          {data.map((item) => {
            const monthIndex = Number(item.month.split("-")[1]) - 1;
            const monthLabel = monthNames[monthIndex] || item.month;
            const pct = Math.max((item.revenue / max) * 100, 4);

            return (
              <div key={item.month} className="group relative flex flex-col items-center justify-end flex-1 min-w-0" style={{ height: 220 }}>
                {/* Glassmorphic tooltip */}
                <div className="pointer-events-none absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-30 select-none">
                  <div className="rounded-xl border border-stone-100 bg-white/95 backdrop-blur-sm shadow-lg shadow-stone-200/60 px-3.5 py-2.5 text-center whitespace-nowrap">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1">{monthLabel}</span>
                    <span className="block text-[11.5px] font-extrabold text-stone-900 leading-none">
                      {formatRupiah(item.revenue)}
                    </span>
                    <span className="block text-[9px] font-bold text-emerald-600 mt-1">{item.count} transaksi</span>
                  </div>
                  <div className="w-2 h-2 rotate-45 bg-white border-b border-r border-stone-100 -mt-1 shadow" />
                </div>

                {/* Bar track */}
                <div className="relative w-5 rounded-full bg-stone-50 overflow-hidden" style={{ height: `${pct}%`, minHeight: 8 }}>
                  {/* Gradient fill */}
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-500"
                    style={{
                      background: "linear-gradient(to top, #0077b6, #00b4d8)",
                      opacity: 1,
                    }}
                  />
                  {/* Shine */}
                  <div className="absolute inset-x-0 top-0 h-1/3 rounded-full bg-white/20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-around mt-3 gap-1.5">
          {data.map((item) => {
            const monthIndex = Number(item.month.split("-")[1]) - 1;
            const monthLabel = monthNames[monthIndex] || item.month;
            return (
              <span key={item.month} className="flex-1 text-center text-[9.5px] font-bold text-stone-400 uppercase tracking-wide min-w-0">
                {monthLabel}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
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
  const itemActive =
    "bg-[#0077b6]/8 text-[#0077b6]";
  const itemInactive =
    "text-stone-500 hover:bg-stone-100/80 hover:text-stone-900";

  // Inline SVG logo icon
  const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sidebar_logo_grad" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f6ff" />
          <stop offset="100%" stopColor="#0077b6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#sidebar_logo_grad)" />
      <path d="M 32,8 A 24,24 0 0,1 56,32" stroke="#00b4d8" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 32,56 A 24,24 0 0,1 8,32" stroke="#005f73" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="32" r="4" fill="#00b4d8" />
      <circle cx="8" cy="32" r="4" fill="#005f73" />
      <circle cx="32" cy="32" r="6" fill="#ffffff" />
    </svg>
  );

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
                  Helio<span className="text-[#00b4d8]">Techno</span>
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

          <NavItem href="/admin/dashboard" icon="chart" label="Dashboard" active={currentPath === "dashboard"} collapsed={collapsed} itemBase={itemBase} itemActive={itemActive} itemInactive={itemInactive} />
          <NavItem href="/admin/dashboard/input-order" icon="plus" label="Input Order Baru" active={currentPath === "input-order"} collapsed={collapsed} itemBase={itemBase} itemActive={itemActive} itemInactive={itemInactive} />

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
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-stone-400 group-hover:text-stone-600 transition-colors`}>
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
              HelioTechno &copy; {new Date().getFullYear()}
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

function NavItem({
  href,
  icon,
  label,
  active,
  collapsed,
  itemBase,
  itemActive,
  itemInactive,
}: {
  href: string;
  icon: "chart" | "plus" | "edit" | "home" | "logout";
  label: string;
  active: boolean;
  collapsed: boolean;
  itemBase: string;
  itemActive: string;
  itemInactive: string;
}) {
  return (
    <Link
      href={href}
      className={`${itemBase} ${active ? itemActive : itemInactive} ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : undefined}
    >
      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${active ? "bg-[#0077b6]/10 text-[#0077b6]" : "text-stone-400 group-hover:text-stone-600"}`}>
        <Icon name={icon} className="h-4 w-4" />
      </span>
      {!collapsed && label}
    </Link>
  );
}



export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<PaymentNotif[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoadingNotif(true);
    try {
      const res = await fetch(getApiUrl("/api/orders/notifications"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch {
      // ignore
    } finally {
      setLoadingNotif(false);
    }
  }, [token]);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const openNotif = () => {
    setNotifOpen((prev) => !prev);
    if (!notifOpen) void fetchNotifications();
  };

  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(getApiUrl("/api/orders/stats"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch {
      setStats(null);
    }
  }, [router, token]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    setLoadingOrders(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await fetch(getApiUrl(`/api/orders?${params}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotal(data.total);
      }
    } catch {
      setOrders([]);
      setTotal(0);
    } finally {
      setLoadingOrders(false);
      setLoading(false);
    }
  }, [filterStatus, page, token]);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    void Promise.resolve().then(fetchStats);
    void Promise.resolve().then(fetchNotifications);
  }, [fetchStats, fetchNotifications, router, token]);

  useEffect(() => {
    void Promise.resolve().then(fetchOrders);
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase();
    return orders.filter((order) =>
      [order.customer_name, order.email, order.order_id, order.package_name].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [orders, search]);

  const totalPages = Math.max(Math.ceil(total / 15), 1);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new CustomEvent("admin-state-changed"));
    router.push("/admin/login");
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link pembayaran berhasil disalin.");
  };

  const generatePaymentLink = async (order: Order) => {
    if (!token) return;

    setGeneratingId(order.id);
    try {
      const response = await fetch(getApiUrl("/api/payment/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: order.order_id,
          customer_name: order.customer_name,
          email: order.email,
          phone: order.phone,
          package_name: order.package_name,
          amount: order.amount,
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Link pembayaran Midtrans berhasil dibuat.");
        await fetchOrders();
      } else {
        alert(`Gagal membuat link: ${data.message || "Midtrans error"}`);
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setGeneratingId(null);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    if (!token) return;

    setUpdatingId(id);
    try {
      await fetch(getApiUrl(`/api/orders/${id}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
      await fetchStats();
      await fetchNotifications();
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!token || !confirm("Hapus order ini?")) return;

    await fetch(getApiUrl(`/api/orders/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchOrders();
    await fetchStats();
  };

  const syncOrderStatus = async (orderId: string) => {
    if (!token) return;
    setSyncingId(orderId);
    try {
      const response = await fetch(getApiUrl(`/api/payment/sync/${orderId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert(`Status pembayaran diperbarui menjadi: ${data.status || "Selesai"}`);
        await fetchOrders();
        await fetchStats();
        await fetchNotifications();
      } else {
        alert(data.message || "Gagal mensinkronkan status.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setSyncingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Order ID", "Nama", "Email", "Telepon", "Paket", "Nominal", "Status", "Dibuat"];
    const rows = filteredOrders.map((order) => [
      order.order_id,
      order.customer_name,
      order.email,
      order.phone || "-",
      order.package_name,
      order.amount,
      order.status,
      formatDate(order.created_at),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-100 border-t-[#0077b6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-stone-700">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
        currentPath="dashboard"
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

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

              {/* empty — header title removed */}
            </div>

            <div className="flex w-full items-center justify-between gap-4 px-4 py-3 lg:w-auto lg:justify-end lg:px-0 lg:py-4">
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={exportCSV}
                  className="hidden h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors sm:inline-flex cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <Icon name="download" className="h-4 w-4" />
                  Export
                </button>

                {/* Bell Notification Button */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={openNotif}
                    className="relative grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer flex-shrink-0"
                    title="Notifikasi"
                  >
                    <Icon name="bell" className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-extrabold text-white">
                        {notifications.length > 9 ? "9+" : notifications.length}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <NotificationPanel
                      notifications={notifications}
                      loading={loadingNotif}
                      onClose={() => setNotifOpen(false)}
                    />
                  )}
                </div>

                {/* User avatar only, no text */}
                <div className="hidden h-10 w-10 sm:grid place-items-center rounded-full bg-stone-100 text-stone-600 border border-stone-200/40 flex-shrink-0">
                  <Icon name="user" className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
          <section className="bg-white border border-stone-200/80 rounded-2xl p-6 grid grid-cols-4 divide-x divide-stone-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <MetricCard
              label="Total Transaksi"
              value={String(stats?.total_orders ?? 0)}
              helper="Semua order tercatat"
            />
            <MetricCard
              label="Total Revenue"
              value={formatRupiah(stats?.total_revenue ?? 0)}
              helper="Akumulasi pembayaran"
            />
            <MetricCard
              label="Menunggu"
              value={String(stats?.pending ?? 0)}
              helper="Order belum selesai"
            />
            <MetricCard
              label="Lunas"
              value={String(stats?.paid ?? 0)}
              helper={`${stats?.cancelled ?? 0} order dibatalkan`}
            />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-stone-200/60 bg-white px-5 pt-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-6 sm:pt-6 lg:col-span-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Revenue Bulanan</h2>
                  <p className="mt-1 text-xs text-stone-400">Performa order berdasarkan bulan transaksi.</p>
                </div>
                <button type="button" className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-700 cursor-pointer" title="Menu">
                  <Icon name="dots" className="h-5 w-5" />
                </button>
              </div>
              <RevenueChart data={stats?.monthly ?? []} />
            </div>

            <div className="rounded-xl border border-stone-200/60 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:p-6 lg:col-span-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Status Pembayaran</h2>
                  <p className="mt-1 text-xs text-stone-400">Pantau komposisi status order aktif.</p>
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-500 uppercase tracking-wide select-none">Midtrans</span>
              </div>
              <div className="mt-6 space-y-4">
                {["paid", "pending", "cancelled"].map((status) => {
                  const value =
                    status === "paid" ? stats?.paid ?? 0 : status === "pending" ? stats?.pending ?? 0 : stats?.cancelled ?? 0;
                  const totalCount = Math.max(stats?.total_orders ?? 0, 1);
                  const percentage = Math.round((value / totalCount) * 100);

                  return (
                    <div key={status}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">{statusConfig[status].label}</span>
                        <span className="font-semibold text-gray-500">{percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${statusConfig[status].dot}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/admin/dashboard/input-order"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 sm:hidden"
              >
                <Icon name="plus" className="h-4 w-4" />
                Input Order
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-stone-200/60 bg-white px-4 pb-3 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Data Order</h2>
                  <p className="mt-1 text-xs text-stone-400">Kelola status, link pembayaran, dan data pelanggan secara terpusat.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <Icon name="filter" className="h-4 w-4" />
                    Filter
                  </button>
                  <select
                    value={filterStatus}
                    onChange={(event) => {
                      setFilterStatus(event.target.value);
                      setPage(1);
                    }}
                    className="h-10 rounded-lg border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 cursor-pointer"
                  >
                    <option value="all">Semua status</option>
                    <option value="pending">Menunggu</option>
                    <option value="paid">Lunas</option>
                    <option value="processing">Diproses</option>
                    <option value="cancelled">Dibatalkan</option>
                    <option value="expired">Kedaluwarsa</option>
                    <option value="deny">Ditolak</option>
                  </select>
                  <button
                    type="button"
                    onClick={exportCSV}
                    className="hidden h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors sm:inline-flex cursor-pointer"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Ekspor CSV
                  </button>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left">
                <thead className="border-y border-stone-100 text-[10.5px] font-bold text-stone-400 uppercase tracking-wider">
                  <tr className="bg-stone-50/50">
                    <th className="px-5 py-3">Order ID & Metode</th>
                    <th className="px-5 py-3">Pelanggan</th>
                    <th className="px-5 py-3">Layanan / Paket</th>
                    <th className="px-5 py-3">Nominal</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Tanggal Dibuat</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                        Memuat data order...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                        Belum ada order yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const status = statusConfig[order.status] || statusConfig.pending;

                      return (
                        <tr key={order.id} className="hover:bg-gray-50/70">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <code className="text-stone-700 text-[10.5px] font-mono font-medium bg-stone-50 border border-stone-200 rounded px-2 py-0.5 select-all block w-max">{order.order_id}</code>
                            <p className="mt-1 text-[10px] text-stone-400 font-medium">{order.payment_method || "Belum ada metode"}</p>
                            {order.spk_pdf_path && (
                              <a
                                href={getApiUrl(`/uploads/spk/${order.spk_pdf_path}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                </svg>
                                PDF SPK
                              </a>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold uppercase select-none">
                                {order.customer_name.charAt(0) || "?"}
                              </div>
                              <div>
                                <p className="font-semibold text-stone-900 text-[13px] leading-tight">{order.customer_name}</p>
                                <p className="mt-0.5 text-xs text-stone-450">{order.email}</p>
                                <p className="mt-0.5 text-[10px] text-stone-400 font-medium">{order.phone || "-"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-semibold text-stone-750 text-xs">{order.package_name}</p>
                            {(order.work_start_date || order.work_end_date) && (
                              <p className="mt-1.5 text-[10px] text-stone-400 flex items-center gap-1 font-medium select-none">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                {order.work_start_date ? formatDate(order.work_start_date) : "?"} - {order.work_end_date ? formatDate(order.work_end_date) : "?"}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 font-bold text-stone-900 text-xs whitespace-nowrap">{formatRupiah(order.amount)}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="relative inline-flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              <select
                                value={order.status}
                                disabled={updatingId === order.id}
                                onChange={(event) => updateStatus(order.id, event.target.value)}
                                className="bg-transparent border border-stone-200 rounded-md px-2 py-0.5 text-xs text-stone-700 font-semibold focus:border-stone-400 outline-none cursor-pointer"
                              >
                                <option value="pending">Menunggu</option>
                                <option value="paid">Lunas</option>
                                <option value="processing">Diproses</option>
                                <option value="cancelled">Dibatalkan</option>
                                <option value="expired">Kedaluwarsa</option>
                                <option value="deny">Ditolak</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-stone-450 whitespace-nowrap">{formatDate(order.created_at)}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex justify-end gap-1.5">
                              {order.payment_link ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(order.payment_link || "")}
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-stone-650 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
                                    title="Salin link pembayaran"
                                  >
                                    <Icon name="copy" className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => syncOrderStatus(order.order_id)}
                                    disabled={syncingId === order.order_id}
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-50"
                                    title="Sinkronkan status Midtrans"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={syncingId === order.order_id ? "animate-spin" : ""}>
                                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => generatePaymentLink(order)}
                                  disabled={generatingId === order.id}
                                  className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-[#0077b6] hover:bg-stone-50 hover:text-[#005f73] transition-colors disabled:opacity-50 cursor-pointer"
                                  title="Buat link pembayaran"
                                >
                                  <Icon name="link" className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteOrder(order.id)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-stone-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer"
                                title="Hapus order"
                              >
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-stone-500">
                Halaman {page} dari {totalPages}. Menampilkan {filteredOrders.length} order.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
