import React, { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: "star" | "circle" | "cross";
  life: number;
  maxLife: number;
}

export default function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparkles: Sparkle[] = [];
    let animationFrameId: number;
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    // Palette harmonizing with Shrishti's gold-rose theme
    const colors = [
      "rgba(197, 160, 89, 0.9)",   // Golden Honey
      "rgba(145, 45, 43, 0.8)",    // Deep Blush Red
      "rgba(214, 186, 139, 0.95)", // Pale Warm Gold
      "rgba(255, 255, 255, 0.95)", // Celestial White
      "rgba(244, 219, 216, 0.9)",  // Creamy Rose
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createSparkle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 0.4;
      const sizeChange = Math.random() * 4 + 2;
      const maxLife = Math.random() * 32 + 22; // frame life cycle

      const types: ("star" | "circle" | "cross")[] = ["star", "circle", "cross"];
      const type = types[Math.floor(Math.random() * types.length)];

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // slight upward natural drift
        size: sizeChange,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type,
        life: maxLife,
        maxLife,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMoved) {
        lastX = clientX;
        lastY = clientY;
        hasMoved = true;
        return;
      }

      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Interpolate sparkles along the pointer line for dense beautiful trails during fast gesture
      const steps = Math.min(Math.floor(distance / 5), 8);
      
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 1 : i / steps;
        const x = lastX + dx * t;
        const y = lastY + dy * t;
        
        // Add random jitter around mouse
        const jitterX = (Math.random() - 0.5) * 4;
        const jitterY = (Math.random() - 0.5) * 4;

        if (Math.random() < 0.65) {
          sparkles.push(createSparkle(x + jitterX, y + jitterY));
        }
      }

      lastX = clientX;
      lastY = clientY;
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        
        // Update physics
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.life -= 1;
        s.alpha = s.life / s.maxLife;

        // Friction and air resistance
        s.vx *= 0.98;
        s.vy *= 0.98;

        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        // Dynamic Glow
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;

        ctx.fillStyle = s.color;
        ctx.strokeStyle = s.color;

        if (s.type === "star") {
          // Sharp elegant 4-pointed sparkle
          ctx.beginPath();
          for (let p = 0; p < 4; p++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, 0 - s.size);
            ctx.lineTo(0 + s.size / 3.5, 0);
          }
          ctx.closePath();
          ctx.fill();
        } else if (s.type === "cross") {
          // Elegant minimal thin brush cross
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-s.size, 0);
          ctx.lineTo(s.size, 0);
          ctx.moveTo(0, -s.size);
          ctx.lineTo(0, s.size);
          ctx.stroke();
        } else {
          // Delicate soft bubble/circle center
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="pointer-trail-sparkles"
      className="fixed inset-0 w-full h-full pointer-events-none z-50 select-none"
    />
  );
}
