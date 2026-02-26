import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Quote, TrendingUp, AlertCircle } from "lucide-react";

const AgentInsightCard = ({ mentor, insight, type = "thought" }) => {
  const getIcon = () => {
    switch (type) {
      case "mastery":
        return <TrendingUp size={14} />;
      case "warning":
        return <AlertCircle size={14} />;
      case "quote":
        return <Quote size={14} />;
      default:
        return <Lightbulb size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 rounded-[32px] glass-panel border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden bg-white/[0.01]"
    >
      {/* Procedural scanning line */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-x-0 h-[100px] bg-gradient-to-b from-transparent via-${mentor.color}-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl ${mentor.accent} flex items-center justify-center border border-white/5 relative z-10 overflow-hidden`}
          >
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div
            className={`absolute -inset-1 ${mentor.accent} blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-2xl`}
          />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                {mentor.name}
              </span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                •
              </span>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                {mentor.title}
              </span>
            </div>
            <div className={`p-1.5 rounded-lg ${mentor.accent} text-white/40`}>
              {getIcon()}
            </div>
          </div>

          <p className="text-sm font-medium text-white/70 leading-relaxed italic">
            "{insight}"
          </p>
        </div>
      </div>

      {/* Subtle indicator of agent activity */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default AgentInsightCard;
