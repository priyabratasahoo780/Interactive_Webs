import { useState, useEffect } from 'react'
import { gsap } from 'gsap'

export default function DataOverlay() {
    const [isVisible, setIsVisible] = useState(false)
    const [packets, setPackets] = useState([])

    // Simulated "Packet" stream logic
    useEffect(() => {
        if (!isVisible) return
        
        const interval = setInterval(() => {
            const newPacket = {
                id: Math.random(),
                x: Math.random() * 100,
                y: Math.random() * 100,
                val: (Math.random() * 1000).toFixed(0),
                type: ['TCP', 'UDP', 'IP', 'HTTP'][Math.floor(Math.random() * 4)]
            }
            setPackets(prev => [...prev.slice(-15), newPacket])
        }, 300)

        return () => clearInterval(interval)
    }, [isVisible])

    return (
        <>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsVisible(!isVisible)}
                className="fixed left-8 bottom-24 z-[100] group flex flex-col items-center gap-2"
                data-cursor
            >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500
                    ${isVisible ? 'border-amber-400 bg-amber-400/20 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : 'border-white/20 hover:border-white/40'}`}
                >
                    <div className={`w-4 h-4 rounded-sm border-2 transition-transform duration-700 ${isVisible ? 'rotate-45 border-amber-400' : 'border-white/40'}`} />
                </div>
                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/40 group-hover:text-white/80 transition-colors">
                    {isVisible ? 'Exit Scanner' : 'Data Scan'}
                </span>
            </button>

            {/* Overlay View */}
            {isVisible && (
                <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden bg-amber-950/5">
                    {/* Corner Highlights */}
                    <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-amber-400/40" />
                    <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-amber-400/40" />
                    <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-amber-400/40" />
                    <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-amber-400/40" />

                    {/* Scrolling Packets */}
                    {packets.map(p => (
                        <div 
                            key={p.id}
                            className="absolute text-[10px] font-mono text-amber-400/40 whitespace-nowrap"
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        >
                            {p.type}::{p.val} <br />
                            <span className="text-[6px] opacity-30">ENCRYPTING...</span>
                        </div>
                    ))}

                    {/* HUD Central Indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                        <div className="w-64 h-64 rounded-full border border-amber-400/10 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                            <div className="w-[90%] h-[90%] border-t border-amber-400/30 rounded-full" />
                        </div>
                        <div className="text-[10px] font-mono text-amber-400 tracking-[1em] uppercase animate-pulse">Scanning Neural Layer</div>
                    </div>
                </div>
            )}
        </>
    )
}
