// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a PNG texture
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/c5ccf300c00821c8d3063a60f97311cd9bfdcec7/carmaybe.png'); // Raw URL for the texture

// Load a car model
const loader = new THREE.GLTFLoader();
let car;

loader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/18fc1a12478b8e2cd686aae823ab127d18dbff54/FabConvert.com_uploads_files_2792345_koenigsegg.glb', function (gltf) {
    car = gltf.scene;

    // Apply texture to car's material
    car.traverse(function (node) {
        if (node.isMesh) {
            node.material.map = carTexture; // Apply the texture
            node.material.needsUpdate = true; // Update the material
            node.material.emissive = new THREE.Color(0xffffff); // Make it brighter
        }
    });

    car.scale.set(0.5, 0.5, 0.5);
    car.position.y = 0.1; // Set the car's height slightly above the floor
    scene.add(car);
}, undefined, function (error) {
    console.error(error);
});

// Create an orange floor
const floorGeometry = new THREE.PlaneGeometry(100, 100); // Large plane
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xff964f }); // Orange material
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
floor.position.y = 0; // Position it below the car
scene.add(floor);

// Add some ambient light with higher intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Increased intensity
scene.add(ambientLight);

// Add a directional light with higher intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Increased intensity
directionalLight.position.set(0, 5, 0).normalize(); // Positioning the light above
scene.add(directionalLight);

// Add an extra point light to highlight the car from another angle
const pointLight = new THREE.PointLight(0xffffff, 3, 50); // Bright white point light
pointLight.position.set(5, 5, 5); // Position it to the side of the car
scene.add(pointLight);

// Camera positioning for higher angle view
camera.position.set(5, 10, 5); // Position the camera higher and angled
camera.lookAt(0, 0, 0); // Look down at the car

// Control variables
let speed = 0;
let targetSpeed = 0;
let rotationSpeed = 0;
const acceleration = 0.02; // Acceleration rate
const deceleration = 0.05; // Deceleration rate
const maxSpeed = 1; // Maximum speed
const rotationAcceleration = 0.01; // Rotation acceleration rate

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            targetSpeed = maxSpeed; // Set target speed forward
            break;
        case 'ArrowDown':
            targetSpeed = -maxSpeed; // Set target speed backward
            break;
        case 'ArrowLeft':
            rotationSpeed = -rotationAcceleration; // Rotate left
            break;
        case 'ArrowRight':
            rotationSpeed = rotationAcceleration; // Rotate right
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'ArrowDown':
            targetSpeed = 0; // Stop moving
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            rotationSpeed = 0; // Stop rotating
            break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update speed with acceleration or deceleration
    if (targetSpeed > speed) {
        speed += acceleration;
        if (speed > targetSpeed) speed = targetSpeed; // Cap speed
    } else if (targetSpeed < speed) {
        speed -= deceleration;
        if (speed < targetSpeed) speed = targetSpeed; // Cap speed
    }

    // Update car position and rotation
    if (car) {
        car.position.z += speed; // Move the car forward/backward
        car.rotation.y += rotationSpeed; // Rotate the car

        // Add slight bounce effect
        car.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.02; // Bouncing effect
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
