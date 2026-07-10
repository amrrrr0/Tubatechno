import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi gambar: pakai format modern (avif > webp > jpg)
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Tree-shake: hanya import yang dipakai
  experimental: {
    optimizePackageImports: [],
  },

  // Hapus console.log di production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
