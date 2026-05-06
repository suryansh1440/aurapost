import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

const AccountSetting = () => {
  const { user, deactivateAccount, isDeactivatingAccount, deleteAccount, isDeletingAccount, exportUserData, isExportingData } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleDeactivate = async () => {
    if (window.confirm(`Are you sure you want to ${user?.isActive ? 'deactivate' : 'activate'} your account?`)) {
      await deactivateAccount();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmText !== "DELETE MY ACCOUNT") {
      return toast.error("Please type the confirmation phrase exactly.");
    }
    await deleteAccount(deletePassword);
  };

  const ActionCard = ({ title, description, icon, actionText, onAction, isLoading, variant = "normal" }) => (
    <div className={`p-6 rounded-2xl bg-[#0F0F0F] border ${variant === "danger" ? "border-red-500/20" : "border-[#1C1C1C]"} transition-all`}>
      <div className="flex items-start gap-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${variant === "danger" ? "bg-red-500/10 text-red-500" : "bg-[#39FF14]/10 text-[#39FF14]"}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-[16px] mb-0.5">{title}</h3>
          <p className="text-muted text-[13px] leading-relaxed mb-4">{description}</p>
          <button 
            onClick={onAction}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl font-bold text-[12px] transition-all flex items-center gap-2 !border-2 !border-solid ${
              variant === "danger" 
                ? "bg-red-500/10 text-red-500 !border-red-500/60 hover:bg-red-500/20 hover:!border-red-500" 
                : "bg-[#1C1C1C] text-white hover:bg-[#252525] !border-[#4A4A4A] hover:!border-[#666666]"
            }`}
          >
            {isLoading ? "Processing..." : actionText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="flex flex-col gap-10 w-full max-w-4xl pb-20"
    >
      <div>
        <h2 className="text-[28px] font-bold text-white mb-2">Account Ownership</h2>
        <p className="text-[15px] text-muted leading-relaxed">Manage your account status, data portability, and permanent deletion.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ActionCard 
          title="Deactivate Account"
          description={user?.isActive 
            ? "Temporarily disable your account. Your profile and content will be hidden until you log back in."
            : "Your account is currently deactivated. Content is hidden from other users."
          }
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>}
          actionText={user?.isActive ? "Deactivate Now" : "Reactivate Account"}
          onAction={handleDeactivate}
          isLoading={isDeactivatingAccount}
        />

        <ActionCard 
          title="Export My Data"
          description="Download a complete archive of your AuraPost data, including profile info, settings, and workspace activity in JSON format."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
          actionText="Export Data (.json)"
          onAction={exportUserData}
          isLoading={isExportingData}
        />

        <ActionCard 
          title="Transfer Ownership"
          description="Move your primary account ownership or workspace administrative rights to a different email address."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>}
          actionText="Start Transfer"
          onAction={() => toast.success("Ownership transfer flow coming soon!")}
        />

        <div className="mt-4">
          <ActionCard 
            title="Delete Account"
            description="Permanently delete your account and all associated data. This action is destructive and cannot be undone."
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>}
            actionText="Delete Permanently"
            onAction={() => setShowDeleteConfirm(true)}
            variant="danger"
          />
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0F0F0F] border border-red-500/30 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-[22px] font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-muted text-[14px] mb-6 leading-relaxed">
                This will permanently delete your account and all data. Please type <span className="text-white font-mono font-bold">DELETE MY ACCOUNT</span> and enter your password to confirm.
              </p>

              <form onSubmit={handleDelete} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Type the confirmation phrase"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3 text-white outline-none focus:border-red-500/50 transition-all"
                />
                {user?.authProvider === 'EMAIL' && (
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl px-5 py-3 text-white outline-none focus:border-red-500/50 transition-all"
                  />
                )}
                
                <div className="flex gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 bg-[#1C1C1C] text-white font-bold rounded-xl hover:bg-[#252525] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isDeletingAccount}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                  >
                    {isDeletingAccount ? "Deleting..." : "Delete Now"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountSetting;
