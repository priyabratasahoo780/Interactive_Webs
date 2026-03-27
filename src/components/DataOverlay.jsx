import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function DataOverlay() {
    const [isVisible, setIsVisible] = useState(false)
    const [packets, setPackets] = useState([])
    const overlayRef = useRef(null)
    const scanLineRef = useRef(null)

    // Simulated "Packet" stream logic
    useEffect(() => {
        if (!isVisible) return
        
        const interval = setInterval(() => {
            const newPacket = {
                id: Math.random(),
                x: Math.random() * 100,
                y: Math.random() * 100,
                val: (Math.random() * 1000).toFixed(0),
                type: ['TCP', 'UDP', 'IP', 'HTTP'][Math.floor(Math.random() * 4)],
                size: (Math.random() * 64).toFixed(0) + 'kb'
            }
            setPackets(prev => [...prev.slice(-20), newPacket])
        }, 200)

        // Overlay "Boot" Animation
        gsap.fromTo(overlayRef.current,
            { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }
        )

        // Continuous Scan Line
        gsap.to(scanLineRef.current, {
            top: '100%',
            duration: 3,
            repeat: -1,
            ease: 'none'
        })

        return () => {
            clearInterval(interval)
            gsap.killTweensOf(overlayRef.current)
            gsap.killTweensOf(scanLineRef.current)
        }
    }, [isVisible])

    return (
        <>
            {/* Toggle Button - Redesigned HUD Style */}
            <button 
                onClick={() => setIsVisible(!isVisible)}
                className="fixed left-8 bottom-24 z-[100] group flex flex-col items-center gap-3"
                data-cursor
            >
                <div className={`relative w-14 h-14 flex items-center justify-center transition-all duration-500
                    ${isVisible ? 'scale-110' : 'hover:scale-105'}`}
                >
                    {/* Rotating Orbital Ring */}
                    <div className={`absolute inset-0 border-2 border-dashed rounded-full transition-all duration-700
                        ${isVisible ? 'border-amber-400 animate-spin-slow' : 'border-white/20 animate-none'}`}
                         style={{ animationDuration: '6s' }}
                    />
                    
                    {/* Pulsing Core */}
                    <div className={`w-3 h-3 rounded-full transition-all duration-500
                        ${isVisible ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' : 'bg-white/40'}`}
                    />

                    {/* Corner Brackets (Static but react to hover) */}
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current" />
                    </div>
                </div>
                
                <div className="flex flex-col items-center">
                    <span className={`text-[9px] font-mono tracking-[0.4em] uppercase transition-colors
                        ${isVisible ? 'text-amber-400 font-bold' : 'text-white/40 group-hover:text-white/80'}`}>
                        {isVisible ? 'Disconnect' : 'Initial Scan'}
                    </span>
                    <div className={`h-px bg-amber-400 transition-all duration-500 ${isVisible ? 'w-full' : 'w-0'}`} />
                </div>
            </button>

            {/* Overlay View - Cinematic HUD */}
            {isVisible && (
                <div 
                    ref={overlayRef}
                    className="fixed inset-0 z-[90] pointer-events-none overflow-hidden bg-amber-950/10 backdrop-blur-[2px]"
                >
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none" />
                    
                    {/* Laser Scan Line */}
                    <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent shadow-[0_0_20px_#fbbf24] z-20" />

                    {/* Dynamic HUD Layout (Decorative) */}
                    <div className="absolute top-12 left-12 p-4 border-l border-amber-400/20">
                        <div className="text-[10px] font-mono text-amber-400/40 uppercase mb-1">System Status</div>
                        <div className="flex gap-2">
                             {[1,1,1,0,1,1,0].map((v, i) => (
                                 <div key={i} className={`w-1 h-3 ${v ? 'bg-amber-400/40' : 'bg-transparent border border-amber-400/20'}`} />
                             ))}
                        </div>
                    </div>

                    {/* Scrolling Packets with randomized metadata */}
                    {packets.map(p => (
                        <div 
                            key={p.id}
                            className="absolute text-[9px] font-mono text-amber-400/60 transition-all duration-1000"
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        >
                            <span className="text-amber-400">[{p.type}]</span> 0x{p.val} // {p.size}
                            <div className="w-8 h-1 bg-amber-400/20 mt-1 overflow-hidden">
                                <div className="h-full bg-amber-400/60 animate-load" style={{ animationDuration: '0.8s' }} />
                            </div>
                        </div>
                    ))}

                    {/* HUD Central Reticle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                        <div className="relative w-72 h-72 flex items-center justify-center">
                            {/* Inner Spin */}
                            <div className="absolute inset-4 border border-amber-400/10 rounded-full animate-spin-slow" />
                            {/* Outer Dash Spin */}
                            <div className="absolute inset-0 border border-dashed border-amber-400/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
                            {/* Hexagon Core (SVG) */}
                            <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-400/40 animate-pulse">
                                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="text-[10px] font-mono text-amber-400/60 tracking-[1.2em] uppercase animate-pulse">
                            Neural Intercept Active
                        </div>
                    </div>

                    {/* Bottom Status Ticker */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 text-[8px] font-mono text-amber-400/30 uppercase tracking-[0.3em]">
                        <span>LATENCY: 12ms</span>
                        <span>ENCRYPTION: AES-256</span>
                        <span>PACKETS: {packets.length}</span>
                    </div>
                </div>
            )}
        </>
    )
}
