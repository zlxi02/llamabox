import { useState, useRef } from 'react'
import './App.css'
import Ground from './components/Ground'
import Box from './components/Box'
import ResetButton from './components/ResetButton'
import Llama from './components/Llama'
import { usePhysics } from './hooks/usePhysics'
import { calculateInitialVelocity, PHYSICS } from './utils/physics'

function App() {
  const [llamas, setLlamas] = useState([])
  const nextIdRef = useRef(0)

  // Constants for positioning
  const GROUND_HEIGHT = 150
  const BOX_HEIGHT = 120
  const LLAMA_SIZE = 48 // Approximate size of emoji at 3rem

  // Calculate ground level for physics (where llama bottom should stop)
  const groundLevel = typeof window !== 'undefined' 
    ? window.innerHeight - GROUND_HEIGHT - LLAMA_SIZE 
    : 0

  // Use physics hook for animation
  usePhysics(llamas, setLlamas, groundLevel)

  const handleClick = (e) => {
    // Get click position
    const clickX = e.clientX
    const clickY = e.clientY

    // Calculate box center position (where llamas spawn from)
    const boxCenterX = window.innerWidth / 2
    const boxCenterY = window.innerHeight - GROUND_HEIGHT - BOX_HEIGHT / 2

    // Calculate initial velocity toward click point
    const { vx, vy } = calculateInitialVelocity(
      boxCenterX,
      boxCenterY,
      clickX,
      clickY
    )

    // Create new llama at box position with velocity
    const newLlama = {
      id: `llama-${nextIdRef.current++}`,
      x: boxCenterX - LLAMA_SIZE / 2, // Center the emoji
      y: boxCenterY - LLAMA_SIZE / 2, // Center the emoji
      vx,
      vy,
      rotation: 0,
      bounceCount: PHYSICS.MAX_BOUNCES,
      state: 'flying'
    }

    setLlamas(prev => [...prev, newLlama])
  }

  const handleReset = () => {
    setLlamas([])
    nextIdRef.current = 0
  }

  return (
    <div className="app" onClick={handleClick}>
      <div className="header" onClick={(e) => e.stopPropagation()}>
        <h1>🦙 LlamaBox</h1>
        <p>Click anywhere to spawn a llama!</p>
      </div>
      
      <Box />
      <ResetButton onClick={handleReset} />
      <Ground />

      {/* Render all llamas */}
      {llamas.map(llama => (
        <Llama 
          key={llama.id}
          id={llama.id}
          x={llama.x}
          y={llama.y}
          rotation={llama.rotation}
        />
      ))}
    </div>
  )
}

export default App
