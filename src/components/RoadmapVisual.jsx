import React from "react";
import { motion } from "framer-motion";
import { Compass, BrainCircuit, Trophy, Award, Flag } from "lucide-react";

const RoadmapVisual = () => {
  const steps = [
    { title: "Define Goal", icon: Compass, color: "indigo" },
    { title: "Take Quizzes", icon: BrainCircuit, color: "indigo" },
    { title: "Find Gaps", icon: Trophy, color: "indigo" },
    { title: "Master It", icon: Award, color: "indigo" },
    { title: "Ace Exam", icon: Flag, color: "emerald" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-16 md:pt-24 pb-8 md:mt-8">
      {/* --- DESKTOP VIEW (Horizontal Zigzag) --- */}
      <div className="hidden md:block relative w-full h-[400px]">
        {/* The background track */}
        <div className="absolute top-[50%] left-[5%] right-[5%] h-1.5 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
          {/* The animated fill progress */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-[#DFFF00] origin-left shadow-[0_0_15px_#DFFF00]"
          />
        </div>

        {/* Animated glowing tracer photon */}
        <motion.div
          initial={{ left: "5%", opacity: 0 }}
          whileInView={{ left: "95%", opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute top-[50%] -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-[#DFFF00] blur-md pointer-events-none z-0"
        />

        {/* Grid for Nodes */}
        <div className="relative z-10 grid grid-cols-5 gap-4 justify-items-center px-4 w-full h-full items-center mt-12">
          {steps.map((step, i) => (
            <DesktopStepNode
              key={i}
              step={step}
              index={i}
              total={steps.length}
            />
          ))}
        </div>
      </div>

      {/* --- MOBILE VIEW (Vertical Timeline) --- */}
      <div className="md:hidden relative w-full px-4 flex flex-col gap-12 mt-8">
        {/* Vertical track background */}
        <div className="absolute top-0 bottom-0 left-12 w-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-b from-indigo-500 via-emerald-400 to-[#DFFF00] origin-top shadow-[0_0_15px_#DFFF00]"
          />
        </div>

        {/* Tracer photon */}
        <motion.div
          initial={{ top: "0%", opacity: 0 }}
          whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute left-12 -ml-[13px] w-8 h-8 rounded-full bg-[#DFFF00] blur-md pointer-events-none z-0"
        />

        {steps.map((step, i) => (
          <MobileStepNode key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
};

const DesktopStepNode = ({ step, index, total }) => {
  const isUp = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: isUp ? 20 : -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // Cascade the delay as the tracer moves across
      transition={{
        delay: index * 0.4 + 0.2,
        duration: 0.6,
        type: "spring",
        bounce: 0.4,
      }}
      className={`relative w-full flex flex-col justify-center items-center group`}
      style={{ height: "180px" }}
    >
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.4 + 0.3, duration: 0.4 }}
          className="w-4 h-4 rounded-full bg-black border-[3px] border-white/20 group-hover:border-[#DFFF00] group-hover:bg-[#DFFF00] transition-colors relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[#DFFF00] blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.4 + 0.4, duration: 0.4 }}
        className={`absolute left-1/2 w-[2px] bg-white/10 group-hover:bg-white/40 transition-colors origin-${isUp ? "bottom" : "top"} ${isUp ? "bottom-[50%] mb-2 h-10" : "top-[50%] mt-2 h-10"}`}
      />

      <div
        className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center w-[160px] ${isUp ? "bottom-[50%] mb-12" : "top-[50%] mt-12"}`}
      >
        <div
          className={`w-16 h-16 rounded-[24px] glass-panel border border-${step.color}-500/20 flex items-center justify-center bg-${step.color}-500/5 group-hover:-translate-y-1 group-hover:border-[#DFFF00]/50 group-hover:bg-white/5 transition-all duration-300 relative overflow-hidden shadow-lg`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <step.icon
            size={24}
            className="text-white group-hover:text-[#DFFF00] transition-colors"
          />
        </div>

        <div className="text-center mt-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white mb-1.5 font-syne transition-colors whitespace-nowrap">
            STEP 0{index + 1}
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight font-syne leading-tight group-hover:scale-105 transition-transform whitespace-nowrap">
            {step.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

const MobileStepNode = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: index * 0.3, duration: 0.5 }}
      className="relative flex items-center w-full group pl-4"
    >
      {/* Dot Container - Matches left padding to align with the vertical track line */}
      <div className="absolute left-[34px] -translate-x-1/2 z-10 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.3 + 0.2, duration: 0.4 }}
          className="w-4 h-4 rounded-full bg-black border-[3px] border-white/20 group-hover:border-[#DFFF00] group-hover:bg-[#DFFF00] transition-colors relative"
        >
          <div className="absolute inset-0 bg-[#DFFF00] blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        </motion.div>
      </div>

      {/* Content container pushed to the right */}
      <div className="ml-16 flex items-center gap-4 w-full">
        <div
          className={`shrink-0 w-14 h-14 rounded-[20px] glass-panel border border-${step.color}-500/20 flex items-center justify-center bg-${step.color}-500/5 group-hover:scale-105 group-hover:border-[#DFFF00]/50 group-hover:bg-white/5 transition-all duration-300 relative overflow-hidden shadow-lg`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <step.icon
            size={20}
            className="text-white group-hover:text-[#DFFF00] transition-colors"
          />
        </div>

        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white mb-1.5 font-syne transition-colors whitespace-nowrap">
            STEP 0{index + 1}
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight font-syne leading-tight group-hover:translate-x-1 transition-transform">
            {step.title}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapVisual;
