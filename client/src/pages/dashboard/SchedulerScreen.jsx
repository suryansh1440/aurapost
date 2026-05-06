import React from "react";

const SchedulerScreen = () => {
  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Global Scheduler</h1>
          <div className="topbar-sub">View and manage all upcoming posts.</div>
        </div>
      </div>
      <div className="card">
        <div style={{ textAlign: "center", padding: "3rem", color: "#8b87a8" }}>
          Calendar view coming soon. Select a specific workspace to view its scheduled posts.
        </div>
      </div>
    </div>
  );
};

export default SchedulerScreen;
