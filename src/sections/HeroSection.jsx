// Hero Section — Three.js particle galaxy + GSAP cinematic intro reveal
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function HeroSection() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const yearRef = useRef(null)
  const scrollHintRef = useRef(null)

  // ─── Three.js Particle System ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 30

    // ── Create particle geometry ──
    const COUNT = 3500
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)

    const colorPalette = [
      new THREE.Color('#00d4a0'), // cyber green
      new THREE.Color('#6366f1'), // electric purple
      new THREE.Color('#818cf8'), // periwinkle
      new THREE.Color('#00a07a'), // deep teal
      new THREE.Color('#ff2d78'), // neon pink (accent)
    ]

    for (let i = 0; i < COUNT; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = 20 + Math.random() * 30
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) - 10

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3]     = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      sizes[i] = Math.random() * 2.0 + 0.5
    }

    // Dense center cluster (simulates a data nexus)
    for (let i = COUNT - 600; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      sizes[i] = Math.random() * 1.2 + 0.3
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          // Breathe effect: particles subtly pulse
          float breathe = 1.0 + 0.08 * sin(uTime * 0.8 + position.x * 0.3 + position.y * 0.2);
          gl_PointSize = size * uPixelRatio * breathe * (300.0 / -mvPos.z);
          vAlpha = 0.6 + 0.4 * breathe;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          // Circular soft particle
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Scroll-responsive rotation ──
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll)

    // ── Resize handler ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ──
    let animId
    const clock = new THREE.Clock()
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      material.uniforms.uTime.value = t

      // Slow auto-rotation
      particles.rotation.y = t * 0.04 + mouseX * 0.3
      particles.rotation.x = mouseY * 0.15 + scrollY * 0.0003

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  // ─── GSAP Cinematic Intro Timeline ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })

    // Split heading into words for stagger
    const heading = headingRef.current
    if (heading) {
      const words = heading.innerText.split(' ')
      heading.innerHTML = words
        .map((w) => `<span class="inline-block overflow-hidden"><span class="word inline-block">${w}&nbsp;</span></span>`)
        .join('')
    }

    tl
      // Year badge slides in
      .fromTo(yearRef.current,
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      )
      // Heading words stagger up
      .fromTo(heading?.querySelectorAll('.word') || [],
        { y: '110%', opacity: 0, rotateX: 40 },
        { y: '0%', opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' },
        '-=0.3'
      )
      // Subtitle fades + slides
      .fromTo(subRef.current,
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      // CTA button scales in
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
        '-=0.5'
      )
      // Scroll hint pulses in
      .fromTo(scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      )

    // Continuous scroll hint float
    gsap.to(scrollHintRef.current, {
      y: 10,
      duration: 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    })
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="section relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Three.js canvas */}
      <canvas ref={canvasRef} id="hero-canvas" style={{ opacity: 0.85 }} />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(2,5,16,0.75) 70%, rgba(2,5,16,1) 100%)',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Year badge */}
        <div ref={yearRef} className="flex items-center justify-center mb-6" style={{ opacity: 0 }}>
          <span className="year-badge">1969 → Now → Beyond</span>
        </div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.08] mb-6"
          style={{ perspective: '600px' }}
        >
          <span className="gradient-text-aurora glow-text">The Evolution</span>
          {' '}
          <br className="hidden md:block" />
          <span className="text-[var(--text-primary)]">of the Internet</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-base md:text-xl text-[var(--text-secondary)] font-light max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ opacity: 0 }}
        >
          From four nodes on ARPANET to a world of five billion users —
          scroll through the most transformative story in human history.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex items-center justify-center gap-4" style={{ opacity: 0 }}>
          <button
            data-cursor
            onClick={() => document.getElementById('arpanet')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 rounded-full font-mono text-sm tracking-wider overflow-hidden
              bg-gradient-to-r from-[var(--cyber-green)] to-[#00a07a] text-[var(--bg-dark)] font-semibold
              hover:shadow-[0_0_40px_rgba(0,212,160,0.4)] transition-all duration-300"
          >
            <span className="relative z-10">Begin the Journey</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          <button
            data-cursor
            className="px-8 py-4 rounded-full font-mono text-sm tracking-wider
              border border-[var(--border-glow)] text-[var(--text-secondary)] hover:text-[var(--cyber-green)]
              hover:border-[var(--cyber-green)] transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
        <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--cyber-green)] to-transparent" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-24 left-8 hidden lg:block pointer-events-none">
        <div className="text-[10px] font-mono text-[var(--text-muted)] leading-5">
          <div>SYS_BOOT &gt; INIT</div>
          <div>NET_LAYER &gt; ACTIVE</div>
          <div>STORY &gt; LOADING...</div>
        </div>
      </div>

      <div className="absolute top-24 right-8 hidden lg:block pointer-events-none">
        <div className="text-[10px] font-mono text-[var(--text-muted)] leading-5 text-right">
          <div>1969 ────── 2024</div>
          <div>NODES: 5.4B</div>
          <div>PACKETS: ∞</div>
        </div>
      </div>
    </section>
  )
}
