import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Upload, Camera, Trash2, Heart, RefreshCw, Layers, Sliders, Play, Pause, Bookmark, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface SouvenirSlot {
  id: string;
  codename: string;
  title: string;
  poeticPrompt: string;
  description: string;
  suggestedEmoji: string;
}

const TEMPLATE_SLOTS: SouvenirSlot[] = [
  {
    id: "slot-1",
    codename: "golden-hour",
    title: "Golden Hour Sunset Portrait",
    poeticPrompt: "The portrait of Shrishti wearing glasses, smiling in warm, sunset-kissed amber light.",
    description: "A gorgeous warm glow that represents her brilliant, gentle spirit lighting up the room.",
    suggestedEmoji: "👓✨"
  },
  {
    id: "slot-2",
    codename: "frangipani",
    title: "Frangipani Blossom Close-up",
    poeticPrompt: "Shrishti's sparkling outdoor close-up portrait with a plumeria flower behind her ear.",
    description: "Capturing natural winds and her sweet smile matched with tropical blossoms.",
    suggestedEmoji: "🌸🍃"
  },
  {
    id: "slot-3",
    codename: "pure-radiance",
    title: "Playful Radiant Laugh",
    poeticPrompt: "Shrishti smiling with absolute delight, hands held elegantly framing her cheeks.",
    description: "Her joyful laugh of complete happiness that feels like counting stardust.",
    suggestedEmoji: "🙌💕"
  },
  {
    id: "slot-4",
    codename: "cozy-mirror",
    title: "Cozy Striped Sweater Mirror Selfie",
    poeticPrompt: "A cute mirror selfie of Shrishti holding her phone in a cozy matching striped sweater.",
    description: "A beautifully playful, chic snapshot capturing her elegant casual style.",
    suggestedEmoji: "🤳🧶"
  },
  {
    id: "slot-5",
    codename: "sunlit-serenity",
    title: "Sunlit Close-up Portrait",
    poeticPrompt: "Close-up portrait of Shrishti in the sun, holding a charming nose-pin with wavy hair.",
    description: "Soft radiant sunshine highlighting her wavy locks and quiet, peaceful gaze.",
    suggestedEmoji: "☀️💫"
  },
  {
    id: "slot-6",
    codename: "heart-crown",
    title: "Floating Hearts Cozy Headrest",
    poeticPrompt: "Shrishti resting her face on her hand with cute pink interactive hearts floating overhead.",
    description: "Soft cozy features layered with sweet, warm clouds of admiration.",
    suggestedEmoji: "💖🧸"
  },
  {
    id: "slot-7",
    codename: "royal-crimson",
    title: "Royal Crimson Anarkali",
    poeticPrompt: "Shrishti in a rich traditional red dress on a sofa in front of a majestic oil painting of flowers.",
    description: "A grand aesthetic statement of pure grace, poise, and heritage.",
    suggestedEmoji: "👑🌹"
  },
  {
    id: "slot-8",
    codename: "dimple-blossom",
    title: "Dimpled Blossom Dream",
    poeticPrompt: "Shrishti smiling gently with closed eyes, framing her cheeks with flower ornament in hair.",
    description: "An absolute masterpieces of quiet peace, warmth, and beautiful dreams.",
    suggestedEmoji: "😌🌺"
  }
];

