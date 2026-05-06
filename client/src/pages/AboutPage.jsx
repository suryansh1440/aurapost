import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const TEAM = [
  { name: 'Surya', role: 'Founder & CEO', init: 'S', color: '#39FF14', bio: 'Building the future of content automation for creators and brands.' },
  { name: 'Mia T.', role: 'Head of AI', init: 'M', color: '#2DCB96', bio: 'LLM pipelines, LangGraph agents, and making AI sound human.' },
  { name: 'James O.', role: 'Lead Engineer', init: 'J', color: '#8F88E8', bio: 'FastAPI, Celery, BunnyCDN — everything that runs in prod.' },
]

const VALUES = [
  { icon: '⚡', title: 'Speed over perfection', desc: 'Creators need to move fast. We ship tools that get content live, not tools that look good in demos.' },
  { icon: '🤖', title: 'AI that sounds human', desc: 'We obsess over voice calibration. AuraPost content should be indistinguishable from your own posts.' },
  { icon: '🔒', title: 'Privacy by default', desc: 'OAuth 2.0 only. We never see your password. We never sell your data. Period.' },
  { icon: '🌍', title: 'Built for scale', desc: 'Whether you manage 1 account or 100, the infrastructure doesn\'t break. Celery queues, multi-region CDN.' },
]

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const AboutPage = () => (
  <div className="min-h-screen pt-28 pb-24 relative">
    {/* Grid bg */}
    <div className="absolute inset-0 terminal-grid opacity-30 pointer-events-none" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at top, rgba(57,255,20,0.08) 0%, transparent 70%)' }} />

    <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col gap-24">

      {/* Hero */}
      <motion.div className="max-w-[760px]" variants={container} initial="hidden" animate="visible">
        <motion.span variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest mb-6"
          style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
          <span style={{ opacity: 0.6 }}>//</span> About us
        </motion.span>
        <motion.h1 variants={item} className="leading-[1.1] tracking-tight mb-6"
          style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: '#F5F5F5' }}>
          We built the tool we{' '}
          <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>wished existed.</span>
        </motion.h1>
        <motion.p variants={item} className="text-[16px] text-dim leading-[1.9] max-w-[600px]">
          AuraPost started as a weekend project — a frustrated creator's attempt to stop spending 4 hours a day on content that nobody saw.
          Today it's the AI-powered content pipeline trusted by 8,200+ creators and agencies worldwide.
        </motion.p>
      </motion.div>

      {/* Stats row */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden"
        style={{ border: '1px solid #1C1C1C' }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        {[
          { val: '8,200+', label: 'Active creators' },
          { val: '2.4M+',  label: 'Videos generated' },
          { val: '127',    label: 'Trends detected/day' },
          { val: '98%',    label: 'Satisfaction rate' },
        ].map((s, i) => (
          <motion.div key={i} className="relative flex flex-col gap-2 p-8 group"
            style={{ background: '#0A0A0A', borderRight: i < 3 ? '1px solid #1C1C1C' : 'none' }}
            whileHover={{ background: '#0F0F0F' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(57,255,20,0.4)' }} />
            <div className="font-mono text-[36px] font-semibold tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>
              {s.val}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-dim font-medium">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest mb-5"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Our mission
          </span>
          <h2 className="text-[32px] font-bold text-ghost leading-[1.2] mb-5">
            Content shouldn't require a crew.
          </h2>
          <p className="text-[15px] text-dim leading-[1.9] mb-4">
            The internet rewards consistency, but burnout is real. Cameras, editing suites, and content teams are out of reach for most creators.
          </p>
          <p className="text-[15px] text-dim leading-[1.9]">
            We believe AI should democratize creative power — not replace creativity, but handle the heavy lifting so your ideas reach more people, faster.
          </p>
        </div>
        <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.2)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #39FF14, transparent)' }} />
          <div className="font-mono text-[13px] text-dim leading-[2] space-y-1" style={{ fontFamily: 'var(--font-mono)' }}>
            {['> detecting trends...', '> generating script...', '> sending to higgsfield...', '> adding voiceover...', '> scheduling for peak time...', '> published. ✓'].map((line, i) => (
              <motion.div key={i} style={{ color: i === 5 ? '#39FF14' : undefined }}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.3 }}>
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <div>
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Our values
          </span>
          <h2 className="text-[32px] font-bold text-ghost mt-4">What we stand for</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VALUES.map((v, i) => (
            <motion.div key={i} className="flex gap-5 p-7 rounded-xl group"
              style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ borderColor: 'rgba(57,255,20,0.2)', y: -3 }}>
              <div className="text-[28px] flex-shrink-0">{v.icon}</div>
              <div>
                <h3 className="text-[15px] font-semibold text-ghost mb-1.5">{v.title}</h3>
                <p className="text-[13px] text-dim leading-[1.75]">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Team
          </span>
          <h2 className="text-[32px] font-bold text-ghost mt-4">The people building AuraPost</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEAM.map((t, i) => (
            <motion.div key={i} className="flex flex-col items-center text-center gap-4 p-8 rounded-xl"
              style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ borderColor: 'rgba(57,255,20,0.2)', y: -3 }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-bold"
                style={{ background: t.color, color: '#000', fontFamily: 'var(--font-mono)' }}>
                {t.init}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-ghost">{t.name}</div>
                <div className="text-[11px] font-mono text-dim mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>{t.role}</div>
              </div>
              <p className="text-[13px] text-dim leading-[1.7]">{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div className="flex flex-col items-center text-center gap-5 py-16 rounded-2xl relative overflow-hidden"
        style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.2)' }}
        initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, #39FF14, transparent)' }} />
        <h2 className="text-[32px] font-bold text-ghost">Ready to post with presence?</h2>
        <p className="text-[15px] text-dim max-w-[380px]">Start for free. No credit card. No camera.</p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link to="/signup" className="btn-neon inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-bold rounded-[6px]">
            Get started free →
          </Link>
        </motion.div>
      </motion.div>

    </div>
  </div>
)

export default AboutPage
