import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, X } from "lucide-react";
import { getBroadcast } from "../services/AdminService";

const BroadcastBanner = () => {
  const [broadcast, setBroadcast] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await getBroadcast();
      if (data && data.active) {
        setBroadcast(data);
        setIsVisible(true);
      } else {
        setBroadcast(null);
      }
    };

    fetchMessage();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchMessage, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!broadcast || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-2 px-12 overflow-hidden"
      >
        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Radio size={14} className="text-emerald-200" />
          </motion.div>
          <span className="flex-1 text-center">{broadcast.message}</span>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 hover:scale-110 transition-transform"
          >
            <X size={14} className="text-emerald-200/50 hover:text-white" />
          </button>
        </div>
        {/* Decorative scanning line */}
        <motion.div
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-32 bg-white/20 blur-xl -skew-x-12"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default BroadcastBanner;
