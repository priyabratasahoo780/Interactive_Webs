// App.jsx — Root component, wires all sections + global elements
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Components
import CustomCursor    from './components/CustomCursor'
import Navigation      from './components/Navigation'

// Sections
import HeroSection     from './sections/HeroSection'
import ArpanetSection  from './sections/ArpanetSection'
import DotcomSection   from './sections/DotcomSection'
import SocialSection   from './sections/SocialSection'
import Web3Section     from './sections/Web3Section'
import AIRevolutionSection from './sections/AIRevolutionSection'
import SpatialComputingSection from './sections/SpatialComputingSection'

// Hooks
import { useSmoothScroll }    from './hooks/useSmoothScroll'
import { useScrollProgress }  from './hooks/useScrollProgress'
import { useScrollVelocity }  from './hooks/useScrollVelocity'
import { useThemeTransition } from './hooks/useThemeTransition'
import { useAudioSystem }     from './hooks/useAudioSystem'

// Components
import BackgroundEvolution from './components/BackgroundEvolution'
import TimeTravelSlider    from './components/TimeTravelSlider'
import MiniMap             from './components/MiniMap'
import DataOverlay         from './components/DataOverlay'
import RobotGuide           from './components/RobotGuide'

// Register GSAP plugins (idempotent)
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ScrollTrigger global defaults 
ScrollTrigger.defaults({
  markers: false,
  // Ensure ScrollTrigger refreshes on dynamic content
})

export default function App() {
  const [isTourActive, setIsTourActive] = useState(false)

  useSmoothScroll()
  useScrollProgress()
  useScrollVelocity()
  useThemeTransition()
  useAudioSystem()

  useEffect(() => {
    // Refresh ScrollTrigger after fonts/images are loaded
    window.addEventListener('load', () => {
      ScrollTrigger.refresh()
    })
    return () => ScrollTrigger.killAll()
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" />

      {/* Custom cursor (hidden on touch devices) */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* High-end Background */}
      <BackgroundEvolution />

      {/* Navigation & Controls */}
      <Navigation onStartTour={() => setIsTourActive(true)} />
      <MiniMap />
      <TimeTravelSlider />
      <DataOverlay />
      <RobotGuide isActive={isTourActive} onExit={() => setIsTourActive(false)} />

      {/* Main story */}
      <main className="relative z-10">
        <HeroSection onStartTour={() => setIsTourActive(true)} />
        <ArpanetSection />
        <DotcomSection />
        <SocialSection />
        <Web3Section />
        <AIRevolutionSection />
        <SpatialComputingSection />
        <Footer />
      </main>
    </>
  )
}

// Footer 
function Footer() {
  return (
    <footer id="footer" className="relative py-20 bg-[#020510] border-t border-white/5 overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,160,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Big gradient text */}
        <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text-aurora mb-4">
          The Story Isn't Over.
        </h2>
        <p className="text-[var(--text-muted)] font-mono text-sm tracking-wider mb-10">
          You are living in the most connected moment in history. What you build next is the next chapter.
        </p>

        {/* Decorative node line */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border-glow)] max-w-xs" />
          <div className="w-2 h-2 rounded-full bg-[var(--cyber-green)] shadow-[0_0_8px_var(--cyber-green)]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border-glow)] max-w-xs" />
        </div>

        {/* Tech stack credits */}
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
