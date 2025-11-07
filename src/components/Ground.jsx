import './Ground.css'

function Ground() {
  // Generate enough grass emojis to fill the screen width
  const grassPattern = '🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿'
  const repeats = Math.ceil(window.innerWidth / 30) // Approximate width per emoji
  const grassText = grassPattern.repeat(repeats)
  
  return (
    <div className="ground">
      <div className="grass-texture">
        {grassText}
      </div>
    </div>
  )
}

export default Ground

