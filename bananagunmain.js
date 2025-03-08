// Initialize game
document.addEventListener("DOMContentLoaded", function() {
    setupMenuListeners();
    setupRenderer();
    createMenuScene();
    animate();
});

// Setup menu event listeners
function setupMenuListeners() {
    // Start game button
    document.getElementById('start-button').addEventListener('click', function() {
        // Get menu selections
        gameState.targetCount = parseInt(document.getElementById('target-count').value);
        gameState.difficulty = document.getElementById('difficulty').value;
        
        // Start the game
        startGame();
    });
    
    // Pause menu listeners
    document.getElementById('resume-button').addEventListener('click', function() {
        resumeGame();
    });
    
    document.getElementById('restart-button').addEventListener('click', function() {
        restartGame();
    });
    
    document.getElementById('main-menu-button').addEventListener('click', function() {
        returnToMainMenu();
    });
    
    // Add ESC key listener for pause
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Escape' && gameState.gameStarted && !gameState.isInMenu) {
            togglePause();
        }
    });
}

// Create a simpler scene for the menu
function createMenuScene() {
    // Position camera for menu view
    cameraHolder.position.set(0, 3, 10);
    pitchObject.rotation.x = -0.1;
    
    // Create a rotating target for visual interest
    const menuTarget = createTarget();
    menuTarget.position.set(0, 2, 0);
    menuTarget.userData.isMenuTarget = true;
    
    // Use animation loop to rotate the target
    menuTarget.userData.update = function(dt) {
        menuTarget.rotation.y += 0.01 * dt;
    };
}

// Start the game from menu
function startGame() {
    // Hide menu, show game UI
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    // Reset camera position
    cameraHolder.position.set(0, gameState.playerHeight, 5);
    pitchObject.rotation.x = 0;
    
    // Remove menu objects
    for (let i = targets.length - 1; i >= 0; i--) {
        if (targets[i].userData.isMenuTarget) {
            scene.remove(targets[i]);
            targets.splice(i, 1);
        }
    }
    
    // Initialize game elements
    initTargets();
    updateHUD();
    
    // Update game state
    gameState.isInMenu = false;
    gameState.gameStarted = true;
    gameState.isPaused = false;
    gameState.score = 0;
    gameState.ammo = gameState.maxAmmo;
    
    // Enable controls
    enableControls();
    
    // Lock pointer for FPS controls
    renderer.domElement.requestPointerLock();
}

// Toggle pause state
function togglePause() {
    if (gameState.isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// Pause the game
function pauseGame() {
    gameState.isPaused = true;
    document.getElementById('pause-menu').style.display = 'flex';
    document.exitPointerLock();
}

// Resume from pause
function resumeGame() {
    gameState.isPaused = false;
    document.getElementById('pause-menu').style.display = 'none';
    renderer.domElement.requestPointerLock();
}

// Restart the game
function restartGame() {
    gameState.score = 0;
    gameState.ammo = gameState.maxAmmo;
    
    // Reset player position
    cameraHolder.position.set(0, gameState.playerHeight, 5);
    gameState.velocity.set(0, 0, 0);
    
    // Reinitialize targets
    initTargets();
    updateHUD();
    
    // Resume game
    resumeGame();
}

// Return to main menu
function returnToMainMenu() {
    // Show menu, hide game UI and pause menu
    document.getElementById('title-screen').style.display = 'flex';
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('pause-menu').style.display = 'none';
    
    // Update game state
    gameState.isInMenu = true;
    gameState.gameStarted = false;
    gameState.isPaused = false;
    
    // Set up menu scene
    createMenuScene();
}

// Enable/disable controls based on game state
function enableControls() {
    // Will be handled by the controls file
}

// Main game loop
function animate() {
    requestAnimationFrame(animate);
    
    // Delta time for smoother animation regardless of frame rate
    const now = Date.now();
    const deltaTime = Math.min(30, now - (lastTime || now)); // Cap delta time to prevent large jumps
    lastTime = now;
    
    // If in menu, just do minimal updates
    if (gameState.isInMenu) {
        // Update any menu visuals
        for (const target of targets) {
            if (target.userData.isMenuTarget && target.userData.update) {
                target.userData.update(deltaTime);
            }
        }
        renderer.render(scene, camera);
        return;
    }
    
    // If paused, just render the current frame
    if (gameState.isPaused) {
        renderer.render(scene, camera);
        return;
    }
    
    // Apply gravity and handle jumping
    if (!isOnGround()) {
        // Apply gravity when in the air
        gameState.velocity.y -= gameState.gravity * deltaTime;
        
        // Apply the vertical velocity to the camera position
        cameraHolder.position.y += gameState.velocity.y * deltaTime;
        
        // Check if we've landed
        if (cameraHolder.position.y <= gameState.playerHeight) {
            // Land on the ground
            cameraHolder.position.y = gameState.playerHeight;
            gameState.velocity.y = 0;
            gameState.isJumping = false;
            
            // Reset jump cooldown after a short delay
            setTimeout(() => {
                gameState.jumpCooldown = false;
            }, 250);
        }
    } else {
        // Make sure we're exactly at player height when on ground
        cameraHolder.position.y = gameState.playerHeight;
        gameState.isJumping = false;
    }
    
    // Handle jumping - only when on ground and space is pressed
    if (keyboardState['space'] && isOnGround() && !gameState.jumpCooldown) {
        // Apply jump velocity
        gameState.velocity.y = gameState.jumpPower;
        gameState.isJumping = true;
        gameState.jumpCooldown = true;
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

// Check if player is on the ground
function isOnGround() {
    return cameraHolder.position.y <= gameState.playerHeight;
}
