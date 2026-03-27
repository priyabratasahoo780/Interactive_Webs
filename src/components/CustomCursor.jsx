// Custom cursor component — dot + ring that follow the mouse with GSAP quickTo
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const velocity = useScrollVelocity()

  // Dynamic cursor scale based on scroll speed
  useEffect(() => {
    if (ringRef.current) {
        const scaleFactor = 1 + Math.abs(velocity / 800)
        gsap.to(ringRef.current, {
            scale: scaleFactor,
            duration: 0.3,
            ease: 'power2.out'
        })
    }
  }, [velocity])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    // gsap.quickTo returns a function for super-fast repeated animations
    const moveDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' })

    const onMove = (e) => {
      moveDotX(e.clientX)
      moveDotY(e.clientY)
      moveRingX(e.clientX)
      moveRingY(e.clientY)
    }

    // Add hover state for interactive elements
    const onEnter = () => {
      dot.classList.add('cursor-hover')
      ring.classList.add('cursor-hover')
    }
    const onLeave = () => {
      dot.classList.remove('cursor-hover')
      ring.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMove)

    const interactables = document.querySelectorAll('a, button, [data-cursor]')
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // Hide native cursor on the doc
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
