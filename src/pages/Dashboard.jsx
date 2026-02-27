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
  Bot,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { TOPIC_CATEGORIES, learningPaths } from "../data/roadmapData";
import SEO from "../components/SEO";
import NeuralFeed from "../components/NeuralFeed";
import PremiumModal from "../components/PremiumModal";
import NeuralFabric from "../components/NeuralFabric";
import NeuralAtoms from "../components/NeuralAtoms";
import SkillRadar from "../components/SkillRadar";

const DashCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-all hover:-translate-y-1 shadow-sm"
  >
    <div className="flex items-center justify-between mb-8">
      <span className="text-sm font-medium text-white/50">{label}</span>
      <div
        className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center`}
      >
        <Icon size={18} className={`text-${color}-400`} />
      </div>
    </div>
    <div className="text-3xl font-semibold text-white tracking-tight">
      {value}
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
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 w-full flex justify-center bg-[#050505]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full"
      >
        <SEO
          title="Dashboard"
          description="Manage your learning plans and track your progress."
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-xs font-medium text-white/50">
                System Online
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Overview
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/generator")}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={14} className="fill-current" /> New Session
            </button>
            <button
              onClick={() => navigate("/interview")}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Bot size={14} /> Practice Test
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashCard
            label="Generations"
            value={
              isPremium ? "Unlimited" : `${usageStats.roadmapsGenerated}/3`
            }
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
            label="Active Topics"
            value={Object.values(roadmapProgress).flat().length}
            icon={CheckCircle}
            color="blue"
            delay={0.3}
          />
          <DashCard
            label="Saved Quizzes"
            value={vaultCount}
            icon={FileText}
            color="purple"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {hasActiveQuiz && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
                    <BrainCircuit className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-indigo-400 mb-1">
                      Active Session
                    </p>
                    <h2 className="text-xl font-medium text-white tracking-tight">
                      {userTopic || "Custom Subject"}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/quiz")}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Resume <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => {
                      reset();
                      navigate("/generator");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">
                  Learning Roadmaps
                </h3>
                <button
                  onClick={() => navigate("/hub")}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  Browse Hub <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePaths.length > 0 ? (
                  activePaths.map((path) => (
                    <motion.div
                      key={path.id}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/roadmap/${path.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                          <Map size={14} />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {path.title}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-white/40">
                            {path.completedCount} of {path.totalNodes} steps
                          </span>
                          <span className="text-indigo-400">
                            {path.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${path.progress}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 rounded-2xl border border-dashed border-white/10">
                    <Map size={24} className="mx-auto mb-3 text-white/20" />
                    <p className="text-sm font-medium text-white/40">
                      No active plans.
                    </p>
                    <button
                      onClick={() => navigate("/hub")}
                      className="mt-4 text-sm text-indigo-400 hover:text-white transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Radar Component */}
            <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Activity size={14} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-white">
                  Skill Analysis
                </h3>
              </div>
              <div className="-mx-2 -mb-2">
                <SkillRadar stats={skillStats} />
              </div>
            </div>

            {!isPremium && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsPremiumModalOpen(true)}
                className="p-6 rounded-3xl bg-[#111] border border-indigo-500/20 hover:bg-[#141414] transition-colors cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-indigo-400" size={20} />
                    <h4 className="text-base font-medium text-white tracking-tight">
                      Upgrade to Pro
                    </h4>
                  </div>
                  <p className="text-sm text-white/50 mb-2">
                    Unlock unlimited generations, document uploads, and priority
                    processing.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Global Feed Footer */}
        <div className="mt-8">
          <div className="p-6 rounded-[32px] bg-[#0a0a0a] border border-white/5 shadow-2xl">
            <h3 className="text-xl font-semibold text-white tracking-tight mb-6 px-2">
              Global Signals
            </h3>
            <NeuralFeed skillStats={skillStats} userTopic={userTopic} />
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
