import React from "react";
import { useParams } from "react-router-dom";
import { Icons, trendingTopics } from "../../../utils/dashboardData";

const WsTrends = () => {
  const { wsId } = useParams();

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Trending Ideas</h1>
          <div className="topbar-sub">AI-curated topics currently performing well in your niche.</div>
        </div>
      </div>
      
      <div className="card">
        <div className="tabs">
          <div className="tab active">Instagram Reels</div>
          <div className="tab">TikTok</div>
          <div className="tab">YouTube Shorts</div>
        </div>
        
        <div>
          {trendingTopics.map((trend, i) => (
            <div className="sched-row" key={i} style={{ gridTemplateColumns: "2fr 1fr 1fr auto" }}>
              <div style={{ fontWeight: 500, color: "#fff" }}>{trend.topic}</div>
              <div style={{ color: "#8b87a8", fontSize: "12px" }}>Est. Reach: <strong style={{ color: "#c8c4e0" }}>{trend.reach}</strong></div>
              <div>
                <div className="progress-bar-track" style={{ width: "80px", display: "inline-block", margin: 0, verticalAlign: "middle" }}>
                  <div className="progress-bar-fill" style={{ width: `${trend.score}%`, background: trend.color }}></div>
                </div>
                <span style={{ fontSize: "11px", color: "#8b87a8", marginLeft: "8px" }}>{trend.score}/100</span>
              </div>
              <div>
                <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: "11px" }}>Use Idea</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WsTrends;
