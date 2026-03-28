import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

const STORY_MILESTONES = [
  {
    year: "1969",
    title: "The First Message",
    description: "ARPANET sends 'LO' between two computers. The era of connectivity begins.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12h20M12 2v20M5 5l14 14M19 5L5 19" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      </svg>
    )
  },
  {
    year: "1990",
    title: "World Wide Web",
    description: "Tim Berners-Lee invents HTTP. The internet becomes accessible to humanity.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    )
  },
  {
    year: "2007",
    title: "The Mobile Shift",
    description: "Connectivity moves into our pockets. The world is always online.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    )
  },
  {
    year: "2024",
    title: "The Intelligence frontier",
    description: "AI and Decentralization redefine how we interact with the digital world.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
]

export default function Loader({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef(null)
  const milestoneRef = useRef(null)

  useEffect(() => {
    // Initial entrance
    gsap.fromTo(loaderRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power3.out" }
    )

    // Progress simulation (mocking asset loading for cinematic feel)
    const tl = gsap.timeline({
      onUpdate: () => {
        const p = Math.floor(tl.progress() * 100)
        setProgress(p)
      },
      onComplete: () => {
        // Final exit animation
        gsap.to(loaderRef.current, {
          y: "-100%",
          duration: 1.5,
          ease: "expo.inOut",
          delay: 0.5,
          onComplete: onComplete
        })
      }
    })

    // Storytelling sequence
    STORY_MILESTONES.forEach((_, index) => {
      tl.to({}, { 
        duration: 1.5, 
        onStart: () => {
          gsap.to(milestoneRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            onComplete: () => {
              setCurrentStep(index)
              gsap.to(milestoneRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4
              })
            }
          })
        }
      })
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[2000] bg-[var(--bg-dark)] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,160,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        <div ref={milestoneRef} className="milestone-content mb-12">
          <div className="flex justify-center mb-6 text-[var(--cyber-green)] filter drop-shadow-[0_0_8px_var(--cyber-green)]">
            {STORY_MILESTONES[currentStep].icon}
          </div>
          <p className="font-mono text-[var(--cyber-green)] text-xs tracking-[0.3em] uppercase mb-2">
            History in Progress // {STORY_MILESTONES[currentStep].year}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {STORY_MILESTONES[currentStep].title}
          </h2>
          <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
            {STORY_MILESTONES[currentStep].description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-[2px] bg-white/5 mx-auto relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-[var(--cyber-green)] transition-all duration-300 ease-out shadow-[0_0_10px_var(--cyber-green)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          Initializing Digital Evolution: {progress}%
        </div>
      </div>

      {/* Futuristic Scanline */}
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-20" />
    </div>
  )
}
