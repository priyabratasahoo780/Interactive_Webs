// Social Media & Mobile Era (2000s–2015) — Floating app icons + clickable timeline + phone frame
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

const APPS = [
  { name: 'Facebook',  year: 2004, icon: '👤', color: '#1877f2' },
  { name: 'YouTube',   year: 2005, icon: '▶️', color: '#ff0000' },
  { name: 'Twitter',   year: 2006, icon: '🐦', color: '#1da1f2' },
  { name: 'iPhone',    year: 2007, icon: '📱', color: '#555' },
  { name: 'Android',   year: 2008, icon: '🤖', color: '#3ddc84' },
  { name: 'WhatsApp',  year: 2009, icon: '💬', color: '#25d366' },
  { name: 'Instagram', year: 2010, icon: '📸', color: '#c13584' },
  { name: 'Snapchat',  year: 2011, icon: '👻', color: '#fffc00' },
  { name: 'Spotify',   year: 2008, icon: '🎵', color: '#1db954' },
  { name: 'Uber',      year: 2010, icon: '🚗', color: '#000' },
  { name: 'Netflix',   year: 2007, icon: '🎬', color: '#e50914' },
  { name: 'Pinterest', year: 2010, icon: '📌', color: '#e60023' },
]

const TIMELINE_YEARS = [2004, 2007, 2009, 2010, 2011, 2012, 2015]

