// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff964f); // Orange background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;

// Create floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff964f,
    roughness: 0.8,
    metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Helper function to create a cartoonish tree
function createTree(x, z, height = 1, color = 0xC1FF72) {
    const treeGroup = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, height, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = height / 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Tree top (leaves)
    const topGeometry = new THREE.ConeGeometry(1, 2, 8);
    const topMaterial = new THREE.MeshStandardMaterial({ color: color });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = height + 1;
    top.castShadow = true;
    treeGroup.add(top);
    
    treeGroup.position.set(x, 0, z);
    return treeGroup;
}

// Helper function to create a cartoonish rock
function createRock(x, z, scale = 1) {
    const rockGeometry = new THREE.DodecahedronGeometry(scale, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.2
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(x, scale/2, z);
    rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    rock.castShadow = true;
    rock.receiveShadow = true;
    return rock;
}

// Helper function to create road segment
function createRoadSegment(x, z, width = 2, length = 5) {
    const roadGeometry = new THREE.PlaneGeometry(width, length);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.01, z); // Slightly above floor to prevent z-fighting
    return road;
}

// Create environment elements
// Add trees
for (let i = 0; i < 15; i++) {
    const x = Math.random() * 80 - 40;
    const z = Math.random() * 80 - 40;
    // Don't place trees on the road
    if (Math.abs(x) > 3 || Math.abs(z) > 3) {
        const height = 1 + Math.random() * 2;
        const tree = createTree(x, z, height);
        scene.add(tree);
    }
}

// Add rocks
for (let i = 0; i < 20; i++) {
    const x = Math.random() * 60 - 30;
    const z = Math.random() * 60 - 30;
    // Don't place rocks on the road
    if (Math.abs(x) > 3 || Math.abs(z) > 3) {
        const scale = 0.3 + Math.random() * 0.7;
        const rock = createRock(x, z, scale);
        scene.add(rock);
    }
}

// Create a simple road pattern
for (let i = -25; i <= 25; i += 5) {
    // Create horizontal road segments
    scene.add(createRoadSegment(0, i));
    
    // Create some vertical segments for intersections
    if (i % 15 === 0) {
        for (let j = -10; j <= 10; j += 5) {
            scene.add(createRoadSegment(j, i, 5, 2));
        }
    }
}

// Create an improved cartoonish car with antena and back lights
function createImprovedCar() {
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    bodyGeometry.translate(0, 0, 0.2); // Shift forward slightly
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xE74C3C, // Bright red
        metalness: 0.3,
        roughness: 0.5
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    body.castShadow = true;
    carGroup.add(body);
    
    // Car cabin
    const cabinGeometry = new THREE.BoxGeometry(1.8, 0.7, 2);
    cabinGeometry.translate(0, 0, -0.5); // Shift backward a bit
    const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2980B9, // Blue windows
        metalness: 0.8,
        roughness: 0.2
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.65, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.7
    });
    
    // Wheel positions
    const wheelPositions = [
        {x: -1.1, y: 0.4, z: -1.2}, // Front-left
        {x: 1.1, y: 0.4, z: -1.2},  // Front-right
        {x: -1.1, y: 0.4, z: 1.2},  // Back-left
        {x: 1.1, y: 0.4, z: 1.2}    // Back-right
    ];
    
    const wheels = [];
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.castShadow = true;
        carGroup.add(wheel);
        wheels.push(wheel);
    });
    
    // Add headlights
    const headlightGeometry = new THREE.CircleGeometry(0.2, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFF00,
        emissive: 0xFFFF99,
        emissiveIntensity: 2,
    });
    
    const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightL.position.set(-0.7, 1, -2);
    headlightL.rotation.y = Math.PI;
    carGroup.add(headlightL);
    
    const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightR.position.set(0.7, 1, -2);
    headlightR.rotation.y = Math.PI;
    carGroup.add(headlightR);
    
    // Add back lights (brake lights)
    const backLightGeometry = new THREE.CircleGeometry(0.15, 16);
    const backLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF0000,
        emissive: 0xFF3333,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const backLightL = new THREE.Mesh(backLightGeometry, backLightMaterial);
    backLightL.position.set(-0.7, 1, 2);
    carGroup.add(backLightL);
    
    const backLightR = new THREE.Mesh(backLightGeometry, backLightMaterial);
    backLightR.position.set(0.7, 1, 2);
    carGroup.add(backLightR);
    
    // Add antena (like in the example code)
    const antenaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const antenaMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const antena = new THREE.Mesh(antenaGeometry, antenaMaterial);
    antena.position.set(0, 2.2, 0.5);
    carGroup.add(antena);
    
    // Add antena top ball
    const antenaTopGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const antenaTopMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        emissive: 0xFF3333,
        emissiveIntensity: 0.5
    });
    const antenaTop = new THREE.Mesh(antenaTopGeometry, antenaTopMaterial);
    antenaTop.position.set(0, 2.7, 0.5);
    carGroup.add(antenaTop);
    
    // Add front bumper
    const bumperGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.3);
    const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.position.set(0, 0.6, -2);
    carGroup.add(bumper);
    
    // Store references for animation
    carGroup.wheels = wheels;
    carGroup.body = body;
    carGroup.cabin = cabin;
    carGroup.antena = antena;
    carGroup.antenaTop = antenaTop;
    carGroup.backLights = [backLightL, backLightR];
    carGroup.headlights = [headlightL, headlightR];
    
    return carGroup;
}

