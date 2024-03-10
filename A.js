document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    
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
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Position the cube
        cube.position.set(0, 0, -5);

        // Add lights if needed
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Start animation loop
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
        requestAnimationFrame(animate);

        let deltaTime = clock.getDelta();
        let moveDirection = new THREE.Vector3();

        if (moveForward) moveDirection.z = -1;
        if (moveBackward) moveDirection.z = 1;
        if (moveLeft) moveDirection.x = -1;
        if (moveRight) moveDirection.x = 1;

        moveDirection.normalize();
        controls.getObject().translateOnAxis(new THREE.Vector3(0, 0, -1), moveDirection.z * deltaTime * 5); // move forward/backward
        controls.getObject().translateOnAxis(new THREE.Vector3(-1, 0, 0), moveDirection.x * deltaTime * 5); // move left/right

        renderer.render(scene, camera);
    }

    init();
});
