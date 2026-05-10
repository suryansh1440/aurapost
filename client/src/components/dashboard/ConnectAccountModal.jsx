import React, { useState, useEffect } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";

/* ── Platform definitions ─────────────────────────────────── */
const PLATFORMS = [
  {
    id: "meta",
    name: "Meta",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg,#1877f2,#bc1888)",
    accent: "#1877f2",
    description: "Connect a Facebook Page + its linked Instagram Business account.",
    permissions: [
      "Publish as your Page & Instagram",
      "Read insights and analytics",
      "Manage comments and DMs",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    gradient: "linear-gradient(135deg,#0077b5,#005582)",
    accent: "#0077b5",
    description: "Connect your LinkedIn Page or personal profile to share professional content.",
    permissions: [
      "Post on your behalf",
      "Read follower demographics",
      "Access engagement analytics",
    ],
  },
];

/* ── Main Modal ───────────────────────────────────────────── */
const ConnectAccountModal = ({ onClose, onConnect, wsId }) => {
  const { selectMetaPage } = useWorkspaceStore();

  // steps: 'select' | 'confirm' | 'pages'
  const [step, setStep] = useState("select");
  const [selected, setSelected] = useState(null);
  const [pendingMeta, setPendingMeta] = useState(null); // { integrationId, pages }
  const [isConnecting, setIsConnecting] = useState(false);

  // On mount, check if we just came back from a Meta OAuth redirect
  useEffect(() => {
    if (!wsId) return;
    const key = `meta_pending_${wsId}`;
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        sessionStorage.removeItem(key);
        setPendingMeta(data);
        setSelected(PLATFORMS.find(p => p.id === "meta"));
        setStep("pages");
      } catch (e) {
        console.error("Failed to parse pending meta data", e);
      }
    }
  }, [wsId]);

  const handleSelect = (platform) => {
    setSelected(platform);
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("select");
    setSelected(null);
  };

  const handleConnect = () => {
    onConnect(selected?.id);
  };

  const handlePageSelect = async (page) => {
    if (!pendingMeta?.integrationId) return;
    setIsConnecting(true);
    const result = await selectMetaPage(pendingMeta.integrationId, page);
    setIsConnecting(false);
    if (result) {
      onConnect("meta_done", result); // signal caller that integration is done
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: step === "select" ? 520 : step === "pages" ? 500 : 460 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>

        {/* ── STEP 1: Platform Selector ─────────────────── */}
        {step === "select" && (
          <>
            <div className="modal-icon" style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14" }}>
              🔗
            </div>
            <h3 className="modal-title">Connect Social Account</h3>
            <p className="modal-sub">
              Choose a platform to connect. You can add multiple accounts per workspace.
            </p>

            <div className="flex flex-col gap-3 mb-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all cursor-pointer text-left group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: p.gradient }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-white mb-0.5">{p.name}</div>
                    <div className="text-[12px] text-[#6a6a6a] leading-snug">{p.description}</div>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4870"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 group-hover:stroke-[#c8c4e0] transition-colors"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#39FF14]/[0.03] border border-[#39FF14]/10 flex gap-2.5 items-start">
              <span className="text-[14px]">ℹ️</span>
              <span className="text-[11px] text-[#8b87a8] leading-relaxed">
                You can connect <strong className="text-[#c8c4e0]">multiple accounts</strong> from the same or different platforms to one workspace.
              </span>
            </div>
          </>
        )}

        {/* ── STEP 2: Confirm & Permissions ─────────────── */}
        {step === "confirm" && selected && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-[12px] text-[#8b87a8] hover:text-white transition-colors mb-4 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Choose different platform
            </button>

            <div className="modal-icon" style={{ background: `${selected.accent}18`, color: selected.accent }}>
              {selected.icon}
            </div>
            <h3 className="modal-title">Connect {selected.name}</h3>
            <p className="modal-sub">
              AuraPost needs the following access to manage your {selected.name} account.
            </p>

            <ul className="perm-list">
              {selected.permissions.map((perm, i) => (
                <li key={i} className="perm-item">
                  <div className="perm-check" style={{ background: `${selected.accent}18`, color: selected.accent }}>✓</div>
                  <span>{perm}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ background: selected.gradient }}
              >
                <span style={{ transform: "scale(0.75)" }}>{selected.icon}</span>
              </div>
              <div>
                <div className="text-[12px] font-medium text-white">{selected.name} Business Account</div>
                <div className="text-[11px] text-[#6a6a6a]">You'll be redirected to authenticate</div>
              </div>
              <div
                className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider"
                style={{ color: selected.accent, background: `${selected.accent}14`, border: `1px solid ${selected.accent}30` }}
              >
                SELECTED
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button className="btn-ghost justify-center" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-accent justify-center"
                onClick={handleConnect}
                style={{
                  background: selected.gradient,
                  boxShadow: `0 0 20px ${selected.accent}40`,
                }}
              >
                Continue with {selected.name}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Select Facebook Page ──────────────── */}
        {step === "pages" && pendingMeta && (
          <>
            <div className="modal-icon" style={{ background: "#1877f218", color: "#1877f2" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h3 className="modal-title">Select a Facebook Page</h3>
            <p className="modal-sub">
              Choose which page to connect to this workspace. Each page creates a separate account.
            </p>

            <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {pendingMeta.pages.map((page) => (
                <button
                  key={page.id}
                  disabled={isConnecting}
                  onClick={() => handlePageSelect(page)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#1877f2]/40 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-[15px] flex-shrink-0">
                    {page.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white">{page.name}</div>
                    {page.instagramBusinessAccount ? (
                      <div className="text-[11px] text-[#39FF14] flex items-center gap-1 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Instagram linked · @{page.instagramBusinessAccount.username}
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#8b87a8] mt-0.5">Facebook Page only</div>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-[#1877f2] group-hover:text-white transition-colors">
                    {isConnecting ? "…" : "Select →"}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8b87a8] leading-relaxed">
              💡 You can come back and add more pages by clicking <strong className="text-[#c8c4e0]">Connect Account</strong> again.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectAccountModal;
