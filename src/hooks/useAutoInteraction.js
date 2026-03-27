import { useCallback } from 'react'

/**
 * useAutoInteraction
 * Simulates user interactions (hover, click, highlight) on guide nodes.
 */
export function useAutoInteraction() {
    const triggerInteraction = useCallback((nodeId, action) => {
        const el = document.querySelector(`[data-guide-id="${nodeId}"]`)
        if (!el) return

        if (action === 'hover') {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
            el.classList.add('guide-hover-sim')
            setTimeout(() => {
                el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
                el.classList.remove('guide-hover-sim')
            }, 3000)
        }

        if (action === 'click') {
            el.click()
            el.classList.add('guide-click-sim')
            setTimeout(() => el.classList.remove('guide-click-sim'), 1000)
        }

        if (action === 'highlight') {
            el.classList.add('guide-highlight-pulse')
            setTimeout(() => el.classList.remove('guide-highlight-pulse'), 4000)
        }
    }, [])

    return { triggerInteraction }
}
