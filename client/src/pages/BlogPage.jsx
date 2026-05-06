import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const POSTS = [
  {
    slug: 'how-ai-video-is-changing-instagram',
    tag: 'AI Video',
    tagColor: '#39FF14',
    title: 'How AI Video Is Changing Instagram in 2025',
    excerpt: 'Photorealistic video generated from a text prompt. No camera. No crew. Here\'s what this means for creators and brands building on Instagram.',
    date: 'Apr 28, 2025',
    readTime: '6 min',
    featured: true,
  },
  {
    slug: 'trend-intelligence-guide',
    tag: 'Trends',
    tagColor: '#2DCB96',
    title: 'The Creator\'s Guide to Trend Intelligence',
    excerpt: 'How to spot viral topics 48 hours before they peak — and turn them into content before your competitors notice.',
    date: 'Apr 21, 2025',
    readTime: '8 min',
    featured: false,
  },
  {
    slug: 'higgsfield-vs-runway-2025',
    tag: 'Tools',
    tagColor: '#8F88E8',
    title: 'Higgsfield vs RunwayML: Which AI Video Model Wins?',
    excerpt: 'We generated 200 videos across both platforms and compared quality, speed, and cost. The results might surprise you.',
    date: 'Apr 14, 2025',
    readTime: '10 min',
    featured: false,
  },
  {
    slug: 'instagram-algorithm-2025',
    tag: 'Growth',
    tagColor: '#E8B84B',
    title: 'The Instagram Algorithm in 2025: What Actually Works',
    excerpt: 'Reels timing, caption length, hashtag strategy — we analyzed 50,000 posts to find what still moves the needle.',
    date: 'Apr 7, 2025',
    readTime: '12 min',
    featured: false,
  },
  {
    slug: 'voice-calibration-ai',
    tag: 'AI',
    tagColor: '#39FF14',
    title: 'Making AI Sound Like You: Voice Calibration Explained',
    excerpt: 'The difference between generic AI captions and ones that actually sound like your brand. A deep dive into how AuraPost calibrates tone.',
    date: 'Mar 31, 2025',
    readTime: '7 min',
    featured: false,
  },
  {
    slug: 'agency-content-automation',
    tag: 'Agency',
    tagColor: '#FF6B6B',
    title: 'How Agencies Are Managing 50+ Clients With AI',
    excerpt: 'The content agency playbook has changed. Here\'s how top agencies are using automation to 10x output without hiring.',
    date: 'Mar 24, 2025',
    readTime: '9 min',
    featured: false,
  },
]

const TAGS = ['All', 'AI Video', 'Trends', 'Tools', 'Growth', 'AI', 'Agency']

