"use client";

import { useEffect } from "react";

/**
 * Paksa browser selalu mulai dari posisi teratas saat halaman di-load / refresh.
 * Menonaktifkan "scroll restoration" bawaan browser yang menyimpan posisi scroll.
 */
export default function ScrollToTop() {
  useEffect(() => {
    // Matikan restore otomatis browser
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Langsung scroll ke atas
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
