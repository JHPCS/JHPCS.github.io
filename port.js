// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a PNG texture
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/c5ccf300c00821c8d3063a60f97311cd9bfdcec7/carmaybe.png');

// Load a car model
const loader = new THREE.GLTFLoader();
let car;

loader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/18fc1a12478b8e2cd686aae823ab127d18dbff54/FabConvert.com_uploads_files_2792345_koenigsegg.glb', function (gltf) {
    car = gltf.scene;

car.traverse(function (node) {
    if (node.isMesh) {
        console.log(node); // Check if the texture is applied to each mesh
        node.material.map = carTexture; // Ensure the texture is applied
        node.material.needsUpdate = true; // Force material update
    }
});


    car.scale.set(0.5, 0.5, 0.5);
    car.position.y = 0.1;
    scene.add(car);
}, undefined, function (error) {
    console.error(error);
});

// Create an orange floor (#ff964f)
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xff964f });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Add a vertical beam
const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 32); // Tall cylinder
const beamMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 }); // Bright green beam
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(2, 10, 0); // Place it somewhere near the car
scene.add(beam);

// Adjust the lighting (lowered intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Lower intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Adjusted intensity to not wash out colors
directionalLight.position.set(0, 5, 0).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Control variables for car movement
let speed = 0;
let targetSpeed = 0;
let rotationSpeed = 0;
const acceleration = 0.02;
const decelerationFactor = 0.98; // Gradual deceleration when no keys are pressed
const maxSpeed = 1;
const maxRotationSpeed = 0.03; // Max turning speed when at full speed

// State of the controls
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

// Function to update speed and rotation
function updateMovement() {
    // Adjust speed based on keys pressed
    if (keys.forward) {
        targetSpeed = maxSpeed;
    } else if (keys.backward) {
        targetSpeed = -maxSpeed;
    } else {
        targetSpeed = 0;
    }

    // Smooth acceleration and deceleration
    if (targetSpeed > speed) {
        speed += acceleration;
        if (speed > targetSpeed) speed = targetSpeed;
    } else if (targetSpeed < speed) {
        speed -= acceleration;
        if (speed < targetSpeed) speed = targetSpeed;
    } else {
        // Gradual deceleration when no keys are pressed
        speed *= decelerationFactor;
        if (Math.abs(speed) < 0.001) speed = 0; // Stop if the speed is very low
    }

    // Adjust rotation speed based on current speed and key presses
    if (speed !== 0) {
        if (keys.left) {
            rotationSpeed = maxRotationSpeed * (speed / maxSpeed); // Sharper turns at higher speeds
        } else if (keys.right) {
            rotationSpeed = -maxRotationSpeed * (speed / maxSpeed); // Sharper turns at higher speeds
        } else {
            rotationSpeed = 0;
        }

        // Rotate the car based on rotation speed
        car.rotation.y += rotationSpeed;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        updateMovement(); // Update speed and rotation

        // Move the car forward based on its rotation
        const direction = new THREE.Vector3();
        car.getWorldDirection(direction); // Get car's forward direction
        car.position.addScaledVector(direction, speed); // Move in the forward direction

        // Add slight bounce effect
        car.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.02;

        // Update camera position to follow the car
        const cameraOffset = new THREE.Vector3(0, 15, 30); // Camera follows from above and behind
        const carPosition = new THREE.Vector3();
        car.getWorldPosition(carPosition); // Get the car's current position
        camera.position.copy(carPosition).add(cameraOffset); // Position the camera relative to the car
        camera.lookAt(carPosition); // Ensure the camera is always looking at the car
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
