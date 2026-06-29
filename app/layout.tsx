import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Helio Nexus",
  description: "startup teknologi yang berfokus pada pengembangan aplikasi, sistem informasi, dan website.",
  keywords: ["Helio Nexus", "Campus Connectivity", "Sustainable Energy", "IoT", "Smart Campus Mesh", "SDN Infrastructure", "Systems Integration", "Solar-Powered Mesh Nodes"],
  icons: {
    icon: "/images/logo-symbol.png",
    shortcut: "/images/logo-symbol.png",
    apple: "/images/logo-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased light`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black">
        {children}
      </body>
    </html>
  );
}

