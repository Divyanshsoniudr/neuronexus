import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import NeuralLogo from "./NeuralLogo";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 md:p-20 rounded-[48px] border border-white/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-10 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border border-red-500/20 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle size={48} className="text-red-500" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 font-syne">
                  Something Went Wrong
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-none font-outfit">
                  WE RAN INTO <br />
                  <span className="italic text-red-500">A PROBLEM.</span>
                </h1>

                <p className="text-white/90 text-lg font-medium leading-relaxed mb-12 max-w-md mx-auto font-outfit">
                  The app had a small hiccup. Let's get back to learning.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button
                    onClick={this.handleReset}
                    className="px-8 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 text-xs font-syne group shadow-2xl shadow-red-500/20"
                  >
                    <RefreshCw
                      size={18}
                      className="group-hover:rotate-180 transition-transform duration-700"
                    />
                    Reload App
                  </button>
                  <button
                    onClick={this.handleHome}
                    className="px-8 py-5 rounded-2xl border border-white/10 text-white/90 font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-xs font-syne"
                  >
                    <Home size={18} />
                    Return Home
                  </button>
                </div>
              </div>

              {/* Decorative side accents */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 blur-[80px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full" />
            </motion.div>

            <div className="mt-12 flex flex-col items-center opacity-20">
              <NeuralLogo size={32} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] text-white">
                Error Recovery System
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
