import './Llama.css'

function Llama({ id, x, y, rotation }) {
  // Calculate if llama is near the box (should be behind it)
  // Box is at window.innerHeight - 150 (ground) - 60 (half box height)
  const boxY = window.innerHeight - 210
  const distanceFromBox = Math.abs(y - boxY)
  
  // If within 80px of box vertically and within 100px horizontally, render behind box
  const centerX = window.innerWidth / 2
  const distanceFromCenter = Math.abs(x - centerX)
  const isBehindBox = distanceFromBox < 80 && distanceFromCenter < 100
  
  const zIndex = isBehindBox ? 1 : 10
  
  return (
    <div 
      className="llama"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        '--rotation': `${rotation}deg`,
        zIndex: zIndex
      }}
    >
      <div className="llama-inner" style={{ transform: `rotate(${rotation}deg)` }}>
        🦙
      </div>
    </div>
  )
}

export default Llama

