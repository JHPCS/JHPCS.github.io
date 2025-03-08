// Particles array
const particles = [];

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.position.add(particle.userData.velocity);
        
        // Apply gravity to particles
        particle.userData.velocity.y -= 0.001;
        
        // Particle lifetime
        particle.userData.lifetime -= 1;
        if (particle.userData.lifetime <= 0) {
            scene.remove(particle);
            particles.splice(i, 1);
            continue;
        }
        
        // Check for collisions with targets
        checkBulletCollision(particle);
        
        // Check for collision with ground
        if (particle.position.y <= 0) {
            // Create impact mark
            createImpactMark(particle.position.clone());
            
            scene.remove(particle);
            particles.splice(i, 1);
        }
    }
}

// Create an impact mark on surface
function createImpactMark(position) {
    position.y = 0.01; // Slightly above ground
    
    const markGeometry = new THREE.CircleGeometry(0.1, 8);
    const markMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.8
    });
    
    const mark = new THREE.Mesh(markGeometry, markMaterial);
    mark.rotation.x = -Math.PI / 2; // Lay flat
    mark.position.copy(position);
    scene.add(mark);
    
    // Fade out and remove after a delay
    const fadeStep = 0.01;
    const fadeInterval = setInterval(() => {
        if (mark.material.opacity <= 0) {
            clearInterval(fadeInterval);
            scene.remove(mark);
        } else {
            mark.material.opacity -= fadeStep;
        }
    }, 100);
}

// Check bullet collision with targets
function checkBulletCollision(bullet) {
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        
        // Simple distance-based collision
        const distance = bullet.position.distanceTo(target.position);
        
        if (distance < 0.8 * Math.max(...target.scale.toArray())) {
            // Hit confirmed!
            showHitMarker();
            
            // Deal damage
            target.userData.health -= 25;
            target.userData.lastHitTime = Date.now();
            
            // Remove bullet
            scene.remove(bullet);
            bullets = particles.indexOf(bullet);
            if (bullets !== -1) {
                particles.splice(bullets, 1);
            }
            
            // If target health <= 0, remove it
            if (target.userData.health <= 0) {
                // Increment score
                gameState.score += 100;
                updateHUD();
                
                // Create explosion effect
                createExplosion(target.position.clone());
                
                // Remove target
                scene.remove(target);
                targets.splice(i, 1);
                
                // Schedule a new target to spawn
                setTimeout(createTarget, gameState.targetRespawnTime);
            }
            
            break; // Bullet hit something, stop checking
        }
    }
}

// Create explosion effect
function createExplosion(position) {
    // Create multiple particles for explosion
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const size = 0.1 + Math.random() * 0.2;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(1, 0.5 + Math.random() * 0.5, 0),
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        
        // Random velocity in all directions
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        
        particle.userData = {
            velocity: velocity,
            lifetime: 30 + Math.floor(Math.random() * 20)
        };
        
        scene.add(particle);
        particles.push(particle);
    }
}

// Create muzzle flash
function createMuzzleFlash() {
    // Audio would normally go here
    
    // We could add a visual flash effect here if desired
}
