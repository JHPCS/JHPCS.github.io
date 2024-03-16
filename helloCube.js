// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5); // Adjust the camera height

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a bright orange cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // Orange color
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// First-person controls
const controls = new THREE.FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.1;
controls.movementSpeed = 10;

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
};

animate();
