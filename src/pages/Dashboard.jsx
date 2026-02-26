import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  RefreshCw,
  ChevronRight,
  Target,
  Zap,
  Activity,
  CheckCircle,
  FileText,
  Map,
  Sparkles as SparkleIcon,
  BrainCircuit,
  Layout,
  Globe,
  Monitor,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { TOPIC_CATEGORIES, learningPaths } from "../data/roadmapData";
import SEO from "../components/SEO";
import NeuralFeed from "../components/NeuralFeed";
import PremiumModal from "../components/PremiumModal";
import NeuralFabric from "../components/NeuralFabric";
import NeuralAtoms from "../components/NeuralAtoms";

const DashCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -5 }}
    className="group relative glass-panel p-8 rounded-[40px] border border-white/5 overflow-hidden flex flex-col items-center text-center space-y-4 shadow-2xl"
  >
    <div
      className={`absolute inset-0 bg-${color}-500/5 blur-3xl group-hover:bg-${color}-500/10 transition-all duration-700 opacity-0 group-hover:opacity-100`}
    />

    <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-0 overflow-hidden group/img">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <motion.div
          initial={{ x: "-150%" }}
          whileInView={{ x: "150%" }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: delay + 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />
      </div>
      <Icon
        size={32}
        className={`text-${color}-400 opacity-50 group-hover:opacity-100 transition-opacity`}
      />
    </div>

    <div className="space-y-1 relative z-10">
      <div className="text-3xl font-black text-white uppercase font-syne italic tracking-tighter">
        {value}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 font-syne">
        {label}
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const {
    score,
    skillStats,
    reset,
    currentQuiz,
    userTopic,
    roadmapProgress,
    user,
    usageStats,
    isPremium,
  } = useStore();
  const [vaultCount, setVaultCount] = useState(0);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const fetchVaultStats = async () => {
      if (user) {
        try {
          const { getDocs, collection, db } =
            await import("../services/firebase");
          const vaultSnap = await getDocs(collection(db, "vault"));
          setVaultCount(vaultSnap.size);
        } catch (e) {
          const localQuiz = localStorage.getItem("quiz_data") ? 1 : 0;
          setVaultCount(localQuiz + Object.keys(roadmapProgress).length);
        }
      }
    };
    fetchVaultStats();
  }, [user, roadmapProgress]);

  const navigate = useNavigate();

  const activePaths = Object.entries(roadmapProgress)
    .map(([pathId, completedNodes]) => {
      const path = learningPaths.find((p) => p.id === pathId);
      if (!path) return null;
      const totalNodes = path.nodes.length;
      const completedCount = completedNodes.length;
      const progress = Math.round((completedCount / totalNodes) * 100);

      const category = [
        ...TOPIC_CATEGORIES.ROLES,
        ...TOPIC_CATEGORIES.SKILLS,
        ...TOPIC_CATEGORIES.BEST_PRACTICES,
      ].find((c) => c.id === pathId);

      return {
        id: pathId,
        title: path.title,
        progress,
        completedCount,
        totalNodes,
        icon: category?.icon || "Map",
        color: category?.color || "bg-indigo-500/10",
      };
    })
    .filter(Boolean);

  const avgMastery =
    activePaths.length > 0
      ? Math.round(
          activePaths.reduce((acc, curr) => acc + curr.progress, 0) /
            activePaths.length,
        )
      : 0;

  const hasActiveQuiz = currentQuiz && currentQuiz.length > 0;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-12 flex flex-col items-center relative overflow-hidden">
      <NeuralFabric />
      <NeuralAtoms />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl w-full relative z-10"
      >
        <SEO
          title="Neural Command Center"
          description="Manage your custom learning roadmaps and tracked progress."
        />

        {/* Global Progress Hub */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <Activity size={14} className="text-indigo-400" />
              Intelligence Core Active
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic font-syne leading-none">
              COMMAND <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">
                CENTER
              </span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => navigate("/generator")}
              className="w-full sm:w-auto px-12 py-6 rounded-[32px] bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-[#DFFF00] transition-all shadow-4xl shadow-white/5 flex items-center justify-center gap-4 group"
            >
              Synthesize Quiz
              <Zap
                size={18}
                className="fill-current group-hover:scale-110 transition-transform"
              />
            </button>
            <button
              onClick={() => navigate("/hub")}
              className="w-full sm:w-auto px-12 py-6 rounded-[32px] bg-white/5 border border-white/10 text-white/60 font-black uppercase text-xs tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-4"
            >
              Learning Hub
            </button>
          </div>
        </div>

        {/* Neural Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <DashCard
            label="Neural Capacity"
            value={isPremium ? "ULTD" : `${usageStats.roadmapsGenerated}/03`}
            icon={Zap}
            color="indigo"
            delay={0.1}
          />
          <DashCard
            label="Avg. Retention"
            value={`${avgMastery}%`}
            icon={Target}
            color="emerald"
            delay={0.2}
          />
          <DashCard
            label="Goals Synced"
            value={Object.values(roadmapProgress).flat().length}
            icon={CheckCircle}
            color="cyan"
            delay={0.3}
          />
          <DashCard
            label="Vault Items"
            value={vaultCount}
            icon={FileText}
            color="indigo"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Missions & Roadmaps */}
          <div className="lg:col-span-2 space-y-12">
            {hasActiveQuiz && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-[50px] glass-panel border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 opacity-50" />
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 shrink-0">
                    <BrainCircuit className="text-white" size={40} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-syne italic leading-none">
                      Active Stream
                    </h2>
                    <p className="text-white/40 font-black uppercase text-[10px] tracking-widest">
                      {userTopic || "Custom Study Session"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/quiz")}
                    className="flex-1 md:flex-none px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Resume <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      reset();
                      navigate("/generator");
                    }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-white/30 hover:text-red-500 transition-all"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="p-12 rounded-[60px] glass-panel border border-white/5 shadow-4xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.05),transparent)]" />
              <div className="relative z-10 space-y-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-4 italic font-syne">
                  <Map className="text-indigo-500" size={24} />
                  Active Learning Paths
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activePaths.length > 0 ? (
                    activePaths.map((path) => (
                      <motion.div
                        key={path.id}
                        whileHover={{ y: -5 }}
                        className="space-y-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group cursor-pointer relative overflow-hidden"
                        onClick={() => navigate(`/roadmap/${path.id}`)}
                      >
                        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.02] transition-colors" />
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/20">
                              <Map size={20} />
                            </div>
                            <span className="text-lg font-black text-white uppercase font-syne tracking-tight group-hover:text-indigo-400 transition-colors">
                              {path.title}
                            </span>
                          </div>
                          <span className="text-2xl font-black text-indigo-400 italic font-syne">
                            {path.progress}%
                          </span>
                        </div>
                        <div className="space-y-2 relative z-10">
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${path.progress}%` }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                            <span>
                              {path.completedCount} / {path.totalNodes} STEPS
                            </span>
                            <span>Level Up Available</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-20 bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/10 group-hover:scale-110 transition-transform">
                        <Map size={40} />
                      </div>
                      <p className="text-white/30 font-black uppercase text-xs tracking-[0.3em]">
                        No active roadmaps found.
                      </p>
                      <button
                        onClick={() => navigate("/hub")}
                        className="mt-8 px-8 py-4 rounded-2xl border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        Initialize Mission
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Assistant Column */}
          <div className="space-y-12">
            <div className="p-10 rounded-[50px] glass-panel border border-white/5 shadow-3xl relative overflow-hidden group min-h-[500px]">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform -z-0">
                <SparkleIcon size={300} className="text-indigo-500" />
              </div>
              <div className="relative z-10">
                <NeuralFeed skillStats={skillStats} userTopic={userTopic} />
              </div>
            </div>

            {!isPremium && (
              <motion.div
                whileHover={{ y: -5 }}
                className="p-12 rounded-[50px] bg-gradient-to-br from-indigo-600 to-indigo-900 border border-white/10 shadow-4xl relative overflow-hidden group cursor-pointer"
                onClick={() => setIsPremiumModalOpen(true)}
              >
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl">
                      <Zap className="text-white" size={32} />
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter font-syne">
                        UPGRADE
                      </h4>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">
                        Neural Tier II
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Unlimited Generation",
                      "Document Intel",
                      "Priority Synthesis",
                    ].map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/70"
                      >
                        <CheckCircle size={16} className="text-[#DFFF00]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-6 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#DFFF00] transition-all shadow-2xl">
                    Enhance Core
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
