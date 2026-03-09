import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Bot,
  Play,
  Settings2,
  SkipForward,
  BrainCircuit,
  Mic,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "../store/useStore";
import { simulateInterviewStep } from "../services/geminiService";

// 1. Pre-Interview Setup Component
const InterviewSetup = ({ onStart }) => {
  const [role, setRole] = useState("React Frontend Engineer");
  const [difficulty, setDifficulty] = useState("Mid-Level");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-[40px] glass-panel border border-white/5 max-w-2xl w-full mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-indigo-400">
          <BrainCircuit size={40} />
        </div>
        <h2 className="text-4xl font-black uppercase text-white font-syne tracking-tighter">
          Practice Interview
        </h2>
        <p className="text-white/90 text-xs font-black uppercase tracking-widest mt-2">
          Set up your interview
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-white/90 uppercase tracking-widest mb-3">
            Job Title
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/70 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="e.g. Systems Architect"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-white/90 uppercase tracking-widest mb-3">
            Difficulty
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Junior", "Mid-Level", "Principal"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-6 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                  difficulty === level
                    ? "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 text-white/90 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart({ role, difficulty })}
          className="w-full mt-8 py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#DFFF00] transition-colors flex items-center justify-center gap-3 group"
        >
          Start Interview
          <Play
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
};

// 2. The Chat Interface Component
const InterviewChat = ({ config, onEnd }) => {
  const { user } = useStore();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome. I am your Senior Engineering Manager for today. We are evaluating you for the **${config.difficulty} ${config.role}** position. \n\nLet's begin. Describe a time you had to optimize a severely underperforming system component.`,
    }, // Dummy initial message until backend is wired
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ── SpeechSynthesis — AI speaks each new assistant message ──────────────
  useEffect(() => {
    if (!isSpeechEnabled) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") {
      const clean = lastMsg.content
        .replace(/[#*`_~>\[\]]/g, "")
        .replace(/\n+/g, " ")
        .slice(0, 500);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isSpeechEnabled]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Speech Recognition not supported in this browser.");
      }
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const responseText = await simulateInterviewStep(newMessages, config);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `*[Error: Could not connect. Please try again later.]*`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col glass-panel rounded-[40px] border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="h-20 border-b border-white/10 bg-white/5 flex items-center justify-between px-8 shrink-0 relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Bot size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm tracking-widest font-syne">
              Virtual Interviewer
            </h3>
            <p className="text-white/90 text-[10px] uppercase font-black tracking-widest">
              {config.difficulty} {config.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isSpeechEnabled;
              setIsSpeechEnabled(next);
              if (!next) window.speechSynthesis.cancel();
            }}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              isSpeechEnabled
                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                : "bg-white/5 text-white/40 border-white/10 hover:text-white/80"
            }`}
          >
            🎤 Voice {isSpeechEnabled ? "On" : "Off"}
          </button>
          <button
            onClick={onEnd}
            className="px-6 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth z-10"
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  m.role === "user"
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                }`}
              >
                {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-6 rounded-3xl ${
                  m.role === "user"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-50 rounded-tr-none"
                    : "bg-white/5 border-white/10 text-white/90 rounded-tl-none"
                } border`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <div className="px-6 py-4 rounded-3xl bg-white/5 border border-white/10 rounded-tl-none flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/5 border-t border-white/10 shrink-0 z-10 backdrop-blur-md">
        <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-[28px] p-2 focus-within:border-indigo-500/50 transition-colors ring-1 ring-transparent focus-within:ring-indigo-500/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Formulate your response..."
            className="flex-1 bg-transparent border-none text-white placeholder:text-white/70 resize-none max-h-32 min-h-[50px] py-3 pl-6 pr-4 focus:outline-none focus:ring-0 sm:text-sm"
            rows="1"
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={toggleListen}
              className={`p-3 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500/20 text-red-500 animate-pulse"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Mic size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-4 rounded-full bg-indigo-500 text-white disabled:bg-white/5 disabled:text-white/70 hover:bg-indigo-400 transition-colors"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/70 mt-4">
          Shift + Enter for new line • Markdown Supported
        </p>
      </div>
    </div>
  );
};

// 3. Main Route Component
export default function Interview() {
  const [config, setConfig] = useState(null);
  const [phase, setPhase] = useState("setup"); // setup, chat, debrief

  const handleStart = (cfg) => {
    setConfig(cfg);
    setPhase("chat");
  };

  return (
    <div className="w-full pt-8 relative z-10">
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" exit={{ opacity: 0, y: -20 }}>
            <InterviewSetup onStart={handleStart} />
          </motion.div>
        )}

        {phase === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InterviewChat config={config} onEnd={() => setPhase("setup")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
