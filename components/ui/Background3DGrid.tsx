"use client";

import React, { useEffect, useRef } from "react";

export const Background3DGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 3D Star/Particle field
    const numStars = 60;
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 1000 + 100,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.45;
      const fov = 400;

      // Render 3D drifting stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= 0.6;
        if (star.z <= 10) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 1.5;
          star.y = (Math.random() - 0.5) * height * 1.5;
        }

        const scale = fov / (fov + star.z);
        const px = star.x * scale + cx;
        const py = star.y * scale + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = (1 - star.z / 1000) * 0.45;
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
    />
  );
};

export default Background3DGrid;
