import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

function initSOCPExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.ConeGeometry(1, 2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x80ffb0, wireframe: true });
    const cone = new THREE.Mesh(geometry, material);
    scene.add(cone);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cone.rotation.x += 0.01;
        cone.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

initSOCPExplorer('socp-visualization');
