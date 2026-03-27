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
      { opacity: 1, y: 0, duration: 1, delay: 1.8, ease: 'power4.out' }
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

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(menuRef.current?.querySelectorAll('.menu-item'),
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power4.out' }
      )
    }
  }, [isOpen])

  const scrollTo = (id) => {
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 py-5 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2 group pointer-events-auto"
          data-cursor
        >
          <span className="text-base md:text-lg font-display font-bold gradient-text-cyber glow-text tracking-tight">
            INTERNET
          </span>
          <span className="hidden sm:inline text-[8px] md:text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase mt-0.5">
            Evolution
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              data-cursor
              className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 relative
                ${active === id ? 'text-[var(--cyber-green)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              {label}
              {active === id && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--cyber-green)] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Hamburger / Menu Toggle */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            data-cursor
            className={`md:hidden p-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md transition-all
              ${isOpen ? 'border-[var(--cyber-green)] bg-[var(--cyber-green-dim)]' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
                <span className={`w-full h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'translate-x-[20px] opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-transform duration-300 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </div>
          </button>

          <button
            data-cursor
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-mono tracking-wider
              border border-[var(--border-glow)] text-[var(--cyber-green)] hover:bg-[var(--cyber-green-dim)]
              hover:shadow-[0_0_20px_var(--cyber-green-dim)] transition-all duration-300 pointer-events-auto"
          >
            Begin Journey ↓
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={menuRef}
        className={`fixed inset-0 z-[90] bg-[#020510]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 transition-all duration-500 md:hidden
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col gap-10 items-center">
            {SECTIONS.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`menu-item text-3xl font-display font-bold tracking-tighter transition-colors
                        ${active === id ? 'text-[var(--cyber-green)]' : 'text-white/40'}`}
                >
                    {label}
                </button>
            ))}
            
            <div className="mt-8 flex flex-col items-center gap-4 menu-item">
                <div className="text-[10px] font-mono text-[var(--text-muted)] tracking-[0.3em] uppercase mb-2">Social</div>
                <div className="flex gap-4">
                    {['TW', 'IG', 'LI', 'YT'].map(s => (
                        <span key={s} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/5 text-[10px] font-mono">{s}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </>
  )
}
