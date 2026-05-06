import React from "react";
import { useParams } from "react-router-dom";

const WsCreate = () => {
  const { wsId } = useParams();

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Create Content</h1>
          <div className="topbar-sub">What would you like to build today?</div>
        </div>
      </div>
      
      <div className="create-flow">
        <div className="mode-card">
          <div className="mode-icon">🤖</div>
          <div className="mode-title">AI Video Generation</div>
          <div className="mode-desc">Generate talking avatars or faceless videos from a text prompt. Connects with Fal.ai and HeyGen.</div>
        </div>
        <div className="mode-card">
          <div className="mode-icon">📝</div>
          <div className="mode-title">Smart Captions</div>
          <div className="mode-desc">Generate engaging Instagram captions, hashtags, and threads optimized for your brand voice.</div>
        </div>
        <div className="mode-card">
          <div className="mode-icon">🎨</div>
          <div className="mode-title">Image Studio</div>
          <div className="mode-desc">Create AI image assets, thumbnails, or product mockups using custom trained models.</div>
        </div>
        <div className="mode-card">
          <div className="mode-icon">✨</div>
          <div className="mode-title">Idea Generator</div>
          <div className="mode-desc">Brainstorm viral hooks and content series based on current trending topics.</div>
        </div>
      </div>
    </div>
  );
};

export default WsCreate;
