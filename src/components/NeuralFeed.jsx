import React from "react";
import { motion } from "framer-motion";
import AgentInsightCard from "./AgentInsightCard";
import { NEURAL_MENTORS } from "../services/NeuralMentors";
import { devToService } from "../services/DevToService";
import { Sparkles, Brain, Cpu, MessageSquare } from "lucide-react";

const NeuralFeed = ({ skillStats, userTopic }) => {
  const [personalInsights, setPersonalInsights] = React.useState([]);
  const [globalSignals, setGlobalSignals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("global");

  React.useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const articles = await devToService.getArticles(
          userTopic || "technology",
        );
        setGlobalSignals(articles);

        const insights = getProceduralInsights(userTopic, skillStats);
        setPersonalInsights(insights);
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [userTopic, skillStats]);

  const getProceduralInsights = (topic, stats) => {
    const feed = [];
    if (topic) {
      feed.push({
        mentor: NEURAL_MENTORS.find((m) => m.id === "architect"),
        text: `The structural complexity of ${topic} requires a deep focus on architectural patterns.`,
        type: "thought",
      });
    }
    feed.push({
      mentor: NEURAL_MENTORS.find((m) => m.id === "ethicist"),
      text: "Governance is the silent architect of all sustainable systems. Focus on impact.",
      type: "quote",
    });
    return feed;
  };

  return (
    <div className="space-y-8">
      {/* Agentic Theater: Activity Bar */}
      <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent animate-shimmer" />

        <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
          <div className="flex -space-x-3">
            {NEURAL_MENTORS.map((m) => (
              <div
                key={m.id}
                className="w-10 h-10 rounded-2xl border-2 border-[#050505] overflow-hidden shadow-2xl relative group/avatar"
              >
                <img
                  src={m.avatar}
                  className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110"
                  alt={m.name}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mb-1 font-syne">
              Synaptic Status
            </span>
            <span
              className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${loading ? "text-white/20" : "text-indigo-400"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${loading ? "bg-white/10" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"}`}
              />
              {loading ? "Decrypting..." : "Fully Synchronized"}
            </span>
          </div>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 sm:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "global" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white"}`}
          >
            Global
          </button>
          <button
            onClick={() => setActiveTab("synaptic")}
            className={`flex-1 sm:flex-none py-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "synaptic" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white"}`}
          >
            Synaptic
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4 italic font-syne">
          <span className="w-12 h-px bg-white/10" />
          Neural Stream
          <span className="w-12 h-px bg-white/10" />
        </h3>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <div className="w-12 h-12 rounded-3xl border-2 border-white/20 border-t-white animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Establishing Uplink...
            </p>
          </div>
        ) : activeTab === "global" ? (
          globalSignals.map((signal, idx) => (
            <motion.a
              key={signal.id}
              href={signal.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="block glass-panel p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all border border-white/5">
                  <Globe size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-indigo-400/50 transition-colors">
                    {signal.source || "External Signal"}
                  </span>
                  <span className="text-[8px] font-bold text-white/10">
                    {new Date(signal.published_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors mb-3 font-syne leading-tight uppercase italic tracking-tight">
                {signal.title}
              </h4>
              <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors leading-relaxed line-clamp-2 font-medium">
                {signal.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {signal.tags?.slice(0, 3).map((tag, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase text-white/20 group-hover:text-indigo-400/40 group-hover:border-indigo-500/10 transition-all"
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </motion.a>
          ))
        ) : (
          personalInsights.map((item, idx) => (
            <AgentInsightCard
              key={idx}
              mentor={item.mentor}
              insight={item.text}
              type={item.type}
            />
          ))
        )}
      </div>

      <div className="pt-8 text-center">
        <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 py-4 px-8 border-t border-white/5">
          <Cpu size={14} />
          End of Stream
        </div>
      </div>
    </div>
  );
};

export default NeuralFeed;
