import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Sparkles, Brain, Bot } from "lucide-react";
import NeuralLogo from "./NeuralLogo";
import { getRandomMentor } from "../services/NeuralMentors";

const NeuroMentor = ({ currentQuestion, mentorOverride }) => {
  const [mentor] = useState(mentorOverride || getRandomMentor());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I am ${mentor.name}, your ${mentor.title}. Need help with this question?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const responseContent = `As your ${mentor.title}, here is some help with "${currentQuestion.category}": ${currentQuestion.explanation}. ${mentor.philosophy}`;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseContent },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="w-[360px] h-[450px] glass-panel rounded-3xl border border-indigo-500/20 flex flex-col overflow-hidden mb-4 shadow-2xl shadow-indigo-500/10"
          >
            {/* Header */}
            <div
              className={`p-6 border-b border-white/5 flex items-center justify-between ${mentor.accent}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 overflow-hidden">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em] leading-none mb-1">
                    {mentor.role}
                  </div>
                  <div className="text-sm font-black tracking-tighter leading-none font-syne uppercase">
                    {mentor.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-indigo-500 text-white font-bold rounded-tr-none shadow-lg shadow-indigo-500/20"
                        : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 pr-14 text-xs font-bold text-white transition-all outline-none focus:border-indigo-500/50 placeholder:text-white/70"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 bottom-2 w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-indigo-500/20 ${
          isOpen
            ? "bg-white text-black"
            : `${mentor.accent.replace("/10", "")} text-white hover:scale-105 border border-white/10`
        }`}
      >
        <div className="relative">
          {isOpen ? (
            <X size={24} />
          ) : (
            <img
              src={mentor.avatar}
              className="w-8 h-8 opacity-80"
              alt="mentor"
            />
          )}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-indigo-500 animate-pulse" />
          )}
        </div>
      </button>
    </div>
  );
};

export default NeuroMentor;
