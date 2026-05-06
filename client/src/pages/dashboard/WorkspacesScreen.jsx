import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../utils/dashboardData";
import { useWorkspaceStore } from "../../store/workspaceStore";

const WorkspacesScreen = () => {
  const navigate = useNavigate();
  const { workspaces, pagination, fetchWorkspaces, createWorkspace, deleteWorkspace, isLoading, isCreating } = useWorkspaceStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const emojis = ["🚀", "🎨", "🎬", "📱", "💼", "🏢", "🌟", "⚡", "🔥", "🌈", "📦", "💎"];
  const [iconType, setIconType] = useState("emoji"); // 'emoji' or 'logo'
  const [formData, setFormData] = useState({ name: "", description: "", emoji: "🚀", workspaceLogo: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  useEffect(() => {
    fetchWorkspaces(1, 10);
  }, [fetchWorkspaces]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("name", formData.name);
      dataToSubmit.append("description", formData.description);

      if (iconType === "emoji") {
        dataToSubmit.append("emoji", formData.emoji);
        dataToSubmit.append("workspaceLogo", "");
      } else {
        dataToSubmit.append("emoji", "");
        if (selectedFile) {
          dataToSubmit.append("workspaceLogo", selectedFile);
        } else {
          dataToSubmit.append("workspaceLogo", formData.workspaceLogo);
        }
      }

      await createWorkspace(dataToSubmit);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", emoji: "🚀", workspaceLogo: "" });
    setIconType("emoji");
    setSelectedFile(null);
    setFilePreview("");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchWorkspaces(newPage, pagination.limit);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this workspace?")) {
      deleteWorkspace(id);
    }
  };

  return (
    <>
      <div className="fade-in">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Workspaces</h1>
            <div className="topbar-sub">Manage your brands and client accounts in individual spaces.</div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ color: "#8b87a8", textAlign: "center", padding: "2rem" }}>Loading workspaces...</div>
        ) : (
          <div className="ws-grid">
            <div className="ws-card add-card" onClick={() => setIsModalOpen(true)}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b87a8", fontSize: "20px", marginBottom: "0.5rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={Icons.plus} />
                </svg>
              </div>
              <div style={{ fontWeight: 500, color: "#fff" }}>Create Workspace</div>
              <div style={{ fontSize: "12px", color: "#8b87a8" }}>Add a new brand or client</div>
            </div>

            {workspaces.map(ws => (
              <div className="ws-card" key={ws._id} onClick={() => navigate(`/dashboard/workspaces/${ws._id}`)}>
                <div className="ws-thumb" style={{ background: ws.bg }}>
                   {ws.workspaceLogo ? (
                     <img src={ws.workspaceLogo} alt={ws.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                   ) : ws.emoji}
                </div>
                <div className="ws-name">{ws.name}</div>
                <div className="ws-meta">{ws.description}</div>
                <div className="ws-stats">
                  <div className="ws-stat">Posts<strong>{ws.postCount || 0}</strong></div>
                  <div className="ws-stat">Accounts<strong>{(ws.facebookAccounts?.length || 0) + (ws.instagramAccounts?.length || 0)}</strong></div>
                  <div className="ws-stat">
                    Status
                    <strong style={{ color: ws.status === 'ACTIVE' ? '#39FF14' : '#ff7675' }}>
                      {ws.status === 'ACTIVE' ? 'Active' : 'Action Req'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
            <button 
              className="btn-ghost" 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              style={{ opacity: pagination.currentPage === 1 ? 0.5 : 1, cursor: pagination.currentPage === 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ fontSize: "13px", color: "#8b87a8" }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button 
              className="btn-ghost" 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              style={{ opacity: pagination.currentPage === pagination.totalPages ? 0.5 : 1, cursor: pagination.currentPage === pagination.totalPages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-grid">
              <div>
                <h2 className="modal-title" style={{ textAlign: "left" }}>Create New Workspace</h2>
                <p className="modal-sub" style={{ textAlign: "left" }}>A workspace is a dedicated environment for a specific brand or client. It keeps your posts, assets, and social accounts organized.</p>

                <form onSubmit={handleCreate}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#fff", fontWeight: 500, marginBottom: "6px" }}>Workspace Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px" }}
                      placeholder="e.g. AuraPost Marketing Agency"
                    />
                    <p className="field-info">Give your workspace a clear, recognizable name. This will appear in your sidebar and dashboard.</p>
                  </div>
                  
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "13px", color: "#fff", fontWeight: 500, marginBottom: "6px" }}>Description (Optional)</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px", height: "80px", resize: "none" }}
                      placeholder="Briefly describe what this workspace is for..."
                    />
                    <p className="field-info">Help your team understand the purpose of this space. Max 200 characters.</p>
                  </div>

                  <div style={{ marginTop: "2rem" }}>
                    <button type="submit" className="btn-accent" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px" }} disabled={isCreating}>
                      {isCreating ? "Initializing Workspace..." : "Initialize Workspace"}
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "2.5rem" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#fff", fontWeight: 500, marginBottom: "15px" }}>Workspace Identity</label>
                
                <div className="icon-type-tabs">
                   <button 
                    className={`icon-type-btn ${iconType === "emoji" ? "active" : ""}`}
                    onClick={() => setIconType("emoji")}
                   >
                     Emoji Icon
                   </button>
                   <button 
                    className={`icon-type-btn ${iconType === "logo" ? "active" : ""}`}
                    onClick={() => setIconType("logo")}
                   >
                     Brand Logo
                   </button>
                </div>

                {iconType === "emoji" ? (
                  <>
                    <div className="emoji-grid">
                      {emojis.map(e => (
                        <button 
                          key={e}
                          className={`emoji-btn ${formData.emoji === e ? "active" : ""}`}
                          onClick={() => setFormData({...formData, emoji: e})}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <p className="field-info" style={{ marginTop: "15px" }}>Select an emoji that represents this brand. This makes it easy to find in the sidebar.</p>
                  </>
                ) : (
                  <>
                    <div 
                      onClick={() => document.getElementById('logo-upload').click()}
                      style={{ 
                        width: "100%", 
                        height: "120px", 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px dashed rgba(255,255,255,0.15)", 
                        borderRadius: "12px", 
                        display: "flex", 
                        flexDirection: "column",
                        alignItems: "center", 
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = "rgba(57,255,20,0.4)"}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                    >
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }} />
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b87a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span style={{ fontSize: "12px", color: "#8b87a8", marginTop: "10px" }}>Click to upload logo</span>
                        </>
                      )}
                    </div>
                    <input 
                      id="logo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    
                    <div style={{ marginTop: "1rem" }}>
                      <label style={{ display: "block", fontSize: "12px", color: "#8b87a8", marginBottom: "4px" }}>Or paste image URL</label>
                      <input 
                        type="text" 
                        value={formData.workspaceLogo}
                        onChange={(e) => {
                          setFormData({...formData, workspaceLogo: e.target.value});
                          setFilePreview(e.target.value);
                          setSelectedFile(null);
                        }}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "13px" }}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <p className="field-info" style={{ marginTop: "10px" }}>Upload a square PNG or JPG for the best display across the platform.</p>
                  </>
                )}

                <div style={{ marginTop: "2rem", padding: "1.2rem", background: "rgba(57,255,20,0.03)", borderRadius: "12px", border: "1px solid rgba(57,255,20,0.1)" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ color: "#39FF14", fontSize: "18px" }}>💡</div>
                    <div style={{ fontSize: "12px", color: "#c8c4e0", lineHeight: "1.4" }}>
                      <strong>Tip:</strong> You can always change these settings later in the workspace configuration panel.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspacesScreen;
