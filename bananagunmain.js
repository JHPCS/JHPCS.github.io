// Initialize game
document.addEventListener("DOMContentLoaded", function() {
    initTargets();
    updateHUD();
    animate();
});

// Main game loop
function animate() {
    requestAnimationFrame(animate);
    
    // Delta time for smoother animation regardless of frame rate
    const now = Date.now();
    const deltaTime = Math.min(30, now - (lastTime || now)); // Cap delta time to prevent large jumps
    lastTime = now;
    
    // Apply gravity and handle jumping
    if (!isOnGround()) {
        // Apply gravity when in the air
        gameState.velocity.y -= gameState.gravity * deltaTime / 1000; // Scale gravity by seconds
        
        // Apply the vertical velocity to the camera position
        cameraHolder.position.y += gameState.velocity.y * deltaTime / 1000; // Scale velocity by seconds
        
        // Check if we've landed
        if (cameraHolder.position.y <= gameState.playerHeight) {
            // Land on the ground
            cameraHolder.position.y = gameState.playerHeight;
            gameState.velocity.y = 0;
            gameState.isJumping = false;
        }
    } else {
        // Make sure we're exactly at player height when on ground
        cameraHolder.position.y = gameState.playerHeight;
        
        // Only reset jumpCooldown when on ground
        if (gameState.jumpCooldown) {
            gameState.jumpCooldown = false;
        }
    }
    
    // Handle jumping - only when on ground and space is pressed
    if (keyboardState['space'] && isOnGround() && !gameState.jumpCooldown && !gameState.isJumping) {
        // Apply jump velocity
        gameState.velocity.y = gameState.jumpPower;
        gameState.isJumping = true;
        gameState.jumpCooldown = true;
        
        // Reset jump cooldown after a short delay
        setTimeout(() => {
            gameState.jumpCooldown = false;
        }, 250);
    }
    
    // Handle reloading
    if (keyboardState['r'] && !gameState.isReloading && gameState.ammo < gameState.maxAmmo) {
        reload();
    }
    
    // Movement controls
    const movementSpeed = 0.005 * deltaTime;
    
    // Get direction vectors
    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyQuaternion(cameraHolder.quaternion);
    forwardVector.y = 0;
    forwardVector.normalize();
    
    const rightVector = new THREE.Vector3(1, 0, 0);
    rightVector.applyQuaternion(cameraHolder.quaternion);
    rightVector.y = 0;
    rightVector.normalize();
    
    // Calculate movement direction
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    if (keyboardState['w']) moveDirection.add(forwardVector);
    if (keyboardState['s']) moveDirection.sub(forwardVector);
    if (keyboardState['a']) moveDirection.sub(rightVector);
    if (keyboardState['d']) moveDirection.add(rightVector);
    
    // Apply movement if there's input
    if (moveDirection.length() > 0) {
        moveDirection.normalize();
        
        // Check for platform boundaries before moving
        const newPosition = cameraHolder.position.clone()
            .add(moveDirection.multiplyScalar(movementSpeed));
        
        // Keep player on the platform
        if (Math.abs(newPosition.x) < 14 && Math.abs(newPosition.z) < 14) {
            cameraHolder.position.x = newPosition.x;
            cameraHolder.position.z = newPosition.z;
        } else {
            // Allow movement along the edge
            if (Math.abs(newPosition.x) < 14) {
                cameraHolder.position.x = newPosition.x;
            }
            if (Math.abs(newPosition.z) < 14) {
                cameraHolder.position.z = newPosition.z;
            }
        }
    }
    
    // Update targets
    updateTargets(deltaTime);
    
    // Update particles
    updateParticles();
    
    // Gun recoil recovery
    if (recoil > 0) {
        recoil -= recoilRecoverySpeed;
        if (recoil < 0) recoil = 0;
        
        // Apply recoil to gun image
        const gunImage = document.getElementById('gun-image');
        gunImage.style.transform = `translateY(${-recoil * 100}px)`;
    }
    
    renderer.render(scene, camera);
}