// Create our car
const car = createImprovedCar();
car.position.set(0, 0, 0);
scene.add(car);

// Add car extras animation state
const carState = {
    antenaSwingX: 0,
    antenaSwingY: 0,
    antenaSpeed: { x: 0, y: 0 },
    braking: false,
    lastTime: Date.now()
};

// Control variables for car movement
let speed = 0;
let targetSpeed = 0;
let rotationSpeed = 0;
const acceleration = 0.01; // Slower acceleration for more control
const decelerationFactor = 0.98;
const maxSpeed = 0.15;
const maxReverseSpeed = -0.08; // Slower in reverse
const maxRotationSpeed = 0.03;

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
};

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
        case 'Space':
            keys.brake = true;
            carState.braking = true;
            break;
        case 'KeyH': // Horn (same as in the reference)
            playHornSound();
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
        case 'Space':
            keys.brake = false;
            carState.braking = false;
            break;
    }
});

// Function to check if the device is mobile
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

// Horn sound (placeholder - in a real app you'd use an AudioContext)
function playHornSound() {
    console.log("Honk Honk!");
    // In a full implementation, you'd play an actual sound here
    // Make the car jump slightly when horn is pressed (like in the example)
    car.position.y += 0.3;
    
    // Add a slight bounce effect
    setTimeout(() => {
        car.position.y = 0.4;
    }, 100);
}
// Initialize car user data
car.userData = {
    acceleration: { x: 0, y: 0 }
};

// Initialize controls
document.addEventListener('DOMContentLoaded', function () {
    const controls = document.getElementById('controls-container');
    if (controls) {
        if (!isMobile()) {
            controls.style.display = 'none';
        }
    }
    
    // Setup mobile controls
    setupMobileControls();
});

