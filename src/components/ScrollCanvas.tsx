"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  connected: boolean;
};

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const PARTICLE_COUNT = 120;
    const CONNECTION_DIST = 140;

    function resize() {
      w = container!.offsetWidth;
      h = container!.offsetHeight;
      canvas!.width = w * window.devicePixelRatio;
      canvas!.height = h * window.devicePixelRatio;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initParticles() {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particlesRef.current.push({
          x, y, baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.6 + 0.2,
          connected: false,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const progress = progressRef.current;
      const particles = particlesRef.current;

      // Phase calculations
      const formPhase = Math.min(progress * 3, 1); // 0-33%: particles gather
      const pulsePhase = Math.max(0, Math.min((progress - 0.33) * 3, 1)); // 33-66%: connections pulse
      const expandPhase = Math.max(0, (progress - 0.66) * 3); // 66-100%: expand outward

      // Update particles
      for (const p of particles) {
        // Drift motion
        p.x += p.vx * (1 - formPhase * 0.7);
        p.y += p.vy * (1 - formPhase * 0.7);

        // During form phase: attract toward center cluster
        if (formPhase > 0) {
          const centerX = w * 0.5;
          const centerY = h * 0.5;
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.min(w, h) * (0.4 - formPhase * 0.15 + expandPhase * 0.3);

          if (dist > maxDist) {
            p.x += dx * 0.02 * formPhase;
            p.y += dy * 0.02 * formPhase;
          }
        }

        // Expand phase: push outward
        if (expandPhase > 0) {
          const centerX = w * 0.5;
          const centerY = h * 0.5;
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            p.x += (dx / dist) * expandPhase * 1.5;
            p.y += (dy / dist) * expandPhase * 1.5;
          }
        }

        // Bounds wrapping
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw connections
      const connectionAlpha = pulsePhase * 0.4;
      if (connectionAlpha > 0.01) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = CONNECTION_DIST * (1 + pulsePhase * 0.5);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * connectionAlpha;
              // Pulse color from orange to blue based on expand phase
              const r = Math.round(255 - expandPhase * 200);
              const g = Math.round(87 + expandPhase * 80);
              const b = Math.round(34 + expandPhase * 180);
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const alpha = p.alpha * (0.4 + formPhase * 0.6);
        const size = p.size * (1 + pulsePhase * 0.5);

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        const r = Math.round(255 - expandPhase * 200);
        const g = Math.round(87 + expandPhase * 80);
        const b = Math.round(34 + expandPhase * 180);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central glow during pulse phase
      if (pulsePhase > 0.1) {
        const glowGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.3);
        glowGradient.addColorStop(0, `rgba(255,87,34,${pulsePhase * 0.06})`);
        glowGradient.addColorStop(1, "rgba(255,87,34,0)");
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, w, h);
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    // Scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const handleResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
