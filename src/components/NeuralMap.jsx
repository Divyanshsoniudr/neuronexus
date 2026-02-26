import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { Zap, Activity, Brain } from "lucide-react";

const NeuralMap = () => {
  const { currentQuiz, currentQuestionIndex, answers } = useStore();

  if (!currentQuiz || currentQuiz.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] glass-panel rounded-[48px] border border-white/5 overflow-hidden group">
      <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="absolute top-8 left-10 z-10">
        <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.3em] text-xs font-syne animate-pulse">
          <Activity size={14} /> My Progress
        </div>
        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
          Mapping your learning in real-time
        </div>
      </div>

      {/* Nodes Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {currentQuiz.map((q, i) => {
          const isCurrent = i === currentQuestionIndex;
          const answer = answers.find((a) => a.questionId === q.id);
          const isCorrect = answer?.isCorrect;
          const isAnswered = !!answer;

          // Simple circular layout
          const angle = (i / currentQuiz.length) * Math.PI * 2;
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={q.id}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: isCurrent ? 1.4 : 1,
                  opacity: isAnswered ? 1 : 0.3,
                  boxShadow: isCurrent
                    ? "0 0 20px rgba(99,102,241,0.5)"
                    : "none",
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                  isCurrent
                    ? "bg-white border-indigo-500 text-indigo-500"
                    : isAnswered
                      ? isCorrect
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-white/5 border-white/10 text-white/20"
                }`}
              >
                {isAnswered ? (
                  isCorrect ? (
                    <Zap size={8} fill="currentColor" />
                  ) : (
                    <Activity size={8} />
                  )
                ) : (
                  <span className="text-[8px] font-black">{i + 1}</span>
                )}
              </motion.div>

              {/* Connector lines to next node */}
              {i < currentQuiz.length - 1 && (
                <div
                  className="absolute top-1/2 left-1/2 w-[40px] h-[1px] bg-gradient-to-r from-white/10 to-transparent origin-left rotate-[-45deg]"
                  style={{
                    width: `${radius * 0.5}px`,
                    transform: `rotate(${angle + Math.PI / currentQuiz.length}rad)`,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Center Brain Icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-0 w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"
        >
          <Brain size={40} className="text-indigo-400/50" />
        </motion.div>
      </div>

      {/* Floating Labels */}
      <div className="absolute bottom-8 right-10 flex gap-6 text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Done
        </div>
        <div className="flex items-center gap-2 text-red-400">
          <div className="w-2 h-2 rounded-full bg-red-500" /> Needs Review
        </div>
        <div className="flex items-center gap-2 text-indigo-400">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />{" "}
          Current
        </div>
      </div>
    </div>
  );
};

export default NeuralMap;
