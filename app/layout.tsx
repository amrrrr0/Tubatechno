import "@/styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import AdminFloatingBar from "@/components/AdminFloatingBar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tubatechno",
  description: "Tubatechno adalah partner software developer dan teknologi independen.",
  icons: {
    icon: [
      { url: "/assets/brand/logo.svg?v=20261110", type: "image/svg+xml" },
      { url: "/icon.svg?v=20261110", type: "image/svg+xml" },
      { url: "/favicon.ico?v=20261110", sizes: "any" }
    ],
    shortcut: "/assets/brand/logo.svg?v=20261110",
    apple: "/assets/brand/logo.svg?v=20261110",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <head>
        <title>Tubatechno</title>
        <link rel="icon" type="image/svg+xml" href="/assets/brand/logo.svg?v=20261110" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=20261110" />
        <link rel="alternate icon" href="/favicon.ico?v=20261110" />
        <link rel="shortcut icon" href="/favicon.ico?v=20261110" />
        <link rel="apple-touch-icon" href="/assets/brand/logo.svg?v=20261110" />
      </head>
      <body className="font-sans bg-[#f8fafc] text-slate-900 antialiased selection:bg-[#00b4d8] selection:text-white">
        <ScrollToTop />
        <AdminFloatingBar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
