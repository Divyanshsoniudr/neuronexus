import React from "react";
import { motion } from "framer-motion";
import {
  Server,
  Database,
  Globe,
  Cloud,
  Code,
  Terminal,
  Cpu,
  Braces,
  Shield,
  Lock,
  Fingerprint,
  Eye,
  Layers,
  Zap,
  Activity,
} from "lucide-react";

// --- Shared Styles ---
const colors = {
  primary: "#6366f1", // Indigo 500
  secondary: "#38bdf8", // Sky 400
  accent: "#f472b6", // Pink 400
  bg: "#1e293b", // Slate 800
  text: "#94a3b8", // Slate 400
};

// --- Archetype A: Battle Roles (Infrastructure Cluster) ---
export const StorysetRoles = ({ isHovered = false }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full"
    >
      {/* Central Node */}
      <motion.div
        animate={{ y: isHovered ? -10 : 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400"
      >
        <Server size={64} strokeWidth={1.5} />
      </motion.div>

      {/* Orbiting Nodes */}
      <motion.div
        animate={{ x: isHovered ? -40 : -30, y: isHovered ? -10 : 0 }}
        className="absolute top-1/3 left-1/4 text-sky-400 opacity-80"
      >
        <Database size={32} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        animate={{ x: isHovered ? 40 : 30, y: isHovered ? -10 : 0 }}
        className="absolute top-1/3 right-1/4 text-emerald-400 opacity-80"
      >
        <Cloud size={32} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        animate={{ y: isHovered ? 10 : 20 }}
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-indigo-300 opacity-60"
      >
        <Globe size={40} strokeWidth={1.5} />
      </motion.div>

      {/* Connector Lines (SVG Overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d="M170 170 L 250 250 L 330 170"
          stroke={colors.primary}
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.3"
        />
        <motion.path
          d="M250 250 L 250 350"
          stroke={colors.primary}
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  </div>
);

// --- Archetype B: Core Skills (Dev Environment) ---
export const StorysetSkills = ({ isHovered = false }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full"
    >
      {/* Main Code Editor */}
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400"
      >
        <Code size={72} strokeWidth={1.5} />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: isHovered ? -15 : 0, rotate: -10 }}
        className="absolute top-1/4 left-1/4 text-pink-400 opacity-80"
      >
        <Braces size={32} strokeWidth={2} />
      </motion.div>

      <motion.div
        animate={{ y: isHovered ? -15 : 0, rotate: 10 }}
        className="absolute top-1/4 right-1/4 text-yellow-400 opacity-80"
      >
        <Zap size={32} strokeWidth={2} />
      </motion.div>

      <motion.div
        animate={{ y: isHovered ? 15 : 0 }}
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-slate-400 opacity-60"
      >
        <Terminal size={40} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  </div>
);

// --- Archetype C: Mastery Secrets (Security Vault) ---
export const StorysetSecrets = ({ isHovered = false }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full"
    >
      {/* Shield Base */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500"
      >
        <Shield size={80} strokeWidth={1} fill="rgba(99, 102, 241, 0.1)" />
      </motion.div>

      {/* Lock Overlay */}
      <motion.div
        animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
      >
        <Lock size={32} strokeWidth={2} />
      </motion.div>

      {/* Scanning Elements */}
      <motion.div
        animate={{ opacity: [0, 1, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 text-emerald-400"
      >
        <Fingerprint size={24} strokeWidth={2} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 text-pink-400 opacity-60"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Activity size={24} strokeWidth={2} />
      </motion.div>
    </motion.div>
  </div>
);
