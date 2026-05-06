import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FullScreenSplash from '../components/loader/FullScreenSplash'

const RootLayout = () => {
  const getMe = useAuthStore(state => state.getMe)
  const isFetchingMe = useAuthStore(state => state.isFetchingMe)

  useEffect(() => {
    getMe()
  }, [getMe])

  if(isFetchingMe){
    return (
      <FullScreenSplash />
    )
  }
  return (
    <div className="min-h-screen bg-void text-ghost flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
