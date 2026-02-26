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
  } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState(user?.displayName || "");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <SEO
        title="My Account"
        description="Manage your QuizMaster profile and view your study progress."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12">
        {/* Profile Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="glass-panel p-10 rounded-[48px] border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />

            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30"
              />
              <div className="absolute inset-2 rounded-full border-4 border-indigo-500/10 p-1 bg-background">
                <img
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                  }
                  alt="User"
                  className="w-full h-full rounded-full object-cover shadow-2xl"
                />
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold text-center italic"
                  placeholder="Display Name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 py-2 bg-indigo-500 text-white rounded-lg font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 bg-white/10 text-white/60 rounded-lg font-black uppercase text-xs tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 group">
                <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter leading-none italic flex items-center justify-center gap-3">
                  {user.displayName || "Explorer"}
                  <Edit
                    size={16}
                    className="text-white/50 hover:text-indigo-400 cursor-pointer transition-colors"
                    onClick={() => setIsEditing(true)}
                  />
                </h2>
                <p className="text-indigo-400 font-black uppercase text-xs tracking-[0.3em] mb-4">
                  {user.email}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                    role === "admin"
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : role === "moderator"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/40"
                  }`}
                >
                  <Shield size={10} /> {role || "Learner"}
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full py-5 rounded-3xl bg-white/10 border border-white/10 text-white/60 font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-3 group/out"
            >
              <LogOut
                size={16}
                className="group-hover/out:-translate-x-1 transition-transform"
              />
              Sign Out Account
            </button>

            <AnimatePresence>
              {status.msg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-500"}`}
                >
                  {status.msg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/50 mb-8 flex items-center gap-3">
              <Settings size={14} className="text-indigo-500" />
              Account Settings
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-white/60 block ml-2">
                  Change Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-white/5 border border-white/10 hover:border-indigo-500/30 rounded-2xl px-5 py-4 text-xs font-bold text-white transition-all outline-none"
                  />
                  <button
                    onClick={handleUpdatePassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-indigo-500 text-white hover:bg-white hover:text-black transition-all"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 mb-6 flex items-center gap-3">
                  <Trash2 size={14} /> Danger Zone (Irreversible)
                </h4>
                {showDeleteConfirm ? (
                  <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4 animate-pulse italic">
                      Confirming Data Wipe?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 bg-white/10 text-white/60 rounded-xl font-black uppercase text-xs tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 italic"
                  >
                    Delete All My Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Progress Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >
          <div className="glass-panel p-16 rounded-[64px] border border-white/5 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[140px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[140px] opacity-10 group-hover:opacity-20 transition-opacity" />

            <div className="relative flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-12">
                <Activity size={14} />
                Goals reached
              </div>

              <div className="text-[180px] font-black text-white leading-none tracking-tighter mb-6 relative italic">
                <span className="relative z-10">{completedTotal}</span>
                <span className="absolute inset-0 text-indigo-500 blur-3xl opacity-30 select-none">
                  {completedTotal}
                </span>
              </div>

              <p className="text-white/60 text-xs font-black uppercase tracking-[0.5em] max-w-sm mx-auto">
                Goals reached & saved online
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-12 rounded-[56px] border border-white/5 hover:border-indigo-500/20 transition-all group">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3 italic">
                <Map size={14} /> Subjects I'm Learning
              </h4>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-6xl font-black mb-1 text-white tabular-nums tracking-tighter italic">
                    {Object.keys(roadmapProgress).length}
                  </div>
                  <p className="text-white/50 text-xs font-black uppercase tracking-widest">
                    Subjects Started
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Activity size={32} />
                </div>
              </div>
            </div>

            <div className="glass-panel p-12 rounded-[56px] border border-white/5 hover:border-emerald-500/20 transition-all group">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3 italic">
                <CheckCircle size={14} /> My Level
              </h4>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-6xl font-black mb-1 text-white uppercase tracking-tighter italic">
                    {completedTotal > 50
                      ? "Elite"
                      : completedTotal > 20
                        ? "Expert"
                        : "Beginner"}
                  </div>
                  <p className="text-white/50 text-xs font-black uppercase tracking-widest">
                    Your Level
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Zap size={32} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
