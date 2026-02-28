import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Command,
  Activity,
  Cpu,
  Zap,
  Database,
  ShieldCheck,
  Wifi,
  Server,
} from "lucide-react";
import SEO from "../components/SEO";
import {
  getSystemMetrics,
  getRecentLogs,
  fetchAllUsers,
  updateUserField,
  sendBroadcast,
  addHubTopic,
  resetUserProgress,
} from "../services/AdminService";
import { useStore } from "../store/useStore";
import * as LucideIcons from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { initSentry } from "../services/SentryService";
import {
  verifyAdminPasscode,
  logSecurityViolation,
} from "../services/SecurityService";
import { Lock, Unlock } from "lucide-react";

const MasteryBadge = ({ level, color = "indigo" }) => (
  <motion.div
    whileHover={{ rotateY: 20, scale: 1.1 }}
    className={`relative w-16 h-16 flex items-center justify-center rounded-2xl bg-${color}-500/10 border border-${color}-500/20 shadow-lg shadow-${color}-500/5 group/badge`}
  >
    <div
      className={`absolute inset-0 bg-${color}-400/20 blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity`}
    />
    <div className="relative z-10 flex flex-col items-center">
      <Star size={24} className={`text-${color}-400 mb-1`} />
      <span className="text-[8px] font-black uppercase tracking-tighter text-white">
        LVL {level}
      </span>
    </div>
    {/* Lifescape 3D Accent */}
    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
      <div className={`w-2 h-2 rounded-full bg-${color}-400 animate-pulse`} />
    </div>
  </motion.div>
);

