import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Cpu, Share2, Layers, Network } from "lucide-react";

/**
 * OCRScanProof: Animated scanline over text
 */
export const OCRScanProof = () => {
  return (
    <div className="relative w-full h-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col p-6 font-mono text-[10px] md:text-xs">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
        />
      </div>

      <div className="space-y-4 opacity-40">
        <div className="text-white/60 italic leading-relaxed">
          // Handwritten Input Analysis...
          <br />
          The mitochondrion is a double-membrane-bound organelle found in most
          eukaryotic organisms...
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="mt-auto space-y-2 border-t border-white/10 pt-4"
      >
        <div className="flex gap-2 text-cyan-400 items-center">
          <Check size={12} />
          <span>OBJECT_RECOGNITION: SUCCESS</span>
        </div>
        <div className="text-white/80">
          <span className="text-indigo-400">const</span> organelle ={" "}
          <span className="text-yellow-400">"Mitochondria"</span>;
        </div>
      </motion.div>
    </div>
  );
};

/**
 * NeuralGraphProof: Constellation of nodes
 */
export const NeuralGraphProof = () => {
  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent)]" />
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-[250px] opacity-60"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting lines */}
        <motion.path
          d="M 40,100 L 100,60 M 100,60 L 160,100 M 160,100 L 100,140 M 100,140 L 40,100 M 100,60 L 100,140"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Nodes */}
        {[
          { cx: 40, cy: 100 },
          { cx: 100, cy: 60 },
          { cx: 160, cy: 100 },
          { cx: 100, cy: 140 },
          { cx: 100, cy: 100 },
        ].map((n, i) => (
          <motion.circle
            key={i}
            {...n}
            r="4"
            fill={i === 4 ? "#DFFF00" : "#6366f1"}
            filter="url(#glow)"
            animate={{ r: [4, 6, 4], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * MasteryChartProof: 3D-feeling bar chart
 */
export const MasteryChartProof = () => {
  const bars = [40, 70, 45, 90, 65, 85, 55];
  return (
    <div className="w-full h-full flex items-end justify-between gap-2 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
      {bars.map((h, i) => (
        <div key={i} className="relative flex-1 group">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: false }}
            transition={{ delay: i * 0.1, duration: 1.5, ease: "circOut" }}
            className="w-full bg-gradient-to-t from-indigo-500/10 to-indigo-500/60 rounded-t-lg relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#DFFF00] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      ))}
    </div>
  );
};
