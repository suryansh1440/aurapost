import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}

const CTASection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 terminal-grid opacity-40 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-15 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse, #39FF14 0%, transparent 70%)' }} />

    <div className="max-w-[1200px] mx-auto px-6">
      <motion.div
        className="relative flex flex-col items-center text-center gap-6 px-8 py-16 rounded-xl overflow-hidden"
        style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.2)' }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top neon line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #39FF14, transparent)' }}
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: '192px', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        <motion.div
          className="flex flex-col items-center gap-6 w-full"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Badge */}
          <motion.div variants={item} className="flex items-center gap-2">
            <motion.span className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#39FF14' }}
              animate={{ scale: [1, 1.4, 1], boxShadow: ['0 0 4px rgba(57,255,20,0.6)', '0 0 12px rgba(57,255,20,1)', '0 0 4px rgba(57,255,20,0.6)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>
              Your aura starts here
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2 variants={item} className="leading-[1.1] tracking-tight max-w-[580px]"
            style={{ fontSize: 'clamp(30px,5vw,54px)', fontWeight: 700, color: '#F5F5F5' }}>
            No camera. No editor.
            <br />
            <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.7)' }}>Just growth.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p variants={item} className="text-[15px] text-dim max-w-[440px] leading-[1.8]">
            AuraPost handles trends, scripts, AI video, and publishing — end to end. Start for free, no credit card required.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex items-center gap-3 flex-wrap justify-center mt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/signup" className="btn-neon inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-bold rounded-[6px]">
                Try for free <span style={{ fontFamily: 'var(--font-mono)' }}>&gt;</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-medium text-dim border border-border rounded-[6px] hover:border-border-bright hover:text-ghost transition-colors duration-200">
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust items */}
          <motion.div variants={item} className="flex items-center gap-6 flex-wrap justify-center pt-2">
            {['No credit card', 'Cancel anytime', '14-day trial'].map((t, i) => (
              <motion.span key={i}
                className="flex items-center gap-1.5 text-[12px] text-dim font-mono"
                style={{ fontFamily: 'var(--font-mono)' }}
                whileHover={{ color: '#F5F5F5' }}
              >
                <span style={{ color: '#39FF14' }}>✓</span> {t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>
)

export default CTASection
