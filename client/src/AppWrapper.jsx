import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useAuthStore } from './store/authStore'
import FullScreenSplash from './components/loader/FullScreenSplash'

const AppWrapper = () => {
  const { getMe, isFetchingMe } = useAuthStore()

  useEffect(() => {
    getMe()
  }, [getMe])

  if (isFetchingMe) {
    return <FullScreenSplash />
  }

  return <Outlet />
}

export default AppWrapper
