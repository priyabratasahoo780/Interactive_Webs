// Custom hook: tracks scroll progress (0–1) and updates a CSS transform on the progress bar
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector('.scroll-progress')
    if (!bar) return

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.to(bar, {
          scaleX: self.progress,
          duration: 0.15,
          ease: 'none',
        })
      },
    })

    return () => st.kill()
  }, [])
}
