import React, { useEffect, useRef } from "react";

interface Particle {
  type: "orb" | "sparkle" | "flower" | "petal";
  subType?: "cherry" | "rose";
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  rotationSpeed?: number;
  rotation3D?: number;
  rotation3DSpeed?: number;
  bloom?: number;
  bloomSpeed?: number;
  petalCount?: number;
  swayOffset?: number;
  swaySpeed?: number;
}

export default function MagicalBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      "rgba(244, 219, 216, 0.4)", // Blush pink
      "rgba(212, 175, 55, 0.3)",  // Gold
      "rgba(230, 215, 255, 0.35)", // Lavender
      "rgba(255, 255, 255, 0.6)", // Pure white glow
    ];

    const flowerColors = [
      "rgba(255, 185, 196, 0.8)",  // Delicate Rose
      "rgba(245, 222, 179, 0.8)",  // Golden Primrose
      "rgba(230, 210, 250, 0.85)", // Soft Lilac
      "rgba(255, 204, 204, 0.85)", // Radiant Blush
      "rgba(255, 240, 245, 0.9)",  // Lavender Blush
    ];

    const petalColors = [
      "rgba(255, 192, 203, 0.65)", // Pink Cherry Blossom
      "rgba(255, 182, 193, 0.7)",  // Light pink
      "rgba(255, 105, 180, 0.5)",  // Hot pink translucent
      "rgba(255, 228, 225, 0.65)", // Misty Rose
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial background particles constructor
    const createParticle = (x: number, y: number, option: "orb" | "sparkle" | "flower" | "petal" = "orb"): Particle => {
      if (option === "sparkle") {
        return {
          type: "sparkle",
          x,
          y,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: -Math.random() * 1.5 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.005,
        };
      }

      if (option === "flower") {
        return {
          type: "flower",
          x,
          y,
          size: Math.random() * 14 + 10, // 10px to 24px
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: Math.random() * 0.5 + 0.5, // Floats downward
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          alpha: Math.random() * 0.4 + 0.5,
          decay: Math.random() * 0.0008 + 0.0004,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          bloom: 0.1, // starts small, blooms beautifully
          bloomSpeed: Math.random() * 0.006 + 0.003,
          petalCount: Math.random() < 0.5 ? 5 : 6,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.01 + 0.005,
        };
      }

      if (option === "petal") {
        const subType = Math.random() < 0.65 ? "cherry" : "rose";
        const cherryColors = [
          "rgba(255, 182, 193, 0.65)", // Delicate Cherry Pink
          "rgba(255, 192, 203, 0.7)",  // Vibrant Blossom Pink
          "rgba(255, 222, 226, 0.6)",  // Soft Pastel Blush
          "rgba(254, 215, 218, 0.65)", // Warm Coral Blush
        ];
        const roseColors = [
          "rgba(226, 68, 92, 0.55)",   // Satin Royal Rose Red
          "rgba(244, 95, 117, 0.6)",   // Classic Blush Rose Crimson
          "rgba(255, 105, 180, 0.55)", // Majestic Wild Pink
          "rgba(197, 45, 43, 0.5)",    // Velvet Antique Ruby Petal
        ];

        return {
          type: "petal",
          subType,
          x,
          y,
          size: subType === "rose" ? Math.random() * 8 + 7 : Math.random() * 7 + 4.5,
          speedX: (Math.random() - 0.45) * 0.4, // Slight randomized gentle breeze
          speedY: Math.random() * 0.35 + 0.25, // Soft falling rate (0.25 to 0.6px/frame)
          color: subType === "rose" 
            ? roseColors[Math.floor(Math.random() * roseColors.length)]
            : cherryColors[Math.floor(Math.random() * cherryColors.length)],
          alpha: Math.random() * 0.3 + 0.5,
          decay: Math.random() * 0.0003 + 0.0001, // lives very long to cover whole screenspace
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          rotation3D: Math.random() * Math.PI * 2,
          rotation3DSpeed: Math.random() * 0.02 + 0.015,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.012 + 0.004,
        };
      }

      // Default ambient orb
      return {
        type: "orb",
        x,
        y,
        size: Math.random() * 50 + 25,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.3 - 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
        decay: Math.random() * 0.0015 + 0.0004,
      };
    };

    // Populate initial items
    for (let i = 0; i < 12; i++) {
      particles.push(createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "orb"));
    }

    // Populate initial falling blooming flowers
    for (let i = 0; i < 10; i++) {
      const flower = createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.8, "flower");
      flower.bloom = Math.random() * 0.8 + 0.2;
      particles.push(flower);
    }

    // Populate initial petals fluttering in space
    for (let i = 0; i < 15; i++) {
      particles.push(createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.8, "petal"));
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn star sparkles
      if (Math.random() < 0.2) {
        particles.push(createParticle(e.clientX, e.clientY, "sparkle"));
      }
      // Gesture triggers occasional blossom petals
      if (Math.random() < 0.04) {
        particles.push(createParticle(e.clientX, e.clientY, "petal"));
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      // Spawn a majestic cluster of cherry blossom & rose petals at clicked area
      for (let i = 0; i < 9; i++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDist = Math.random() * 45;
        const px = e.clientX + Math.cos(offsetAngle) * offsetDist;
        const py = e.clientY + Math.sin(offsetAngle) * offsetDist;
        const pObj = createParticle(px, py, "petal");
        // Extra outward velocity burst on click
        pObj.speedX += Math.cos(offsetAngle) * (Math.random() * 1.5 + 0.5);
        pObj.speedY -= Math.random() * 1.0;
        particles.push(pObj);
      }

      // Generate a temporary soft horizontal wind gust to all current petals & flowers!
      particles.forEach((p) => {
        if (p.type === "petal" || p.type === "flower") {
          // Subtle horizontal shove
          p.speedX += (Math.random() - 0.35) * 0.75;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleWindowClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Soft luxury cream/rose romantic background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#fffafb"); // Soft rosewater white
      gradient.addColorStop(0.4, "#fff5f6"); // Very light blush
      gradient.addColorStop(0.8, "#fef3f4"); // Tender coral pink
      gradient.addColorStop(1, "#fcf0f2"); // Delicate cream orchid
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Center-glowing garden light rays
      const radialGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        0,
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.7
      );
      radialGlow.addColorStop(0, "rgba(255, 240, 243, 0.95)");
      radialGlow.addColorStop(0.5, "rgba(255, 245, 247, 0.45)");
      radialGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Static beautiful soft-focused flower frame arches at corners to anchor "Flower Background" theme
      // Top Left Corner Bouquet
      ctx.save();
      ctx.globalAlpha = 0.12; // Extremely tender, subtle, editorial look
      ctx.fillStyle = "rgba(255, 150, 170, 0.8)";
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(230, 180, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(100, 30, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 218, 185, 0.7)";
      ctx.beginPath();
      ctx.arc(20, 120, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Top Right Corner Bouquet
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "rgba(255, 182, 193, 0.85)";
      ctx.beginPath();
      ctx.arc(canvas.width, 0, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 239, 213, 0.7)";
      ctx.beginPath();
      ctx.arc(canvas.width - 120, 40, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bottom Left Blossom Vine shadow
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "rgba(255, 192, 203, 0.65)";
      ctx.beginPath();
      ctx.arc(40, canvas.height - 40, 140, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update and draw particles
      particles.forEach((p, index) => {
        // Apply wind sway dynamics for organic realistic drifting
        if (p.type === "flower" || p.type === "petal") {
          if (p.swayOffset !== undefined && p.swaySpeed !== undefined) {
            p.swayOffset += p.swaySpeed;
            // Oscillate horizontally
            p.x += Math.sin(p.swayOffset) * 0.45;
          }
        }

        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        // Progress beautiful flower blooming
        if (p.type === "flower" && p.bloom !== undefined && p.bloomSpeed !== undefined) {
          p.bloom = Math.min(1, p.bloom + p.bloomSpeed);
        }

        // Wrap or respawn dead particles dynamically
        if (p.alpha <= 0 || p.y > canvas.height + 40 || p.x < -40 || p.x > canvas.width + 40) {
          if (p.type === "orb") {
            particles[index] = createParticle(Math.random() * canvas.width, canvas.height + 25, "orb");
          } else if (p.type === "flower") {
            particles[index] = createParticle(Math.random() * canvas.width, -30, "flower");
          } else if (p.type === "petal") {
            particles[index] = createParticle(Math.random() * canvas.width, -25, "petal");
          } else {
            particles.splice(index, 1);
          }
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === "sparkle") {
          ctx.beginPath();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4 + p.alpha);
          ctx.fillStyle = "#e0af66"; // Soft cozy gold star
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.type === "petal") {
          // Soft realistic wind-blown fluttering blossom/rose petal
          ctx.beginPath();
          ctx.translate(p.x, p.y);
          
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
            ctx.rotate(p.rotation);
          }
          
          if (p.rotation3D !== undefined && p.rotation3DSpeed !== undefined) {
            p.rotation3D += p.rotation3DSpeed;
            // 3D Flipping Simulation on axis
            ctx.scale(Math.sin(p.rotation3D), 1);
          }

          ctx.fillStyle = p.color;

          if (p.subType === "cherry") {
            // Cherry Blossom Petal with classical cleft notch at the outer tip
            ctx.beginPath();
            ctx.moveTo(0, p.size * 0.5);
            // Left flank
            ctx.bezierCurveTo(-p.size * 0.9, -p.size * 0.1, -p.size * 0.7, -p.size * 1.3, -p.size * 0.15, -p.size * 1.15);
            // Tip notch/cleft
            ctx.lineTo(0, -p.size * 0.9);
            ctx.lineTo(p.size * 0.15, -p.size * 1.15);
            // Right flank
            ctx.bezierCurveTo(p.size * 0.7, -p.size * 1.3, p.size * 0.9, -p.size * 0.1, 0, p.size * 0.5);
            ctx.closePath();
            ctx.fill();

            // Organic main vein path overlay
            ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(0, p.size * 0.35);
            ctx.lineTo(0, -p.size * 0.5);
            ctx.stroke();
          } else {
            // Elegant, organic Rose Petal with smooth overlapping curves resembling falling satin
            ctx.beginPath();
            ctx.moveTo(0, p.size * 0.65);
            // Wide luscious left side
            ctx.bezierCurveTo(-p.size * 1.1, p.size * 0.3, -p.size * 1.25, -p.size * 0.7, -p.size * 0.25, -p.size * 1.05);
            // Delicate curled rose top
            ctx.bezierCurveTo(0, -p.size * 1.15, p.size * 0.25, -p.size * 1.05, p.size * 0.25, -p.size * 1.05);
            // Lush right side
            ctx.bezierCurveTo(p.size * 1.25, -p.size * 0.7, p.size * 1.1, p.size * 0.3, 0, p.size * 0.65);
            ctx.closePath();
            ctx.fill();

            // Velvet shadow highlighting
            const shadowGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size * 0.85);
            shadowGrad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
            shadowGrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
            shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.14)");
            ctx.fillStyle = shadowGrad;
            ctx.fill();
          }
        } else if (p.type === "flower") {
          // Complete glorious blooming flower
          ctx.beginPath();
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
            ctx.rotate(p.rotation);
          }

          const bloomVal = p.bloom || 1;
          const petalCount = p.petalCount || 5;
          const currentSize = p.size * bloomVal;

          // Layer 1: Outer Petals
          ctx.fillStyle = p.color;
          for (let i = 0; i < petalCount; i++) {
            const angle = (i * 2 * Math.PI) / petalCount;
            ctx.save();
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(currentSize * 0.55, -currentSize * 0.35, currentSize, 0);
            ctx.quadraticCurveTo(currentSize * 0.55, currentSize * 0.35, 0, 0);
            ctx.fill();
            ctx.restore();
          }

          // Layer 2: Inner blooming core layered crown for real craftsmanship
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          for (let i = 0; i < petalCount; i++) {
            const angle = (i * 2 * Math.PI) / petalCount + (Math.PI / petalCount);
            ctx.save();
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(currentSize * 0.35, -currentSize * 0.2, currentSize * 0.65, 0);
            ctx.quadraticCurveTo(currentSize * 0.35, currentSize * 0.2, 0, 0);
            ctx.fill();
            ctx.restore();
          }

          // Gold center stamen cluster
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(224, 175, 102, 0.92)"; // Radiant wild saffron
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        } else {
          // Soft ambient orbs
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.restore();
      });

      // Keep spawning new ambient orbs dynamically
      const ambientCount = particles.filter(p => p.type === "orb").length;
      if (ambientCount < 10) {
        particles.push(createParticle(Math.random() * canvas.width, canvas.height + 25, "orb"));
      }

      // Maintain high density of cherry blossom petals & blooming wild flowers
      const flowerCount = particles.filter(p => p.type === "flower").length;
      if (flowerCount < 14) {
        particles.push(createParticle(Math.random() * canvas.width, -32, "flower"));
      }

      const petalCountSim = particles.filter(p => p.type === "petal").length;
      if (petalCountSim < 20) {
        particles.push(createParticle(Math.random() * canvas.width, -25, "petal"));
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="aesthetic-magical-bg"
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none select-none"
      ref={canvasRef}
    />
  );
}
