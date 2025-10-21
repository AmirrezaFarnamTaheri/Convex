/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues to curvature.
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export async function initHessianLandscapeVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let H = [[1, 0.5], [0.5, 1]]; // Hessian matrix

    // --- UI CONTROLS ---
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "matrix-controls";
    const sliders = [];
    ['h₀₀', 'h₀₁', 'h₁₀', 'h₁₁'].forEach((label, i) => {
        const controlGroup = document.createElement("div");
        const labelEl = document.createElement("label");
        labelEl.textContent = label;
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = -2;
        slider.max = 2;
        slider.step = 0.1;
        slider.value = H[Math.floor(i/2)][i%2];
        slider.oninput = () => {
            H[Math.floor(i/2)][i%2] = parseFloat(slider.value);
            // Symmetric matrix
            if(i === 1) { H[1][0] = parseFloat(slider.value); sliders[2].value = slider.value; }
            if(i === 2) { H[0][1] = parseFloat(slider.value); sliders[1].value = slider.value; }
            updateSurface();
        };
        controlGroup.append(labelEl, slider);
        controlsContainer.appendChild(controlGroup);
        sliders.push(slider);
    });
    container.appendChild(controlsContainer);

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(225, 18%, 13%)");
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 350, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, 350);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -6, 6);
    controls.target.set(0, 0, 0);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // --- SURFACE GEOMETRY ---
    const geometry = new THREE.PlaneGeometry(6, 6, 50, 50);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    const colorScale = (val, min, max) => {
        const t = (val - min) / (max - min);
        return new THREE.Color().setHSL(0.7 * (1-t), 0.8, 0.5);
    }

    function updateSurface() {
        const vertices = geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < vertices.length / 3; i++) {
            const x = vertices[i*3];
            const y = vertices[i*3+1];
            const z = 0.5 * (H[0][0]*x*x + (H[0][1] + H[1][0])*x*y + H[1][1]*y*y);
            vertices[i*3+2] = z;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        for (let i = 0; i < vertices.length / 3; i++) {
            const z = vertices[i*3+2];
            const color = colorScale(z, minZ, maxZ);
            colors[i*3] = color.r;
            colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    updateSurface();
    animate();
}