const AsciiCoreTerminal = () => {
  const [logs, setLogs] = useState([
    { id: 1, type: "SYSTEM", text: "INITIALIZING SYSTEM..." },
    { id: 2, type: "SECURITY", text: "SECURITY LAYER ACTIVE" },
    { id: 3, type: "MASTERY", text: "SYNCING DATABASE..." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const texts = [
        "HIGH TRAFFIC DETECTED",
        "UPDATING LEARNING DATA",
        "CREATING NEW TOPICS...",
        "SYNC COMPLETE",
      ];
      setLogs((prev) => [
        ...prev.slice(-10),
        {
          id: Date.now(),
          type: "LIVE",
          text: texts[Math.floor(Math.random() * texts.length)],
        },
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group overflow-hidden glass-panel rounded-[48px] border border-white/5 bg-black/60 p-10 font-mono text-[10px] leading-relaxed min-h-[400px]">
      <div className="absolute inset-0 dither-overlay opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/[0.05] animate-scanline" />

      <div className="relative z-10">
        <pre className="text-indigo-400 mb-8 opacity-70 ascii-font leading-[1] select-none animate-glitch">
          {`   _____   _____   _____   _____   _____           
  /  _  \\ /  ___| /  ___| |_   _| |_   _|          
  | /_\\ | | (___  | |       | |     | |            
  |  _  | \\___  \\ | |       | |     | |            
  | | | |  ____) | | |___  _| |_   _| |_           
  \\_| |_/ |_____/  \\_____| |_____| |_____|CORE.EXE`}
        </pre>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-white/70">
                [{new Date(log.id).toLocaleTimeString()}]
              </span>
              <span
                className={
                  log.type === "SYSTEM"
                    ? "text-emerald-500"
                    : log.type === "SECURITY"
                      ? "text-indigo-400"
                      : log.type === "MASTERY"
                        ? "text-amber-400"
                        : "text-white/90"
                }
              >
                {log.type}
              </span>
              <span className="text-white/70 italic uppercase tracking-widest">
                {log.text}
              </span>
            </div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-white/20 inline-block ml-1 align-middle"
          />
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { role, user } = useStore();
  const queryClient = useQueryClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    initSentry();
  }, []);

  const { data: metrics = { latency: 0, uptime: 100, totalUsers: 0 } } =
    useQuery({
      queryKey: ["system_metrics"],
      queryFn: getSystemMetrics,
      refetchInterval: 15000,
    });

  const { data: logs = [] } = useQuery({
    queryKey: ["recent_logs"],
    queryFn: getRecentLogs,
    refetchInterval: 15000,
  });

  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ["all_users"],
    queryFn: fetchAllUsers,
  });

  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [hubTopic, setHubTopic] = useState({
    title: "",
    id: "",
    icon: "Sparkles",
    color: "bg-indigo-500/10",
  });

  const handleUpdate = async (uid, field, value) => {
    const success = await updateUserField(uid, field, value);
    if (success) {
      queryClient.invalidateQueries(["all_users"]);
    }
  };

  const handleBroadcast = async () => {
    setIsPublishing(true);
    const success = await sendBroadcast(broadcastMessage);
    if (success) {
      alert("Broadcast sequence initiated.");
    }
    setIsPublishing(false);
  };

  const handleHubForge = async () => {
    if (!hubTopic.title || !hubTopic.id) return;
    const success = await addHubTopic(hubTopic);
    if (success) {
      alert(
        `Topic '${hubTopic.title}' created.\n\nLineage: [Model: gemini-2.5-flash] recorded.`,
      );
      setHubTopic({
        title: "",
        id: "",
        icon: "Sparkles",
        color: "bg-indigo-500/10",
      });
    }
  };

  const handleReset = async (uid) => {
    if (!window.confirm("Are you sure you want to wipe this neural progress?"))
      return;
    const success = await resetUserProgress(uid);
    if (success) {
      alert("Progress purged.");
    }
  };

  const handleSecurityCheck = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    const success = await verifyAdminPasscode(passcode);
    if (success) {
      setIsAuthorized(true);
    } else {
      setError("ACCESS DENIED: Incorrect key.");
      logSecurityViolation({
        uid: user?.uid,
        email: user?.email,
        timestamp: new Date().toISOString(),
      });
    }
    setIsVerifying(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-32 relative">
        <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-[56px] border border-red-500/20 max-w-md w-full text-center relative z-20"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 text-red-500 shadow-2xl shadow-red-500/20">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
            Step-Up Required
          </h2>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-widest mb-8 leading-relaxed">
            Enter your Admin Key to <br /> unlock the dashboard.
          </p>

          <form onSubmit={handleSecurityCheck} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="NEURAL-KEY-XXXX"
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-center text-white focus:border-red-500 outline-none transition-all font-mono tracking-widest uppercase"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">
                {error}
              </p>
            )}
            <button
              disabled={isVerifying}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? "SECURE SYNC..." : "VALIDATE KEY"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto py-12 px-6">
      <SEO
        title="Admin Control Center"
        description="System monitoring and administrative tools."
      />

      <div className="text-center mb-16 relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500 rounded-full blur-[100px] -z-10"
        />
        <div className="w-20 h-20 rounded-[28px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 text-red-500 shadow-2xl shadow-red-500/20 group">
          <Command
            size={32}
            className="group-hover:rotate-90 transition-transform duration-500"
          />
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase leading-none">
          Admin <span className="text-red-500">Panel</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.3em]">
          <ShieldCheck size={12} /> Access Level: Super Admin
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Total Users",
            value: metrics.totalUsers?.toLocaleString() || "0",
            icon: Database,
            color: "text-indigo-400",
            trend: "+12.5%",
          },
          {
            label: "System Uptime",
            value: `${metrics.systemUptime}%`,
            icon: Wifi,
            color: "text-emerald-400",
            trend: "Stable",
          },
          {
            label: "API Latency",
            value: `${metrics.apiLatency}ms`,
            icon: Activity,
            color: "text-amber-400",
            trend: "-2ms",
          },
          {
            label: "System Health",
            value: metrics.apiLatency < 50 ? "Excellent" : "Nominal",
            icon: Cpu,
            color: "text-red-400",
            trend: "Optimal",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[48px] glass-panel border border-white/5 relative group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors">
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-[10px] font-black font-mono text-white/70 uppercase tracking-widest">
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-black text-white/80 uppercase tracking-[0.3em]">
                {stat.label}
              </div>
              <div className="text-3xl font-black text-white tracking-tighter italic">
                {stat.value}
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${stat.color.split("-")[1]}-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <AsciiCoreTerminal />

          <div className="glass-panel p-10 rounded-[48px] border border-white/5 overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-8 flex items-center gap-3 italic">
              <Database size={14} className="text-indigo-500" />
              Persona Management
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="text-white/70 uppercase tracking-widest border-b border-white/5">
                    <th className="pb-4 font-black">Identity</th>
                    <th className="pb-4 font-black">Email</th>
                    <th className="pb-4 font-black">Role</th>
                    <th className="pb-4 font-black text-center">Mastery</th>
                    <th className="pb-4 font-black text-center">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.uid} className="group hover:bg-white/[0.02]">
                      <td className="py-4 text-white/90 group-hover:text-white transition-colors">
                        {u.uid.slice(0, 8)}...
                      </td>
                      <td className="py-4 text-white/90">{u.email}</td>
                      <td className="py-4">
                        <select
                          value={u.role || "learner"}
                          onChange={(e) =>
                            handleUpdate(u.uid, "role", e.target.value)
                          }
                          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white/80 focus:border-indigo-500 outline-none disabled:opacity-50"
                          disabled={
                            u.role === "singularity" ||
                            (u.role === "admin" && role !== "singularity")
                          }
                        >
                          <option value="learner">LEARNER</option>
                          <option value="moderator">MODERATOR</option>
                          <option value="admin">ADMIN</option>
                          {role === "singularity" && (
                            <option value="singularity">SINGULARITY</option>
                          )}
                        </select>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() =>
                            handleUpdate(u.uid, "isPremium", !u.isPremium)
                          }
                          className={`px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-tighter transition-all ${u.isPremium ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/70 border border-white/10 hover:border-emerald-500/40 hover:text-white"}`}
                        >
                          {u.isPremium ? "Premium Active" : "Promote to Prem"}
                        </button>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleReset(u.uid)}
                          className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 transition-all"
                          title="Reset Progress"
                        >
                          <LucideIcons.RotateCcw size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border border-white/5 min-h-[400px]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-8 flex items-center gap-3">
              <Server size={14} className="text-red-500" />
              Activity Stream
            </h3>
            <div className="space-y-4 font-mono">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 text-[10px] py-3 border-b border-white/5 text-white/90"
                  >
                    <span className="text-red-500/60 font-black w-20 text-nowrap">
                      {log.time}
                    </span>
                    <span className="flex-1 font-bold text-white/90 tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500/40" />
                      {log.topic || log.type || "System Sync"}
                    </span>
                    <span
                      className={`text-[8px] px-2 py-0.5 rounded font-black ${log.flagged ? "bg-red-500/10 text-red-500" : "bg-white/5 text-white/90"}`}
                    >
                      {log.flagged ? "AUDIT" : "ACTIVE"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-white/70">
                  Waiting for synaptic signals...
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-8 flex items-center gap-3">
              <Zap size={14} className="text-amber-500" />
              Topic Creator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Topic ID (e.g., node-pro)"
                value={hubTopic.id}
                onChange={(e) =>
                  setHubTopic({ ...hubTopic, id: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
              />
              <input
                type="text"
                placeholder="Display Title"
                value={hubTopic.title}
                onChange={(e) =>
                  setHubTopic({ ...hubTopic, title: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
              />
              <select
                value={hubTopic.icon}
                onChange={(e) =>
                  setHubTopic({ ...hubTopic, icon: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              >
                {Object.keys(LucideIcons)
                  .filter((k) => typeof LucideIcons[k] === "function")
                  .slice(0, 50)
                  .map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleHubForge}
                className="py-3 rounded-2xl bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
              >
                Create Topic
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-10 rounded-[48px] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-6">
              System Monitoring
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    Safety Layer
                  </span>
                  <span className="text-[9px] font-black text-emerald-500">
                    ACTIVE
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["95%", "98%", "95%"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-red-500/5 border border-red-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                    Bias Guard
                  </span>
                  <span className="text-[9px] font-black text-emerald-500">
                    OPERATIONAL
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["100%", "98%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-6 flex items-center gap-2">
              <LucideIcons.Radio size={14} className="text-emerald-500" />
              Global Broadcast
            </h3>
            <textarea
              placeholder="Enter transmission..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono mb-4 resize-none"
            />
            <button
              onClick={handleBroadcast}
              disabled={isPublishing}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {isPublishing ? "Transmitting..." : "Initiate Broadcast"}
            </button>
          </div>

          <button className="w-full py-6 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all shadow-xl hover:shadow-red-500/20">
            Restart Servers
          </button>

          <div className="p-10 rounded-[48px] border border-dashed border-white/10 text-center">
            <ShieldCheck size={32} className="mx-auto text-white/70 mb-4" />
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-relaxed">
              Manual Governance Protocol <br />
              Authorized By Super Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
