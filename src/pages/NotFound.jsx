import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft, Zap } from "lucide-react";
import SEO from "../components/SEO";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto text-center px-6">
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for doesn't exist."
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-16 md:p-24 rounded-[64px] border border-white/5 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[140px] opacity-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[140px] opacity-10" />

        <h1 className="text-[160px] font-black tracking-tighter leading-none mb-4 text-white/5 italic select-none">
          404
        </h1>

        <div className="relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-10 text-indigo-400 shadow-2xl shadow-indigo-500/20">
            <Search size={44} className="animate-pulse" />
          </div>

          <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic text-white">
            Page <span className="text-indigo-400">Not Found</span>
          </h2>

          <p className="text-white/80 mb-12 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md mx-auto leading-relaxed">
            The link you followed might be broken or the page has been moved.
            Please check the URL or return to the main dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white/90 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 group/back"
            >
              <ArrowLeft
                size={16}
                className="group-hover/back:-translate-x-1 transition-transform"
              />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-5 rounded-3xl bg-white text-black font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group/home"
            >
              <Home
                size={16}
                className="group-hover/home:scale-110 transition-transform"
              />
              Main Dashboard
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-[8px] font-black text-white/70 uppercase tracking-[0.5em]">
          <Zap size={10} /> System Operational
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
