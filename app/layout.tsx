import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HelioNexus - Software House & Solusi Digital",
  description: "Software House inovatif Universitas Muhammadiyah PKU Surakarta, menghadirkan solusi Web, Mobile App, UI/UX, AI, dan IoT.",
  icons: {
    icon: "/assets/logo-icon.svg",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
