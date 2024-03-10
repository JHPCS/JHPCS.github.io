let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isMouseDown = false;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.world').appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    // Add a green box as a light source
    const lightGeometry = new THREE.BoxGeometry(1, 1, 1);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(0, 5, 0); // Adjust position as needed
    scene.add(light);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Event listeners for mouse events
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function onKeyDown(event) {
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
}

function onKeyUp(event) {
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
}

function onMouseDown(event) {
    if (event.button === 0) { // Check if left mouse button is pressed
        isMouseDown = true;
        document.body.requestPointerLock();
    }
}

function onMouseUp(event) {
    if (event.button === 0) { // Check if left mouse button is released
        isMouseDown = false;
        document.exitPointerLock();
    }
}

function onMouseMove(event) {
    if (isMouseDown) {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        controls.getObject().rotation.y -= movementX * 0.002; // Adjust sensitivity as needed
        controls.getObject().rotation.x -= movementY * 0.002; // Adjust sensitivity as needed

        // Clamp vertical rotation to avoid flipping upside down
        controls.getObject().rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.getObject().rotation.x));
    }
}

function animate() {
    try {
        requestAnimationFrame(animate);

        let deltaTime = clock.getDelta();
        let moveDirection = new THREE.Vector3();

        if (moveForward) moveDirection.z -= 1;
        if (moveBackward) moveDirection.z += 1;
        if (moveLeft) moveDirection.x -= 1;
        if (moveRight) moveDirection.x += 1;

        moveDirection.normalize();
        let speed = 5; // Adjust speed as needed
        controls.getObject().position.x += moveDirection.x * speed * deltaTime;
        controls.getObject().position.z += moveDirection.z * speed * deltaTime;

        renderer.render(scene, camera);
    } catch (error) {
        console.error('An error occurred during animation:', error);
    }
}

init();
