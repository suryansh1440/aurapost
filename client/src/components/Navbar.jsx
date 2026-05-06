import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

const NAV_LINKS = [
  { label: 'Pricing',      href: '/pricing',    anchor: false },
  { label: 'About',        href: '/about',      anchor: false },
  { label: 'Blog',         href: '/blog',       anchor: false },
]

/* ── Shared variants ──────────────────────────────────────────────── */
const navContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}
const navItem = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}
const mobileMenu = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, height: 0,    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
}
const mobileItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef(null)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  /* Scroll-linked background */
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const smoothScroll = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  /* Close avatar dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setAvatarOpen(false)
    navigate('/')
  }

  /* Avatar initial from user name */
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ borderBottomColor: `rgba(28,28,28,${borderOpacity})` }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-[1.5px] z-50"
        style={{
          scaleX: useTransform(scrollY, [0, 3000], [0, 1]),
          transformOrigin: '0%',
          background: '#39FF14',
          boxShadow: '0 0 8px rgba(57,255,20,0.6)',
          right: 0,
        }}
      />

      <motion.div
        className="transition-all duration-300 border-b"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderColor: scrolled ? '#1C1C1C' : 'transparent',
          paddingTop:  scrolled ? '12px' : '16px',
          paddingBottom: scrolled ? '12px' : '16px',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-6">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/logos/logo_aurapost.png" alt="AuraPost logo" className="w-12 h-12 object-contain" />
              <span className="font-sans text-[16px] font-semibold text-ghost tracking-tight">AuraPost</span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            className="hidden md:flex items-center gap-0.5 mx-auto"
            variants={navContainer}
            initial="hidden"
            animate="visible"
          >
            {NAV_LINKS.map(link => {
              const sharedProps = {
                className: 'px-3.5 py-1.5 text-[13px] text-dim rounded font-medium tracking-wide relative group block',
              }
              const underline = (
                <motion.span
                  className="absolute bottom-0 left-3.5 right-3.5 h-px"
                  style={{ background: '#39FF14', originX: 0 }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )
              return (
                <motion.div key={link.label} variants={navItem} whileHover={{ color: '#F5F5F5' }} transition={{ duration: 0.15 }}>
                  <Link
                    to={link.href}
                    onClick={link.anchor ? (e) => smoothScroll(e, link.href) : undefined}
                    className={sharedProps.className}
                  >
                    {link.label}{underline}
                  </Link>
                </motion.div>
              )
            })}
          </motion.nav>

          {/* Desktop CTA */}
          <motion.div
            className="hidden md:flex items-center gap-3 flex-shrink-0"
            variants={navContainer}
            initial="hidden"
            animate="visible"
          >
            {isAuthenticated ? (
              <motion.div variants={navItem} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/dashboard" className="btn-neon px-5 py-2 text-[13px] font-semibold rounded-[6px] inline-flex items-center gap-1.5">
                  Dashboard
                  <span className="font-mono text-[11px] opacity-70">&rarr;</span>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div variants={navItem}>
                  <Link to="/login" className="px-4 py-2 text-[13px] font-medium text-dim rounded hover:text-ghost transition-colors duration-200">
                    Log in
                  </Link>
                </motion.div>
                <motion.div variants={navItem} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signup" className="btn-neon px-5 py-2 text-[13px] font-semibold rounded-[6px] inline-flex items-center gap-1.5">
                    Sign up
                    <span className="font-mono text-[11px] opacity-70">&rarr;</span>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden ml-auto flex flex-col gap-[5px] p-1.5 rounded"
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-[1.5px] bg-dim rounded origin-center"
              animate={mobileOpen ? { rotate: 45, y: 6.5, background: '#39FF14' } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-dim rounded"
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-dim rounded origin-center"
              animate={mobileOpen ? { rotate: -45, y: -6.5, background: '#39FF14' } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid #1C1C1C' }}
          >
            <motion.div
              className="px-4 py-4 flex flex-col gap-1"
              variants={navContainer}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map(link => (
                <motion.div key={link.label} variants={mobileItem}>
                  <Link
                    to={link.href}
                    onClick={(e) => { 
                      if (link.anchor) smoothScroll(e, link.href); 
                      setMobileOpen(false); 
                    }}
                    className="block px-3 py-2.5 text-[14px] text-dim rounded hover:text-ghost transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <motion.div variants={mobileItem}>
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                          style={{ background: 'rgba(57,255,20,0.15)', color: '#39FF14', border: '1.5px solid rgba(57,255,20,0.4)', fontFamily: 'var(--font-mono)' }}>
                          {initials}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-ghost">{user?.name?.split(' ')[0]}</div>
                          <div className="text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div variants={mobileItem} whileTap={{ scale: 0.97 }}>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                        className="btn-neon w-full block text-center py-2.5 text-[14px] font-semibold rounded-[6px]">
                        Dashboard →
                      </Link>
                    </motion.div>
                    <motion.div variants={mobileItem}>
                      <button onClick={handleLogout}
                        className="w-full text-center py-2 text-[13px] font-medium rounded transition-colors"
                        style={{ color: '#FF5F57' }}>
                        Log out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={mobileItem}>
                      <Link to="/login" onClick={() => setMobileOpen(false)}
                        className="w-full block text-center py-2.5 text-[14px] font-medium text-dim border border-border rounded hover:border-border-bright hover:text-ghost transition-all duration-200">
                        Log in
                      </Link>
                    </motion.div>
                    <motion.div variants={mobileItem} whileTap={{ scale: 0.97 }}>
                      <Link to="/signup" onClick={() => setMobileOpen(false)}
                        className="btn-neon w-full block text-center py-2.5 text-[14px] font-semibold rounded-[6px]">
                        Sign up →
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar