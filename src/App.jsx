import { useState, useRef } from 'react'
import './App.css'
import Ground from './components/Ground'
import Box from './components/Box'
import ResetButton from './components/ResetButton'
import Llama from './components/Llama'

function App() {
  const [llamas, setLlamas] = useState([])
  const nextIdRef = useRef(0)

  // Constants for positioning
  const GROUND_HEIGHT = 150
  const BOX_HEIGHT = 120

  const handleClick = (e) => {
    // Get click position
    const clickX = e.clientX
    const clickY = e.clientY

    // Calculate box center position (where llamas spawn from)
    const boxCenterX = window.innerWidth / 2
    const boxCenterY = window.innerHeight - GROUND_HEIGHT - BOX_HEIGHT / 2

    // Create new llama at box position
    const newLlama = {
      id: `llama-${nextIdRef.current++}`,
      x: boxCenterX - 24, // Center the emoji (roughly 48px wide at 3rem)
      y: boxCenterY - 24, // Center the emoji (roughly 48px tall at 3rem)
      vx: 0, // velocity x (will use in Phase 4)
      vy: 0, // velocity y (will use in Phase 4)
      rotation: 0,
      state: 'spawning' // spawning, flying, bouncing, resting
    }

    setLlamas(prev => [...prev, newLlama])
  }

  const handleReset = () => {
    setLlamas([])
    nextIdRef.current = 0
  }

  return (
    <div className="app" onClick={handleClick}>
      <h1>🦙 LlamaBox</h1>
      <p>Click anywhere to spawn a llama!</p>
      
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
