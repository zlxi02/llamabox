import { useState } from 'react'
import './App.css'
import Ground from './components/Ground'
import Box from './components/Box'

function App() {
  return (
    <div className="app">
      <h1>🦙 LlamaBox</h1>
      <p>Click anywhere to spawn a llama!</p>
      
      <Box />
      <Ground />
    </div>
  )
}

export default App
