// Custom hook: initializes Lenis smooth scroll and registers GSAP ScrollTrigger with it
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, 
      touchMultiplier: 2.0,
      lerp: 0.1,
      infinite: false,
    })

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP's ticker for professional-grade RAF handling
    const update = (time) => {
      lenis.raf(time * 1000) // Convert seconds from GSAP ticker to milliseconds for Lenis
    }
    
    gsap.ticker.add(update)

    // Connect ScrollTrigger to Lenis scroll
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])
}
