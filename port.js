// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a PNG texture
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/c5ccf300c00821c8d3063a60f97311cd9bfdcec7/carmaybe.png'); // Update this path to your texture

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
        }
    });

    car.scale.set(0.5, 0.5, 0.5);
    scene.add(car);
}, undefined, function (error) {
    console.error(error);
});



// Add some ambient light with higher intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Increased intensity to 2
scene.add(ambientLight);

// Add a directional light with higher intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Increased intensity to 2
directionalLight.position.set(0, 1, 0).normalize();
scene.add(directionalLight);

// Add an extra point light to highlight the car from another angle
const pointLight = new THREE.PointLight(0xffffff, 2, 50); // Bright white point light
pointLight.position.set(5, 5, 5); // Position it to the side of the car
scene.add(pointLight);


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
