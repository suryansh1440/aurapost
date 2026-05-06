import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Icons, recentActivity } from "../../../utils/dashboardData";
import { useWorkspaceStore } from "../../../store/workspaceStore";
import FbConnectModal from "../../../components/dashboard/FbConnectModal";

const WsDashboard = () => {
  const { wsId } = useParams();
  const [showFbModal, setShowFbModal] = useState(false);
  
  const { workspaces } = useWorkspaceStore();
  
  const currentWs = workspaces.find(w => w._id === wsId);

  if (!currentWs) {
    return <div className="main-content" style={{ color: "#fff" }}>Workspace not found</div>;
  }

  return (
    <>
      <div className="fade-in">
        <div className="ws-header">
          <div className="ws-header-thumb" style={{ background: currentWs.bg }}>
            {currentWs.workspaceLogo ? (
              <img src={currentWs.workspaceLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
            ) : (
              currentWs.emoji
            )}
          </div>
          <div>
            <div className="ws-header-name">{currentWs.name}</div>
            <div className="ws-header-meta">Pro Plan • Created Jan 2025</div>
          </div>
          <div className="ws-header-actions">
            {currentWs.status === 'connected' ? (
              <div className="conn-badge connected">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={Icons.check} />
                </svg>
                Meta Connected
              </div>
            ) : (
              <div className="conn-badge disconnected" onClick={() => setShowFbModal(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={Icons.link} />
                </svg>
                Connect Meta
              </div>
            )}
            <button className="btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.settings} />
              </svg>
              Manage
            </button>
          </div>
        </div>

        <div className="qa-grid">
          <div className="qa-item">
            <div className="qa-icon" style={{ background: "rgba(57,255,20,0.12)", color: "#39FF14" }}>✨</div>
            <div className="qa-label">Generate Ideas</div>
            <div className="qa-sub">AI brainstorming</div>
          </div>
          <div className="qa-item">
            <div className="qa-icon" style={{ background: "rgba(162,155,254,0.12)", color: "#a29bfe" }}>📝</div>
            <div className="qa-label">Write Script</div>
            <div className="qa-sub">Captions & threads</div>
          </div>
          <div className="qa-item">
            <div className="qa-icon" style={{ background: "rgba(116,185,255,0.12)", color: "#74b9ff" }}>🎥</div>
            <div className="qa-label">Create Video</div>
            <div className="qa-sub">Avatars & voice</div>
          </div>
          <div className="qa-item">
            <div className="qa-icon" style={{ background: "rgba(0,212,170,0.12)", color: "#00d4aa" }}>📅</div>
            <div className="qa-label">Schedule Post</div>
            <div className="qa-sub">Queue to social</div>
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-title">Connected Accounts</div>
            {currentWs.status === 'connected' ? (
              <>
                <div className="ig-account">
                  <div className="ig-pfp" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "#fff" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="ig-name">Instagram</div>
                    <div className="ig-handle">@brand.official</div>
                  </div>
                  <div className="ig-actions">
                    <div className="tag" style={{ background: "rgba(57,255,20,0.12)", color: "#39FF14" }}>Active</div>
                  </div>
                </div>
                <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }} onClick={() => setShowFbModal(true)}>
                  + Add Another Account
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "1rem" }}>🔗</div>
                <div style={{ color: "#c8c4e0", marginBottom: "1.5rem", fontSize: "14px" }}>No accounts connected yet. Connect Facebook/Instagram to start posting.</div>
                <button className="btn-accent" style={{ margin: "0 auto" }} onClick={() => setShowFbModal(true)}>Connect Meta Account</button>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Recent Activity</div>
            <div>
              {recentActivity.slice(0, 4).map((act, i) => (
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
        </div>
      </div>

      {showFbModal && (
        <FbConnectModal 
          onClose={() => setShowFbModal(false)} 
          onConnect={() => {
            setShowFbModal(false);
            // Simulate connection update in real app
            alert("Facebook Connected! (Simulated)");
          }} 
        />
      )}
    </>
  );
};

export default WsDashboard;
