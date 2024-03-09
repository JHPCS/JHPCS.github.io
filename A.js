let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.world').appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

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