export default function SocialSection() {
  const sectionRef    = useRef(null)
  const iconsRef      = useRef([])
  const phoneRef      = useRef(null)
  const textRef       = useRef(null)
  const [activeYear,   setActiveYear]   = useState(2004)
  const velocity = useScrollVelocity()
  const orbitTlRef = useRef([])

  // Dynamic timeScale for floating elements
  useEffect(() => {
    orbitTlRef.current.forEach(tl => {
        const targetScale = 1 + Math.abs(velocity / 500)
        gsap.to(tl, { 
            timeScale: Math.min(targetScale, 3),
            duration: 0.5
        })
    })
  }, [velocity])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // ── 1. Reveal heading ────────────────────────────────────────────────────
    gsap.fromTo(textRef.current?.querySelectorAll('.reveal-line'),
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 65%' },
      }
    )

    // ── 2. Phone frame slides in ─────────────────────────────────────────────
    gsap.fromTo(phoneRef.current,
      { opacity: 0, y: 80, rotateY: -15 },
      {
        opacity: 1, y: 0, rotateY: 0,
        duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 60%' },
      }
    )

    // ── 3. App icons orbit in with stagger ──────────────────────────────────
    iconsRef.current.forEach((el, i) => {
      if (!el) return
      const angle = (i / APPS.length) * Math.PI * 2
      const radius = Math.random() * 40 + 60 // 60–100% of container
      gsap.fromTo(el,
        { opacity: 0, x: 0, y: 0, scale: 0 },
        {
          opacity: 1,
          x: Math.cos(angle) * radius * 0.35,
          y: Math.sin(angle) * radius * 0.25,
          scale: 1,
          duration: 0.8, ease: 'back.out(1.5)',
          delay: i * 0.06,
          scrollTrigger: { trigger: section, start: 'top 50%' },
        }
      )
      // Continuous float
      const floatTl = gsap.to(el, {
        y: `+=${8 + Math.random() * 8}`,
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      })
      orbitTlRef.current.push(floatTl)
    })

    // ── 4. Stats counter ─────────────────────────────────────────────────────
    document.querySelectorAll('.social-counter').forEach((el) => {
      const target = parseFloat(el.dataset.target)
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5, ease: 'power2.out',
        onUpdate: function () {
          el.textContent = target >= 100
            ? Math.round(this.targets()[0].val).toLocaleString()
            : this.targets()[0].val.toFixed(1)
        },
        scrollTrigger: { trigger: el, start: 'top 80%' },
      })
    })
  }, [])

  return (
    <section
      id="social"
      ref={sectionRef}
      className="section relative min-h-screen bg-[var(--bg-dark)] flex items-center py-24"
    >
      {/* Purple radial glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Text + Timeline nav ─────────────────────────────────────── */}
        <div ref={textRef}>
          <div className="reveal-line">
            <span className="year-badge mb-4 inline-block">2000s – 2015</span>
          </div>
          <div className="section-divider" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mt-4 leading-tight reveal-line">
            Social.{' '}
            <span className="gradient-text-cyber glow-text">Mobile.</span>
            <br />
            <span className="text-[var(--text-secondary)]">Everywhere.</span>
          </h2>
          <p className="mt-6 text-[var(--text-secondary)] text-sm leading-relaxed max-w-md reveal-line">
            The internet escaped the desktop. Billions of humans put it in their pockets.
            Social networks rose to reshape democracy, culture, and attention itself.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3 mt-8 reveal-line">
            {[
              { label: 'Active users 2015', value: '3.2', suffix: 'B' },
              { label: 'Mobile internet share', value: '51.3', suffix: '%' },
              { label: 'iOS apps 2015', value: '1.5', suffix: 'M' },
            ].map((s) => (
              <div key={s.label} className="glass-card px-5 py-3 text-center min-w-[110px]">
                <div className="text-xl font-display font-bold text-[var(--cyber-green)]">
                  <span className="social-counter" data-target={parseFloat(s.value)}>0</span>
                  {s.suffix}
                </div>
                <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-wide mt-1 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Clickable year timeline */}
          <div className="mt-10 flex gap-3 flex-wrap reveal-line">
            {TIMELINE_YEARS.map((yr) => (
              <button
                key={yr}
                data-cursor
                onClick={() => setActiveYear(yr)}
                className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 border
                  ${activeYear === yr
                    ? 'bg-[var(--cyber-green)] text-[var(--bg-dark)] border-[var(--cyber-green)] shadow-[0_0_16px_rgba(0,212,160,0.4)]'
                    : 'border-[var(--border-glow)] text-[var(--text-muted)] hover:border-[var(--cyber-green)] hover:text-[var(--cyber-green)]'
                  }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Active year fact */}
          <div className="mt-4 glass-card px-5 py-4 max-w-md">
            <YearFact year={activeYear} />
          </div>
        </div>

        {/* ── Right: Phone + floating app icons ────────────────────────────── */}
        <div className="relative flex items-center justify-center h-[520px]">
          {/* Phone frame */}
          <div
            ref={phoneRef}
            className="relative z-10 w-48 h-96 rounded-[2.5rem] border-2 border-[rgba(255,255,255,0.12)]
              bg-[rgba(255,255,255,0.04)] backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col items-center justify-center"
            style={{ perspective: '400px' }}
          >
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-5 pt-3 text-[8px] font-mono text-[var(--text-muted)]">
              <span>9:41</span>
              <span>●●●</span>
            </div>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-[var(--bg-dark)] rounded-b-2xl" />
            {/* App grid preview */}
            <div className="grid grid-cols-3 gap-3 px-5">
              {APPS.slice(0, 9).map((a) => (
                <div
                  key={a.name}
                  className="flex flex-col items-center gap-1"
                  title={a.name}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-md"
                    style={{ backgroundColor: a.color + '33', border: `1px solid ${a.color}44` }}
                  >
                    <span style={{ fontSize: '18px' }}>{a.icon}</span>
                  </div>
                  <span className="text-[6px] text-[var(--text-muted)] truncate w-full text-center font-mono">
                    {a.name}
                  </span>
                </div>
              ))}
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Floating app icons orbiting the phone */}
          {APPS.map((app, i) => (
            <div
              key={app.name}
              ref={(el) => (iconsRef.current[i] = el)}
              className="absolute flex items-center justify-center w-12 h-12 rounded-2xl text-xl
                glass-card border border-white/10 shadow-lg pointer-events-none"
              style={{
                left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
              }}
              title={app.name}
            >
              {app.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Year-based fact sub-component
function YearFact({ year }) {
  const facts = {
    2004: { title: 'Facebook Launches', text: 'Mark Zuckerberg launches "thefacebook.com" from his Harvard dorm. 1 million users in the first month.' },
    2007: { title: 'iPhone Changes Everything', text: 'Steve Jobs unveils "an iPod, a phone, and an internet communicator" — all in one device.' },
    2009: { title: 'WhatsApp Founded', text: 'Two ex-Yahoo engineers build a simple messaging app. It will reach 2 billion users by 2020.' },
    2010: { title: 'Instagram & iPad', text: 'Instagram launches and gets 1 million users in 2 months. Apple sells 3M iPads in 80 days.' },
    2011: { title: 'Snapchat Born', text: '"Disappearing photos" seem like a gimmick — until they define an entire generation\'s communication.' },
    2012: { title: 'Mobile Majority', text: 'For the first time, mobile internet traffic surpasses desktop. The world is in your pocket.' },
    2015: { title: '3 Billion Online', text: 'Half the world\'s population is now connected. The other half is about to join.' },
  }
  const fact = facts[year] || facts[2004]
  return (
    <>
      <div className="text-xs font-semibold text-[var(--cyber-green)] mb-1">{year} — {fact.title}</div>
      <div className="text-xs text-[var(--text-muted)] leading-relaxed">{fact.text}</div>
    </>
  )
}
