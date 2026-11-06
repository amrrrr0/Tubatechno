import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wajib untuk Cloudflare Pages: hasil build jadi file statis di folder "out"
  output: "export",
  trailingSlash: true,

  // Static export tidak punya server untuk optimasi gambar,
  // jadi "formats" avif/webp tidak berlaku lagi
  images: {
    unoptimized: true,
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
