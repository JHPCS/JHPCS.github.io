// Use global THREE and CANNON from CDN scripts
const { World, Body, Box, Vec3, Sphere, NaiveBroadphase } = CANNON;

class Car {
    constructor(options) {
        // Required options
        this.scene = options.scene;
        this.camera = options.camera;
        this.renderer = options.renderer;
        
        // Initialize
        this.container = new THREE.Object3D();
        this.position = new THREE.Vector3();
        this.setupPhysics();
        this.setupCar();
    }

    setupPhysics() {
        this.physicsWorld = new World();
        this.physicsWorld.gravity.set(0, -9.82, 0);
        this.physicsWorld.broadphase = new NaiveBroadphase();
        this.physicsWorld.solver.iterations = 10;
    }

    setupCar() {
        this.setModels();
        this.setMovement();
        this.setChassis();
        this.setAntena();
        this.setBackLights();
        this.setWheels();
        this.setTransformControls();
        this.setControls();
    }

    setModels() {
        this.models = {
            chassis: this.createBasicChassis(),
            antena: this.createBasicAntena(),
            backLightsBrake: this.createBasicLights(0xff0000),
            backLightsReverse: this.createBasicLights(0xffff00),
            wheel: this.createBasicWheel()
        };
    }

    createBasicChassis() {
        const group = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(2.5, 1, 2.5);
        const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            metalness: 0.5,
            roughness: 0.4
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 1.5, 0.5);
        cabin.castShadow = true;
        group.add(cabin);
        
