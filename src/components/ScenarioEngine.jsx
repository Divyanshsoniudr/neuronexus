import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  Scale,
  UserCheck,
  History,
} from "lucide-react";
import { personaOrchestrator } from "../services/PersonaOrchestrator";
import { neutralityEngine } from "../services/NeutralityEngine";
import { decisionLedger } from "../services/DecisionLedger";
import { useStore } from "../store/useStore";
import { getMentorById } from "../services/NeuralMentors";

const ScenarioEngine = () => {
  const { userTopic } = useStore();
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState(null);
  const [decision, setDecision] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [dialectics, setDialectics] = useState(null);
  const [step, setStep] = useState(1); // 1: Scenario, 2: Feedback/Dialectics

  useEffect(() => {
    const init = async () => {
      try {
        const data = await personaOrchestrator.startScenario(userTopic);
        setScenario(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to start scenario", err);
      }
    };
    init();
  }, [userTopic]);

  const handleSubmit = async () => {
    if (!decision.trim()) return;
    setLoading(true);

    try {
      // 1. Get Persona Feedback
      const personaFeedback = await personaOrchestrator.getPersonaFeedback(
        scenario.incident,
        decision,
        scenario.roles,
      );
      setFeedback(personaFeedback);

      // 2. Get Dialectical Review (The Neutrality Layer)
      const dialecticReview = await neutralityEngine.getDialecticalReview(
        scenario.incident,
        decision,
      );
      setDialectics(dialecticReview);

      // 3. Log to Decision Ledger
      await decisionLedger.logDecision({
        scenarioTitle: scenario.title,
        userDecision: decision,
        perspectives: dialecticReview.perspectives,
        feedback: personaFeedback,
      });

      setStep(2);
      setLoading(false);
    } catch (err) {
      console.error("Evaluation failed", err);
      setLoading(false);
    }
  };

  if (loading && !scenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6"
        >
          <Zap className="text-indigo-400 animate-pulse" />
        </motion.div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-white/80">
          Loading Scenario...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="scenario-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/90 mb-1">
                  Active Scenario
                </h3>
                <h2 className="text-2xl font-black tracking-tight">
                  {scenario.title}
                </h2>
              </div>
            </div>

            {/* Context */}
            <div className="space-y-6 mb-12">
              <p className="text-lg text-white/90 leading-relaxed font-light italic">
                "{scenario.context}"
              </p>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> The Immediate Event
                </h4>
                <p className="text-xl font-bold leading-snug">
                  {scenario.incident}
                </p>
              </div>
            </div>

            {/* Decision Input */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                Your Decision / Reasoning
              </h4>
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="How would you handle this? Justify your logic..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/70 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!decision.trim() || loading}
                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  "Evaluating..."
                ) : (
                  <>
                    Commit Decision <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Persona Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {feedback.map((f, i) => {
                const mentor = getMentorById(f.mentorId);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${mentor?.accent || "bg-white/5"} flex items-center justify-center text-indigo-400 border border-white/5 overflow-hidden`}
                      >
                        {mentor ? (
                          <img
                            src={mentor.avatar}
                            className="w-full h-full object-cover"
                            alt={mentor.name}
                          />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </div>
                      <div>
                        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                          {mentor?.title || f.role}
                        </div>
                        <div className="text-xs font-black uppercase tracking-wider text-white">
                          {mentor?.name || "Reviewer"}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed mb-4 relative z-10 italic">
                      "{f.feedback}"
                    </p>
                    <div className="flex items-center gap-2 relative z-10">
                      <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${mentor ? mentor.accent.replace("/10", "") : "bg-indigo-500"}`}
                          style={{ width: `${f.rating * 10}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-white/90">
                        {f.rating}/10
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dialectical Review (Neutrality Engine) */}
            <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 bg-indigo-500/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 flex items-center gap-2">
                <Scale size={16} /> Balanced Review
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {dialectics.perspectives.map((p, i) => (
                  <div key={i} className="space-y-6">
                    <h4 className="text-lg font-black tracking-tight">
                      {p.label}
                    </h4>
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-white/5 border-l-2 border-indigo-500">
                        <p className="text-sm text-white/80">{p.argument}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/[0.02] border-l-2 border-white/20">
                        <p className="text-xs text-white/90 italic">
                          Friction: {p.friction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-5 rounded-2xl glass-panel border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <History size={16} /> Save & Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioEngine;
