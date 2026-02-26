import React, { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * SuperpowerVisuals: A collection of distinct 3D-feeling visual assemblies.
 * These break repetition by providing unique, high-end aesthetics for each step.
 */

// --- 1. SCANNER VISUAL (For Input/Scanning) ---
export const ScannerVisual = ({ size = 200, color = "#22d3ee" }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Document Stack Shape */}
      <div className="relative w-24 h-32 bg-white/5 border border-white/10 rounded-xl overflow-hidden transform skew-x-3 -rotate-3 transition-transform group-hover:rotate-0 group-hover:skew-x-0 duration-700">
        <div className="p-4 space-y-3">
          <div className="h-2 w-3/4 bg-white/10 rounded-full" />
          <div className="h-2 w-1/2 bg-white/10 rounded-full" />
          <div className="h-2 w-5/6 bg-white/10 rounded-full" />
          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
        </div>

        {/* The Scanning Beam */}
        <motion.div
          animate={{ y: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)] z-20"
        />

        {/* Revealed Data Glow */}
        <motion.div
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-cyan-500/10 pointer-events-none"
        />
      </div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          style={{
            top: `${20 + i * 15}%`,
            left: `${15 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
};

// --- 2. CORE VISUAL (The AI Engine) ---
export const CoreVisual = ({ size = 200, color = "#6366f1" }) => {
  // A simplified, higher-contrast version of the Wireframe Atom for the engine
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-1000" />

      {/* Central Core */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)]" />
      </motion.div>

      {/* Rotating Orbits */}
      {[0, 120, 240].map((rot, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${rot}deg)` }}
        >
          <motion.div
            animate={{ rotateX: [70, 80, 70], rotateY: [0, 360] }}
            transition={{
              rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotateY: {
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="w-48 h-48 border border-white/10 rounded-full relative"
          >
            {/* The Electron */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,1)]" />
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// --- 3. MASTERY VISUAL (Progress/Results) ---
export const MasteryVisual = ({ size = 200, color = "#10b981" }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D-ish Growth Spiral */}
      <div className="relative flex items-end gap-2 h-32">
        {[0.3, 0.5, 0.7, 0.4, 0.9, 0.6, 1.0].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h * 100}%` }}
            viewport={{ once: true }}
            transition={{ delay: 1 + i * 0.1, duration: 1, ease: "easeOut" }}
            className={`w-3 rounded-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]`}
          />
        ))}
      </div>

      {/* Floating Achievements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
      >
        <div className="w-6 h-6 bg-emerald-400 rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.6)]">
          <div className="w-1.5 h-3 border-r-2 border-b-2 border-white -rotate-45 mb-0.5" />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
};
