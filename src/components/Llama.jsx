import './Llama.css'

function Llama({ id, x, y, rotation }) {
  return (
    <div 
      className="llama"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        '--rotation': `${rotation}deg`
      }}
    >
      <div className="llama-inner" style={{ transform: `rotate(${rotation}deg)` }}>
        🦙
      </div>
    </div>
  )
}

export default Llama

