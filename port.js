// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff964f); // Orange background to match reference

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

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

// Create 3D text for visual interest
function createText(text, x, y, z, rotationY = 0) {
    const loader = new THREE.FontLoader();
    
    // Use a simpler approach since FontLoader might not be available
    const textGeometry = new THREE.TextGeometry(text, {
        size: 2,
        height: 0.5,
    });
    
    // Or use a simple box geometry with a custom name as fallback
    const fallbackGeometry = new THREE.BoxGeometry(text.length * 1.2, 2, 0.5);
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(fallbackGeometry, textMaterial);
    
    textMesh.position.set(x, y, z);
    textMesh.rotation.y = rotationY;
    textMesh.castShadow = true;
    scene.add(textMesh);
    
    // Add a note about this being a placeholder for actual text
    console.log(`Added text placeholder for: ${text}`);
    
    return textMesh;
}

// Add some text elements
createText("PORTFOLIO", -15, 0.5, 15, Math.PI / 4);

// Create a cartoonish car
function createCartoonCar() {
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
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
    const cabinGeometry = new THREE.BoxGeometry(1.6, 0.7, 2);
    const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2980B9, // Blue windows
        metalness: 0.8,
        roughness: 0.2
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.65, -0.2);
    cabin.castShadow = true;
    carGroup.add(cabin);
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.7
    });
    
    // Front-left wheel
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.rotation.z = Math.PI / 2;
    wheelFL.position.set(-1.1, 0.4, -1.2);
    wheelFL.castShadow = true;
    carGroup.add(wheelFL);
    
    // Front-right wheel
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.rotation.z = Math.PI / 2;
    wheelFR.position.set(1.1, 0.4, -1.2);
    wheelFR.castShadow = true;
    carGroup.add(wheelFR);
    
    // Back-left wheel
    const wheelBL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBL.rotation.z = Math.PI / 2;
    wheelBL.position.set(-1.1, 0.4, 1.2);
    wheelBL.castShadow = true;
    carGroup.add(wheelBL);
    
    // Back-right wheel
    const wheelBR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBR.rotation.z = Math.PI / 2;
    wheelBR.position.set(1.1, 0.4, 1.2);
    wheelBR.castShadow = true;
    carGroup.add(wheelBR);
    
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
    
    // Add front bumper
    const bumperGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.3);
    const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.position.set(0, 0.6, -2);
    carGroup.add(bumper);
    
    // Store references to wheels for animation
    carGroup.wheels = [wheelFL, wheelFR, wheelBL, wheelBR];
    
    return carGroup;
}

// Create our car
const car = createCartoonCar();
car.position.set(0, 0, 0);
scene.add(car);

// Control variables for car movement
let speed = 0;
let targetSpeed = 0;
let rotationSpeed = 0;
const acceleration = 0.02;
const decelerationFactor = 0.98;
const maxSpeed = 0.2;
const maxRotationSpeed = 0.03;

const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
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
    }
});

// Function to check if the device is mobile
function isMobile() {
    if (navigator.userAgentData && navigator.userAgentData.mobile !== undefined) {
        return navigator.userAgentData.mobile;
    }
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

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

    // Wheel variables
    let isDragging = false;
    let wheelRotation = 0;
    let wheelCenter = { x: 0, y: 0 };

    // Calculate wheel center position
    function updateWheelCenter() {
        const rect = wheel.getBoundingClientRect();
        wheelCenter.x = rect.left + rect.width / 2;
        wheelCenter.y = rect.top + rect.height / 2;
    }

    // Update wheel center on window resize
    window.addEventListener('resize', updateWheelCenter);
    // Initial calculation
    updateWheelCenter();

    // Wheel event listeners
    wheel.addEventListener('touchstart', (event) => {
        isDragging = true;
        const touch = event.touches[0];
        wheelRotation = touch.clientX;
        event.preventDefault();
    });

    wheel.addEventListener('touchmove', (event) => {
        if (!isDragging) return;
        const touch = event.touches[0];
        const delta = touch.clientX - wheelRotation;

        // Update rotation based on delta
        if (delta > 5) {
            keys.right = true;
            keys.left = false;
        } else if (delta < -5) {
            keys.left = true;
            keys.right = false;
        } else {
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

// Function to update car movement and animation
function updateCarMovement() {
    // Update target speed
    if (keys.forward) {
        targetSpeed = maxSpeed;
    } else if (keys.backward) {
        targetSpeed = -maxSpeed;
    } else {
        targetSpeed = 0;
    }

    // Smoothly adjust current speed towards target
    if (targetSpeed > speed) {
        speed += acceleration;
        if (speed > targetSpeed) speed = targetSpeed;
    } else if (targetSpeed < speed) {
        speed -= acceleration;
        if (speed < targetSpeed) speed = targetSpeed;
    } else {
        speed *= decelerationFactor;
        if (Math.abs(speed) < 0.001) speed = 0;
    }

    // Update rotation
    if (speed !== 0) {
        if (keys.left) {
            rotationSpeed = maxRotationSpeed * (speed / maxSpeed);
        } else if (keys.right) {
            rotationSpeed = -maxRotationSpeed * (speed / maxSpeed);
        } else {
            rotationSpeed = 0;
        }

        car.rotation.y += rotationSpeed;
    }

    // Move the car forward/backward
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(car.quaternion);
    car.position.addScaledVector(direction, speed);

    // Add bounce effect for cartoonish feel
    car.position.y = 0.4 + Math.sin(Date.now() * 0.005) * 0.05;
    
    // Add tilt effect based on turning
    car.rotation.z = -rotationSpeed * 10;
    
    // Rotate wheels for animation
    if (car.wheels) {
        car.wheels.forEach(wheel => {
            wheel.rotation.x += speed * 0.5;
        });
    }
    
    // Add subtle car body squash and stretch based on acceleration
    if (car.children.length > 0) {
        const body = car.children[0]; // Assuming body is the first child
        const targetScaleZ = 1 + (speed - targetSpeed) * 2;
        body.scale.z = THREE.MathUtils.lerp(body.scale.z, targetScaleZ, 0.1);
    }
}

// Function to update camera position to follow car
function updateCamera() {
    // Create a smoother follow camera
    const cameraTargetPosition = new THREE.Vector3();
    car.getWorldPosition(cameraTargetPosition);
    
    // Position camera behind and above car
    const cameraOffset = new THREE.Vector3();
    cameraOffset.set(0, 10, 15); // Higher and further back for better view
    cameraOffset.applyQuaternion(car.quaternion);
    
    camera.position.lerp(cameraTargetPosition.add(cameraOffset), 0.05);
    
    // Look slightly ahead of car
    const lookAtPos = new THREE.Vector3();
    car.getWorldPosition(lookAtPos);
    const lookAheadOffset = new THREE.Vector3(0, 0, -10).applyQuaternion(car.quaternion);
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
