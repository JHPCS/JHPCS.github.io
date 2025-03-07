document.addEventListener("DOMContentLoaded", function() {
    // Game state
    const gameState = {
        score: 0,
        ammo: 30,
        maxAmmo: 30,
        isReloading: false,
        canShoot: true,
        isJumping: false,
        gravity: 0.00098,        // Adjusted gravity
        jumpPower: 0.035,        // Adjusted jump power
        playerHeight: 1.7,       // Standard player height
        maxJumpHeight: 3.0,      // Maximum jump height
        velocity: new THREE.Vector3(0, 0, 0),
        targetRespawnTime: 3000, // milliseconds
        gameStarted: false,
        jumpCooldown: false      // Added jump cooldown
    };

    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Window resize handler
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Create a larger platform
    const platformGeometry = new THREE.BoxGeometry(30, 1, 30);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.receiveShadow = true;
    scene.add(platform);
    
    // Add a ground texture
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x556B2F,
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

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
            1.5, // Just above the platform
            (Math.random() - 0.5) * platformSize
        );
        
        target.castShadow = true;
        target.receiveShadow = true;
        
        // Add health property
        target.userData = {
            health: 100,
            id: Math.random().toString(36).substr(2, 9),
            lastHitTime: 0
        };
        
        scene.add(target);
        targets.push(target);
        
        // Make targets move
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
        
        // Create new targets
        for (let i = 0; i < maxTargets; i++) {
            createTarget();
        }
    }

    // Camera holder setup for better control
    const cameraHolder = new THREE.Object3D();
    scene.add(cameraHolder);
    cameraHolder.position.set(0, gameState.playerHeight, 5); // Using the player height constant
    
    // Pitch object for vertical rotation
    const pitchObject = new THREE.Object3D();
    cameraHolder.add(pitchObject);
    pitchObject.add(camera);
    camera.position.set(0, 0, 0);

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
    
    // Gun recoil animation variables
    let recoil = 0;
    const maxRecoil = 0.05;
    const recoilRecoverySpeed = 0.01;
    
    // Particles array
    const particles = [];
    
    // Raycaster for shooting
    const raycaster = new THREE.Raycaster();
    
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

    // Initialize game
    initTargets();
    updateHUD();

    // Helper function to check if player is on the ground
    function isOnGround() {
        return Math.abs(cameraHolder.position.y - gameState.playerHeight) < 0.01;
    }

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
    
    let lastTime = 0;
    animate();
    
    // Update all targets
    function updateTargets(deltaTime) {
        for (let i = targets.length - 1; i >= 0; i--) {
            const target = targets[i];
            
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
        
        // Respawn targets if needed
        if (targets.length < maxTargets) {
            createTarget();
        }
    }
    
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
    
    // Show hit marker
    function showHitMarker() {
        const hitMarker = document.getElementById('hit-marker');
        hitMarker.style.opacity = '1';
        
        // Hide after a short delay
        setTimeout(() => {
            hitMarker.style.opacity = '0';
        }, 100);
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
    
    // Update the HUD
    function updateHUD() {
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('ammo').textContent = gameState.ammo;
        document.getElementById('max-ammo').textContent = gameState.maxAmmo;
    }

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
    
    // Create muzzle flash
    function createMuzzleFlash() {
        // Audio would normally go here
        
        // We could add a visual flash effect here if desired
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
});
