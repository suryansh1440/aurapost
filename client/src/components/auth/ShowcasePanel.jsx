import React, { useState, useEffect, useRef } from 'react'

const SLIDE_DURATION = 5000 // ms per slide

/* ── Slide 1: Trend Intelligence ────────────────────────────────── */
const TrendAnimation = () => {
  const TRENDS = [
    { platform: 'TikTok', topic: 'morning routine productivity', heat: '4.2M', c: '#FF4444' },
    { platform: 'X',      topic: '"Build in public" going viral',  heat: '2.1M', c: '#1DA1F2' },
    { platform: 'Reddit', topic: 'overnight success myths',        heat: '89K',  c: '#FF6600' },
    { platform: 'TikTok', topic: 'silent walking is back',         heat: '6.7M', c: '#FF4444' },
  ]
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    setVisible(0)
    const timers = TRENDS.map((_, i) =>
      setTimeout(() => setVisible(i + 1), i * 600)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow flex-shrink-0"
          style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,1)' }} />
        <span className="text-[11px] font-mono" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>
          127 signals detected today
        </span>
      </div>
      {TRENDS.map((t, i) => (
        <div key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500"
          style={{
            background: i === 0 ? 'rgba(57,255,20,0.05)' : '#111111',
            border: i === 0 ? '1px solid rgba(57,255,20,0.2)' : '1px solid #1C1C1C',
            opacity: visible > i ? 1 : 0,
            transform: visible > i ? 'translateX(0)' : 'translateX(-16px)',
          }}>
          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ fontFamily: 'var(--font-mono)', color: '#000', background: t.c }}>
            {t.platform.toUpperCase()}
          </span>
          <span className="flex-1 text-[12px] text-muted truncate">{t.topic}</span>
          <span className="text-[11px] font-mono text-dim flex-shrink-0"
            style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? '#39FF14' : undefined }}>{t.heat}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Slide 2: AI Script Engine ──────────────────────────────────── */
