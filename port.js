// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5); // Set the background to a soft white color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

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

// Load the texture before loading the model
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/c5ccf300c00821c8d3063a60f97311cd9bfdcec7/carmaybe.png', 
    // Success callback
    function(texture) {
        console.log("Texture loaded successfully");
        // Make sure texture has the right settings
        texture.flipY = false; // GLTF uses a different coordinate system
        texture.encoding = THREE.sRGBEncoding;
        
        // Now load the model with the prepared texture
        loadCarModel(texture);
    },
    // Progress callback
    undefined,
    // Error callback
    function(error) {
        console.error("Error loading texture:", error);
        // Try loading the model without the texture if texture fails
        loadCarModel(null);
    }
);

function loadCarModel(texture) {
    loader.load('https://raw.githubusercontent.com/JHPCS/JHPCS.github.io/18fc1a12478b8e2cd686aae823ab127d18dbff54/FabConvert.com_uploads_files_2792345_koenigsegg.glb', 
        function (gltf) {
            car = gltf.scene;

            car.traverse(function (node) {
                if (node.isMesh) {
                    // Apply texture if available
                    if (texture) {
                        node.material = new THREE.MeshStandardMaterial({ 
                            map: texture, 
                            metalness: 0.5,
                            roughness: 0.3
                        });
                    } else {
                        // Fallback material if texture failed to load
                        node.material = new THREE.MeshStandardMaterial({ 
                            color: 0x888888, 
                            metalness: 0.5,
                            roughness: 0.3
                        });
                    }
                    node.material.needsUpdate = true;
                }
            });

            car.scale.set(0.5, 0.5, 0.5);
            car.position.y = 0.1;
            scene.add(car);
        }, 
        // Progress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // Error callback
        function (error) {
            console.error('Error loading model:', error);
        }
    );
}

// Ambient light to softly illuminate the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Increased intensity
scene.add(ambientLight);

// Directional light to provide general lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5); // Adjusted position
scene.add(directionalLight);

// Add additional lights for better visibility
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 8, -5);
scene.add(fillLight);

// Function to check if the device is mobile
function isMobile() {
    // Check if userAgentData is available (for modern browsers)
    if (navigator.userAgentData && navigator.userAgentData.mobile !== undefined) {
        return navigator.userAgentData.mobile;
    }

    // Fallback to userAgent string for older browsers
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
}

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

        if (car) {
            car.rotation.y += rotationSpeed;
        }
    }
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    if (car) {
        updateMovement();

        const direction = new THREE.Vector3();
        car.getWorldDirection(direction);
        car.position.addScaledVector(direction, speed);

        car.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.02; // Slight bounce effect

        // Update camera to a higher and steeper position
        const cameraOffset = new THREE.Vector3(0, 20, 35);
        const carPosition = new THREE.Vector3();
        car.getWorldPosition(carPosition);
        camera.position.copy(carPosition).add(cameraOffset);
        camera.lookAt(carPosition);
    }

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
