import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Send,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import SEO from "../components/SEO";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Web3Forms integration
    const formData = new FormData(e.target);

    // It's best practice to keep this key in your .env file as VITE_WEB3FORMS_KEY
    // You can get a free key at https://web3forms.com/
    const accessKey =
      import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please check your access key.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6">
      <SEO
        title="Contact Us"
        description="Have questions or feedback? Reach out to the QuizMaster team."
      />

      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <MessageSquare size={12} />
          Support Center
        </div>
        <h1 className="text-7xl font-black mb-6 tracking-tighter leading-[0.9] text-white">
          WE'RE HERE <br /> TO{" "}
          <span className="text-gradient uppercase">HELP.</span>
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto font-medium">
          Have questions about your account? Found a bug? Just want to say
          hello? Drop us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
        <div className="space-y-8">
          <div className="p-8 rounded-[32px] glass-panel border border-white/5">
            <Mail className="text-indigo-400 mb-6" size={24} />
            <div className="text-sm font-black text-white/70 uppercase tracking-widest mb-1">
              Email Support
            </div>
            <div className="text-xl font-bold text-white">
              support@quizmaster.ai
            </div>
          </div>
          <div className="p-8 rounded-[32px] glass-panel border border-white/5">
            <Zap className="text-emerald-400 mb-6" size={24} />
            <div className="text-sm font-black text-white/70 uppercase tracking-widest mb-1">
              Response Time
            </div>
            <div className="text-xl font-bold text-white">Under 24 Hours</div>
          </div>
        </div>

        <div className="p-12 rounded-[48px] glass-panel border border-white/5 relative overflow-hidden">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase">
                Message Sent!
              </h2>
              <p className="text-white/90 font-medium mb-8">
                We've received your inquiry and will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors flex items-center gap-2"
              >
                Send Another Message <ArrowRight size={14} />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-4">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                    placeholder="Alex Hormozi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-4">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                    placeholder="alex@gmail.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-4">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  placeholder="How can we help you?"
                />
              </div>

              {/* Optional: Add a honeypot field to prevent spam bots */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
              />

              <button
                disabled={isSubmitting}
                className={`w-full py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-500 hover:text-white"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}{" "}
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
