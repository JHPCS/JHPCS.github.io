// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff964f,
    roughness: 0.8,
    metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Create car
const car = new PortCar(scene, camera, renderer);

// Animation loop
let lastTime = 0;
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (car) {
        car.update(deltaTime);
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate(0);

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Mobile detection
function isMobile() {
    if (navigator.userAgentData && navigator.userAgentData.mobile !== undefined) {
        return navigator.userAgentData.mobile;
    }
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

document.addEventListener('DOMContentLoaded', function() {
    if (isMobile()) {
        const controls = document.getElementById('controls');
        if (controls) {
            controls.classList.remove('mobile');
        }
    } else {
        const controls = document.getElementById('controls');
        if (controls) {
            controls.classList.add('mobile');
        }
    }
});



// Control variables for car movement
let speed = 0;
let targetSpeed = 0;
let rotationSpeed = 0;
const acceleration = 0.02;
const decelerationFactor = 0.98;
const maxSpeed = 1;
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

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Control variables for touch controls
let wheelRotation = 0;

// Get control elements
const forwardButton = document.getElementById('forward');
const backwardButton = document.getElementById('backward');
const wheel = document.getElementById('wheel');

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

// Wheel event listeners
let isDragging = false;

wheel.addEventListener('touchstart', (event) => {
    isDragging = true;
    const touch = event.touches[0];
    wheelRotation = touch.clientX; // Get initial touch position
});

wheel.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const touch = event.touches[0];
    const delta = touch.clientX - wheelRotation;

    // Update rotation based on delta
    if (delta > 5) { // Threshold to avoid small movements
        keys.right = true;
        keys.left = false;
    } else if (delta < -5) {
        keys.left = true;
        keys.right = false;
    } else {
        keys.right = false;
        keys.left = false;
    }
});

wheel.addEventListener('touchend', () => {
    isDragging = false;
    keys.left = false;
    keys.right = false;
});


// Function to update speed and rotation
function updateMovement() {
    if (keys.forward) {
        targetSpeed = maxSpeed;
    } else if (keys.backward) {
        targetSpeed = -maxSpeed;
    } else {
        targetSpeed = 0;
    }

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
}

// Function to update camera position and orientation
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        updateMovement();

        const direction = new THREE.Vector3();
        car.getWorldDirection(direction);
        car.position.addScaledVector(direction, speed);

        car.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.02; // Slight bounce effect

        // Update camera to a higher and steeper position
        const cameraOffset = new THREE.Vector3(0, 20, 35); // Increase the 'y' value for height, and 'z' for distance
        const carPosition = new THREE.Vector3();
        car.getWorldPosition(carPosition);
        camera.position.copy(carPosition).add(cameraOffset);
        camera.lookAt(carPosition);
    }

    renderer.render(scene, camera);
}

animate();


// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
