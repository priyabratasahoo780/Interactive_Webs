// ARPANET Era (1960s–1980s) — Pinned section with SVG network animation + scroll-triggered text reveals
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

// ── Static ARPANET topology nodes and edges ──────────────────────────────────
const NODES = [
  { id: 'ucla',   x: 18,  y: 58, label: 'UCLA',     year: '1969' },
  { id: 'sri',    x: 14,  y: 30, label: 'SRI',      year: '1969' },
  { id: 'ucsb',   x: 30,  y: 72, label: 'UCSB',    year: '1969' },
  { id: 'utah',   x: 48,  y: 25, label: 'UTAH',    year: '1969' },
  { id: 'bbn',    x: 78,  y: 20, label: 'BBN',      year: '1970' },
  { id: 'mit',    x: 84,  y: 35, label: 'MIT',      year: '1970' },
  { id: 'rand',   x: 36,  y: 48, label: 'RAND',    year: '1971' },
  { id: 'sdc',    x: 22,  y: 42, label: 'SDC',      year: '1971' },
  { id: 'cmu',    x: 70,  y: 48, label: 'CMU',      year: '1971' },
  { id: 'harvard',x: 88,  y: 52, label: 'Harvard',  year: '1972' },
  { id: 'nasa',   x: 58,  y: 72, label: 'NASA',    year: '1973' },
  { id: 'london', x: 63,  y: 15, label: 'London',  year: '1973' },
]
const EDGES = [
  ['ucla','sri'], ['ucla','ucsb'], ['ucla','rand'],
  ['sri','utah'], ['utah','bbn'], ['bbn','mit'],
  ['mit','harvard'],['cmu','harvard'], ['cmu','bbn'],
  ['rand','sdc'], ['rand','utah'], ['rand','cmu'],
  ['nasa','ucsb'],['nasa','rand'], ['london','bbn'],
  ['london','mit'],['sdc','ucla'],
]

// Timeline milestones for the right panel
const MILESTONES = [
  { year: '1969', title: 'ARPANET born', desc: 'Four nodes connected at UCLA, SRI, UCSB, and Utah. The first message crashes after two letters.' },
  { year: '1971', title: 'Email invented', desc: 'Ray Tomlinson sends the first network email and chooses the @ symbol to separate user from machine.' },
  { year: '1973', title: 'TCP/IP designed', desc: 'Vint Cerf and Bob Kahn publish the protocol stack that will become the Internet\'s universal language.' },
  { year: '1983', title: '"Internet" begins', desc: 'ARPANET switches to TCP/IP. The modern internet is officially born. DNS is introduced.' },
  { year: '1989', title: 'WWW invented', desc: 'Tim Berners-Lee publishes his proposal "Information Management: A Proposal" at CERN.' },
]

