import { useEffect, useRef } from 'react'
import { updateLlamaPhysics } from '../utils/physics'

/**
 * Custom hook to handle physics animation loop
 */
export function usePhysics(llamas, setLlamas, groundLevel) {
  const animationFrameRef = useRef(null)
  const lastTimeRef = useRef(Date.now())
  
  useEffect(() => {
    // Only run animation if there are llamas that aren't resting
    const hasActiveLlamas = llamas.some(llama => llama.state !== 'resting')
    
    if (!hasActiveLlamas) {
      return // No active llamas, don't run animation loop
    }
    
    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16, 2) // Cap at 2x for lag
      lastTimeRef.current = currentTime
      
      setLlamas(prevLlamas => {
        // Update physics for each llama
        return prevLlamas.map(llama => updateLlamaPhysics(llama, groundLevel, deltaTime))
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate)
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [llamas, setLlamas, groundLevel])
}

