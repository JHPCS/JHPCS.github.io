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

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Camera holder setup for better control
const cameraHolder = new THREE.Object3D();
scene.add(cameraHolder);
cameraHolder.position.set(0, gameState.playerHeight, 0); // Using the player height from gameState

// Pitch object for vertical rotation
const pitchObject = new THREE.Object3D();
cameraHolder.add(pitchObject);
pitchObject.add(camera);
camera.position.set(0, 0, 0);

// Window resize handler
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a larger platform (hidden initially)
const platformGeometry = new THREE.BoxGeometry(30, 1, 30);
const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.2
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.receiveShadow = true;
platform.position.y = -0.5; // Position it properly
platform.visible = false;
scene.add(platform);

// Add a ground texture (hidden initially)
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
ground.visible = false;
scene.add(ground);

// Raycaster for shooting and portal interaction
const raycaster = new THREE.Raycaster();

// Starting Room Setup
function createStartingRoom() {
    // Create a room container
    const room = new THREE.Group();
    scene.add(room);
    
    // Room dimensions
    const roomWidth = 20;
    const roomHeight = 10;
    const roomDepth = 20;
    
    // Room walls, floor and ceiling
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5dc, // Beige
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Floor
    const floorGeometry = new THREE.BoxGeometry(roomWidth, 0.5, roomDepth);
    const floor = new THREE.Mesh(floorGeometry, wallMaterial);
    floor.position.y = -0.25;
    floor.receiveShadow = true;
    room.add(floor);
    
    // Ceiling
    const ceilingGeometry = new THREE.BoxGeometry(roomWidth, 0.5, roomDepth);
    const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
    ceiling.position.y = roomHeight;
    ceiling.receiveShadow = true;
    room.add(ceiling);
    
    // Walls
    const wallThickness = 0.5;
    
    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, roomHeight/2, -roomDepth/2);
    backWall.receiveShadow = true;
    room.add(backWall);
    
    // Front wall (with opening)
    const frontWallLeft = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth/2 - 2, roomHeight, wallThickness),
        wallMaterial
    );
    frontWallLeft.position.set(-roomWidth/4 - 1, roomHeight/2, roomDepth/2);
    frontWallLeft.receiveShadow = true;
    room.add(frontWallLeft);
    
    const frontWallRight = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth/2 - 2, roomHeight, wallThickness),
        wallMaterial
    );
    frontWallRight.position.set(roomWidth/4 + 1, roomHeight/2, roomDepth/2);
    frontWallRight.receiveShadow = true;
    room.add(frontWallRight);
    
    // Top of doorway
    const doorTop = new THREE.Mesh(
        new THREE.BoxGeometry(4, roomHeight/3, wallThickness),
        wallMaterial
    );
    doorTop.position.set(0, roomHeight - roomHeight/6, roomDepth/2);
    doorTop.receiveShadow = true;
    room.add(doorTop);
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-roomWidth/2, roomHeight/2, 0);
    leftWall.receiveShadow = true;
    room.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(roomWidth/2, roomHeight/2, 0);
    rightWall.receiveShadow = true;
    room.add(rightWall);
    
    // Add some lighting for the room
    const roomLight = new THREE.PointLight(0xffffcc, 1, 30);
    roomLight.position.set(0, roomHeight * 0.8, 0);
    roomLight.castShadow = true;
    room.add(roomLight);
    
    // Add portal positions for teleporting to target scenes
    const portalPositions = [
        { x: -7, y: 1.5, z: -9.7 }, // Back wall left
        { x: 0, y: 1.5, z: -9.7 },  // Back wall center
        { x: 7, y: 1.5, z: -9.7 },  // Back wall right
        { x: -7, y: 1.5, z: 9.7 },  // Front wall left
        { x: 7, y: 1.5, z: 9.7 }    // Front wall right
    ];
    
    const portals = [];
    
    // Create portals to different target areas
    portalPositions.forEach((position, index) => {
        const portalGeometry = new THREE.BoxGeometry(2, 3, 0.2); // Thinner portals
        const portalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00bfff,
            emissive: 0x0080ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.set(position.x, position.y, position.z);
        
        // If on back wall, rotate
        if (position.z < 0) {
            portal.rotation.y = 0; // Fixed rotation for back wall portals
        } else {
            portal.rotation.y = Math.PI; // Fixed rotation for front wall portals
        }
        
        portal.userData = {
            isPortal: true,
            targetId: `target_${index + 1}`,
            label: `Target ${index + 1}`
        };
        
        room.add(portal);
        portals.push(portal);
    });
    
    return { room, portals };
}

// Load fonts and create starting room
let defaultFont = null;
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    defaultFont = font;
    const { room, portals } = createStartingRoom();
    gameState.startingRoom = room;
    gameState.portals = portals;
    
    // Add text labels to portals once font is loaded
    if (portals.length > 0 && font) {
        addPortalLabels(portals, font);
    }
    
    // Make sure no targets are created in the starting room
    while (targets.length > 0) {
        const target = targets.pop();
        scene.remove(target);
    }
});

