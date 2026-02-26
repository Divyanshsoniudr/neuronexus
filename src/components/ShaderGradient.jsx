import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * ShaderGradient: A high-performance, code-based implementation of
 * the shadergradient.co aesthetic using Framer Motion and modern CSS.
 * Provides a dynamic, living background for premium SaaS sections.
 */
const ShaderGradient = ({ className = "" }) => {
  // Memoize random positions to avoid re-renders during animation
  const gradients = useMemo(
    () => [
      {
        color: "rgba(99, 102, 241, 0.15)", // Indigo
        size: "60vw",
        initialPos: { top: "-10%", left: "-10%" },
        animate: {
          x: [0, 100, -50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        },
      },
      {
        color: "rgba(16, 185, 129, 0.1)", // Emerald
        size: "50vw",
        initialPos: { bottom: "10%", right: "10%" },
        animate: {
          x: [0, -120, 40, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.1, 1.3, 1],
        },
      },
      {
        color: "rgba(223, 255, 0, 0.05)", // Hyper Lime
        size: "40vw",
        initialPos: { top: "40%", left: "30%" },
        animate: {
          x: [0, 80, -100, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.4, 0.8, 1],
        },
      },
    ],
    [],
  );

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-60 ${className}`}
    >
      {gradients.map((g, i) => (
        <motion.div
          key={i}
          initial={g.initialPos}
          animate={g.animate}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full blur-[140px]"
          style={{
            width: g.size,
            height: g.size,
            backgroundColor: g.color,
          }}
        />
      ))}

      {/* Texture Layer */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")',
        }}
      />
    </div>
  );
};

export default ShaderGradient;
