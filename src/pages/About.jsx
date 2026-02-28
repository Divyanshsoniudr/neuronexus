import React from "react";
import { motion } from "framer-motion";
import { Bookmark, Zap, Activity, Clock, ShieldCheck } from "lucide-react";
import NeuralLogo from "../components/NeuralLogo";
import SEO from "../components/SEO";

const About = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6">
      <SEO
        title="Our Mission"
        description="Learn why we built QuizMaster and how we're changing the way students prepare for exams."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <Bookmark size={12} />
          Our Mission
        </div>
        <h1 className="text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-white">
          THE END OF <br />{" "}
          <span className="text-gradient uppercase">CRAMMING.</span>
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto font-medium">
          QuizMaster was built to solve a simple problem: traditional studying
          is slow and ineffective. We use AI to make active recall the default
          way you learn.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {[
          {
            title: "Gemini AI Core",
            icon: ShieldCheck,
            desc: "Powered by Gemini 1.5 Pro to ensure complex concepts are explained with 100% accuracy.",
            color: "text-indigo-400",
          },
          {
            title: "Active Retrieval",
            icon: Activity,
            desc: "Designed around the 'Testing Effect'—the scientifically proven fastest way to retain knowledge.",
            color: "text-emerald-400",
          },
          {
            title: "Time Efficiency",
            icon: Clock,
            desc: "Stop reading the same page 10 times. Spend 5 minutes on a quiz and know exactly what you've missed.",
            color: "text-amber-400",
          },
          {
            title: "Universal Support",
            icon: Zap,
            desc: "From Med-School to Coding bootcamps, QuizMaster adapts to any subject instantly.",
            color: "text-purple-400",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[40px] glass-panel border border-white/5"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} mb-6`}
            >
              {item.title === "Gemini AI Core" ? (
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <NeuralLogo size={80} className="shadow-2xl" />
                </motion.div>
              ) : (
                <item.icon size={24} />
              )}
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
              {item.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-12 rounded-[48px] border border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] pointer-events-none" />
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight text-white relative z-10">
          The Vision
        </h2>
        <p className="text-white/90 text-sm leading-relaxed max-w-2xl mx-auto italic relative z-10">
          "We believe that education should be measurable, fast, and accessible.
          QuizMaster is the tool we wish we had during our own exams—a private
          tutor that fits in your pocket and knows exactly how to help you
          pass."
        </p>
      </div>
    </div>
  );
};

export default About;