export default function ArpanetSection() {
  const sectionRef = useRef(null)
  const svgRef = useRef(null)
  const textRef = useRef(null)
  const milestonesRef = useRef([])
  const timelineRef = useRef(null)
  const velocity = useScrollVelocity()

  // Dynamic timeScale based on velocity
  useEffect(() => {
    if (timelineRef.current) {
        // Adjust timeScale smoothy: baseline 1, increase with velocity
        const targetScale = 1 + Math.abs(velocity / 600)
        gsap.to(timelineRef.current, { 
            timeScale: Math.min(targetScale, 3.5), // Cap at 3.5x speed
            duration: 0.5,
            ease: 'power2.out'
        })
    }
  }, [velocity])

  useEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    if (!section || !svg) return

    // ── 1. Draw edges one by one ──────────────────────────────────────────────
    const lines = svg.querySelectorAll('.arpa-edge')
    lines.forEach((line) => {
      const x1 = parseFloat(line.getAttribute('x1') || '0')
      const y1 = parseFloat(line.getAttribute('y1') || '0')
      const x2 = parseFloat(line.getAttribute('x2') || '0')
      const y2 = parseFloat(line.getAttribute('y2') || '0')
      const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
    })

    // ── 2. Nodes start invisible ──────────────────────────────────────────────
    const circles = svg.querySelectorAll('.arpa-node-circle')
    const labels  = svg.querySelectorAll('.arpa-node-label')
    gsap.set([circles, labels], { opacity: 0, scale: 0, transformOrigin: 'center' })

    // ── 3. Pin + ScrollTrigger timeline ──────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    })
    timelineRef.current = tl

    // Draw all edges staggered
    tl.to(lines, {
      strokeDashoffset: 0,
      stagger: { each: 0.15, from: 'start' },
      duration: 0.6,
      ease: 'none',
    })
    // Reveal nodes with a pop
    .to(circles, {
      opacity: 1, scale: 1,
      stagger: 0.08, duration: 0.15, ease: 'back.out(2)',
    }, '-=0.5')
    .to(labels, {
      opacity: 1,
      stagger: 0.06, duration: 0.1,
    }, '<0.1')

    // ── 4. Text reveals staggered with the pinned scroll ─────────────────────
    milestonesRef.current.forEach((el, i) => {
      if (!el) return
      tl.fromTo(el,
        { opacity: 0, x: 40, filter: 'blur(4px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' },
        i * 0.2
      )
    })

    // ── 5. Heading big reveal ─────────────────────────────────────────────────
    const headEl = textRef.current?.querySelector('h2')
    if (headEl) {
      gsap.fromTo(headEl,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )
    }

    // ── 6. Pulse animation on nodes (CSS class driven) ────────────────────────
    circles.forEach((c) => {
      gsap.to(c, {
        attr: { r: '+=' + (Math.random() * 2 + 0.5) },
        duration: 1 + Math.random(),
        yoyo: true, repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      })
    })

    return () => ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === section) st.kill()
    })
  }, [])

  return (
    <section
      id="arpanet"
      ref={sectionRef}
      className="section relative min-h-screen bg-[var(--bg-dark)] flex items-center"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div
        className="absolute left-0 top-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,160,0.07) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Left: SVG ARPANET Map ─────────────────────────────────────────── */}
        <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            {/* Edges */}
            {EDGES.map(([a, b], i) => {
              const from = NODES.find((n) => n.id === a)
              const to   = NODES.find((n) => n.id === b)
              if (!from || !to) return null
              return (
                <line
                  key={i}
                  className="arpa-edge"
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  stroke="rgba(0,212,160,0.35)"
                  strokeWidth="0.4"
                  pathLength="1"
                />
              )
            })}

            {/* Nodes */}
            {NODES.map((n) => (
              <g key={n.id}>
                {/* Glow ring */}
                <circle
                  cx={n.x} cy={n.y} r="2.8"
                  fill="none"
                  stroke="rgba(0,212,160,0.2)"
                  strokeWidth="0.6"
                  className="arpa-node-circle"
                />
                {/* Core dot */}
                <circle
                  cx={n.x} cy={n.y} r="1.4"
                  fill="var(--cyber-green)"
                  className="arpa-node-circle"
                />
                {/* Label */}
                <text
                  x={n.x + 2.2} y={n.y + 0.5}
                  fontSize="2.5"
                  fill="rgba(240,244,255,0.7)"
                  fontFamily="JetBrains Mono, monospace"
                  className="arpa-node-label"
                >
                  {n.label}
                </text>
                <text
                  x={n.x + 2.2} y={n.y + 2.8}
                  fontSize="1.8"
                  fill="rgba(0,212,160,0.5)"
                  fontFamily="JetBrains Mono, monospace"
                  className="arpa-node-label"
                >
                  {n.year}
                </text>
              </g>
            ))}
          </svg>

          {/* Floating info chip */}
          <div className="absolute bottom-2 left-2 glass-card px-4 py-2 text-xs font-mono">
            <div className="text-[var(--cyber-green)]">ARPANET</div>
            <div className="text-[var(--text-muted)]">1969 — 12 nodes by 1972</div>
          </div>
        </div>

        {/* ── Right: Text + Timeline ────────────────────────────────────────── */}
        <div ref={textRef} className="flex flex-col gap-8">
          <div>
            <span className="year-badge">1960s – 1980s</span>
            <div className="section-divider mt-4" />
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 leading-tight" style={{ opacity: 0 }}>
              The{' '}
              <span className="gradient-text-cyber glow-text">First Network</span>
              <br />
              <span className="text-[var(--text-secondary)]">Changes Everything</span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] text-sm leading-relaxed max-w-md">
              In a Cold War laboratory, four computers began to talk. What started as a military
              experiment became the foundation of a global civilisation.
            </p>
          </div>

          {/* Milestone timeline */}
          <div className="flex flex-col gap-4">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                ref={(el) => (milestonesRef.current[i] = el)}
                style={{ opacity: 0 }}
                className="flex gap-4 items-start group"
              >
                {/* Year column */}
                <div className="flex-shrink-0 w-14 text-right">
                  <span className="font-mono text-xs text-[var(--cyber-green)] font-bold">{m.year}</span>
                </div>
                {/* Dot + line */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cyber-green)] shadow-[0_0_8px_var(--cyber-green)] mt-0.5" />
                  {i < MILESTONES.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-[var(--border-glow)]" />}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--cyber-green)] transition-colors duration-200">
                    {m.title}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
