// Hero Section — Three.js particle galaxy + GSAP cinematic intro reveal
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

export default function HeroSection({ onStartTour }) {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const yearRef = useRef(null)
  const scrollHintRef = useRef(null)
  const velocity = useScrollVelocity()
  const velocityRef = useRef(0)

  // Sync velocity to a ref for use in the Three.js loop without re-renders
  useEffect(() => {
    velocityRef.current = velocity
  }, [velocity])

  // Three.js Particle System 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 30

    // Create particle geometry 
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

    // 1. Network Layers (Background, Mid, Foreground)
    const layers = [
        { count: 120, dist: 12, speed: 0.2, opacity: 0.1, z: -40, size: 0.5 },
        { count: 80,  dist: 10, speed: 0.5, opacity: 0.3, z: -10, size: 1.0 },
        { count: 40,  dist: 8,  speed: 1.2, opacity: 0.6, z: 20,  size: 2.0 }
    ]

    const networkGroups = layers.map(layer => {
        const group = new THREE.Group()
        group.userData = layer
        scene.add(group)

        const nodes = []
        const nodePositions = new Float32Array(layer.count * 3)
        for (let i = 0; i < layer.count; i++) {
            const x = (Math.random() - 0.5) * 80
            const y = (Math.random() - 0.5) * 60
            const z = (Math.random() - 0.5) * 20 + layer.z
            
            // Avoid center text area slightly
            const distFromCenter = Math.sqrt(x*x + y*y)
            const nx = distFromCenter < 10 ? x * 2 : x
            const ny = distFromCenter < 10 ? y * 2 : y
            
            nodePositions[i*3] = nx
            nodePositions[i*3+1] = ny
            nodePositions[i*3+2] = z
            nodes.push(new THREE.Vector3(nx, ny, z))
        }

        const nodeGeo = new THREE.BufferGeometry()
        nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
        const nodeMat = new THREE.PointsMaterial({ 
            color: '#00d4a0', 
            size: layer.size, 
            transparent: true, 
            opacity: layer.opacity,
            blending: THREE.AdditiveBlending 
        })
        const nodePoints = new THREE.Points(nodeGeo, nodeMat)
        group.add(nodePoints)

        // Connections
        const linePositions = []
        const connections = []
        for (let i = 0; i < layer.count; i++) {
            for (let j = i + 1; j < layer.count; j++) {
                if (nodes[i].distanceTo(nodes[j]) < layer.dist) {
                    linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z)
                    linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z)
                    connections.push({ start: nodes[i], end: nodes[j] })
                }
            }
        }
        const lineGeo = new THREE.BufferGeometry()
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
        const lineMat = new THREE.LineBasicMaterial({ 
            color: '#00d4a0', 
            transparent: true, 
            opacity: layer.opacity * 0.5,
            blending: THREE.AdditiveBlending 
        })
        const lines = new THREE.LineSegments(lineGeo, lineMat)
        group.add(lines)

        // Data Packets
        const packetCount = Math.floor(connections.length * 0.3)
        const packets = []
        for (let i = 0; i < packetCount; i++) {
            const conn = connections[Math.floor(Math.random() * connections.length)]
            const packet = { 
                conn, 
                t: Math.random(), 
                speed: 0.002 + Math.random() * 0.005,
                mesh: new THREE.Mesh(
                    new THREE.SphereGeometry(0.1, 8, 8),
                    new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: layer.opacity })
                )
            }
            group.add(packet.mesh)
            packets.push(packet)
        }
        group.userData.packets = packets
        group.userData.nodes = nodes

        return group
    })

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    //  Mouse parallax 
    let mouseX = 0, mouseY = 0
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // Scroll-responsive rotation 
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll)

    //  Resize handler 
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    //  Animation loop 
    let animId
    const clock = new THREE.Clock()
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const vFactor = 1 + Math.abs(velocityRef.current / 400)
      
      networkGroups.forEach(group => {
        const layer = group.userData
        
        // Parallax + Movement
        group.rotation.y = t * (0.02 * layer.speed) + mouseX * (0.1 * layer.speed)
        group.rotation.x = mouseY * (0.05 * layer.speed) + scrollY * (0.0001)

        // Update Packets
        layer.packets.forEach(p => {
            p.t += p.speed * vFactor
            if (p.t > 1) {
                p.t = 0
                // Randomly burst faster (Data Spike)
                if (Math.random() > 0.95) p.speed *= 2
                else p.speed = 0.002 + Math.random() * 0.005
            }
            p.mesh.position.copy(p.conn.start).lerp(p.conn.end, p.t)
            p.mesh.scale.setScalar(0.5 + Math.sin(t * 10 + p.t * 20) * 0.5)
        })
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      networkGroups.forEach(g => {
          g.children.forEach(child => {
              if (child.geometry) child.geometry.dispose()
              if (child.material) child.material.dispose()
          })
      })
    }
  }, [])

  //  GSAP Cinematic Intro Timeline
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
            onClick={onStartTour}
            className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 hover:border-[var(--cyber-green)] hover:bg-[var(--cyber-green-dim)] transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[var(--cyber-green)]">
                <div className="w-2 h-2 bg-white rounded-full group-hover:bg-[var(--cyber-green)] animate-ping" />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase">Start Guided Tour</span>
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
        <span className="text-[10px] font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--cyber-green)] to-transparent" />
      </div>

      {/* Corner decorations (Masterwork HUD) */}
      <div className="absolute top-24 left-8 hidden lg:block pointer-events-none data-hud">
        <div className="text-[10px] font-mono text-[var(--text-muted)] leading-5">
          <div className="animate-pulse">SYS_BOOT &gt; INIT</div>
          <div className="text-[var(--cyber-green)]">NET_LAYER &gt; ACTIVE</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--cyber-green)] rounded-full animate-ping" />
            STORY &gt; 1969_V0.1
          </div>
        </div>
      </div>

      <div className="absolute top-24 right-8 hidden lg:block pointer-events-none data-hud">
        <div className="text-[10px] font-mono text-[var(--text-muted)] leading-5 text-right">
          <div className="opacity-50">1969 ────── 2024</div>
          <div className="text-white">NODES: <span className="hud-counter">5.4</span>B</div>
          <div className="text-cyan-400">STATUS: STABLE</div>
        </div>
      </div>
    </section>
  )
}
