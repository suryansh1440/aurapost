import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 8200,  suffix: '+',  label: 'Active creators'      },
  { value: 2400,  suffix: 'K+', label: 'Videos generated'     },
  { value: 127,   suffix: '',   label: 'Trends detected today' },
  { value: 98,    suffix: '%',  label: 'Satisfaction rate'     },
]

const useCountUp = (target, duration = 1800, active = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])
  return count
}

const StatCard = ({ value, suffix, label, active, index }) => {
  const count = useCountUp(value, 1800, active)
  return (
    <motion.div
      className="relative flex flex-col gap-2 p-8 group overflow-hidden"
      style={{ background: '#0A0A0A' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ background: '#0F0F0F' }}
    >
      {/* Top neon accent */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'rgba(57,255,20,0.4)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(57,255,20,0.04), transparent)' }} />

      <div className="font-mono text-[44px] font-semibold tracking-tight leading-none tabular-nums"
        style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] uppercase tracking-widest text-dim font-medium">{label}</div>
    </motion.div>
  )
}

const StatsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-16" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden" style={{ border: '1px solid #1C1C1C' }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} active={isInView} index={i} />)}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
