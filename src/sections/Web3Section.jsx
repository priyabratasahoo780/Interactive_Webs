// Web3 & Future Internet — Glitch text, holographic globe rings, Past vs Future toggle, constellation
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

const FUTURE_PILLARS = [
  { icon: '⛓️', title: 'Blockchain',     desc: 'Trustless, decentralized ledgers eliminate intermediaries across finance, law, and governance.' },
  { icon: '🧠', title: 'AI-Native Web',  desc: 'Interfaces understand intent, not commands. Every product personalizes itself in real-time.' },
  { icon: '🌐', title: 'Spatial Web',    desc: 'AR glasses replace screens. The internet becomes a layer on top of physical reality.' },
  { icon: '🔒', title: 'Zero-Trust',     desc: 'Self-sovereign identity. You own your data. No more logins — cryptographic proofs replace passwords.' },
  { icon: '⚡', title: 'Quantum Net',    desc: 'Quantum entanglement enables unhackable communications and exponentially faster computation.' },
  { icon: '🌍', title: 'Global Access',  desc: 'LEO satellites and mesh networks bring the remaining 2.7 billion unconnected humans online.' },
]

const PAST_PRESENT = {
  past:   { label: 'PAST',   accent: '#00d4a0', items: ['Dial-up modems', 'Web 1.0 read-only', 'Desktop-only', 'Centralized servers', 'Browser wars', 'No privacy by design'] },
  future: { label: 'FUTURE', accent: '#6366f1', items: ['Satellite broadband', 'Web3 read/write/own', 'Spatial computing', 'Decentralized edge nodes', 'Protocol wars', 'Privacy-first by design'] },
}

