import './Llama.css'

function Llama({ id, x, y, rotation }) {
  return (
    <div 
      className="llama"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `rotate(${rotation}deg)`
      }}
    >
      🦙
    </div>
  )
}

export default Llama

