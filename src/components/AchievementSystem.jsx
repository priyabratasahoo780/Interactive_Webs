import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MILESTONES = {
    hero: { title: 'Pioneer', desc: 'Started the digital journey.' },
    arpanet: { title: 'First Node', desc: 'Discovered the birth of networking.' },
    dotcom: { title: 'Market Maker', desc: 'Survived the .com explosion.' },
    social: { title: 'Influencer', desc: 'Connected the global collective.' },
    web3: { title: 'Architect', desc: 'Glimpsed the decentralized future.' },
    airevolution: { title: 'Singularity', desc: 'Witnessed the birth of machine mind.' },
    spatial: { title: 'Void Walker', desc: 'Blended digital and physical reality.' }
}

export default function AchievementSystem() {
    const [achievement, setAchievement] = useState(null)
    const toastRef = useRef(null)
    const audioRef = useRef(null)

    useEffect(() => {
        Object.keys(MILESTONES).forEach((id) => {
            ScrollTrigger.create({
                trigger: `#${id}`,
                start: 'top 30%',
                once: true, // Only show once per session
                onEnter: () => showAchievement(id)
            })
        })
    }, [])

    const showAchievement = (id) => {
        const data = MILESTONES[id]
        setAchievement(data)
        
        // Brief haptic beep (synthesized)
        playBeep()

        // Animation
        gsap.fromTo(toastRef.current, 
            { x: 100, opacity: 0, scale: 0.8 },
            { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        )

        // Hide after 4 seconds
        gsap.to(toastRef.current, {
            opacity: 0, 
            x: 50, 
            duration: 0.5, 
            delay: 4, 
            onComplete: () => setAchievement(null)
        })
    }

    const playBeep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(880, ctx.currentTime)
            gain.gain.setValueAtTime(0.1, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
            osc.start()
            osc.stop(ctx.currentTime + 0.1)
        } catch(e) {}
    }

    if (!achievement) return null

    return (
        <div 
            ref={toastRef}
            className="fixed top-24 right-8 z-[200] flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
        >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                🏆
            </div>
            <div>
                <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1">Milestone Reached</div>
                <div className="text-sm font-display font-bold text-white tracking-tight">{achievement.title}</div>
                <div className="text-[10px] text-white/40 font-mono">{achievement.desc}</div>
            </div>
        </div>
    )
}
