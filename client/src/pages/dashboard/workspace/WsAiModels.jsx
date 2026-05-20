import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Icons } from "../../../utils/dashboardData";
import { useAiModelStore } from "../../../store/aiModelStore";

const WsAiModels = () => {
  const { wsId } = useParams();
  const navigate = useNavigate();
  const { aiModels, fetchAiModels, isLoading } = useAiModelStore();

  useEffect(() => {
    if (wsId) {
      fetchAiModels(wsId);
    }
  }, [wsId, fetchAiModels]);

  useEffect(() => {
    let interval;
    if (aiModels.some(char => char.isGenerating)) {
      interval = setInterval(() => {
        fetchAiModels(wsId, true);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiModels, wsId, fetchAiModels]);

  return (
    <div className="fade-in">
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">AI Models</h1>
          <div className="topbar-sub">Manage and train AI-powered personas for this workspace.</div>
        </div>
      </div>
      
      <div className="char-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {/* Create New Model Card (Portrait) */}
        <div 
          className="char-card create-card" 
          onClick={() => navigate(`/dashboard/workspaces/${wsId}/ai-models/generate`)}
          style={{ 
            borderStyle: "dashed", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "320px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderColor: "rgba(255,255,255,0.15)",
            background: "rgba(18,16,30,0.4)"
          }}
        >
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "50%", 
            background: "rgba(57,255,20,0.08)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: "1rem",
            border: "1px solid rgba(57,255,20,0.2)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.plus} />
            </svg>
          </div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>Create AI Model</div>
          <div style={{ color: "var(--color-dim)", fontSize: "12px", marginTop: "6px", textAlign: "center", padding: "0 20px" }}>
            Add a new persona to your content arsenal
          </div>
        </div>

        {/* Real Models from Backend */}
        {isLoading ? (
          // Skeleton loaders
          [1,2,3].map(i => (
            <div key={i} className="char-card" style={{ minHeight: "320px", background: "rgba(18,16,30,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", animation: "pulse 1.5s infinite" }} />
          ))
        ) : (
          aiModels.map((char, i) => (
            <div 
              className="char-card" 
              key={char._id || i} 
              onClick={() => navigate(`/dashboard/workspaces/${wsId}/ai-models/${char._id}`)}
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                padding: "0", 
                overflow: "hidden", 
                minHeight: "320px",
                background: "rgba(18,16,30,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                cursor: "pointer"
              }}
            >
              {/* Top: Model Image/Avatar Area */}
              <div style={{ 
                height: "180px", 
                width: "100%", 
                background: "rgba(57,255,20,0.05)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                position: "relative"
              }}>
                {char.isGenerating ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(232,184,75,0.2)", borderTop: "2px solid #e8b84b", animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: 11, color: "#e8b84b", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Crafting Details...</span>
                  </div>
                ) : char.profilePhotoUrl ? (
                  <img src={char.profilePhotoUrl} alt={char.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "48px" }}>👤</span>
                )}
                <div style={{ 
                  position: "absolute", 
                  bottom: "12px", 
                  right: "12px",
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "10px",
                  color: "#fff",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {char.nationality || char.type}
                </div>
              </div>

              {/* Bottom: Info Area */}
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="char-name" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>{char.name}</div>
                <div style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "1rem", lineHeight: "1.4" }}>
                  {char.niche?.join(", ") || char.type} Model • {char.ageRange} • {char.gender}
                </div>
                
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {char.isGenerating ? (
                    <div style={{ fontSize: "11px", color: "#e8b84b", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                       <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e8b84b", animation: "pulse 1.5s infinite" }} />
                       Generating Persona...
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: "11px", color: "var(--color-neon)", fontWeight: 600 }}>
                        {char.completionScore}% Setup
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {char.stats?.postsGenerated > 0 && (
                          <span style={{ fontSize: "10px", color: "var(--color-dim)" }}>{char.stats.postsGenerated} posts</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WsAiModels;
