import React, { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
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

/** StatCounter — counts up from 0 to `target` when scrolled into view.
 * Uses the Intersection Observer API (Web API). */
function StatCounter({ target, suffix = "", prefix = "", label }) {
  const [count, setCount] = React.useState(0);
  const ref = useIntersectionObserver(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
  });
  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-2xl md:text-4xl font-black text-white font-outfit tracking-tighter">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
        {label}
      </span>
    </div>
  );
}

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
    className="group relative glass-panel p-6 md:p-8 rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center text-center space-y-6"
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
      <p className="text-white text-base font-medium leading-relaxed font-outfit">
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
          <Plus size={20} className="text-white" />
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

  const sectionClasses =
    "relative flex flex-col justify-center px-4 md:px-12 py-16 md:py-24 w-full overflow-hidden";

  return (
    <>
      <ShaderGradient />
      <SEO
        title="Ace Your Exams Faster"
        description="Turn your notes into custom AI quizzes in seconds."
      />

      <div className="bg-[#050505] min-h-screen">
        {/* ── SECTION 1: HERO ── */}
        <div className={`${sectionClasses} pt-16 md:pt-20`}>
          <NeuralFabric />
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden contain-layout">
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] right-[10%] w-32 h-32 md:w-64 md:h-64 bg-indigo-500/10 blur-[80px] md:blur-[120px] rounded-full transform-gpu will-change-transform"
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
              className="absolute bottom-[10%] left-[5%] w-48 h-48 md:w-80 md:h-80 bg-[#DFFF00]/5 blur-[100px] md:blur-[150px] rounded-full transform-gpu will-change-transform"
            />
          </div>
          <BeamGrid />

          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10 scale-[0.85] md:scale-95 transform-gpu origin-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
              className="flex-1 text-center lg:text-left mt-10 md:mt-0"
            >
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFFF00]/5 border border-[#DFFF00]/10 text-[#DFFF00] text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8 font-syne hover:bg-[#DFFF00]/10 transition-colors cursor-pointer group"
              >
                <Sparkles
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
                Smart tools for students
              </motion.div>

              <motion.h1
                variants={{
                  initial: { opacity: 0, scale: 0.9, y: 30 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                }}
                className="text-[clamp(2.5rem,8vw,6rem)] font-black mb-4 md:mb-6 tracking-tighter leading-[0.85] text-white font-outfit uppercase italic"
              >
                LEARN <br />
                <FlipWords
                  words={["FASTER", "BETTER", "EASIER", "SMARTER"]}
                  className="text-[#DFFF00] not-italic"
                />
              </motion.h1>

              <motion.p
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="text-white/90 text-base md:text-lg font-medium mb-8 md:mb-10 leading-relaxed max-w-2xl font-outfit"
              >
                The smart study tool that helps you learn. Turn your notes into
                fun quizzes and remember everything you read.
              </motion.p>

              <motion.div
                variants={{
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(user ? "/generator" : "/auth")}
                  className="px-10 md:px-16 py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-[#DFFF00] transition-all shadow-3xl flex items-center justify-center gap-4 font-syne text-[10px] relative overflow-hidden group"
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
                    className="px-10 md:px-16 py-5 rounded-3xl border border-white/10 text-white/80 font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:border-[#DFFF00]/30 hover:text-white transition-all font-syne text-[10px]"
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

          {/* Social proof at bottom of hero */}
          <div className="absolute bottom-0 inset-x-0 py-5 border-t border-white/5 bg-white/[0.01]">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 px-6">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 font-syne hidden sm:block">
                TRUSTED WORLDWIDE
              </span>
              <StatCounter target={10000} suffix="+" label="Students" />
              <StatCounter target={500000} suffix="+" label="Questions" />
              <StatCounter target={94} suffix="%" label="Pass Rate" />
            </div>
          </div>
        </div>

        {/* ── SLIDE 2: SECRET WEAPON ── */}
        <div className={sectionClasses}>
          <div className="max-w-5xl mx-auto w-full scale-[0.80] md:scale-85 transform-gpu origin-center mt-4">
            <div className="text-center mb-6 md:mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3 md:mb-5 font-syne"
              >
                The AI Advantage
              </motion.div>
              <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-black tracking-tighter leading-[0.9] text-white font-syne uppercase italic">
                YOUR <br />
                <span className="text-indigo-400 not-italic">
                  SECRET WEAPON.
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* ── SLIDE 3: THE PROBLEM ── */}
        <div className={sectionClasses}>
          <div className="max-w-5xl mx-auto w-full scale-[0.80] md:scale-95 transform-gpu origin-center top-6 relative">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 mb-3 md:mb-5">
                <AlertCircle size={18} className="md:w-5 md:h-5" />
              </div>
              <h2 className="text-[clamp(1.5rem,5vw,3.5rem)] font-black mb-2 md:mb-4 tracking-tighter leading-[0.9] text-white font-syne uppercase">
                WHY STUDYING <br />
                <span className="text-red-500 italic">IS SO HARD.</span>
              </h2>
              <p className="text-white/90 text-xs md:text-base font-medium font-outfit max-w-2xl mx-auto px-4 md:px-0 hidden md:block">
                Just reading your notes over and over doesn't work. Most people
                forget <span className="text-white">almost everything</span> the
                very next day. You need a better way to remember.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden contain-paint">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full transform-gpu will-change-transform" />
                <CheckCircle className="text-[#DFFF00] mb-4" size={24} />
                <h3 className="text-xl font-black text-white mb-3 uppercase font-syne">
                  Learn By Doing
                </h3>
                <p className="text-white/80 text-sm mb-5 font-outfit">
                  QuizMaster makes you answer questions, which is the fastest
                  way to make information stick in your head forever.
                </p>
                <div className="space-y-3">
                  {[
                    "Stop forgetting what you just read.",
                    "See exactly what you still need to learn.",
                    "Learn your material in half the time.",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-2 h-2 rounded-full bg-[#DFFF00] shrink-0" />
                      <span className="text-white font-black uppercase tracking-widest text-[10px] font-syne">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="relative glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden w-full max-w-[380px]">
                  <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/30" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                      <div className="w-3 h-3 rounded-full bg-green-500/30" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/50">
                      PRACTICE_QUIZ
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-xs font-black text-[#DFFF00] uppercase tracking-widest">
                      Question #12
                    </div>
                    <h4 className="text-base font-black text-white leading-tight font-syne uppercase">
                      How does "Active Recall" strengthen long-term memory?
                    </h4>
                    <div className="space-y-2">
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
                          className={`p-3 rounded-xl border flex items-center justify-between ${opt.correct ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/5"}`}
                        >
                          <span
                            className={`text-xs font-medium ${opt.correct ? "text-green-400" : "text-white/70"}`}
                          >
                            {opt.text}
                          </span>
                          {opt.correct && (
                            <CheckCircle
                              size={14}
                              className="text-green-400 shrink-0"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SLIDE 4: SMART AI ── */}
        <div
          className={`${sectionClasses} bg-white/[0.02] border-y border-white/5`}
        >
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center scale-[0.85] md:scale-95 transform-gpu origin-center">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
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
              ].map((f, i) => (
                <div
                  key={i}
                  className="aspect-square glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-3 relative overflow-hidden group p-5"
                >
                  <f.icon
                    className={`text-${f.color}-400 group-hover:scale-110 transition-all`}
                    size={28}
                  />
                  <div className="text-center">
                    <span className="block text-[9px] font-black text-white uppercase tracking-[0.1em] group-hover:text-[#DFFF00] transition-colors">
                      {f.title}
                    </span>
                    <span className="block text-[8px] text-white/50 uppercase tracking-widest">
                      {f.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFFF00] font-syne">
                OUR REALLY SMART AI // VERSION 1.5
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] font-syne">
                SMART <br />
                <span className="text-[#DFFF00] italic">READING.</span>
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed font-outfit max-w-xl">
                Our AI doesn't just copy words — it actually understands what
                it's reading. It finds the most important parts of your notes
                and turns them into questions that help you learn.
              </p>
              <button
                onClick={() => navigate("/generator")}
                className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-[#DFFF00] transition-colors group"
              >
                START THE MAGIC{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── SLIDE 5: HOW IT WORKS ── */}
        <div className={sectionClasses}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DFFF00]/5 blur-[60px] md:blur-[150px] rounded-full pointer-events-none transform-gpu will-change-transform" />
          <div className="max-w-5xl mx-auto w-full relative z-10 scale-[0.80] md:scale-90 transform-gpu origin-center top-4 md:top-0">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-2xl md:text-5xl font-black tracking-tighter mb-1 md:mb-2 uppercase font-syne text-white">
                REALLY <br />
                <span className="text-[#DFFF00] italic">SIMPLE.</span>
              </h2>
              <p className="text-white/80 text-xs md:text-sm font-medium max-w-xl mx-auto font-outfit hidden md:block">
                Three easy steps to master any subject.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="glass-panel p-6 rounded-3xl border border-white/10 group flex flex-col items-center text-center space-y-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#DFFF00]/10 group-hover:border-[#DFFF00]/30 transition-all">
                    <s.icon
                      size={22}
                      className="text-white group-hover:text-[#DFFF00] transition-colors"
                    />
                  </div>
                  <div>
                    <div className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase mb-1">
                      {s.label}
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 uppercase font-syne">
                      {s.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed font-outfit">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SLIDE 6: STUDY PLANS ── */}
        <div className={sectionClasses}>
          <div className="max-w-7xl mx-auto w-full scale-[0.80] md:scale-85 transform-gpu origin-center">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-syne">
                <Sparkles size={10} /> STAY ON TRACK
              </div>
              <h2 className="text-2xl md:text-5xl font-black mb-3 uppercase tracking-tighter leading-none font-syne text-white">
                FOLLOW A <br />
                <span className="text-[#DFFF00] italic">STUDY PLAN.</span>
              </h2>
            </div>
            <RoadmapVisual />
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/hub")}
                className="px-10 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#DFFF00] transition-all flex items-center gap-3 group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                FIND YOUR PLAN{" "}
                <ArrowRight
                  className="group-hover:translate-x-2 transition-transform"
                  size={14}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── SLIDE 7: BENTO FEATURES ── */}
        <div className={sectionClasses}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DFFF00]/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none transform-gpu will-change-transform" />
          <div className="max-w-7xl mx-auto w-full relative z-10 scale-[0.75] md:scale-90 transform-gpu origin-center md:origin-center mt-8 md:mt-0 mb-auto md:mb-0">
            <div className="mb-4 md:mb-6 text-center md:text-left">
              <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-black mb-2 md:mb-3 uppercase tracking-tighter leading-none font-syne text-white">
                STUDY SMARTER <br />
                <span className="text-[#DFFF00] italic">NOT HARDER.</span>
              </h2>
              <p className="text-white/80 text-xs md:text-base font-medium font-outfit hidden md:block">
                Simple tools for smart students. Get better grades without
                working longer hours.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {[
                {
                  title: "READS HANDWRITING",
                  desc: "Take a picture of your messy notes. We can read them easily.",
                  icon: FileText,
                  className: "md:col-span-8",
                  proof: (
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-white/5 to-transparent flex items-center justify-center p-6 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
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
                  className: "md:col-span-4",
                },
                {
                  title: "BREAKS IT DOWN",
                  desc: "Our AI takes really complicated topics and makes them easy to understand.",
                  icon: BrainCircuit,
                  className: "md:col-span-4",
                },
                {
                  title: "TRACKS PROGRESS",
                  desc: "See exactly what you still need to study before your test.",
                  icon: BarChart3,
                  className: "md:col-span-8",
                  proof: (
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-center p-6 pointer-events-none">
                      <div className="flex gap-2 items-end h-24">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: "40%" }}
                          transition={{ delay: 0, duration: 1 }}
                          className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: "70%" }}
                          transition={{ delay: 0.1, duration: 1 }}
                          className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: "45%" }}
                          transition={{ delay: 0.2, duration: 1 }}
                          className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: "90%" }}
                          transition={{ delay: 0.3, duration: 1 }}
                          className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: "65%" }}
                          transition={{ delay: 0.4, duration: 1 }}
                          className="w-4 bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-colors"
                        />
                      </div>
                    </div>
                  ),
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className={`glass-panel p-6 rounded-3xl border border-white/10 group relative overflow-hidden transition-all duration-500 min-h-[180px] md:min-h-[220px] flex flex-col justify-between ${feature.className}`}
                >
                  <div className="relative z-10 max-w-[60%]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                      <feature.icon
                        className="text-white group-hover:text-indigo-400 transition-colors"
                        size={18}
                      />
                    </div>
                    <h3 className="text-base md:text-lg font-black mb-1.5 uppercase tracking-tighter font-syne text-white group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-xs font-medium leading-relaxed font-outfit">
                      {feature.desc}
                    </p>
                  </div>
                  {feature.proof}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SLIDE 8: OLD VS NEW ── */}
        <div className={sectionClasses}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[60px] md:blur-[150px] rounded-full pointer-events-none transform-gpu will-change-transform" />
          <div className="max-w-4xl mx-auto w-full relative z-10 scale-[0.80] md:scale-85 transform-gpu origin-center">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-[clamp(1.8rem,5vw,4rem)] font-black tracking-tighter mb-2 md:mb-4 uppercase font-syne text-white leading-none italic">
                OLD WAY VS <br />
                <span className="text-indigo-400 not-italic">NEW WAY.</span>
              </h2>
              <p className="text-white text-xs md:text-base font-medium max-w-2xl mx-auto font-outfit px-4 md:px-0 hidden md:block">
                Stop reading the same page four times. Start mastering your
                subjects with interactive AI loops.
              </p>
            </div>
            <div className="p-1 rounded-[30px] md:rounded-[40px] glass-panel border border-white/10 shadow-3xl overflow-hidden">
              <div className="grid grid-cols-2 bg-white/5 border-b border-white/10">
                <div className="p-6 md:p-10 text-center border-r border-white/10 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <FileText size={20} />
                  </div>
                  <div className="font-black uppercase tracking-[0.3em] text-[10px] text-white font-syne">
                    JUST READING
                  </div>
                </div>
                <div className="p-6 md:p-10 text-center flex flex-col items-center gap-3 bg-indigo-500/5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
                    <Zap size={20} />
                  </div>
                  <div className="font-black uppercase tracking-[0.3em] text-[10px] text-indigo-400 font-syne">
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
                    className="grid grid-cols-2 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="p-5 md:p-8 text-center border-r border-white/5 text-white text-sm font-medium font-outfit">
                      {row[0]}
                    </div>
                    <div className="p-5 md:p-8 text-center text-white font-black uppercase italic tracking-tight text-sm font-outfit">
                      {row[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SLIDE 9: FAQ + CTA ── */}
        <div className={`${sectionClasses} bg-black`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start scale-[0.80] md:scale-90 transform-gpu origin-top md:origin-center mt-12 md:mt-0">
            {/* FAQ */}
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 uppercase font-syne">
                Common Questions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    q: "Is the AI actually accurate?",
                    a: "We use Gemini 1.5 Pro, one of the most advanced reasoning models in existence. It generates questions that aren't just factual, but conceptual.",
                  },
                  {
                    q: "Can I upload hand-written notes?",
                    a: "Yes! Our OCR engine is specifically trained to handle messy student handwriting, diagrams, and annotated textbook pages.",
                  },
                  {
                    q: "Is there a limit on quiz generation?",
                    a: "Free accounts can generate up to 5 comprehensive quizzes per week. Pro accounts have unlimited quiz generation.",
                  },
                  {
                    q: "Does it work for math and science?",
                    a: "Absolutely. We support LaTeX formatting for complex equations and can parse technical diagrams from your photos.",
                  },
                ].map(({ q, a }) => (
                  <FAQItem key={q} question={q} answer={a} />
                ))}
              </div>
            </div>
            {/* CTA */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent text-center relative overflow-hidden flex flex-col justify-center gap-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,255,0,0.03),transparent)] animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight font-syne relative z-10">
                READY TO GET <br />
                <span className="text-[#DFFF00] italic">BETTER GRADES?</span>
              </h2>
              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => navigate(user ? "/generator" : "/auth")}
                  className="w-full px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-[#DFFF00] transition-all font-syne text-xs"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/features")}
                  className="w-full px-8 py-4 rounded-2xl border border-white/10 text-white/80 font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all font-syne text-xs"
                >
                  View Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
