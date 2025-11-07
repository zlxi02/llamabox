import './ResetButton.css'

function ResetButton({ onClick }) {
  const handleClick = (e) => {
    e.stopPropagation() // Prevent triggering parent click handler
    onClick()
  }

  return (
    <button className="reset-button" onClick={handleClick}>
      🔄 Reset
    </button>
  )
}

export default ResetButton

