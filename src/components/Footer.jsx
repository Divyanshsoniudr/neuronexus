import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import NeuralLogo from "./NeuralLogo";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] pt-16 pb-12 px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="group-hover:rotate-12 transition-transform duration-500">
                <NeuralLogo size={40} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase font-syne text-white">
                QuizMaster
              </span>
            </Link>
            <p className="text-white/70 max-w-sm leading-relaxed font-medium text-sm">
              The fastest way to prepare for your exams. Turn your notes into
              custom AI quizzes instantly.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Github, href: "https://github.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-white/60 hover:text-indigo-400 hover:border-indigo-400/30 transition-all font-bold"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-6 font-syne">
              RESOURCES
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Features", path: "/features" },
                { label: "Create Quiz", path: "/generator" },
                { label: "My Progress", path: "/dashboard" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-bold text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-6 font-syne">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About", path: "/about" },
                { label: "Contact Us", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm font-bold text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
          <div className="text-xs font-black tracking-[0.4em] uppercase text-white/40 font-syne">
            © 2026 QuizMaster AI // Mastery Pursuit
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
