let scene, camera, renderer, controls;
let isMouseDown = false;
let sensitivity = 0.002;
let pitch = 0;

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

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -5);
    scene.add(cube);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    let onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                controls.moveForward(0.1);
                break;
            case 'KeyA':
                controls.moveRight(-0.1);
                break;
            case 'KeyS':
                controls.moveForward(-0.1);
                break;
            case 'KeyD':
                controls.moveRight(0.1);
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

            controls.getObject().rotation.y -= movementX * sensitivity;
            pitch -= movementY * sensitivity;
            pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
            controls.getObject().rotation.x = pitch;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
