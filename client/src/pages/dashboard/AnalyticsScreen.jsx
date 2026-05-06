import React from "react";
import BarChart from "../../components/dashboard/BarChart";

const AnalyticsScreen = () => {
  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Analytics & Insights</h1>
          <div className="topbar-sub">Performance across all your workspaces.</div>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">Audience Growth</div>
        <div className="metric-row">
          <div className="metric-block">
            <div className="metric-label">Total Followers</div>
            <div className="metric-val">485.2K</div>
            <div className="metric-trend up">↑ +12.4% vs last month</div>
          </div>
          <div className="metric-block">
            <div className="metric-label">Engagement Rate</div>
            <div className="metric-val">4.8%</div>
            <div className="metric-trend up">↑ +0.6% vs last month</div>
          </div>
          <div className="metric-block">
            <div className="metric-label">Content Reach</div>
            <div className="metric-val">2.1M</div>
            <div className="metric-trend down">↓ -2.1% vs last month</div>
          </div>
        </div>
        <div style={{ height: "200px", marginTop: "2rem", display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <BarChart data={[20,35,25,50,45,70,85,60,90,75,100,85]} color="#39FF14" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
