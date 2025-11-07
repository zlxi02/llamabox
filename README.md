# 🦙 LlamaBox

An interactive React app where clicking spawns llamas that fly in parabolic arcs and bounce realistically on the ground with 2D physics simulation.

![LlamaBox Demo](demo.gif)

## 🎮 Features

- Click anywhere to spawn llamas from a wooden crate
- Llamas fly toward your click in realistic arcs
- Physics-based bouncing with energy loss
- Animated lid that opens when llamas spawn
- Smooth 60 FPS animation using `requestAnimationFrame`
- Reset button to clear all llamas

---

## 🏗️ Architecture Overview

### Component Structure
```
App.jsx (Main container)
├── Ground (Grass at bottom)
├── Box (Wooden crate with animated lid)
├── ResetButton (Clear all llamas)
└── Llama[] (Dynamically rendered llamas)
```

### State Management
- **`llamas`** - Array of llama objects with position, velocity, and state
- **`lidOpen`** - Boolean controlling box lid animation
- **`nextIdRef`** - Counter for unique llama IDs (using `useRef`)

### Custom Hooks
- **`usePhysics`** - Animation loop that updates llama positions 60 times per second

---

## 🚀 Implementation Steps

### Step 1: Project Setup
```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

### Step 2: Static Layout Components

Create the visual foundation with three main components:

**Ground Component** - Fixed grass bar at bottom
```javascript
function Ground() {
  const grassText = '🌿'.repeat(Math.ceil(window.innerWidth / 30))
  return <div className="ground">{grassText}</div>
}
```

**Box Component** - Wooden crate with split lid
```javascript
function Box({ isOpen }) {
  return (
    <div className="box">
      <div className={`box-lid-left ${isOpen ? 'open' : ''}`}></div>
      <div className={`box-lid-right ${isOpen ? 'open' : ''}`}></div>
      <div className="box-front">🦙</div>
    </div>
  )
}
```

**Lid Animation** - 2D rotation for barn-door effect
```css
.box-lid-left.open {
  transform: rotate(-135deg);  /* Swings left */
  transform-origin: center left;
}
.box-lid-right.open {
  transform: rotate(135deg);   /* Swings right */
  transform-origin: center right;
}
```

### Step 3: State Management & Click Handling

```javascript
function App() {
  const [llamas, setLlamas] = useState([])
  const [lidOpen, setLidOpen] = useState(false)
  const nextIdRef = useRef(0)
  const lidTimerRef = useRef(null)

  const handleClick = (e) => {
    const clickX = e.clientX
    const clickY = e.clientY
    
    // Calculate trajectory
    const { vx, vy } = calculateInitialVelocity(
      boxCenterX, boxCenterY,
      clickX, clickY
    )
    
    // Create new llama
    const newLlama = {
      id: `llama-${nextIdRef.current++}`,
      x: boxCenterX - 24,
      y: boxCenterY - 24,
      vx, vy,
      rotation: 0,
      bounceCount: 4,
      state: 'flying'
    }
    
    setLlamas(prev => [...prev, newLlama])
    
    // Open lid and start close timer
    setLidOpen(true)
    clearTimeout(lidTimerRef.current)
    lidTimerRef.current = setTimeout(() => setLidOpen(false), 800)
  }

  return (
    <div className="app" onClick={handleClick}>
      <Box isOpen={lidOpen} />
      {llamas.map(llama => (
        <Llama key={llama.id} {...llama} />
      ))}
    </div>
  )
}
```

**Key Concepts:**
- **`useState`** - Reactive state that triggers re-renders
- **`useRef`** - Persistent values without re-renders (ID counter, timers)
- **Event bubbling** - Prevent clicks on button/header with `e.stopPropagation()`
- **Dynamic rendering** - Use `.map()` to render variable number of llamas

---

## 🎯 Physics Engine

### Physics Constants
```javascript
export const PHYSICS = {
  GRAVITY: 0.6,           // Downward acceleration (px/frame²)
  INITIAL_VY: -15,        // Upward launch velocity (px/frame)
  BOUNCE_DAMPENING: 0.6,  // Energy retained on bounce (60%)
  FRICTION: 0.85,         // Horizontal slowdown (85%)
  MAX_BOUNCES: 4,         // Stop after 4 bounces
  STOP_THRESHOLD: 0.5,    // Velocity considered "stopped"
  ROTATION_SPEED: 2,      // Spin based on horizontal velocity
}
```

### Step 1: Calculate Initial Velocity

Convert click position into velocity vector:

```javascript
export function calculateInitialVelocity(boxX, boxY, clickX, clickY) {
  // Vector from box to click
  const dx = clickX - boxX
  const dy = clickY - boxY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Normalize and scale
  const speed = 8
  let vx = (dx / distance) * speed
  
  // Prevent straight vertical trajectory (causes infinite bouncing)
  const minHorizontalVelocity = 2
  if (Math.abs(vx) < minHorizontalVelocity) {
    vx = vx >= 0 ? minHorizontalVelocity : -minHorizontalVelocity
  }
  
  // Always launch upward for arc
  const vy = PHYSICS.INITIAL_VY
  
  return { vx, vy }
}
```

**Math Explained:**
- `dx, dy` = direction vector
- `distance` = magnitude (Pythagorean theorem)
- `dx/distance` = normalized direction (-1 to 1)
- Multiply by speed to get actual velocity
- Force minimum horizontal velocity to prevent edge case

### Step 2: Physics Update Loop

Update each llama's position every frame:

```javascript
export function updateLlamaPhysics(llama, groundLevel, deltaTime = 1) {
  if (llama.state === 'resting') return llama
  
  let { x, y, vx, vy, rotation, bounceCount } = llama
  
  // 1. Apply gravity
  vy += PHYSICS.GRAVITY * deltaTime
  
  // 2. Update position
  x += vx * deltaTime
  y += vy * deltaTime
  
  // 3. Update rotation
  rotation += vx * PHYSICS.ROTATION_SPEED * deltaTime
  
  // 4. Check ground collision
  if (y >= groundLevel) {
    y = groundLevel
    
    // Calculate post-bounce velocities
    const newVy = -Math.abs(vy) * PHYSICS.BOUNCE_DAMPENING
    const newVx = vx * PHYSICS.FRICTION
    
    // Check if should stop
    if (Math.abs(newVy) < PHYSICS.STOP_THRESHOLD * 2 || 
        bounceCount <= 0 ||
        (Math.abs(newVx) < PHYSICS.STOP_THRESHOLD && Math.abs(newVy) < 2)) {
      return { ...llama, x, y: groundLevel, vx: 0, vy: 0, rotation, state: 'resting' }
    }
    
    // Apply bounce
    vy = newVy
    vx = newVx
    bounceCount -= 1
  }
  
  return { ...llama, x, y, vx, vy, rotation, bounceCount, state: 'flying' }
}
```

**Physics Breakdown:**

1. **Gravity** - Constant downward acceleration
   ```
   Frame 0:  vy = -15 (up)
   Frame 1:  vy = -14.4
   Frame 25: vy = 0 (peak)
   Frame 26: vy = 0.6 (falling)
   ```

2. **Position Update** - Classic kinematics
   ```
   position = position + velocity
   ```

3. **Rotation** - Spin based on horizontal movement
   ```
   rotation += horizontal_velocity * 2
   ```

4. **Bounce Physics**
   - Reverse vertical velocity: `vy = -vy`
   - Apply dampening: `vy *= 0.6` (lose 40% energy)
   - Apply friction: `vx *= 0.85` (15% slowdown)
   - Each bounce is smaller and slower

5. **Stop Condition**
   - Velocity near zero
   - No bounces remaining
   - Set state to 'resting' (optimization: stops updating)

### Step 3: Animation Loop with usePhysics Hook

```javascript
export function usePhysics(llamas, setLlamas, groundLevel) {
  const animationFrameRef = useRef(null)
  const lastTimeRef = useRef(Date.now())
  
  useEffect(() => {
    const hasActiveLlamas = llamas.some(llama => llama.state !== 'resting')
    
    if (!hasActiveLlamas) return  // Optimization: stop when all resting
    
    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16, 2)
      lastTimeRef.current = currentTime
      
      setLlamas(prevLlamas => {
        return prevLlamas.map(llama => updateLlamaPhysics(llama, groundLevel, deltaTime))
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [llamas, setLlamas, groundLevel])
}
```

**Key Concepts:**

- **`requestAnimationFrame`** - Browser API for 60 FPS animations
  - Syncs with screen refresh rate
  - Pauses when tab hidden (performance)
  - Calls function before next repaint

- **Delta Time** - Time since last frame
  - Handles lag/slowdown gracefully
  - Normalizes to 16ms (60 FPS baseline)
  - Cap at 2x to prevent huge jumps

- **Optimization** - Only run loop when llamas are active
  - Check if any llama has state !== 'resting'
  - Cancel animation frame when all stopped
  - Saves CPU/battery

- **Cleanup** - Cancel animation on unmount
  - Return function in `useEffect` runs on cleanup
  - Prevents memory leaks

---

## 🎨 Advanced Features

### Dynamic Z-Index (Llama Behind Box Effect)

```javascript
function Llama({ x, y, rotation }) {
  const boxY = window.innerHeight - 210
  const centerX = window.innerWidth / 2
  
  const distanceFromBox = Math.abs(y - boxY)
  const distanceFromCenter = Math.abs(x - centerX)
  
  const isBehindBox = distanceFromBox < 80 && distanceFromCenter < 100
  const zIndex = isBehindBox ? 1 : 10
  
  return (
    <div className="llama" style={{ left: x, top: y, zIndex }}>
      <div style={{ transform: `rotate(${rotation}deg)` }}>🦙</div>
    </div>
  )
}
```

When llama is within 80x100px zone around box → z-index: 1 (behind box)
Otherwise → z-index: 10 (in front)

Creates illusion of llama emerging from inside the crate!

### Lid Timer Reset

```javascript
// Open lid
setLidOpen(true)

// Clear existing timer (if user clicks again)
if (lidTimerRef.current) {
  clearTimeout(lidTimerRef.current)
}

// Start new 800ms timer
lidTimerRef.current = setTimeout(() => {
  setLidOpen(false)
}, 800)
```

Rapid clicks keep lid open by resetting the timer each time.

---

## 📊 Performance Optimizations

1. **Conditional Animation Loop**
   - Only runs when llamas are flying/bouncing
   - Stops completely when all llamas resting

2. **useRef for Non-Reactive Data**
   - ID counter doesn't need to trigger re-renders
   - Timer references stored without causing updates

3. **Delta Time Normalization**
   - Handles varying frame rates
   - Consistent physics across devices

4. **CSS Transitions vs JS Animation**
   - Lid animation uses CSS (GPU accelerated)
   - Llama movement uses JS (needs physics calculations)

---

## 🧪 Interesting Physics Behaviors

### Parabolic Arc
Gravity creates natural projectile motion - same as throwing a ball in real life.

### Energy Loss
Each bounce loses 40% energy, creating progressively smaller bounces (like a real rubber ball).

### Friction
Horizontal velocity decreases by 15% per bounce, llamas slow down as they bounce.

### Rotation
Llamas spin based on horizontal velocity - faster movement = faster spin.

### Minimum Horizontal Velocity
Prevents edge case where clicking straight up causes infinite tiny bounces.

---

## 🛠️ Tech Stack

- **React 18** - Component framework
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling and animations
- **requestAnimationFrame** - 60 FPS game loop

---

## 📚 Key Learning Concepts

### React
- `useState` - Reactive state management
- `useRef` - Persistent values without re-renders
- `useEffect` - Side effects and cleanup
- Custom hooks - Reusable logic (`usePhysics`)
- Props - Parent-child communication
- Dynamic rendering - `.map()` for lists

### JavaScript
- Event handling - Click events, propagation
- Timers - `setTimeout`, `clearTimeout`
- Animation - `requestAnimationFrame`
- Vector math - Direction, magnitude, normalization
- Object spreading - Immutable state updates

### Physics
- Kinematics - Position, velocity, acceleration
- Gravity - Constant downward force
- Collision detection - Ground plane intersection
- Elastic collisions - Bounce with energy loss
- Friction - Velocity dampening

### CSS
- Positioning - `absolute`, `fixed`, `transform`
- Z-index layering - Depth management
- 2D transforms - `rotate()`, `translate()`
- Transitions - Smooth property changes
- Animations - Keyframe sequences

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🎯 Future Enhancements

- [ ] Sound effects (pop, bounce)
- [ ] Particle effects on spawn
- [ ] Multiple llama types/colors
- [ ] Llama size variation
- [ ] Wind physics (horizontal force)
- [ ] Wall collision detection
- [ ] Llama stacking physics
- [ ] Score/counter system
- [ ] Mobile touch support optimization

---

## 📝 License

MIT - Feel free to use this code for learning!

---

## 🦙 Credits

Built as an educational project to demonstrate React hooks, animation loops, and 2D physics simulation.
