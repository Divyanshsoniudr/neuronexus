import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Layout,
  Clock,
  Smartphone,
  Check,
  BrainCircuit,
  MessageSquareQuote,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import SEO from "../components/SEO";
import WireframeAtom from "../components/WireframeAtom";

const BenefitSection = ({
  icon: Icon,
  image,
  title,
  desc,
  tag,
  color,
  status,
  detail,
  list,
  reverse = false,
  illustrationType,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: reverse ? 20 : -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-24 items-center py-24 lg:py-32`}
    >
      <div className="flex-1 space-y-8">
        <motion.div
          variants={itemVariants}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[10px] font-bold uppercase tracking-widest`}
        >
          {tag}
        </motion.div>
        <motion.h3
          variants={itemVariants}
          className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-syne leading-tight"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="text-white/90 text-lg md:text-xl font-medium leading-relaxed max-w-xl"
        >
          {desc}
        </motion.p>
        <motion.ul variants={itemVariants} className="space-y-5 pt-4">
          {list?.map((item, i) => (
            <motion.li
              key={i}
              variants={itemVariants}
              className="flex items-center gap-4 text-white/90 font-medium group/item"
            >
              <div
                className={`p-1.5 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 group-hover/item:bg-${color}-500/30 transition-colors`}
              >
                <Check size={14} />
              </div>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex-[1.5] w-full aspect-square md:aspect-video rounded-[60px] bg-white/[0.02] border border-white/5 flex items-center justify-center p-0 relative group perspective-1000 shadow-2xl overflow-visible"
      >
        {/* Animated Background Glow */}
        <div
          className={`absolute inset-0 bg-${color}-500/5 blur-[120px] rounded-full group-hover:bg-${color}-500/10 transition-all duration-1000 scale-150`}
        />

        {/* Glint Effect - Now Automated on View */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[60px]">
          <motion.div
            initial={{ x: "-150%" }}
            whileInView={{ x: "150%" }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />
        </div>

        {image && !illustrationType && (
          <motion.img
            style={{ translateZ: 100 }}
            src={image}
            alt={title}
            className="w-full h-full object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-700 scale-[1.4] group-hover:scale-[1.6] transition-transform drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
          />
        )}

        {/* Lukasz Adam Style Illustrations */}
        {illustrationType === "lukasz-search" && (
          <motion.div
            style={{ translateZ: 150 }}
            className="relative z-10 w-64 h-64 flex items-center justify-center"
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <circle
                cx="120"
                cy="80"
                r="30"
                fill="#22d3ee"
                className="opacity-80"
              />
              <path
                d="M120 120 Q120 220 80 220 L160 220 Q120 220 120 120"
                fill="#22d3ee"
                className="opacity-60"
              />
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <circle
                  cx="160"
                  cy="140"
                  r="45"
                  stroke="#22d3ee"
                  strokeWidth="4"
                  fill="none"
                />
                <line
                  x1="192"
                  y1="172"
                  x2="220"
                  y2="200"
                  stroke="#22d3ee"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </motion.g>
            </svg>
          </motion.div>
        )}

        {illustrationType === "lukasz-brain" && (
          <motion.div
            style={{ translateZ: 150 }}
            className="relative z-10 w-64 h-64 flex items-center justify-center"
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <path
                d="M120 40 Q180 40 180 100 Q180 160 120 160 Q60 160 60 100 Q60 40 120 40"
                fill="#6366f1"
                className="opacity-80"
              />
              <path
                d="M120 40 L120 160 M60 100 L180 100"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-30"
              />
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={120 + Math.cos(i) * 50}
                  cy={100 + Math.sin(i) * 50}
                  r="6"
                  fill="#fff"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
            </svg>
          </motion.div>
        )}

        {illustrationType === "lukasz-stats" && (
          <motion.div
            style={{ translateZ: 150 }}
            className="relative z-10 w-64 h-64 flex items-center justify-center"
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <rect
                x="40"
                y="140"
                width="30"
                height="60"
                rx="4"
                fill="#10b981"
                className="opacity-40"
              />
              <rect
                x="90"
                y="80"
                width="30"
                height="120"
                rx="4"
                fill="#10b981"
                className="opacity-60"
              />
              <rect
                x="140"
                y="40"
                width="30"
                height="160"
                rx="4"
                fill="#10b981"
                className="opacity-80"
              />
              <motion.path
                d="M40 140 L90 80 L140 40"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        )}

        <motion.div
          style={{
            translateZ: 50,
            display: image || illustrationType ? "none" : "flex",
          }}
          className="relative z-10 p-16 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl items-center justify-center"
        >
          <Icon
            size={140}
            className={`text-${color}-400 opacity-80 group-hover:opacity-100 transition-opacity`}
          />
        </motion.div>

        {/* Dash Metadata Overlays */}
        <motion.div
          style={{ translateZ: 150 }}
          className="absolute inset-x-8 bottom-8 p-8 rounded-3xl bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
        >
          <div className="flex gap-6 items-center">
            <div
              className={`w-14 h-14 rounded-2xl bg-${color}-500/20 flex items-center justify-center relative border border-${color}-400/20`}
            >
              <Icon size={24} className={`text-${color}-400`} />
              <div
                className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-${color}-400 animate-pulse border-4 border-[#0A0A0A]`}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-black text-white uppercase tracking-tight">
                {status}
              </div>
              <div className="text-xs text-white/80 font-bold uppercase tracking-widest">
                {detail}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#050505] min-h-screen font-outfit text-white/90 pb-32">
      <SEO
        title="Features | Study Smarter, Not Harder"
        description="Stop stressing over exams. Our simple tools turn your notes into custom practice tests in seconds."
      />

      {/* --- REFINED HERO: THE BIG PROMISE --- */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} className="text-[#DFFF00]" />
            Simplified Learning
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[0.95] uppercase font-syne max-w-5xl mx-auto">
            Pass Your Tests <br />
            <span className="text-[#DFFF00]">Without the Stress.</span>
          </h1>

          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Old-school studying is broken. We built a smart assistant that
            handles the heavy lifting, so you can focus on mastering your
            material.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/generator")}
              className="px-12 py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#DFFF00] transition-all shadow-2xl shadow-white/5 active:scale-95"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-12 py-6 rounded-3xl bg-white/5 text-white/90 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95"
            >
              Watch Video Guide
            </button>
          </div>
        </div>
      </section>

      {/* --- THE ASSISTANT: BRANDING THE ATOM --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="rounded-[60px] bg-white/[0.02] border border-white/5 p-8 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase font-syne">
                  Meet Your{" "}
                  <span className="text-indigo-400">Smart Helper.</span>
                </h2>
                <p className="text-white/90 text-lg font-medium leading-relaxed">
                  Think of this "Atom" as our brain. While you relax, it’s
                  working inside your notes to build the perfect quiz, find your
                  weak spots, and track your progress.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                <div className="space-y-2">
                  <div className="text-2xl font-black text-white font-syne">
                    100%
                  </div>
                  <div className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                    Accuracy
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-white font-syne">
                    5 SEC
                  </div>
                  <div className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                    Build Time
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center py-10 relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full" />
              <WireframeAtom size={350} speed={0.7} />

              {/* Floating Labels that actually make sense */}
              <div className="absolute top-0 right-10 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md animate-float">
                <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">
                  Reading Notes...
                </span>
              </div>
              <div className="absolute bottom-0 left-10 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md animate-float-slow">
                <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">
                  Building Quiz...
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE FLOW: PROBLEM TO SOLUTION --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-32">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase font-syne tracking-tight">
            How it Saves You Time
          </h2>
          <p className="text-white/80 text-lg font-medium">
            The simplest study flow ever created.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          <BenefitSection
            tag="Step 01"
            icon={Search}
            illustrationType="lukasz-search"
            color="cyan"
            title="Input Your Material"
            desc="Snap a photo of your messy notebook or upload a textbook PDF. We'll read every word and turn it into digital study data instantly."
            status="Reading Files"
            detail="Found: 4 Pages"
            list={[
              "Reads Instantly",
              "Reads Handwriting",
              "Accepts PDFs & Photos",
            ]}
          />
          <BenefitSection
            tag="Step 02"
            reverse
            icon={BrainCircuit}
            illustrationType="lukasz-brain"
            color="indigo"
            title="AI Builds Your Test"
            desc="Our helper finds the most important parts of your notes and creates custom quiz questions to test if you've really learned them."
            status="Thinking..."
            detail="Writing Questions..."
            list={[
              "Understands Topic",
              "Finds Key Ideas",
              "Creates Good Options",
            ]}
          />
          <BenefitSection
            tag="Step 03"
            icon={BarChart3}
            illustrationType="lukasz-stats"
            color="emerald"
            title="Master Your Topic"
            desc="See exactly where you're struggling with simple charts. Practice until you hit 100%, then walk into your exam with total confidence."
            status="Ready to Learn"
            detail="Score: 84% Ready for Test"
            list={["Tracks Progress", "Predicts Score", "Finds Weak Spots"]}
          />
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Sparkles key={i} size={20} className="text-[#DFFF00]" />
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-syne tracking-tight leading-none">
            "I cut my study time <br /> in half."
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <MessageSquareQuote size={20} className="text-white/90" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg">Alex Johnson</div>
              <div className="text-white/70 text-xs font-black uppercase tracking-widest">
                Medical Student
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DFFF00]/5 blur-[200px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-syne tracking-tight leading-none">
              Start Your <br />
              <span className="text-[#DFFF00]">Best Session</span> Now.
            </h2>
            <p className="text-white/80 text-xl font-medium max-w-xl mx-auto">
              No credit card, no complicated setup. Just better grades.
            </p>
          </div>

          <button
            onClick={() => navigate("/auth")}
            className="group flex items-center justify-center gap-4 mx-auto px-16 py-8 rounded-[40px] bg-white text-black font-black uppercase text-sm tracking-[0.2em] hover:bg-[#DFFF00] transition-colors shadow-3xl shadow-white/5"
          >
            Create My Free Account
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Features;
