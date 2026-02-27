import React from "react";
import { motion } from "framer-motion";

const SkillRadar = ({ stats }) => {
  // stats: { Syntax: 10, Architecture: 5, Logic: 15, Theory: 8, Security: 12 }
  const categories = Object.keys(stats);
  const values = Object.values(stats);
  // Prevent division by zero if all stats are 0
  const maxVal = Math.max(...values, 10);

  const size = 300;
  const center = size / 2;
  const radius = center - 40; // Padding for labels

  const getPoint = (val, max, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (val / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 20) * Math.sin(angle),
    };
  };

  const points = categories.map((cat, i) => ({
    ...getPoint(stats[cat], maxVal, i, categories.length),
    label: cat,
    val: stats[cat],
  }));

  const pathData = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Background Pentagons (grid levels)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
  const gridPaths = gridLevels.map((level) => {
    const pts = categories.map((_, i) =>
      getPoint(10 * level, 10, i, categories.length),
    );
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  });

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-4">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Grid Polygons */}
        {gridPaths.map((path, i) => (
          <polygon
            key={`grid-${i}`}
            points={path}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines extending from center */}
        {categories.map((_, i) => {
          const edge = getPoint(maxVal, maxVal, i, categories.length);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={edge.x}
              y2={edge.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
          points={pathData}
          fill="url(#radarGradient)"
          stroke="#818cf8"
          strokeWidth="2"
          className="origin-center"
        />

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.labelX}
            y={p.labelY}
            fill="rgba(255,255,255,0.7)"
            fontSize="11"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="font-medium tracking-wide"
          >
            {p.label}
          </text>
        ))}

        {/* Value Nodes */}
        {points.map((p, i) => (
          <motion.circle
            key={`node-${i}`}
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            fill="#a855f7"
            className="shadow-xl"
          />
        ))}

        <defs>
          <linearGradient
            id="radarGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(99,102,241,0.5)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.2)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SkillRadar;
