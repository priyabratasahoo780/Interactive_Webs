import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * TimeTravelSlider
 * A futuristic range slider that controls and reflects the scroll position.
 * Features bidirectional synchronization and smooth snapping.
 */
export default function TimeTravelSlider() {
    const [progress, setProgress] = useState(0)
    const isInteracting = useRef(false)

    useEffect(() => {
        const st = ScrollTrigger.create({
            start: 0,
            end: 'bottom bottom',
            onUpdate: (self) => {
                if (!isInteracting.current) {
                    setProgress(self.progress * 100)
                }
            }
        })
        return () => st.kill()
    }, [])

    const handleSliderChange = (e) => {
        const val = parseFloat(e.target.value)
        setProgress(val)
        isInteracting.current = true
        
        const scrollPos = (val / 100) * (document.documentElement.scrollHeight - window.innerHeight)
        window.scrollTo({
            top: scrollPos,
            behavior: 'auto' // Use auto for instant sync during drag, Lenis handles smoothing
        })

        // Release interaction flag after a short delay
        clearTimeout(window.sliderTimer)
        window.sliderTimer = setTimeout(() => {
            isInteracting.current = false
        }, 100)
    }

    return (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6 select-none">
            <div className="relative group glass-card p-4 rounded-2xl border-white/10 backdrop-blur-xl">
                {/* Era Labels */}
                <div className="flex justify-between mb-3 px-1 text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">
                    <span>1969</span>
                    <span>1990</span>
                    <span>2010</span>
                    <span>2024</span>
                    <span>Beyond</span>
                </div>
                
                {/* Track Background */}
                <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSliderChange}
                    onMouseDown={() => { isInteracting.current = true }}
                    onMouseUp={() => { isInteracting.current = false }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Slider Handle (Decorative) */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100 ease-out"
                    style={{ left: `calc(${progress}% - 8px)` }}
                >
                    <div className="w-4 h-4 rounded-full border-2 border-white bg-[#020617] shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
            </div>
            
            <div className="text-center mt-3 font-mono text-[9px] text-white/30 tracking-widest uppercase italic">
                Interactive Era Control — Drag to Travel
            </div>
        </div>
    )
}
