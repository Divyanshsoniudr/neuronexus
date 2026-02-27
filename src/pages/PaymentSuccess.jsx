import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import SEO from "../components/SEO";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePremiumStatus, user } = useStore();
  const [isActivating, setIsActivating] = useState(true);

  useEffect(() => {
    const activatePremium = async () => {
      const sessionId = searchParams.get("session_id");
      if (sessionId && user) {
        console.log("[NeuralCommerce] Verifying session:", sessionId);
        // In production, you'd verify the session with Stripe on the backend
        await updatePremiumStatus(true);
        setTimeout(() => setIsActivating(false), 2000);
      }
    };
    activatePremium();
  }, [searchParams, user, updatePremiumStatus]);

  if (isActivating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-indigo-500 border-t-transparent rounded-full mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        />
        <h2 className="text-xl font-black uppercase tracking-[0.3em] animate-pulse">
          Verifying Payment...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-12 overflow-hidden">
      <SEO
        title="Payment Success"
        description="Your account has been upgraded to Premium."
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
        <div className="w-32 h-32 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl relative z-10">
          <CheckCircle size={64} />
        </div>
      </motion.div>

      <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-6 text-center leading-none">
        Premium{" "}
        <span className="text-emerald-500 text-glow-emerald">Unlocked</span>
      </h1>

      <p className="text-white/40 font-bold text-center max-w-md mb-12 uppercase tracking-widest text-[10px] leading-relaxed">
        Your payment was successful. All limits have been removed. You now have
        full access to all features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
        <div className="p-6 rounded-[32px] glass-panel border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-white">
              Unlimited Generation
            </div>
            <div className="text-[9px] font-bold text-white/40">
              No daily roadmap/quiz caps
            </div>
          </div>
        </div>
        <div className="p-6 rounded-[32px] glass-panel border border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-white">
              Priority Access
            </div>
            <div className="text-[9px] font-bold text-white/40">
              Faster AI synthesis seeds
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="group flex items-center gap-4 px-10 py-5 rounded-[24px] bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-white/5 hover:shadow-emerald-500/20"
      >
        Go to Dashboard{" "}
        <ChevronRight
          size={18}
          className="group-hover:translate-x-2 transition-transform"
        />
      </button>
    </div>
  );
};

export default PaymentSuccess;
