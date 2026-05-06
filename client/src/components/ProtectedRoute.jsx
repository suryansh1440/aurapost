import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../store/authStore'
import FullScreenSplash from '../components/loader/FullScreenSplash'

const ProtectedRoute = () => {
  const { isAuthenticated, isFetchingMe, getMe } = useAuthStore()

  useEffect(() => {
    getMe()
  }, [getMe])

  if (isFetchingMe) return <FullScreenSplash />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
