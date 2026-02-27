import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Sparkles,
  Search,
  Settings,
  Shield,
  User,
  Zap,
  DraftingCompass,
  Scroll,
  Menu,
  X,
  LogOut,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import NeuralLogo from "./NeuralLogo";
import { NEURAL_MENTORS } from "../services/NeuralMentors";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, currentQuiz, role } = useStore();

  const navItems = [
    {
      icon: Grid,
      label: "My Progress",
      path: "/dashboard",
      hidden: !user,
    },
    { icon: Search, label: "Explore Lessons", path: "/hub" },
    { icon: Scroll, label: "Create Quiz", path: "/generator" },
    { icon: Bot, label: "Practice Test", path: "/interview", hidden: !user },
    {
      icon: Shield,
      label: "Audit",
      path: "/audit",
      hidden: !user || (role !== "admin" && role !== "moderator"),
    },
    {
      icon: Settings,
      label: "Admin",
      path: "/admin",
      hidden: !user || role !== "admin",
    },
  ];

  if (currentQuiz && currentQuiz.length > 0) {
    navItems.push({
      icon: Zap,
      label: "Current Quiz",
      path: "/quiz",
      special: true,
    });
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 backdrop-blur-3xl bg-black/40 border-b border-white/5 flex items-center px-6 md:px-12 justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <NeuralLogo
            size={48}
            className="group-hover:rotate-12 transition-transform duration-500"
          />
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black tracking-tighter uppercase text-white leading-none font-syne">
              NeuroNexus
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="hidden md:block text-[8px] font-black tracking-[0.4em] text-indigo-500/60 uppercase leading-none font-syne">
                Study Smart
              </span>
              <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">
                  {NEURAL_MENTORS.length} Tutors Online
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems
            .filter((item) => !item.hidden)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 relative group font-outfit ${
                  location.pathname === item.path
                    ? "text-white font-bold"
                    : item.special
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] font-bold animate-pulse"
                      : "text-white/30 hover:text-white font-medium"
                }`}
              >
                <item.icon
                  size={18}
                  className={
                    location.pathname === item.path
                      ? "text-indigo-400"
                      : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="text-xs uppercase font-black tracking-[0.2em]">
                  {item.label}
                </span>
              </Link>
            ))}

          {user ? (
            <div className="flex items-center gap-6 pl-4 border-l border-white/5">
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full border border-white/10 p-0.5 overflow-hidden hover:border-indigo-500/50 transition-all shadow-lg"
              >
                <img
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-8 py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/10"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems
                .filter((item) => !item.hidden)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-6 p-4 rounded-2xl border transition-all ${
                      location.pathname === item.path
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-transparent text-white/40"
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="text-xl font-black uppercase tracking-widest font-syne">
                      {item.label}
                    </span>
                  </Link>
                ))}

              {user ? (
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                      <img
                        src={
                          user.photoURL ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">
                        {user.displayName || "Learner"}
                      </span>
                      <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                        My Account
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await signOut();
                      navigate("/");
                    }}
                    className="flex items-center justify-between p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest"
                  >
                    Sign Out <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 p-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