const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const BlogPage = () => {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All' ? POSTS : POSTS.filter(p => p.tag === activeTag)
  const featured = POSTS.find(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  return (
    <div className="min-h-screen pt-28 pb-24 relative">
      <div className="absolute inset-0 terminal-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(57,255,20,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div className="flex flex-col items-start gap-5 mb-12"
          variants={container} initial="hidden" animate="visible">
          <motion.span variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-medium uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
            <span style={{ opacity: 0.6 }}>//</span> Blog
          </motion.span>
          <motion.h1 variants={item} className="leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: '#F5F5F5' }}>
            Insights for{' '}
            <span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5)' }}>modern creators.</span>
          </motion.h1>
          <motion.p variants={item} className="text-[15px] text-dim max-w-[500px] leading-[1.8]">
            Trend intelligence, AI tools, content strategy — everything you need to grow without burning out.
          </motion.p>

          {/* Tag filter */}
          <motion.div variants={item} className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <motion.button key={tag} onClick={() => setActiveTag(tag)}
                className="px-3 py-1.5 rounded text-[11px] font-medium font-mono transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: activeTag === tag ? 'rgba(57,255,20,0.12)' : '#111111',
                  color: activeTag === tag ? '#39FF14' : '#6A6A6A',
                  border: `1px solid ${activeTag === tag ? 'rgba(57,255,20,0.4)' : '#1C1C1C'}`,
                }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Featured post */}
        {activeTag === 'All' && featured && (
          <motion.div className="mb-8 p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
            style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.2)' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            whileHover={{ y: -3, borderColor: 'rgba(57,255,20,0.4)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #39FF14, transparent)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-mono)', color: '#000', background: featured.tagColor }}>{featured.tag}</span>
                  <span className="text-[9px] font-mono text-dimmer uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-mono)' }}>FEATURED</span>
                </div>
                <h2 className="text-[24px] font-bold text-ghost leading-[1.2]">{featured.title}</h2>
                <p className="text-[14px] text-dim leading-[1.75]">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-[11px] font-mono text-dimmer"
                  style={{ fontFamily: 'var(--font-mono)' }}>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime} read</span>
                </div>
                <motion.span className="text-[13px] font-semibold self-start" style={{ color: '#39FF14' }}
                  whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  Read article →
                </motion.span>
              </div>
              {/* Decorative terminal */}
              <div className="hidden md:block p-5 rounded-xl" style={{ background: '#080808', border: '1px solid #1C1C1C' }}>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="font-mono text-[11px] leading-[2] text-dim" style={{ fontFamily: 'var(--font-mono)' }}>
                  <div style={{ color: '#39FF14' }}># ai video generation stats</div>
                  <div>videos_generated: <span style={{ color: '#39FF14' }}>2,400,000+</span></div>
                  <div>avg_generation_time: <span style={{ color: '#39FF14' }}>42s</span></div>
                  <div>quality_rating: <span style={{ color: '#39FF14' }}>9.1/10</span></div>
                  <div>camera_required: <span style={{ color: '#FF5F57' }}>false</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Post grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="visible"
          key={activeTag}
        >
          {rest.map((post, i) => (
            <motion.div key={post.slug}
              className="flex flex-col gap-4 p-6 rounded-xl cursor-pointer group"
              style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
              variants={item}
              whileHover={{ y: -4, borderColor: 'rgba(57,255,20,0.2)' }}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-mono)', color: '#000', background: post.tagColor }}>{post.tag}</span>
                <span className="text-[10px] font-mono text-dimmer" style={{ fontFamily: 'var(--font-mono)' }}>{post.readTime} read</span>
              </div>
              <h3 className="text-[15px] font-semibold text-ghost leading-[1.3] group-hover:text-white transition-colors">
                {post.title}
              </h3>
              <p className="text-[13px] text-dim leading-[1.7] flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[11px] font-mono text-dimmer" style={{ fontFamily: 'var(--font-mono)' }}>{post.date}</span>
                <motion.span className="text-[12px] font-semibold" style={{ color: '#39FF14' }}
                  whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                  Read →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div className="mt-16 flex flex-col items-center text-center gap-5 py-14 rounded-2xl relative overflow-hidden"
          style={{ background: '#0A0A0A', border: '1px solid rgba(57,255,20,0.2)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px" style={{ background: 'linear-gradient(90deg, transparent, #39FF14, transparent)' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: '#39FF14' }}>
            // Newsletter
          </span>
          <h2 className="text-[26px] font-bold text-ghost">Stay ahead of every trend</h2>
          <p className="text-[14px] text-dim max-w-[380px]">Weekly insights on AI tools, content strategy, and growth tactics. No spam.</p>
          <div className="flex gap-2 w-full max-w-[420px]">
            <input type="email" placeholder="you@example.com"
              className="flex-1 px-4 py-2.5 rounded-[8px] text-[13px] text-ghost outline-none"
              style={{ background: '#111111', border: '1px solid #2A2A2A', fontFamily: 'var(--font-sans)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'}
              onBlur={e => e.target.style.borderColor = '#2A2A2A'} />
            <motion.button className="btn-neon px-5 py-2.5 text-[13px] font-bold rounded-[8px] whitespace-nowrap"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Subscribe
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default BlogPage
