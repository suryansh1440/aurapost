import React from "react";

/* ── Platform icon helpers ─────────────────────────────────── */
const FbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Status badge ──────────────────────────────────────────── */
const StatusBadge = ({ status }) => (
  <span
    className="text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider"
    style={
      status === "ACTIVE"
        ? { color: "#39FF14", background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.2)" }
        : { color: "#ff7675", background: "rgba(255,118,117,0.1)", border: "1px solid rgba(255,118,117,0.2)" }
    }
  >
    {status}
  </span>
);

/* ── Single platform row ───────────────────────────────────── */
const PlatformRow = ({ icon, iconBg, name, handle, status, tag, isNested = false }) => (
  <div
    className={`flex items-center gap-3 ${isNested ? "pl-3 border-l-2 border-white/[0.06]" : ""}`}
  >
    {/* avatar */}
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
      style={{ background: iconBg }}
    >
      {icon}
    </div>

    {/* info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-semibold text-white truncate">{name}</span>
        {tag && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
            style={{ color: tag.color, background: tag.bg, border: `1px solid ${tag.border}` }}
          >
            {tag.label}
          </span>
        )}
      </div>
      <div className="text-[11px] text-[#8b87a8] truncate">{handle}</div>
    </div>

    <StatusBadge status={status} />
  </div>
);

/* ── Main AccountCard ──────────────────────────────────────── */
/**
 * Renders a connected integration as an expandable card.
 * If the integration has an Instagram account linked, it shows
 * Facebook Page and Instagram as two separate rows inside one card.
 *
 * Props:
 *   acc          – integration document from the API
 *   onDisconnect – async () => void   (optional, only shown if passed)
 */
const AccountCard = ({ acc, onDisconnect }) => {
  const hasFbPage = !!acc.facebookPageName;
  const hasIg = !!acc.instagramUsername;

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      {/* ── Facebook Page row ──────────────────────────────── */}
      {hasFbPage && (
        <div className="flex items-center gap-3 p-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: "#1877f2" }}
          >
            <FbIcon />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-white truncate">{acc.facebookPageName}</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
                style={{ color: "#1877f2", background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)" }}
              >
                FB PAGE
              </span>
            </div>
            <div className="text-[11px] text-[#8b87a8]">Facebook · Page ID {acc.facebookPageId}</div>
          </div>
          <StatusBadge status={acc.status} />
        </div>
      )}

      {/* ── Divider (only when both exist) ──────────────────── */}
      {hasFbPage && hasIg && (
        <div className="mx-3 border-t border-white/[0.05]" />
      )}

      {/* ── Instagram row ───────────────────────────────────── */}
      {hasIg && (
        <div className="flex items-center gap-3 p-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)" }}
          >
            <IgIcon />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-white truncate">@{acc.instagramUsername}</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
                style={{ color: "#e1306c", background: "rgba(225,48,108,0.12)", border: "1px solid rgba(225,48,108,0.25)" }}
              >
                INSTAGRAM
              </span>
            </div>
            <div className="text-[11px] text-[#8b87a8] flex items-center gap-1">
              <CheckIcon />
              Linked via {acc.facebookPageName || "Facebook Page"}
            </div>
          </div>
          <StatusBadge status={acc.status} />
        </div>
      )}

      {/* ── If only page-level integration (no FB page name either) */}
      {!hasFbPage && !hasIg && (
        <div className="flex items-center gap-3 p-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white bg-white/10"
          >
            <span className="font-bold text-[13px]">{acc.provider?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white">Connected Account</div>
            <div className="text-[11px] text-[#8b87a8]">{acc.provider}</div>
          </div>
          <StatusBadge status={acc.status} />
        </div>
      )}

      {/* ── Disconnect footer ────────────────────────────────── */}
      {onDisconnect && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.05] bg-white/[0.01]">
          <span className="text-[10px] text-[#6a6a6a] font-mono uppercase tracking-wider">
            {acc.provider} · {acc.status}
          </span>
          <button
            onClick={onDisconnect}
            className="text-[11px] text-[#ff7675] hover:text-white hover:bg-[#ff7675]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountCard;
