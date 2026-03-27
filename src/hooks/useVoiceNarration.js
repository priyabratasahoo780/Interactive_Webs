import { useState, useCallback, useRef } from 'react'

/**
 * useVoiceNarration
 * A hook to manage Web Speech API narration with queueing and callbacks.
 */
export function useVoiceNarration() {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [currentText, setCurrentText] = useState('')
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    const utteranceRef = useRef(null)

    const speak = useCallback((text, onEnd) => {
        if (!synth) return
        
        // Cancel previous speech
        synth.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        utteranceRef.current = utterance
        
        // Find a "robot-like" or professional voice if available
        const voices = synth.getVoices()
        utterance.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0]
        
        utterance.rate = 0.95
        utterance.pitch = 1.1
        
        utterance.onstart = () => {
            setIsSpeaking(true)
            setCurrentText(text)
        }
        
        utterance.onend = () => {
            setIsSpeaking(false)
            setCurrentText('')
            if (onEnd) onEnd()
        }
        
        utterance.onerror = () => {
            setIsSpeaking(false)
            setCurrentText('')
        }

        synth.speak(utterance)
    }, [synth])

    const stop = useCallback(() => {
        if (synth) synth.cancel()
        setIsSpeaking(false)
        setCurrentText('')
    }, [synth])

    const pause = useCallback(() => {
        if (synth) synth.pause()
    }, [synth])

    const resume = useCallback(() => {
        if (synth) synth.resume()
    }, [synth])

    return { speak, stop, pause, resume, isSpeaking, currentText }
}
