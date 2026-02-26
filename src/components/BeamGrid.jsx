import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BeamGrid = () => {
  const meshRes = 12; // Grid resolution for mesh lines

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Interactive Mesh - Now Static */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g>
          {/* Mesh horizontal lines */}
          {Array.from({ length: meshRes }).map((_, gridY) =>
            Array.from({ length: meshRes - 1 }).map((_, gridX) => {
              const pctX1 = (gridX / (meshRes - 1)) * 100;
              const pctY1 = (gridY / (meshRes - 1)) * 100;
              const pctX2 = ((gridX + 1) / (meshRes - 1)) * 100;
              const pctY2 = (gridY / (meshRes - 1)) * 100;
              return (
                <line
                  key={`h-${gridX}-${gridY}`}
                  x1={pctX1}
                  y1={pctY1}
                  x2={pctX2}
                  y2={pctY2}
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth={0.1}
                  opacity={0.25}
                />
              );
            }),
          )}
          {/* Mesh vertical lines */}
          {Array.from({ length: meshRes - 1 }).map((_, gridY) =>
            Array.from({ length: meshRes }).map((_, gridX) => {
              const pctX1 = (gridX / (meshRes - 1)) * 100;
              const pctY1 = (gridY / (meshRes - 1)) * 100;
              const pctX2 = (gridX / (meshRes - 1)) * 100;
              const pctY2 = ((gridY + 1) / (meshRes - 1)) * 100;
              return (
                <line
                  key={`v-${gridX}-${gridY}`}
                  x1={pctX1}
                  y1={pctY1}
                  x2={pctX2}
                  y2={pctY2}
                  stroke="rgba(96, 165, 250, 0.2)"
                  strokeWidth={0.1}
                  opacity={0.25}
                />
              );
            }),
          )}
        </g>
      </svg>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Beams */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: -500,
              opacity: 0,
            }}
            animate={{
              y: 1500,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            className="absolute w-[1px] h-[500px]"
            style={{
              background: `linear-gradient(to bottom, transparent, #DFFF00, transparent)`,
              boxShadow: "0 0 15px rgba(223, 255, 0, 0.4)",
            }}
          />
        ))}

        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            initial={{
              y: `${Math.random() * 100}%`,
              x: -500,
              opacity: 0,
            }}
            animate={{
              x: 2000,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            className="absolute h-[1px] w-[500px]"
            style={{
              background: `linear-gradient(to right, transparent, rgba(99, 102, 241, 0.3), transparent)`,
            }}
          />
        ))}
      </div>

      {/* Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#DFFF00]/5 blur-[120px] rounded-full" />
    </div>
  );
};

export default BeamGrid;
