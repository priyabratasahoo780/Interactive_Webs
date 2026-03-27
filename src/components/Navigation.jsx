// Navigation — fixed top nav with glowing logo + section dots
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SECTIONS = [
  { id: 'hero',        label: 'Intro' },
  { id: 'arpanet',     label: 'ARPANET' },
  { id: 'dotcom',      label: 'Dot-com' },
  { id: 'social',      label: 'Social Age' },
  { id: 'web3',        label: 'Web3' },
]

export default function Navigation() {
  const navRef = useRef(null)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    // Fade nav in on load
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, delay: 1.8, ease: 'power3.out' }
    )

    // Track which section is in view
    SECTIONS.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      })
    })
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{ opacity: 0 }}
    >
      {/* Logo */}
      <button
        onClick={() => scrollTo('hero')}
        className="flex items-center gap-2 group"
        data-cursor
      >
        <span className="text-lg font-display font-bold gradient-text-cyber glow-text tracking-tight">
          INTERNET
        </span>
        <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase mt-0.5">
          Evolution
        </span>
      </button>

      {/* Section dots */}
      <div className="hidden md:flex items-center gap-6">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            data-cursor
            className={`text-xs font-mono tracking-widest uppercase transition-all duration-300 relative
              ${active === id
                ? 'text-[var(--cyber-green)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
          >
            {label}
            {active === id && (
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--cyber-green)] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        data-cursor
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider
          border border-[var(--border-glow)] text-[var(--cyber-green)] hover:bg-[var(--cyber-green-dim)]
          transition-all duration-300"
      >
        Begin Journey ↓
      </button>
    </nav>
  )
}