export default function Souvenir() {
  const [photoData, setPhotoData] = useState<Record<string, string>>({});
  const [slotNotes, setSlotNotes] = useState<Record<string, string>>({});
  const [slotFilters, setSlotFilters] = useState<Record<string, string>>({});
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [currentSlideshowId, setCurrentSlideshowId] = useState<string>("slot-1");
  // Slideshow plays immediately by default to provide beautiful automatic slide shows out of the box!
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(true);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingError, setLoadingError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedPhotos = localStorage.getItem("shrishti_souvenir_photos");
    const savedNotes = localStorage.getItem("shrishti_souvenir_notes");
    const savedFilters = localStorage.getItem("shrishti_souvenir_filters");
    if (savedPhotos) {
      try { setPhotoData(JSON.parse(savedPhotos)); } catch (e) {}
    }
    if (savedNotes) {
      try { setSlotNotes(JSON.parse(savedNotes)); } catch (e) {}
    }
    if (savedFilters) {
      try { setSlotFilters(JSON.parse(savedFilters)); } catch (e) {}
    }
  }, []);

  // Save to local storage
  const persistData = (updatedPhotos: Record<string, string>, updatedNotes: Record<string, string>, updatedFilters: Record<string, string>) => {
    localStorage.setItem("shrishti_souvenir_photos", JSON.stringify(updatedPhotos));
    localStorage.setItem("shrishti_souvenir_notes", JSON.stringify(updatedNotes));
    localStorage.setItem("shrishti_souvenir_filters", JSON.stringify(updatedFilters));
  };

  // Helper to resize image using an offscreen canvas to prevent exceeding localStorage quota limit
  const resizeAndCompress = (file: File, callback: (resizedBase64: string) => void) => {
    setIsProcessing(true);
    setLoadingError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Target bounded bounds around 450px max width/height
        const maxDim = 450;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          // Compress down nicely with JPEG quality 0.8
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          callback(compressed);
        } else {
          callback(src); // fallback to original if canvas fails
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setLoadingError("Could not load image reference.");
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resizeAndCompress(file, (base64) => {
      const newPhotos = { ...photoData, [slotId]: base64 };
      setPhotoData(newPhotos);
      persistData(newPhotos, slotNotes, slotFilters);
    });
  };

  const handleUploadClick = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlotId(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleDeletePhoto = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPhotos = { ...photoData };
    delete updatedPhotos[slotId];
    setPhotoData(updatedPhotos);
    persistData(updatedPhotos, slotNotes, slotFilters);
  };

  const handleFilterToggle = (slotId: string, filterName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFilters = { ...slotFilters, [slotId]: filterName };
    setSlotFilters(updatedFilters);
    persistData(photoData, slotNotes, updatedFilters);
  };

  const handleUpdateNote = (slotId: string, text: string) => {
    const updatedNotes = { ...slotNotes, [slotId]: text };
    setSlotNotes(updatedNotes);
    persistData(photoData, updatedNotes, slotFilters);
  };

  const getFilterStyle = (filter?: string) => {
    switch (filter) {
      case "golden": return "sepia(0.2) saturate(1.45) contrast(1.05) hue-rotate(-5deg)";
      case "rose": return "saturate(1.2) sepia(0.1) hue-rotate(330deg) brightness(1.02)";
      case "velvet": return "brightness(0.9) contrast(1.15) saturate(1.1)";
      case "mono": return "grayscale(1) contrast(1.2) brightness(0.95)";
      default: return "none";
    }
  };

  // Spectacular interactive vector spawner for empty frames
  const renderPlaceholderScene = (codename: string, emoji: string, isGridItem: boolean = true) => {
    let background = "from-amber-50/50 to-orange-50/20";
    let bloomElement = null;

    switch (codename) {
      case "golden-hour":
        background = "from-amber-100/50 via-orange-100/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Pulsing sunset halo */}
            <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-400 to-orange-300 opacity-20 animate-ping absolute" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200/95 shadow-inner relative flex items-center justify-center">
              <span className="text-2xl filter drop-shadow select-none">👓</span>
            </div>
            <span className="text-[9px] font-sans text-amber-700/60 font-semibold tracking-wider mt-1.5 uppercase">Sunset Glow</span>
          </div>
        );
        break;
      case "frangipani":
        background = "from-emerald-50/30 via-pink-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Rotating floral wreath */}
            <div className="w-16 h-16 border border-[#c5a059]/15 rounded-full animate-spin [animation-duration:15s] absolute flex items-center justify-center">
              <div className="w-3.5 h-7 bg-white/70 rounded-full absolute translate-y-[-12px]" />
              <div className="w-7 h-3.5 bg-white/70 rounded-full absolute translate-x-[12px]" />
              <div className="w-3.5 h-7 bg-white/70 rounded-full absolute translate-y-[12px]" />
              <div className="w-7 h-3.5 bg-white/70 rounded-full absolute translate-x-[-12px]" />
            </div>
            <span className="text-2xl absolute z-10 animate-bounce">🌸</span>
            <span className="text-[9px] font-sans text-stone-450 font-semibold tracking-wider mt-[28px] uppercase">Blossom Air</span>
          </div>
        );
        break;
      case "pure-radiance":
        background = "from-pink-100/30 via-rose-100/10 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-200/20 absolute animate-pulse" />
            <span className="text-2xl animate-pulse relative z-10">🙌</span>
            <span className="text-[9px] font-sans text-rose-700/50 font-semibold tracking-wider mt-1.5 uppercase">Radiant Laugh</span>
          </div>
        );
        break;
      case "cozy-mirror":
        background = "from-stone-100/50 via-amber-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-lg bg-linear-to-tr from-stone-200/40 to-stone-50/40 border border-stone-200/30 rotate-12 absolute animate-pulse" />
            <span className="text-2xl -rotate-12">🤳</span>
            <span className="text-[9px] font-sans text-stone-500 font-semibold tracking-wider mt-1.5 uppercase">Chic Knits</span>
          </div>
        );
        break;
      case "sunlit-serenity":
        background = "from-yellow-100/30 via-amber-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-dashed border-amber-300/40 animate-spin [animation-duration:10s] absolute" />
            <span className="text-2xl animate-pulse">☀️</span>
            <span className="text-[9px] font-sans text-amber-600/65 font-semibold tracking-wider mt-1.5 uppercase">Pure Sunbeam</span>
          </div>
        );
        break;
      case "heart-crown":
        background = "from-rose-100/40 via-pink-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-rose-300/15 absolute animate-ping" />
            <div className="flex gap-1 items-center relative">
              <span className="text-xs -translate-y-2 animate-bounce">💖</span>
              <span className="text-2xl">🧸</span>
              <span className="text-xs translate-y-2 animate-bounce">💖</span>
            </div>
            <span className="text-[9px] font-sans text-rose-500/60 font-semibold tracking-wider mt-1 uppercase">Warm Hugs</span>
          </div>
        );
        break;
      case "royal-crimson":
        background = "from-red-100/30 via-amber-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-18 h-18 rounded-full bg-rose-500/10 absolute blur-xs scale-110 animate-pulse" />
            <span className="text-2xl filter drop-shadow select-none animate-bounce">🌹</span>
            <span className="text-[9px] font-sans text-red-700/60 font-semibold tracking-wider mt-1.5 uppercase">Royal Heritage</span>
          </div>
        );
        break;
      case "dimple-blossom":
        background = "from-purple-100/30 via-pink-50/20 to-stone-50/10";
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-pink-200/35 absolute scale-75 animate-pulse" />
            <span className="text-2xl animate-pulse">🌺</span>
            <span className="text-[9px] font-sans text-purple-700/50 font-semibold tracking-wider mt-1.5 uppercase">Sweet Dimple</span>
          </div>
        );
        break;
      default:
        bloomElement = (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl animate-pulse">{emoji}</span>
          </div>
        );
    }

    return (
      <div className={`w-full h-full bg-gradient-to-br ${background} p-1 rounded-2xs border border-[#c5a059]/25 shadow-[0_4px_12px_rgba(197,160,89,0.06),inset_0_0_10px_rgba(0,0,0,0.02)] flex items-center justify-center relative overflow-hidden group/placeholder`}>
        {bloomElement}
        {isGridItem && (
          <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[1px] opacity-0 group-hover/placeholder:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[9px] font-sans font-bold tracking-widest text-[#912d2b] bg-white/95 px-2 py-1 rounded-full border border-stone-200 shadow-sm uppercase select-none">
              Upload Photo
            </span>
          </div>
        )}
      </div>
    );
  };

  // Slideshow cycle: Loops through ALL 8 frames automatically with beautiful cinematic precision
  useEffect(() => {
    let interval: number;
    if (isPlayingSlideshow) {
      interval = window.setInterval(() => {
        setCurrentSlideshowId((prevId) => {
          const currentIndex = TEMPLATE_SLOTS.findIndex((s) => s.id === prevId);
          const nextIndex = (currentIndex + 1) % TEMPLATE_SLOTS.length;
          return TEMPLATE_SLOTS[nextIndex].id;
        });
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isPlayingSlideshow]);

  const toggleSlideshow = () => {
    setIsPlayingSlideshow(!isPlayingSlideshow);
  };

  // Helper to safely select slot and pause automatic reel
  const handleSlotClick = (slotId: string) => {
    setIsPlayingSlideshow(false); // Pause auto-scrolling to let user focus and customize
    setActiveSlotId(slotId);
    setCurrentSlideshowId(slotId);
  };

  const handleNextSlide = () => {
    setIsPlayingSlideshow(false);
    setCurrentSlideshowId((prevId) => {
      const currentIndex = TEMPLATE_SLOTS.findIndex((s) => s.id === prevId);
      const nextIndex = (currentIndex + 1) % TEMPLATE_SLOTS.length;
      return TEMPLATE_SLOTS[nextIndex].id;
    });
  };

  const handlePrevSlide = () => {
    setIsPlayingSlideshow(false);
    setCurrentSlideshowId((prevId) => {
      const currentIndex = TEMPLATE_SLOTS.findIndex((s) => s.id === prevId);
      const prevIndex = (currentIndex - 1 + TEMPLATE_SLOTS.length) % TEMPLATE_SLOTS.length;
      return TEMPLATE_SLOTS[prevIndex].id;
    });
  };

  const loadedCount = TEMPLATE_SLOTS.filter(s => !!photoData[s.id]).length;

  return (
    <div id="souvenir-scrapbook-root" className="flex flex-col items-center justify-center py-6 w-full max-w-5xl mx-auto px-4 min-h-[500px]">
      
      {/* Hidden File Initiator */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (activeSlotId) handleFileChange(e, activeSlotId);
        }}
        accept="image/*"
        className="hidden"
      />

      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#c5a059] flex items-center justify-center gap-1 animate-pulse">
          <Trophy className="w-3.5 h-3.5" /> Chapter V
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 tracking-tight mt-1">
          The Memory Souvenir Box
        </h2>
        <p className="text-stone-500 font-serif italic text-sm mt-1 max-w-xl mx-auto">
          Drag & drop or double click to place Shrishti's 8 beautiful photos into their pre-customized frames. Let's build a spectacular legacy souvenir!
        </p>

        {/* Souvenir Completion Status Ring */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <div className="bg-white border border-[#eae4da] px-4 py-1.5 rounded-full flex items-center gap-2 text-xs shadow-xs">
            <span className="font-sans font-medium text-stone-500">Museum Slots Filled:</span>
            <div className="flex items-center gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    i < loadedCount 
                      ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                      : "bg-stone-200"
                  }`}
                />
              ))}
              <span className="font-mono font-semibold text-stone-700 ml-1">({loadedCount}/8)</span>
            </div>
          </div>

          <button
            onClick={toggleSlideshow}
            className={`text-xs px-4 py-1.5 rounded-xl font-sans font-semibold tracking-wide flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border ${
              isPlayingSlideshow 
                ? "bg-red-50 text-red-700 border-red-200 animate-pulse" 
                : "bg-white text-stone-700 hover:bg-stone-50 border-[#eae4da]"
            }`}
          >
            {isPlayingSlideshow ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause Soul Reel
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Souvenir Slideshow
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🎬 Memory Slideshow Showcase Theater */}
      <div className="w-full bg-[#fdfaf2] hover:bg-[#faf6eb] transition-all duration-500 border border-[#eae3be] rounded-3xl p-6 md:p-8 mb-12 shadow-[0_15px_35px_rgba(197,160,89,0.08),0_5px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group/theater">
        {/* Decorative inner corner frame marks */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#c5a059]/20" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#c5a059]/20" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#c5a059]/20" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#c5a059]/20" />
        <div className="absolute inset-5 border border-dashed border-[#c5a059]/10 rounded-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left side: Beautiful Portrait Viewport with thin golden borders */}
          <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[290px] aspect-square relative select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideshowId}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full animate-fadeIn"
                >
                  {/* Majestic Golden Frame */}
                  <div className="w-full h-full p-2 bg-gradient-to-br from-[#fffdfa] via-[#fdfbf2] to-[#f4ecd8] rounded-2xl border border-[#c5a059]/45 shadow-[0_12px_28px_rgba(197,160,89,0.16)] flex items-center justify-center relative">
                    <div className="w-full h-full overflow-hidden rounded-xl border border-[#c5a059]/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] relative group">
                      {photoData[currentSlideshowId] ? (
                        <img
                          src={photoData[currentSlideshowId]}
                          alt={TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.title}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-102 group-hover:scale-108"
                          style={{
                            filter: getFilterStyle(slotFilters[currentSlideshowId])
                          }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        renderPlaceholderScene(
                          TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.codename || "",
                          TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.suggestedEmoji || "",
                          false
                        )
                      )}

                      {/* Filter overlay tag */}
                      {photoData[currentSlideshowId] && slotFilters[currentSlideshowId] && slotFilters[currentSlideshowId] !== "none" && (
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-[8px] uppercase tracking-widest font-sans text-amber-200 px-2 py-0.5 rounded-full border border-amber-200/20">
                          {slotFilters[currentSlideshowId]} Ambiance
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side: Information block, controls & pagination */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-between text-left min-h-[290px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideshowId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                {/* Meta line */}
                <div className="flex items-center gap-2 select-none">
                  <span className="text-[10px] font-mono tracking-widest text-[#912d2b] font-bold bg-amber-100/60 px-2 py-0.5 rounded-md">
                    MEMORY {TEMPLATE_SLOTS.findIndex(s => s.id === currentSlideshowId) + 1} OF 8
                  </span>
                  {isPlayingSlideshow && (
                    <span className="flex items-center gap-1 text-[9px] font-sans font-bold text-amber-600 uppercase tracking-widest animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Active Slide Loop
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl md:text-2xl text-stone-800 font-bold tracking-tight mt-0.5 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">{TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.suggestedEmoji}</span>
                  {TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.title}
                </h3>

                {/* Poetic description */}
                <p className="text-stone-500 font-serif italic text-sm text-[13px] md:text-sm bg-stone-50/50 p-3 rounded-lg border border-stone-200/40 leading-relaxed shadow-xs">
                  "{TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.poeticPrompt}"
                </p>

                {/* Slot description */}
                <p className="text-stone-500 font-sans text-xs leading-relaxed max-w-md">
                  {TEMPLATE_SLOTS.find(s => s.id === currentSlideshowId)?.description}
                </p>

                {/* User's Diary Annotation */}
                {slotNotes[currentSlideshowId] ? (
                  <div className="mt-2 border-l-2 border-[#912d2b] pl-3 py-1 bg-rose-50/20 rounded-r-lg">
                    <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-stone-400 block pb-0.5">
                      Annotation from Diary
                    </span>
                    <p className="text-[11px] font-sans text-stone-700 italic">
                      "{slotNotes[currentSlideshowId]}"
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 border-l-2 border-dashed border-stone-200 pl-3 py-1">
                    <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-stone-400 block pb-0.5">
                      Diary Note empty
                    </span>
                    <p className="text-[10px] font-sans text-stone-400 italic">
                      Tap the corresponding grid card below to write down your private memory text...
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots & Navigation buttons */}
            <div className="flex flex-col gap-4 mt-6 pt-5 border-t border-stone-150/60 w-full relative z-20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Manual Chevron Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevSlide}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#912d2b] transition-all cursor-pointer shadow-xs"
                    title="Previous Memo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#912d2b] transition-all cursor-pointer shadow-xs"
                    title="Next Memo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleSlideshow}
                    className="ml-2 text-[10px] font-sans font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-850 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {isPlayingSlideshow ? (
                      <>
                        <Pause className="w-2.5 h-2.5 fill-current" /> Pause Theme Autoplay
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" /> Auto Rotate
                      </>
                    )}
                  </button>
                </div>

                {/* Tiny pagination indicator dots */}
                <div className="flex items-center gap-1.5 py-1">
                  {TEMPLATE_SLOTS.map((s, index) => {
                    const isSlideActive = s.id === currentSlideshowId;
                    const isSlideFilled = !!photoData[s.id];
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setIsPlayingSlideshow(false);
                          setCurrentSlideshowId(s.id);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 relative cursor-pointer ${
                          isSlideActive 
                            ? "bg-[#912d2b] scale-125 shadow-[0_0_8px_rgba(145,45,43,0.5)]" 
                            : isSlideFilled 
                              ? "bg-amber-400 hover:bg-amber-500" 
                              : "bg-stone-200 hover:bg-stone-300"
                        }`}
                        title={s.title}
                      >
                        {isSlideActive && (
                          <div className="absolute inset-[-2px] rounded-full border border-[#912d2b]/30 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Grid of Polaroid Frames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full mt-2">
        {TEMPLATE_SLOTS.map((slot) => {
          const base64Photo = photoData[slot.id];
          const hasImage = !!base64Photo;
          const userNote = slotNotes[slot.id] || "";
          const activeFilter = slotFilters[slot.id] || "none";
          const isInspecting = activeSlotId === slot.id;

          return (
            <motion.div
              key={slot.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleSlotClick(slot.id)}
              className={`relative cursor-pointer bg-white border rounded-xs shadow-lg p-3.5 flex flex-col justify-between overflow-hidden transition-all group ${
                isInspecting 
                  ? "border-amber-400 ring-2 ring-amber-100 font-bold" 
                  : "border-[#e5dfd5]"
              }`}
            >
              {/* Top Slot Stamp Details */}
              <div className="flex justify-between items-center text-[9px] font-sans tracking-wider text-stone-400 mb-2 relative z-10 select-none">
                <span>SLOT № {slot.id.replace("slot-", "")}</span>
                <span className="text-[#c5a059] font-semibold">{slot.suggestedEmoji}</span>
              </div>

              {/* Photo Frame Container */}
              <div 
                className="relative w-full aspect-square bg-stone-50 border border-stone-100 rounded-2xs flex flex-col items-center justify-center overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)"
                }}
              >
                {hasImage ? (
                  <div className="relative w-full h-full animate-fadeIn">
                    {/* Elegant Golden Frame wrapping around the photo */}
                    <div className="w-full h-full p-1.5 bg-gradient-to-br from-[#fdfbf7] via-[#f7f3e9] to-[#eae3d5] rounded-2xs border border-[#c5a059]/45 shadow-[0_4px_12px_rgba(197,160,89,0.15),inset_0_0_10px_rgba(0,0,0,0.03)] flex items-center justify-center">
                      <div className="w-full h-full overflow-hidden rounded-3xs border border-[#c5a059]/55 shadow-[0_1px_5px_rgba(0,0,0,0.1)] relative">
                        {/* Rendered Uploaded Photo with smooth hover scale */}
                        <img
                          src={base64Photo}
                          alt={slot.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          style={{
                            filter: getFilterStyle(activeFilter)
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Quick remove trigger overlay */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={(e) => handleDeletePhoto(slot.id, e)}
                        className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  renderPlaceholderScene(slot.codename, slot.suggestedEmoji, true)
                )}

                {/* Processing Overlay indicator */}
                {isInspecting && isProcessing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
                    <span className="text-[10px] font-sans text-stone-500 mt-1 select-none">Formatting...</span>
                  </div>
                )}
              </div>

              {/* Title & Micro Description */}
              <div className="mt-3 flex flex-col flex-grow justify-between select-none">
                <div>
                  <h3 className="font-serif text-[12px] md:text-[13px] text-stone-850 font-bold tracking-tight leading-tight">
                    {slot.title}
                  </h3>
                  <p className="text-[10px] font-serif italic text-stone-400 mt-0.5 leading-snug">
                    {slot.description}
                  </p>
                </div>

                {/* Indicator Tag if filled */}
                <div className="flex justify-between items-center border-t border-stone-100 pt-2.5 mt-3">
                  <span className={`text-[9px] uppercase tracking-wider font-sans font-bold flex items-center gap-1 ${
                    hasImage ? "text-amber-500" : "text-stone-300"
                  }`}>
                    <Star className="w-2.5 h-2.5 fill-current" /> {hasImage ? "Framed" : "Lacking"}
                  </span>

                  {hasImage ? (
                    <span className="text-[9px] font-mono bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-sm">
                      {activeFilter === "none" ? "Raw" : activeFilter.toUpperCase()}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleUploadClick(slot.id, e)}
                      className="text-[9px] font-sans tracking-widest text-[#912d2b] hover:text-stone-800 uppercase font-semibold border-b border-[#912d2b]/20"
                    >
                      Browse
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editor & Focus Frame (Shows below when slot selected) */}
      <div className="w-full max-w-xl mt-12">
        <AnimatePresence mode="wait">
          {activeSlotId ? (
            <motion.div
              key={activeSlotId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-[#eae4da] shadow-lg rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Gold borders lining */}
              <div className="absolute inset-3 border border-dashed border-stone-100 rounded-xl pointer-events-none" />

              {(() => {
                const activeSlot = TEMPLATE_SLOTS.find(s => s.id === activeSlotId)!;
                const base64Photo = photoData[activeSlotId];
                const activeFilter = slotFilters[activeSlotId] || "none";
                const activeNote = slotNotes[activeSlotId] || "";

                return (
                  <div>
                    {/* Header bar inside focus node */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-150 mb-5 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{activeSlot.suggestedEmoji}</span>
                        <div>
                          <h4 className="font-serif text-md text-stone-800 font-semibold leading-none">
                            {activeSlot.title}
                          </h4>
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block mt-0.5">
                            Focus Frame Details
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveSlotId(null)}
                        className="text-[10px] font-sans tracking-widest text-stone-400 hover:text-stone-800 uppercase pb-0.5 border-b border-stone-200 cursor-pointer"
                      >
                        Deselct Frame
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                      {/* Left side preview */}
                      <div className="col-span-1 md:col-span-4 flex flex-col items-center">
                        <div className="w-full aspect-square bg-stone-50 border border-stone-150 rounded-lg overflow-hidden relative shadow-md p-1.5 bg-gradient-to-br from-[#fdfbf7] via-[#f7f3e9] to-[#eae3d5] border border-[#c5a059]/45">
                          {base64Photo ? (
                            <div className="w-full h-full overflow-hidden rounded-md border border-[#c5a059]/55 relative group">
                              <img
                                src={base64Photo}
                                alt={activeSlot.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-108"
                                style={{
                                  filter: getFilterStyle(activeFilter)
                                }}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            renderPlaceholderScene(activeSlot.codename, activeSlot.suggestedEmoji, false)
                          )}
                        </div>
                        {base64Photo && (
                          <button
                            onClick={(e) => handleUploadClick(activeSlot.id, e)}
                            className="mt-3.5 text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-sans cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Substitute Image
                          </button>
                        )}
                      </div>

                      {/* Right side controls */}
                      <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
                        {/* Interactive Poetic Prompt reference */}
                        <div className="bg-stone-50/50 p-3.5 rounded-xl border border-[#eae4da]">
                          <span className="text-[9px] uppercase font-sans tracking-widest text-[#c5a059] font-bold block mb-1">
                            Aesthetic Direction Matcher
                          </span>
                          <p className="text-[11px] font-serif text-stone-605 italic leading-relaxed">
                            "{activeSlot.poeticPrompt}"
                          </p>
                        </div>

                        {base64Photo ? (
                          <>
                            {/* Color Filter Controller */}
                            <div>
                              <span className="text-[10px] uppercase font-sans tracking-widest text-stone-500 font-bold block mb-2 flex items-center gap-1">
                                <Sliders className="w-3 h-3" /> Vintage Ambiance Filters
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { name: "none", label: "Classic Raw" },
                                  { name: "golden", label: "Golden Glow" },
                                  { name: "rose", label: "Vintage Rose" },
                                  { name: "velvet", label: "Velvet Dark" },
                                  { name: "mono", label: "Midnight Mono" },
                                ].map((filt) => (
                                  <button
                                    key={filt.name}
                                    onClick={(e) => handleFilterToggle(activeSlot.id, filt.name, e)}
                                    className={`text-[10px] font-sans px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                      activeFilter === filt.name 
                                        ? "bg-[#912d2b] text-white" 
                                        : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
                                    }`}
                                  >
                                    {filt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Custom mini notes */}
                            <div>
                              <span className="text-[10px] uppercase font-sans tracking-widest text-stone-500 font-bold block mb-1.5 flex items-center gap-1">
                                <Bookmark className="w-3 h-3 fill-current" /> Diary Annotation
                              </span>
                              <input
                                type="text"
                                value={activeNote}
                                onChange={(e) => handleUpdateNote(activeSlot.id, e.target.value)}
                                placeholder="E.g., That day when we couldn't stop roaring with laughter..."
                                className="w-full text-stone-700 bg-stone-50 border border-[#eae4da] focus:border-[#c5a059] focus:outline-none rounded-xl px-3 py-2 text-xs font-sans placeholder:text-stone-405"
                                maxLength={100}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[#eae4da] bg-amber-50/15 rounded-xl flex-1 text-center select-none">
                            <Upload className="w-6 h-6 text-stone-400 mb-2" />
                            <p className="text-[11px] font-serif text-stone-400 italic">
                              Once you load Shrishti's gorgeous portrait matching this slot, you can edit beautiful vintage filters and write down diary memories here!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className="text-center py-6 border border-dashed border-[#eae4da] bg-white/40 backdrop-blur-xs rounded-2xl"
            >
              <p className="font-serif italic text-sm text-stone-400">
                Pick any commemorative frame above to apply retro filters, review photographic matching codes, and capture private journal entries.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
