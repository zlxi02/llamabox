import { useState } from 'react'
import './App.css'
import Ground from './components/Ground'
import Box from './components/Box'
import ResetButton from './components/ResetButton'

function App() {
  const handleReset = () => {
    // Will implement this in Phase 3
    console.log('Reset clicked!')
  }

  return (
    <div className="app">
      <h1>🦙 LlamaBox</h1>
      <p>Click anywhere to spawn a llama!</p>
      
      <Box />
      <ResetButton onClick={handleReset} />
      <Ground />
    </div>
  )
}

export default App