const ScriptAnimation = () => {
  const FULL_TEXT =
    `HOOK: "I stopped filming 3 months ago...\nand my Instagram grew by 340%.\n\nHere's exactly what I changed:"`

  const [typed, setTyped] = useState('')
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    setTyped('')
    let i = 0
    const typeTimer = setInterval(() => {
      if (i < FULL_TEXT.length) {
        setTyped(FULL_TEXT.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeTimer)
      }
    }, 38)
    const blinkTimer = setInterval(() => setCursor(c => !c), 530)
    return () => { clearInterval(typeTimer); clearInterval(blinkTimer) }
  }, [])

  return (
    <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: '#111111', border: '1px solid #1C1C1C' }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>
          // script_engine.generate()
        </span>
        <div className="flex items-center gap-1 text-[10px] font-mono"
          style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
            style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,1)' }} />
          WRITING
        </div>
      </div>
      <div className="text-[13px] text-ghost leading-[1.8] font-mono min-h-[80px]"
        style={{ fontFamily: 'var(--font-mono)' }}>
        {typed.split('\n').map((line, i) => (
          <div key={i}>{line}{i === typed.split('\n').length - 1 && <span style={{ opacity: cursor ? 1 : 0, color: '#39FF14' }}>|</span>}</div>
        ))}
      </div>
      <div className="flex gap-2 pt-2 border-t" style={{ borderColor: '#1C1C1C' }}>
        {['Hook', 'Script', 'Caption', 'Hashtags'].map((tag, i) => (
          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color: typed.length > i * 20 ? '#39FF14' : '#3A3A3A',
              background: typed.length > i * 20 ? 'rgba(57,255,20,0.08)' : '#0A0A0A',
              border: `1px solid ${typed.length > i * 20 ? 'rgba(57,255,20,0.2)' : '#1C1C1C'}`,
              transition: 'all 0.4s',
            }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Slide 3: Higgsfield Video Generation ───────────────────────── */
const VideoAnimation = () => {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0) // 0=sending, 1=rendering, 2=voiceover, 3=done

  useEffect(() => {
    setProgress(0)
    setStage(0)
    const stages = [
      { duration: 600,  toProgress: 15, toStage: 1 },
      { duration: 2200, toProgress: 72, toStage: 2 },
      { duration: 900,  toProgress: 90, toStage: 2 },
      { duration: 800,  toProgress: 100, toStage: 3 },
    ]
    let delay = 0
    stages.forEach((s, i) => {
      setTimeout(() => { setProgress(s.toProgress); setStage(s.toStage) }, delay)
      delay += s.duration
    })
  }, [])

  const STAGE_LABELS = ['Sending to Higgsfield…', 'Rendering video…', 'ElevenLabs voiceover…', 'Video ready ✓']
  const PROVIDERS = ['Higgsfield', 'Runway', 'Kling']

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg p-4" style={{ background: '#111111', border: '1px solid #1C1C1C' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
            AI Video Generation
          </span>
          <div className="flex gap-1.5">
            {PROVIDERS.map((p, i) => (
              <span key={p} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? '#39FF14' : '#3A3A3A', background: i === 0 ? 'rgba(57,255,20,0.08)' : '#0A0A0A', border: `1px solid ${i === 0 ? 'rgba(57,255,20,0.2)' : '#1C1C1C'}` }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-2" style={{ background: '#1C1C1C' }}>
          <div className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: progress === 100 ? '#39FF14' : '#39FF14', boxShadow: '0 0 8px rgba(57,255,20,0.6)', transition: 'width 0.7s ease' }} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono transition-all duration-300"
            style={{ fontFamily: 'var(--font-mono)', color: stage === 3 ? '#39FF14' : '#6A6A6A' }}>
            {STAGE_LABELS[stage]}
          </span>
          <span className="text-[11px] font-mono"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', textShadow: progress === 100 ? '0 0 8px rgba(57,255,20,0.6)' : 'none' }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* "Video preview" mock */}
      <div className="rounded-lg overflow-hidden flex items-center justify-center"
        style={{ background: '#0D0D0D', border: '1px solid #1C1C1C', height: '80px', position: 'relative' }}>
        {stage < 3 ? (
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(57,255,20,0.3)', borderTopColor: '#39FF14' }} />
            <span className="text-[10px] font-mono text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Generating…</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(57,255,20,0.15)', border: '1px solid rgba(57,255,20,0.4)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#39FF14"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-ghost">video_final.mp4</div>
              <div className="text-[10px] font-mono text-dim" style={{ fontFamily: 'var(--font-mono)' }}>28s · 1080×1920 · Ready to post</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Slide 4: Auto Publisher ────────────────────────────────────── */
const PublisherAnimation = () => {
  const [postLive, setPostLive] = useState(false)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const scheduled = [1, 3, 5] // indices with posts

  useEffect(() => {
    const t = setTimeout(() => setPostLive(true), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {/* Calendar */}
      <div className="rounded-lg p-4" style={{ background: '#111111', border: '1px solid #1C1C1C' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
            Publishing Queue — This Week
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.2)' }}>
            META GRAPH API
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const hasPost = scheduled.includes(i)
            const isToday = i === 2
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 py-2 rounded-lg transition-all duration-300"
                style={{
                  border: isToday ? '1px solid rgba(57,255,20,0.4)' : '1px solid #1C1C1C',
                  background: isToday ? 'rgba(57,255,20,0.05)' : 'transparent',
                }}>
                <span className="text-[8px] uppercase tracking-wider font-mono"
                  style={{ fontFamily: 'var(--font-mono)', color: isToday ? '#39FF14' : '#3A3A3A' }}>
                  {day}
                </span>
                {hasPost && (
                  <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: '#39FF14',
                      opacity: isToday && postLive ? 1 : 0.35,
                      boxShadow: isToday && postLive ? '0 0 6px rgba(57,255,20,1)' : 'none',
                    }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status */}
      <div className="rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-700"
        style={{
          background: postLive ? 'rgba(57,255,20,0.05)' : '#111111',
          border: postLive ? '1px solid rgba(57,255,20,0.3)' : '1px solid #1C1C1C',
        }}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: postLive ? '#39FF14' : '#3A3A3A',
            boxShadow: postLive ? '0 0 8px rgba(57,255,20,1)' : 'none',
            transition: 'all 0.5s',
          }} />
        <span className="text-[12px] font-mono transition-colors duration-500"
          style={{ fontFamily: 'var(--font-mono)', color: postLive ? '#39FF14' : '#3A3A3A' }}>
          {postLive ? 'Published · Your audience is seeing it now.' : 'Waiting for optimal posting time…'}
        </span>
      </div>
    </div>
  )
}

/* ── Main ShowcasePanel ─────────────────────────────────────────── */
const SLIDES = [
  {
    label: 'Trend Intelligence',
    sub:   'Detect viral topics 48h before they peak',
    Visual: TrendAnimation,
  },
  {
    label: 'AI Script Engine',
    sub:   'Claude writes hooks that sound like you',
    Visual: ScriptAnimation,
  },
  {
    label: 'Higgsfield Video',
    sub:   'Photorealistic video. Zero camera needed.',
    Visual: VideoAnimation,
  },
  {
    label: 'Auto-Publisher',
    sub:   'Posts at peak time via Meta Graph API',
    Visual: PublisherAnimation,
  },
]

const ShowcasePanel = () => {
  const [active, setActive]     = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef                  = useRef(null)
  const startRef                = useRef(null)

  useEffect(() => {
    setProgress(0)
    startRef.current = performance.now()

    const tick = (now) => {
      const elapsed = now - startRef.current
      const p = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      setProgress(p)

      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setActive(prev => (prev + 1) % SLIDES.length)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  const { label, sub, Visual } = SLIDES[active]

  return (
    <div className="relative h-full flex flex-col justify-between overflow-hidden py-8 px-8"
      style={{ background: '#080808' }}>

      {/* Grid bg */}
      <div className="absolute inset-0 terminal-grid opacity-30 pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(57,255,20,0.1) 0%, transparent 65%)' }} />

      {/* Top header */}
      <div className="relative z-10 flex items-center">
        
      </div>

      {/* Animated visual area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20">
        <div key={active} style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1) both' }}>
          <Visual />
        </div>
      </div>

      {/* Bottom — headline + progress tabs */}
      <div className="relative z-10 pb-30">
        {/* Current slide headline */}
        <div className="mb-5">
          <h2 className="text-[22px] font-bold text-ghost tracking-tight mb-1">{label}</h2>
          <p className="text-[13px] text-dim">{sub}</p>
        </div>

        {/* Progress bars */}
        <div className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => { cancelAnimationFrame(rafRef.current); setActive(i) }}
              className="flex-1 group">
              {/* Bar track */}
              <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: '#2A2A2A' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: i < active ? '100%' : i === active ? `${progress}%` : '0%',
                    background: '#39FF14',
                    boxShadow: i === active ? '0 0 6px rgba(57,255,20,0.7)' : 'none',
                    transition: i === active ? 'none' : 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-[10px] font-mono truncate transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: i === active ? '#39FF14' : i < active ? '#3A3A3A' : '#2A2A2A',
                }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowcasePanel
