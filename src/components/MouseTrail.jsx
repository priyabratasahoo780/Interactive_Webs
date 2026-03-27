import { useEffect, useRef } from 'react'

/**
 * MouseTrail
 * Draws a flowing SVG path that follows the mouse movement.
 */
export default function MouseTrail() {
    const pathRef = useRef(null)
    const pointsRef = useRef([])
    const maxPoints = 20

    useEffect(() => {
        const onMouseMove = (e) => {
            const newPoint = { x: e.clientX, y: e.clientY }
            pointsRef.current.push(newPoint)
            
            if (pointsRef.current.length > maxPoints) {
                pointsRef.current.shift()
            }
            
            updatePath()
        }

        const updatePath = () => {
            if (!pathRef.current) return
            const d = pointsRef.current.reduce((acc, p, i) => {
                return acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`)
            }, '')
            pathRef.current.setAttribute('d', d)
        }

        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])

    return (
        <svg className="fixed inset-0 pointer-events-none z-[45] w-full h-full overflow-visible">
            <path 
                ref={pathRef}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-20 transition-colors duration-500"
                style={{ filter: 'drop-shadow(0 0 8px var(--accent-color))' }}
            />
        </svg>
    )
}
