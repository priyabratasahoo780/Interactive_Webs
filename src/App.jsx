// App.jsx — Root component, wires all sections + global elements
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Components
import CustomCursor    from './components/CustomCursor'
import Navigation      from './components/Navigation'
import Loader          from './components/Loader'

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
  const [isLoading, setIsLoading] = useState(true)

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
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

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
        <Footer onStartTour={() => setIsTourActive(true)} />
      </main>
    </>
  )
}

// Footer 
function Footer({ onStartTour }) {
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

        <AIStoryCTA onStartTour={onStartTour} />

        <p className="text-[var(--text-muted)] font-mono text-[10px] tracking-[0.2em] uppercase">
          © 2024 Internet Evolution — An Interactive Story
        </p>
      </div>
    </footer>
  )
}

function AIStoryCTA({ onStartTour }) {
  return (
    <div className="mb-16 group relative inline-block">
      {/* Dynamic background glow */}
      <div className="absolute inset-0 bg-[var(--cyber-green)]/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
      
      <button 
        onClick={onStartTour}
        data-cursor
        className="relative z-10 flex flex-col sm:flex-row items-center gap-6 px-8 py-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-[var(--cyber-green)]/40 hover:bg-black/60 shadow-2xl"
      >
        {/* Robot Icon Container */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-[var(--cyber-green)]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--cyber-green)] drop-shadow-[0_0_10px_rgba(0,212,160,0.5)]">
            <rect x="25" y="25" width="50" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="4" fill="currentColor" className="animate-pulse" />
            <circle cx="60" cy="40" r="4" fill="currentColor" className="animate-pulse" />
            <path d="M40 52 Q50 58 60 52" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M30 65 Q50 85 70 65" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="text-left">
          <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tight group-hover:text-[var(--cyber-green)] transition-colors">
            Start the Cinematic Journey
          </h3>
          <p className="text-[var(--text-muted)] font-mono text-xs max-w-xs leading-relaxed group-hover:text-white/80 transition-colors">
            Sit back and let our AI companion guide you through the digital evolution. 
            <span className="text-[var(--cyber-green)] ml-2">Experience the story hands-free.</span>
          </p>
        </div>

        {/* Arrow Action */}
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--cyber-green)] group-hover:bg-[var(--cyber-green)] group-hover:text-black transition-all duration-500">
           <svg className="w-4 h-4 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
           </svg>
        </div>
      </button>
    </div>
  )
}
