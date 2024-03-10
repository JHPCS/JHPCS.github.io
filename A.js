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
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        controls.getObject().rotation.y -= movementX * MOUSE_SENSITIVITY;
        controls.getObject().rotation.x -= movementY * MOUSE_SENSITIVITY;
        controls.getObject().rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.getObject().rotation.x));
    }

    function animate() {
        try {
            requestAnimationFrame(animate);

            const deltaTime = clock.getDelta();
            const moveDirection = new THREE.Vector3();

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

            if (keyState.KeyW) moveDirection.add(forward);
            if (keyState.KeyS) moveDirection.sub(forward);
            if (keyState.KeyA) moveDirection.sub(right);
            if (keyState.KeyD) moveDirection.add(right);

            moveDirection.normalize();
            controls.getObject().position.add(moveDirection.multiplyScalar(MOVE_SPEED * deltaTime));

            renderer.render(scene, camera);
        } catch (error) {
            console.error('An error occurred during animation:', error);
        }
    }

    init();
})();
