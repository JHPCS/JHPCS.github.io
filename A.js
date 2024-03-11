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

        function onMouseMove(event) {
            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            controls.getObject().rotation.y -= movementX * MOUSE_SENSITIVITY;
            controls.getObject().rotation.x -= movementY * MOUSE_SENSITIVITY;

            // Limit vertical rotation within certain limits
            const maxVerticalAngle = Math.PI / 4;
            const minVerticalAngle = -Math.PI / 4;
            controls.getObject().rotation.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, controls.getObject().rotation.x));
        }

        animate();
    } catch (error) {
        console.error('An error occurred during initialization:', error);
    }
}
