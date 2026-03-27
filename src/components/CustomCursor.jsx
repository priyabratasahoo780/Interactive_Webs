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
        const scaleFactor = 1 + Math.abs(velocity / 1200)
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
      // Check if we are hovering a magnetic element
      const hovered = document.elementFromPoint(e.clientX, e.clientY)
      const magnetic = hovered?.closest('[data-magnetic]') || (hovered?.tagName === 'BUTTON' ? hovered : null)

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        moveDotX(e.clientX)
        moveDotY(e.clientY)
        // Pull ring towards center
        moveRingX(centerX + (e.clientX - centerX) * 0.35)
        moveRingY(centerY + (e.clientY - centerY) * 0.35)
        
        ring.classList.add('cursor-magnetic')
      } else {
        moveDotX(e.clientX)
        moveDotY(e.clientY)
        moveRingX(e.clientX)
        moveRingY(e.clientY)
        ring.classList.remove('cursor-magnetic')
      }
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
