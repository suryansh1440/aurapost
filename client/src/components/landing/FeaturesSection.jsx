import React from 'react'
import { motion } from 'framer-motion'

const FEATURES = [
  { tag: 'Trend Intelligence',  title: "Know what's viral before it peaks",        desc: "AuraPost scrapes and analyzes trending hashtags, audio, and topics via Meta Graph API and AI models — so you're always ahead of the curve.",   detail: 'Updated every 30 min. Filtered by niche automatically.',       icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M5 14L10 10L15 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="18" r="1" fill="currentColor"/></svg>) },
  { tag: 'AI Script Engine',    title: 'Hooks and scripts written by AI',           desc: "LangGraph agents generate viral hooks, full scripts, and captions from trending topics or your custom prompt — in your voice, every time.",       detail: 'Powered by Claude Sonnet. Zero robotic output.',              icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h9M3 15h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M15 14l1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>) },
  { tag: 'AI Video Generation', title: 'Realistic video. No camera.',               desc: 'Send the script to Higgsfield AI, RunwayML, or Kling. AuraPost polls for output, downloads it, and stores it — ready to post.',               detail: 'Multi-provider fallback. Never miss a post.',                  icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M14 8l4-2v8l-4-2V8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>) },
  { tag: 'Post Composer',       title: 'Review and refine in 30 seconds',          desc: 'Preview the AI video, edit the caption, pick a thumbnail, add licensed music, and optimize hashtags — all before it goes live.',                detail: 'Epidemic Sound integration for licensed Reels audio.',         icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>) },
  { tag: 'Smart Scheduler',     title: 'Publish at the perfect moment',             desc: "Celery-powered time-zone-aware scheduler posts via Meta Graph API at your audience's peak engagement window — automatically.",                  detail: 'Reels, carousels, and static posts all supported.',            icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3"/><path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>) },
  { tag: 'Analytics Dashboard', title: 'Growth you can actually read',              desc: 'Pull Instagram Insights directly — reach, engagement, follower growth, and revenue attribution — all in one clean view. No spreadsheets.',       detail: 'A/B test variants. Auto-promote the winner.',                 icon: (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 16L7 11L11 14L15 8L19 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 4H19V16H3V4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>) },
]

const sectionHeader = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const headerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const FeatureCard = ({ feature, index }) => {
  const { tag, title, desc, detail, icon } = feature
  const col = index % 3
  const row = Math.floor(index / 3)

  return (
    <motion.div
      className="relative flex flex-col gap-3 p-7 cursor-default group overflow-hidden"
      style={{
        background: '#0A0A0A',
        borderRight: col !== 2 ? '1px solid #1C1C1C' : 'none',
        borderBottom: row < 1 ? '1px solid #1C1C1C' : 'none',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (col * 0.08) + (row * 0.15), ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ background: '#0F0F0F' }}
    >
      {/* Top neon line on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: '#39FF14', scaleX: 0, originX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Hover glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.1), transparent 70%)' }} />

      {/* Icon */}
      <motion.div
        className="w-9 h-9 rounded-[6px] flex items-center justify-center flex-shrink-0 border"
        style={{ color: '#6A6A6A', background: '#111111', borderColor: '#1C1C1C' }}
        whileHover={{ color: '#39FF14', background: 'rgba(57,255,20,0.08)', borderColor: 'rgba(57,255,20,0.3)' }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>

      {/* Tag */}
      <span className="self-start text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded border transition-all duration-200 group-hover:text-[#39FF14] group-hover:border-[rgba(57,255,20,0.2)] group-hover:bg-[rgba(57,255,20,0.06)]"
        style={{ fontFamily: 'var(--font-mono)', color: '#6A6A6A', background: '#111111', borderColor: '#1C1C1C' }}>
        {tag}
      </span>

      <h3 className="text-[14.5px] font-semibold text-ghost leading-snug">{title}</h3>
      <p className="text-[13px] text-dim leading-[1.75]">{desc}</p>
      <p className="text-[11.5px] text-dimmer italic mt-auto">{detail}</p>
    </motion.div>
  )
}

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="max-w-[1200px] mx-auto px-6">
      <motion.div
        className="flex flex-col items-center text-center gap-4 mb-16"
        variants={sectionHeader}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.span variants={headerItem} className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
          <span style={{ opacity: 0.6 }}>//</span> Platform modules
        </motion.span>
        <motion.h2 variants={headerItem} className="leading-[1.15] tracking-tight"
          style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#F5F5F5' }}>
          One platform.{' '}
          <span style={{ color: '#39FF14', textShadow: '0 0 15px rgba(57,255,20,0.6)' }}>Every tool you need.</span>
        </motion.h2>
        <motion.p variants={headerItem} className="text-[15px] text-dim max-w-[460px] leading-[1.8]">
          From trend detection to published video — AuraPost handles the full pipeline. You just approve.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-xl overflow-hidden" style={{ border: '1px solid #1C1C1C' }}>
        {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
      </div>
    </div>
  </section>
)

export default FeaturesSection
