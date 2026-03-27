import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * useThemeTransition
 * Smoothly transitions CSS variables based on section entry.
 * Defines themes for Arpanet, Dotcom, Social, and Web3 eras.
 */
export function useThemeTransition() {
    useEffect(() => {
        const themes = {
            hero: {
                '--bg-color': '#020617',
                '--accent-color': '#38bdf8', // Cyber blue
                '--accent-glow': 'rgba(56, 189, 248, 0.4)',
                '--text-main': '#f8fafc'
            },
            arpanet: {
                '--bg-color': '#051005', // Terminal black-green
                '--accent-color': '#22c55e', // Console green
                '--accent-glow': 'rgba(34, 197, 94, 0.4)',
                '--text-main': '#dcfce7'
            },
            dotcom: {
                '--bg-color': '#0f021e', // Deep purple
                '--accent-color': '#f0abfc', // Neon pink/purple
                '--accent-glow': 'rgba(240, 171, 252, 0.4)',
                '--text-main': '#fdf4ff'
            },
            social: {
                '--bg-color': '#020817', // Dark navy
                '--accent-color': '#60a5fa', // Social blue
                '--accent-glow': 'rgba(96, 165, 250, 0.4)',
                '--text-main': '#f0f9ff'
            },
            web3: {
                '--bg-color': '#0a0a0a', // True black
                '--accent-color': '#fbbf24', // Gold/Amber
                '--accent-glow': 'rgba(251, 191, 36, 0.4)',
                '--text-main': '#fff7ed'
            },
            airevolution: {
                '--bg-color': '#050510', // Deep ink
                '--accent-color': '#f59e0b', // Amber
                '--accent-glow': 'rgba(245, 158, 11, 0.4)',
                '--text-main': '#fffef0'
            },
            spatial: {
                '--bg-color': '#020205', // Void black
                '--accent-color': '#22d3ee', // Cyan
                '--accent-glow': 'rgba(34, 211, 238, 0.4)',
                '--text-main': '#f0fdff'
            }
        }

        const sections = [
            { id: '#hero', theme: themes.hero },
            { id: '#arpanet', theme: themes.arpanet },
            { id: '#dotcom', theme: themes.dotcom },
            { id: '#social', theme: themes.social },
            { id: '#web3', theme: themes.web3 },
            { id: '#airevolution', theme: themes.airevolution },
            { id: '#spatial', theme: themes.spatial }
        ]

        sections.forEach(({ id, theme }) => {
            ScrollTrigger.create({
                trigger: id,
                start: 'top 50%',
                onEnter: () => applyTheme(theme),
                onEnterBack: () => applyTheme(theme)
            })
        })

        function applyTheme(theme) {
            gsap.to(':root', {
                ...theme,
                duration: 1.2,
                ease: 'power2.out'
            })
        }

        return () => {
            ScrollTrigger.getAll().forEach(st => {
                if (sections.some(s => s.id === st.trigger?.id)) st.kill()
            })
        }
    }, [])
}
