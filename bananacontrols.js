// Keyboard state
const keyboardState = {
    'w': false,
    's': false,
    'a': false,
    'd': false,
    'space': false,
    'r': false
};

// Mouse controls
const mouseSensitivity = 0.002;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

// Pointer lock on click
renderer.domElement.addEventListener('click', function() {
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        document.getElementById('instructions').style.display = 'none';
    }
    renderer.domElement.requestPointerLock();
});

// Prevent context menu
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Handle key down
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key in keyboardState) {
        keyboardState[key] = true;
    }
    if (key === ' ') {
        keyboardState['space'] = true;
    }
}

// Handle key up
function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key in keyboardState) {
        keyboardState[key] = false;
    }
    if (key === ' ') {
        keyboardState['space'] = false;
    }
}

// Handle mouse down
function handleMouseDown(event) {
    if (event.button === 0) { // Left mouse button
        shoot();
    } else if (event.button === 2) { // Right mouse button
        isMouseDown = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

// Handle mouse move
function handleMouseMove(event) {
    if (document.pointerLockElement === renderer.domElement) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;
        
        // Horizontal rotation (yaw)
        cameraHolder.rotation.y -= movementX * mouseSensitivity;
        
        // Vertical rotation (pitch)
        pitchObject.rotation.x -= movementY * mouseSensitivity;
        
        // Limit vertical rotation to prevent flipping
        pitchObject.rotation.x = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, pitchObject.rotation.x));
    } 
    else if (isMouseDown) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        
        cameraHolder.rotation.y -= deltaX * mouseSensitivity * 5;
        pitchObject.rotation.x -= deltaY * mouseSensitivity * 5;
        
        pitchObject.rotation.x = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, pitchObject.rotation.x));
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

// Handle mouse up
function handleMouseUp(event) {
    if (event.button === 2) {
        isMouseDown = false;
    }
}

// Helper function to check if player is on the ground
function isOnGround() {
    return cameraHolder.position.y <= gameState.playerHeight + 0.01;
}

// Shooting function
function shoot() {
    if (!gameState.canShoot || gameState.isReloading || gameState.ammo <= 0) return;
    
    gameState.ammo--;
    updateHUD();
    
    // Apply recoil
    recoil = maxRecoil;
    
    // Create muzzle flash
    createMuzzleFlash();
    
    // Create bullet
    const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    // Set bullet position and direction
    const bulletPosition = camera.getWorldPosition(new THREE.Vector3());
    bullet.position.copy(bulletPosition);
    
    // Get accurate bullet direction
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const bulletDirection = raycaster.ray.direction.clone();
    
    // Set bullet velocity and metadata
    const bulletSpeed = 0.5;
    bullet.userData = {
        velocity: bulletDirection.multiplyScalar(bulletSpeed),
        initialPosition: bulletPosition.clone(),
        lifetime: 100
    };
    
    // Add bullet to scene and tracking array
    scene.add(bullet);
    particles.push(bullet);
    
    // Auto reload if empty
    if (gameState.ammo <= 0) {
        reload();
    }
}

// Reload gun
function reload() {
    if (gameState.isReloading) return;
    
    gameState.isReloading = true;
    gameState.canShoot = false;
    
    // Reload animation would go here
    
    // After a delay, restore ammo
    setTimeout(() => {
        gameState.ammo = gameState.maxAmmo;
        gameState.isReloading = false;
        gameState.canShoot = true;
        updateHUD();
    }, 1500);
}
