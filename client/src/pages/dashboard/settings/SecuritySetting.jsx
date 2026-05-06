import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

const SecuritySetting = () => {
  const { changePassword, isChangingPassword } = useAuthStore();
  const [showPassForm, setShowPassForm] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const res = await changePassword(passwords.oldPassword, passwords.newPassword);
    if (res?.success) {
      setShowPassForm(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="flex flex-col gap-10 w-full max-w-4xl"
    >
      <div>
        <h2 className="text-[28px] font-bold text-white mb-2">Security & Privacy</h2>
        <p className="text-[15px] text-muted leading-relaxed">Manage your credentials, secure your account, and track active sessions.</p>
      </div>

      {/* Password Section */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ghost/90 px-1">Login Credentials</h3>
        <div className={`p-8 rounded-2xl bg-[#0F0F0F] border ${showPassForm ? "border-[#39FF14]/30" : "border-[#1C1C1C]"} transition-all duration-300 shadow-xl`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-white font-bold text-[18px]">Password</div>
              <p className="text-muted text-[14px] mt-1">Change your password to maintain account security.</p>
            </div>
            {!showPassForm && (
              <button 
                onClick={() => setShowPassForm(true)}
                className="px-6 py-2.5 bg-[#1C1C1C] text-white text-[13px] font-bold rounded-xl hover:bg-[#252525] border border-[#2A2A2A] transition-all"
              >
                Update Password
              </button>
            )}
          </div>

          <AnimatePresence>
            {showPassForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#1C1C1C]">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[11px] font-bold text-ghost/70 uppercase tracking-widest px-1">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                      className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-ghost/70 uppercase tracking-widest px-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-ghost/70 uppercase tracking-widest px-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3.5 text-white outline-none focus:border-[#39FF14]/50 focus:bg-[#0F0F0F] transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#1C1C1C]">
                  <button 
                    type="button"
                    onClick={() => setShowPassForm(false)}
                    className="px-6 py-2.5 text-muted hover:text-white font-semibold text-[14px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isChangingPassword}
                    className="btn-neon px-8 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ghost/90 px-1">Security Monitoring</h3>
        <div className="rounded-2xl border border-[#1C1C1C] overflow-hidden bg-[#0F0F0F] shadow-lg">
          <div className="p-6 flex items-center justify-between border-b border-[#1C1C1C]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div>
                <div className="text-[15px] font-bold text-white">Windows Desktop • Chrome</div>
                <div className="text-[12px] text-muted">Mumbai, India • Current Session</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#39FF14] bg-[#39FF14]/10 px-3 py-1 rounded-full uppercase tracking-wider">Active Now</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySetting;
