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
const deceleration = 0.05;
const maxSpeed = 1;
const maxRotationSpeed = 0.03; // Max turning speed when at full speed

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        // Accelerate forward (W and Arrow Up)
        case 'ArrowUp':
        case 'KeyW':
            targetSpeed = maxSpeed;
            break;
        
        // Reverse (S and Arrow Down)
        case 'ArrowDown':
        case 'KeyS':
            targetSpeed = -maxSpeed;
            break;

        // Turn left (A and Arrow Left) - Only effective when moving
        case 'ArrowLeft':
        case 'KeyA':
            if (speed !== 0) {  // Only turn when moving
                rotationSpeed = maxRotationSpeed * (speed > 0 ? 1 : -1);  // Reverse rotation when going backward
            }
            break;

        // Turn right (D and Arrow Right) - Only effective when moving
        case 'ArrowRight':
        case 'KeyD':
            if (speed !== 0) {  // Only turn when moving
                rotationSpeed = -maxRotationSpeed * (speed > 0 ? 1 : -1);  // Reverse rotation when going backward
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        // Stop accelerating or reversing when W/S or Up/Down are released
        case 'ArrowUp':
        case 'KeyW':
        case 'ArrowDown':
        case 'KeyS':
            targetSpeed = 0;
            break;

        // Stop turning when A/D or Left/Right are released
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
            rotationSpeed = 0;
            break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        // Update speed with acceleration or deceleration
        if (targetSpeed > speed) {
            speed += acceleration;
            if (speed > targetSpeed) speed = targetSpeed;
        } else if (targetSpeed < speed) {
            speed -= deceleration;
            if (speed < targetSpeed) speed = targetSpeed;
        }

        // Rotate the car when moving
        if (speed !== 0) {
            car.rotation.y += rotationSpeed;
        }

        // Calculate forward movement based on car's rotation
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
