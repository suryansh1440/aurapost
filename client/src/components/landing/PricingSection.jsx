import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PLANS = [
  {
    name: 'Starter', price: { monthly: 29, annual: 23 }, desc: 'For solo creators building their presence on Instagram.',
    features: ['30 posts / month', '1 Instagram account', 'AI script generation', 'Trend intelligence feed', 'Basic analytics', 'Auto-scheduling'],
    cta: 'Get started', popular: false,
  },
  {
    name: 'Growth', price: { monthly: 79, annual: 63 }, desc: 'For serious creators and small brands scaling fast.',
    features: ['100 posts / month', '3 Instagram accounts', 'AI video generation (Higgsfield)', 'Full trend engine', 'Scheduler + Meta Graph API', 'Deep analytics dashboard', 'Priority support'],
    cta: 'Start growing', popular: true,
  },
  {
    name: 'Agency', price: { monthly: 249, annual: 199 }, desc: 'Built for agencies managing multiple client accounts.',
    features: ['Unlimited posts', '10 Instagram accounts', 'Multi-provider video gen (Runway, Kling)', 'Team seats + roles', 'White-label exports', 'API access', 'Dedicated account manager'],
    cta: 'Talk to sales', popular: false,
  },
]

const sectionHeader = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const headerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const PricingSection = () => {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">

        <motion.div
          className="flex flex-col items-center text-center gap-4 mb-12"
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.span variants={headerItem} className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Pricing
          </motion.span>
          <motion.h2 variants={headerItem} className="leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#F5F5F5' }}>
            Grow your account.{' '}
            <span style={{ color: '#39FF14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}>Not your workload.</span>
          </motion.h2>
          <motion.p variants={headerItem} className="text-[15px] text-dim max-w-[380px] leading-[1.8]">
            Start free. Scale when you're ready. No hidden fees, no lock-in.
          </motion.p>

          {/* Toggle */}
          <motion.div variants={headerItem} className="flex items-center gap-3 mt-2">
            <span className={`text-[13px] font-medium transition-colors ${!annual ? 'text-ghost' : 'text-dim'}`}>Monthly</span>
            <motion.button
              onClick={() => setAnnual(v => !v)}
              className="relative w-11 h-6 rounded-full border"
              style={{ background: annual ? 'rgba(57,255,20,0.2)' : '#1C1C1C', borderColor: annual ? 'rgba(57,255,20,0.5)' : '#2A2A2A' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full"
                style={{ background: annual ? '#39FF14' : '#6A6A6A' }}
                animate={{ x: annual ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </motion.button>
            <span className={`text-[13px] font-medium transition-colors ${annual ? 'text-ghost' : 'text-dim'}`}>
              Annual
              <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono"
                style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)' }}>
                -20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className="relative flex flex-col rounded-xl p-7"
              style={{
                background: plan.popular ? '#0D0D0D' : '#0A0A0A',
                border: plan.popular ? '1px solid rgba(57,255,20,0.4)' : '1px solid #1C1C1C',
                boxShadow: plan.popular ? '0 0 40px rgba(57,255,20,0.08)' : 'none',
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, boxShadow: plan.popular ? '0 0 60px rgba(57,255,20,0.12)' : '0 0 20px rgba(57,255,20,0.04)' }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full"
                  style={{ fontFamily: 'var(--font-mono)', background: '#39FF14', color: '#000' }}
                  initial={{ opacity: 0, scale: 0.8, y: -4 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Most popular
                </motion.div>
              )}

              <div className="h-px w-full rounded-full mb-6" style={{ background: plan.popular ? '#39FF14' : '#1C1C1C' }} />

              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: 'var(--font-mono)', color: plan.popular ? '#39FF14' : '#6A6A6A' }}>
                  {plan.name}
                </div>
                <div className="text-[13px] text-dim leading-[1.65]">{plan.desc}</div>
              </div>

              <div className="flex items-end gap-1 mb-7">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={annual ? 'annual' : 'monthly'}
                    className="font-mono text-[44px] font-semibold tracking-tight leading-none"
                    style={{ fontFamily: 'var(--font-mono)', color: plan.popular ? '#39FF14' : '#F5F5F5', textShadow: plan.popular ? '0 0 20px rgba(57,255,20,0.4)' : 'none' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[13px] text-dim mb-1">/mo</span>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <motion.li key={f} className="flex items-center gap-2.5 text-[13px] text-dim"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + fi * 0.05, duration: 0.3 }}
                  >
                    <span style={{ color: plan.popular ? '#39FF14' : '#3A3A3A', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>✓</span>
                    {f}
                  </motion.li>
                ))}
              </ul>

              {plan.popular ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signup" className="btn-neon w-full text-center py-3 text-[14px] font-semibold rounded-[6px] block">{plan.cta}</Link>
                </motion.div>
              ) : (
                <Link to="/signup" className="w-full text-center py-3 text-[14px] font-medium rounded-[6px] block transition-all duration-200 text-dim border border-border hover:border-border-bright hover:text-ghost">
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <motion.div
          className="mt-4 flex items-center justify-between px-7 py-5 rounded-xl"
          style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div>
            <div className="text-[13px] font-semibold text-ghost mb-0.5">Enterprise</div>
            <div className="text-[12px] text-dim">Custom models · SLA · Dedicated infra · Unlimited accounts</div>
          </div>
          <motion.a href="mailto:hello@aurapost.io"
            className="px-5 py-2 text-[13px] font-medium text-dim border border-border rounded-[6px] whitespace-nowrap"
            whileHover={{ borderColor: 'rgba(57,255,20,0.4)', color: '#F5F5F5' }}
          >
            Contact sales →
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
