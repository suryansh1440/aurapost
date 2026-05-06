import React from "react";
import { useParams } from "react-router-dom";
import { Icons, postQueue } from "../../../utils/dashboardData";

const WsPosts = () => {
  const { wsId } = useParams();

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Post Queue</h1>
          <div className="topbar-sub">Manage upcoming and published content for this workspace.</div>
        </div>
        <div className="topbar-actions">
          <button className="btn-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.calendar} />
            </svg>
            Calendar View
          </button>
          <button className="btn-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.plus} />
            </svg>
            Schedule Post
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="tabs">
          <div className="tab active">Upcoming</div>
          <div className="tab">Drafts</div>
          <div className="tab">Published</div>
          <div className="tab">Failed</div>
        </div>
        
        <div>
          {postQueue.map((post, i) => (
            <div className="post-item" key={i}>
              <div className="post-thumb" style={{ background: "rgba(255,255,255,0.05)" }}>{post.emoji}</div>
              <div className="post-info">
                <div className="post-caption">{post.caption}</div>
                <div className="post-meta">{post.time} • {post.account}</div>
              </div>
              <div className={`post-status status-${post.status}`}>
                {post.status}
              </div>
              <div style={{ marginLeft: "12px" }}>
                <button className="btn-ghost" style={{ padding: "4px", borderRadius: "6px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WsPosts;
