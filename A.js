let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.set(0, 1.5, 0);

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

    document.addEventListener('keydown', onKeyDown);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
