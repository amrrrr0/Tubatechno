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
      { url: "/icon.svg?v=20261106c", type: "image/svg+xml" },
      { url: "/assets/brand/logo.svg?v=20261106c", type: "image/svg+xml" },
      { url: "/favicon.ico?v=20261106c", sizes: "any" }
    ],
    shortcut: "/icon.svg?v=20261106c",
    apple: "/icon.svg?v=20261106c",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <head>
        <title>Tubatechno</title>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=20261106c" />
        <link rel="icon" type="image/svg+xml" href="/assets/brand/logo.svg?v=20261106c" />
        <link rel="alternate icon" href="/favicon.ico?v=20261106c" />
        <link rel="shortcut icon" href="/favicon.ico?v=20261106c" />
        <link rel="apple-touch-icon" href="/icon.svg?v=20261106c" />
      </head>
      <body className="font-sans bg-[#04060d] text-white antialiased selection:bg-[#38bdf8] selection:text-slate-950">
        <ScrollToTop />
        <AdminFloatingBar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
