"use client";

import { useEffect, useRef, ElementType, ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────
// SHARED OBSERVER (singleton)
// Satu IntersectionObserver untuk SEMUA ScrollReveal di halaman.
// Jauh lebih ringan daripada buat observer baru per komponen.
// ─────────────────────────────────────────────────────────────────
type RevealCallback = () => void;
const registry = new Map<Element, RevealCallback>();
let sharedIO: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
  if (sharedIO) return sharedIO;

  sharedIO = new IntersectionObserver(
    (entries) => {
      // Kumpulkan semua yang perlu diupdate, lalu batch dalam satu rAF
      const toReveal: Element[] = [];
      for (const entry of entries) {
        if (entry.isIntersecting && registry.has(entry.target)) {
          toReveal.push(entry.target);
        }
      }
      if (toReveal.length === 0) return;

      requestAnimationFrame(() => {
        for (const el of toReveal) {
          el.classList.add("scroll-anim--visible");
          registry.delete(el);
          sharedIO?.unobserve(el);
        }
      });
    },
    // Threshold & rootMargin tetap — tidak butuh kustomisasi per elemen
    { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
  );

  return sharedIO;
}

// ─────────────────────────────────────────────────────────────────

export type ScrollAnimVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "slide-up";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: ScrollAnimVariant;
  /** Durasi transisi dalam ms (default 900) */
  duration?: number;
  /** Delay sebelum animasi mulai dalam ms (default 0) */
  delay?: number;
  className?: string;
  as?: ElementType;
}

export default function ScrollReveal({
  children,
  variant = "fade-up",
  duration = 900,
  delay = 0,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    // Pasang kelas hidden + set timing
    el.classList.add("scroll-anim", `scroll-anim--${variant}`);
    el.style.transitionDuration = `${duration}ms`;
    if (delay > 0) el.style.transitionDelay = `${delay}ms`;

    // Daftarkan ke shared observer
    const observer = getSharedObserver();
    registry.set(el, () => el.classList.add("scroll-anim--visible"));
    observer.observe(el);

    return () => {
      registry.delete(el);
      observer.unobserve(el);
    };
  }, [variant, duration, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
