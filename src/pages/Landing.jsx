import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  Layout,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  Zap,
  ArrowRight,
  ArrowDown,
  Globe,
  ShieldCheck,
  X,
  Rocket,
  Activity,
  CheckCircle,
  BarChart3,
  Sparkles,
  Target,
  BrainCircuit,
  MousePointerClick,
  Search,
  Check,
} from "lucide-react";
import NeuralLogo from "../components/NeuralLogo";
import FlipWords from "../components/FlipWords";
import BeamGrid from "../components/BeamGrid";
import NeuralAtoms from "../components/NeuralAtoms";
import NeuralFabric from "../components/NeuralFabric";
import RoadmapVisual from "../components/RoadmapVisual";
import WireframeAtom from "../components/WireframeAtom";
import { useStore } from "../store/useStore";
import SEO from "../components/SEO";
import ShaderGradient from "../components/ShaderGradient";

const FloatingHeroAsset = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[500px] aspect-square flex items-center justify-center group perspective-1000"
    >
      <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000 scale-150" />
      <div
        style={{ translateZ: 100 }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {children}
      </div>
    </motion.div>
  );
};

const SuperpowerCard = ({
  icon: Icon,
  image,
  title,
  desc,
  tag,
  color,
  delay = 0,
  illustrationType,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -10 }}
    className="group relative glass-panel p-8 md:p-12 rounded-[56px] border border-white/5 overflow-hidden flex flex-col items-center text-center space-y-8"
  >
    <div
      className={`absolute inset-0 bg-${color}-500/5 blur-3xl group-hover:bg-${color}-500/10 transition-all duration-700 opacity-0 group-hover:opacity-100`}
    />

    <div className="relative z-10 w-full aspect-video rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-0 overflow-visible group/img">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.div
          initial={{ x: "-150%" }}
          whileInView={{ x: "150%" }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: delay + 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div
          className={`absolute inset-0 bg-${color}-500/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000`}
        />

        {/* Step 01: Lukasz Adam Minimalist Logic - "The Researcher" */}
        {illustrationType === "lukasz" && (
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Abstract Human Figure (Lukasz Style) */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_20px_40px_rgba(34,211,238,0.2)]"
              >
                <circle
                  cx="100"
                  cy="50"
                  r="25"
                  fill="#22d3ee"
                  className="opacity-80"
                />
                <path
                  d="M100 80 Q100 180 60 180 L140 180 Q100 180 100 80"
                  fill="#22d3ee"
                  className="opacity-60"
                />
                {/* Large Magnifying Glass / Scanner Lens */}
                <motion.g
                  animate={{ rotate: [0, 5, -5, 0], x: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <circle
                    cx="140"
                    cy="110"
                    r="40"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4"
                    className="opacity-90"
                  />
                  <line
                    x1="168"
                    y1="138"
                    x2="190"
                    y2="160"
                    stroke="#22d3ee"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                  <circle
                    cx="140"
                    cy="110"
                    r="30"
                    fill="white"
                    className="opacity-10"
                  />
                </motion.g>
              </svg>

              {/* Dynamic Scanning Rays */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0, 0.4, 0],
                      x: [0, 50],
                      scaleX: [0.5, 1.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                    className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{ rotate: `${(i - 1) * 15}deg` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <div className="w-20 h-2 bg-cyan-500/20 rounded-full" />
              <div className="w-10 h-2 bg-cyan-500/10 rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Step 02: Storytale/Ultima 3D Advanced Core */}
        {illustrationType === "storytale" && (
          <div className="relative w-full h-full flex items-center justify-center scale-110">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full animate-pulse" />
            <WireframeAtom size={220} speed={1.5} scale={1.5} color="#6366f1" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-indigo-500/10 rounded-full"
            />
          </div>
        )}

        {/* Step 03: Things.co Premium Object Assembly */}
        {illustrationType === "things" && (
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            <div className="relative p-12 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.2)] flex items-center justify-center">
              <BarChart3
                size={110}
                className="text-emerald-400 opacity-90 drop-shadow-[0_10px_30px_rgba(16,185,129,0.5)]"
              />
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/40 flex items-center justify-center rotate-12">
                <Check size={24} className="text-black font-black" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>

    <div className="space-y-4 relative z-10">
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[10px] font-bold uppercase tracking-widest`}
      >
        {tag}
      </div>
      <h3 className="text-3xl font-black text-white uppercase font-syne tracking-tight">
        {title}
      </h3>
      <p className="text-white/90 text-base font-medium leading-relaxed font-outfit">
        {desc}
      </p>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
          {question}
        </span>
        <div
          className={`p-2 rounded-lg bg-white/5 transition-transform ${isOpen ? "rotate-45" : ""}`}
        >
          <Plus size={20} className="text-white/90" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-white/90 leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  // Mesh displacement decay removed - handled by BeamGrid

  return (
    <div className="w-full bg-[#050505] overflow-hidden">
      <ShaderGradient />
      <SEO
        title="Ace Your Exams Faster"
        description="Turn your notes into custom AI quizzes in seconds. The simplest way to prepare for any test."
      />

      <div
        className="w-full max-w-7xl mx-auto px-4 md:px-6 overflow-hidden relative"
        style={{ pointerEvents: "auto" }}
      >
        <NeuralFabric />

        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] pointer-events-none -z-10 opacity-60">
          <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[30%] w-[700px] h-[700px] bg-[#DFFF00]/5 rounded-full blur-[150px]" />
        </div>

        <BeamGrid />

        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 md:pt-40 pb-20 md:pb-32 px-4 md:px-12 overflow-visible">
          {/* Ambient Background Shards */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] right-[10%] w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"
            />
            <motion.div
              animate={{
                y: [0, 40, 0],
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className={`absolute bottom-[10%] left-[5%] w-48 h-48 bg-[#DFFF00]/5 blur-3xl rounded-full`}
            />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: 0.15 } },
              }}
              className="flex-1 text-center lg:text-left relative z-10"
            >
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFFF00]/5 border border-[#DFFF00]/10 text-[#DFFF00] text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-10 md:mb-16 font-syne shadow-2xl hover:bg-[#DFFF00]/10 transition-colors cursor-pointer group"
              >
                <Sparkles
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
                Smart tools for students
              </motion.div>

              <div className="mb-6 md:mb-10">
                <motion.h1
                  variants={{
                    initial: { opacity: 0, scale: 0.9, y: 30 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                  }}
                  className="text-[clamp(2.5rem,8vw,6rem)] font-black mb-6 md:mb-10 tracking-tighter leading-[0.85] text-white font-outfit uppercase italic"
                >
                  LEARN <br />
                  <FlipWords
                    words={["FASTER", "BETTER", "EASIER", "SMARTER"]}
                    className="text-[#DFFF00] not-italic"
                  />
                </motion.h1>
              </div>

              <motion.p
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="text-white/90 text-lg md:text-2xl font-medium mb-12 md:mb-16 leading-relaxed max-w-2xl font-outfit"
              >
                The smart study tool that helps you learn. Turn your notes into
                fun quizzes and remember everything you read.
              </motion.p>

              <motion.div
                variants={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                }}
                className="flex flex-col sm:flex-row gap-6 md:gap-8 mb-24 md:mb-32"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(user ? "/generator" : "/auth")}
                  className="px-10 md:px-16 py-5 md:py-6 rounded-3xl bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-[#DFFF00] transition-all shadow-3xl shadow-[#DFFF00]/20 flex items-center justify-center gap-4 font-syne text-[10px] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  Start Studying{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>
                {!user && (
                  <button
                    onClick={() => navigate("/auth")}
                    className="px-10 md:px-16 py-5 md:py-6 rounded-3xl border border-white/10 text-white/80 font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:border-[#DFFF00]/30 hover:text-white transition-all font-syne text-[10px]"
                  >
                    Login to Account
                  </button>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex-1 flex justify-center relative"
            >
              <FloatingHeroAsset>
                <WireframeAtom scale={1.2} />
                <div className="absolute -top-10 -right-10 p-6 rounded-3xl glass-panel border border-white/10 shadow-3xl flex items-center gap-4 animate-bounce">
                  <div className="p-3 rounded-2xl bg-[#DFFF00]/10 border border-[#DFFF00]/20">
                    <BrainCircuit size={24} className="text-[#DFFF00]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/90 uppercase tracking-widest">
                      Your Personal
                    </div>
                    <div className="text-sm font-black text-white uppercase font-syne italic">
                      AI Tutor
                    </div>
                  </div>
                </div>
              </FloatingHeroAsset>
            </motion.div>
          </div>
        </section>

        {/* --- SOCIAL PROOF BAR (TRUST) --- */}
        <section className="py-12 md:py-20 border-y border-white/5 bg-white/[0.01] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
          <div className="flex flex-col items-center gap-6 md:gap-10 px-4 md:px-6 relative">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-white/80 text-center font-syne">
              TRUSTED BY STUDENTS WORLDWIDE
            </span>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 lg:gap-32 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              {[
                { icon: Globe, label: "GlobalStack", color: "indigo" },
                { icon: ShieldCheck, label: "SecureCore", color: "emerald" },
                { icon: Monitor, label: "DevLayer", color: "indigo" },
                { icon: Layout, label: "UXMatrix", color: "emerald" },
              ].map((logo, i) => (
                <div
                  key={logo.label}
                  className="flex items-center gap-3 md:gap-4 group cursor-default"
                >
                  <logo.icon
                    size={20}
                    className={`text-${logo.color}-400 group-hover:scale-110 transition-transform`}
                  />
                  <span className="font-syne text-sm md:text-lg font-black uppercase tracking-tighter text-white">
                    {logo.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE SUPERPOWERS: 3D SHOWCASE --- */}
        <section className="py-24 md:py-48 px-4 md:px-12 relative">
          <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 font-syne"
            >
              The AI Advantage
            </motion.div>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black mb-8 tracking-tighter leading-[0.9] text-white font-syne uppercase italic">
              YOUR <br />
              <span className="text-indigo-400 not-italic">SECRET WEAPON.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <SuperpowerCard
              tag="Step 01"
              color="cyan"
              icon={Search}
              title="Upload Notes"
              desc="Take pictures of your notes or upload PDFs. We can read even messy handwriting."
              delay={0.1}
              illustrationType="lukasz"
            />
            <SuperpowerCard
              tag="Step 02"
              color="indigo"
              icon={BrainCircuit}
              title="Auto Quizzes"
              desc="We automatically create practice tests based on exactly what you need to learn."
              delay={0.2}
              illustrationType="storytale"
            />
            <SuperpowerCard
              tag="Step 03"
              color="emerald"
              icon={BarChart3}
              title="Track Progress"
              desc="See how much you remember. Reach 100% and ace your test."
              delay={0.3}
              illustrationType="things"
            />
          </div>
        </section>

        {/* --- THE PROBLEM --- */}
        <section id="problem" className="py-24 md:py-48 px-6 md:px-12 relative">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <div className="inline-block p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-8">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-[clamp(1.5rem,6vw,4.5rem)] font-black mb-8 md:mb-12 tracking-tighter leading-[0.9] text-white font-syne uppercase">
              WHY STUDYING <br />
              <span className="text-red-500 italic">IS SO HARD.</span>
            </h2>
            <p className="text-white/90 text-lg md:text-2xl leading-relaxed font-medium font-outfit">
              Just reading your notes over and over doesn't work. Most people
              forget
              <span className="text-white"> almost everything </span>
              the very next day. You need a better way to remember.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
              <CheckCircle className="text-[#DFFF00] mb-6" size={32} />
              <h3 className="text-3xl font-black text-white mb-6 uppercase font-syne">
                Learn By Doing
              </h3>
              <p className="text-white/90 text-lg mb-10 font-outfit">
                QuizMaster makes you answer questions, which is the fastest way
                to make information stick in your head forever.
              </p>
              <div className="space-y-4">
                {[
                  "Stop forgetting what you just read.",
                  "See exactly what you still need to learn.",
                  "Learn your material in half the time.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#DFFF00]" />
                    <span className="text-white font-black uppercase tracking-widest text-xs font-syne">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[450px] md:h-full lg:min-h-[600px] flex items-center justify-center">
              <BeamGrid />

              {/* --- LIVE QUIZ MOCKUP --- */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 w-full max-w-[400px]"
              >
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />

                <div className="relative glass-panel rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      PRACTICE_QUIZ
                    </div>
                  </div>

                  {/* Question Area */}
                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="text-xs font-black text-[#DFFF00] uppercase tracking-widest">
                        Question #12
                      </div>
                      <h4 className="text-xl font-black text-white leading-tight font-syne uppercase">
                        How does "Active Recall" strengthen long-term memory?
                      </h4>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {[
                        {
                          text: "By repeating information out loud",
                          correct: false,
                        },
                        {
                          text: "By forcing the brain to retrieve data",
                          correct: true,
                        },
                        {
                          text: "By highlighting important text",
                          correct: false,
                        },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                            opt.correct
                              ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20"
                              : "bg-white/5 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${opt.correct ? "text-green-400" : "text-white/90"}`}
                          >
                            {opt.text}
                          </span>
                          {opt.correct && (
                            <CheckCircle size={16} className="text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Feedback */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-2xl bg-[#DFFF00]/10 border border-[#DFFF00]/20 flex items-start gap-4"
                    >
                      <Sparkles
                        size={18}
                        className="text-[#DFFF00] shrink-0 mt-1"
                      />
                      <p className="text-xs text-[#DFFF00]/80 font-medium leading-relaxed italic">
                        Correct! Retrieval practice builds stronger neural
                        pathways than passive revision.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 p-4 rounded-2xl glass-panel border border-white/10 shadow-xl"
                >
                  <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">
                    +92% RETENTION
                  </div>
                  <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-green-400" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- THE LOGIC (NEURAL SYNTHESIS) --- */}
        <section className="py-24 md:py-48 px-6 md:px-12 bg-white/[0.02] border-y border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Context Analysis",
                    icon: BrainCircuit,
                    color: "indigo",
                    desc: "Maps text meaning",
                  },
                  {
                    title: "Auto-Questioning",
                    icon: MousePointerClick,
                    color: "emerald",
                    desc: "Q&A Generation",
                  },
                  {
                    title: "Handwriting Scan",
                    icon: FileText,
                    color: "indigo",
                    desc: "Messy Note OCR",
                  },
                  {
                    title: "Retention Track",
                    icon: BarChart3,
                    color: "emerald",
                    desc: "Mastery Analytics",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="aspect-square glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-3 relative overflow-hidden group p-6"
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors" />
                    <feature.icon
                      className={`text-${feature.color}-400 group-hover:scale-110 transition-all mb-2`}
                      size={32}
                    />
                    <div className="text-center space-y-1">
                      <span className="block text-[10px] font-black text-white uppercase tracking-[0.1em] group-hover:text-[#DFFF00] transition-colors">
                        {feature.title}
                      </span>
                      <span className="block text-[8px] font-medium text-white/70 uppercase tracking-widest">
                        {feature.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8 md:space-y-12">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#DFFF00] font-syne">
                OUR REALLY SMART AI // VERSION 1.5
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] font-syne">
                SMART <br />
                <span className="text-[#DFFF00] italic">READING.</span>
              </h2>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed font-outfit max-w-xl">
                Our AI doesn't just copy words—it actually understands what it's
                reading. It finds the most important parts of your notes and
                turns them into questions that help you learn.
              </p>
              <button
                onClick={() => navigate("/generator")}
                className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-[#DFFF00] transition-colors group"
              >
                START THE MAGIC{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>
        </section>

        {/* --- THE METHOD (HOW IT WORKS) --- */}
        <section className="py-24 md:py-48 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DFFF00]/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="text-center mb-16 md:mb-32 relative z-10">
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 md:mb-10 uppercase font-syne text-white">
              REALLY <br />
              <span className="text-[#DFFF00] italic">SIMPLE.</span>
            </h2>
            <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl mx-auto font-outfit">
              Three easy steps to master any subject. We do all the hard work so
              you can just learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {[
              {
                title: "UPLOAD",
                label: "STEP 01",
                desc: "Send us your notes, PDFs, or photos. We can even read messy handwriting!",
                icon: Rocket,
              },
              {
                title: "PROCESS",
                label: "STEP 02",
                desc: "Our smart AI reads everything and creates perfect practice questions for you.",
                icon: Activity,
              },
              {
                title: "LEARN",
                label: "STEP 03",
                desc: "Answer the questions. If you get stuck, we'll explain it in a way that makes sense.",
                icon: CheckCircle,
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 group flex flex-col items-center text-center space-y-8 hover:bg-white/5 transition-colors"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#DFFF00]/10 group-hover:border-[#DFFF00]/30 transition-all">
                  <s.icon
                    size={32}
                    className="text-white group-hover:text-[#DFFF00] transition-colors"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-[0.4em] text-white/70 uppercase mb-4">
                    {s.label}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 uppercase font-syne">
                    {s.title}
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed font-medium font-outfit">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- THE PLANS (ROADMAP PITCH) --- */}
        <section className="relative py-24 md:py-48 overflow-visible">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 font-syne">
              <Sparkles size={12} />
              STAY ON TRACK
            </div>
            <h2 className="text-4xl md:text-8xl font-black mb-8 md:mb-12 uppercase tracking-tighter leading-none font-syne text-white">
              FOLLOW A <br />
              <span className="text-[#DFFF00] italic">STUDY PLAN.</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl font-medium font-outfit max-w-2xl">
              Don't know what to study next? We've put together simple
              step-by-step plans for almost any subject. Just follow the path to
              learn anything.
            </p>
          </div>

          <RoadmapVisual />

          <div className="flex justify-center mt-20">
            <button
              onClick={() => navigate("/hub")}
              className="px-12 py-6 rounded-[24px] bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#DFFF00] transition-all flex items-center gap-4 group shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              FIND YOUR PLAN{" "}
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={16}
              />
            </button>
          </div>
        </section>

        {/* --- BENTO MASONRY FEATURES --- */}
        <section className="py-24 md:py-48 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DFFF00]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-32">
              <div className="max-w-2xl">
                <h2 className="text-[clamp(1.5rem,5vw,4rem)] font-black mb-8 uppercase tracking-tighter leading-none font-syne text-white">
                  STUDY SMARTER <br />
                  <span className="text-[#DFFF00] italic">NOT HARDER.</span>
                </h2>
                <p className="text-white/90 text-lg md:text-xl font-medium font-outfit">
                  Simple tools for smart students. Get better grades without
                  working longer hours.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {[
                {
                  title: "READS HANDWRITING",
                  desc: "Take a picture of your messy notes. We can read them easily.",
                  icon: FileText,
                  className: "md:col-span-8 md:row-span-1",
                  proof: (
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-white/5 to-transparent flex items-center justify-center p-8 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-full h-full border border-white/5 rounded-2xl bg-black/40 p-4 space-y-3 rotate-3 translate-x-12 group-hover:rotate-0 group-hover:translate-x-0 transition-all duration-700">
                        <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                        <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-[1px] w-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]"
                        />
                        <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  ),
                },
                {
                  title: "UNDERSTANDS IMAGES",
                  desc: "Upload pictures of charts or textbook pages, and we'll ask questions about them.",
                  icon: Layout,
                  className: "md:col-span-4 md:row-span-1",
                },
                {
                  title: "BREAKS IT DOWN",
                  desc: "Our AI takes really complicated topics and makes them easy to understand.",
                  icon: BrainCircuit,
                  className: "md:col-span-4 md:row-span-1",
                },
                {
                  title: "TRACKS PROGRESS",
                  desc: "See exactly what you still need to study before your test.",
                  icon: BarChart3,
                  className: "md:col-span-8 md:row-span-1",
                  proof: (
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-center p-8 pointer-events-none">
                      <div className="flex gap-2 items-end h-32">
                        {[40, 70, 45, 90, 65, 85].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                  ),
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className={`glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 group relative overflow-hidden transition-all duration-500 min-h-[320px] md:min-h-[400px] flex flex-col justify-between ${feature.className}`}
                >
                  <div className="relative z-10 max-w-[60%]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                      <feature.icon
                        className="text-white group-hover:text-indigo-400 transition-colors"
                        size={28}
                      />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter font-syne text-white group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed font-outfit">
                      {feature.desc}
                    </p>
                  </div>
                  {feature.proof}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- COMPARISON: OLD VS NEW --- */}
        <section className="py-24 md:py-48 px-4 md:px-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

          <div className="text-center mb-20 md:mb-32 relative z-10 px-4">
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black tracking-tighter mb-8 uppercase font-syne text-white leading-none italic">
              OLD WAY VS <br />
              <span className="text-indigo-400 not-italic">NEW WAY.</span>
            </h2>
            <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto font-outfit">
              Stop reading the same page four times. Start mastering your
              subjects with interactive AI loops.
            </p>
          </div>

          <div className="max-w-5xl mx-auto p-1 rounded-[50px] glass-panel border border-white/10 relative z-10 shadow-3xl overflow-hidden">
            <div className="grid grid-cols-2 bg-white/5 border-b border-white/10">
              <div className="p-8 md:p-12 text-center border-r border-white/10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                  <FileText size={24} />
                </div>
                <div className="font-black uppercase tracking-[0.3em] text-[10px] md:text-xs text-white/80 font-syne">
                  JUST READING
                </div>
              </div>
              <div className="p-8 md:p-12 text-center flex flex-col items-center gap-4 bg-indigo-500/5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                  <Zap size={24} />
                </div>
                <div className="font-black uppercase tracking-[0.3em] text-[10px] md:text-xs text-indigo-400 font-syne">
                  PRACTICE QUIZZES
                </div>
              </div>
            </div>
            <div className="divide-y divide-white/5 bg-black/20">
              {[
                ["Forgot after 3 days", "Remember it for the test"],
                ["Thinking you know it", "Actually knowing it"],
                ["Boring & exhausting", "Fast & fun practice"],
                ["Hard to track progress", "Clear score tracking"],
              ].map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 group hover:bg-white/[0.02] transition-colors"
                >
                  <div className="p-8 md:p-12 text-center border-r border-white/5 text-white/70 text-sm md:text-xl font-medium font-outfit">
                    {row[0]}
                  </div>
                  <div className="p-8 md:p-12 text-center text-white/80 font-black uppercase italic tracking-tight text-sm md:text-xl font-outfit">
                    {row[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-20 md:py-40 max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 uppercase font-syne">
              Common Questions
            </h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <FAQItem
              question="Is the AI actually accurate?"
              answer="We use Gemini 1.5 Pro, one of the most advanced reasoning models in existence. It generates questions that aren't just factual, but conceptual, ensuring you actually understand the subject."
            />
            <FAQItem
              question="Can I upload my hand-written notes?"
              answer="Yes! Our OCR engine is specifically trained to handle messy student handwriting, diagrams, and annotated textbook pages."
            />
            <FAQItem
              question="Is there a limit on quiz generation?"
              answer="Free accounts can generate up to 5 comprehensive quizzes per week. Pro accounts have unlimited quiz generation."
            />
            <FAQItem
              question="Does it work for math and science?"
              answer="Absolutely. We support LaTeX formatting for complex equations and can parse technical diagrams from your photos."
            />
          </div>
        </section>

        {/* --- FINAL CONVERSION --- */}
        <section className="relative pt-24 md:pt-48 pb-24 md:pb-48 px-6 md:px-12 overflow-hidden bg-black">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="glass-panel p-10 md:p-24 rounded-[64px] md:rounded-[136px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(223,255,0,0.02),transparent)] animate-pulse" />

              <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-tight mb-10 md:mb-16 font-syne">
                READY TO GET <br />
                <span className="text-[#DFFF00] italic">BETTER GRADES?</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
                <button
                  onClick={() => navigate(user ? "/generator" : "/auth")}
                  className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 rounded-3xl md:rounded-[40px] bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-[#DFFF00] transition-all shadow-2xl shadow-white/5 font-syne text-xs relative z-20"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/features")}
                  className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 rounded-3xl md:rounded-[40px] border border-white/10 text-white/90 font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all font-syne text-xs relative z-20"
                >
                  View Features
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
