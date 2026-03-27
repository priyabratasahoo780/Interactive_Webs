import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Hooks
import { useSmoothScroll }    from './hooks/useSmoothScroll'
import { useScrollProgress }  from './hooks/useScrollProgress'
import { useScrollVelocity }  from './hooks/useScrollVelocity'
import { useThemeTransition } from './hooks/useThemeTransition'
import { useAudioSystem }     from './hooks/useAudioSystem'

// Components
import CustomCursor         from './components/CustomCursor'
import Navigation           from './components/Navigation'
import BackgroundEvolution  from './components/BackgroundEvolution'
import TimeTravelSlider     from './components/TimeTravelSlider'
import MiniMap              from './components/MiniMap'
import DataOverlay          from './components/DataOverlay'
import AchievementSystem    from './components/AchievementSystem'
import MouseTrail          from './components/MouseTrail'

// Sections
import HeroSection          from './sections/HeroSection'
import ArpanetSection       from './sections/ArpanetSection'
import DotcomSection        from './sections/DotcomSection'
import SocialSection        from './sections/SocialSection'
import Web3Section          from './sections/Web3Section'
import AIRevolutionSection  from './sections/AIRevolutionSection'
import SpatialComputingSection from './sections/SpatialComputingSection'

// Register GSAP plugins (idempotent)
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ─── ScrollTrigger global defaults ──────────────────────────────────────────
ScrollTrigger.defaults({
  markers: false,
})

export default function App() {
  useSmoothScroll()
  useScrollProgress()
  const velocity = useScrollVelocity()
  useThemeTransition()
  useAudioSystem()

  const mainRef = useRef(null)

  // ─── Supreme Polish: Page Warp & Shake ─────────────────────────────────────
  useEffect(() => {
    if (!mainRef.current) return
    const v = Math.abs(velocity)
    
    // 1. Warp Scale (Perspective stretch)
    const scale = 1 + (v / 5000)
    const blur = v / 800
    const contrast = 100 + (v / 20)

    gsap.to(mainRef.current, {
        '--warp-scale': Math.min(scale, 1.15),
        '--warp-blur': `${Math.min(blur, 4)}px`,
        '--warp-contrast': `${Math.min(contrast, 150)}%`,
        duration: 0.4,
        ease: 'power2.out'
    })

    // 2. Cinematic Shake for extreme speeds
    if (v > 2000) {
        gsap.to(mainRef.current, {
            x: 'random(-5, 5)',
            y: 'random(-5, 5)',
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: 'none'
        })
    } else {
        gsap.to(mainRef.current, { x: 0, y: 0, duration: 0.3 })
    }
  }, [velocity])

  useEffect(() => {
    window.addEventListener('load', () => {
      ScrollTrigger.refresh()
    })
    return () => ScrollTrigger.killAll()
  }, [])

  return (
    <>
      <div className="scroll-progress" />
      
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      <BackgroundEvolution />
      <MouseTrail />
      <Navigation />
      <MiniMap />
      <TimeTravelSlider />
      <DataOverlay />
      <AchievementSystem />

      <main 
        ref={mainRef}
        className="relative z-10 transition-all duration-300"
        style={{
            transform: 'scale(var(--warp-scale, 1))',
            filter: 'blur(var(--warp-blur, 0px)) contrast(var(--warp-contrast, 100%))'
        }}
      >
        <HeroSection id="hero" />
        <ArpanetSection id="arpanet" />
        <DotcomSection id="dotcom" />
        <SocialSection id="social" />
        <Web3Section id="web3" />
        <AIRevolutionSection id="airevolution" />
        <SpatialComputingSection id="spatial" />
        <Footer />
      </main>
    </>
  )
}

function Footer() {
  return (
    <footer className="relative py-20 bg-[#020510] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,160,0.04) 0%, transparent 70%)' }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text-aurora mb-4">
          The Story Isn't Over.
        </h2>
        <p className="text-[var(--text-muted)] font-mono text-sm tracking-wider mb-10">
          You are living in the most connected moment in history. What you build next is the next chapter.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border-glow)] max-w-xs" />
          <div className="w-2 h-2 rounded-full bg-[var(--cyber-green)] shadow-[0_0_8px_var(--cyber-green)]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border-glow)] max-w-xs" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['React.js', 'GSAP ScrollTrigger', 'Three.js', 'Lenis', 'Tailwind CSS'].map((tech) => (
            <span key={tech} className="year-badge text-[9px]">{tech}</span>
          ))}
        </div>

        <p className="text-[var(--text-muted)] font-mono text-[10px] tracking-[0.2em] uppercase">
          © 2024 Internet Evolution — An Interactive Story
        </p>
      </div>
    </footer>
  )
}
