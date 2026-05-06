import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SettingsScreen = () => {
  const tabs = [
    { id: "profile", path: "profile", label: "Personal Details", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ), desc: "Name, bio, and contact info" },
    { id: "security", path: "security", label: "Password and Security", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ), desc: "Password and 2FA" },
    { id: "notifications", path: "notifications", label: "Notifications", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ), desc: "Email preferences" },
    { id: "billing", path: "billing", label: "Billing and Payments", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ), desc: "Manage your plan" },
    { id: "integrations", path: "integrations", label: "Connected Apps", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ), desc: "Social platform access" },
    { id: "deletion", path: "account", label: "Account Ownership", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    ), desc: "Manage deletion" },
  ];

  return (
    <div className="fade-in w-full h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-[32px] font-bold text-ghost tracking-tight mb-2">Settings</h1>
        <p className="text-dim">Configure your personal and professional account preferences.</p>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-8 lg:gap-16 min-h-0">
        {/* Sidebar - Scrollable */}
        <div className="w-full lg:w-[320px] flex flex-col gap-1.5 flex-shrink-0 overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-dimmer mb-4 px-4">Account Center</div>
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.path === "profile"}
              className={({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group text-left ${
                isActive ? "bg-[#0F0F0F] border border-[#1C1C1C]" : "hover:bg-[#0F0F0F]/50 border border-transparent"
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? "bg-[#39FF14]/10 text-[#39FF14]" : "bg-[#111] text-dim group-hover:text-ghost"
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold transition-colors ${
                      isActive ? "text-ghost" : "text-dim group-hover:text-ghost"
                    }`}>{tab.label}</div>
                    <div className="text-[11px] text-dimmer truncate mt-0.5">{tab.desc}</div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-4 pb-20 custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
