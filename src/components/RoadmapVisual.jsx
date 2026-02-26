import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Compass, BrainCircuit, Trophy, Award, Flag } from "lucide-react";

const RoadmapVisual = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const steps = [
    {
      title: "Goal Discovery",
      icon: Compass,
      color: "#6366F1",
      x: "50%",
      y: "10%",
    },
    {
      title: "Smart Quiz",
      icon: BrainCircuit,
      color: "#DFFF00",
      x: "50%",
      y: "30%",
    },
    { title: "Level Up", icon: Trophy, color: "#EC4899", x: "50%", y: "50%" },
    { title: "Mastery", icon: Award, color: "#10B981", x: "50%", y: "70%" },
    {
      title: "Final Achievement",
      icon: Flag,
      color: "#F59E0B",
      x: "50%",
      y: "90%",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[150vh] md:h-[200vh] py-20 overflow-visible"
    >
      <div className="absolute inset-0 flex flex-col items-center py-20 pointer-events-none">
        {/* Simple Vertical Guide Line */}
        <div className="w-[1px] h-full bg-white/10 relative">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 left-0 w-full h-full bg-[#DFFF00] origin-top shadow-[0_0_15px_#DFFF00]"
          />
        </div>
      </div>

      {steps.map((step, i) => (
        <StepNode key={i} step={step} index={i} />
      ))}

      {/* Abstract Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] -z-10" />
    </div>
  );
};

const StepNode = ({ step, index }) => {
  return (
    <div
      style={{
        left: step.x,
        top: step.y,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
    >
      <div className="relative flex flex-col items-center">
        <div
          className="w-20 h-20 md:w-32 md:h-32 rounded-[32px] md:rounded-[48px] glass-panel border border-white/20 flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-2xl group-hover:border-[#DFFF00]"
          style={{ backgroundColor: `${step.color}15` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <step.icon
            size={40}
            className="text-white group-hover:text-[#DFFF00] transition-colors"
          />
        </div>

        <div className="mt-8 text-center max-w-[200px]">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 font-syne group-hover:text-[#DFFF00] group-hover:border-[#DFFF00]/30 transition-all">
            Step 0{index + 1}
          </div>
          <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic font-syne group-hover:scale-110 transition-transform">
            {step.title}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default RoadmapVisual;
