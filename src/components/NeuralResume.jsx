import React from "react";
import { motion } from "framer-motion";
import { Shield, Code, Cpu, Activity, Zap, Star } from "lucide-react";

const NeuralResume = ({ stats }) => {
  const categories = [
    {
      name: "Syntax",
      icon: Code,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      name: "Architecture",
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      name: "Logic",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      name: "Theory",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      name: "Security",
      icon: Shield,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[32px] glass-panel border border-white/5 flex flex-col items-center text-center group hover:border-white/20 transition-all`}
          >
            <div
              className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} mb-4 group-hover:scale-110 transition-transform`}
            >
              <cat.icon size={24} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
              {cat.name}
            </div>
            <div className="text-2xl font-black text-white">
              {stats[cat.name] || 0}
            </div>

            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={10}
                  className={`${star <= (stats[cat.name] || 0) ? cat.color : "text-white/5"} fill-current`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Neural Roadmap Visualization */}
      <div className="p-12 glass-panel rounded-[48px] border border-white/5 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
        <h3 className="text-xl font-black uppercase tracking-[0.4em] text-white/60 mb-16 relative">
          Your Skill Map
        </h3>

        <div className="relative flex justify-center items-center h-48">
          <div className="absolute w-4 w-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] z-10" />

          {categories.map((cat, i) => {
            const angle = (i * 360) / categories.length;
            const x = Math.cos((angle * Math.PI) / 180) * 120;
            const y = Math.sin((angle * Math.PI) / 180) * 120;
            const strength = ((stats[cat.name] || 0) / 5) * 100;

            return (
              <div
                key={cat.name}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Connector Line */}
                <div
                  style={{
                    width: "120px",
                    height: "2px",
                    background: `linear-gradient(90deg, #22d3ee ${strength}%, transparent ${strength}%)`,
                    opacity: 0.2,
                    transform: `rotate(${angle}deg) translateX(10px)`,
                    transformOrigin: "left center",
                  }}
                />
                {/* Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    width: "40px",
                    height: "40px",
                  }}
                  className={`absolute rounded-xl ${cat.bg} border border-white/10 flex items-center justify-center ${cat.color}`}
                >
                  <cat.icon size={16} />
                </motion.div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">
          Overall Progress:{" "}
          {Math.round(
            (Object.values(stats).reduce((a, b) => a + b, 0) / 25) * 100,
          )}
          %
        </p>
      </div>
    </div>
  );
};

export default NeuralResume;