// Mobile touch controls setup
function setupMobileControls() {
    // Get control elements
    const forwardButton = document.getElementById('forward');
    const backwardButton = document.getElementById('backward');
    const wheel = document.getElementById('wheel');
    
    if (!forwardButton || !backwardButton || !wheel) return;

    // Button event listeners
    forwardButton.addEventListener('touchstart', () => {
        keys.forward = true;
    });
    forwardButton.addEventListener('touchend', () => {
        keys.forward = false;
    });

    backwardButton.addEventListener('touchstart', () => {
        keys.backward = true;
    });
    backwardButton.addEventListener('touchend', () => {
        keys.backward = false;
    });

    // Double tap the forward button for horn
    let lastTap = 0;
    forwardButton.addEventListener('touchend', () => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            playHornSound();
        }
        lastTap = currentTime;
    });

    // Wheel variables
    let isDragging = false;
    let wheelStartX = 0;
    
    // Wheel event listeners
    wheel.addEventListener('touchstart', (event) => {
        isDragging = true;
        wheelStartX = event.touches[0].clientX;
        event.preventDefault();
    });

    wheel.addEventListener('touchmove', (event) => {
        if (!isDragging) return;
        const touch = event.touches[0];
        const deltaX = touch.clientX - wheelStartX;
        
        // Update steering based on touch delta
        if (deltaX > 20) {
            keys.right = true;
            keys.left = false;
        } else if (deltaX < -20) {
            keys.left = true;
            keys.right = false;
        } else {
            // Small movements center the wheel
            keys.right = false;
            keys.left = false;
        }
        
        event.preventDefault();
    });

    wheel.addEventListener('touchend', () => {
        isDragging = false;
        keys.left = false;
        keys.right = false;
    });
}

// Function to update antena physics (based on car's reference code)
function updateAntenaPhysics() {
    const now = Date.now();
    const deltaTime = (now - carState.lastTime) / 1000;
    carState.lastTime = now;
    
    // Physics constants
    const speedStrength = 10;
    const damping = 0.035;
    const pullBackStrength = 0.02;
    
    // Calculate forces based on car acceleration
    const accelerationX = THREE.MathUtils.clamp(car.userData.acceleration.x, -1, 1);
    const accelerationY = THREE.MathUtils.clamp(car.userData.acceleration.y, -1, 1);
    
    // Apply forces to antena
    carState.antenaSpeed.x -= accelerationX * speedStrength * deltaTime;
    carState.antenaSpeed.y -= accelerationY * speedStrength * deltaTime;
    
    // Pull back force (restore to center)
    const pullBackX = -carState.antenaSwingX * carState.antenaSwingX * Math.sign(carState.antenaSwingX) * pullBackStrength;
    const pullBackY = -carState.antenaSwingY * carState.antenaSwingY * Math.sign(carState.antenaSwingY) * pullBackStrength;
    
    carState.antenaSpeed.x += pullBackX;
    carState.antenaSpeed.y += pullBackY;
    
    // Apply damping
    carState.antenaSpeed.x *= (1 - damping);
    carState.antenaSpeed.y *= (1 - damping);
    
    // Update position
    carState.antenaSwingX += carState.antenaSpeed.x;
    carState.antenaSwingY += carState.antenaSpeed.y;
    
    // Apply to antena
    if (car.antena) {
        car.antena.rotation.x = carState.antenaSwingY * 0.2;
        car.antena.rotation.y = carState.antenaSwingX * 0.2;
        car.antenaTop.rotation.x = carState.antenaSwingY * 0.3;
        car.antenaTop.rotation.y = carState.antenaSwingX * 0.3;
    }
}

