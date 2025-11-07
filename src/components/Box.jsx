import './Box.css'

function Box({ isOpen }) {
  return (
    <div className="box">
      <div className={`box-lid-left ${isOpen ? 'open' : ''}`}></div>
      <div className={`box-lid-right ${isOpen ? 'open' : ''}`}></div>
      <div className="box-front">
        <div className="box-label">🦙</div>
      </div>
    </div>
  )
}

export default Box

