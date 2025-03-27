class PortCar {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // Car properties
        this.speed = 0;
        this.maxSpeed = 25;
        this.acceleration = 0.2;
        this.deceleration = 0.1;
        this.steeringAngle = 0;
        this.maxSteering = Math.PI / 6;
        this.steeringSpeed = 0.03;
        this.wheelRotation = 0;
        
        // Create car
        this.createCar();
        
        // Controls
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // Setup controls
        this.setupControls();
    }
    
    createCar() {
        // Create car container
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
        
        // Load car model
        const loader = new THREE.GLTFLoader();
        loader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb',
            (gltf) => {
                this.car = gltf.scene;
                this.car.scale.set(0.5, 0.5, 0.5);
                this.car.position.y = 0.5;
                
                // Adjust materials for better appearance
                this.car.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        if (child.material) {
                            child.material.metalness = 0.7;
                            child.material.roughness = 0.3;
                            child.material.envMapIntensity = 1;
                        }
                    }
                });
                
                this.container.add(this.car);
                
                // Create wheels
                this.createWheels();
                
                // Add lights
                this.createLights();
            },
            undefined,
            (error) => {
                console.error('Error loading car model:', error);
            }
        );
        
        // Create a simple car body if model fails to load
        this.backupCar = new THREE.Mesh(
            new THREE.BoxGeometry(4, 1.5, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                metalness: 0.7,
                roughness: 0.3
            })
        );
        this.backupCar.position.y = 0.75;
        this.backupCar.castShadow = true;
        this.backupCar.receiveShadow = true;
        this.container.add(this.backupCar);
    }
    
    createWheels() {
        this.wheels = [];
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        });
        
        // Positions for wheels (front left, front right, rear left, rear right)
        const positions = [
            { x: 1.5, y: 0.5, z: 2.5 },
            { x: -1.5, y: 0.5, z: 2.5 },
            { x: 1.5, y: 0.5, z: -2.5 },
            { x: -1.5, y: 0.5, z: -2.5 }
        ];
        
        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(positions[i].x, positions[i].y, positions[i].z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            this.container.add(wheel);
            this.wheels.push(wheel);
        }
    }
    
    createLights() {
        // Headlights
        this.headlightLeft = new THREE.SpotLight(0xffffff, 2, 20, Math.PI / 6, 0.5);
        this.headlightLeft.position.set(1, 0.5, 3);
        this.headlightLeft.target.position.set(1, 0, 10);
        this.headlightLeft.castShadow = true;
        this.headlightLeft.shadow.mapSize.width = 1024;
        this.headlightLeft.shadow.mapSize.height = 1024;
        this.container.add(this.headlightLeft);
        this.container.add(this.headlightLeft.target);
        
        this.headlightRight = new THREE.SpotLight(0xffffff, 2, 20, Math.PI / 6, 0.5);
        this.headlightRight.position.set(-1, 0.5, 3);
        this.headlightRight.target.position.set(-1, 0, 10);
        this.headlightRight.castShadow = true;
        this.headlightRight.shadow.mapSize.width = 1024;
        this.headlightRight.shadow.mapSize.height = 1024;
        this.container.add(this.headlightRight);
        this.container.add(this.headlightRight.target);
        
        // Brake lights
        this.brakeLightLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.1),
            new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0
            })
        );
        this.brakeLightLeft.position.set(0.8, 0.5, -3.5);
        this.container.add(this.brakeLightLeft);
        
        this.brakeLightRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.1),
            new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: 0
            })
        );
        this.brakeLightRight.position.set(-0.8, 0.5, -3.5);
        this.container.add(this.brakeLightRight);
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true;
                    break;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = false;
                    break;
            }
        });
        
        // Touch controls
        const forwardButton = document.getElementById('forward');
        const backwardButton = document.getElementById('backward');
        const wheel = document.getElementById('wheel');
        const innerWheel = document.getElementById('inner-wheel');
        
        // Button event listeners
        forwardButton.addEventListener('touchstart', () => this.keys.forward = true);
        forwardButton.addEventListener('touchend', () => this.keys.forward = false);
        forwardButton.addEventListener('mousedown', () => this.keys.forward = true);
        forwardButton.addEventListener('mouseup', () => this.keys.forward = false);
        
        backwardButton.addEventListener('touchstart', () => this.keys.backward = true);
        backwardButton.addEventListener('touchend', () => this.keys.backward = false);
        backwardButton.addEventListener('mousedown', () => this.keys.backward = true);
        backwardButton.addEventListener('mouseup', () => this.keys.backward = false);
        
        // Wheel event listeners
        let isDragging = false;
        let startAngle = 0;
        let currentAngle = 0;
        
        const getAngle = (clientX, clientY) => {
            const rect = wheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return Math.atan2(clientY - centerY, clientX - centerX);
        };
        
        wheel.addEventListener('touchstart', (event) => {
            isDragging = true;
            startAngle = getAngle(event.touches[0].clientX, event.touches[0].clientY) - currentAngle;
        });
        
        wheel.addEventListener('mousedown', (event) => {
            isDragging = true;
            startAngle = getAngle(event.clientX, event.clientY) - currentAngle;
        });
        
        const moveHandler = (clientX, clientY) => {
            if (!isDragging) return;
            const angle = getAngle(clientX, clientY);
            currentAngle = angle - startAngle;
            
            // Limit rotation angle
            currentAngle = Math.max(-Math.PI/3, Math.min(Math.PI/3, currentAngle));
            
            // Update steering
            this.steeringAngle = currentAngle * 1.5;
            
            // Update wheel visual rotation
            if (this.wheels && this.wheels.length >= 2) {
                this.wheels[0].rotation.y = -currentAngle;
                this.wheels[1].rotation.y = -currentAngle;
            }
            
            // Update inner wheel position
            const radius = wheel.offsetWidth / 2 - innerWheel.offsetWidth / 2;
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;
            innerWheel.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        };
        
        wheel.addEventListener('touchmove', (event) => {
            moveHandler(event.touches[0].clientX, event.touches[0].clientY);
        });
        
        wheel.addEventListener('mousemove', (event) => {
            if (isDragging) {
                moveHandler(event.clientX, event.clientY);
            }
        });
        
        const endHandler = () => {
            isDragging = false;
            currentAngle = 0;
            this.steeringAngle = 0;
            
            // Reset wheel rotation
            if (this.wheels && this.wheels.length >= 2) {
                this.wheels[0].rotation.y = 0;
                this.wheels[1].rotation.y = 0;
            }
            
            // Reset inner wheel position
            innerWheel.style.transform = 'translate(-50%, -50%)';
        };
        
        wheel.addEventListener('touchend', endHandler);
        wheel.addEventListener('mouseup', endHandler);
        wheel.addEventListener('mouseleave', endHandler);
    }
    
    update(deltaTime) {
        if (!this.container) return;
        
        // Update speed
        if (this.keys.forward) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (this.keys.backward) {
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed / 2);
        } else {
            // Decelerate
            if (this.speed > 0) {
                this.speed = Math.max(this.speed - this.deceleration, 0);
            } else if (this.speed < 0) {
                this.speed = Math.min(this.speed + this.deceleration, 0);
            }
        }
        
        // Update steering
        if (this.keys.left) {
            this.steeringAngle = Math.min(this.steeringAngle + this.steeringSpeed, this.maxSteering);
        } else if (this.keys.right) {
            this.steeringAngle = Math.max(this.steeringAngle - this.steeringSpeed, -this.maxSteering);
        }
        
        // Apply movement if speed is not zero
        if (Math.abs(this.speed) > 0.1) {
            // Rotate car based on steering angle and speed
            const rotationAmount = this.steeringAngle * (this.speed / this.maxSpeed) * deltaTime * 5;
            this.container.rotation.y -= rotationAmount;
            
            // Move car forward/backward
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(this.container.quaternion);
            this.container.position.add(direction.multiplyScalar(this.speed * deltaTime));
            
            // Rotate front wheels when steering
            if (this.wheels && this.wheels.length >= 2) {
                this.wheels[0].rotation.y = -this.steeringAngle;
                this.wheels[1].rotation.y = -this.steeringAngle;
            }
        }
        
        // Rotate all wheels based on speed
        if (this.wheels) {
            const rotationSpeed = this.speed * deltaTime * 5;
            for (const wheel of this.wheels) {
                wheel.rotation.x += rotationSpeed;
            }
        }
        
        // Update brake lights
        if (this.brakeLightLeft && this.brakeLightRight) {
            const brakeIntensity = this.keys.backward ? 1 : (this.speed < -0.1 ? 0.7 : 0);
            this.brakeLightLeft.material.emissiveIntensity = brakeIntensity;
            this.brakeLightRight.material.emissiveIntensity = brakeIntensity;
        }
        
        // Update camera position to follow car
        if (this.camera) {
            const carPosition = this.container.position.clone();
            const offset = new THREE.Vector3(0, 5, 10);
            offset.applyQuaternion(this.container.quaternion);
            this.camera.position.copy(carPosition.add(offset));
            this.camera.lookAt(this.container.position);
        }
    }
}
