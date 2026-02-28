import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";
import NeuralLogo from "./NeuralLogo";

/**
 * Premium context-driven loader for QuizMaster
 * @param {string} type - 'sync' (auth) or 'synthesis' (generation)
 * @param {string} text - Optional text to display
 */
const NeuralLoader = ({ type = "synthesis", text }) => {
  const isSync = type === "sync";
  const [index, setIndex] = React.useState(0);

  const displayTexts = React.useMemo(() => {
    if (Array.isArray(text)) return text;
    if (text) return [text];
    return isSync
      ? ["Saving Progress...", "Checking Details...", "Securing Account..."]
      : ["Reading Materials...", "Writing Questions...", "Finishing Up..."];
  }, [text, isSync]);

  React.useEffect(() => {
    if (displayTexts.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [displayTexts]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Pulsing Outer Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.4 + i * 0.2, 1],
              rotate: i % 2 === 0 ? 360 : -360,
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute inset-0 rounded-full border border-white/5 ${
              isSync ? "border-emerald-500/20" : "border-indigo-500/20"
            }`}
          />
        ))}

        {/* Global Glowing Aura */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute w-32 h-32 rounded-full blur-[40px] ${
            isSync ? "bg-emerald-500/30" : "bg-indigo-500/30"
          }`}
        />

        {/* Center Node */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(99, 102, 241, 0.2)",
              "0 0 50px rgba(99, 102, 241, 0.5)",
              "0 0 20px rgba(99, 102, 241, 0.2)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative w-20 h-20 rounded-[32px] glass-panel border border-white/10 flex items-center justify-center z-10"
        >
          {isSync ? (
            <Activity className="text-emerald-400" size={32} />
          ) : (
            <NeuralLogo size={32} />
          )}

          {/* Orbiting Particles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full blur-[2px] ${
                isSync ? "bg-emerald-400" : "bg-indigo-400"
              }`}
            />
          </motion.div>
        </motion.div>

        {/* Contextual Sparkles for Synthesis */}
        {!isSync && (
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                }}
                className="absolute text-indigo-400/40"
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${15 + (i % 2) * 70}%`,
                }}
              >
                <Sparkles size={16} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayTexts[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                isSync ? "text-emerald-400" : "text-indigo-400"
              }`}
            >
              {displayTexts[index]}
            </span>
            <div className="flex gap-2">
              {displayTexts.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 w-6 rounded-full transition-all duration-500 ${i === index ? (isSync ? "bg-emerald-500 w-10" : "bg-indigo-500 w-10") : "bg-white/5"}`}
                />
              ))}
            </div>
          </div>

          <p className="text-white/70 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">
            Processing
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NeuralLoader;
