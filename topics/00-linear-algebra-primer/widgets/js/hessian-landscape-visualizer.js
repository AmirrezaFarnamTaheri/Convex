/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues to curvature.
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.mjs";

export async function initHessianLandscapeVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");

    container.innerHTML = '';

    let H = [[1, 0.5], [0.5, 1]]; // Hessian matrix

    // --- UI CONTROLS ---
    const controlsContainer = document.createElement("div");
    controlsContainer.style.cssText = "padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;";
    const sliders = [];
    ['h00', 'h01', 'h10', 'h11'].forEach((id, i) => {
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
        controlsContainer.appendChild(slider);
        sliders.push(slider);
    });
    container.appendChild(controlsContainer);

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 350, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, 350);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -5, 5);
    controls.target.set(0,0,0);


    // --- SURFACE GEOMETRY ---
    const geometry = new THREE.PlaneGeometry(5, 5, 50, 50);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    function updateSurface() {
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length / 3; i++) {
            const x = vertices[i*3];
            const y = vertices[i*3+1];
            // z = 0.5 * [x, y] * H * [x, y]'
            vertices[i*3+2] = 0.5 * (H[0][0]*x*x + (H[0][1] + H[1][0])*x*y + H[1][1]*y*y);
        }
        geometry.attributes.position.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    updateSurface();
    animate();
}
