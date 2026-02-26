import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Shield,
  Rocket,
  FileText,
  CheckCircle,
  X,
  ChevronRight,
  Loader2,
  Sparkles,
  Crown,
} from "lucide-react";
import { useStore } from "../store/useStore";

const PremiumModal = ({ isOpen, onClose }) => {
  const { updatePremiumStatus } = useStore();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Simulated delay for "Neural Synthesis"
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await updatePremiumStatus(true);
    setIsProcessing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -z-0" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-0" />

            <div className="relative z-10 p-12">
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
                  <Crown size={40} className="text-white fill-current" />
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                  Neural <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                    Premium
                  </span>
                </h2>
                <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.4em]">
                  Unrestricted Mastery Interface
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    icon: Zap,
                    title: "Unlimited Paths",
                    desc: "Generate infinite custom roadmaps for any topic or PDF.",
                    color: "text-indigo-400",
                  },
                  {
                    icon: Shield,
                    title: "Priority Core",
                    desc: "Access the most powerful Gemini models with zero queue time.",
                    color: "text-emerald-400",
                  },
                  {
                    icon: Rocket,
                    title: "Doc-to-Mastery",
                    desc: "Upload complex textbooks to generate instant study maps.",
                    color: "text-amber-400",
                  },
                  {
                    icon: Sparkles,
                    title: "Elite Persona",
                    desc: "Advanced mentor insights and deeper scenario feedback.",
                    color: "text-pink-400",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5"
                  >
                    <div className={`mt-1 ${feat.color}`}>
                      <feat.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full py-6 rounded-[32px] bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Start Your Evolution <ChevronRight size={18} />
                    </>
                  )}
                </button>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center">
                  Simulation Phase • Instant Unlock • Unrestricted Access
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
