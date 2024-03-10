(function() {
    let scene, camera, renderer, controls;
    let clock = new THREE.Clock();
    const MOVE_SPEED = 5;
    const MOUSE_SENSITIVITY = 0.002;

    const keyState = {
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false
    };

    function init() {
        try {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            scene.add(camera);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.querySelector('.world').appendChild(renderer.domElement);

            controls = new THREE.PointerLockControls(camera, document.body);
            scene.add(controls.getObject());

            addLightSource();
            addFloor();

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('mousemove', onMouseMove);

            // Hide cursor
            document.body.style.cursor = 'none';

            animate();
        } catch (error) {
            console.error('An error occurred during initialization:', error);
        }
    }

    function addLightSource() {
        const lightGeometry = new THREE.BoxGeometry(1, 1, 1);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 5, 0); // Adjust position as needed
        scene.add(light);
    }

    function addFloor() {
        const floorGeometry = new THREE.PlaneGeometry(100, 100); // Adjust size as needed
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Rotate to make it a floor
        scene.add(floor);
    }

    function onKeyDown(event) {
        const key = event.code;
        if (key in keyState) {
            keyState[key] = true;
        }
    }

    function onKeyUp(event) {
        const key = event.code;
        if (key in keyState) {
            keyState[key] = false;
        }
    }

    function onMouseMove(event) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

    controls.getObject().rotation.y -= movementX * MOUSE_SENSITIVITY;
    
    // Restrict the vertical rotation within certain limits
    const maxVerticalAngle = Math.PI / 4;
    const minVerticalAngle = -Math.PI / 4;
    controls.getObject().rotation.y = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, controls.getObject().rotation.y));
}


    function animate() {
        try {
            requestAnimationFrame(animate);

            const deltaTime = clock.getDelta();
            const moveDirection = new THREE.Vector3();

            if (keyState.KeyW) moveDirection.z -= 1;
            if (keyState.KeyS) moveDirection.z += 1;
            if (keyState.KeyA) moveDirection.x -= 1;
            if (keyState.KeyD) moveDirection.x += 1;

            moveDirection.normalize();
            const moveDistance = moveDirection.multiplyScalar(MOVE_SPEED * deltaTime);
            controls.getObject().translateX(moveDistance.x);
            controls.getObject().translateZ(moveDistance.z);

            renderer.render(scene, camera);
        } catch (error) {
            console.error('An error occurred during animation:', error);
        }
    }

    init();
})();
