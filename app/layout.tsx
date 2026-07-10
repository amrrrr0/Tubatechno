import "@/styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelioNexus",
  description: "Software House inovatif Universitas Muhammadiyah PKU Surakarta, menghadirkan solusi Web, Mobile App, UI/UX, AI, dan IoT.",
  icons: {
    icon: "/assets/brand/logo-icon.svg",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
