import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const DiagonalTape = () => (
  <div className="absolute inset-x-[-10%] overflow-hidden pointer-events-none" style={{ top: '16%', height: '40px', transform: 'rotate(-4deg)', zIndex: 0 }}>
    <div className="absolute inset-0" style={{ background: '#050505', borderTop: '1px solid rgba(57,255,20,0.5)', borderBottom: '1px solid rgba(57,255,20,0.5)' }} />
    <div className="animate-marquee flex w-max h-full items-center relative z-10">
      {Array(24).fill(null).map((_, i) => (
        <span key={i} className="whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(57,255,20,0.75)', padding: '0 32px' }}>
          AI VIDEO &middot; NO CAMERA &middot; OFFICIALLY LAUNCHED &middot; FREE ACCESS
        </span>
      ))}
    </div>
  </div>
)

const GridBg = () => <div className="absolute inset-0 terminal-grid opacity-60 pointer-events-none" />

const TRENDS = [
  { platform: 'TikTok', topic: 'morning routine productivity hack', heat: '4.2M', badge: '#FF4444' },
  { platform: 'Reddit', topic: 'r/entrepreneur — overnight success myths', heat: '89K',  badge: '#FF6600' },
  { platform: 'X',      topic: '"Build in public" thread going viral',  heat: '2.1M', badge: '#1DA1F2' },
  { platform: 'TikTok', topic: 'silent walking trend is back',          heat: '6.7M', badge: '#FF4444' },
  { platform: 'Reddit', topic: 'r/personalfinance — coffee debt crisis', heat: '41K', badge: '#FF6600' },
]

const trendRow = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const DashboardMockup = () => (
  <motion.div
    className="relative w-full max-w-[780px] mx-auto rounded-xl overflow-hidden shadow-2xl"
    style={{ border: '1px solid rgba(57,255,20,0.2)', boxShadow: '0 0 60px rgba(57,255,20,0.08), 0 40px 80px rgba(0,0,0,0.8)', marginTop: '48px' }}
    initial={{ opacity: 0, y: 40, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
  >
    <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#111111', borderBottom: '1px solid #1C1C1C' }}>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 mx-4 px-3 py-1 rounded text-center text-[11px] text-dim" style={{ background: '#1A1A1A', fontFamily: 'var(--font-mono)', maxWidth: '240px', margin: '0 auto' }}>
        aurapost.com/dashboard
      </div>
      <div className="flex items-center gap-1 text-[10px] font-mono text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
        <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#39FF14' }}
          animate={{ scale: [1, 1.5, 1], boxShadow: ['0 0 4px rgba(57,255,20,0.6)', '0 0 10px rgba(57,255,20,1)', '0 0 4px rgba(57,255,20,0.6)'] }}
          transition={{ duration: 2, repeat: Infinity }} />
        LIVE
      </div>
    </div>
    <div style={{ background: '#0A0A0A', padding: '20px' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[14px] font-semibold text-ghost mb-0.5">Trend Radar</div>
          <div className="font-mono text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#39FF14' }}>127</span> signals detected today
          </div>
        </div>
        <div className="tag-neon">↻ Live</div>
      </div>
      <motion.div className="flex flex-col gap-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}>
        {TRENDS.map((t, i) => (
          <motion.div key={i} variants={trendRow}
            className="flex items-center gap-3 px-4 py-3 rounded-lg group cursor-pointer"
            style={{ background: i === 0 ? 'rgba(57,255,20,0.04)' : '#111111', border: i === 0 ? '1px solid rgba(57,255,20,0.2)' : '1px solid #1C1C1C' }}
            whileHover={{ x: 3 }} transition={{ duration: 0.15 }}
          >
            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#000', background: t.badge, letterSpacing: '0.05em' }}>{t.platform.toUpperCase()}</span>
            <span className="flex-1 text-[12.5px] text-muted truncate">{t.topic}</span>
            <span className="font-mono text-[11px] text-dim flex-shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>{t.heat}</span>
            <button className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#39FF14', color: '#000', fontFamily: 'var(--font-mono)' }}>Generate →</button>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 text-center font-mono text-[10px] text-dimmer" style={{ fontFamily: 'var(--font-mono)' }}>
        Refreshed 2 minutes ago · <span style={{ color: '#39FF14' }}>AUTO</span>
      </div>
    </div>
  </motion.div>
)

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center overflow-hidden pt-32 pb-0">
    <GridBg />
    <DiagonalTape />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(ellipse, rgba(57,255,20,0.06) 0%, transparent 70%)' }} />

    <motion.div
      className="relative z-10 max-w-[860px] mx-auto px-6 flex flex-col items-center text-center gap-7"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Status badge */}
      <motion.div variants={item} className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[11px] font-medium"
          style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.25)' }}>
          <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#39FF14' }}
            animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          AI video generation · no camera needed
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={item} className="leading-[1.08] tracking-[-0.03em]"
        style={{ fontSize: 'clamp(44px,7vw,80px)', fontWeight: 700, color: '#F5F5F5' }}>
        Instagram content{' '}
        <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.8), 0 0 50px rgba(57,255,20,0.4)' }}>
          on full autopilot.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p variants={item} className="text-[16px] text-muted leading-[1.8] max-w-[560px]">
        AuraPost detects trending topics, writes AI scripts, generates realistic videos via Higgsfield & Runway, and publishes at the perfect time — all without you touching a camera.
      </motion.p>

      {/* CTAs */}
      <motion.div variants={item} className="flex items-center gap-4 flex-wrap justify-center">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link to="/signup" className="btn-neon inline-flex items-center gap-2 px-8 py-4 text-[15px] font-bold rounded-[6px]">
            Start for free <span style={{ fontFamily: 'var(--font-mono)' }}>&gt;</span>
          </Link>
        </motion.div>
        <motion.a
          href="#how-it-works"
          onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-medium text-dim border border-border rounded-[6px]"
          whileHover={{ borderColor: 'rgba(57,255,20,0.4)', color: '#F5F5F5', scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          See how it works
        </motion.a>
      </motion.div>

      {/* Social proof */}
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="flex">
          {['#39FF14','#2DCB96','#E8B84B','#8F88E8','#9A9A9A'].map((c, i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 -ml-2 first:ml-0"
              style={{ background: c, borderColor: '#050505', zIndex: 5 - i }} />
          ))}
        </div>
        <p className="text-[13px]">
          <span className="text-ghost font-semibold">8,200+</span>
          <span className="text-dim"> creators already posting on autopilot</span>
        </p>
      </motion.div>
    </motion.div>

    {/* Dashboard mockup */}
    <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6">
      <DashboardMockup />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
    </div>
  </section>
)

export default HeroSection
