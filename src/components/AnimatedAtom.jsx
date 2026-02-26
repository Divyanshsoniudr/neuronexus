import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedAtom = ({ size = 300, speed = 1 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5 * speed) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [speed]);

  // Orbital paths with different radii, speeds, and electron counts
  const orbitals = [
    { radius: 80, speed: 1, electrons: 3, color: "rgba(59, 130, 246, 0.8)", offset: 0 },
    { radius: 130, speed: 0.7, electrons: 4, color: "rgba(99, 102, 241, 0.8)", offset: 45 },
    { radius: 170, speed: 0.5, electrons: 3, color: "rgba(139, 92, 246, 0.8)", offset: 90 },
  ];

  const nucleusVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
    },
  };

  const electronVariants = {
    orbit: (custom) => ({
      rotate: 360,
    }),
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          filter: "drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))",
        }}
      >
        {/* Orbital paths */}
        {orbitals.map((orbital, idx) => (
          <g
            key={`orbital-${idx}`}
            style={{
              transform: `rotateZ(${orbital.offset}deg)`,
              transformOrigin: `${size / 2}px ${size / 2}px`,
            }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={orbital.radius}
              fill="none"
              stroke={orbital.color}
              strokeWidth="1.5"
              opacity="0.3"
              strokeDasharray="5,5"
            />
          </g>
        ))}

        {/* Center nucleus */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r="16"
          fill="url(#nucleusGradient)"
          animate="pulse"
          variants={nucleusVariants}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          filter="url(#nucleusGlow)"
        />

        {/* Electrons */}
        {orbitals.map((orbital, orbitalIdx) =>
          Array.from({ length: orbital.electrons }).map((_, electronIdx) => {
            const angle =
              (360 / orbital.electrons) * electronIdx +
              rotation * orbital.speed +
              orbital.offset;
            const rad = (angle * Math.PI) / 180;
            const x = size / 2 + orbital.radius * Math.cos(rad);
            const y = size / 2 + orbital.radius * Math.sin(rad);

            return (
              <g key={`electron-${orbitalIdx}-${electronIdx}`}>
                {/* Electron glow */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={orbital.color}
                  opacity="0.4"
                  filter="url(#electronGlow)"
                />
                {/* Electron core */}
                <circle
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill={orbital.color}
                  opacity="0.9"
                />
              </g>
            );
          })
        )}

        {/* Gradient and filter definitions */}
        <defs>
          <radialGradient id="nucleusGradient">
            <stop offset="0%" stopColor="rgba(255, 255, 0, 1)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
          </radialGradient>
          <filter id="nucleusGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="electronGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedAtom;
