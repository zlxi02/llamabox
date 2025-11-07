// Physics constants
export const PHYSICS = {
  GRAVITY: 0.6,           // Pixels per frame^2
  INITIAL_VY: -15,        // Initial upward velocity
  BOUNCE_DAMPENING: 0.6,  // Energy retained on bounce (60%)
  FRICTION: 0.85,         // Horizontal friction
  MAX_BOUNCES: 4,         // Number of bounces before stopping
  STOP_THRESHOLD: 0.5,    // Velocity threshold to stop
  ROTATION_SPEED: 2,      // Rotation based on horizontal velocity
}

/**
 * Calculate initial velocity based on click position and box position
 */
export function calculateInitialVelocity(boxX, boxY, clickX, clickY) {
  // Calculate direction from box to click
  const dx = clickX - boxX
  const dy = clickY - boxY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Normalize and scale the horizontal velocity
  const speed = 8 // Base horizontal speed
  const vx = (dx / distance) * speed
  
  // Always start with upward velocity for the arc
  const vy = PHYSICS.INITIAL_VY
  
  return { vx, vy }
}

/**
 * Update llama physics for one frame
 */
export function updateLlamaPhysics(llama, groundLevel, deltaTime = 1) {
  if (llama.state === 'resting') {
    return llama // Don't update resting llamas
  }
  
  // Apply gravity
  let { x, y, vx, vy, rotation, bounceCount = PHYSICS.MAX_BOUNCES } = llama
  
  vy += PHYSICS.GRAVITY * deltaTime
  
  // Update position
  x += vx * deltaTime
  y += vy * deltaTime
  
  // Update rotation based on horizontal velocity
  rotation += vx * PHYSICS.ROTATION_SPEED * deltaTime
  
  // Check ground collision
  if (y >= groundLevel) {
    y = groundLevel // Clamp to ground
    
    // Check if should stop
    if (Math.abs(vy) < PHYSICS.STOP_THRESHOLD || bounceCount <= 0) {
      return {
        ...llama,
        x,
        y: groundLevel,
        vx: 0,
        vy: 0,
        rotation,
        state: 'resting'
      }
    }
    
    // Bounce!
    vy = -Math.abs(vy) * PHYSICS.BOUNCE_DAMPENING
    vx *= PHYSICS.FRICTION
    bounceCount -= 1
  }
  
  // Check if stopped in air (shouldn't happen, but just in case)
  if (Math.abs(vx) < PHYSICS.STOP_THRESHOLD && Math.abs(vy) < PHYSICS.STOP_THRESHOLD) {
    return {
      ...llama,
      x,
      y,
      vx: 0,
      vy: 0,
      rotation,
      state: 'resting'
    }
  }
  
  return {
    ...llama,
    x,
    y,
    vx,
    vy,
    rotation,
    bounceCount,
    state: 'flying'
  }
}

