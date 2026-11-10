"use client";

import React, { useEffect, useRef } from "react";

export const FleavaHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Camera & Physics
    let rotX = 0.32;
    let rotY = -0.35;
    let targetRotX = 0.32;
    let targetRotY = -0.35;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Mouse velocity & position
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      isHover: false,
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // ---------------------------------------------------------------
    // 3D Geometry: Seamless Closed Kinetic Silk Loop & Ethereal Ribbons
    // ---------------------------------------------------------------
    const numRibbons = 11;
    const stepsPerRibbon = 160;

    // Ambient floating particles spread across the FULL canvas
    const particleCount = 85;
    const particles: {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1100,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const fov = 480;

    // Project 3D point to 2D screen
    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      // Rotate Y (Yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X (Pitch)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const dist = fov + z2;
      if (dist <= 15) return null;

      const scale = fov / dist;
      return {
        px: x1 * scale + cx,
        py: y2 * scale + cy,
        scale,
        z: z2,
      };
    };

    // ---------------------------------------------------------------
    // Main Animation Loop
    // ---------------------------------------------------------------
    const render = (timestamp: number) => {
      const t = timestamp * 0.001;

      // Smooth camera interpolation
      rotX += (targetRotX - rotX) * 0.06;
      rotY += (targetRotY - rotY) * 0.06;

      // Natural continuous slow rotation when idle
      if (!isDragging) {
        targetRotY += 0.0022;
      }

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Center position: shifted to right half on desktop, centered on mobile
      const cx = width > 1024 ? width * 0.64 : width * 0.5;
      const cy = width > 1024 ? height * 0.5 : height * 0.54;

      // 1. Soft radial ambient blue glow behind the sculpture across full screen
      const glowGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.7);
      glowGrad.addColorStop(0, "rgba(0, 180, 216, 0.14)");
      glowGrad.addColorStop(0.35, "rgba(0, 119, 182, 0.05)");
      glowGrad.addColorStop(1, "rgba(248, 250, 252, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Floating Ambient Dust across the full viewport
      for (const p of particles) {
        p.y += Math.sin(t * p.speed + p.phase) * 0.35;
        p.x += Math.cos(t * p.speed * 0.8 + p.phase) * 0.25;
        const proj = project(p.x, p.y, p.z, cx, cy);
        if (proj) {
          const alpha = Math.min(Math.max((proj.z + 400) / 800, 0.12), 0.75);
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 180, 216, ${alpha * 0.6})`;
          ctx.fill();
        }
      }

      // 3. Full-Sized Grand Radii (Full & expansive across the viewport)
      const baseRadius =
        width > 1024
          ? Math.min(width * 0.25, height * 0.45)
          : Math.min(width * 0.38, height * 0.34);
      const tubeRadius = baseRadius * 0.44;

      // 4. Render Seamless 3D Torus Kinetic Silk Ribbons
      for (let r = 0; r < numRibbons; r++) {
        const ribbonOffset =
          ((r - (numRibbons - 1) / 2) / (numRibbons - 1)) * (tubeRadius * 0.55);
        const ribbonPhase = (r / numRibbons) * Math.PI * 0.25;

        ctx.beginPath();
        let started = false;

        for (let i = 0; i <= stepsPerRibbon; i++) {
          const u = (i / stepsPerRibbon) * Math.PI * 2; // [0, 2PI]

          // Closed harmonic torus loop
          const twist = u * 2.0 + t * 1.5 + ribbonPhase;
          const waveElevation = Math.sin(u * 3 - t * 2.0) * (baseRadius * 0.12);

          const currentR = baseRadius + Math.sin(u * 2 + t * 1.2) * (baseRadius * 0.1);
          const radOffset = (tubeRadius + ribbonOffset) * Math.cos(twist);
          const zOffset = (tubeRadius + ribbonOffset) * Math.sin(twist) + waveElevation;

          let rawX = (currentR + radOffset) * Math.cos(u);
          let rawY = (currentR + radOffset) * Math.sin(u);
          let rawZ = zOffset;

          // Interactive mouse fluid attraction
          if (mouse.isHover) {
            const dx = rawX - (mouse.x - cx) * 0.7;
            const dy = rawY - (mouse.y - cy) * 0.7;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 280) {
              const influence = Math.exp(-dist / 95) * 52;
              rawZ += Math.sin(dist * 0.06 - t * 4) * influence;
            }
          }

          const proj = project(rawX, rawY, rawZ, cx, cy);
          if (!proj) continue;

          if (!started) {
            ctx.moveTo(proj.px, proj.py);
            started = true;
          } else {
            ctx.lineTo(proj.px, proj.py);
          }
        }

        ctx.closePath();

        // High-contrast monochromatic & electric blue strokes
        const normalizedIndex = 1 - Math.abs(r - (numRibbons - 1) / 2) / ((numRibbons - 1) / 2);
        const strokeAlpha = 0.35 + normalizedIndex * 0.6;

        ctx.strokeStyle =
          r === Math.floor(numRibbons / 2)
            ? `rgba(0, 119, 182, ${strokeAlpha})` // Vibrant Blue Core (#0077b6)
            : `rgba(0, 180, 216, ${strokeAlpha * 0.85})`; // Cyan-sky outer strands (#00b4d8)

        ctx.lineWidth = r === Math.floor(numRibbons / 2) ? 2.0 : 1.2;
        ctx.stroke();
      }

      // 5. Subtle Cross-Lattice Struts for Architectural Texture
      const crossStruts = 28;
      for (let s = 0; s < crossStruts; s++) {
        const u = (s / crossStruts) * Math.PI * 2;
        const twist = u * 2.0 + t * 1.5;
        const currentR = baseRadius + Math.sin(u * 2 + t * 1.2) * (baseRadius * 0.1);

        const p1 = project(
          (currentR + (tubeRadius - 16) * Math.cos(twist)) * Math.cos(u),
          (currentR + (tubeRadius - 16) * Math.cos(twist)) * Math.sin(u),
          (tubeRadius - 16) * Math.sin(twist),
          cx,
          cy
        );

        const p2 = project(
          (currentR + (tubeRadius + 16) * Math.cos(twist)) * Math.cos(u),
          (currentR + (tubeRadius + 16) * Math.cos(twist)) * Math.sin(u),
          (tubeRadius + 16) * Math.sin(twist),
          cx,
          cy
        );

        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = "rgba(0, 180, 216, 0.22)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // ---------------------------------------------------------------
    // Mouse Interaction Handlers
    // ---------------------------------------------------------------
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      mouse.targetX = nx;
      mouse.targetY = ny;
      mouse.isHover = true;

      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        targetRotX = Math.max(-1.1, Math.min(1.1, targetRotX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const normX = (nx / width - 0.5) * 2;
        const normY = (ny / height - 0.5) * 2;
        targetRotY = -0.35 + normX * 0.25;
        targetRotX = 0.32 + normY * 0.2;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerLeave = () => {
      isDragging = false;
      mouse.isHover = false;
      targetRotX = 0.32;
      targetRotY = -0.35;
    };

    const canvasElem = canvasRef.current;
    if (canvasElem) {
      canvasElem.addEventListener("pointerdown", handlePointerDown as any);
      canvasElem.addEventListener("pointermove", handlePointerMove as any);
      canvasElem.addEventListener("pointerup", handlePointerUp as any);
      canvasElem.addEventListener("pointerleave", handlePointerLeave as any);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animId) cancelAnimationFrame(animId);
      if (canvasElem) {
        canvasElem.removeEventListener("pointerdown", handlePointerDown as any);
        canvasElem.removeEventListener("pointermove", handlePointerMove as any);
        canvasElem.removeEventListener("pointerup", handlePointerUp as any);
        canvasElem.removeEventListener("pointerleave", handlePointerLeave as any);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none overflow-hidden pointer-events-auto"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default FleavaHeroCanvas;
