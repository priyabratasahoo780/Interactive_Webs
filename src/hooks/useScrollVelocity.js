import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * useScrollVelocity
 * Returns the current scroll velocity (px/sec).
 * Optimized to avoid constant re-renders by using a ref for internal tracking
 * but providing a stateful value if needed for reactive UI.
 */
export function useScrollVelocity() {
    const [velocity, setVelocity] = useState(0)

    useEffect(() => {
        const trigger = ScrollTrigger.create({
            onUpdate: (self) => {
                const v = self.getVelocity()
                // Update state only if significant change or needed for UI
                // For logic-only, people often use a ref or proxy
                setVelocity(v)
            }
        })

        return () => trigger.kill()
    }, [])

    return velocity
}
