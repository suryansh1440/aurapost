import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

export default function DashboardHeader({ collapsed }) {
  const { user } = useAuthStore()
  const [time, setTime] = useState(new Date())
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'AU'

  const fmt = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const day = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="flex-shrink-0 flex items-center gap-4 px-6 h-[60px]"
      style={{ background: '#080808', borderBottom: '1px solid #161616' }}>

      {/* Page title / breadcrumb */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>~/dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-[360px] mx-auto relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim text-[12px]" style={{ fontFamily: 'var(--font-mono)' }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts, campaigns, trends…"
          className="w-full pl-8 pr-4 py-2 text-[12px] rounded-lg outline-none transition-all duration-200"
          style={{
            background: '#111', border: '1px solid #1E1E1E', color: '#F5F5F5',
            fontFamily: 'var(--font-mono)',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.4)'}
          onBlur={e => e.target.style.borderColor = '#1E1E1E'}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        {/* Live clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <span className="text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>◷</span>
          <span className="text-[11px] font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#F5F5F5' }}>{fmt}</span>
          <span className="text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{day}</span>
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ background: '#111', border: '1px solid #1E1E1E' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#F5F5F5' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E1E' }}>
          <span className="text-dim text-[14px]">◎</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,0.8)' }} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg"
          style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: 'rgba(57,255,20,0.15)', color: '#39FF14', border: '1.5px solid rgba(57,255,20,0.3)', fontFamily: 'var(--font-mono)' }}>
            {initials}
          </div>
          <span className="hidden lg:block text-[12px] font-medium text-ghost">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  )
}