        return { scene: group };
    }

    createBasicAntena() {
        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const antena = new THREE.Mesh(geometry, material);
        antena.position.set(0, 2, -1.8);
        antena.rotation.x = Math.PI / 2;
        
        const group = new THREE.Group();
        group.add(antena);
        return { scene: group };
    }

    createBasicLights(color) {
        const geometry = new THREE.BoxGeometry(0.4, 0.2, 0.1);
        const material = new THREE.MeshStandardMaterial({ 
            color,
            emissive: color,
            emissiveIntensity: 0
        });
        const light = new THREE.Mesh(geometry, material);
        light.position.set(0, 0.6, -2.5);
        
        const group = new THREE.Group();
        group.add(light.clone().translateX(0.8));
        group.add(light.clone().translateX(-0.8));
        return { scene: group };
    }

    createBasicWheel() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.9,
            roughness: 0.1
        });
        const wheel = new THREE.Mesh(geometry, material);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        
        const group = new THREE.Group();
        group.add(wheel);
        return { scene: group };
    }

    setMovement() {
        this.movement = {
            speed: 0,
            maxSpeed: 0.2,
            acceleration: 0.02,
            steering: 0,
            maxSteering: Math.PI / 6,
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // Physics body for the car
        const chassisShape = new Box(new Vec3(1.5, 0.6, 2.5));
        this.chassisBody = new Body({
            mass: 1000,
            shape: chassisShape,
            position: new Vec3(0, 2, 0)
        });
        this.physicsWorld.addBody(this.chassisBody);
    }

    setChassis() {
        this.chassis = {
            object: this.models.chassis.scene,
            oldPosition: new THREE.Vector3()
        };
        this.container.add(this.chassis.object);
    }

    setAntena() {
        this.antena = {
            object: this.models.antena.scene,
            speed: new THREE.Vector2(),
            position: new THREE.Vector2(),
            speedStrength: 10,
            damping: 0.035
        };
        this.chassis.object.add(this.antena.object);
    }

    setBackLights() {
        this.backLightsBrake = {
            object: this.models.backLightsBrake.scene,
            material: this.models.backLightsBrake.scene.children[0].material
        };
        this.chassis.object.add(this.backLightsBrake.object);
        
        this.backLightsReverse = {
            object: this.models.backLightsReverse.scene,
            material: this.models.backLightsReverse.scene.children[0].material
        };
        this.chassis.object.add(this.backLightsReverse.object);
    }

    setWheels() {
        this.wheels = {
            items: [],
            bodies: []
        };
        
        const positions = [
            { x: 1.5, y: 0.5, z: 2 },   // Front left
            { x: -1.5, y: 0.5, z: 2 },  // Front right
            { x: 1.5, y: 0.5, z: -2 },  // Rear left
            { x: -1.5, y: 0.5, z: -2 }  // Rear right
        ];
        
        positions.forEach((pos, i) => {
            // Visual wheel
            const wheel = this.models.wheel.scene.clone();
            wheel.position.set(pos.x, pos.y, pos.z);
            this.container.add(wheel);
            this.wheels.items.push(wheel);
            
            // Physics wheel
            const wheelBody = new Body({
                mass: 50,
                shape: new Sphere(0.5),
                position: new Vec3(pos.x, pos.y, pos.z)
            });
            this.physicsWorld.addBody(wheelBody);
            this.wheels.bodies.push(wheelBody);
        });
    }

    setTransformControls() {
        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.size = 0.5;
        this.transformControls.attach(this.chassis.object);
        this.transformControls.enabled = false;
        this.scene.add(this.transformControls);
    }

    setControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW': this.movement.forward = true; break;
                case 'ArrowDown':
                case 'KeyS': this.movement.backward = true; break;
                case 'ArrowLeft':
                case 'KeyA': this.movement.left = true; break;
                case 'ArrowRight':
                case 'KeyD': this.movement.right = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW': this.movement.forward = false; break;
                case 'ArrowDown':
                case 'KeyS': this.movement.backward = false; break;
                case 'ArrowLeft':
                case 'KeyA': this.movement.left = false; break;
                case 'ArrowRight':
                case 'KeyD': this.movement.right = false; break;
            }
        });

        // Touch controls
        const forwardBtn = document.getElementById('forward');
        const backwardBtn = document.getElementById('backward');
        const wheel = document.getElementById('wheel');
        const innerWheel = document.getElementById('inner-wheel');

        forwardBtn.addEventListener('touchstart', () => this.movement.forward = true);
        forwardBtn.addEventListener('touchend', () => this.movement.forward = false);
        backwardBtn.addEventListener('touchstart', () => this.movement.backward = true);
        backwardBtn.addEventListener('touchend', () => this.movement.backward = false);

        // Steering wheel control
        let isDragging = false;
        let startAngle = 0;
        let currentAngle = 0;

        const getAngle = (clientX, clientY) => {
            const rect = wheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return Math.atan2(clientY - centerY, clientX - centerX);
        };

        const moveHandler = (clientX, clientY) => {
            if (!isDragging) return;
            const angle = getAngle(clientX, clientY);
            currentAngle = angle - startAngle;
            currentAngle = Math.max(-Math.PI/3, Math.min(Math.PI/3, currentAngle));
            
            // Update steering
            this.movement.steering = currentAngle * 1.5;
            
            // Update wheel visual
            const radius = wheel.offsetWidth / 2 - innerWheel.offsetWidth / 2;
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;
            innerWheel.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        };

        wheel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startAngle = getAngle(e.touches[0].clientX, e.touches[0].clientY) - currentAngle;
        });

        wheel.addEventListener('touchmove', (e) => {
            moveHandler(e.touches[0].clientX, e.touches[0].clientY);
        });

        wheel.addEventListener('touchend', () => {
            isDragging = false;
            currentAngle = 0;
            this.movement.steering = 0;
            innerWheel.style.transform = 'translate(-50%, -50%)';
        });
    }

    update(deltaTime) {
        // Update physics
        this.physicsWorld.step(deltaTime);
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Update visuals
        this.updateVisuals();
        
        // Update camera
        this.updateCamera();
    }

    updateMovement(deltaTime) {
        // Speed control
        if (this.movement.forward) {
            this.movement.speed = Math.min(this.movement.speed + this.movement.acceleration, this.movement.maxSpeed);
        } else if (this.movement.backward) {
            this.movement.speed = Math.max(this.movement.speed - this.movement.acceleration, -this.movement.maxSpeed/2);
        } else {
            this.movement.speed *= 0.95; // Friction
            if (Math.abs(this.movement.speed) < 0.001) this.movement.speed = 0;
        }

        // Steering control
        if (this.movement.left) {
            this.movement.steering = Math.min(this.movement.steering + 0.02, this.movement.maxSteering);
        } else if (this.movement.right) {
            this.movement.steering = Math.max(this.movement.steering - 0.02, -this.movement.maxSteering);
        } else {
            this.movement.steering *= 0.8; // Center steering
        }

        // Apply forces
        if (Math.abs(this.movement.speed) > 0.01) {
            const force = new Vec3(0, 0, -this.movement.speed * 1000);
            force.applyQuaternion(this.chassisBody.quaternion);
            this.chassisBody.applyForce(force, this.chassisBody.position);
            
            // Apply steering
            if (Math.abs(this.movement.steering) > 0.01) {
                const steerForce = this.movement.steering * this.movement.speed * 500;
                this.chassisBody.angularVelocity.y = -steerForce;
            }
        }
    }

    updateVisuals() {
        // Sync Three.js with Cannon.js
        this.chassis.object.position.copy(this.chassisBody.position);
        this.chassis.object.quaternion.copy(this.chassisBody.quaternion);
        
        // Update wheels
        this.wheels.items.forEach((wheel, i) => {
            wheel.position.copy(this.wheels.bodies[i].position);
            wheel.quaternion.copy(this.wheels.bodies[i].quaternion);
            
            // Rotate wheels based on speed
            if (i < 2) { // Front wheels
                wheel.rotation.y = -this.movement.steering;
            }
            wheel.rotation.x += this.movement.speed * 5;
        });
        
        // Update antenna
        const antennaMovement = new THREE.Vector3().copy(this.chassisBody.velocity).multiplyScalar(0.1);
        this.antena.speed.x = antennaMovement.x;
        this.antena.speed.y = antennaMovement.z;
        this.antena.speed.multiplyScalar(1 - this.antena.damping);
        this.antena.position.add(this.antena.speed);
        this.antena.object.rotation.y = this.antena.position.x * 0.2;
        this.antena.object.rotation.x = this.antena.position.y * 0.2;
        
        // Update lights
        const brakeIntensity = this.movement.backward ? 1 : 0;
        this.backLightsBrake.material.emissiveIntensity = brakeIntensity;
        this.backLightsReverse.material.emissiveIntensity = this.movement.speed > 0.01 ? 1 : 0;
    }

    updateCamera() {
        const carPos = this.chassis.object.position.clone();
        const offset = new THREE.Vector3(0, 5, 10);
        offset.applyQuaternion(this.chassis.object.quaternion);
        this.camera.position.copy(carPos.add(offset));
        this.camera.lookAt(carPos);
    }
}

// Main app initialization
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Create car
const car = new Car({
    scene,
    camera,
    renderer
});
scene.add(car.container);

// Animation loop
let lastTime = 0;
function animate(time) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    
    car.update(deltaTime);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate(0);

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
