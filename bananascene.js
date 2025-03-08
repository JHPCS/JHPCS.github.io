// Set up Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Setup renderer
let renderer;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Camera holder setup for better control
const cameraHolder = new THREE.Object3D();
scene.add(cameraHolder);
cameraHolder.position.set(0, gameState.playerHeight, 5); // Using the player height constant

// Pitch object for vertical rotation
const pitchObject = new THREE.Object3D();
cameraHolder.add(pitchObject);
pitchObject.add(camera);
camera.position.set(0, 0, 0);

// Setup renderer function (called after DOM loaded)
function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
    // Window resize handler
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create a larger platform
const platformGeometry = new THREE.BoxGeometry(30, 1, 30);
const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.2
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.receiveShadow = true;
scene.add(platform);

// Add a ground texture
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x556B2F,
    roughness: 0.9,
    metalness: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// Raycaster for shooting
const raycaster = new THREE.Raycaster();
