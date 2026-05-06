import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEP_H = 92    // px per step row
const FILL_MS = 2800  // ms per segment (total = FILL_MS * (n-1))
const END_PAUSE = 2000  // pause at step 5 before reset

const STEPS = [
  {
    num: '01', tag: 'META API',
    title: 'Connect your Instagram',
    desc: "Link your account via Meta OAuth in seconds. AuraPost reads your existing posts to calibrate your voice, audience, and what's already working.",
    visual: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: '#111', border: '1px solid rgba(57,255,20,0.2)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: 'rgba(57,255,20,0.15)', color: '#39FF14', border: '1.5px solid rgba(57,255,20,0.4)', fontFamily: 'var(--font-mono)' }}>AP</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ghost">@yourbrand</div>
            <div className="text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Connected via Meta OAuth</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#39FF14' }} />
            LIVE
          </div>
        </div>
        {[{ label: 'Analyzing voice…', pct: 88 }, { label: 'Reading 47 posts…', pct: 60 }, { label: 'Calibrating tone…', pct: 35 }].map((t, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[11px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{t.label}</span>
              <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>{t.pct}%</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: '#1C1C1C' }}>
              <motion.div className="h-1 rounded-full" style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,0.5)' }}
                initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '02', tag: 'AI ENGINE',
    title: 'Pick a trend or custom topic',
    desc: 'The trend engine surfaces viral hashtags in your niche in real-time. Or type your own prompt. AuraPost generates the script and hook automatically.',
    visual: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#111', border: '1px solid rgba(57,255,20,0.3)' }}>
          <span className="text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{'>'}</span>
          <span className="text-ghost text-[13px]">morning routine</span>
          <span style={{ color: '#39FF14', fontFamily: 'var(--font-mono)' }}>_</span>
        </div>
        {[{ tag: '#morningroutine', views: '4.2M', heat: 95 }, { tag: '#productivityhacks', views: '2.8M', heat: 72 }, { tag: '#dayinmylife', views: '1.9M', heat: 54 }].map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: i === 0 ? 'rgba(57,255,20,0.04)' : '#111', border: i === 0 ? '1px solid rgba(57,255,20,0.2)' : '1px solid #1C1C1C' }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#39FF14', opacity: 1 - i * 0.25 }} />
            <span className="flex-1 text-[12px] text-ghost" style={{ fontFamily: 'var(--font-mono)' }}>{t.tag}</span>
            <div className="w-14 h-1 rounded-full" style={{ background: '#1C1C1C' }}>
              <div className="h-1 rounded-full" style={{ width: `${t.heat}%`, background: 'rgba(57,255,20,0.5)' }} />
            </div>
            <span className="text-[11px] text-dim w-10 text-right" style={{ fontFamily: 'var(--font-mono)' }}>{t.views}</span>
          </div>
        ))}
        <div className="flex justify-end">
          <button className="btn-neon text-[11px] font-bold px-3 py-1.5 rounded-lg">Generate script →</button>
        </div>
      </div>
    ),
  },
  {
    num: '03', tag: 'VIDEO GEN',
    title: 'AI generates your video',
    desc: 'Your script goes to Higgsfield AI or RunwayML for photorealistic video generation. ElevenLabs adds a natural voiceover. Zero camera needed.',
    visual: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {['Higgsfield', 'Runway', 'Kling'].map((p, i) => (
            <span key={p} className="text-[9px] font-bold px-2 py-0.5 rounded"
              style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? '#000' : '#3A3A3A', background: i === 0 ? '#39FF14' : '#111', border: `1px solid ${i === 0 ? '#39FF14' : '#1C1C1C'}` }}>
              {p.toUpperCase()}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>~40s</span>
        </div>
        <div className="p-3.5 rounded-xl flex flex-col gap-2.5" style={{ background: '#111', border: '1px solid #1C1C1C' }}>
          {[{ label: 'Script → Higgsfield API', done: true }, { label: 'Video rendering…', done: true }, { label: 'ElevenLabs voiceover…', done: false }].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: s.done ? '#39FF14' : '#3A3A3A' }}>
              <span>{s.done ? '✓' : '○'}</span>{s.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#111' }}>
            <motion.div className="h-2 rounded-full" style={{ background: '#39FF14', boxShadow: '0 0 10px rgba(57,255,20,0.6)' }}
              initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.8 }} />
          </div>
          <div className="flex justify-between text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="text-dim">Rendering video…</span>
            <span style={{ color: '#39FF14' }}>72%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: '04', tag: 'COMPOSER',
    title: 'Review, refine, approve',
    desc: 'Preview the video, tweak the caption, and optimize hashtags — or approve it as-is. The entire review takes under 30 seconds.',
    visual: (
      <div className="flex flex-col gap-3">
        <div className="p-3.5 rounded-xl flex flex-col gap-3" style={{ background: '#111', border: '1px solid #1C1C1C' }}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded"
              style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)' }}>SCRIPT READY</span>
            <span className="text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>28 sec · 1080×1920</span>
          </div>
          <p className="text-[12px] text-muted leading-[1.7] italic border-l-2 pl-3" style={{ borderColor: 'rgba(57,255,20,0.4)' }}>
            "Okay so I've been doing this every morning for 3 months and honestly my whole day changes…"
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['#morningroutine', '#productivity', '#dayinmylife'].map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded"
                style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1.5 text-[11px] font-medium text-dim rounded-lg border border-border">Edit</button>
          <button className="btn-neon px-3 py-1.5 text-[11px] font-bold rounded-lg">Approve →</button>
        </div>
      </div>
    ),
  },
  {
    num: '05', tag: 'SCHEDULER',
    title: 'Auto-publishes at peak time',
    desc: "AuraPost schedules via Meta Graph API at your audience's peak engagement window. Reels, carousels, stories — all handled while you sleep.",
    visual: (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const isToday = i === 2; const hasPost = [0, 2, 4].includes(i)
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl"
                style={{ background: isToday ? 'rgba(57,255,20,0.06)' : '#111', border: isToday ? '1px solid rgba(57,255,20,0.4)' : '1px solid #1C1C1C' }}>
                <span className="text-[8px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: isToday ? '#39FF14' : '#3A3A3A' }}>{day}</span>
                {hasPost && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#39FF14', opacity: isToday ? 1 : 0.3, boxShadow: isToday ? '0 0 8px rgba(57,255,20,1)' : 'none' }} />}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.25)' }}>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse-glow" style={{ background: '#39FF14', boxShadow: '0 0 8px rgba(57,255,20,1)' }} />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: '#39FF14' }}>Published via Meta Graph API</div>
            <div className="text-[10px] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Wed 7:42 AM · 847 accounts reached</div>
          </div>
        </div>
      </div>
    ),
  },
]

