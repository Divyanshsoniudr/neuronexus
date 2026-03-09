import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Zap,
  Target,
  LogOut,
  Activity,
  Settings,
  UserCircle,
  ArrowRight,
  Database,
  Lock,
  Trash2,
  Edit,
  CheckCircle,
  Map,
  X,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { useStore } from "../store/useStore";
import SEO from "../components/SEO";

const Profile = () => {
  const {
    user,
    roadmapProgress,
    signOut,
    updatePassword,
    updateProfile,
    deleteAccount,
    role,
    savedQuizzes,
    fetchSavedQuizzes,
    loadQuizToFlashcards,
  } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState(user?.displayName || "");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");

  React.useEffect(() => {
    if (user && activeTab === "vault") {
      fetchSavedQuizzes();
    }
  }, [user, activeTab, fetchSavedQuizzes]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(newName);
      setIsEditing(false);
      setStatus({ type: "success", msg: "Profile updated!" });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6)
      return setStatus({ type: "error", msg: "Min 6 chars" });
    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setStatus({ type: "success", msg: "Password changed!" });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      navigate("/");
    } catch (e) {
      setStatus({ type: "error", msg: "Re-login required to delete." });
    }
  };

  const completedTotal = Object.values(roadmapProgress).flat().length;
  const level =
    completedTotal > 50 ? "Elite" : completedTotal > 20 ? "Expert" : "Beginner";

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 md:px-6 overflow-x-hidden">
      <SEO
        title="My Account"
        description="Manage your NeuronNexus profile and view your study progress."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Avatar Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-20 pointer-events-none" />

            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30"
              />
              <div className="absolute inset-1 rounded-full border-2 border-indigo-500/10 p-0.5 bg-[#050505]">
                <img
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                  }
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Name / Edit */}
            {isEditing ? (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-center text-sm"
                  placeholder="Display Name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 py-2 bg-indigo-500 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 bg-white/10 text-white/80 rounded-lg font-black uppercase text-[10px] tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-lg font-black text-white uppercase tracking-tight italic flex items-center justify-center gap-2">
                  {user.displayName || "Explorer"}
                  <Edit
                    size={13}
                    className="text-white/40 hover:text-indigo-400 cursor-pointer transition-colors"
                    onClick={() => setIsEditing(true)}
                  />
                </h2>
                <p className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-3">
                  {user.email}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                    role === "admin"
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : role === "moderator"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/70"
                  }`}
                >
                  <Shield size={9} /> {role || "Learner"}
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={13} /> Sign Out
            </button>

            <AnimatePresence>
              {status.msg && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 p-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {status.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account Settings Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-5 flex items-center gap-2">
              <Settings size={12} className="text-indigo-400" />
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block">
                  Change Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-white/5 border border-white/10 hover:border-indigo-500/30 rounded-xl px-4 py-3 text-xs font-bold text-white transition-all outline-none pr-12"
                  />
                  <button
                    onClick={handleUpdatePassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-500 text-white hover:bg-white hover:text-black transition-all"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-red-500/50 mb-3 flex items-center gap-2">
                  <Trash2 size={11} /> Danger Zone
                </h4>
                {showDeleteConfirm ? (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-3 italic">
                      Confirm data wipe?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 bg-white/10 text-white/80 rounded-lg font-black uppercase text-[9px] tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-[9px] font-black uppercase tracking-widest italic"
                  >
                    Delete All My Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Main Content Area ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit mb-4">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "progress"
                  ? "bg-indigo-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "vault"
                  ? "bg-emerald-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              My Vault
            </button>
          </div>

          {activeTab === "progress" ? (
            <>
              {/* Goals Reached Hero */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />

                <div className="relative flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                    <Activity size={11} /> Goals Reached
                  </div>
                  <div className="text-[clamp(4rem,15vw,8rem)] font-black text-white leading-none tracking-tighter mb-3 italic">
                    <span className="relative z-10">{completedTotal}</span>
                  </div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em]">
                    Goals reached &amp; saved online
                  </p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                    <Map size={12} /> Subjects
                  </h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-black mb-1 text-white tabular-nums tracking-tighter italic">
                        {Object.keys(roadmapProgress).length}
                      </div>
                      <p className="text-white/50 text-[9px] font-black uppercase tracking-widest">
                        Started
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Activity size={20} />
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group overflow-hidden">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                    <CheckCircle size={12} /> My Level
                  </h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black mb-1 text-white uppercase tracking-tighter italic leading-none">
                        {level}
                      </div>
                      <p className="text-white/50 text-[9px] font-black uppercase tracking-widest">
                        Your Level
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                      <Zap size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {savedQuizzes.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-3xl border border-white/5">
                  <Bookmark size={32} className="mx-auto text-white/20 mb-4" />
                  <h3 className="text-sm font-black text-white/50 uppercase tracking-widest">
                    Vault is Empty
                  </h3>
                  <p className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">
                    Generate and save quizzes to review them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col h-full bg-white/[0.01]"
                    >
                      <div className="mb-6 flex-1">
                        <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest rounded-lg mb-3">
                          {quiz.difficulty} • {quiz.questions?.length || 0} Qs
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider leading-relaxed">
                          {quiz.title}
                        </h4>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-2">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          loadQuizToFlashcards(quiz.id);
                          navigate("/flashcards");
                        }}
                        className="w-full py-3 bg-white/5 border border-white/10 hover:bg-emerald-500 text-white hover:border-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group"
                      >
                        <BookOpen
                          size={13}
                          className="group-hover:scale-110 transition-transform"
                        />{" "}
                        Study Flashcards
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
