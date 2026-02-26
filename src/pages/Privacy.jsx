import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import SEO from "../components/SEO";

const Privacy = () => {
  return (
    <div className="w-full max-w-3xl mx-auto py-20 px-6">
      <SEO
        title="Privacy Protocol"
        description="Learn how we handle your neural data and cognitive vectors."
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-16 rounded-[64px] border border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-mesh opacity-5 pointer-events-none" />

        <h1 className="text-4xl font-black mb-12 tracking-tighter uppercase flex items-center gap-4">
          <Shield className="text-cyan-400" size={32} />
          Neural Privacy Protocol
        </h1>

        <div className="space-y-12">
          <section>
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Lock size={14} /> 01. Biological Data Sovereignty
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Your cognitive stats and skill vectors are yours alone. We do not
              sell your "Neural Resume" data to third-party entities. All data
              is encrypted and stored in your private Firebase instance.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Eye size={14} /> 02. Transparency & Synthesis
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              We use anonymized quiz data to tune our Gemini-powered generation
              engine. This ensures the difficulty curves remain precise across
              the entire network without compromising individual identity.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black text-green-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <FileText size={14} /> 03. Agentic Boundaries
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              The Neuro-Mentor agent only access the current quiz context to
              provide feedback. It does not have access to your personal
              filesystem or external private documents unless explicitly
              uploaded for synthesis.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
            Latest Amendment: Feb 2026 // Version 5.0.1
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
