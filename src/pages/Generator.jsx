import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  ArrowRight,
  Target,
  Check,
  X,
  Zap,
  Shield,
  Clock,
  Plus,
  Compass,
} from "lucide-react";
import { useStore } from "../store/useStore";
import NeuralLoader from "../components/NeuralLoader";
import SEO from "../components/SEO";

const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const { generateAIQuiz, isGenerating } = useStore();
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <NeuralLoader type="synthesis" text="Creating Questions..." />
      </div>
    );
  }

  const handleStart = async () => {
    if (!prompt.trim() && !file) return;
    const success = await generateAIQuiz(prompt, "Intermediate", file);
    if (success) navigate("/quiz");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type === "application/pdf" ||
        selected.type.startsWith("image/"))
    ) {
      setFile(selected);
    } else {
      alert("Please upload a PDF or an Image.");
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-20 px-6">
      <SEO
        title="Create a Quiz"
        description="The fastest way to prepare for your test. Paste a topic or upload your notes."
      />

      {/* Hero Section */}
      <div className="text-center relative mb-16">
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        >
          <Target size={14} className="fill-indigo-500/20" />
          Ready to Study!
        </motion.div>

        <h1 className="text-8xl font-black mb-8 tracking-tighter leading-none text-white uppercase italic">
          What are you <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-emerald-400">
            learning?
          </span>
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Type a topic or upload your notes. We'll create a 25-question practice
          test to check your knowledge in seconds.
        </p>
      </div>

      {/* Generation Hub */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Main Input Field (Action Hub) */}
        <div className="relative group glass-panel rounded-[40px] border border-white/5 hover:border-white/10 transition-all p-3 flex items-center shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-2xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="e.g. Chapter 4 Biology, Calculus exam, 18th Century History..."
            className="flex-1 bg-transparent border-none focus:outline-none px-6 md:px-10 py-6 md:py-8 text-xl font-bold placeholder:text-white/70 font-syne text-white"
          />
          <button
            onClick={handleStart}
            disabled={(!prompt.trim() && !file) || isGenerating}
            className={`relative px-12 md:px-16 py-6 md:py-8 rounded-[30px] font-black uppercase text-xs tracking-[0.4em] transition-all duration-500 flex items-center gap-6 overflow-hidden group/btn shadow-[0_0_50px_rgba(255,255,255,0.05)] ${
              !prompt.trim() && !file
                ? "bg-white/5 text-white/70 cursor-not-allowed border border-white/5"
                : "bg-white text-black hover:bg-[#DFFF00] hover:text-black hover:shadow-[#DFFF00]/30"
            }`}
          >
            <span className="relative z-10">
              {isGenerating ? "..." : "Go!"}
            </span>
            {!isGenerating && (
              <ArrowRight
                size={20}
                className={`relative z-10 transition-transform duration-500 ${
                  !prompt.trim() && !file
                    ? "opacity-20"
                    : "group-hover/btn:translate-x-2"
                }`}
              />
            )}
            {prompt.trim() || file ? (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-[30px]" />
            ) : null}
          </button>
        </div>

        {/* Upload Zone */}
        <label className="block w-full cursor-pointer group">
          <div className="w-full h-24 rounded-[32px] border-2 border-dashed border-white/5 group-hover:border-indigo-500/40 bg-white/[0.02] flex items-center justify-center gap-4 transition-all duration-300">
            {file ? (
              <div className="flex items-center gap-4 text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                <Check size={20} />
                {file.name}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="ml-4 p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-white/90 font-black uppercase text-xs tracking-[0.3em] group-hover:text-indigo-400 transition-colors">
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                Upload Notes (PDF, JPG, PNG)
              </div>
            )}
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </motion.div>

      {/* Technical Footer */}
      <div className="mt-24 pt-10 border-t border-white/5 flex items-center justify-center gap-12 text-xs font-black text-white/90 uppercase tracking-[0.5em] select-none">
        <span className="hover:text-white/80 transition-colors cursor-crosshair">
          Fast AI
        </span>
        <span className="text-indigo-500/20">•</span>
        <span className="hover:text-white/80 transition-colors cursor-crosshair">
          Google's AI
        </span>
        <span className="text-indigo-500/20">•</span>
        <span className="hover:text-white/80 transition-colors cursor-crosshair">
          Ready Now
        </span>
      </div>
    </div>
  );
};

export default Generator;
