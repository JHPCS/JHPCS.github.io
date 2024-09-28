// Existing Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a PNG texture
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/c5ccf300c00821c8d3063a60f97311cd9bfdcec7/carmaybe.png');

// Create an orange floor (#ff964f)
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xff964f });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Add a green vertical beam with emissive lighting
const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 32);
const beamMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 5
});
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(2, 10, 0);
scene.add(beam);

// Add a Point Light at the beam position to simulate the beam casting light
const beamLight = new THREE.PointLight(0x00ff00, 2, 50);
beamLight.position.set(2, 10, 0);
scene.add(beamLight);

// Load a car model
const loader = new THREE.GLTFLoader();
let car;

loader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/18fc1a12478b8e2cd686aae823ab127d18dbff54/FabConvert.com_uploads_files_2792345_koenigsegg.glb', function (gltf) {
    car = gltf.scene;

    car.traverse(function (node) {
        if (node.isMesh) {
            node.material = new THREE.MeshStandardMaterial({ 
                map: carTexture, 
                metalness: 0.5, // Reflective metalness for better lighting effects
                roughness: 0.3 // Slightly smooth surface to reflect light
            });
            node.material.needsUpdate = true;
        }
    });

    car.scale.set(0.5, 0.5, 0.5);
    car.position.y = 0.1;
    scene.add(car);
}, undefined, function (error) {
    console.error(error);
});

// Ambient light to softly illuminate the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Adjust the intensity
scene.add(ambientLight);

// Directional light to provide general lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 0).normalize();
scene.add(directionalLight);

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

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        updateMovement();

        const direction = new THREE.Vector3();
        car.getWorldDirection(direction);
        car.position.addScaledVector(direction, speed);

        car.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.02;

        const cameraOffset = new THREE.Vector3(0, 15, 30);
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
