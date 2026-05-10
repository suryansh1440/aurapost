import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../../store/workspaceStore";
import { useAuthStore } from "../../../store/authStore";
import ConnectAccountModal from "../../../components/dashboard/ConnectAccountModal";
import AccountCard from "../../../components/dashboard/AccountCard";

const emojis = ["🚀", "🎨", "🎬", "📱", "💼", "🏢", "🌟", "⚡", "🔥", "🌈", "📦", "💎"];

/* ── Avatar ─────────────────────────────────────────────────── */
const Avatar = ({ name = "?", size = 36, color = "#39FF14" }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[11px]"
      style={{ width: size, height: size, background: `${color}20`, color, border: `1px solid ${color}40`, fontFamily: "'Syne', sans-serif" }}
    >
      {initials}
    </div>
  );
};

/* ── Role badge ─────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const styles = {
    Owner:  { color: "#ffd32a", bg: "rgba(255,211,42,0.12)",  border: "rgba(255,211,42,0.25)"  },
    ADMIN:  { color: "#a29bfe", bg: "rgba(162,155,254,0.12)", border: "rgba(162,155,254,0.25)" },
    EDITOR: { color: "#55efc4", bg: "rgba(85,239,196,0.12)",  border: "rgba(85,239,196,0.25)"  },
    VIEWER: { color: "#8b87a8", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)"  },
  };
  const s = styles[role] || styles.VIEWER;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {role}
    </span>
  );
};

const WsManage = () => {
  const { wsId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [iconType, setIconType] = useState("emoji");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [editForm, setEditForm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");

  const { workspaces, updateWorkspace, deleteWorkspace, fetchWorkspaceById, inviteMember, removeMember, updateMemberRole, fetchConnectedAccounts, disconnectAccount, isLoading, isUpdating, isDeleting } = useWorkspaceStore();
  const currentWs = workspaces.find(w => w._id === wsId);

  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Role permissions
  const isOwner = currentWs?.owner?._id === user?._id || currentWs?.owner === user?._id;
  const myMemberEntry = currentWs?.members?.find(m => (m.user?._id || m.user) === user?._id);
  const myRole = isOwner ? "Owner" : (myMemberEntry?.role || "VIEWER");
  const canEditDetails = isOwner || myRole === "ADMIN";
  const canManageMembers = isOwner || myRole === "ADMIN";

  // Fetch on hard reload if store is empty
  useEffect(() => {
    if (!currentWs) fetchWorkspaceById(wsId);
  }, [wsId]);

  useEffect(() => {
    const getAccounts = async () => {
      setIsFetchingAccounts(true);
      const accounts = await fetchConnectedAccounts(wsId);
      setConnectedAccounts(accounts || []);
      setIsFetchingAccounts(false);
    };
    getAccounts();
    // Auto-open connect modal if returning from Meta OAuth redirect
    if (wsId && sessionStorage.getItem(`meta_pending_${wsId}`)) {
      setShowConnectModal(true);
    }
  }, [wsId]);

  useEffect(() => {
    if (currentWs) {
      setEditForm({
        name: currentWs.name || "",
        description: currentWs.description || "",
        emoji: currentWs.emoji || "🚀",
        workspaceLogo: currentWs.workspaceLogo || "",
      });
      setIconType(currentWs.workspaceLogo ? "logo" : "emoji");
      if (currentWs.workspaceLogo) setFilePreview(currentWs.workspaceLogo);
    }
  }, [currentWs?._id]);


  if (isLoading || !currentWs) {
    return (
      <div className="fade-in flex flex-col gap-3">
        <div className="topbar">
          <div>
            <div className="h-6 w-48 bg-white/[0.06] rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-white/[0.04] rounded animate-pulse" />
          </div>
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="card">
            <div className="h-4 w-40 bg-white/[0.06] rounded animate-pulse mb-4" />
            <div className="h-24 bg-white/[0.03] rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const totalAccounts =
    (currentWs.facebookAccounts?.length || 0) + (currentWs.instagramAccounts?.length || 0);

  // Build members list — owner always first, then any member refs
  const memberCount = (currentWs.members?.length || 0) + 1; // +1 for owner
  const memberList = [
    {
      _id: currentWs.owner?._id || "owner",
      name: user?._id === (currentWs.owner?._id || currentWs.owner) ? (user.name || "You") : "Workspace Owner",
      email: user?._id === (currentWs.owner?._id || currentWs.owner) ? user.email : "owner@workspace",
      role: "Owner",
      accent: "#ffd32a",
      joinedAt: currentWs.createdAt,
    },
    ...(currentWs.members || []).map((m, i) => ({
      _id: m.user?._id || m.user,
      name: m.user?.name || `Member ${i + 1}`,
      email: m.user?.email || "—",
      role: m.role || "VIEWER",
      accent: ["#a29bfe", "#74b9ff", "#55efc4", "#fd79a8"][i % 4],
      joinedAt: null,
    })),
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm?.name) return;
    try {
      const data = new FormData();
      data.append("name", editForm.name);
      data.append("description", editForm.description);
      if (iconType === "emoji") {
        data.append("emoji", editForm.emoji);
        data.append("workspaceLogo", "");
      } else {
        data.append("emoji", "");
        if (selectedFile) data.append("workspaceLogo", selectedFile);
        else data.append("workspaceLogo", editForm.workspaceLogo);
      }
      await updateWorkspace(wsId, data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkspace(wsId);
      navigate("/dashboard/workspaces");
    } catch (err) { console.error(err); }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[14px] outline-none transition-colors focus:border-[#39FF14]/40 placeholder:text-[#4a4870]";

  return (
    <div className="fade-in">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Manage Workspace</h1>
          <div className="topbar-sub">
            Configure settings and identity for{" "}
            <span className="text-white font-medium">{currentWs.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">

        {/* ── Update Details ────────────────────────────────────── */}
        <div className="card">
          <div className="card-title">
            <span>Workspace Details</span>
            <span className="font-mono text-[10px] text-[#39FF14] bg-[#39FF14]/[0.06] border border-[#39FF14]/20 rounded px-2.5 py-0.5">
              EDITABLE
            </span>
          </div>

          {editForm && (
            <form onSubmit={handleUpdate}>
              <div className="grid gap-8" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
                {/* Left */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[13px] text-white font-medium mb-1.5">Workspace Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required className={inputCls} placeholder="e.g. AuraPost Marketing Agency" />
                    <p className="field-info mt-1.5">This name appears in your sidebar and dashboard.</p>
                  </div>
                  <div>
                    <label className="block text-[13px] text-white font-medium mb-1.5">Description <span className="text-[#6a6a6a] font-normal">(optional)</span></label>
                    <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className={inputCls} style={{ height: "90px", resize: "none" }} placeholder="Briefly describe what this workspace is for..." />
                    <p className="field-info mt-1.5">Max 200 characters.</p>
                  </div>
                  {canEditDetails && (
                    <button type="submit" className="btn-accent w-full justify-center py-3 text-[14px]" disabled={isUpdating}>
                      {isUpdating ? "Saving Changes…" : "✓ Save Changes"}
                    </button>
                  )}
                </div>

                {/* Right — identity */}
                <div className="border-l border-white/5 pl-8">
                  <label className="block text-[13px] text-white font-medium mb-3">Workspace Identity</label>
                  <div className="icon-type-tabs">
                    <button type="button" className={`icon-type-btn ${iconType === "emoji" ? "active" : ""}`} onClick={() => setIconType("emoji")}>Emoji Icon</button>
                    <button type="button" className={`icon-type-btn ${iconType === "logo" ? "active" : ""}`} onClick={() => setIconType("logo")}>Brand Logo</button>
                  </div>
                  {iconType === "emoji" ? (
                    <>
                      <div className="emoji-grid">
                        {emojis.map(e => (
                          <button key={e} type="button" className={`emoji-btn ${editForm.emoji === e ? "active" : ""}`} onClick={() => setEditForm({ ...editForm, emoji: e })}>{e}</button>
                        ))}
                      </div>
                      <p className="field-info mt-3">Select an emoji to represent this workspace in the sidebar.</p>
                    </>
                  ) : (
                    <>
                      <div onClick={() => document.getElementById("logo-upload-manage").click()} className="w-full h-[110px] bg-white/[0.03] border border-dashed border-white/15 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#39FF14]/40">
                        {filePreview
                          ? <img src={filePreview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                          : <>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b87a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                              <span className="text-[12px] text-[#8b87a8] mt-2">Click to upload logo</span>
                            </>
                        }
                      </div>
                      <input id="logo-upload-manage" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <div className="mt-3">
                        <label className="block text-[11px] text-[#8b87a8] mb-1">Or paste image URL</label>
                        <input type="text" value={editForm.workspaceLogo} onChange={e => { setEditForm({ ...editForm, workspaceLogo: e.target.value }); setFilePreview(e.target.value); setSelectedFile(null); }} className={inputCls} style={{ fontSize: "13px" }} placeholder="https://example.com/logo.png" />
                      </div>
                    </>
                  )}
                  <div className="mt-5 p-3 rounded-xl bg-[#39FF14]/[0.03] border border-[#39FF14]/10 flex gap-2.5 items-start">
                    <span className="text-[16px]">💡</span>
                    <span className="text-[12px] text-[#c8c4e0] leading-relaxed"><strong>Tip:</strong> Use a square PNG or JPG for the best display across the platform.</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ── Integrations ───────────────────────────────────────────── */}
        <div className="card">
          <div className="card-title flex items-center justify-between">
            <div>
              <span>Integrations</span>
              <span className="font-mono text-[10px] text-[#00a8ff] bg-[#00a8ff]/[0.06] border border-[#00a8ff]/20 rounded px-2.5 py-0.5 ml-2">
                SOCIAL
              </span>
            </div>
            {canEditDetails && (
              <button 
                onClick={() => setShowConnectModal(true)}
                className="btn-accent px-3 py-1.5 text-[12px]"
              >
                + Connect Account
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {isFetchingAccounts ? (
              <div className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
            ) : connectedAccounts.length > 0 ? (
              connectedAccounts.map((acc, i) => (
                <AccountCard
                  key={acc._id || i}
                  acc={acc}
                  onDisconnect={canEditDetails ? async () => {
                    const success = await disconnectAccount(acc._id);
                    if (success) setConnectedAccounts(prev => prev.filter(a => a._id !== acc._id));
                  } : undefined}
                />
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[13px] text-[#8b87a8] text-center">
                No social accounts connected yet. Connect Facebook/Instagram to start posting.
              </div>
            )}
          </div>
        </div>

        {/* ── Members ───────────────────────────────────────────── */}
        <div className="card">
          <div className="card-title">
            <span>Members <span className="text-[#8b87a8] font-normal text-[13px]">({memberCount})</span></span>
            <span className="font-mono text-[10px] text-[#a29bfe] bg-[#a29bfe]/[0.06] border border-[#a29bfe]/20 rounded px-2.5 py-0.5">
              TEAM
            </span>
          </div>

          {/* Invite bar */}
          {canManageMembers && (
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[13px] outline-none transition-colors focus:border-[#39FF14]/40 placeholder:text-[#4a4870]"
                placeholder="Invite by email address…"
              />
              <select 
                value={inviteRole} 
                onChange={e => setInviteRole(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-[13px] outline-none cursor-pointer"
              >
                <option value="VIEWER" className="bg-[#0A0A0A]">Viewer</option>
                <option value="EDITOR" className="bg-[#0A0A0A]">Editor</option>
                <option value="ADMIN" className="bg-[#0A0A0A]">Admin</option>
              </select>
              <button
                className="btn-accent px-4 py-2 text-[13px] whitespace-nowrap"
                onClick={async () => { 
                  if (inviteEmail) { 
                    const success = await inviteMember(wsId, inviteEmail, inviteRole);
                    if (success) setInviteEmail(""); 
                  } 
                }}
              >
                + Invite
              </button>
            </div>
          )}

          {/* Member list */}
          <div className="flex flex-col divide-y divide-white/[0.04]">
            {memberList.map((m, i) => (
              <div key={m._id || i} className="flex items-center gap-3 py-3">
                <Avatar name={m.name} size={36} color={m.accent} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white leading-tight truncate">{m.name}</div>
                  <div className="text-[11px] text-[#6a6a6a] truncate">{m.email}</div>
                </div>
                {canManageMembers && m.role !== "Owner" ? (
                  <div className="flex items-center gap-2">
                    <select 
                      value={m.role} 
                      onChange={async (e) => await updateMemberRole(wsId, m._id, e.target.value)}
                      className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-[#8b87a8] text-[11px] outline-none cursor-pointer hover:border-white/30"
                    >
                      <option value="VIEWER" className="bg-[#0A0A0A]">Viewer</option>
                      <option value="EDITOR" className="bg-[#0A0A0A]">Editor</option>
                      <option value="ADMIN" className="bg-[#0A0A0A]">Admin</option>
                    </select>
                    <button 
                      onClick={async () => await removeMember(wsId, m._id)}
                      className="text-[11px] text-[#ff7675] hover:text-[#ff7675]/70 transition-colors ml-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <RoleBadge role={m.role} />
                )}
              </div>
            ))}
          </div>

          {memberList.length === 1 && (
            <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[12px] text-[#6a6a6a] text-center">
              No other members yet. Invite your team to collaborate.
            </div>
          )}
        </div>

        {/* ── Bottom row ────────────────────────────────────────── */}
        <div className="two-col">
          {/* Workspace Info */}
          <div className="card">
            <div className="card-title">Workspace Info</div>
            {[
              ["Workspace ID",       <span className="font-mono text-[11px] text-[#e8e6f0] break-all">{wsId}</span>],
              ["Plan",               <span className="text-[#ffd32a] font-semibold">{currentWs.plan || "FREE"}</span>],
              ["Status",             <span style={{ color: currentWs.status === "ACTIVE" ? "#39FF14" : "#ff7675" }}>{currentWs.status || "ACTIVE"}</span>],
              ["Total Posts",        currentWs.postCount || 0],
              ["Connected Accounts", totalAccounts],
              ["Members",            memberCount],
              ["Created",            new Date(currentWs.createdAt || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })],
            ].map(([key, val], i, arr) => (
              <div key={i} className={`flex items-center justify-between py-2.5 text-[12px] ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                <span className="text-[#8b87a8]">{key}</span>
                <span className="text-[#e8e6f0] font-medium text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>

          {/* Danger Zone - Owner Only */}
          {isOwner && (
            <div
              className="card transition-colors"
              style={{ borderColor: "rgba(255,118,117,0.15)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,118,117,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,118,117,0.15)"}
            >
              <div className="card-title" style={{ color: "#ff7675" }}>
                <span>⚠ Danger Zone</span>
                <span className="font-mono text-[10px] text-[#ff7675] bg-[#ff7675]/[0.06] border border-[#ff7675]/20 rounded px-2.5 py-0.5">
                  IRREVERSIBLE
                </span>
              </div>
              <div className="flex flex-col gap-4 pt-1">
                <div>
                  <div className="text-[14px] font-semibold text-white mb-1">Delete Workspace</div>
                  <div className="text-[12px] text-[#8b87a8] leading-relaxed">
                    Permanently delete <strong className="text-[#c8c4e0]">{currentWs.name}</strong> and all its posts, characters, and linked accounts. This <span className="text-[#ff7675]">cannot be undone</span>.
                  </div>
                </div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[9px] text-[13px] font-semibold text-[#ff7675] bg-[#ff7675]/[0.12] border border-[#ff7675]/30 hover:bg-[#ff7675]/20 hover:border-[#ff7675]/50 transition-all cursor-pointer">
                    Delete Workspace
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-[#ff7675]/[0.05] border border-[#ff7675]/20">
                    <div className="text-[13px] text-[#ff7675] font-medium mb-3">Are you sure? This is permanent.</div>
                    <div className="flex gap-2">
                      <button className="btn-ghost flex-1 justify-center" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                      <button onClick={handleDelete} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[9px] text-[13px] font-semibold text-[#ff7675] bg-[#ff7675]/[0.2] border border-[#ff7675]/40 hover:bg-[#ff7675]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        {isDeleting ? "Deleting…" : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Connect Account Modal ────────────────────────────────────── */}
      {showConnectModal && (
        <ConnectAccountModal
          wsId={wsId}
          onClose={() => setShowConnectModal(false)}
          onConnect={async (platform) => {
            if (platform === "meta_done") {
              setShowConnectModal(false);
              const accounts = await fetchConnectedAccounts(wsId);
              setConnectedAccounts(accounts || []);
              return;
            }
            if (platform === "meta") {
              const clientId = import.meta.env.VITE_FACEBOOK_APP_ID_FOR_WORKSPACE || "YOUR_APP_ID";
              const configId = import.meta.env.VITE_META_CONFIG_ID || "10000000000000";
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

    </div>
  );
};

export default WsManage;
