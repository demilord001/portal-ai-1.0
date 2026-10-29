"use client";

import React, { useEffect, useRef } from "react";

interface PortalVisualizer3DProps {
  isThinking?: boolean;
  intensity?: number;
  className?: string;
  interactive?: boolean;
}

export function PortalVisualizer3D({
  isThinking = false,
  intensity = 1,
  className = "",
  interactive = true,
}: PortalVisualizer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Particles on a sphere surface
    const particleCount = 120;
    const particles: { x: number; y: number; z: number; baseRadius: number; color: string; speed: number; phase: number }[] = [];
    const colors = ["#4da9ff", "#b27cf8", "#ff6b7e", "#fdbb2d", "#38ef7d"];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const r = 1;

      particles.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(theta),
        baseRadius: Math.random() * 2 + 1.2,
        color: colors[i % colors.length],
        speed: (Math.random() * 0.005 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
      });
    }

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetRotY = nx * 0.8;
      targetRotX = -ny * 0.8;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let time = 0;

    const render = () => {
      time += isThinking ? 0.04 : 0.015;
      rotX += (targetRotX - rotX) * 0.05 + 0.003;
      rotY += (targetRotY - rotY) * 0.05 + (isThinking ? 0.02 : 0.008);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      // Draw subtle glowing dimensional aura
      const radialGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.3
      );
      radialGradient.addColorStop(0, isThinking ? "rgba(178, 124, 248, 0.22)" : "rgba(77, 169, 255, 0.12)");
      radialGradient.addColorStop(0.5, isThinking ? "rgba(255, 107, 126, 0.15)" : "rgba(155, 114, 207, 0.08)");
      radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Transform and project 3D points
      const projected: { x: number; y: number; z: number; size: number; color: string; alpha: number }[] = [];

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulsing dynamic wave
        const wave = Math.sin(time * 3 + p.phase) * (isThinking ? 0.22 : 0.08);
        const curRadius = radius * (1 + wave) * intensity;

        // 3D rotation
        let x1 = p.x * curRadius;
        let y1 = p.y * curRadius;
        let z1 = p.z * curRadius;

        // Rotate Y
        let x2 = x1 * cosY - z1 * sinY;
        let z2 = z1 * cosY + x1 * sinY;

        // Rotate X
        let y3 = y1 * cosX - z2 * sinX;
        let z3 = z2 * cosX + y1 * sinX;

        // Perspective projection
        const fov = 380;
        const scale = fov / (fov + z3 + 120);
        const px = centerX + x2 * scale;
        const py = centerY + y3 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z3 + radius) / (2 * radius) + 0.2));

        projected.push({
          x: px,
          y: py,
          z: z3,
          size: p.baseRadius * scale * (isThinking ? 1.4 : 1),
          color: p.color,
          alpha,
        });
      }

      // Sort by depth (painter's algorithm)
      projected.sort((a, b) => a.z - b.z);

      // Connect nearby particles with subtle light chords
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 46) {
            const lineAlpha = (1 - dist / 46) * 0.22 * projected[i].alpha;
            ctx.strokeStyle = `rgba(178, 124, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Render glowing particle nodes
      for (const pt of projected) {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = isThinking ? 12 : 6;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isThinking, intensity, interactive]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
