import React from "react";
import { useParams } from "react-router-dom";
import { Icons, characters } from "../../../utils/dashboardData";

const WsCharacters = () => {
  const { wsId } = useParams();

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">AI Characters</h1>
          <div className="topbar-sub">Manage digital avatars and personas for this workspace.</div>
        </div>
        <div className="topbar-actions">
          <button className="btn-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={Icons.plus} />
            </svg>
            Train New Character
          </button>
        </div>
      </div>
      
      <div className="char-grid">
        {characters.map((char, i) => (
          <div className="char-card" key={i}>
            <div className="char-avatar" style={{ background: char.color }}>{char.emoji}</div>
            <div className="char-name">{char.name}</div>
            <div className="char-type">{char.type}</div>
            <div className="char-tags">
              {char.tags.map(tag => (
                <span className="tag" key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="char-card" style={{ borderStyle: "dashed", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px" }}>
          <div style={{ fontSize: "24px", color: "#8b87a8", marginBottom: "0.5rem" }}>+</div>
          <div style={{ color: "#fff", fontWeight: 500 }}>Create Persona</div>
        </div>
      </div>
    </div>
  );
};

export default WsCharacters;
