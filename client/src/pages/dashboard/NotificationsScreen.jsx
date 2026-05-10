import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useNotificationStore } from "../../store/notificationStore";

/* ── Type config ──────────────────────────────────────────── */
const TYPE = {
  published: { label: "Published",  border: "#39FF14", dot: "#39FF14", badge: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/25" },
  scheduled: { label: "Scheduled",  border: "#a29bfe", dot: "#a29bfe", badge: "bg-[#a29bfe]/10 text-[#a29bfe] border-[#a29bfe]/25" },
  failed:    { label: "Failed",      border: "#ff7675", dot: "#ff7675", badge: "bg-[#ff7675]/10 text-[#ff7675] border-[#ff7675]/25" },
  reach:     { label: "Trending",    border: "#ffd32a", dot: "#ffd32a", badge: "bg-[#ffd32a]/10 text-[#ffd32a] border-[#ffd32a]/25" },
};

/* ── SVG Icons ────────────────────────────────────────────── */
const Icon = {
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  alertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  trendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  x: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  checkSmall: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
};

const typeIcon = (type) => {
  if (type === "published") return <Icon.check />;
  if (type === "scheduled") return <Icon.calendar />;
  if (type === "failed")    return <Icon.alertCircle />;
  return <Icon.trendingUp />;
};

// Mocks removed

/* ── Animated removal hook ─────────────────────────────────── */
const useRemovable = (initial) => {
  const [items, setItems] = useState(initial);
  const [removing, setRemoving] = useState(new Set());
  const remove = (id) => {
    setRemoving(prev => new Set([...prev, id]));
    setTimeout(() => {
      setItems(prev => prev.filter(x => x.id !== id));
      setRemoving(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 320);
  };
  return { items, setItems, remove, isRemoving: (id) => removing.has(id) };
};

/* ── Components ──────────────────────────────────────────── */
const Avatar = ({ initials, color, size = 36 }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[11px] font-mono"
    style={{ width: size, height: size, background: `${color}15`, color, border: `1px solid ${color}30` }}
  >
    {initials}
  </div>
);

const CardBase = ({ accent, removing, unread, children, leftIcon, wsName }) => (
  <div
    className="relative flex gap-4 rounded-xl border border-[#1C1C1C] bg-[#0A0A0A] overflow-hidden transition-all duration-300"
    style={{
      borderLeftColor: accent,
      borderLeftWidth: "3px",
      opacity: removing ? 0 : 1,
      transform: removing ? "translateX(-18px)" : "translateX(0)",
      transition: "opacity 0.32s ease, transform 0.32s ease",
    }}
  >
    {unread && (
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
    )}
    <div className="flex items-start pt-4 pl-4">
      {leftIcon}
    </div>
    <div className="flex-1 min-w-0 py-4 pr-4">
      {wsName && (
        <div className="text-[9px] font-bold text-[#6A6A6A] uppercase tracking-widest font-mono mb-1">
          {wsName}
        </div>
      )}
      {children}
    </div>
  </div>
);

const PostCard = ({ notif, unread, onDismiss, removing }) => {
  const t = TYPE[notif.type] || TYPE.published;
  return (
    <CardBase wsName={notif.wsName} accent={t.border} removing={removing} unread={unread} leftIcon={
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${t.border}12`, color: t.border }}>
        {typeIcon(notif.type)}
      </div>
    }>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-semibold text-[#F5F5F5] leading-tight">{notif.title}</span>
          {unread && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.dot }} />}
        </div>
        <span className="text-[11px] text-[#6A6A6A] whitespace-nowrap flex-shrink-0 font-mono">{notif.time}</span>
      </div>
      <p className="text-[12px] text-[#9A9A9A] leading-relaxed mb-3">{notif.body}</p>
      <div className="flex items-center gap-3">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono uppercase tracking-wider ${t.badge}`}>
          {t.label}
        </span>
        <button onClick={() => onDismiss(notif.id)} className="flex items-center gap-1 text-[11px] text-[#3A3A3A] hover:text-[#9A9A9A] transition-colors cursor-pointer">
          <Icon.x /> Dismiss
        </button>
      </div>
    </CardBase>
  );
};

const RequestCard = ({ req, onApprove, onDecline, removing }) => (
  <CardBase wsName={req.wsName} accent={req.accent} removing={removing} unread={false} leftIcon={
    <Avatar initials={req.initials} color={req.accent} size={36} />
  }>
    <div className="flex items-start justify-between gap-3 mb-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#F5F5F5] leading-tight">{req.name}</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-[#6A6A6A] font-mono uppercase tracking-wider">
          {req.role} Request
        </span>
      </div>
      <span className="text-[11px] text-[#6A6A6A] whitespace-nowrap flex-shrink-0 font-mono">{req.time}</span>
    </div>
    <div className="mb-3">
      <p className="text-[12px] text-[#9A9A9A] leading-relaxed line-clamp-1">{req.email}</p>
      {req.msg && <p className="text-[12px] text-[#6A6A6A] italic mt-0.5 line-clamp-1">"{req.msg}"</p>}
    </div>
    <div className="flex gap-2">
      <button onClick={() => onApprove(req.id)} className="btn-accent flex items-center gap-1.5 py-1 px-3 text-[11px] font-bold cursor-pointer">
        <Icon.checkSmall /> Accept
      </button>
      <button onClick={() => onDecline(req.id)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-[#ff7675] bg-transparent border border-[#ff7675]/30 hover:border-[#ff7675]/60 hover:text-[#ff7675] transition-all cursor-pointer">
        <Icon.x /> Decline
      </button>
    </div>
  </CardBase>
);

const Tab = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer border ${
      active
        ? "bg-[#39FF14]/[0.12] text-[#39FF14] border-[#39FF14]/30"
        : "text-[#6A6A6A] border-transparent hover:text-[#9A9A9A] hover:bg-white/[0.03]"
    }`}
  >
    {icon}
    {label}
    {count > 0 && (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono min-w-[18px] text-center" style={active ? { background: "rgba(57,255,20,0.2)", color: "#39FF14" } : { background: "rgba(255,255,255,0.06)", color: "#6A6A6A" }}>
        {count}
      </span>
    )}
  </button>
);

const Empty = ({ icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8">
    <div className="w-14 h-14 rounded-2xl bg-[#0F0F0F] border border-[#1C1C1C] flex items-center justify-center text-[#3A3A3A] mb-4">
      {icon}
    </div>
    <div className="text-[15px] font-semibold text-[#F5F5F5] mb-1">{title}</div>
    <div className="text-[13px] text-[#6A6A6A] text-center leading-relaxed">{sub}</div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
const NotificationsScreen = () => {
  const { fetchNotifications, notifications, pendingInvites, acceptInvite, rejectInvite, markAsRead, isLoading } = useNotificationStore();
  const [tab, setTab] = useState("requests");
  const [readSet, setReadSet] = useState(new Set());

  // Using the hook to manage animations for mapped items
  const reqState  = useRemovable([]);
  const postState = useRemovable([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (pendingInvites) {
      reqState.setItems(pendingInvites.map(inv => ({
        id: inv._id,
        wsName: inv.workspace?.name || "Workspace",
        name: inv.sender?.name || "Someone",
        initials: (inv.sender?.name || "S").substring(0, 2).toUpperCase(),
        email: inv.recipientEmail,
        role: inv.role,
        accent: inv.workspace?.themeColor || "#a29bfe",
        time: new Date(inv.createdAt).toLocaleDateString(),
        msg: `Invited you as ${inv.role}`
      })));
    }
    if (notifications) {
      postState.setItems(notifications.map(n => ({
        id: n._id,
        wsName: n.workspace?.name || "System",
        type: n.type === "INFO" ? "published" : (n.type === "ALERT" ? "failed" : "reach"),
        title: n.title,
        body: n.body,
        time: new Date(n.createdAt).toLocaleDateString(),
        isRead: n.isRead
      })));
      setReadSet(new Set(notifications.filter(n => n.isRead).map(n => n._id)));
    }
  }, [pendingInvites, notifications]);

  const handleApprove = async (id) => {
    reqState.remove(id);
    await acceptInvite(id);
  };

  const handleDecline = async (id) => {
    reqState.remove(id);
    await rejectInvite(id);
  };

  const handleDismiss = async (id) => {
    postState.remove(id);
    await markAsRead(id);
    setReadSet(prev => { const s = new Set(prev); s.add(id); return s; });
  };

  const unreadCount = postState.items.filter(n => !readSet.has(n.id)).length;
  const handleMarkAllRead = () => {
    postState.items.forEach(n => {
      if (!readSet.has(n.id)) markAsRead(n.id);
    });
    setReadSet(new Set(postState.items.map(n => n.id)));
  };

  return (
    <div className="fade-in flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Notification Center</h1>
          <div className="topbar-sub">Centralized activity feed for all your workspaces.</div>
        </div>
        {tab === "posts" && unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium text-[#39FF14] bg-[#39FF14]/[0.08] border border-[#39FF14]/20 hover:bg-[#39FF14]/[0.14] transition-all cursor-pointer">
            <Icon.checkSmall /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-5 p-1 bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl w-fit">
        <Tab active={tab === "requests"} onClick={() => setTab("requests")} icon={<Icon.users />} label="Join Requests" count={reqState.items.length} />
        <Tab active={tab === "posts"} onClick={() => setTab("posts")} icon={<Icon.bell />} label="Post Activity" count={unreadCount} />
      </div>

      <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2A2A transparent' }}>
        {tab === "requests" && (
          <div className="flex flex-col gap-2.5">
            {reqState.items.length === 0 ? (
              <div className="rounded-xl border border-[#1C1C1C] bg-[#0A0A0A]">
                <Empty icon={<Icon.users />} title="No pending requests" sub="New team member requests will appear here." />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1 px-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a29bfe]" />
                  <span className="text-[11px] text-[#6A6A6A] font-mono">{reqState.items.length} total pending</span>
                </div>
                {reqState.items.map(req => <RequestCard key={req.id} req={req} removing={reqState.isRemoving(req.id)} onApprove={handleApprove} onDecline={handleDecline} />)}
              </>
            )}
          </div>
        )}

        {tab === "posts" && (
          <div className="flex flex-col gap-2.5 pb-4">
            {postState.items.length === 0 ? (
              <div className="rounded-xl border border-[#1C1C1C] bg-[#0A0A0A]">
                <Empty icon={<Icon.bell />} title="All caught up" sub="No recent post activity to show." />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1 px-0.5">
                  {Object.entries(TYPE).map(([key, t]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.dot }} />
                      <span className="text-[10px] text-[#6A6A6A] font-mono uppercase tracking-wider">{t.label}</span>
                    </div>
                  ))}
                </div>
                {postState.items.map(notif => <PostCard key={notif.id} notif={notif} unread={!readSet.has(notif.id)} removing={postState.isRemoving(notif.id)} onDismiss={handleDismiss} />)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
