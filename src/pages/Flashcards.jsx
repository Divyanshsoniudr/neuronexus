import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import SEO from "../components/SEO";

const Flashcards = () => {
  const { currentFlashcards } = useStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // If there are no flashcards loaded to study, kick back to Profile
  React.useEffect(() => {
    if (!currentFlashcards || currentFlashcards.length === 0) {
      navigate("/profile");
    }
  }, [currentFlashcards, navigate]);

  if (!currentFlashcards || currentFlashcards.length === 0) return null;

  const card = currentFlashcards[currentIndex];
  const isLastCard = currentIndex === currentFlashcards.length - 1;

  const handleNext = () => {
    if (isLastCard) {
      navigate("/profile");
      return;
    }
    setIsFlipped(false);
    // Slight delay so the unflip animation can start before content changes
    setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col min-h-[80vh]">
      <SEO title="Flashcard Review" />

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Vault
        </button>
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          Card {currentIndex + 1} of {currentFlashcards.length}
        </div>
      </div>

      {/* 3D Scene Container */}
      <div className="flex-1 flex flex-col items-center justify-center perspective-[2000px]">
        <motion.div
          className="relative w-full max-w-2xl h-[400px] cursor-pointer preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT OF CARD (Question) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-[40px] glass-panel border border-white/10 p-10 flex flex-col justify-center items-center text-center bg-[#050505] shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <BookOpen size={24} className="text-white/20 mb-8 absolute top-8" />
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight font-outfit mb-4">
              {card.question}
            </h2>
            <div className="absolute bottom-8 flex flex-col items-center">
              <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-black">
                Tap to flip
              </span>
            </div>
          </div>

          {/* BACK OF CARD (Answer & Explanation) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-[40px] glass-panel border border-emerald-500/20 p-8 flex flex-col justify-center bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                <CheckCircle size={12} /> Correct Answer
              </h4>
              <p className="text-xl md:text-2xl font-black text-white mb-8 font-outfit leading-tight">
                {card.answer}
              </p>

              <div className="h-px w-full bg-white/5 mb-8" />

              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
                <Lightbulb size={12} /> Explanation
              </h4>
              <p className="text-sm text-white/70 leading-relaxed max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {card.explanation}
              </p>
            </div>
            <div className="absolute bottom-6 left-0 w-full flex justify-center">
              <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-black">
                Tap to flip back
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-12 flex justify-center items-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-2xl glass-panel border border-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          {isLastCard ? "Finish Review" : "Next Card"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
