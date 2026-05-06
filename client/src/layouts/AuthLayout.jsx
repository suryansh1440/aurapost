import { Outlet, Navigate } from 'react-router'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/authStore'

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore()

  // Kick authenticated users away from login/signup
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="h-screen overflow-hidden bg-void text-ghost flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
