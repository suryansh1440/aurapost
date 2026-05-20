import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState);
  };

  return (
    <div className={`app-shell syne ${isCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
