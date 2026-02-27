import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Command,
  Mail,
  ArrowRight,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  Loader2,
} from "lucide-react";
import NeuralLogo from "../components/NeuralLogo";
import { useStore } from "../store/useStore";
import SEO from "../components/SEO";

const Auth = () => {
  const { signIn, signInWithEmail, signUpWithEmail, user } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState("select"); // select, login, register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const action = mode === "login" ? signInWithEmail : signUpWithEmail;
      const result = await action(email, password);

      if (!result.success) {
        setError(result.error || "Authentication failed");
        setIsLoading(false);
      }
      // Success will trigger navigate via useEffect
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[70vh] flex flex-col justify-center py-12 px-4">
      <SEO
        title={mode === "register" ? "Join the Elite" : "Welcome Back"}
        description="Join QuizMaster and start preparing for your exams faster."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel p-8 md:p-12 rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl shadow-indigo-500/10"
      >
        <div className="absolute inset-0 bg-indigo-500/5 opacity-10 pointer-events-none" />

        <div className="mx-auto mb-8 flex flex-col items-center">
          <NeuralLogo size={80} className="mb-4" />
        </div>

        <AnimatePresence mode="wait">
          {mode === "select" ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">
                GET STARTED
              </h1>
              <p className="text-white/40 text-[10px] mb-10 uppercase tracking-[0.3em] font-black">
                Account choice
              </p>

              <div className="space-y-4">
                <button
                  onClick={signIn}
                  className="w-full py-5 rounded-[24px] bg-white text-black font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/10 text-xs"
                >
                  <Command size={18} /> Continue with Google
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-white/20 px-4 bg-[#0a0a0a]">
                    Or use email
                  </div>
                </div>

                <button
                  onClick={() => setMode("login")}
                  className="w-full py-5 rounded-[24px] glass-panel border border-white/10 text-white font-black uppercase tracking-widest hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-3 text-xs"
                >
                  <LogIn size={18} /> Existing Student
                </button>

                <button
                  onClick={() => setMode("register")}
                  className="w-full py-5 rounded-[24px] border border-white/5 text-white/60 font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3 text-xs"
                >
                  <UserPlus size={18} /> Create New Account
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => {
                  setMode("select");
                  setError("");
                }}
                className="absolute top-8 left-8 text-white/20 hover:text-white transition-colors"
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>

              <div className="text-center mb-10">
                <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase text-white">
                  {mode === "login" ? "LOG IN" : "SIGN UP"}
                </h1>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black">
                  Enter your credentials
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 pl-14 pr-6 text-white font-bold placeholder:text-white/10 focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all uppercase tracking-wider text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20"
                      size={18}
                    />
                    <input
                      type="password"
                      placeholder="PASSWORD"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 pl-14 pr-6 text-white font-bold placeholder:text-white/10 focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all uppercase tracking-wider text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest"
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 rounded-[24px] bg-white text-black font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed group text-xs"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {mode === "login" ? "ACCESS DASHBOARD" : "START LEARNING"}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest pt-4">
                  {mode === "login" ? "No account?" : "Already joined?"}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      setError("");
                    }}
                    className="ml-2 text-indigo-400 hover:text-white underline transition-colors"
                  >
                    {mode === "login" ? "Create one here" : "Login instead"}
                  </button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-white/5">
          <button
            onClick={() => navigate("/")}
            className="text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-1 group mx-auto"
          >
            Back to Home{" "}
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
