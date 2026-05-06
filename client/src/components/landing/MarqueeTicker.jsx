import React from 'react'

const items = [
  'No camera needed',
  'AI video generation',
  'Trend intelligence — live',
  '30 sec review & approve',
  'Publishes automatically',
  'Higgsfield + Runway + Kling',
  'ElevenLabs voiceover',
  'Meta Graph API publishing',
  'No camera needed',
  'AI video generation',
  'Trend intelligence — live',
  '30 sec review & approve',
  'Publishes automatically',
  'Higgsfield + Runway + Kling',
  'ElevenLabs voiceover',
  'Meta Graph API publishing',
]

const MarqueeTicker = () => (
  <div className="overflow-hidden py-3.5 border-y border-border relative" style={{ background: '#0A0A0A' }}>
    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

    <div className="animate-ticker flex w-max">
      {[...items, ...items].map((text, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-3 px-8 whitespace-nowrap border-r border-border"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', color: '#6A6A6A' }}
        >
          <span style={{ color: '#39FF14', fontFamily: 'var(--font-mono)', fontSize: '8px' }}>✦</span>
          {text}
        </span>
      ))}
    </div>
  </div>
)

export default MarqueeTicker
