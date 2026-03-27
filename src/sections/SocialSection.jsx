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

  // 0. Auto-play timeline every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        setActiveYear(prev => {
            const currentIndex = TIMELINE_YEARS.indexOf(prev)
            const nextIndex = (currentIndex + 1) % TIMELINE_YEARS.length
            return TIMELINE_YEARS[nextIndex]
        })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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

    // 1. Reveal heading (Masterwork Liquid Reveal)
    const headerWords = textRef.current?.querySelectorAll('.header-word')
    if (headerWords) {
        gsap.fromTo(headerWords,
            { opacity: 0, y: 40, filter: 'blur(10px)', skewX: 20 },
            {
                opacity: 1, y: 0, filter: 'blur(0px)', skewX: 0,
                stagger: 0.1, duration: 1.2, ease: 'expo.out',
                scrollTrigger: { trigger: section, start: 'top 65%' }
            }
        )
    }

    // 2. SVG Connectivity Paths (Phone to Text)
    const svgLayer = section.querySelector('.social-svg-layer')
    if (svgLayer && phoneRef.current) {
        const createPath = () => {
            const pRect = phoneRef.current.getBoundingClientRect()
            const tRect = textRef.current.getBoundingClientRect()
            const sRect = section.getBoundingClientRect()
            
            const x1 = pRect.left - sRect.left
            const y1 = pRect.top + pRect.height/2 - sRect.top
            const x2 = tRect.right - sRect.left
            const y2 = tRect.top + tRect.height/2 - sRect.top
            
            return `M ${x1} ${y1} C ${(x1+x2)/2} ${y1} ${(x1+x2)/2} ${y2} ${x2} ${y2}`
        }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', createPath())
        path.setAttribute('class', 'connectivity-path opacity-20')
        path.setAttribute('stroke', 'var(--cyber-green)')
        path.setAttribute('stroke-width', '1')
        path.setAttribute('fill', 'none')
        svgLayer.appendChild(path)
        
        gsap.fromTo(path, 
            { strokeDashoffset: 1000, strokeDasharray: 1000 },
            { strokeDashoffset: 0, duration: 3, repeat: -1, ease: 'none' }
        )
    }

    // 4. Stats counter (Odometer Style)

    // 2. Phone frame slides in 
    gsap.fromTo(phoneRef.current,
      { opacity: 0, y: 80, rotateY: -15 },
      {
        opacity: 1, y: 0, rotateY: 0,
        duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 60%' },
      }
    )

    // 3. App icons orbit in with stagger 
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

    // 6. Social Data Particles Generator
    const particleContainer = section.querySelector('.social-particle-field')
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const part = document.createElement('div')
            part.className = 'absolute w-1 h-1 bg-cyan-400/20 rounded-full'
            particleContainer.appendChild(part)
            
            gsap.set(part, { 
                x: gsap.utils.random(0, 100, true) + '%', 
                y: gsap.utils.random(0, 100, true) + '%',
                scale: gsap.utils.random(0.5, 2)
            })
            
            gsap.to(part, {
                y: '-=100',
                opacity: 0,
                duration: gsap.utils.random(3, 8),
                repeat: -1,
                delay: gsap.utils.random(0, 5),
                ease: 'none'
            })
        }
    }

    // 4. Stats counter (Odometer Style)
    const animateCounter = (el, target) => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2, ease: 'expo.out',
          onUpdate: function () {
            el.textContent = target >= 100
              ? Math.round(this.targets()[0].val).toLocaleString()
              : this.targets()[0].val.toFixed(1)
          }
        })
    }

    document.querySelectorAll('.social-counter').forEach((el) => {
      animateCounter(el, parseFloat(el.dataset.target))
    })

    // 5. Liquid Pill Navigation Indicator
    const navContainer = section.querySelector('.year-nav-container')
    const activeBtn = navContainer?.querySelector('.year-btn-active')
    const pill = section.querySelector('.liquid-nav-pill')
    if (pill && activeBtn) {
        gsap.set(pill, { 
            x: activeBtn.offsetLeft, 
            width: activeBtn.offsetWidth,
            height: activeBtn.offsetHeight,
            opacity: 1
        })
    }
    // 5. Interactive Magnetic Phone (3D Tilt)
    const onMouseMove = (e) => {
        const { clientX, clientY } = e
        const rect = phoneRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const moveX = (clientX - centerX) / 10
        const moveY = (clientY - centerY) / 10
        
        gsap.to(phoneRef.current, {
            rotationY: moveX,
            rotationX: -moveY,
            x: moveX * 0.5,
            y: moveY * 0.5,
            duration: 0.8,
            ease: 'power2.out'
        })

        // Magnetic Icons push/pull
        iconsRef.current.forEach((el) => {
            if (!el) return
            const iconRect = el.getBoundingClientRect()
            const ix = iconRect.left + iconRect.width / 2
            const iy = iconRect.top + iconRect.height / 2
            const dist = Math.hypot(clientX - ix, clientY - iy)
            
            if (dist < 150) {
                const angle = Math.atan2(clientY - iy, clientX - ix)
                const push = (150 - dist) * 0.3
                gsap.to(el, {
                    x: `-=${Math.cos(angle) * push}`,
                    y: `-=${Math.sin(angle) * push}`,
                    scale: 1.1,
                    duration: 0.4
                })
            } else {
                gsap.to(el, { scale: 1, duration: 0.6 })
            }
        })
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  // 6. Year change interactions
  useEffect(() => {
    // Fact reveal
    gsap.fromTo('.fact-reveal-bubble', 
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )

    // Liquid pill slide
    const navContainer = sectionRef.current?.querySelector('.year-nav-container')
    const activeBtn = navContainer?.querySelector(`[data-year="${activeYear}"]`)
    const pill = sectionRef.current?.querySelector('.liquid-nav-pill')
    if (pill && activeBtn) {
        gsap.to(pill, {
            x: activeBtn.offsetLeft,
            width: activeBtn.offsetWidth,
            duration: 0.6,
            ease: 'elastic.out(1, 0.75)'
        })
    }

    // Pulse stats cards
    gsap.fromTo('.stat-card-pulse',
        { opacity: 0, x: '-100%' },
        { opacity: 0.4, x: '100%', duration: 0.8, ease: 'power2.inOut', stagger: 0.1 }
    )
  }, [activeYear])

  return (
    <section
      id="social"
      ref={sectionRef}
      className="section relative min-h-screen bg-[#020410] flex items-center py-24 overflow-hidden"
    >
      {/* Background Depth Layers */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      <div className="social-particle-field absolute inset-0 pointer-events-none" />
      
      {/* SVG Connectivity Layer */}
      <svg className="social-svg-layer absolute inset-0 w-full h-full pointer-events-none z-0" />
      {/* Purple radial glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text + Timeline nav */}
        <div ref={textRef}>
          <div className="reveal-line">
            <span className="year-badge mb-4 inline-block">2000s – 2015</span>
          </div>
          <div className="section-divider" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mt-4 leading-tight">
            <span className="header-word inline-block mr-3">Social.</span>
            <span className="header-word inline-block gradient-text-cyber glow-text mr-3">Mobile.</span>
            <br />
            <span className="header-word inline-block text-[var(--text-secondary)]">Everywhere.</span>
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
              <div key={s.label} className="glass-card px-5 py-3 text-center min-w-[110px] relative overflow-hidden group border-none">
                {/* Liquid Neon Border */}
                <div className="absolute inset-0 border border-cyan-400/20 rounded-xl" />
                <div className="absolute inset-0 border border-cyan-400/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]" />
                
                {/* Data Pulse Beam */}
                <div className="stat-card-pulse absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 -translate-x-full pointer-events-none" />
                
                <div className="relative z-10 text-xl font-display font-bold text-[var(--cyber-green)] group-hover:scale-110 transition-transform duration-300">
                  <span className="social-counter" data-target={parseFloat(s.value)}>0</span>
                  {s.suffix}
                </div>
                <div className="relative z-10 text-[9px] font-mono text-[var(--text-muted)] tracking-wide mt-1 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Clickable year timeline with Liquid Pill */}
          <div className="year-nav-container mt-10 flex gap-3 flex-wrap reveal-line relative p-1 bg-[rgba(255,255,255,0.02)] rounded-full border border-white/5 w-fit">
            {/* Liquid Nav Pill */}
            <div className="liquid-nav-pill absolute top-1 bottom-1 bg-[var(--cyber-green)] rounded-full shadow-[0_0_16px_rgba(0,212,160,0.4)] opacity-0 pointer-events-none" />
            
            {TIMELINE_YEARS.map((yr) => (
              <button
                key={yr}
                data-year={yr}
                data-cursor
                onClick={() => setActiveYear(yr)}
                className={`year-btn relative z-10 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-colors duration-400
                  ${activeYear === yr
                    ? 'year-btn-active text-[var(--bg-dark)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--cyber-green)]'
                  }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Active year fact */}
          <div className="mt-4 glass-card px-5 py-4 max-w-md fact-reveal-bubble overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20" />
            <YearFact year={activeYear} />
          </div>
        </div>

        {/* Right: Phone + floating app icons */}
        <div className="relative flex items-center justify-center h-[520px]">
          {/* Phone frame */}
          <div
            ref={phoneRef}
            className="relative z-10 w-48 h-96 rounded-[2.5rem] border-2 border-[rgba(255,255,255,0.12)]
              bg-[rgba(255,255,255,0.04)] backdrop-blur-xl shadow-[0_0_60px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col items-center justify-center transition-transform"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
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
