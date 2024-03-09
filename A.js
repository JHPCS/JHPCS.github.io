let scene, camera, renderer, controls;
let isMouseDown = false;
let sensitivity = 0.002;
let pitch = 0;
let rotationSpeed = new THREE.Vector2(0, 0);
let clock = new THREE.Clock();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera, document.body);
    controls.enabled = true; // Enable pointer lock controls
    scene.add(controls.getObject());

    // Creating a bright orange floor
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000); // Large enough to appear infinite
    let floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // Orange color
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    scene.add(floor);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    let onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    let onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    let onMouseDown = function (event) {
        if (event.button === 0) { // Left mouse button
            isMouseDown = true;
        }
    };

    let onMouseUp = function (event) {
        if (event.button === 0) { // Left mouse button
            isMouseDown = false;
        }
    };

    let onMouseMove = function (event) {
        if (controls.enabled && isMouseDown) {
            let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            rotationSpeed.x += movementX * sensitivity;
            rotationSpeed.y += movementY * sensitivity;

            // Apply damping
            rotationSpeed.multiplyScalar(0.9);

            controls.getObject().rotation.y -= rotationSpeed.x;
            pitch -= rotationSpeed.y;
            pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
            controls.getObject().rotation.x = pitch;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Calculate delta time
    let deltaTime = clock.getDelta();

    // Update controls
    let moveDirection = new THREE.Vector3();
    if (moveForward) moveDirection.z -= 1;
    if (moveBackward) moveDirection.z += 1;
    if (moveLeft) moveDirection.x -= 1;
    if (moveRight) moveDirection.x += 1;

    moveDirection.normalize();
    controls.getObject().translateOnAxis(moveDirection, 0.1);

    renderer.render(scene, camera);
}

init();
