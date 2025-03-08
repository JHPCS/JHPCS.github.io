// Create targets array
const targets = [];
const maxTargets = 5;

// Function to create a target
function createTarget() {
    const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
    const targetMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        roughness: 0.5,
        metalness: 0.5
    });
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    
    // Random position on the platform
    const platformSize = 12; // Smaller than actual platform to keep targets on it
    target.position.set(
        (Math.random() - 0.5) * platformSize,
        0.5, // Position at half height above the platform
        (Math.random() - 0.5) * platformSize
    );
    
    target.castShadow = true;
    target.receiveShadow = true;
    
    // Add health property
    target.userData = {
        health: 100,
        id: Math.random().toString(36).substr(2, 9),
        lastHitTime: 0,
        isMoving: false // Flag to control if target should move
    };
    
    // Don't add to scene immediately in starting room
    if (!gameState.inStartingRoom) {
        scene.add(target);
    }
    
    targets.push(target);
    
    // Setup movement properties
    const speed = 0.01 + Math.random() * 0.02;
    const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
    ).normalize();
    
    target.userData.speed = speed;
    target.userData.direction = direction;
    
    return target;
}

// Initialize targets
function initTargets() {
    // Clear any existing targets
    for (const target of targets) {
        scene.remove(target);
    }
    targets.length = 0;
    
    // Create new targets only if not in starting room
    if (!gameState.inStartingRoom) {
        for (let i = 0; i < maxTargets; i++) {
            const target = createTarget();
            target.userData.isMoving = true; // Enable movement for targets in target rooms
            scene.add(target); // Add to scene only when not in starting room
        }
    }
}

// Update all targets
function updateTargets(deltaTime) {
    if (!deltaTime) return; // Prevent NaN values
    
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        
        // Only move targets if they're supposed to move and not in starting room
        if (target.userData.isMoving && !gameState.inStartingRoom) {
            // Move the target
            const moveAmount = target.userData.speed * deltaTime;
            target.position.x += target.userData.direction.x * moveAmount;
            target.position.z += target.userData.direction.z * moveAmount;
            
            // Bounce off edges
            if (Math.abs(target.position.x) > 14) {
                target.userData.direction.x *= -1;
                target.position.x = Math.sign(target.position.x) * 14;
            }
            if (Math.abs(target.position.z) > 14) {
                target.userData.direction.z *= -1;
                target.position.z = Math.sign(target.position.z) * 14;
            }
            
            // Rotate target
            target.rotation.y += 0.01 * deltaTime;
        }
        
        // Color based on health
        const healthPercent = target.userData.health / 100;
        target.material.color.setRGB(1, healthPercent, healthPercent);
        
        // Scale based on health
        const scale = 0.5 + (healthPercent * 0.5);
        target.scale.set(scale, scale, scale);
        
        // Check if target was recently hit
        const timeSinceHit = Date.now() - target.userData.lastHitTime;
        if (timeSinceHit < 300) {
            const intensity = 1 - (timeSinceHit / 300);
            target.material.emissive.setRGB(intensity, 0, 0);
        } else {
            target.material.emissive.setRGB(0, 0, 0);
        }
    }
    
    // Respawn targets if needed and not in starting room
    if (targets.length < maxTargets && !gameState.inStartingRoom) {
        const newTarget = createTarget();
        newTarget.userData.isMoving = true; // Enable movement for new targets
        scene.add(newTarget); // Add to scene
    }
}