// Function to update car movement and animation
function updateCarMovement() {
    // Store old position for acceleration calculation
    const oldPosition = car.position.clone();
    
    // Update target speed
    if (keys.forward) {
        targetSpeed = maxSpeed;
    } else if (keys.backward) {
        targetSpeed = maxReverseSpeed;
    } else {
        targetSpeed = 0;
    }
    
    // Apply brakes
    if (keys.brake) {
        if (speed > 0.01 || speed < -0.01) {
            speed *= 0.9; // Stronger deceleration
        } else {
            speed = 0;
        }
        
        // Increase brake light intensity
        if (car.backLights) {
            car.backLights.forEach(light => {
                light.material.emissiveIntensity = 2.0;
                light.material.opacity = 1.0;
            });
        }
    } else {
        // Reset brake lights to normal
        if (car.backLights) {
            car.backLights.forEach(light => {
                light.material.emissiveIntensity = 0.5;
                light.material.opacity = 0.8;
            });
        }
        
        // Smoothly adjust current speed towards target
        if (targetSpeed > speed) {
            speed += acceleration;
            if (speed > targetSpeed) speed = targetSpeed;
        } else if (targetSpeed < speed) {
            speed -= acceleration;
            if (speed < targetSpeed) speed = targetSpeed;
        } else {
            // Natural deceleration when no input
            speed *= decelerationFactor;
            if (Math.abs(speed) < 0.001) speed = 0;
        }
    }

    // Update rotation
    if (Math.abs(speed) > 0.01) {
        const steeringFactor = Math.abs(speed) / maxSpeed; // Tie steering to speed
        if (keys.left) {
            rotationSpeed = maxRotationSpeed * steeringFactor;
        } else if (keys.right) {
            rotationSpeed = -maxRotationSpeed * steeringFactor;
        } else {
            // Gradually return to straight
            rotationSpeed *= 0.9;
            if (Math.abs(rotationSpeed) < 0.001) rotationSpeed = 0;
        }

        car.rotation.y += rotationSpeed;
    }

    // Move the car forward/backward
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(car.quaternion);
    car.position.addScaledVector(direction, speed);

    // Calculate acceleration for physics effects
    const newPosition = car.position.clone();
    const positionDelta = newPosition.clone().sub(oldPosition);
    const acceleration = positionDelta.clone(); // Simple approximation

    // Store acceleration for antena physics
    car.userData.acceleration = {
        x: acceleration.x * 100,
        y: acceleration.z * 100 // z in world is y in car-local coords
    };
    
    // Add cartoonish effects
    
    // 1. Bounce effect based on speed
    car.position.y = 0.4 + Math.sin(Date.now() * 0.01 * (Math.abs(speed) * 10 + 0.1)) * 0.05;
    
    // 2. Body tilt for acceleration and turning
    if (car.body) {
        // Tilt forward/backward based on acceleration
        const accelTilt = THREE.MathUtils.lerp(
            car.body.rotation.x, 
            -speed * 0.5, // Tilt up when accelerating forward
            0.1
        );
        car.body.rotation.x = accelTilt;
        
        // Tilt sideways when turning
        const turnTilt = THREE.MathUtils.lerp(
            car.body.rotation.z, 
            rotationSpeed * 10, // More tilt for sharper turns
            0.1
        );
        car.body.rotation.z = turnTilt;
    }
    
    // 3. Cabin follows body with slight delay for suspension feel
    if (car.cabin) {
        car.cabin.rotation.x = car.body.rotation.x * 0.7;
        car.cabin.rotation.z = car.body.rotation.z * 0.7;
    }
    
    // 4. Rotate wheels
    if (car.wheels) {
        car.wheels.forEach(wheel => {
            wheel.rotation.x += speed * 0.5;
        });
    }
    
    // 5. Squash and stretch based on acceleration
    if (car.body && speed !== 0) {
        const targetScaleZ = 1 + (targetSpeed - speed) * 2;
        car.body.scale.z = THREE.MathUtils.lerp(car.body.scale.z, targetScaleZ, 0.05);
    }
    
    // 6. Update antena physics
    updateAntenaPhysics();
}

// Function to update camera position to follow car
function updateCamera() {
    // Create a smoother follow camera
    const cameraTargetPosition = new THREE.Vector3();
    car.getWorldPosition(cameraTargetPosition);
    
    // Position camera behind and above car
    const cameraOffset = new THREE.Vector3();
    // Add some speed-dependent camera position (pull back more at high speeds)
    const speedFactor = Math.abs(speed) / maxSpeed;
    cameraOffset.set(0, 5 + speedFactor * 2, 10 + speedFactor * 5);
    cameraOffset.applyQuaternion(car.quaternion);
    
    camera.position.lerp(cameraTargetPosition.add(cameraOffset), 0.05);
    
    // Look slightly ahead of car
    const lookAtPos = new THREE.Vector3();
    car.getWorldPosition(lookAtPos);
    const lookAheadOffset = new THREE.Vector3(0, 0, -5 - speedFactor * 5).applyQuaternion(car.quaternion);
    lookAtPos.add(lookAheadOffset);
    
    camera.lookAt(lookAtPos);
}

// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    updateCarMovement();
    updateCamera();
    
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});



// Start the animation loop
animate();
