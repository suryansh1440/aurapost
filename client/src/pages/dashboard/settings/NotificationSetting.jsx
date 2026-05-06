import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-hot-toast";

const NotificationSetting = () => {
  const { user, updateNotificationPreferences, isUpdatingNotifications } = useAuthStore();
  
  const [preferences, setPreferences] = useState({
    email: { marketing: true, security: true, updates: true },
    push: { activity: true, reminders: true },
    sms: { alerts: false }
  });

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences(user.notificationPreferences);
    }
  }, [user]);

  const handleToggle = (category, setting) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSave = async () => {
    await updateNotificationPreferences(preferences);
  };

  const NotificationToggle = ({ category, setting, title, description }) => (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0F0F0F] border border-[#1C1C1C] hover:border-[#2A2A2A] transition-all group">
      <div className="flex-1 pr-8">
        <h4 className="text-white font-bold text-[16px] mb-1 group-hover:text-[#39FF14] transition-colors">{title}</h4>
        <p className="text-muted text-[13px] leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${preferences[category][setting] ? "text-[#39FF14]" : "text-muted/40"}`}>
          {preferences[category][setting] ? "On" : "Off"}
        </span>
        <button 
          onClick={() => handleToggle(category, setting)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none !border-2 !border-solid ${
            preferences[category][setting] 
              ? "bg-[#39FF14] !border-[#39FF14]" 
              : "bg-[#0A0A0A] !border-[#2A2A2A]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300 ease-in-out ${
              preferences[category][setting] 
                ? "translate-x-8 bg-black scale-110" 
                : "translate-x-1.5 bg-[#444] scale-100"
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="flex flex-col gap-10 w-full max-w-4xl pb-10"
    >
      <div>
        <h2 className="text-[28px] font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-[15px] text-muted leading-relaxed">Choose how and when you want to be notified about activity in AuraPost.</p>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ghost/90 px-1">Email Notifications</h3>
        <div className="grid grid-cols-1 gap-4">
          <NotificationToggle 
            category="email" 
            setting="updates" 
            title="Product Updates" 
            description="News about new features and improvements to AuraPost." 
          />
          <NotificationToggle 
            category="email" 
            setting="security" 
            title="Security Alerts" 
            description="Important notifications about account security and sign-in activity." 
          />
          <NotificationToggle 
            category="email" 
            setting="marketing" 
            title="Marketing & Tips" 
            description="Tips on how to use AuraPost and occasional special offers." 
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ghost/90 px-1">Push Notifications</h3>
        <div className="grid grid-cols-1 gap-4">
          <NotificationToggle 
            category="push" 
            setting="activity" 
            title="Workspace Activity" 
            description="Notifications for mentions, comments, and project updates." 
          />
          <NotificationToggle 
            category="push" 
            setting="reminders" 
            title="Scheduled Reminders" 
            description="Alerts for upcoming scheduled posts and deadlines." 
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ghost/90 px-1">SMS Notifications</h3>
        <div className="grid grid-cols-1 gap-4">
          <NotificationToggle 
            category="sms" 
            setting="alerts" 
            title="Critical Alerts" 
            description="Emergency notifications and urgent account issues via text message." 
          />
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-[#1C1C1C] flex justify-end gap-5">
        <button 
          onClick={() => setPreferences(user?.notificationPreferences || preferences)}
          className="px-6 py-3 text-muted hover:text-white transition-all font-semibold text-[15px]"
        >
          Reset to Default
        </button>
        <button 
          onClick={handleSave}
          disabled={isUpdatingNotifications}
          className="btn-neon px-10 py-3 rounded-xl font-bold text-[15px] disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-[#39FF14]/10 hover:shadow-[#39FF14]/20"
        >
          {isUpdatingNotifications ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : "Save Preferences"}
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationSetting;
