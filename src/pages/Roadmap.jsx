import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Lock,
  CheckCircle,
  Play,
  Target,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import NeuralLogo from "../components/NeuralLogo";
import { useStore } from "../store/useStore";
import { learningPaths } from "../data/roadmapData";
import SEO from "../components/SEO";
import RoadmapQuestionnaire from "../components/RoadmapQuestionnaire";

const Roadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    roadmapProgress,
    roadmapLevels,
    setRoadmapLevel,
    setActiveRoadmap,
    generateAIQuiz,
    resetRoadmapProgress,
    customRoadmaps,
  } = useStore();

  const [selectedNode, setSelectedNode] = useState(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isVaultSync, setIsVaultSync] = useState(false);
  const [synthStage, setSynthStage] = useState(0);

  const synthStages = [
    "Analyzing subject...",
    "Creating questions...",
    "Building your plan...",
    "Almost ready...",
  ];

  const path =
    learningPaths.find((p) => p.id === id) ||
    customRoadmaps.find((p) => p.id === id);
  const completed = roadmapProgress[id] || [];
  const level = roadmapLevels[id];

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure? This will wipe your progress for this mission.",
      )
    ) {
      resetRoadmapProgress(id);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!path || !level) return;

    const currentActive =
      path.nodes.find((n) => !completed.includes(n.id)) ||
      path.nodes[path.nodes.length - 1];

    if (!selectedNode) {
      setSelectedNode(currentActive);
    } else if (
      completed.includes(selectedNode.id) &&
      selectedNode.id !== currentActive.id
    ) {
      setSelectedNode(currentActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path?.id, level, completed.length]);

  useEffect(() => {
    let interval;
    if (isSynthesizing) {
      interval = setInterval(() => {
        setSynthStage((prev) => (prev + 1) % synthStages.length);
      }, 1200);
    } else {
      setSynthStage(0);
    }
    return () => clearInterval(interval);
  }, [isSynthesizing]);

  const handleStartNode = async (node) => {
    setIsSynthesizing(true);
    setActiveRoadmap(id, node.id);

    const { getQuizFromVault } = await import("../services/dbService");
    const cached = await getQuizFromVault(node.topic, "Intermediate");
    if (cached) {
      setIsVaultSync(true);
      await new Promise((r) => setTimeout(r, 800));
    }

    const success = await generateAIQuiz(node.topic, "Intermediate");
    if (success) navigate("/quiz");

    setIsSynthesizing(false);
    setIsVaultSync(false);
  };

  if (!path) {
    return (
      <div className="py-40 text-center uppercase font-black text-white/70">
        Path Not Found
      </div>
    );
  }

  if (!level) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-6">
        <SEO
          title={`Setup | ${path.title}`}
          description="Start your journey."
        />
        <RoadmapQuestionnaire
          roadmapTitle={path.title}
          onComplete={(selectedLevel) => setRoadmapLevel(id, selectedLevel)}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#030303] min-h-screen text-white/90 font-sans pb-32">
      <SEO
        title={`${path.title} Journey`}
        description={`Master ${path.title} phase by phase.`}
      />

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#030303]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/hub")}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Back to Hub</span>
        </button>
        <h1 className="text-lg font-black uppercase tracking-wider truncate mx-4">
          {path.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-xs font-bold text-white/50">
            {completed.length} / {path.nodes.length} Completed
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
            title="Reset Progress"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* TIMELINE ARCHITECTURE */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 relative">
        {/* The Vertical Line */}
        <div className="absolute left-[39px] sm:left-[47px] top-8 bottom-8 w-[2px] bg-white/5" />

        <div className="space-y-6">
          {path.nodes.map((node, index) => {
            const isCompleted = completed.includes(node.id);
            const isLocked =
              index > 0 && !completed.includes(path.nodes[index - 1].id);
            const isActive = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                className="relative flex items-start gap-6 sm:gap-8 group"
              >
                {/* Timeline Node Symbol */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center border-[3px] bg-[#030303] z-10 transition-colors duration-300 mt-2 ${
                    isCompleted
                      ? "border-emerald-500 text-emerald-500"
                      : isLocked
                        ? "border-white/10 text-white/20"
                        : isActive
                          ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                          : "border-white/20 text-white/40 group-hover:border-white/40"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} />
                  ) : isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <Target size={20} />
                  )}
                </div>

                {/* Node Content Card */}
                <div
                  onClick={() => !isLocked && setSelectedNode(node)}
                  className={`flex-1 rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isLocked
                      ? "opacity-50 border-white/5 bg-white/[0.02] cursor-not-allowed"
                      : isActive
                        ? "border-indigo-500/50 bg-indigo-500/5 cursor-default shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {/* Card Header (Always visible) */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div
                        className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isActive ? "text-indigo-400" : "text-white/40"}`}
                      >
                        Phase 0{index + 1} • {node.category}
                      </div>
                      <h3
                        className={`text-lg sm:text-xl font-black tracking-tight ${isActive ? "text-white" : "text-white/90"}`}
                      >
                        {node.title}
                      </h3>
                    </div>
                    {!isLocked && !isActive && !isCompleted && (
                      <div className="self-start sm:self-auto w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white/10 group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>

                  {/* Expandable Details (Only visible when active) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 px-5 sm:px-6 py-6"
                      >
                        <p className="text-white/70 font-medium mb-8 leading-relaxed text-sm sm:text-base">
                          <span className="text-white/90 font-bold block mb-2 uppercase text-xs tracking-wider">
                            Objective Assessment
                          </span>
                          {node.topic}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {isCompleted ? (
                            <div className="inline-flex px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm items-center justify-center gap-2">
                              <CheckCircle size={18} /> Module Verified
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartNode(node);
                              }}
                              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-indigo-400 hover:text-white transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                              <Play size={18} fill="currentColor" />
                              Commence Training
                            </button>
                          )}

                          <span className="text-xs font-semibold uppercase tracking-widest text-white/20 text-center sm:text-right">
                            {isVaultSync ? "Quick Sync" : "Neural Generation"}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SYNTHESIS OVERLAY (AI Generating) */}
      <AnimatePresence>
        {isSynthesizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030303]/98 backdrop-blur-xl z-[500] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-48 h-48 mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-indigo-500/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <NeuralLogo size={80} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={synthStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  {synthStages[synthStage]}
                </h2>
                <div className="flex gap-2 justify-center">
                  {synthStages.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === synthStage
                          ? "w-12 bg-indigo-500"
                          : "w-3 bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-12 text-indigo-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              {isVaultSync ? "Loading Cached Data" : "Generating Neural Quiz"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roadmap;
