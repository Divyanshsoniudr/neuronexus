import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  Trophy,
  Brain,
} from "lucide-react";

const QuizResults = () => {
  const {
    currentQuiz,
    score,
    skillStats,
    reset,
    userTopic,
    startForge,
    getWeakSectors,
  } = useStore();
  const navigate = useNavigate();

  const percentage = Math.round((score / currentQuiz.length) * 100);
  const rank =
    percentage >= 90 ? "Expert" : percentage >= 70 ? "Learner" : "Beginner";
  const weakSectors = getWeakSectors();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl w-full mx-auto relative px-6 md:px-0 py-12 md:py-24"
    >
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-full bg-[#DFFF00]/[0.02] -z-10 border-l border-white/5 hidden lg:block" />
      <div className="absolute top-40 left-10 w-4 h-4 rounded-full bg-indigo-500/20 blur-sm" />
      <div className="absolute bottom-40 right-20 w-8 h-8 rounded-full bg-[#DFFF00]/20 blur-md" />

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* Left Section: Hero Illustration & Score */}
        <div className="lg:w-5/12 w-full sticky top-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 relative"
          >
            <h2 className="text-[10px] font-black text-white/80 uppercase tracking-[1em] mb-12 font-syne">
              Achievement _ 0{Math.floor(percentage / 10)}
            </h2>

            {/* CUSTOM SVG HERO ILLUSTRATION (Not a generic icon) */}
            <div className="relative w-full aspect-square max-w-[320px] mb-16 mx-auto lg:mx-0">
              <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_0_30px_rgba(223,255,0,0.15)]"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.02, 1],
                  y: [0, -10, 0],
                }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {/* Decorative background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="white"
                  fillOpacity="0.02"
                  stroke="white"
                  strokeOpacity="0.05"
                  strokeWidth="0.5"
                />

                {/* Inner geometric paths */}
                <motion.path
                  d="M100 20 L180 100 L100 180 L20 100 Z"
                  fill="none"
                  stroke="#DFFF00"
                  strokeWidth="1.5"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />

                {/* Floating Mastery Nodes */}
                {[0, 90, 180, 270].map((deg, i) => (
                  <motion.circle
                    key={i}
                    cx={100 + 60 * Math.cos((deg * Math.PI) / 180)}
                    cy={100 + 60 * Math.sin((deg * Math.PI) / 180)}
                    r="6"
                    fill={i % 2 === 0 ? "#DFFF00" : "white"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                  />
                ))}

                {/* Center Emblem */}
                <rect
                  x="75"
                  y="75"
                  width="50"
                  height="50"
                  rx="12"
                  fill="#DFFF00"
                  fillOpacity="0.1"
                  stroke="#DFFF00"
                  strokeWidth="2"
                />
                <Trophy x="82" y="82" size={36} className="text-[#DFFF00]" />
              </motion.svg>

              {/* Dynamic Floating Label */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl glass-panel border border-[#DFFF00]/30 backdrop-blur-xl z-20"
              >
                <span className="text-[10px] font-black text-[#DFFF00] uppercase tracking-widest font-syne">
                  Your Result
                </span>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-8xl md:text-[140px] font-black text-white italic tracking-tighter leading-[0.85] font-outfit uppercase select-none"
              >
                {percentage}
                <span className="text-4xl text-[#DFFF00] opacity-50 not-italic ml-2">
                  %
                </span>
              </motion.h1>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-2xl font-black text-white/90 uppercase tracking-[0.2em] font-syne"
              >
                {rank}
              </motion.h3>
            </div>
          </motion.div>
        </div>

        {/* Right Section: Mastery Data Editorial */}
        <div className="lg:w-7/12 w-full pt-12 lg:pt-32">
          <div className="mb-20">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.6em] mb-4">
              Performance Analysis
            </h4>
            <div className="h-px w-24 bg-indigo-500/30 mb-8" />
            <p className="text-xl text-white/90 font-medium leading-relaxed font-outfit">
              Your session results across{" "}
              <span className="text-white">
                {Object.keys(skillStats).length} key categories
              </span>{" "}
              within {userTopic || "this domain"}.
            </p>
          </div>

          <div className="space-y-16 mb-24">
            {Object.entries(skillStats).map(([skill, val], idx) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="relative group pb-8 border-b border-white/[0.03]"
              >
                <div className="flex justify-between items-baseline mb-6">
                  <h5 className="text-sm font-black text-white uppercase tracking-[0.2em] font-syne group-hover:text-[#DFFF00] transition-colors">
                    {skill}
                  </h5>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                      Score / Correct
                    </span>
                    <span className="text-lg font-black text-[#DFFF00] italic font-outfit">
                      {val}{" "}
                      <span className="text-[10px] text-white/80 ml-1">
                        pts
                      </span>
                    </span>
                  </div>
                </div>

                {/* Ultra-Fine Minimalist Mastery Bar */}
                <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(val / (currentQuiz.length / 5 || 1)) * 100}%`,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.5 + idx * 0.1,
                    }}
                    className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Grid (Editorial Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-32 relative">
            <div className="space-y-6">
              <h6 className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] font-syne">
                Continue Learning
              </h6>
              <button
                onClick={() => {
                  reset();
                  navigate("/generator");
                }}
                className="w-full flex items-center justify-between group py-4 border-b border-white/10 hover:border-[#DFFF00] transition-all"
              >
                <span className="text-xl font-black text-white uppercase tracking-tighter group-hover:translate-x-2 transition-transform font-syne italic">
                  Study Again
                </span>
                <ArrowRight
                  size={24}
                  className="text-[#DFFF00] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all"
                />
              </button>
            </div>

            <div className="space-y-6">
              <h6 className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] font-syne">
                Refine Performance
              </h6>
              {weakSectors.length > 0 ? (
                <button
                  onClick={() => startForge(weakSectors[0])}
                  className="w-full flex items-center justify-between group py-4 border-b border-white/10 hover:border-indigo-400 transition-all"
                >
                  <span className="text-xl font-black text-white uppercase tracking-tighter group-hover:translate-x-2 transition-transform font-syne italic">
                    Fix Weak Spots
                  </span>
                  <RefreshCw
                    size={24}
                    className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all font-syne"
                  />
                </button>
              ) : (
                <div className="py-4 border-b border-white/10">
                  <span className="text-sm font-bold text-white/70 uppercase tracking-widest font-syne italic">
                    Excellent Score
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Minimal Secondary Navigation */}
          <div className="mt-20 flex flex-wrap gap-8 opacity-40 hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[9px] font-black text-white uppercase tracking-[0.4em] border-b border-white/20 pb-1 hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/generator")}
              className="text-[9px] font-black text-white uppercase tracking-[0.4em] border-b border-white/20 pb-1 hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all"
            >
              New Subject
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PerformanceCard = ({ icon: Icon, title, val, desc, color }) => {
  const colorMap = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col items-center text-center group hover:border-white/20 transition-all">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorMap[color]}`}
      >
        <Icon size={24} />
      </div>
      <h4 className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em] mb-2">
        {title}
      </h4>
      <div className="text-xl font-black text-white mb-2 italic truncate w-full uppercase">
        {val}
      </div>
      <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
        {desc}
      </p>
    </div>
  );
};

export default QuizResults;
