// Dot-com Boom (1990s) — Horizontal scroll panel inside vertical scroll + hover cards + counter animations
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

const COMPANIES = [
  { name: 'Amazon',    year: '1994', color: '#FF9900', icon: '📦', desc: 'Everything store starts as an online bookshop from a garage in Bellevue.' },
  { name: 'Netscape',  year: '1994', color: '#00a0dc', icon: '🌐', desc: 'The browser that made the web accessible to millions of non-technical users.' },
  { name: 'Yahoo!',    year: '1995', color: '#720e9e', icon: '🔍', desc: 'First web portal and directory — the internet\'s first homepage for millions.' },
  { name: 'eBay',      year: '1995', color: '#e53238', icon: '🔨', desc: 'The world\'s first online marketplace — even selling broken laser pointers.' },
  { name: 'Google',    year: '1998', color: '#4285F4', icon: '🔎', desc: 'Two Stanford students rank the web by backlinks. The rest is history.' },
  { name: 'Napster',   year: '1999', color: '#1db954', icon: '🎵', desc: 'P2P file sharing disrupts the music industry and pushes digital distribution.' },
  { name: 'Wikipedia', year: '2001', color: '#c7c7c7', icon: '📖', desc: 'The world\'s largest encyclopedia — built entirely by volunteers.' },
]

const STATS = [
  { label: 'Websites in 1993',  value: 130,    suffix: '',   prefix: '' },
  { label: 'Websites in 2000',  value: 17,     suffix: 'M',  prefix: '' },
  { label: 'US dial-up users',  value: 95,     suffix: 'M',  prefix: '' },
  { label: 'Dot-com IPOs 1999', value: 547,    suffix: '',   prefix: '' },
]

