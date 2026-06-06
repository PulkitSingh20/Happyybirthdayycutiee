/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import MagicalBackground from "./components/MagicalBackground";
import CursorSparkles from "./components/CursorSparkles";
import Letter from "./components/Letter";
import Cake from "./components/Cake";
import Wishes from "./components/Wishes";
import Souvenir from "./components/Souvenir";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Gift, 
  Sparkles, 
  Heart, 
  Music, 
  Music4,
  Volume2, 
  VolumeX, 
  Moon, 
  Compass, 
  Star 
} from "lucide-react";

type Chapter = "letter" | "cake" | "wishes" | "souvenir";

export default function App() {
  const [activeChapter, setActiveChapter] = useState<Chapter>("letter");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [floatingNoteCount, setFloatingNoteCount] = useState<number[]>([]);

  // Simple high-end glockenspiel chime synthesizer using Web Audio API
  const playBellChime = (frequecy: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Chime wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequecy, ctx.currentTime);
      
      // High end decay envelop like a music box
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio Context not allowed or initialized yet", e);
    }
  };

  const handleChapterChange = (chapter: Chapter) => {
    setActiveChapter(chapter);
    
    // Play harmonic chime notes when tapping tabs
    const notes: Record<Chapter, number> = {
      letter: 523.25, // C5
      cake: 659.25,   // E5
      wishes: 880.00,  // A5
      souvenir: 1046.50 // C6
    };
    playBellChime(notes[chapter]);

    // Add visual floating music note particle on tap if sound is enabled
    if (soundEnabled) {
      setFloatingNoteCount((p) => [...p, Date.now()]);
    }
  };

  // Clean old music notes from DOM dynamically
  useEffect(() => {
    if (floatingNoteCount.length > 0) {
      const timer = setTimeout(() => {
        setFloatingNoteCount((p) => p.slice(1));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [floatingNoteCount]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden pt-6 pb-12 selection:bg-rose-100 selection:text-[#912d2b]">
      {/* Dynamic Magical Sparkle Background */}
      <MagicalBackground />

      {/* Interactive Cursor Trail Sparkles */}
      <CursorSparkles />

      {/* Embedded Ambient Chime Controller (Glassmorphic pill at top right) */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const nextVal = !soundEnabled;
            setSoundEnabled(nextVal);
            if (nextVal) {
              // play sweet welcome chime
              setTimeout(() => playBellChime(523.25), 0);
              setTimeout(() => playBellChime(659.25), 150);
              setTimeout(() => playBellChime(783.99), 300);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide shadow-md backdrop-blur-md transition-all cursor-pointer border ${
            soundEnabled 
              ? "bg-[#912d2b]/10 text-[#912d2b] border-[#912d2b]/20" 
              : "bg-white/70 text-stone-500 border-stone-200/60"
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Chimes On ♫</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Silent Bell</span>
            </>
          )}
        </motion.button>
      </div>

      {/* FLOATING MUSIC CHIMES INDICATORS */}
      {floatingNoteCount.map((id) => (
        <motion.div
          key={id}
          initial={{ opacity: 0.8, y: 15, x: 20, scale: 0.8 }}
          animate={{ opacity: 0, y: -80, x: -10, scale: 1.3, rotate: -25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed top-12 right-12 z-50 pointer-events-none text-[#912d2b] font-serif font-semibold text-sm flex items-center gap-0.5"
        >
          <Music4 className="w-4 h-4 animate-bounce" /> <span>♪</span>
        </motion.div>
      ))}

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 flex-grow flex flex-col justify-start relative z-10 pt-4 md:pt-10">
        
        {/* Header Emblem Panel */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center mb-10 select-none"
        >
          {/* Celestial Emblem */}
          <div className="relative flex items-center justify-center w-12 h-12 mb-3">
            <Moon className="absolute w-6 h-6 text-amber-500/10 rotate-[-15deg]" />
            <Star className="w-5 h-5 text-[#c5a059] fill-[#c5a059] relative z-10 animate-gentle-glow" />
            <div className="absolute w-8 h-8 rounded-full border border-dashed border-[#c5a059]/30 animate-spin" style={{ animationDuration: "25s" }} />
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-stone-800 font-normal tracking-widest uppercase py-1">
            Happy Birthday, Shrishti
          </h1>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[1px] bg-[#eae4da]" />
            <span className="font-serif italic text-stone-500/80 text-xs md:text-sm tracking-wide">
              A serene serenade celebrating starlight, grace, and dreams
            </span>
            <div className="w-8 h-[1px] bg-[#eae4da]" />
          </div>
        </motion.header>

        {/* Chapter Tabs Section */}
        <div className="flex justify-center mb-12">
          <nav className="inline-flex bg-[#fbf9f6] border border-[#eae4da] shadow-sm rounded-2xl p-1.5 md:p-2 items-center gap-1.5 md:gap-3">
            {[
              { id: "letter", label: "I. Letter", icon: Mail },
              { id: "cake", label: "II. Cake", icon: Gift },
              { id: "wishes", label: "III. Oracle", icon: Star },
              { id: "souvenir", label: "IV. Souvenir", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeChapter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleChapterChange(tab.id as Chapter)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-medium tracking-wide transition-all relative cursor-pointer ${
                    isActive 
                      ? "bg-white text-stone-800 shadow-sm border border-stone-200/50" 
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#912d2b]" : "text-stone-300"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c5a059]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Multi-chapter Stage with Smooth Transitions */}
        <div className="w-full relative min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeChapter === "letter" && <Letter />}
              {activeChapter === "cake" && <Cake />}
              {activeChapter === "wishes" && <Wishes />}
              {activeChapter === "souvenir" && <Souvenir />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Styled Minimalist Footer celebrating Shrishti */}
      <footer className="w-full text-center mt-16 relative z-10 px-4">
        <div className="w-full max-w-sm mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#eae4da] to-transparent mb-4" />
        <p className="text-[10px] font-sans tracking-widest text-[#c5a059] uppercase hover:text-amber-800 transition-colors">
          Coded in pure light for Shrishti’s special day
        </p>
        <p className="text-[9px] font-serif text-stone-400 italic mt-1">
          May the stars shine exceptionally bright in your sky tonight & always.
        </p>
      </footer>
    </div>
  );
}
