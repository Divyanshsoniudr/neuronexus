import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { Hammer, Sparkles, BookOpen, ChevronRight, Zap } from "lucide-react";

const ImprovementRoom = () => {
  const { forgeConcept, forgeStep, forgeData, nextForgeStep } = useStore();

  if (!forgeData) return null;

  const steps = [
    { title: "The Basics", icon: Hammer, content: forgeData.Deconstruction },
    { title: "Simple Example", icon: Sparkles, content: forgeData.Analogy },
    { title: "Final Check", icon: Zap, content: forgeData.Puzzle },
  ];

  const currentStep = steps[forgeStep - 1];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full glass-panel rounded-[60px] border border-indigo-500/30 p-10 md:p-20 relative overflow-hidden"
      >
        {/* Animated Background Rays */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-12 h-1.5 rounded-full transition-all duration-500 ${
                  s <= forgeStep
                    ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <motion.div
            key={forgeStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-[0.4em] font-syne">
              <currentStep.icon size={16} /> {currentStep.title}
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Improving <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 font-syne">
                {forgeConcept}
              </span>
            </h2>

            <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
              "{currentStep.content}"
            </p>

            <button
              onClick={nextForgeStep}
              className="mt-12 px-12 py-6 rounded-[30px] bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-[#DFFF00] transition-all flex items-center gap-4 mx-auto group"
            >
              {forgeStep === 3 ? "All Done" : "Got it"}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          </motion.div>
        </div>

        {/* Forge Decorative Footer */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-20 text-[10px] font-black uppercase tracking-[0.5em] text-white whitespace-nowrap">
          <span>Improvement Room</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Making learning easy</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ImprovementRoom;
