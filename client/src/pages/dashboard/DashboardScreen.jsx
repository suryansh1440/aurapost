import React from "react";
import { Icons, recentActivity } from "../../utils/dashboardData";
import { useAuthStore } from "../../store/authStore";

const DashboardScreen = () => {
  const {user} = useAuthStore();
  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Welcome back, {user?.name || "User"}</h1>
          <div className="topbar-sub">Here's what's happening with your accounts today.</div>
        </div>
        <div className="topbar-actions">
          <button className="btn-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.calendar} />
            </svg>
            Last 30 Days
          </button>
          <button className="btn-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.plus} />
            </svg>
            Quick Post
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Reach</div>
          <div className="stat-value">2.4M</div>
          <div className="stat-delta delta-up">↑ 12.5% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Workspaces</div>
          <div className="stat-value">3</div>
          <div className="stat-delta delta-up">↑ 1 new</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Posts Scheduled</div>
          <div className="stat-value">34</div>
          <div className="stat-delta delta-down">↓ 4 vs last week</div>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(57,255,20,0.1), rgba(45,203,150,0.05))", borderColor: "rgba(57,255,20,0.2)" }}>
          <div className="stat-label" style={{ color: "#39FF14" }}>AI Generation</div>
          <div className="stat-value">1,420 <span style={{ fontSize: "14px", fontWeight: 500, color: "#8b87a8" }}>credits</span></div>
          <div className="stat-delta" style={{ color: "#39FF14" }}>Auto-refills in 4 days</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">
            Recent Activity
            <span className="card-link">View all</span>
          </div>
          <div>
            {recentActivity.map((act, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" style={{ background: act.color }}></div>
                <div>
                  <div className="activity-text">{act.text}</div>
                  <div className="activity-time">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            Quick Actions
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="mode-card" style={{ padding: "1.2rem", textAlign: "center" }}>
              <div className="mode-icon">🤖</div>
              <div className="mode-title" style={{ fontSize: "14px" }}>Generate Script</div>
            </div>
            <div className="mode-card" style={{ padding: "1.2rem", textAlign: "center" }}>
              <div className="mode-icon">🎥</div>
              <div className="mode-title" style={{ fontSize: "14px" }}>Create Video</div>
            </div>
            <div className="mode-card" style={{ padding: "1.2rem", textAlign: "center" }}>
              <div className="mode-icon">👩‍🦰</div>
              <div className="mode-title" style={{ fontSize: "14px" }}>New Character</div>
            </div>
            <div className="mode-card" style={{ padding: "1.2rem", textAlign: "center" }}>
              <div className="mode-icon">📈</div>
              <div className="mode-title" style={{ fontSize: "14px" }}>View Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
