import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 29, annual: 23 },
    desc: 'For solo creators building their presence on Instagram.',
    features: [
      '30 posts / month',
      '1 Instagram account',
      'AI script generation',
      'Trend intelligence feed',
      'Basic analytics',
      'Auto-scheduling',
    ],
    cta: 'Get started free',
    popular: false,
  },
  {
    name: 'Growth',
    price: { monthly: 79, annual: 63 },
    desc: 'For serious creators and small brands scaling fast.',
    features: [
      '100 posts / month',
      '3 Instagram accounts',
      'AI video generation (Higgsfield)',
      'Full trend engine',
      'Scheduler + Meta Graph API',
      'Deep analytics dashboard',
      'Priority support',
    ],
    cta: 'Start growing',
    popular: true,
  },
  {
    name: 'Agency',
    price: { monthly: 249, annual: 199 },
    desc: 'Built for agencies managing multiple client accounts.',
    features: [
      'Unlimited posts',
      '10 Instagram accounts',
      'Multi-provider video gen (Runway, Kling)',
      'Team seats + roles',
      'White-label exports',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Talk to sales',
    popular: false,
  },
]

const FAQ = [
  { q: 'Is there a free trial?', a: 'Yes — every plan starts with a 14-day free trial. No credit card required to sign up.' },
  { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade anytime from your dashboard. Changes take effect immediately.' },
  { q: 'What AI models power the video generation?', a: 'AuraPost integrates with Higgsfield AI, RunwayML, and Kling. We automatically fall back if one provider is unavailable.' },
  { q: 'Do I need to own a camera or record anything?', a: 'Never. AuraPost generates photorealistic video from your script using AI — no footage, no camera, no filming required.' },
  { q: 'Is my Instagram account safe?', a: 'Yes. We connect via the official Meta Graph API using OAuth 2.0. We never store your password.' },
  { q: 'What happens when I hit my post limit?', a: 'Your posts queue and wait until the next billing cycle, or you can upgrade immediately to resume publishing.' },
]

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const PricingPage = () => {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen pt-28 pb-24 relative">
      {/* Grid bg */}
      <div className="absolute inset-0 terminal-grid opacity-30 pointer-events-none" />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(57,255,20,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div className="flex flex-col items-center text-center gap-5 mb-16"
          variants={container} initial="hidden" animate="visible">
          <motion.span variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Pricing
          </motion.span>
          <motion.h1 variants={item} className="leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: '#F5F5F5' }}>
            Grow your account.{' '}
            <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>Not your workload.</span>
          </motion.h1>
          <motion.p variants={item} className="text-[16px] text-dim max-w-[440px] leading-[1.8]">
            Start free. Scale when you're ready. No hidden fees, no lock-in.
          </motion.p>

          {/* Toggle */}
          <motion.div variants={item} className="flex items-center gap-3">
            <span className={`text-[13px] font-medium transition-colors ${!annual ? 'text-ghost' : 'text-dim'}`}>Monthly</span>
            <motion.button onClick={() => setAnnual(v => !v)}
              className="relative w-11 h-6 rounded-full border"
              style={{ background: annual ? 'rgba(57,255,20,0.2)' : '#1C1C1C', borderColor: annual ? 'rgba(57,255,20,0.5)' : '#2A2A2A' }}
              whileTap={{ scale: 0.95 }}>
              <motion.span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full"
                style={{ background: annual ? '#39FF14' : '#6A6A6A' }}
                animate={{ x: annual ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
            </motion.button>
            <span className={`text-[13px] font-medium transition-colors ${annual ? 'text-ghost' : 'text-dim'}`}>
              Annual{' '}
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono"
                style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)' }}>
                -20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name}
              className="relative flex flex-col rounded-xl p-7"
              style={{
                background: plan.popular ? '#0D0D0D' : '#0A0A0A',
                border: plan.popular ? '1px solid rgba(57,255,20,0.4)' : '1px solid #1C1C1C',
                boxShadow: plan.popular ? '0 0 60px rgba(57,255,20,0.08)' : 'none',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4 }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full"
                  style={{ fontFamily: 'var(--font-mono)', background: '#39FF14', color: '#000' }}>
                  Most popular
                </div>
              )}
              <div className="h-px w-full mb-6" style={{ background: plan.popular ? '#39FF14' : '#1C1C1C' }} />
              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: 'var(--font-mono)', color: plan.popular ? '#39FF14' : '#6A6A6A' }}>
                  {plan.name}
                </div>
                <div className="text-[13px] text-dim leading-[1.65]">{plan.desc}</div>
              </div>
              <div className="flex items-end gap-1 mb-7">
                <AnimatePresence mode="wait">
                  <motion.span key={annual ? 'a' : 'm'}
                    className="font-mono text-[44px] font-semibold tracking-tight leading-none"
                    style={{ fontFamily: 'var(--font-mono)', color: plan.popular ? '#39FF14' : '#F5F5F5', textShadow: plan.popular ? '0 0 20px rgba(57,255,20,0.4)' : 'none' }}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}>
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[13px] text-dim mb-1">/mo</span>
              </div>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <motion.li key={f} className="flex items-center gap-2.5 text-[13px] text-dim"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + fi * 0.05 }}>
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

        {/* Enterprise */}
        <motion.div className="flex items-center justify-between px-7 py-5 rounded-xl mb-20"
          style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div>
            <div className="text-[13px] font-semibold text-ghost mb-0.5">Enterprise</div>
            <div className="text-[12px] text-dim">Custom models · SLA · Dedicated infra · Unlimited accounts</div>
          </div>
          <motion.a href="mailto:hello@aurapost.io"
            className="px-5 py-2 text-[13px] font-medium text-dim border border-border rounded-[6px] whitespace-nowrap"
            whileHover={{ borderColor: 'rgba(57,255,20,0.4)', color: '#F5F5F5' }}>
            Contact sales →
          </motion.a>
        </motion.div>

        {/* FAQ */}
        <motion.div className="max-w-[720px] mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
              <span style={{ opacity: 0.6 }}>//</span> FAQ
            </span>
            <h2 className="text-[28px] font-bold text-ghost mt-4">Common questions</h2>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: '#1C1C1C' }}>
            {FAQ.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  className="w-full flex items-center justify-between text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-[14.5px] font-medium text-ghost">{faq.q}</span>
                  <motion.span className="text-dim flex-shrink-0 text-lg font-mono"
                    animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p className="text-[13px] text-dim leading-[1.8] mt-3 pr-8"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}>
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PricingPage
