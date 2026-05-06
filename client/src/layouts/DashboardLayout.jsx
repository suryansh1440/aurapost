import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="app-shell syne">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