export default function Web3Section() {
  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const orbRef      = useRef(null)
  const cardsRef    = useRef([])
  const [toggle, setToggle] = useState('future')
  const velocity = useScrollVelocity()
  const ringTlsRef = useRef([])

  // Dynamic timeScale for rings
  useEffect(() => {
    ringTlsRef.current.forEach(tl => {
        const targetScale = 1 + Math.abs(velocity / 400)
        gsap.to(tl, { 
            timeScale: Math.min(targetScale, 5),
            duration: 0.6
        })
    })
  }, [velocity])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // 1. Glitch text on the heading 
    const title = titleRef.current
    if (title) {
      // Glitch flicker loop
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 4 })
      glitchTl
        .to(title, { skewX: 12, duration: 0.05, ease: 'none' })
        .to(title, { skewX: 0,  duration: 0.05 })
        .to(title, { x: -8, filter: 'blur(1px)', opacity: 0.8, duration: 0.05 })
        .to(title, { x: 8,  duration: 0.05 })
        .to(title, { x: 0,  filter: 'blur(0px)', opacity: 1, duration: 0.05 })
        .to(title, { skewX: -5, duration: 0.05 })
        .to(title, { skewX: 0,  duration: 0.05 })
    }

    // 2. Scroll-triggered heading reveal 
    gsap.fromTo(
      section.querySelectorAll('.web3-reveal'),
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 65%' },
      }
    )

    // 3. Globe rings rotate via CSS + GSAP 
    const rings = orbRef.current?.querySelectorAll('.orb-ring')
    rings?.forEach((ring, i) => {
      const tl = gsap.to(ring, {
        rotation: 360,
        duration: 8 + i * 4,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center',
      })
      ringTlsRef.current.push(tl)
    })
    // Globe glow pulse
    gsap.to(orbRef.current, {
      filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.5)) drop-shadow(0 0 60px rgba(0,212,160,0.2))',
      duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut',
    })

    // 4. Cards stagger in + Internal Parallax
    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.2, ease: 'power4.out', delay: i * 0.15,
          scrollTrigger: { trigger: card, start: 'top 90%' },
        }
      )
    })

    // 8. Advanced SVG Constellation (Connecting Cards to Orb)
    const svgLayer = section.querySelector('.constellation-svg')
    if (svgLayer && orbRef.current) {
        cardsRef.current.forEach((card, i) => {
            if (!card) return
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('class', 'constellation-path opacity-100')
            path.setAttribute('stroke', 'rgba(99,102,241,0.5)')
            path.setAttribute('stroke-width', '1.5')
            path.setAttribute('fill', 'none')
            svgLayer.appendChild(path)

            const updatePath = () => {
                const oRect = orbRef.current.getBoundingClientRect()
                const cRect = card.getBoundingClientRect()
                const sRect = section.getBoundingClientRect()
                
                const x1 = oRect.left + oRect.width / 2 - sRect.left
                const y1 = oRect.top + oRect.height / 2 - sRect.top
                const x2 = cRect.left + cRect.width / 2 - sRect.left
                const y2 = cRect.top - sRect.top
                
                path.setAttribute('d', `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1} ${x2} ${y2}`)
            }

            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    updatePath()
                    gsap.to(path, { opacity: 1, strokeDasharray: '1000', strokeDashoffset: '1000' })
                    gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: i * 0.1 })
                }
            })
            window.addEventListener('resize', updatePath)
        })
    }

    // 7. Elite Quote Reveal (Character-by-character blur-to-focus)
    const quote = section.querySelector('.quote-text')
    if (quote) {
        const text = quote.innerText
        quote.innerHTML = text.split('').map(char => `<span class="quote-char opacity-0 inline-block">${char === ' ' ? '&nbsp;' : char}</span>`).join('')
        
        gsap.to(quote.querySelectorAll('.quote-char'), {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: quote,
                start: 'top 85%',
            },
            onStart: () => {
                gsap.set(quote.querySelectorAll('.quote-char'), { filter: 'blur(10px)', y: 20 })
            }
        })
    }

    // 5. Interactive Magnetic Orb (Mouse Tracking)
    const onMouseMove = (e) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = orbRef.current.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        
        const moveX = (clientX - centerX) / 15
        const moveY = (clientY - centerY) / 15
        
        gsap.to(orbRef.current, {
            x: moveX,
            y: moveY,
            rotationY: moveX * 2,
            rotationX: -moveY * 2,
            duration: 0.8,
            ease: 'power2.out'
        })
    }
    window.addEventListener('mousemove', onMouseMove)

    // 6. Data-Steam Particles Generator
    const particleContainer = section.querySelector('.particle-field')
    if (particleContainer) {
        for (let i = 0; i < 60; i++) {
            const steam = document.createElement('div')
            steam.className = 'absolute w-[1px] h-12 bg-gradient-to-t from-transparent via-cyan-400/20 to-transparent'
            particleContainer.appendChild(steam)
            
            gsap.set(steam, { 
                x: gsap.utils.random(0, 100, true) + '%', 
                y: gsap.utils.random(100, 120, true) + '%',
                opacity: gsap.utils.random(0.1, 0.4)
            })
            
            gsap.to(steam, {
                y: '-120%',
                duration: gsap.utils.random(5, 10),
                repeat: -1,
                delay: gsap.utils.random(0, 10),
                ease: 'none'
            })
        }
    }

    return () => {
      title && gsap.killTweensOf(title)
      rings?.forEach((r) => gsap.killTweensOf(r))
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <section
      id="web3"
      ref={sectionRef}
      className="section relative min-h-screen bg-[#030618] py-24 overflow-hidden"
    >
      {/* Deep space gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,212,160,0.07) 0%, transparent 60%)',
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      
      {/* Dynamic Particle Field */}
      <div className="particle-field absolute inset-0 pointer-events-none overflow-hidden" />
      
      {/* SVG Constellation Layer */}
      <svg className="constellation-svg absolute inset-0 w-full h-full pointer-events-none z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="year-badge web3-reveal inline-block mb-6" style={{ borderColor: 'rgba(99,102,241,0.5)', color: '#818cf8' }}>
            Web3 + AI + Spatial Computing
          </span>

          <h2
            ref={titleRef}
            className="web3-reveal text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            <span className="gradient-text-aurora glow-text-purple">The Next</span>
            <br />
            <span className="text-[var(--text-primary)]">Internet</span>
          </h2>

          <p className="web3-reveal text-[var(--text-secondary)] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            We are at an inflection point as significant as 1969. Decentralization, AI, and
            spatial computing will rewrite every assumption about how the internet works.
          </p>
        </div>

        {/* Globe + Past/Future toggle */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20">

          {/* Holographic globe */}
          <div ref={orbRef} className="relative w-52 h-52 flex-shrink-0 flex items-center justify-center">
            {/* Core globe */}
            <div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,0.5), rgba(0,212,160,0.2) 50%, rgba(3,6,24,0.8) 100%)',
                border: '1px solid rgba(99,102,241,0.4)',
              }}
            />
            {/* Latitude line */}
            <div className="orb-ring absolute w-52 h-52 rounded-full border border-[rgba(0,212,160,0.25)]" style={{ transform: 'rotateX(75deg)' }} />
            {/* Longitude line 1 */}
            <div className="orb-ring absolute w-52 h-52 rounded-full border border-[rgba(99,102,241,0.25)]" style={{ transform: 'rotateY(75deg)' }} />
            {/* Longitude line 2 */}
            <div className="orb-ring absolute w-44 h-44 rounded-full border border-[rgba(0,212,160,0.15)]" style={{ transform: 'rotateY(45deg) rotateX(30deg)' }} />

            {/* Pulse rings */}
            <div className="absolute w-52 h-52 rounded-full border border-[rgba(99,102,241,0.15)] animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-64 h-64 rounded-full border border-[rgba(0,212,160,0.08)] animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

            {/* Center star */}
            <div className="relative z-10 text-3xl">🌐</div>
          </div>

          {/* Past vs Future toggle */}
          <div className="flex flex-col gap-4 max-w-sm w-full">
            {/* Toggle buttons */}
            <div className="flex rounded-full overflow-hidden border border-[var(--border-glow)] p-1 bg-[var(--bg-card)]">
              {['past', 'future'].map((t) => (
                <button
                  key={t}
                  data-cursor
                  onClick={() => setToggle(t)}
                  className={`flex-1 py-2 px-4 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-400
                    ${toggle === t
                      ? 'text-[var(--bg-dark)] font-bold shadow-lg'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  style={toggle === t ? { backgroundColor: PAST_PRESENT[t].accent } : {}}
                >
                  {PAST_PRESENT[t].label}
                </button>
              ))}
            </div>

            {/* Dynamic list */}
            <div className="glass-card p-5 space-y-2 transition-all duration-300">
              {PAST_PRESENT[toggle].items.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PAST_PRESENT[toggle].accent }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUTURE_PILLARS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => (cardsRef.current[i] = el)}
              data-cursor
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const xc = rect.width / 2
                const yc = rect.height / 2
                const dx = x - xc
                const dy = y - yc
                gsap.to(e.currentTarget, {
                    rotationY: dx / 10,
                    rotationX: -dy / 10,
                    duration: 0.4,
                    ease: 'power2.out'
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                })
              }}
              className="glass-card p-6 group cursor-pointer transition-colors"
              style={{ opacity: 0, perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              <div className="text-3xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 transform-gpu">{p.icon}</div>
              <h3 className="text-base font-display font-semibold mb-2 group-hover:text-[var(--electric-purple)] transition-colors duration-300">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors duration-300">{p.desc}</p>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[var(--electric-purple)] to-[var(--cyber-green)] group-hover:w-full transition-all duration-700 ease-in-out shadow-[0_0_15px_var(--accent-glow)]" />
            </div>
          ))}
        </div>

        {/* Closing quote */}
        <div className="mt-20 text-center">
          <blockquote className="quote-text text-2xl md:text-4xl font-display font-light text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed perspective-1000">
            "The internet will disappear. There will be so many IP addresses,
            so many devices, sensors, things that you are wearing, things that you
            are interacting with, that you won't even sense it."
          </blockquote>
          <p className="mt-4 text-xs font-mono text-[var(--text-muted)] tracking-widest animate-pulse opacity-60">— ERIC SCHMIDT, Google Chairman</p>
        </div>
      </div>
    </section>
  )
}
