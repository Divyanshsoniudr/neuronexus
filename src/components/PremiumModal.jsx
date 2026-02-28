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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative z-10 p-12">
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/90 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
                  <Crown size={32} className="text-white fill-current" />
                </div>
                <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
                  QuizMaster Premium
                </h2>
                <p className="text-white/90 text-sm font-medium">
                  Unlock unlimited access to all features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {[
                  {
                    icon: Zap,
                    title: "Unlimited Paths",
                    desc: "Generate infinite custom roadmaps.",
                    color: "text-indigo-400",
                  },
                  {
                    icon: Shield,
                    title: "Fast Generation",
                    desc: "Skip the queue and generate instantly.",
                    color: "text-emerald-400",
                  },
                  {
                    icon: Rocket,
                    title: "Upload Documents",
                    desc: "Create quizzes from textbooks.",
                    color: "text-amber-400",
                  },
                  {
                    icon: Sparkles,
                    title: "Pro Mentors",
                    desc: "Deeper insights from virtual tutors.",
                    color: "text-pink-400",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-[#111] border border-white/5"
                  >
                    <div className={`mt-0.5 ${feat.color}`}>
                      <feat.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-white/90">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Upgrade Now <ChevronRight size={16} />
                    </>
                  )}
                </button>
                <div className="text-xs font-medium text-white/90 text-center">
                  Instant Unlock • Unrestricted Access
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
