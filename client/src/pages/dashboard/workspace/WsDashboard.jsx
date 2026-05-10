import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icons, recentActivity } from "../../../utils/dashboardData";
import { useWorkspaceStore } from "../../../store/workspaceStore";
import { useAuthStore } from "../../../store/authStore";
import ConnectAccountModal from "../../../components/dashboard/ConnectAccountModal";
import AccountCard from "../../../components/dashboard/AccountCard";

/* ── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, accent = "#39FF14", trend, trendUp }) => (
  <div
    className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.06] bg-[#12101e]/80 transition-all duration-200 hover:-translate-y-0.5"
    onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}33`}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: `${accent}18`, color: accent }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-[#8b87a8] font-medium mb-1">{label}</div>
      <div className="font-bold text-[22px] leading-none text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-[#6a6a6a] mb-1">{sub}</div>}
      {trend && (
        <div className="text-[11px] font-medium" style={{ color: trendUp ? "#00d4aa" : "#ff7675" }}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  </div>
);

/* ── Main ──────────────────────────────────────────────────── */
const WsDashboard = () => {
  const { wsId } = useParams();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const { workspaces, fetchWorkspaceById, fetchConnectedAccounts, isLoading } = useWorkspaceStore();
  const { user } = useAuthStore();
  const currentWs = workspaces.find(w => w._id === wsId);

  // Role permissions
  const isOwner = currentWs?.owner?._id === user?._id || currentWs?.owner === user?._id;
  const myMemberEntry = currentWs?.members?.find(m => (m.user?._id || m.user) === user?._id);
  const myRole = isOwner ? "Owner" : (myMemberEntry?.role || "VIEWER");
  const canEditDetails = isOwner || myRole === "ADMIN";

  useEffect(() => {
    if (!currentWs) fetchWorkspaceById(wsId);
  }, [wsId]);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await fetchConnectedAccounts(wsId);
      setConnectedAccounts(accounts || []);
    };
    if (wsId) getAccounts();
    // Auto-open modal if we just came back from Meta OAuth redirect
    if (wsId && sessionStorage.getItem(`meta_pending_${wsId}`)) {
      setShowConnectModal(true);
    }
  }, [wsId]);

  if (isLoading || !currentWs) {
    return (
      <div className="fade-in flex flex-col gap-4">
        <div className="ws-header">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-52 bg-white/[0.06] rounded-lg animate-pulse" />
            <div className="h-4 w-80 bg-white/[0.04] rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#12101e]/80 p-4 h-24 animate-pulse" />
          ))}
        </div>
        <div className="two-col">
          <div className="card h-48 animate-pulse" />
          <div className="card h-48 animate-pulse" />
        </div>
      </div>
    );
  }

  const totalAccounts = connectedAccounts.length;
  const memberCount = (currentWs.members?.length || 0) + 1; // +1 for owner

  /* ── Stats ─────────────────────────────────────────────── */
  const stats = [
    { icon: "📝", label: "Total Posts",        value: currentWs.postCount || 0,      sub: "all time published",      accent: "#39FF14", trend: "3 this week",      trendUp: true  },
    { icon: "👥", label: "Members",            value: memberCount,                    sub: "owner + collaborators",   accent: "#a29bfe", trend: memberCount > 1 ? `${memberCount - 1} collaborator${memberCount > 2 ? "s" : ""}` : "Just you so far", trendUp: memberCount > 1 },
    { icon: "📅", label: "Scheduled Posts",    value: currentWs.scheduledCount || 0,  sub: "queued to publish",       accent: "#74b9ff", trend: "Next: Today 6PM",  trendUp: true  },
    { icon: "👁️", label: "Workspace Reach",   value: currentWs.totalReach ? `${(currentWs.totalReach / 1000).toFixed(1)}K` : "—", sub: "estimated impressions", accent: "#00d4aa", trend: "12.5% vs last month", trendUp: true },
    { icon: "✨", label: "AI Credits Used",    value: currentWs.aiCreditsUsed || 0,   sub: "generation credits spent",accent: "#ffd32a", trend: "1,420 remaining",   trendUp: true  },
    { icon: "💬", label: "Avg Engagement",     value: currentWs.avgEngagement ? `${currentWs.avgEngagement}%` : "—", sub: "likes, comments, shares", accent: "#fd79a8", trend: "2.1% above avg", trendUp: true },
    { icon: "🎯", label: "Best Format",        value: currentWs.bestType || "Reels",  sub: "top content type",        accent: "#55efc4", trend: "2.3× more reach",   trendUp: true  },
    { icon: "🛡️", label: "Workspace Status",  value: currentWs.status === "ACTIVE" ? "Active" : "Action Req.", sub: "platform health", accent: currentWs.status === "ACTIVE" ? "#39FF14" : "#ff7675", trend: currentWs.status === "ACTIVE" ? "All systems OK" : "Check connections", trendUp: currentWs.status === "ACTIVE" },
  ];


  return (
    <>
      <div className="fade-in">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="ws-header">
          <div className="ws-header-thumb" style={{ background: currentWs.bg }}>
            {currentWs.workspaceLogo
              ? <img src={currentWs.workspaceLogo} alt="" className="w-full h-full object-cover rounded-2xl" />
              : currentWs.emoji}
          </div>
          <div>
            <div className="ws-header-name">{currentWs.name}</div>
            <div className="ws-header-meta">
              {currentWs.description || "No description set"} · Created{" "}
              {new Date(currentWs.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          </div>
          <div className="ws-header-actions">
            {connectedAccounts.length > 0 ? (
              <div className="conn-badge connected">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={Icons.check} /></svg>
                {connectedAccounts.length} Account{connectedAccounts.length !== 1 ? 's' : ''} Connected
              </div>
            ) : canEditDetails && (
              <div className="conn-badge disconnected" onClick={() => setShowConnectModal(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={Icons.link} /></svg>
                Connect Account
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Grid 4×2 ──────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-7">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Bottom Row ──────────────────────────────────── */}
        <div className="two-col">
          {/* Connected Accounts */}
          <div className="card">
            <div className="card-title">Connected Accounts</div>
            {connectedAccounts.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {connectedAccounts.map((acc, i) => (
                    <AccountCard key={acc._id || i} acc={acc} />
                  ))}
                </div>
                {canEditDetails && (
                  <button className="btn-ghost w-full justify-center mt-4" onClick={() => setShowConnectModal(true)}>
                    Connect Another Account
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔗</div>
                <div className="text-[#c8c4e0] text-[14px] mb-6">
                  No account connected yet. Link Instagram, Facebook or LinkedIn to start posting.
                </div>
                {canEditDetails ? (
                  <button className="btn-accent mx-auto" onClick={() => setShowConnectModal(true)}>
                    Connect Account
                  </button>
                ) : (
                  <div className="text-[12px] text-[#ff7675]">Ask an Admin or Owner to connect accounts.</div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-title">Recent Activity</div>
            {recentActivity.slice(0, 4).map((act, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" style={{ background: act.color }} />
                <div>
                  <div className="activity-text">{act.text}</div>
                  <div className="activity-time">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConnectModal && (
        <ConnectAccountModal
          wsId={wsId}
          onClose={() => setShowConnectModal(false)}
          onConnect={async (platform, result) => {
            if (platform === "meta_done") {
              // Page was selected inside the modal — refresh list and close
              setShowConnectModal(false);
              const accounts = await fetchConnectedAccounts(wsId);
              setConnectedAccounts(accounts || []);
              return;
            }
            if (platform === "meta") {
              const clientId = import.meta.env.VITE_FACEBOOK_APP_ID_FOR_WORKSPACE || "YOUR_APP_ID";
              const configId = import.meta.env.VITE_META_CONFIG_ID || "100000000000";
              const redirectUri = encodeURIComponent(`${window.location.origin}/meta/callback`);
              const state = JSON.stringify({ workspaceId: wsId });
              window.location.href = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&config_id=${configId}&state=${encodeURIComponent(state)}`;
            } else {
              alert(`${platform} integration is coming soon!`);
              setShowConnectModal(false);
            }
          }}
        />
      )}
    </>
  );
};

export default WsDashboard;
