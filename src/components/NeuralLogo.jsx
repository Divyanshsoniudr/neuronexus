import React from "react";
import { motion } from "framer-motion";

const NeuralLogo = ({ size = 44, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="fold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id="origami-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faceted Origami Brain Structure */}
        <motion.g
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "center" }}
        >
          {/* Left Hemisphere Facets */}
          <motion.path
            d="M50 20 L30 40 L50 45 Z"
            fill="#6366f1"
            opacity="0.9"
            animate={{ skewX: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path
            d="M30 40 L25 60 L50 65 L50 45 Z"
            fill="#4f46e5"
            opacity="0.8"
          />
          <motion.path
            d="M25 60 L35 80 L50 75 L50 65 Z"
            fill="#4338ca"
            opacity="1"
          />

          {/* Right Hemisphere Facets */}
          <motion.path
            d="M50 20 L70 40 L50 45 Z"
            fill="#818cf8"
            opacity="0.9"
            animate={{ skewX: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path
            d="M70 40 L75 60 L50 65 L50 45 Z"
            fill="#6366f1"
            opacity="0.8"
          />
          <motion.path
            d="M75 60 L65 80 L50 75 L50 65 Z"
            fill="#4f46e5"
            opacity="1"
          />

          {/* Center Fold Line */}
          <path
            d="M50 20 L50 80"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </motion.g>

        {/* Neural Synapse Glow (Faceted) */}
        <motion.circle
          cx="50"
          cy="45"
          r="3"
          fill="white"
          filter="url(#origami-glow)"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

export default NeuralLogo;
