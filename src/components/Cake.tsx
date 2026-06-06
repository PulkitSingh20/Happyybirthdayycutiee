import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Flame, Check, RotateCcw, Heart, Gift } from "lucide-react";
import { SecretWish } from "../types";

interface StarConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

export default function Cake() {
  const [candles, setCandles] = useState<boolean[]>([false, false, false, false, false]);
  const [wishText, setWishText] = useState("");
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [savedWishes, setSavedWishes] = useState<SecretWish[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<StarConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Resize canvas handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const triggerBurst = (x: number, y: number, count = 75) => {
    const goldColors = [
      "#ffd700", // Metallic gold
      "#ffdf00", // Bright yellow-gold
      "#f3e5ab", // Soft pastel gold
      "#d4af37", // Warm antique gold
      "#fcf09f", // Creamy gold light
    ];

    const tempParticles: StarConfettiParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Spawn outward velocities
      const speed = Math.random() * 11 + 3.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - Math.random() * 3.5;

      tempParticles.push({
        x,
        y,
        vx,
        vy,
        size: Math.random() * 8 + 5.5, // 5.5px to 13.5px
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.16,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.007, // lives for ~1.5 seconds
        gravity: Math.random() * 0.12 + 0.22, // falls downward beautifully
      });
    }

    particlesRef.current = [...particlesRef.current, ...tempParticles];

    if (!animationFrameRef.current) {
      startConfettiLoop();
    }
  };

  const startConfettiLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      if (particles.length === 0) {
        animationFrameRef.current = null;
        return;
      }

      particles.forEach((p, index) => {
        // Apply physics
        p.x += p.vx;
        p.vx *= 0.985; // drag
        p.y += p.vy;
        p.vy += p.gravity;
        p.vy *= 0.985; // drag
        
        p.rotation += p.spin;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(index, 1);
          return;
        }

        // Draw golden star
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size / 2;
        let rot = (Math.PI / 2) * 3;
        let sx = 0;
        let sy = 0;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          sx = Math.cos(rot) * outerRadius;
          sy = Math.sin(rot) * outerRadius;
          ctx.lineTo(sx, sy);
          rot += step;

          sx = Math.cos(rot) * innerRadius;
          sy = Math.sin(rot) * innerRadius;
          ctx.lineTo(sx, sy);
          rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();

        // Beautiful golden glow gradient
        const radialGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, outerRadius);
        radialGlow.addColorStop(0, "#ffffff");
        radialGlow.addColorStop(0.35, p.color);
        radialGlow.addColorStop(1, "rgba(197, 160, 89, 0)");
        
        ctx.fillStyle = radialGlow;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(updateAndDraw);
    };

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);
  };

  const triggerGoldConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e ? e.clientX : rect.width / 2;
    const clickY = e ? (e.clientY) : rect.height / 2;
    triggerBurst(clickX, clickY, 70);
  };

  // Load saved wishes from localStorage
  useEffect(() => {
    const wishes = localStorage.getItem("shrishtis_birthday_wishes");
    if (wishes) {
      try {
        setSavedWishes(JSON.parse(wishes));
      } catch (e) {
        console.error("Failed to parse saved wishes", e);
      }
    }
  }, []);

  const saveWish = (wish: string) => {
    const newWish: SecretWish = {
      id: Date.now().toString(),
      wish: wish.trim(),
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [newWish, ...savedWishes];
    setSavedWishes(updated);
    localStorage.setItem("shrishtis_birthday_wishes", JSON.stringify(updated));
  };

  const handleLightAll = () => {
    setCandles([true, true, true, true, true]);
    setErrorMessage("");
    setIsBlownOut(false);
  };

  const toggleCandle = (index: number) => {
    if (isBlownOut) {
      setIsBlownOut(false);
    }
    const copy = [...candles];
    copy[index] = !copy[index];
    setCandles(copy);
    setErrorMessage("");
  };

  const handleBlowout = (e: React.FormEvent) => {
    e.preventDefault();
    const allLit = candles.every((c) => c === true);
    
    if (!allLit) {
      setErrorMessage("Please light all 5 candles first by clicking on them to activate the magic! ✨");
      return;
    }

    if (!wishText.trim()) {
      setErrorMessage("Don't forget to write down your secret wish before blowing them out! 🌸");
      return;
    }

    // Save wish
    saveWish(wishText);
    
    // Extinguish candles
    setIsBlownOut(true);
    setCandles([false, false, false, false, false]);
    setShowConfetti(true);
    setWishText("");
    setErrorMessage("");

    // Dual spectacular corner firework fountains
    setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      triggerBurst(w * 0.2, h * 0.8, 60);
      triggerBurst(w * 0.8, h * 0.8, 60);
    }, 200);

    // Hide celebratory confetti popup after 6 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const handleResetCake = () => {
    setCandles([false, false, false, false, false]);
    setIsBlownOut(false);
    setErrorMessage("");
  };

  const handleDeleteWish = (id: string) => {
    const filtered = savedWishes.filter((w) => w.id !== id);
    setSavedWishes(filtered);
    localStorage.setItem("shrishtis_birthday_wishes", JSON.stringify(filtered));
  };

  return (
    <div id="cake-container" className="flex flex-col items-center justify-center py-6 w-full max-w-2xl mx-auto px-4 min-h-[500px]">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#c5a059] flex items-center justify-center gap-1">
          <Gift className="w-3.5 h-3.5 fill-current" /> Chapter II
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-tight mt-1">
          The Serenade of Light
        </h2>
        <p className="text-stone-500 font-serif italic text-sm mt-1">
          Click the candles to light them, type a wish, and blow them out with love.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-start">
        {/* Left/Middle Column: Interactive Cake */}
        <div className="col-span-1 md:col-span-7 flex flex-col items-center bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-[#eae4da] shadow-lg relative min-h-[420px]">
          
          {/* Candle Status Bar */}
          <div className="text-xs font-serif text-stone-500 mb-8 self-center h-5">
            {candles.every((c) => c) ? (
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                ✨ All candles glow bright. Shrishti is ready to make her wish!
              </span>
            ) : isBlownOut ? (
              <span className="text-[#912d2b] font-semibold flex items-center gap-1 animate-bounce">
                🎉 Your wish has been cast to the stars!
              </span>
            ) : (
              <span>
                Candles Lit: <strong className="text-stone-700">{candles.filter(Boolean).length}/5</strong> (Click each candle to spark a flame)
              </span>
            )}
          </div>

          {/* Interactive Cake Graphic Block */}
          <div className="relative w-full h-56 flex flex-col justify-end items-center select-none mt-4">
            
            {/* Candle Row */}
            <div className="absolute top-0 flex justify-between w-40 px-2 z-20">
              {candles.map((lit, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCandle(idx)}
                  className="flex flex-col items-center cursor-pointer group relative -top-3"
                  style={{
                    transform: `translateY(${idx % 2 === 0 ? "4px" : "0px"})`,
                  }}
                >
                  {/* Flicker flame */}
                  <div className="h-8 flex items-end justify-center w-6">
                    <AnimatePresence>
                      {lit && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1],
                            y: [0, -2, 0]
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ 
                            scale: { duration: 0.2 },
                            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="relative flex items-center justify-center pointer-events-none"
                        >
                          {/* Inner flame */}
                          <div className="w-2.5 h-6 bg-gradient-to-t from-[#c5a059] via-amber-400 to-[#912d2b] rounded-full filter blur-[0.5px]" />
                          {/* Outer glow ring */}
                          <div className="absolute w-5 h-7 bg-amber-200/50 rounded-full filter blur-sm -top-1 animate-pulse" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Candle Wick */}
                  <div className="w-[1.5px] h-2.5 bg-stone-700" />

                  {/* Candle Wax Body */}
                  <div
                    className={`w-3.5 h-12 rounded-t-sm transition-all duration-300 relative border-x border-stone-200/30 ${
                      lit 
                        ? "bg-gradient-to-b from-[#e7d8c9] to-rose-300 shadow-md scale-y-102" 
                        : "bg-gradient-to-b from-stone-200 to-stone-300"
                    }`}
                  >
                    {/* Tiny golden bands on candles */}
                    <div className="absolute top-2 left-0 right-0 h-0.5 bg-amber-400/80" />
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-amber-400/80" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Layer 3 (Top micro tier) */}
            <div className="w-44 h-12 bg-gradient-to-r from-[#fae7eb] via-white to-[#fae7eb] rounded-t-lg shadow-md border-t border-rose-100 flex items-center justify-center z-10 relative">
              {/* Cream drops overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-white rounded-full -mb-2 shadow-xs border-b border-rose-200/30" />
                ))}
              </div>
              <div className="w-full text-center text-[10px] font-serif uppercase tracking-widest text-stone-400 font-semibold select-none">
                Shrishti
              </div>
            </div>

            {/* Cake Layer 2 (Middle Tier) */}
            <div className="w-56 h-14 bg-gradient-to-r from-rose-100 via-[#faf4f0] to-rose-100 rounded-t-lg shadow-lg border-t border-rose-200 flex items-center justify-center z-5 relative">
              {/* Gold floral decorative band */}
              <div className="absolute inset-x-0 top-4 h-[1px] bg-amber-400/60" />
              <div className="absolute inset-x-0 bottom-4 h-[1px] bg-amber-400/60" />
              
              {/* Strawberry/Cream visual nodes */}
              <div className="absolute -top-3 flex justify-between w-48 px-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 bg-rose-400 rounded-full border border-rose-500 shadow-xs flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                ))}
              </div>

              {/* Cream drops overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-5 h-4 bg-[#faf4f0] rounded-full -mb-2 shadow-xs border-b border-rose-300/20" />
                ))}
              </div>
            </div>

            {/* Cake Layer 1 (Base tier) */}
            <div className="w-64 h-16 bg-gradient-to-r from-[#eed6da] via-white to-[#eed6da] rounded-t-lg shadow-xl border-t border-rose-100 relative">
              
              {/* Delicate gold dots decoration */}
              <div className="absolute top-6 left-0 right-0 flex justify-around px-4 opacity-50">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-amber-500 rounded-full" />
                ))}
              </div>

              {/* Floral design inside base tier */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif italic text-xs tracking-wider text-amber-900/40">
                  June 2026 • Seraphic Vibe
                </span>
              </div>

              {/* Cherry alignment on the shoulder of bottom tier */}
              <div className="absolute -top-3.5 flex justify-between w-[230px] px-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-red-500 rounded-full border border-red-600 shadow-xs flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Wooden Server Plate */}
            <div className="w-72 h-4 bg-gradient-to-b from-stone-100 to-stone-200 rounded-full shadow-2xl border border-stone-200 flex items-center justify-center">
              <div className="w-68 h-1.5 bg-[#eae4da] rounded-full opacity-60" />
            </div>
          </div>

          {/* Quick interactive utility buttons inside cake panel */}
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <button
              onClick={handleLightAll}
              className="text-xs font-sans tracking-wide px-3 py-1.5 bg-amber-100/60 text-amber-800 hover:bg-amber-100 transition-all rounded-md flex items-center gap-1.5 border border-amber-200 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Light All
            </button>
            <button
              onClick={triggerGoldConfetti}
              className="text-xs font-sans tracking-wide px-3 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-900 font-semibold hover:from-amber-500 hover:to-amber-600 transition-all rounded-md flex items-center gap-1.5 border border-amber-300 shadow-sm active:scale-95 cursor-pointer"
              title="Launch golden star-shaped confetti!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-950 animate-pulse" /> Sparkle Blast 🌟
            </button>
            <button
              onClick={handleResetCake}
              className="text-xs font-sans tracking-wide px-3 py-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-150 transition-all rounded-md flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Cake
            </button>
          </div>
        </div>

        {/* Right/Bottom Column: Wish Input and Saved Wishes */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
          {/* Wish Input Card */}
          <div className="bg-white border border-[#eae4da] shadow-md rounded-2xl p-5">
            <h3 className="font-serif text-lg text-stone-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Whisper a Secret Wish
            </h3>
            <p className="text-stone-500 text-xs font-sans mb-4 leading-relaxed">
              Write down your deepest aspiration, personal goal, or beautiful wish. Your whispers will be sealed securely in local storage.
            </p>

            <form onSubmit={handleBlowout} className="space-y-4">
              <textarea
                value={wishText}
                onChange={(e) => {
                  setWishText(e.target.value);
                  setErrorMessage("");
                }}
                maxLength={250}
                placeholder="I wish for a year filled with gentle mornings, cozy coffee..."
                className="w-full text-stone-700 bg-stone-50 border border-[#eae4da] hover:border-amber-200 focus:border-[#c5a059] focus:outline-none rounded-xl p-3 text-sm font-sans h-24 resize-none transition-colors placeholder:text-stone-400"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400">
                  {wishText.length}/250 characters
                </span>
                
                {errorMessage && (
                  <span className="text-[11px] text-[#912d2b] font-medium leading-tight max-w-[180px] text-right">
                    {errorMessage}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#912d2b] hover:bg-[#a63c3a] text-white font-sans font-medium tracking-wide text-sm py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Make a Wish & Blow Out 🕯️
              </button>
            </form>
          </div>

          {/* Golden Wish Book (Saved wishes) */}
          <div className="bg-white/75 backdrop-blur-xs border border-[#eae4da] shadow-sm rounded-2xl p-5 flex flex-col max-h-[220px]">
            <h4 className="font-serif text-sm text-stone-700 font-semibold mb-3 border-b border-stone-100 pb-1.5 flex items-center justify-between">
              <span>📖 Shrishti's Ledger of Wishes</span>
              <span className="text-[10px] font-sans font-normal text-stone-400 px-2 py-0.5 bg-stone-100 rounded-full">
                {savedWishes.length} active
              </span>
            </h4>

            <div className="overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
              {savedWishes.length === 0 ? (
                <div className="text-center py-6">
                  <span className="block text-2xl filter saturate-50">✨</span>
                  <p className="text-center text-[11px] font-serif italic text-stone-400 mt-1">
                    No wishes saved yet. Light the candles to log one!
                  </p>
                </div>
              ) : (
                savedWishes.map((w, index) => (
                  <div key={w.id} className={`pt-2.5 ${index === 0 ? "pt-0 border-t-0" : ""}`}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs text-stone-700 font-sans leading-relaxed break-words flex-1 italic">
                        “{w.wish}”
                      </p>
                      <button
                        onClick={() => handleDeleteWish(w.id)}
                        className="text-[10px] text-stone-400 hover:text-red-600 font-sans transition-colors self-end pb-0.5 ml-2 cursor-pointer"
                      >
                        erase
                      </button>
                    </div>
                    <span className="block text-[9px] font-mono text-stone-400 mt-1">
                      {w.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confetti & Celebration Sparkle Popup Modals */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-sm"
          >
            <div className="bg-white border-2 border-amber-200 shadow-2xl rounded-3xl p-6 md:p-8 max-w-sm text-center relative overflow-hidden flex flex-col items-center">
              {/* Outer decorative golden background circle */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/5 rounded-full" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#912d2b]/5 rounded-full" />

              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 border border-amber-200">
                <Sparkles className="w-8 h-8 text-amber-600 animate-spin" />
              </div>

              <h4 className="font-serif text-2xl text-stone-800 tracking-tight">
                Wish Cast Successfully!
              </h4>
              <p className="text-stone-500 text-xs font-sans mt-3 leading-relaxed">
                As the quiet smoke ascends, your gentle thoughts are written upon the winds. Sleep peacefully knowing your heart’s desire is treasured and saved securely in your beautiful memory journal.
              </p>

              <div className="w-full h-[1px] bg-stone-100 my-4" />

              <button
                onClick={() => setShowConfetti(false)}
                className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white font-sans text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer"
              >
                Thank You ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-50 select-none"
      />
    </div>
  );
}
