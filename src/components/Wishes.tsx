import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, Sun, Moon, TreePine, Flower2, Lightbulb, Heart } from "lucide-react";
import { WishingCard } from "../types";

export default function Wishes() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const cards: WishingCard[] = [
    {
      id: "wish-1",
      title: "The Star",
      category: "Guidance & Grace",
      iconName: "Star",
      illustration: "A golden geometric constellation mirroring a guiding compass.",
      message: "May the constellations align to guide your steps, Shrishti. Whenever the path ahead feels shrouded, may you find the quiet clarity to navigate by your own inner starlight. Your dreams are never too far away."
    },
    {
      id: "wish-2",
      title: "The Sun",
      category: "Vitality & Radiance",
      iconName: "Sun",
      illustration: "A minimal linework sun radiating warm golden rays.",
      message: "Wishing you days washed in warm sunshine, cozy cups of afternoon laughter, and a spirit that continuously reminds the world of summer. May your joy run deep and your heart always choose to rise."
    },
    {
      id: "wish-3",
      title: "The Moon",
      category: "Serenity & Dreams",
      iconName: "Moon",
      illustration: "A slender silver crescent moon floating inside starry spheres.",
      message: "May the evenings bring you quiet comfort, peaceful reflections, and restful slumber. Let the tides of life flow gently and may you always find grace in the chapters of quiet growth."
    },
    {
      id: "wish-4",
      title: "The Meadow",
      category: "Blooming & Healing",
      iconName: "Flower2",
      illustration: "A delicate sprig of wild lavender and roses intertwined.",
      message: "May you bloom in your own time, with absolute confidence. Just like the flowers in spring, may any silent struggles dissolve into beautiful green avenues of new beginnings, strength, and vibrant life."
    },
    {
      id: "wish-5",
      title: "The Forest",
      category: "Resilience & Quietude",
      iconName: "TreePine",
      illustration: "An elegant silhouette of tall pines beneath a soft fog.",
      message: "May your roots go deep, grounding you in wisdom and self-compassion. When storm winds blow, may you stand tall with quiet resilience, finding sanctuary in your own magnificent peace."
    },
    {
      id: "wish-6",
      title: "The Lantern",
      category: "Wisdom & Wonder",
      iconName: "Lightbulb",
      illustration: "A delicate glass lantern flickering with warm amber ember.",
      message: "May your mind remain an open, beautiful sketchbook of curiosity and wonder. May you never lose your beautiful perspective of finding poetry in ordinary days, coffee steam, and rain."
    }
  ];

  // Helper to map icon name to Lucide components safely
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case "Star": return <Star className={className} />;
      case "Sun": return <Sun className={className} />;
      case "Moon": return <Moon className={className} />;
      case "TreePine": return <TreePine className={className} />;
      case "Flower2": return <Flower2 className={className} />;
      case "Lightbulb": return <Lightbulb className={className} />;
      default: return <Star className={className} />;
    }
  };

  return (
    <div id="wishes-container" className="flex flex-col items-center justify-center py-6 w-full max-w-4xl mx-auto px-4 min-h-[500px]">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#c5a059] flex items-center justify-center gap-1">
          <Star className="w-3.5 h-3.5 fill-current animate-pulse" /> Chapter IV
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-tight mt-1">
          The Celestial Gardens
        </h2>
        <p className="text-stone-500 font-serif italic text-sm mt-1">
          Draw an Oracle Blessing Card from the garden to reveal a tailored poetic wish for your new chapter.
        </p>
      </div>

      {/* Card Carousel / Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-5 w-full">
        {cards.map((c) => {
          const isSelected = selectedCardId === c.id;
          return (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedCardId(c.id)}
              className={`cursor-pointer aspect-[3/5] bg-white border border-[#eae4da] shadow-md hover:shadow-xl rounded-xl p-3 flex flex-col justify-between text-center relative overflow-hidden transition-all group ${
                isSelected ? "ring-2 ring-[#c5a059]" : ""
              }`}
            >
              {/* Card Gold Trim lines inside face */}
              <div className="absolute inset-1.5 border border-amber-200/50 rounded-lg pointer-events-none" />
              <div className="absolute inset-2 border border-dashed border-stone-200/40 rounded-lg pointer-events-none" />

              {/* Top Card ID detail */}
              <span className="text-[9px] font-sans tracking-widest text-[#c5a059] uppercase block pt-1 select-none z-10">
                Oracle
              </span>

              {/* Icon / Illustrative sphere */}
              <div className="flex flex-col items-center justify-center my-auto py-2 z-10">
                <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center bg-stone-50 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors shadow-xs">
                  {renderIcon(c.iconName, "w-5 h-5 text-stone-600 group-hover:text-amber-700 transition-colors")}
                </div>
                <h3 className="font-serif text-sm font-semibold text-stone-800 mt-2.5">
                  {c.title}
                </h3>
                <span className="text-[9px] font-sans tracking-tight text-[#c5a059] uppercase leading-none opacity-80 mt-1">
                  {c.category}
                </span>
              </div>

              {/* Delicate card indicator node */}
              <div className="w-full flex items-center justify-center pb-2 z-10">
                <div className="w-1 h-1 rounded-full bg-stone-300 group-hover:bg-[#c5a059]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Card Reading Pane */}
      <div className="w-full max-w-xl mt-12">
        <AnimatePresence mode="wait">
          {selectedCardId ? (
            <motion.div
              key={selectedCardId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white border border-[#eae4da] shadow-lg rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden"
            >
              {/* Outer blurred background element for luxury feel */}
              <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Double border cards lines for symmetry */}
              <div className="absolute inset-3 border border-dashed border-stone-100 rounded-xl pointer-events-none" />

              {(() => {
                const selectedCard = cards.find(c => c.id === selectedCardId)!;
                return (
                  <div className="relative z-10">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center bg-amber-50">
                          {renderIcon(selectedCard.iconName, "w-4.5 h-4.5 text-amber-800")}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-stone-800 font-semibold leading-none">
                            {selectedCard.title}
                          </h4>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-[#c5a059]">
                            {selectedCard.category}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCardId(null)}
                        className="text-[10px] font-sans tracking-widest text-[#912d2b] hover:text-stone-800 uppercase pb-0.5 border-b border-amber-100 cursor-pointer"
                      >
                        Clear Card
                      </button>
                    </div>

                    <div className="text-center font-serif text-xs italic text-stone-400 mb-4 bg-stone-50 py-1 rounded-sm border border-stone-100 select-none">
                      “{selectedCard.illustration}”
                    </div>

                    <blockquote className="font-serif text-stone-700 leading-relaxed text-center italic text-base md:text-lg px-4 md:px-8 py-2 relative block">
                      <span className="absolute -top-3 left-2 font-serif text-4xl text-amber-200 pointer-events-none select-none">“</span>
                      {selectedCard.message}
                      <span className="absolute -bottom-6 right-2 font-serif text-4xl text-amber-200 pointer-events-none select-none">”</span>
                    </blockquote>

                    <div className="flex justify-center mt-8 -mb-2">
                      <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                          <Heart key={i} className="w-3.5 h-3.5 text-rose-300 fill-current animate-ping" style={{ animationDelay: `${i * 0.4}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div
              key="no-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              className="text-center py-6 border border-dashed border-[#eae4da] bg-white/40 backdrop-blur-xs rounded-2xl"
            >
              <p className="font-serif italic text-sm text-stone-400">
                Select a celestial blessing card above to unveil Shrishti's dynamic horoscope.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
