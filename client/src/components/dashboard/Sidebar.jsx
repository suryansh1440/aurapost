import React from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Icons } from "../../utils/dashboardData";
import { useAuthStore } from "../../store/authStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

const Sidebar = () => {
  const location = useLocation();
  const { wsId } = useParams();
  const { workspaces } = useWorkspaceStore();

  const isWorkspaceContext = location.pathname.includes("/workspaces/") && wsId;
  const currentWs = isWorkspaceContext ? workspaces.find(w => w._id === wsId) : null;

  const isActive = (path, exact = true) => 
    exact ? location.pathname === path : location.pathname.startsWith(path);
  
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
        <div className="sidebar-logo-mark" style={{ background: 'none' }}>
          <img src="/logos/logo_aurapost.png" alt="AuraPost" style={{ width: '58px', height: '58px', objectFit: 'contain' }} />
        </div>
        <div className="sidebar-logo-text" style={{ fontSize: '18px' }}>AuraPost</div>
      </Link>

      <div className="sidebar-section" style={{ marginTop: "1rem" }}>
        {isWorkspaceContext && currentWs ? (
          <>
            <div className="sidebar-section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {currentWs.workspaceLogo ? (
                   <img src={currentWs.workspaceLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                   <span style={{ fontSize: '16px' }}>{currentWs.emoji}</span>
                )}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentWs.name}</span>
            </div>
            
            <Link to="/dashboard/workspaces" className="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to Workspaces</span>
            </Link>

            <Link to={`/dashboard/workspaces/${wsId}`} className={`nav-item ${isActive(`/dashboard/workspaces/${wsId}`) ? 'active' : ''}`} style={{ marginTop: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.home} />
              </svg>
              <span>Workspace Home</span>
            </Link>
            <Link to={`/dashboard/workspaces/${wsId}/create`} className={`nav-item ${isActive(`/dashboard/workspaces/${wsId}/create`) ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.plus} />
              </svg>
              <span>Create Content</span>
            </Link>
            <Link to={`/dashboard/workspaces/${wsId}/characters`} className={`nav-item ${isActive(`/dashboard/workspaces/${wsId}/characters`) ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.users} />
              </svg>
              <span>AI Characters</span>
            </Link>
            <Link to={`/dashboard/workspaces/${wsId}/trends`} className={`nav-item ${isActive(`/dashboard/workspaces/${wsId}/trends`) ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.trending} />
              </svg>
              <span>Trending Ideas</span>
              <span className="nav-badge">New</span>
            </Link>
            <Link to={`/dashboard/workspaces/${wsId}/posts`} className={`nav-item ${isActive(`/dashboard/workspaces/${wsId}/posts`) ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.layers} />
              </svg>
              <span>Post Queue</span>
            </Link>
          </>
        ) : (
          <>
            <div className="sidebar-section-label">Main</div>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.home} />
              </svg>
              <span>Overview</span>
            </Link>
            <Link to="/dashboard/workspaces" className={`nav-item ${isActive('/dashboard/workspaces') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.workspace} />
              </svg>
              <span>Workspaces</span>
              {workspaces.length > 0 && <span className="nav-badge">{workspaces.length}</span>}
            </Link>
            <Link to="/dashboard/analytics" className={`nav-item ${isActive('/dashboard/analytics') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.chart} />
              </svg>
              <span>Analytics</span>
            </Link>
            <Link to="/dashboard/scheduler" className={`nav-item ${isActive('/dashboard/scheduler') ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.calendar} />
              </svg>
              <span>Scheduler</span>
            </Link>

            <div className="sidebar-section-label" style={{ marginTop: "2rem" }}>Configuration</div>
            <Link to="/dashboard/settings" className={`nav-item ${isActive('/dashboard/settings', false) ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={Icons.settings} />
              </svg>
              <span>Settings</span>
            </Link>
          </>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="user-chip" onClick={handleLogout} style={{ color: '#ff7675' }}>
          <div className="avatar" style={{ background: "rgba(255,118,117,0.15)", color: "#ff7675" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#ff7675" }}>Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
