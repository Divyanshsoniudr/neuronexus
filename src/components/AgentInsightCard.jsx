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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors relative"
    >
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white/10">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {mentor.name}
              </span>
              <span className="text-xs text-white/70">—</span>
              <span className="text-xs font-medium text-white/90">
                {mentor.title}
              </span>
            </div>
            <div className={`text-white/80`}>{getIcon()}</div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed font-medium">
            "{insight}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentInsightCard;
