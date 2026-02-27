import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import { getFlaggedSimulations } from "../services/AdminService";
import SEO from "../components/SEO";

const Moderator = () => {
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      const data = await getFlaggedSimulations();
      setFlaggedItems(data);
      setIsLoading(false);
    };
    fetchAuditData();
  }, []);

  const handleResolve = (id, action) => {
    // In a real system, you'd update Firestore here
    setFlaggedItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItem(null);
    alert(`Audit Resolve: ${action} applied to session ${id}`);
  };

  return (
    <div className="max-w-7xl w-full mx-auto py-12 px-6">
      <SEO
        title="Moderator Dashboard"
        description="Moderation interface for reviewing flagged simulations."
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
            Content <span className="text-emerald-500">Audit</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Shield size={12} /> Status: Active
            </div>
            <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
              {flaggedItems.length} Sessions Pending Review
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Session ID..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flagged Sessions List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">
            Flagged Instances
          </h3>
          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-white/10 uppercase font-black text-xs tracking-widest">
              Scanning...
            </div>
          ) : flaggedItems.length > 0 ? (
            flaggedItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-6 rounded-[32px] border cursor-pointer transition-all ${selectedItem?.id === item.id ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/5 hover:border-white/10"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60">
                    Session: {item.id.slice(0, 8)}
                  </div>
                  <AlertTriangle size={14} className="text-amber-500" />
                </div>
                <h4 className="text-sm font-black text-white mb-2 line-clamp-1">
                  {item.topic || "Unknown Topic"}
                </h4>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Eye size={10} /> View details
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center glass-panel rounded-[32px] border border-white/5">
              <CheckCircle
                size={32}
                className="mx-auto text-emerald-500/20 mb-4"
              />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/10">
                All sessions clear
              </p>
            </div>
          )}
        </div>

        {/* Audit Detail View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-12 rounded-[48px] border border-white/5 min-h-[500px]"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2">
                      Audit Detail
                    </div>
                    <h2 className="text-4xl font-black text-white lowercase italic tracking-tighter leading-none">
                      {selectedItem.topic}
                    </h2>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleResolve(selectedItem.id, "APPROVE")}
                      className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleResolve(selectedItem.id, "STRIKE")}
                      className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Strike
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 italic">
                    <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-4">
                      User Query
                    </div>
                    <p className="text-sm font-bold text-white/80 leading-relaxed">
                      "{selectedItem.query || "No query recorded"}"
                    </p>
                  </div>
                  <div className="p-8 rounded-[32px] bg-red-500/[0.03] border border-red-500/10 italic">
                    <div className="text-[8px] font-black uppercase tracking-widest text-red-500/40 mb-4">
                      System Log
                    </div>
                    <p className="text-sm font-bold text-red-500/60 leading-relaxed">
                      "{selectedItem.flagReason || "Suspected policy violation"}
                      "
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20">
                    Session Trace
                  </h4>
                  <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 font-mono text-[10px] text-white/40 leading-loose">
                    {/* Mocking the session trace for display */}
                    [08:42:15] System initialized
                    <br />
                    [08:42:16] Scanning input for toxicity/bias...
                    <br />
                    [08:42:17] <span className="text-amber-500">
                      Warning:
                    </span>{" "}
                    Topic "{selectedItem.topic}" flagged for review
                    <br />
                    [08:42:18] Processing paused
                    <br />
                    [08:42:19] Session ID recorded: {selectedItem.id}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass-panel rounded-[48px] border border-white/5 text-center p-12 translate-y-0">
                <Search size={64} className="text-white/5 mb-8" />
                <h3 className="text-xl font-black text-white italic mb-2 uppercase tracking-tight">
                  Select a Session to Audit
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 max-w-xs mx-auto">
                  Use the left panel to begin reviewing flagged neural activity.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Moderator;
