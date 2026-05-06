import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── helpers ─────────────────────────────────────────────── */
const C = ({ children, style = {}, className = '' }) => (
  <div className={`rounded-2xl p-5 flex flex-col gap-4 ${className}`}
    style={{ background: '#0A0A0A', border: '1px solid #161616', ...style }}>
    {children}
  </div>
)
const Tag = ({ children, color = '#39FF14' }) => (
  <span className="text-[9px] font-bold px-2 py-0.5 rounded"
    style={{ fontFamily: 'var(--font-mono)', color, background: `${color}14`, border: `1px solid ${color}33` }}>
    {children}
  </span>
)
const Delta = ({ v }) => (
  <Tag color={v >= 0 ? '#39FF14' : '#FF5F57'}>{v >= 0 ? '+' : ''}{v}%</Tag>
)

/* ─── SVG Donut ───────────────────────────────────────────── */
const DONUT = [
  { pct: 45, color: '#39FF14', label: 'Reels' },
  { pct: 30, color: '#FEBC2E', label: 'Carousels' },
  { pct: 25, color: '#2dd4bf', label: 'Stories' },
]
function Donut() {
  const r = 42, cx = 56, cy = 56, stroke = 12
  const circ = 2 * Math.PI * r
  let off = 0
  return (
    <svg width={112} height={112} className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#161616" strokeWidth={stroke} />
      {DONUT.map((d, i) => {
        const dash = (d.pct / 100) * circ
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-off}
            strokeLinecap="butt"
            style={{ filter: `drop-shadow(0 0 4px ${d.color}88)` }}
            transform={`rotate(-90 ${cx} ${cy})`} />
        )
        off += dash
        return el
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#F5F5F5" fontSize="13" fontWeight="700">48.3K</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6A6A6A" fontSize="8">total reach</text>
    </svg>
  )
}

/* ─── SVG Sparkline ───────────────────────────────────────── */
function Sparkline() {
  const pts = [20, 35, 28, 50, 38, 62, 45, 78, 55, 88]
  const w = 200, h = 60
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w)
  const ys = pts.map(p => h - (p / 100) * h)
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39FF14" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="#39FF14" strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.7))' }} />
    </svg>
  )
}

/* ─── Mini bar ────────────────────────────────────────────── */
const BAR = [62, 80, 55, 91, 73, 48, 85]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/* ─── posts table data ────────────────────────────────────── */
const POSTS = [
  { title: 'Morning routine changed my life', type: 'Reel', reach: '4.2K', eng: '8.4%', status: 'Published' },
  { title: 'AI tools I use daily for content', type: 'Carousel', reach: '—', eng: '—', status: 'Scheduled' },
  { title: 'Productivity stack for creators', type: 'Reel', reach: '—', eng: '—', status: 'Draft' },
  { title: '3 mistakes growing to 10K followers', type: 'Story', reach: '2.8K', eng: '6.1%', status: 'Published' },
]
const SC = {
  Published: { c: '#39FF14', bg: 'rgba(57,255,20,0.08)' },
  Scheduled: { c: '#FEBC2E', bg: 'rgba(254,188,46,0.08)' },
  Draft:     { c: '#6A6A6A', bg: 'rgba(255,255,255,0.04)' },
}
const TABS = ['All Posts', 'Published', 'Scheduled', 'Drafts']

/* ─── AI chat ─────────────────────────────────────────────── */
const INIT_MSGS = [
  { from: 'user', text: 'What content should I post this week for max reach?' },
  { from: 'ai',   text: '⚡ Trend Alert: "Morning routines" is trending +340% in your niche. Post a Reel before Thursday 7 AM for peak engagement. Add: #morningroutine #productivity.' },
]

/* ─── page ────────────────────────────────────────────────── */
const fade = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