export default function DotcomSection() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)
  const statsRef   = useRef([])
  const cardsRef   = useRef([])
  const timelineRef = useRef(null)
  const velocity = useScrollVelocity()

  // Dynamic timeScale based on velocity
  useEffect(() => {
    if (timelineRef.current) {
        const targetScale = 1 + Math.abs(velocity / 800)
        gsap.to(timelineRef.current, { 
            timeScale: Math.min(targetScale, 4),
            duration: 0.5,
            ease: 'power2.out'
        })
    }
  }, [velocity])

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    // ── 1. Horizontal scroll pinned inside vertical page scroll ───────────────
    const totalScroll = track.scrollWidth - window.innerWidth + 80

    const pinTween = gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll * 1.6}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    timelineRef.current = pinTween

    // ── 2. Cards scale-in as they come into viewport ──────────────────────────
    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'power4.out', delay: i * 0.05,
          scrollTrigger: { trigger: card, containerAnimation: pinTween, start: 'left 80%' },
        }
      )
    })

    // ── 3. Counter animations (triggered on scroll into view) ─────────────────
    statsRef.current.forEach((el) => {
      if (!el) return
      const target = parseInt(el.dataset.target, 10)
      gsap.fromTo({ val: 0 },
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val).toLocaleString()
          },
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )
    })

    // Smooth Mouse Parallax for cards
    const onCardMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - (rect.left + rect.width / 2)) / 10
        const y = (e.clientY - (rect.top + rect.height / 2)) / 10
        gsap.to(card, {
            rotationY: x,
            rotationX: -y,
            duration: 0.6,
            ease: 'power4.out'
        })
    }
    const onCardMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'power4.out'
        })
    }
    cardsRef.current.forEach(card => {
        if (!card) return
        card.addEventListener('mousemove', onCardMouseMove)
        card.addEventListener('mouseleave', onCardMouseLeave)
    })

    return () => {
        ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === section) st.kill()
        })
        cardsRef.current.forEach(card => {
            if (!card) return
            card.removeEventListener('mousemove', onCardMouseMove)
            card.removeEventListener('mouseleave', onCardMouseLeave)
        })
    }
}, [])

  return (
    <section
      id="dotcom"
      ref={sectionRef}
      className="section relative min-h-screen bg-[var(--bg-dark)] overflow-hidden"
    >
      {/* Section background telemetry */}
      <div className="absolute inset-0 pointer-events-none opacity-5 select-none overflow-hidden flex flex-col justify-around py-20 font-mono">
          <div className="text-[12vw] leading-none animate-marquee-slow text-fire-orange/40">
              $AMZN +45% | $MSFT +12% | $YHOO +110% | $EBAY +22% | $NSCP +88% | $AMZN +45% | $MSFT +12%
          </div>
          <div className="text-[12vw] leading-none animate-marquee-slow-reverse text-fire-orange/20">
              NASDAQ:5000 | BUBBLE_EXPANDING... | NEW_ECONOMY:TRUE | IPO_FEVER:ACTIVE | NASDAQ:5000
          </div>
      </div>
      <div
        className="absolute right-0 top-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)', transform: 'translate(20%, -20%)' }}
      />

      {/* Section header (fixed above horizontal track) */}
      <div className="relative lg:absolute top-0 left-0 right-0 z-10 pt-20 pb-6 px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="year-badge">1990s — Dot-com Boom</span>
            <div className="section-divider mt-3" />
            <h2 className="text-3xl md:text-6xl font-display font-bold mt-3 leading-tight text-center md:text-left">
              <span className="gradient-text-fire glow-text-pink">Wild West</span>
              <br />
              <span className="text-[var(--text-primary)]">of the Web</span>
            </h2>
          </div>
          {/* Live counter stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 text-right w-full md:w-auto">
            {STATS.map((s, i) => (
              <div key={i} className="glass-card px-3 md:px-4 py-2 md:py-3 min-w-[100px] md:min-w-[120px] text-center">
                <div className="text-xl md:text-2xl font-display font-bold text-[var(--cyber-green)]">
                  <span ref={(el) => (statsRef.current[i] = el)} data-target={s.value}>0</span>
                  <span>{s.suffix}</span>
                </div>
                <div className="text-[8px] md:text-[9px] font-mono text-[var(--text-muted)] tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Horizontal scroll track ───────────────────────────────────────────── */}
      <div className="flex items-center h-screen pt-12 md:pt-52 pb-10 pl-6 md:pl-12">
        <div ref={trackRef} className="horizontal-track gap-5">
          {/* Intro card */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="glass-card flex-shrink-0 w-72 md:w-80 h-80 p-6 flex flex-col justify-between border-[var(--border-glow)]"
            style={{ opacity: 0 }}
          >
            <div>
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-xl font-display font-bold mb-2">The Browser Wars</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The 90s were a gold rush. Every idea became a startup.
                Every startup became an IPO. The browser wars raged.
                The world logged on for the first time.
              </p>
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)]">Scroll → to explore the era</div>
          </div>

          {/* Company cards */}
          {COMPANIES.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => (cardsRef.current[i + 1] = el)}
              data-cursor
              className="glass-card flex-shrink-0 w-60 md:w-72 h-80 p-6 flex flex-col justify-between
                cursor-pointer group transition-all duration-300"
              style={{ opacity: 0 }}
            >
              {/* Top */}
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {c.icon}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}` }}
                  />
                  <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">{c.year}</span>
                </div>
                <h3
                  className="text-xl font-display font-bold mb-2 group-hover:text-[var(--cyber-green)] transition-colors duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {c.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{c.desc}</p>
              </div>

              {/* Bottom bar */}
              <div
                className="h-0.5 w-0 group-hover:w-full transition-all duration-500 mt-4 rounded-full"
                style={{ backgroundColor: c.color }}
              />
            </div>
          ))}

          {/* Crash card */}
          <div
            ref={(el) => (cardsRef.current[COMPANIES.length + 1] = el)}
            className="glass-card flex-shrink-0 w-72 md:w-80 h-80 p-6 flex flex-col justify-center items-center text-center
              border border-[var(--neon-pink)] shadow-[0_0_30px_rgba(255,45,120,0.1)]"
            style={{ opacity: 0 }}
          >
            <div className="text-5xl mb-4">💥</div>
            <h3 className="text-xl font-display font-bold mb-2 text-[var(--neon-pink)] glow-text-pink">
              The Crash — 2000
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              $5 trillion in market value evaporated. The bubble burst — but the
              infrastructure, ideas, and internet habits survived.
            </p>
            <div className="mt-4 year-badge" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
              NASDAQ −78%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
