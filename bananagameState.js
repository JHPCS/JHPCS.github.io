// Game state management
const gameState = {
    score: 0,
    ammo: 30,
    maxAmmo: 30,
    isReloading: false,
    canShoot: true,
    isJumping: false,
    gravity: 0.00098,     // Adjusted gravity
    jumpPower: 0.035,     // Adjusted jump power
    playerHeight: 1.7,    // Standard player height
    maxJumpHeight: 3.0,   // Maximum jump height
    velocity: new THREE.Vector3(0, 0, 0),
    targetRespawnTime: 3000, // milliseconds
    gameStarted: false,
    jumpCooldown: false,   // Added jump cooldown
    
    // Added room-specific properties (these will be extended in scene.js)
    inStartingRoom: true,
    startingRoom: null,
    portals: [],
    currentScene: 'startingRoom',
    returnPortal: null,
    returnPortalText: null
};

// Recoil animation variables
let recoil = 0;
const maxRecoil = 0.15;         // Increased from 0.05 to 0.15
const recoilRecoverySpeed = 0.008; // Slightly reduced to make recoil last longer

// Timing variables
let lastTime = 0;