export default function DashboardPage() {
  const [tab, setTab] = useState('All Posts')
  const [msg, setMsg] = useState('')
  const [msgs, setMsgs] = useState(INIT_MSGS)

  const filteredPosts = tab === 'All Posts' ? POSTS
    : tab === 'Published' ? POSTS.filter(p => p.status === 'Published')
    : tab === 'Scheduled' ? POSTS.filter(p => p.status === 'Scheduled')
    : POSTS.filter(p => p.status === 'Draft')

  const sendMsg = () => {
    if (!msg.trim()) return
    setMsgs(m => [...m, { from: 'user', text: msg }, { from: 'ai', text: '✦ Analyzing your request…' }])
    setMsg('')
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible"
      className="flex flex-col gap-4 max-w-[1400px]">

      {/* ── page title ── */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-ghost">Overview</h1>
          <p className="text-[12px] mt-0.5" style={{ color: '#6A6A6A', fontFamily: 'var(--font-mono)' }}>
            // your content pipeline at a glance
          </p>
        </div>
        <button className="btn-neon px-4 py-2 text-[12px] font-bold rounded-lg flex items-center gap-1.5">
          <span>+</span> New Post
        </button>
      </motion.div>

      {/* ══ TOP ROW ══════════════════════════════════════════ */}
      <motion.div variants={fade} className="grid gap-4" style={{ gridTemplateColumns: '1.1fr 1fr 1fr' }}>

        {/* Card 1 — Total Reach */}
        <C style={{ background: '#080808', minHeight: 220 }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] mb-1" style={{ color: '#6A6A6A', fontFamily: 'var(--font-mono)' }}>// total reach</div>
              <div className="text-[32px] font-bold leading-none" style={{ color: '#F5F5F5' }}>48,320</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Delta v={23} />
              <span className="text-[10px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>vs last month</span>
            </div>
          </div>
          <div className="text-[11px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>
            Monthly avg: <span style={{ color: '#6A6A6A' }}>32,100</span>
          </div>
          {/* visual block */}
          <div className="flex-1 rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden"
            style={{ background: 'rgba(57,255,20,0.03)', border: '1px solid rgba(57,255,20,0.1)', minHeight: 90 }}>
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'linear-gradient(rgba(57,255,20,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(57,255,20,0.06) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
            <span className="text-[13px] font-bold relative z-10" style={{ color: '#39FF14', fontFamily: 'var(--font-mono)', textShadow: '0 0 10px rgba(57,255,20,0.7)' }}>
              ✦ AI Analyzer
            </span>
            <span className="text-[11px] relative z-10" style={{ color: '#6A6A6A' }}>
              is optimizing your posting schedule…
            </span>
            <span className="w-1.5 h-1.5 rounded-full relative z-10"
              style={{ background: '#39FF14', boxShadow: '0 0 8px rgba(57,255,20,1)', animation: 'pulseGlow 1.5s ease-in-out infinite' }} />
          </div>
        </C>

        {/* Card 2 — Campaign Performance */}
        <C>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ghost">Campaign Performance</span>
            <span className="text-dim text-[16px] cursor-pointer hover:text-ghost">···</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[28px] font-bold text-ghost leading-none">142</span>
            <Tag>posts</Tag>
          </div>
          <div className="text-[11px]" style={{ color: '#6A6A6A' }}>Active campaigns · AI-powered content</div>
          <div className="h-px" style={{ background: '#161616' }} />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg Engagement', val: '7.2%', d: 2, good: true },
              { label: 'Reach / Post', val: '340', d: 18, good: true },
              { label: 'Stories Views', val: '12.1K', d: -4, good: false },
              { label: 'Scheduled', val: '8', d: 100, good: true },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl flex flex-col gap-1"
                style={{ background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
                <div className="text-[10px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
                <div className="flex items-end gap-1.5">
                  <span className="text-[18px] font-bold text-ghost leading-none">{s.val}</span>
                  <Delta v={s.d} />
                </div>
              </div>
            ))}
          </div>
        </C>

        {/* Card 3 — Content Analytics */}
        <C>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ghost">Content Analytics</span>
            <button className="text-[10px] px-2 py-1 rounded" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}>
              Monthly ▾
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Donut />
            <div className="flex flex-col gap-2">
              {DONUT.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}88` }} />
                  <span className="text-[11px]" style={{ color: '#9A9A9A' }}>{d.pct}% {d.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Sparkline />
            <div className="flex justify-between">
              <span className="text-[10px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>7-day reach trend</span>
              <span className="text-[10px]" style={{ color: '#39FF14', fontFamily: 'var(--font-mono)' }}>+6.2% growth</span>
            </div>
          </div>
        </C>
      </motion.div>

      {/* ══ BOTTOM ROW ═══════════════════════════════════════ */}
      <motion.div variants={fade} className="grid gap-4" style={{ gridTemplateColumns: '1fr 1.1fr 0.9fr' }}>

        {/* Card 4 — Engagement Tracking */}
        <C>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ghost">Engagement Tracking</span>
            <Delta v={8} />
          </div>
          <div>
            <div className="text-[11px] mb-1" style={{ color: '#6A6A6A', fontFamily: 'var(--font-mono)' }}>Weekly Reach</div>
            <div className="flex items-end gap-1.5 h-20">
              {BAR.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <motion.div className="w-full rounded-t"
                    style={{ background: i === 3 ? '#39FF14' : 'rgba(57,255,20,0.2)', boxShadow: i === 3 ? '0 0 10px rgba(57,255,20,0.5)' : 'none' }}
                    initial={{ height: 0 }} animate={{ height: `${v}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }} />
                  <span className="text-[8px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-px" style={{ background: '#161616' }} />
          <div className="text-[11px] mb-1 font-medium" style={{ color: '#6A6A6A' }}>Content Mix</div>
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {[{ w: 45, c: '#39FF14' }, { w: 30, c: '#FEBC2E' }, { w: 25, c: '#2dd4bf' }].map((s, i) => (
              <div key={i} className="rounded-full" style={{ width: `${s.w}%`, background: s.c, boxShadow: `0 0 6px ${s.c}66` }} />
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            {[{ c: '#39FF14', l: 'Reels 45%' }, { c: '#FEBC2E', l: 'Carousels 30%' }, { c: '#2dd4bf', l: 'Stories 25%' }].map((x, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: x.c }} />
                <span className="text-[10px]" style={{ color: '#6A6A6A', fontFamily: 'var(--font-mono)' }}>{x.l}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[
              { tag: 'Insight', text: 'Reels get 2.3× more reach on your account' },
              { tag: 'Verify',  text: 'Best time: Thu 7 AM based on your audience' },
              { tag: 'Action',  text: 'Apr 28 Reel is trending — boost it now' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
                <Tag>{tip.tag}</Tag>
                <span className="text-[11px]" style={{ color: '#6A6A6A' }}>{tip.text}</span>
              </div>
            ))}
          </div>
        </C>

        {/* Card 5 — Posts Table */}
        <C style={{ gap: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-ghost">Post Records</span>
          </div>
          {/* search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: '#3A3A3A', fontFamily: 'var(--font-mono)' }}>⌕</span>
            <input placeholder="Search posts…" className="w-full pl-8 pr-3 py-2 text-[11px] rounded-xl outline-none"
              style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', color: '#9A9A9A', fontFamily: 'var(--font-mono)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.3)'}
              onBlur={e => e.target.style.borderColor = '#1A1A1A'} />
          </div>
          {/* tabs */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: tab === t ? '#39FF14' : 'rgba(255,255,255,0.04)',
                  color: tab === t ? '#000' : '#6A6A6A',
                  border: tab === t ? 'none' : '1px solid #1C1C1C',
                }}>{t}</button>
            ))}
          </div>
          {/* table head */}
          <div className="grid gap-2 pb-2 mb-1" style={{ gridTemplateColumns: '1fr 60px 55px 70px', borderBottom: '1px solid #161616' }}>
            {['Post', 'Type', 'Reach', 'Status'].map(h => (
              <span key={h} className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#2A2A2A', fontFamily: 'var(--font-mono)' }}>{h}</span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col">
              {filteredPosts.map((p, i) => (
                <div key={i} className="grid gap-2 py-2.5 items-center rounded px-1 cursor-pointer transition-colors"
                  style={{ gridTemplateColumns: '1fr 60px 55px 70px', borderBottom: i < filteredPosts.length - 1 ? '1px solid #0F0F0F' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className="text-[11px] text-ghost font-medium truncate">{p.title}</span>
                  <Tag color="#6A6A6A">{p.type}</Tag>
                  <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: '#6A6A6A' }}>{p.reach}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                    style={{ fontFamily: 'var(--font-mono)', color: SC[p.status].c, background: SC[p.status].bg }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </C>

        {/* Card 6 — AI Assistant */}
        <C style={{ gap: 0, padding: 0, overflow: 'hidden' }}>
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #161616', background: '#0D0D0D' }}>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#39FF14' }}>✦</span>
              <span className="text-[12px] font-semibold text-ghost">AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full ml-1 flex-shrink-0"
                style={{ background: '#39FF14', boxShadow: '0 0 6px rgba(57,255,20,1)', animation: 'pulseGlow 1.5s ease-in-out infinite' }} />
            </div>
            <div className="flex items-center gap-2 text-dim text-[12px]">
              <button className="hover:text-ghost transition-colors">⎘</button>
              <button className="hover:text-ghost transition-colors">⤢</button>
            </div>
          </div>
          {/* messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4" style={{ minHeight: 180, maxHeight: 260 }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'ai' && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: 'rgba(57,255,20,0.15)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.3)', fontFamily: 'var(--font-mono)' }}>✦</div>
                )}
                <div className="max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-[1.6]"
                  style={{
                    background: m.from === 'user' ? '#161616' : 'rgba(57,255,20,0.05)',
                    border: m.from === 'user' ? '1px solid #1C1C1C' : '1px solid rgba(57,255,20,0.15)',
                    color: m.from === 'user' ? '#9A9A9A' : '#F5F5F5',
                    borderRadius: m.from === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  }}>{m.text}</div>
              </div>
            ))}
          </div>
          {/* topic pills */}
          <div className="flex gap-1.5 px-4 py-2" style={{ borderTop: '1px solid #0F0F0F' }}>
            {['Content Strategy', 'Trends', 'Scheduling'].map(t => (
              <button key={t} className="text-[9px] px-2 py-0.5 rounded-full transition-colors"
                style={{ fontFamily: 'var(--font-mono)', color: '#6A6A6A', border: '1px solid #1C1C1C' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.3)'; e.currentTarget.style.color = '#39FF14' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1C1C1C'; e.currentTarget.style.color = '#6A6A6A' }}>
                {t}
              </button>
            ))}
          </div>
          {/* input */}
          <div className="flex items-center gap-2 px-3 py-3" style={{ borderTop: '1px solid #161616' }}>
            <span className="text-[14px] flex-shrink-0" style={{ color: '#39FF14' }}>✦</span>
            <input value={msg} onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Ask or Search…"
              className="flex-1 text-[11px] outline-none bg-transparent"
              style={{ color: '#F5F5F5', fontFamily: 'var(--font-mono)' }} />
            <button onClick={sendMsg} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-all"
              style={{ background: '#39FF14', color: '#000', boxShadow: '0 0 10px rgba(57,255,20,0.5)' }}>→</button>
          </div>
        </C>
      </motion.div>
    </motion.div>
  )
}
