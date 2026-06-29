"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out after 1.2s, then unmount
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#ffffff",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: visible ? "all" : "none",
        animation: "hn-fadein 0.4s ease",
      }}
    >
      <Image
        src="/images/logo-symbol.png"
        alt="Helio Nexus"
        width={56}
        height={56}
        className="object-contain"
        priority
      />
      <style>{`
        @keyframes hn-fadein { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
