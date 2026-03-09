import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SkillRadar = ({ stats }) => {
  // stats: { Syntax: 10, Architecture: 5, Logic: 15, Theory: 8, Security: 12 }
  const data = Object.keys(stats).map((key) => ({
    subject: key,
    A: stats[key] || 0,
    fullMark: Math.max(...Object.values(stats), 10),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
            {payload[0].payload.subject}
          </p>
          <p className="text-lg font-bold text-white">
            {payload[0].value}{" "}
            <span className="text-xs text-white/50 font-normal">pts</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[320px] -ml-4 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "rgba(255,255,255,0.6)",
              fontSize: 10,
              fontWeight: 700,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, "dataMax + 2"]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Skill Level"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={2}
            fill="#6366f1"
            fillOpacity={0.2}
            activeDot={{
              r: 4,
              fill: "#818cf8",
              stroke: "#fff",
              strokeWidth: 1,
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadar;
