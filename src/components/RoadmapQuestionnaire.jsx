import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Trophy,
  Brain,
} from "lucide-react";

const LEVELS = [
  {
    id: "Beginner",
    title: "Beginner",
    description:
      "I'm just starting my journey. I need to learn the core foundations from scratch.",
    icon: Target,
    color: "emerald",
    skipCount: 0,
  },
  {
    id: "Intermediate",
    title: "Intermediate",
    description:
      "I know the basics and have built some small projects. Skip the absolute fundamentals.",
    icon: Zap,
    color: "amber",
    skipCount: 3,
  },
  {
    id: "Advanced",
    title: "Advanced",
    description:
      "I use this tech regularly. I want to skip directly to complex implementation patterns.",
    icon: Brain,
    color: "indigo",
    skipCount: 7,
  },
  {
    id: "Legend",
    title: "Legend",
    description:
      "I'm an expert. Show me the deepest technical hurdles and architectural mastery.",
    icon: Trophy,
    color: "rose",
    skipCount: 12,
  },
];

const RoadmapQuestionnaire = ({ onComplete, roadmapTitle }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 font-syne">
          <Sparkles size={12} />
          Personalized Study Plan
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-tight font-outfit">
          WHAT IS YOUR <br />
          <span className="italic text-indigo-500">{roadmapTitle}</span> LEVEL?
        </h2>
        <p className="text-white/40 text-lg font-medium max-w-md mx-auto font-outfit">
          Our AI will calibrate your roadmap to bypass what you already know.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[360px]">
        {LEVELS.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelected(level.id)}
            className={`group p-6 rounded-[32px] border transition-all text-left relative overflow-hidden flex flex-col justify-between h-full ${
              selected === level.id
                ? "bg-white border-white text-black ring-4 ring-indigo-500/20"
                : "bg-white/5 border-white/10 hover:border-white/20 text-white"
            }`}
          >
            {selected === level.id && (
              <motion.div
                layoutId="level-select-glow"
                className="absolute inset-0 bg-indigo-500/10"
              />
            )}

            <div className="relative z-10">
              <div
                className={`p-3 rounded-2xl w-fit mb-4 ${
                  selected === level.id ? "bg-black/5" : "bg-white/10"
                }`}
              >
                <level.icon
                  size={24}
                  className={
                    selected === level.id ? "text-indigo-600" : "text-white/60"
                  }
                />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                {level.title}
              </h3>
              <p
                className={`text-xs font-medium leading-relaxed ${
                  selected === level.id ? "text-black/60" : "text-white/40"
                }`}
              >
                {level.description}
              </p>
            </div>

            <div
              className={`mt-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                selected === level.id ? "text-indigo-600" : "text-white/20"
              }`}
            >
              {level.skipCount > 0
                ? `SKIPS ${level.skipCount} BASIC TOPICS`
                : "ALL TOPICS"}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 w-full max-w-sm"
          >
            <button
              onClick={() => onComplete(selected)}
              className="w-full px-8 py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 text-sm font-syne shadow-2xl shadow-indigo-500/40"
            >
              Start My Plan
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapQuestionnaire;