/* easeInOutQuad — smooth acceleration + deceleration across full track */
const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const TOTAL_TRACK = STEP_H * (STEPS.length - 1)
const TOTAL_FILL_MS = FILL_MS * (STEPS.length - 1)

export default function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState(false)
  const sectionRef = useRef(null)
  const lineRef = useRef(null)  // green fill bar
  const dotRef = useRef(null)  // glowing cursor dot
  const miniBarRef = useRef(null)  // mini bar in window chrome
  const frameRef = useRef(null)
  const sm = useRef({ phase: 'idle', phaseStart: 0, lastActive: 0 })

  /* ── DOM helper: pos 0..1 ── */
  const setPos = (pos) => {
    const px = Math.max(0, pos) * TOTAL_TRACK
    if (lineRef.current) lineRef.current.style.height = `${px}px`
    if (dotRef.current) dotRef.current.style.transform = `translateY(${px}px)`
    // mini bar fills within the current step segment
    if (miniBarRef.current) {
      const segSize = 1 / (STEPS.length - 1)
      const segStart = Math.min(Math.floor(pos / segSize), STEPS.length - 2) * segSize
      const segPct = Math.min((pos - segStart) / segSize, 1) * 100
      miniBarRef.current.style.width = `${segPct}%`
    }
  }

  /* ── RAF loop ── */
  const tick = (now) => {
    const s = sm.current
    const elapsed = now - s.phaseStart

    if (s.phase === 'filling') {
      const t = Math.min(elapsed / TOTAL_FILL_MS, 1)
      const pos = ease(t)  // 0..1
      setPos(pos)

      // Detect step crossing — no pauses at intermediate nodes
      const newActive = Math.min(
        Math.floor(pos * (STEPS.length - 1)),
        STEPS.length - 1
      )
      if (newActive !== s.lastActive) {
        s.lastActive = newActive
        setActive(newActive)
      }

      if (t >= 1) {
        setPos(1)
        setActive(STEPS.length - 1)
        s.lastActive = STEPS.length - 1
        s.phase = 'endPause'
        s.phaseStart = now
      }
    } else if (s.phase === 'endPause') {
      if (elapsed >= END_PAUSE) {
        // Instant snap back to top
        setPos(0)
        s.phase = 'filling'
        s.phaseStart = now
        s.lastActive = 0
        setActive(0)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  /* ── Start once in viewport ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    sm.current = { phase: 'filling', step: 0, phaseStart: performance.now() }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [started])

  /* ── Manual step click ── */
  const goTo = (i) => {
    cancelAnimationFrame(frameRef.current)
    const pos = i / (STEPS.length - 1)
    setPos(pos)
    // Resume filling from this position
    const resumeFrom = pos * TOTAL_FILL_MS
    sm.current = { phase: 'filling', phaseStart: performance.now() - resumeFrom, lastActive: i }
    setActive(i)
    frameRef.current = requestAnimationFrame(tick)
  }

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 relative">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <motion.div className="flex flex-col items-center text-center gap-4 mb-20"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> How it works
          </span>
          <h2 className="leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#F5F5F5' }}>
            Trend → script → video →{' '}
            <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>posted.</span>
          </h2>
          <p className="text-[15px] text-dim max-w-[420px] leading-[1.8]">
            The full content pipeline runs automatically. You just approve.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 items-start">

          {/* ── Left: vertical timeline ── */}
          <div className="relative">

            {/* Dim track — behind everything */}
            <div style={{
              position: 'absolute', left: '21px',
              top: `${STEP_H / 2}px`,
              width: '2px', height: `${TOTAL_TRACK}px`,
              background: '#1E1E1E', borderRadius: '2px',
              zIndex: 0,
            }} />

            {/* Green fill — z:1, behind dots */}
            <div ref={lineRef} style={{
              position: 'absolute', left: '21px',
              top: `${STEP_H / 2}px`,
              width: '2px', height: '0px',
              background: 'linear-gradient(180deg,#39FF14,rgba(57,255,20,0.45))',
              boxShadow: '0 0 10px rgba(57,255,20,0.7)',
              borderRadius: '2px',
              zIndex: 1,
            }} />

            {/* Glowing dot cursor — z:5, above line */}
            <div ref={dotRef} style={{
              position: 'absolute', left: '13px',
              top: `${STEP_H / 2 - 9}px`,
              width: '18px', height: '18px',
              borderRadius: '50%',
              background: '#39FF14',
              boxShadow: '0 0 0 4px rgba(57,255,20,0.15), 0 0 18px rgba(57,255,20,0.9), 0 0 36px rgba(57,255,20,0.4)',
              zIndex: 5,
              willChange: 'transform',
            }} />

            {/* Step rows */}
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex items-center gap-4 text-left w-full group"
                style={{ height: `${STEP_H}px` }}
              >
                {/* Circle node — in flex flow so it aligns with the line */}
                <motion.div
                  className="flex-shrink-0 flex items-center justify-center relative"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid', zIndex: 20 }}
                  animate={{
                    background: active === i ? '#0D1A0D' : i < active ? '#0B0E0B' : '#090909',
                    borderColor: active === i ? 'rgba(57,255,20,0.8)' : i < active ? 'rgba(57,255,20,0.35)' : '#252525',
                    boxShadow: active === i ? '0 0 20px rgba(57,255,20,0.35)' : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {i < active ? (
                      <motion.span key="check"
                        style={{ color: '#39FF14', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span key="num"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: active === i ? '#39FF14' : '#333' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {step.num}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label + tag */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <motion.span className="text-[14px] font-semibold truncate"
                    animate={{ color: active === i ? '#F5F5F5' : i < active ? '#5A5A5A' : '#3A3A3A' }}
                    transition={{ duration: 0.25 }}>
                    {step.title}
                  </motion.span>
                  <AnimatePresence>
                    {active === i && (
                      <motion.span
                        className="text-[8px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded"
                        style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.25)' }}
                        initial={{ opacity: 0, x: 8, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 8, scale: 0.8 }} transition={{ duration: 0.2 }}>
                        {step.tag}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            ))}
          </div>

          {/* ── Right: info box ── */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.15)', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Window chrome */}
                <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid #161616', background: '#0D0D0D' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-[10px] text-dim flex-1 text-center" style={{ fontFamily: 'var(--font-mono)' }}>
                    step {STEPS[active].num} / 05
                  </span>
                  {/* Mini progress bar */}
                  <div className="w-20 h-[3px] rounded-full overflow-hidden" style={{ background: '#1C1C1C' }}>
                    <div ref={miniBarRef} className="h-full rounded-full" style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,0.8)', width: '0%', transition: 'none' }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                      style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)' }}>
                      {STEPS[active].tag}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-ghost mb-2">{STEPS[active].title}</h3>
                  <p className="text-[13px] text-dim leading-[1.75] mb-5">{STEPS[active].desc}</p>
                  {STEPS[active].visual}
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-2 py-4" style={{ borderTop: '1px solid #141414' }}>
                  {STEPS.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: active === i ? '22px' : '6px', height: '6px',
                        background: active === i ? '#39FF14' : i < active ? 'rgba(57,255,20,0.25)' : '#222',
                        boxShadow: active === i ? '0 0 8px rgba(57,255,20,0.8)' : 'none',
                      }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
