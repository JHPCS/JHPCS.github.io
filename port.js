// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a car model
const loader = new THREE.GLTFLoader();
let car;

loader.load('path/to/your/car/model.glb', function (gltf) {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5); // Scale the car model
    scene.add(car);
}, undefined, function (error) {
    console.error(error);
});

// Add some ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0).normalize();
scene.add(directionalLight);

// Camera positioning
camera.position.z = 5;

// Control variables
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', function(e) {
    isDragging = true;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (car) {
            car.rotation.y += deltaMove.x * 0.01; // Rotate car on Y-axis
            car.rotation.x += deltaMove.y * 0.01; // Rotate car on X-axis
        }
    }

    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
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
