import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features',     href: '#features'     },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing',      href: '#pricing'       },
    { label: 'Changelog',    href: '#'              },
  ],
  Company: [
    { label: 'About',   href: '#' },
    { label: 'Blog',    href: '#blog' },
    { label: 'Careers', href: '#' },
    { label: 'Press',   href: '#' },
  ],
  Legal: [
    { label: 'Privacy',  href: '#' },
    { label: 'Terms',    href: '#' },
    { label: 'Cookies',  href: '#' },
  ],
}

/* ── Variants ─────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const colVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}
const linkVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const Footer = () => {
  const smoothScroll = (e, href) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-void">
      {/* Neon top accent */}
      <motion.div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(57,255,20,0.5) 30%, rgba(57,255,20,0.8) 50%, rgba(57,255,20,0.5) 70%, transparent 100%)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Brand col */}
          <motion.div className="col-span-2 flex flex-col gap-4" variants={colVariants}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Link to="/" className="flex items-center">
                <img src="/logos/logo_aurapost.png" alt="AuraPost" className="w-12 h-12 object-contain" />
                <span className="text-[16px] font-semibold text-ghost tracking-tight">AuraPost</span>
              </Link>
            </motion.div>

            <p className="text-[13px] text-dim leading-[1.8] max-w-[240px]">
              Post with presence. The content automation platform for creators and agencies who grow without burning out.
            </p>

            {/* Status */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#39FF14' }}
                animate={{ scale: [1, 1.4, 1], boxShadow: ['0 0 4px rgba(57,255,20,0.6)', '0 0 12px rgba(57,255,20,1)', '0 0 4px rgba(57,255,20,0.6)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span>sys.status <span style={{ color: '#39FF14' }}>OK</span> — all systems operational</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              {['X', 'IG', 'TK'].map((s, i) => (
                <motion.a
                  key={s}
                  href="#"
                  className="w-8 h-8 border border-border rounded flex items-center justify-center text-[10px] font-mono text-dim"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  whileHover={{ borderColor: '#39FF14', color: '#F5F5F5', scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <motion.div key={group} className="flex flex-col gap-3" variants={colVariants}>
              <div
                className="font-mono text-[10px] font-medium uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', opacity: 0.7 }}
              >
                {group}
              </div>
              <motion.div
                className="flex flex-col gap-2.5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {links.map(link => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => smoothScroll(e, link.href)}
                    className="text-[13px] text-dim w-fit relative group"
                    variants={linkVariants}
                    whileHover={{ color: '#F5F5F5', x: 3 }}
                    transition={{ duration: 0.15 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="font-mono text-[11px] text-dimmer" style={{ fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#39FF14', opacity: 0.7 }}>©</span> 2026 AuraPost Inc. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-dimmer italic" style={{ fontFamily: 'var(--font-mono)' }}>
            // post with presence.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer