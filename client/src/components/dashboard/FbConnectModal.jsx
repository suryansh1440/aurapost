import React from "react";
import { Icons } from "../../utils/dashboardData";

const FbConnectModal = ({ onClose, onConnect }) => {
  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-icon" style={{ background: "rgba(57,255,20,0.15)", color: "#39FF14" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </div>
        <h3 className="modal-title">Connect Facebook Account</h3>
        <p className="modal-sub">
          AuraPost needs access to your Facebook account to manage pages, post content, and read insights.
        </p>

        <ul className="perm-list">
          <li className="perm-item">
            <div className="perm-check">✓</div>
            <span>Manage your Pages and publish as Pages</span>
          </li>
          <li className="perm-item">
            <div className="perm-check">✓</div>
            <span>Read content posted on the Page</span>
          </li>
          <li className="perm-item">
            <div className="perm-check">✓</div>
            <span>Read user content on your Page</span>
          </li>
          <li className="perm-item">
            <div className="perm-check">✓</div>
            <span>Show a list of the Pages you manage</span>
          </li>
        </ul>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button className="btn-ghost" onClick={onClose} style={{ justifyContent: "center" }}>
            Cancel
          </button>
          <button className="btn-accent" onClick={onConnect} style={{ justifyContent: "center" }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FbConnectModal;
