import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

/**
 * useAutoScroll
 * Logic for programmatically moving between story sections.
 */
export function useAutoScroll() {
    const scrollTweenRef = useRef(null)

    const scrollToSection = (id, duration = 1.5, onComplete) => {
        const el = document.getElementById(id)
        if (!el) return

        // Kill any existing scroll tween
        if (scrollTweenRef.current) scrollTweenRef.current.kill()

        scrollTweenRef.current = gsap.to(window, {
            scrollTo: { y: el, autoKill: false },
            duration,
            ease: 'power3.inOut',
            onComplete: () => {
                scrollTweenRef.current = null
                if (onComplete) onComplete()
            }
        })
    }

    const stopScrolling = () => {
        if (scrollTweenRef.current) {
            scrollTweenRef.current.kill()
            scrollTweenRef.current = null
        }
    }

    return { scrollToSection, stopScrolling }
}
