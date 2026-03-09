import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useBlocker } from "react-router-dom";
import {
  Check,
  X,
  Sparkles,
  BookOpen,
  ArrowRight,
  Network,
  Layers,
  Dna,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "../store/useStore";
import NeuroMentor from "../components/NeuroMentor";
import NeuralMap from "../components/NeuralMap";
import ImprovementRoom from "../components/TheForge";
import QuizResults from "../components/QuizResults";
import ScenarioEngine from "../components/ScenarioEngine";
import { AnalyticsService } from "../services/AnalyticsService";

const Quiz = () => {
  const {
    currentQuiz,
    currentQuestionIndex,
    submitAnswer,
    nextQuestion,
    answers,
    userTopic,
    isForgeActive,
    isScenarioMode,
    toggleScenarioMode,
  } = useStore();
  const [view, setView] = React.useState(
    isScenarioMode ? "scenario" : "question",
  ); // question, map, scenario
  const [showResults, setShowResults] = React.useState(false);
  const navigate = useNavigate();

  // ── Tab-switch detection (Page Visibility API) ──────────────────────────
  const [tabSwitchCount, setTabSwitchCount] = React.useState(0);
  const [showTabWarning, setShowTabWarning] = React.useState(false);

  React.useEffect(() => {
    if (currentQuiz.length === 0) return;

    // Log the event once when quiz formally mounts
    AnalyticsService.logQuizStarted(userTopic, "auto");

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
      } else {
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 4000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentQuiz.length]);

  // ── Screen Wake Lock API ────────────────────────────────────────────────
  const wakeLockRef = React.useRef(null);

  React.useEffect(() => {
    if (currentQuiz.length === 0) return;
    const acquireLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch (err) {
          console.warn("Wake Lock unavailable:", err.message);
        }
      }
    };
    acquireLock();
    const handleVisibility = () => {
      if (!document.hidden) acquireLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      wakeLockRef.current?.release();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentQuiz.length]);

  // ── Navigation Guard (useBlocker) ───────────────────────────────────────
  const shouldBlock = currentQuiz.length > 0 && !showResults;
  const blocker = useBlocker(shouldBlock);

  if (currentQuiz.length === 0) {
    return (
      <div className="text-center p-20 glass-panel rounded-[40px] border border-white/5">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">
          No active quiz found
        </h2>
        <Link
          to="/generator"
          className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all text-xs"
        >
          Go Create One
        </Link>
      </div>
    );
  }

  const currentQuestion = currentQuiz[currentQuestionIndex];
  const userFeedback = answers.find((a) => a.questionId === currentQuestion.id);
  if (isForgeActive) return <ImprovementRoom />;

  const isFinished = answers.length === currentQuiz.length;
  const onLastQuestion = currentQuestionIndex + 1 === currentQuiz.length;

  if (showResults && (isFinished || onLastQuestion)) return <QuizResults />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl w-full mx-auto pb-24 px-6 md:px-0"
    >
      {/* ── Tab-switch warning banner (Page Visibility API) ── */}
      {showTabWarning && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl backdrop-blur-md"
        >
          ⚠️ Tab switch #{tabSwitchCount} detected — stay focused!
        </motion.div>
      )}

      {/* ── Navigation Guard Modal (useBlocker) ── */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-10 rounded-[40px] border border-white/10 max-w-md w-full text-center space-y-6"
          >
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Leave Quiz?
            </h2>
            <p className="text-white/70 text-sm font-medium">
              Your progress will be lost. You'll need to generate a new quiz.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => blocker.reset()}
                className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#DFFF00] transition-all"
              >
                Stay
              </button>
              <button
                onClick={() => blocker.proceed()}
                className="px-8 py-3 rounded-2xl border border-red-500/30 text-red-400 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 transition-all"
              >
                Leave Anyway
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* View Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center p-1 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setView("question")}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "question"
                ? "bg-white text-black shadow-xl shrink-0"
                : "text-white/90 hover:text-white"
            }`}
          >
            <Layers size={14} /> Questions
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "map"
                ? "bg-white text-black shadow-xl shrink-0"
                : "text-white/90 hover:text-white"
            }`}
          >
            <Network size={14} /> Study Map
          </button>
          <button
            onClick={() => {
              setView("scenario");
              if (!isScenarioMode) toggleScenarioMode();
            }}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "scenario"
                ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0"
                : "text-indigo-400/60 hover:text-indigo-400"
            }`}
          >
            <ShieldCheck size={14} /> Scenario
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {view === "scenario" ? (
          <ScenarioEngine />
        ) : view === "map" ? (
          <NeuralMap />
        ) : (
          <>
            {/* Minimalist Sidebar - Unfolds from Left */}
            <motion.aside
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-64 glass-panel p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-white/5 lg:sticky top-24 md:top-32"
            >
              <div className="space-y-8">
                <div>
                  <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
                    What you're learning
                  </div>
                  <h3 className="font-syne text-xl uppercase leading-none">
                    {userTopic || "General Mastery"}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black text-white/90 uppercase tracking-widest">
                    <span>Score</span>
                    <span>
                      {answers.filter((a) => a.isCorrect).length}/
                      {answers.length || 0}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${(answers.filter((a) => a.isCorrect).length / (answers.length || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="text-xs font-black text-white/90 uppercase tracking-widest mb-4">
                    Study Status
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mt-0.5" />
                    <span className="text-xs font-bold text-indigo-400 uppercase">
                      Session Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.aside>

            <div className="flex-1 flex flex-col gap-5">
              {/* Sleek Top Progress */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">
                    Question {currentQuestionIndex + 1}{" "}
                    <span className="text-white/90 mx-1">/</span>{" "}
                    {currentQuiz.length}
                  </span>
                  <span className="text-white/90 text-xs font-black uppercase tracking-[0.3em]">
                    {Math.round(
                      ((currentQuestionIndex + (userFeedback ? 1 : 0)) /
                        currentQuiz.length) *
                        100,
                    )}
                    % Finished
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQuestionIndex + (userFeedback ? 1 : 0)) / currentQuiz.length) * 100}%`,
                    }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -90, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="origami-container w-full"
                >
                  <div className="glass-panel p-5 md:p-10 rounded-[24px] md:rounded-[48px] border border-white/10 shadow-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest font-syne">
                          <Dna size={10} /> {currentQuestion.category}
                        </span>
                        <span className="text-white/90 text-xs font-black uppercase tracking-widest font-syne">
                          Question {currentQuestionIndex + 1}
                        </span>
                      </div>

                      <h1
                        id="quiz-question"
                        className="text-2xl md:text-3xl font-black tracking-tight leading-[1.1] text-white uppercase italic mb-8 font-outfit"
                      >
                        {currentQuestion.question}
                      </h1>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option) => {
                          let stateClass =
                            "border-white/5 hover:border-white/20 hover:bg-white/5";
                          if (userFeedback) {
                            if (option === currentQuestion.answer)
                              stateClass =
                                "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                            else if (option === userFeedback.selected)
                              stateClass =
                                "border-red-500/50 bg-red-500/10 text-red-400";
                            else stateClass = "opacity-20 pointer-events-none";
                          }

                          return (
                            <div key={option} className="flex flex-col h-full">
                              <button
                                disabled={!!userFeedback}
                                onClick={() => submitAnswer(option)}
                                className={`p-4 md:p-5 rounded-xl md:rounded-[28px] border glass-panel text-left font-black uppercase tracking-tight transition-all flex justify-between items-center group relative overflow-hidden h-full font-outfit ${stateClass}`}
                              >
                                <span className="text-base md:text-lg relative z-10">
                                  {option}
                                </span>
                                <AnimatePresence>
                                  {userFeedback &&
                                    option === currentQuestion.answer && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="relative z-10"
                                      >
                                        <Check
                                          size={28}
                                          className="text-emerald-400"
                                        />
                                      </motion.div>
                                    )}
                                  {userFeedback &&
                                    option === userFeedback.selected &&
                                    option !== currentQuestion.answer && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: 45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="relative z-10"
                                      >
                                        <X size={28} className="text-red-400" />
                                      </motion.div>
                                    )}
                                </AnimatePresence>
                              </button>

                              <AnimatePresence>
                                {userFeedback &&
                                  option === currentQuestion.answer &&
                                  !userFeedback.isCorrect && (
                                    <motion.div
                                      initial={{
                                        rotateX: -90,
                                        opacity: 0,
                                        translateY: -20,
                                      }}
                                      animate={{
                                        rotateX: 0,
                                        opacity: 1,
                                        translateY: 0,
                                      }}
                                      className="mt-3 p-5 rounded-2xl md:rounded-[24px] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden transition-all"
                                    >
                                      <div className="flex items-center gap-2 mb-2 text-indigo-400 font-extrabold uppercase tracking-[0.2em] text-xs font-syne">
                                        <BookOpen size={12} /> Wait, here's the
                                        answer!
                                      </div>
                                      <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                                        {currentQuestion.explanation}
                                      </p>
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  if (onLastQuestion) {
                    setShowResults(true);
                  } else {
                    nextQuestion();
                  }
                }}
                className={`mt-6 w-full py-4 rounded-2xl md:rounded-3xl bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 font-syne text-xs ${
                  !userFeedback ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                {onLastQuestion ? "See My Results" : "Next Step"}{" "}
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Subtle Bottom Content */}
      <div className="mt-8 opacity-20 hover:opacity-100 transition-opacity">
        <NeuroMentor currentQuestion={currentQuestion} />
      </div>
    </motion.div>
  );
};

export default Quiz;
