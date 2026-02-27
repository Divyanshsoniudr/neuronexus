import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Lock,
  CheckCircle,
  Play,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Shield,
  Rocket,
  Brain,
  Star,
} from "lucide-react";
import NeuralLogo from "../components/NeuralLogo";
import { useStore } from "../store/useStore";
import { learningPaths } from "../data/roadmapData";
import SEO from "../components/SEO";
import RoadmapQuestionnaire from "../components/RoadmapQuestionnaire";

const Roadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

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

  // Initialize scroll tracking hooks at the very top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProgressSpring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate transforms before any early returns
  const pathHeight = useTransform(scrollProgressSpring, [0, 1], ["0%", "100%"]);

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

  // Auto-focus the current node
  useEffect(() => {
    if (path && level) {
      const current =
        path.nodes.find((n) => !completed.includes(n.id)) ||
        path.nodes[path.nodes.length - 1];
      setSelectedNode(current);
    }
  }, [path, level, completed, id]); // Added missing dependencies

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

    // Check if we already have this in the vault for a faster feel
    const { getQuizFromVault } = await import("../services/dbService");
    const cached = await getQuizFromVault(node.topic, "Intermediate");
    if (cached) {
      setIsVaultSync(true);
      // Brief pause for "Neural Sync" aesthetic but much faster than AI gen
      await new Promise((r) => setTimeout(r, 800));
    }

    const success = await generateAIQuiz(node.topic, "Intermediate");
    if (success) navigate("/quiz");

    setIsSynthesizing(false);
    setIsVaultSync(false);
  };

  // EARLY RETURNS MUST COME AFTER ALL HOOKS
  if (!path)
    return (
      <div className="py-40 text-center uppercase font-black text-white/10">
        Path Not Found
      </div>
    );

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
    <div className="w-full bg-[#030303] min-h-screen relative overflow-hidden flex flex-col pt-10">
      <SEO
        title={`${path.title} Journey`}
        description={`Master ${path.title} phase by phase.`}
      />

      {/* --- CINEMATIC HEADER --- */}
      <div className="fixed top-0 left-0 right-0 h-24 z-50 flex items-center justify-between px-6 lg:px-12 backdrop-blur-xl border-b border-white/5 bg-black/40">
        <button
          onClick={() => navigate("/hub")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Hub
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1 italic">
            Active Mission
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter italic font-syne">
            {path.title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleReset}
            className="hidden md:block px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all font-syne italic"
          >
            Reset Mission
          </button>
          <div className="hidden md:flex flex-col items-end">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              Tier Progress
            </div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest font-syne">
              {completed.length} / {path.nodes.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#DFFF00] bg-white/[0.03]">
            <Target size={20} />
          </div>
        </div>
      </div>

      {/* Decorative Energy Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, 20, -20, 0],
              opacity: [0, 0.2, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className="absolute"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 10}%`,
            }}
          >
            <Sparkles size={16 + i * 2} className="text-indigo-500/30" />
          </motion.div>
        ))}
      </div>

      {/* --- THE IMMERSIVE JOURNEY PATH --- */}
      <div
        ref={containerRef}
        className="flex-1 w-full max-w-2xl mx-auto py-40 px-6 relative"
      >
        {/* The Vertical Track (Adventure Path) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-3 bg-white/[0.02] rounded-full overflow-hidden">
          <motion.div
            style={{
              height: pathHeight,
            }}
            className="w-full bg-gradient-to-b from-indigo-500 via-indigo-400 to-[#DFFF00] shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-[2px] bg-white/5 blur-[1px]" />

        <div className="relative z-40 space-y-48 flex flex-col items-center">
          {path.nodes.map((node, index) => {
            const isCompleted = completed.includes(node.id);
            const isLocked =
              index > 0 && !completed.includes(path.nodes[index - 1].id);
            const isActive = selectedNode?.id === node.id;
            const isReady = !isCompleted && !isLocked;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-10% 0% -10% 0%", once: false }}
                className={`relative flex items-center gap-20 w-full group ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Node Sphere */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className="relative cursor-pointer z-50 p-4 -m-4"
                >
                  {isReady && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl"
                    />
                  )}

                  <div
                    className={`w-24 h-24 rounded-[35%] border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 relative z-10 ${
                      isActive
                        ? "bg-white border-[#DFFF00] text-black shadow-[0_0_50px_rgba(223,255,0,0.5)]"
                        : isCompleted
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : isLocked
                            ? "bg-black border-white/5 text-white/5"
                            : "bg-white/5 border-white/10 text-white shadow-xl"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={32} />
                    ) : isLocked ? (
                      <Lock size={20} />
                    ) : (
                      <Play size={32} fill="currentColor" />
                    )}
                  </div>

                  <div
                    className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${isActive ? "text-[#DFFF00]" : "text-white/20"}`}
                  >
                    Step 0{index + 1}
                  </div>
                </div>

                {/* Node Details (Shown only when active or hovered on desktop) */}
                <div
                  className={`flex-1 hidden md:block transition-all duration-700 ${isActive ? "opacity-100 translate-x-0 scale-100" : "opacity-20 group-hover:opacity-40 translate-x-10 scale-95"}`}
                >
                  <div
                    className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic ${isActive ? "text-indigo-400" : "text-white/20"}`}
                  >
                    {node.category}
                  </div>
                  <h3
                    className={`text-3xl lg:text-4xl font-black uppercase tracking-tighter italic font-syne mb-4 ${isActive ? "text-white" : "text-white/40"}`}
                  >
                    {node.title}
                  </h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs truncate">
                    {node.topic}
                  </p>
                </div>

                {/* Mobile labels (Simplified) */}
                <div className="absolute md:hidden top-0 left-28 whitespace-nowrap">
                  <h4 className="text-lg font-black text-white/50 uppercase italic">
                    {node.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Chapter Recommendations */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              className="mt-32 border-t border-white/5 pt-16 relative z-40 pb-48"
            >
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Star size={12} /> External Intelligence
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  Recommended Reading
                </h3>
                <p className="text-white/40 text-sm mt-2 font-medium">
                  Curated articles to master{" "}
                  <span className="text-white/80">'{selectedNode.topic}'</span>
                </p>
              </div>

              <NeuralFeed userTopic={selectedNode.topic} skillStats={{}} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PERSISTENT MISSION CONTROL ACTION BAR --- */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-0 right-0 z-[100] px-6 lg:px-12 pointer-events-none"
          >
            <div className="max-w-6xl mx-auto w-full h-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-6 lg:px-12 pointer-events-auto relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex items-center gap-8 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Target className="text-[#DFFF00]" size={32} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">
                      Current Focus
                    </span>
                    <div className="h-px w-10 bg-white/10" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                      {selectedNode.category}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tighter italic font-syne truncate leading-none">
                    {selectedNode.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 shrink-0">
                <div className="hidden xl:flex items-center gap-6 border-x border-white/5 px-8">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">
                      Objective
                    </div>
                    <div className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[150px]">
                      {selectedNode.topic}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">
                      Status
                    </div>
                    <div
                      className={`text-xs font-black uppercase tracking-widest ${completed.includes(selectedNode.id) ? "text-emerald-400" : "text-[#DFFF00]"}`}
                    >
                      {completed.includes(selectedNode.id)
                        ? "Verified"
                        : "Pending Sync"}
                    </div>
                  </div>
                </div>

                {(() => {
                  const idx = path.nodes.findIndex(
                    (n) => n.id === selectedNode.id,
                  );
                  const isLocked =
                    idx > 0 && !completed.includes(path.nodes[idx - 1].id);

                  if (isLocked) {
                    return (
                      <div className="px-8 py-4 rounded-3xl bg-white/5 border border-white/5 opacity-50 flex items-center gap-4">
                        <Lock size={20} className="text-white/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Finish Previous Goal
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => handleStartNode(selectedNode)}
                      className="px-12 lg:px-16 py-6 lg:py-8 rounded-[30px] bg-white text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm flex items-center gap-4 hover:bg-[#DFFF00] transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95 group"
                    >
                      <Zap size={24} className="group-hover:animate-pulse" />
                      START LEARNING
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </button>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SYNTHESIS OVERLAY (AI Generating) --- */}
      <AnimatePresence>
        {isSynthesizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-[100px] z-[500] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-64 h-64 mb-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-indigo-500/10 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotateY: [0, 180, 360] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <NeuralLogo size={120} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={synthStage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <h2 className="text-5xl font-black tracking-tight uppercase text-white font-syne italic leading-none">
                  {synthStages[synthStage]}
                </h2>
                <div className="flex gap-4 justify-center">
                  {synthStages.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        i === synthStage
                          ? "w-20 bg-[#DFFF00]"
                          : "w-4 bg-white/5"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-16 text-[#DFFF00] text-xs font-black uppercase tracking-[1em] animate-pulse font-syne italic">
              {isVaultSync ? "LOADING SAVED QUIZ" : "GENERATING NEW QUIZ"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
    </div>
  );
};

export default Roadmap;
