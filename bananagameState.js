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
    
    // Menu and game state flags
    isInMenu: true,        // Start in menu
    isPaused: false,       // Pause state
    
    // Game settings from menu
    targetCount: 5,        // Default target count
    difficulty: 'normal',  // Default difficulty
    
    // Difficulty settings (speed multipliers)
    difficultySpeeds: {
        'easy': 0.7,
        'normal': 1.0,
        'hard': 1.5
    }
};

// Recoil animation variables
let recoil = 0;
const maxRecoil = 0.05;
const recoilRecoverySpeed = 0.01;

// Timing variables
let lastTime = 0;
