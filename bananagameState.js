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
    jumpCooldown: false   // Added jump cooldown
};

// Recoil animation variables
let recoil = 0;
const maxRecoil = 0.05;
const recoilRecoverySpeed = 0.01;

// Timing variables
let lastTime = 0;
