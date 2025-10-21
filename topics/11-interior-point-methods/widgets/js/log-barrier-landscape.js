import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

function initLogBarrierLandscape(containerId) {
    const container = document.querySelector(containerId);
    const slider = container.querySelector("#t-slider");
    const plotContainer = container.querySelector("#landscape-container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, plotContainer.clientWidth / plotContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, plotContainer.clientHeight);
    plotContainer.appendChild(renderer.domElement);

    camera.position.z = 5;
    camera.position.y = 3;
    camera.rotation.x = -Math.PI / 6;

    const segments = 50;
    const range = 2;
    const geometry = new THREE.PlaneGeometry(range * 2, range * 2, segments, segments);
    const material = new THREE.MeshPhongMaterial({ color: 0x7cc5ff, side: THREE.DoubleSide, wireframe: false });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Objective: f0(x) = x^2. Constraint: f1(x) = 1 - x^2 >= 0 => -1 <= x <= 1
    // Barrier function: t*f0 - log(-f1) = t*x^2 - log(1-x^2)
    function updateSurface() {
        const t = +slider.value;
        const positionAttribute = geometry.getAttribute('position');

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i); // This corresponds to z-axis in math space

            let z;
            if (x > -1 && x < 1 && y > -1 && y < 1) {
                z = t * (x*x + y*y) - Math.log(1 - x*x) - Math.log(1 - y*y);
            } else {
                z = 10; // High value to represent infinity outside feasible set
            }

            positionAttribute.setZ(i, Math.min(z, 10)); // Clamp z for better visualization
        }
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function animate() {
        requestAnimationFrame(animate);
        plane.rotation.z += 0.005;
        renderer.render(scene, camera);
    }

    slider.addEventListener("input", updateSurface);

    updateSurface();
    animate();
}

initLogBarrierLandscape(".widget-container");