// Function to add text labels to portals
function addPortalLabels(portals, font) {
    portals.forEach(portal => {
        const textGeometry = new THREE.TextGeometry(portal.userData.label, {
            font: font,
            size: 0.3,
            height: 0.05
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Center text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        const isBackWall = portal.position.z < 0;
        
        // Position text properly based on wall
        if (isBackWall) {
            textMesh.position.set(
                portal.position.x - textWidth/2, 
                portal.position.y + 1.7, 
                portal.position.z + 0.2
            );
        } else {
            textMesh.position.set(
                portal.position.x - textWidth/2, 
                portal.position.y + 1.7, 
                portal.position.z - 0.2
            );
            textMesh.rotation.y = Math.PI;
        }
        
        gameState.startingRoom.add(textMesh);
    });
}

// Function to check portal intersection and handle teleportation
function checkPortalIntersection() {
    if (!gameState.inStartingRoom || !gameState.portals || gameState.portals.length === 0) return;
    
    // Create a ray from the camera position in the direction it's looking
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    raycaster.set(cameraHolder.position, direction);
    
    // Check for intersections with portals
    const intersects = raycaster.intersectObjects(gameState.portals);
    
    if (intersects.length > 0 && intersects[0].distance < 2) {
        const portal = intersects[0].object;
        teleportToTargetScene(portal.userData.targetId);
    }
}

// Function to teleport to a target scene
function teleportToTargetScene(targetId) {
    // Hide starting room
    if (gameState.startingRoom) {
        gameState.startingRoom.visible = false;
        gameState.inStartingRoom = false;
    }
    
    // Reset camera position for the target area
    cameraHolder.position.set(0, gameState.playerHeight, 5);
    pitchObject.rotation.x = 0;
    cameraHolder.rotation.y = 0;
    
    // Reset velocity when teleporting
    gameState.velocity.set(0, 0, 0);
    
    // Show platform and ground for target area
    platform.visible = true;
    ground.visible = true;
    
    // Initialize the target scene
    initTargets();
    
    gameState.currentScene = targetId;
    
    // Add a return portal
    createReturnPortal();
}

// Function to create a return portal back to the starting room
function createReturnPortal() {
    // Remove existing return portal if any
    if (gameState.returnPortal) {
        scene.remove(gameState.returnPortal);
    }
    if (gameState.returnPortalText) {
        scene.remove(gameState.returnPortalText);
    }
    
    const returnPortalGeometry = new THREE.BoxGeometry(2, 3, 0.5);
    const returnPortalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff4500,
        emissive: 0xff2000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const returnPortal = new THREE.Mesh(returnPortalGeometry, returnPortalMaterial);
    returnPortal.position.set(0, 1.5, -10);
    returnPortal.userData = {
        isReturnPortal: true
    };
    
    scene.add(returnPortal);
    gameState.returnPortal = returnPortal;
    
    // Add text label if font is loaded
    if (defaultFont) {
        const textGeometry = new THREE.TextGeometry("Return to Hub", {
            font: defaultFont,
            size: 0.3,
            height: 0.05
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Center text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textMesh.position.set(-textWidth/2, 3.2, -10);
        
        scene.add(textMesh);
        gameState.returnPortalText = textMesh;
    }
}

// Function to check return portal intersection
function checkReturnPortalIntersection() {
    if (gameState.inStartingRoom || !gameState.returnPortal) return;
    
    // Create a ray from the camera position in the direction it's looking
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    raycaster.set(cameraHolder.position, direction);
    
    // Check for intersections with return portal
    const intersects = raycaster.intersectObject(gameState.returnPortal);
    
    if (intersects.length > 0 && intersects[0].distance < 2) {
        returnToStartingRoom();
    }
}

// Function to return to the starting room
function returnToStartingRoom() {
    // Hide platform and ground
    platform.visible = false;
    ground.visible = false;
    
    // Remove return portal
    if (gameState.returnPortal) {
        scene.remove(gameState.returnPortal);
        gameState.returnPortal = null;
    }
    
    // Remove return portal text
    if (gameState.returnPortalText) {
        scene.remove(gameState.returnPortalText);
        gameState.returnPortalText = null;
    }
    
    // Remove all targets
    for (const target of targets) {
        scene.remove(target);
    }
    targets.length = 0;
    
    // Show starting room
    if (gameState.startingRoom) {
        gameState.startingRoom.visible = true;
        gameState.inStartingRoom = true;
    }
    
    // Reset camera position
    cameraHolder.position.set(0, gameState.playerHeight, 0);
    
    // Reset velocity when teleporting back
    gameState.velocity.set(0, 0, 0);
    
    gameState.currentScene = 'startingRoom';
}

// Update function for portal interactions (to be called in your main update loop)
function updateRoomInteractions(deltaTime) {
    // Check portal intersections
    checkPortalIntersection();
    checkReturnPortalIntersection();
}
