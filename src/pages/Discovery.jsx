import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Sparkles,
  Rocket,
  ChevronRight,
  Play,
  Layout,
  FileText,
  Code,
  TrendingUp,
  BarChart3,
  Target,
  X,
  HelpCircle,
  Zap,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TOPIC_CATEGORIES, learningPaths } from "../data/roadmapData";
import { useStore } from "../store/useStore";
import SEO from "../components/SEO";
import PremiumModal from "../components/PremiumModal";
import { fetchHubTopics } from "../services/AdminService";
import { useQuery } from "@tanstack/react-query";
import ShaderGradient from "../components/ShaderGradient";
import WireframeAtom from "../components/WireframeAtom";

const VignetteCard = ({ item, isLarge, onSelect, nodeCount }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = LucideIcons[item.icon] || LucideIcons.Sparkles;

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 0.98, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(item)}
      className={`group relative flex flex-row items-center justify-start gap-5 p-5 rounded-[24px] glass-panel border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-left overflow-hidden z-10 ${
        isLarge ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"
      }`}
    >
      {/* Dynamic Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent group-hover:from-white/[0.05] transition-all -z-10" />

      {/* Icon Wrapper */}
      <div
        className={`w-14 h-14 shrink-0 rounded-[20px] bg-white/5 border border-white/5 group-hover:border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}
      >
        <div className="absolute inset-0 bg-white/10 blur-[15px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Icon size={24} strokeWidth={2} className="text-white relative z-10" />
      </div>

      <div className="flex-1 space-y-1 relative z-20 overflow-hidden pr-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-white truncate">
          {item.title}
        </h3>
        {nodeCount > 0 && (
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-bold text-white tracking-[0.3em] uppercase">
              {nodeCount} MILESTONES
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
};

const CategorySection = ({
  title,
  items,
  onSelect,
  featured = false,
  roadmapCounts = {},
}) => {
  return (
    <div className="mb-24 relative">
      <div className="flex items-center gap-4 mb-12 px-4 italic">
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
        <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white opacity-80">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <VignetteCard
            key={item.id}
            item={item}
            isLarge={featured && idx === 0}
            onSelect={onSelect}
            nodeCount={roadmapCounts[item.id]}
          />
        ))}
      </div>
    </div>
  );
};

const Discovery = () => {
  const { user, skillStats, customRoadmaps, isPremium, usageStats } =
    useStore();
  const navigate = useNavigate();

  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [file, setFile] = useState(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = React.useState(false);
  const { generateCustomRoadmap } = useStore();

  const { data: globalTopics = [], isLoading: isTopicsLoading } = useQuery({
    queryKey: ["hub_topics"],
    queryFn: fetchHubTopics,
  });

  const getRoadmapCounts = () => {
    const counts = {};
    learningPaths.forEach((path) => {
      counts[path.id] = path.nodes.length;
    });
    return counts;
  };

  const roadmapCounts = getRoadmapCounts();

  const handleCreateCustom = async () => {
    if (!customTopic.trim() && !file) return;

    // Limit Check before calling store (UX optimization)
    if (!isPremium && usageStats.roadmapsGenerated >= 3) {
      setIsPremiumModalOpen(true);
      return;
    }

    setIsGeneratingCustom(true);
    const id = await generateCustomRoadmap(customTopic, file);
    if (id) navigate(`/roadmap/${id}`);
    setIsGeneratingCustom(false);
    setCustomTopic("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      alert("Please upload a PDF for roadmap generation.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] w-full mt-6 px-4 md:px-8 pb-32 relative mx-auto"
    >
      <SEO
        title="Find a Knowledge Path"
        description="Pick what you want to learn and start your journey today with AI-powered roadmaps."
      />

      {/* Subdued Background Overlays */}
      <div className="absolute top-[5%] -left-32 opacity-[0.02] pointer-events-none">
        {/* Coolshape removed */}
      </div>

      <div className="flex flex-col items-center text-center py-12 md:py-20 relative overflow-hidden rounded-[48px] bg-white/[0.01] border border-white/5 mb-16 md:mb-20">
        {/* Simplified Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <ShaderGradient />
          </motion.div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,#050505_95%)]" />

          {/* Spatial Depth Element - Very Subdued */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01]">
            <WireframeAtom size={500} speed={0.05} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl relative z-10 px-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-[8px] font-black uppercase tracking-[0.3em] mb-10">
            <Sparkles size={10} className="text-indigo-400" />
            Learning Hub
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-white uppercase italic">
            What do you want <br />
            <span className="text-gradient">to learn?</span>
          </h1>

          <p className="text-white/80 text-base md:text-xl font-medium mb-16 max-w-xl mx-auto leading-relaxed tracking-tight">
            Choose a popular path below or create your own custom journey in
            seconds.
          </p>

          {/* Optimized Forge Console (Step 1) */}
          <div className="relative max-w-2xl mx-auto mb-16 z-20">
            <div className="absolute -top-8 left-8 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-80 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Step 1: Create Custom
            </div>

            {/* Repositioned Accents - Removed HandyArrow usage */}

            <div className="glass-panel p-2 rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-2 items-stretch transition-all hover:border-white/20 relative z-30">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={
                    file
                      ? `File Loaded: ${file.name}`
                      : "e.g. 'Intro to Psychology' or 'Python Basics'..."
                  }
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full h-full min-h-[64px] px-8 py-4 rounded-[32px] bg-transparent text-white font-bold placeholder:text-white/70 focus:outline-none text-base md:text-lg selection:bg-indigo-500"
                />
              </div>

              <div className="flex flex-row gap-2 relative z-40 p-1">
                <label className="cursor-pointer group/upload">
                  <div
                    className={`h-full px-8 rounded-[28px] border border-white/5 bg-white/5 flex items-center justify-center gap-3 transition-all hover:bg-white/10 ${file ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "text-white/70"}`}
                  >
                    <LucideIcons.FileUp size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                      {file ? "OK" : "PDF"}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>

                <motion.button
                  onClick={handleCreateCustom}
                  disabled={
                    (!customTopic.trim() && !file) || isGeneratingCustom
                  }
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#6366f1",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 rounded-[28px] bg-white text-black font-black uppercase tracking-[0.15em] transition-all text-xs disabled:opacity-40 disabled:scale-95 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/40 relative z-50 min-w-[170px]"
                >
                  {isGeneratingCustom ? "Thinking..." : "Start Journey"}
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 relative z-20 mt-8">
            <motion.button
              onClick={() => navigate("/generator")}
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 rounded-[32px] border border-white/10 text-white/90 font-black uppercase tracking-[0.3em] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-[10px] backdrop-blur-md relative z-30 shadow-xl"
            >
              Quick Quiz Mode{" "}
              <LucideIcons.Zap size={16} className="text-amber-400" />
            </motion.button>

            {!isPremium && (
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 flex items-center gap-2 px-6 py-2 rounded-full bg-white/[0.02] border border-white/5">
                <LucideIcons.Activity
                  size={14}
                  className="text-indigo-400 animate-pulse"
                />
                Active Pathways: {usageStats.roadmapsGenerated}/3
              </div>
            )}

            <div className="flex items-center gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity">
              <div className="text-[9px] font-black uppercase tracking-[0.5em]">
                Gemini AI Engine
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
              <div className="text-[9px] font-black uppercase tracking-[0.5em]">
                v4.2 PRO
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-20 relative">
        <div className="absolute -top-10 left-4 text-[8px] font-black uppercase tracking-[0.3em] text-white/70">
          Step 2: Pick a popular topic
        </div>
        {customRoadmaps.length > 0 && (
          <CategorySection
            title="My Pathways"
            featured={true}
            roadmapCounts={roadmapCounts}
            items={customRoadmaps.map((r) => ({
              id: r.id,
              title: r.title,
              icon: "Sparkles",
              color: "bg-indigo-500/10",
            }))}
            onSelect={(topic) => navigate(`/roadmap/${topic.id}`)}
          />
        )}

        {globalTopics.length > 0 && (
          <CategorySection
            title="Discovery"
            featured={true}
            roadmapCounts={roadmapCounts}
            items={globalTopics.map((t) => ({
              id: t.id,
              title: t.title,
              icon: t.icon || "Sparkles",
              color: t.color || "bg-indigo-500/10",
            }))}
            onSelect={(topic) => navigate(`/roadmap/${topic.id}`)}
          />
        )}

        <CategorySection
          title="Battle Roles"
          roadmapCounts={roadmapCounts}
          items={TOPIC_CATEGORIES.ROLES}
          onSelect={(topic) => navigate(`/roadmap/${topic.id}`)}
        />

        <CategorySection
          title="Core Skills"
          roadmapCounts={roadmapCounts}
          items={TOPIC_CATEGORIES.SKILLS}
          onSelect={(topic) => navigate(`/roadmap/${topic.id}`)}
        />

        <CategorySection
          title="Mastery Secrets"
          roadmapCounts={roadmapCounts}
          items={TOPIC_CATEGORIES.BEST_PRACTICES}
          onSelect={(topic) => navigate(`/roadmap/${topic.id}`)}
        />
      </div>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </motion.div>
  );
};

export default Discovery;
