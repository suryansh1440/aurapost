import React from 'react'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  { name: 'Mia Torres',   handle: '@mia.creates',       avatar: '#39FF14', initials: 'MT', role: 'Content creator · 280K followers',  quote: 'I typed a topic, approved the script, and AuraPost generated a full Reel with voiceover. Never touched a camera. Reach tripled in 6 weeks.',                                                           metric: '+340% reach'     },
  { name: 'James Osei',   handle: '@jamesosei.brand',   avatar: '#2DCB96', initials: 'JO', role: 'Brand founder · lifestyle',           quote: 'My agency quoted $4k/month for content. AuraPost does the same — AI video, captions, scheduling — for $79. And it sounds exactly like me.',                                               metric: '$4k/mo saved'    },
  { name: 'Sofia Reyes',  handle: '@sofiaagency',       avatar: '#8F88E8', initials: 'SR', role: 'Agency owner · 14 clients',           quote: 'Managing 14 Instagram accounts was a nightmare. Now the AI handles scripts, video gen, and publishing. My team focuses on strategy, not grinding content.',                                metric: '14 accounts'     },
  { name: 'Aryan Mehta',  handle: '@aryanfitness',      avatar: '#E8B84B', initials: 'AM', role: 'Fitness creator · 95K followers',     quote: 'The Higgsfield videos are insane — people in my comments genuinely ask when I filmed it. It sounds and looks completely like me.',                                                          metric: '95K followers'   },
  { name: 'Chloe Kim',    handle: '@chloetravels',      avatar: '#6A6A6A', initials: 'CK', role: 'Travel content creator',               quote: 'I just type "sunset hike in Portugal" and AuraPost writes the script, generates the video, adds voiceover, and posts it at the right time. Insane.',                                metric: '4.2M views'      },
  { name: 'Marcus Webb',  handle: '@marcuswebb.co',     avatar: '#3A3A3A', initials: 'MW', role: 'Startup founder',                     quote: "Used to dread Instagram. Now the trend engine finds my topics, AI writes the script, and it publishes while I'm sleeping. Top traffic source for my startup.",                        metric: '#1 traffic source'},
]

const sectionHeader = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const headerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 overflow-hidden">
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
          <span style={{ opacity: 0.6 }}>//</span> Real results
        </motion.span>
        <motion.h2 variants={headerItem} className="leading-[1.15] tracking-tight"
          style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#F5F5F5' }}>
          They stopped filming.{' '}
          <span style={{ color: '#39FF14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}>The growth didn't.</span>
        </motion.h2>
      </motion.div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            className="break-inside-avoid flex flex-col gap-4 p-6 rounded-xl cursor-default"
            style={{ background: '#0A0A0A', border: '1px solid #1C1C1C' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ borderColor: 'rgba(57,255,20,0.25)', y: -3 }}
          >
            <span className="font-mono text-[24px] leading-none"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(57,255,20,0.3)' }}>"</span>

            <p className="text-[13.5px] text-dim leading-[1.8]">{t.quote}</p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 self-start rounded text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)', color: '#39FF14', background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#39FF14' }} />
              {t.metric}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                style={{ background: t.avatar, color: '#000', fontFamily: 'var(--font-mono)' }}>
                {t.initials}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ghost">{t.name}</div>
                <div className="text-[11px] text-dim font-mono" style={{ fontFamily: 'var(--font-mono)' }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default TestimonialsSection
