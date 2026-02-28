import React from "react";
import { motion } from "framer-motion";
import AgentInsightCard from "./AgentInsightCard";
import { NEURAL_MENTORS } from "../services/NeuralMentors";
import { devToService } from "../services/DevToService";
import { Sparkles, Brain, Cpu, MessageSquare, Globe } from "lucide-react";

const NeuralFeed = ({ skillStats, userTopic }) => {
  const [personalInsights, setPersonalInsights] = React.useState([]);
  const [globalSignals, setGlobalSignals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("global");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // Fetch initial feed when topic changes
  React.useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setPage(1);
      try {
        const articles = await devToService.getArticles(
          userTopic || "technology",
          1,
        );
        setGlobalSignals(articles);
        setHasMore(articles.length === 15);

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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const moreArticles = await devToService.getArticles(
        userTopic || "technology",
        nextPage,
      );
      if (moreArticles.length > 0) {
        setGlobalSignals((prev) => [...prev, ...moreArticles]);
        setPage(nextPage);
        setHasMore(moreArticles.length === 15);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more articles:", err);
    } finally {
      setLoadingMore(false);
    }
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex -space-x-3">
            {NEURAL_MENTORS.map((m) => (
              <div
                key={m.id}
                className="w-8 h-8 rounded-full border-2 border-[#000] overflow-hidden relative group/avatar"
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/90">Signals</span>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 ${loading ? "text-white/70" : "text-emerald-400"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-white/20" : "bg-emerald-500 animate-pulse"}`}
                />
                {loading ? "Syncing..." : "Live"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-[#111] p-1 rounded-lg border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 sm:flex-none py-1.5 px-4 rounded-md text-xs font-medium transition-all ${activeTab === "global" ? "bg-white/10 text-white" : "text-white/90 hover:text-white"}`}
          >
            Global
          </button>
          <button
            onClick={() => setActiveTab("synaptic")}
            className={`flex-1 sm:flex-none py-1.5 px-4 rounded-md text-xs font-medium transition-all ${activeTab === "synaptic" ? "bg-white/10 text-white" : "text-white/90 hover:text-white"}`}
          >
            Personal
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/80 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-white/10" />
          Recent Streams
          <span className="w-8 h-[1px] bg-white/10" />
        </h3>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <div className="w-12 h-12 rounded-3xl border-2 border-white/20 border-t-white animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Loading Details...
            </p>
          </div>
        ) : activeTab === "global" ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 sm:space-y-0">
            {globalSignals.map((signal, idx) => (
              <motion.a
                key={signal.id}
                href={signal.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="block w-full mb-6 break-inside-avoid bg-[#0a0a0a] rounded-3xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden"
              >
                {signal.cover_image && (
                  <div className="w-full relative overflow-hidden bg-[#111]">
                    <img
                      src={signal.cover_image}
                      alt={signal.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent opacity-80" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/90 group-hover:bg-white/10 group-hover:text-white transition-colors border border-white/5 shrink-0">
                      <Globe size={14} />
                    </div>
                    <div className="flex flex-col flex-1 pt-0.5">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium text-white/90 group-hover:text-white/90 transition-colors line-clamp-1">
                          {signal.author || "Dev.to"}
                        </span>
                        <span className="text-[10px] font-medium text-white/70 whitespace-nowrap ml-2">
                          {new Date(signal.published_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug">
                    {signal.title}
                  </h4>
                  {signal.description && (
                    <p className="text-xs text-white/90 group-hover:text-white/90 transition-colors leading-relaxed line-clamp-3 mb-4">
                      {signal.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {signal.tags?.slice(0, 3).map((tag, i) => (
                      <div
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 text-white/90 text-[10px] font-medium group-hover:bg-white/10 group-hover:text-white transition-colors"
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
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

      {activeTab === "global" && hasMore && !loading && (
        <div className="pt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-xl border border-white/10 hover:border-white/30 text-white/90 hover:text-white transition-all text-xs font-semibold tracking-wide disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                LOADING MORE...
              </>
            ) : (
              "LOAD MORE"
            )}
          </button>
        </div>
      )}

      {(!hasMore || activeTab === "synaptic") && !loading && (
        <div className="pt-8 text-center">
          <div className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 py-4 px-8 border-t border-white/5">
            <Cpu size={14} />
            End of Stream
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralFeed;
