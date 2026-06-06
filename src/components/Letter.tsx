import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, HeartOff, MailOpen, Compass, Leaf } from "lucide-react";

interface TypewriterParagraphProps {
  text: string;
  active: boolean;
  skip: boolean;
  onComplete: () => void;
}

function TypewriterParagraph({ text, active, skip, onComplete }: TypewriterParagraphProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      return;
    }
    if (skip) {
      setDisplayedText(text);
      onComplete();
      return;
    }

    let index = 0;
    let timerId: number;

    const typeNextChar = () => {
      if (index < text.length) {
        const nextChar = text.charAt(index);
        setDisplayedText(text.slice(0, index + 1));
        index++;

        // Calculate organic typewriter timing delay
        let delay = 16 + Math.random() * 12; // Base speed: 16ms - 28ms

        if (nextChar === "." || nextChar === "!" || nextChar === "?") {
          delay = 340; // Elegant stop at sentence ends
        } else if (nextChar === "," || nextChar === "—" || nextChar === ";") {
          delay = 140; // Soft breath at sub-clauses
        }

        timerId = window.setTimeout(typeNextChar, delay);
      } else {
        onComplete();
      }
    };

    // Begin typing small buffer delay
    timerId = window.setTimeout(typeNextChar, 100);

    return () => window.clearTimeout(timerId);
  }, [text, active, skip, onComplete]);

  return (
    <p className="indent-6 text-stone-700 leading-relaxed text-left text-[14px] md:text-[15px] select-none">
      {displayedText}
      {active && !skip && displayedText.length < text.length && (
        <span className="inline-block w-1 h-3.5 ml-0.5 bg-amber-600 animate-pulse align-middle" />
      )}
    </p>
  );
}

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealed, setIsSealed] = useState(true);
  const [typingStage, setTypingStage] = useState(0);
  const [skipTyping, setSkipTyping] = useState(false);

  const handleOpenLetter = () => {
    setIsSealed(false);
    setTimeout(() => {
      setIsOpen(true);
      setTypingStage(1);
      setSkipTyping(false);
    }, 400); // smooth sequence: unseal, then slide out
  };

  return (
    <div id="aesthetic-letter-container" className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto px-4 min-h-[500px]">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#c5a059] flex items-center justify-center gap-1">
          <Leaf className="w-3.5 h-3.5 animate-pulse" /> Chapter I
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-tight mt-1">
          The Stationery Box
        </h2>
        <p className="text-stone-500 font-serif italic text-sm mt-1">
          A sealed letter waiting just for you.
        </p>
      </div>

      <div className="relative w-full aspect-[4/3] max-w-md flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Envelope State */
            <motion.div
              key="envelope"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-72 md:h-80 bg-[#fbf9f6] rounded-xl shadow-2xl border-2 border-[#eae4da] flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.02 }}
            >
              {/* Envelope back triangles/linings */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#faf2e9] via-transparent to-[#f4ebe1] pointer-events-none" />
              
              {/* Back lining lines */}
              <div className="absolute top-0 right-0 w-full h-1/2 border-b border-[#eae4da] border-dashed pointer-events-none opacity-40" />

              {/* Subdued design badge on envelope top fold */}
              <div className="absolute top-4 font-serif text-[10px] md:text-xs tracking-widest uppercase text-stone-400 group-hover:text-stone-600 transition-colors">
                Private & Personal
              </div>

              {/* Interactive Wax Seal */}
              <div className="relative flex flex-col items-center justify-center z-10">
                <motion.div
                  animate={isSealed ? { scale: [1, 1.05, 1] } : { scale: 0.8 }}
                  transition={isSealed ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : { duration: 0.2 }}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors border border-amber-900/10 ${
                    isSealed 
                      ? "bg-[#912d2B] hover:bg-[#a63c3a] shadow-red-900/20" 
                      : "bg-[#70211f]"
                  }`}
                >
                  {/* Wax Seal monogram/design */}
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white font-serif font-semibold text-lg select-none">
                    S
                  </div>
                  
                  {/* Outer melting wax look ripples */}
                  <div className="absolute -inset-1 rounded-full border-2 border-[#912d2B]/20 animate-ping opacity-10 pointer-events-none" />
                </motion.div>
                
                <span className="text-xs font-serif font-medium text-stone-500 mt-4 group-hover:text-amber-800 transition-colors animate-pulse">
                  Click to break the wax seal
                </span>
              </div>

              {/* Fine bottom edge stitch shadow */}
              <div className="absolute bottom-4 text-[10px] font-mono text-stone-400">
                Laced with gold & lavender
              </div>
            </motion.div>
          ) : (
            /* Open Paper Letter State */
            <motion.div
              key="letter-sheet"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative w-full shrink-0 min-h-[460px] max-w-md bg-white border border-[#eae4da] shadow-2xl rounded-lg p-6 md:p-8 flex flex-col justify-between overflow-hidden"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "100% 28px",
                lineHeight: "28px"
              }}
            >
              {/* Premium floral header graphic details inside paper */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-200 via-rose-300 to-[#c5a059]" />

              <div className="relative z-10 pt-4">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-4">
                  <span className="font-serif text-xs text-stone-400 tracking-wider">
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  <span className="font-serif text-xs text-[#c5a059] tracking-widest uppercase">
                    Aesthete № 24
                  </span>
                </div>

                <div className="font-serif text-lg text-amber-900 font-semibold mb-2 select-none">
                  Dearest Shrishti,
                </div>

                <div 
                  className="space-y-4 hover:opacity-95 transition-opacity"
                  onClick={() => setSkipTyping(true)}
                  title="Click anywhere on the paper to reveal full letter text instantly"
                >
                  <TypewriterParagraph
                    text="Some people carry a quiet, luminous starlight with them, gently illuminating the world around them without ever demanding the spotlight. Shrishti, you are beautifully and undeniably one of those rare, radiant souls."
                    active={typingStage >= 1}
                    skip={skipTyping}
                    onComplete={() => {
                      if (typingStage === 1) setTypingStage(2);
                    }}
                  />

                  <TypewriterParagraph
                    text="To celebrate your birthday today, I wanted to curate a cozy digital space just for you—a small, dedicated haven to reflect the elegance, grace, and exquisite warmth you bring into our lives."
                    active={typingStage >= 2}
                    skip={skipTyping}
                    onComplete={() => {
                      if (typingStage === 2) setTypingStage(3);
                    }}
                  />

                  <TypewriterParagraph
                    text="May this year greet you with gentle winds, comfortable mugs of hot tea on golden afternoons, peaceful evening walks, and beautiful dreams that steadily take flight. You deserve every kind word, every soft melody, and all the quiet wonders this universe holds."
                    active={typingStage >= 3}
                    skip={skipTyping}
                    onComplete={() => {
                      if (typingStage === 3) setTypingStage(4);
                    }}
                  />

                  {typingStage < 4 && !skipTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.35, 0.75, 0.35] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="text-[10px] text-amber-600/70 font-sans text-center mt-2 tracking-widest uppercase font-semibold select-none pointer-events-none"
                    >
                      ✦ Click paper to reveal instantly ✦
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Letter Footer inside lines */}
              <AnimatePresence>
                {(typingStage >= 4 || skipTyping) && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="relative z-10 flex flex-col items-end mt-6 pt-4 border-t border-dashed border-stone-200"
                  >
                    <span className="font-serif italic text-xs text-stone-500 select-none">
                      With warmest admiration & care,
                    </span>
                    <span className="font-script text-3xl text-amber-800 font-medium rotate-[-3deg] mt-1 pr-4 select-none">
                      A Dear Friend
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        setIsSealed(true);
                        setTypingStage(0);
                      }}
                      className="mt-6 text-[10px] font-sans tracking-widest text-[#c5a059] uppercase hover:text-amber-800 transition-colors pb-1 border-b border-[#eae4da] cursor-pointer"
                    >
                      ← Reseal Envelope
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background elegant watercolor corner detail (CSS) */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-rose-50/50 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-amber-50/55 rounded-full blur-xl pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-stone-400 font-serif italic text-xs"
        >
          {isOpen ? "“A gentle soul with a heart of pure gold.”" : "Break the seal above to open Shrishti's letter"}
        </motion.div>
      </div>
    </div>
  );
}
