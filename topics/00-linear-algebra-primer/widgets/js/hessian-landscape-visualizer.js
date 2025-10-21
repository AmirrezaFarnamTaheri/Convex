/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues and eigenvectors to the curvature of the surface.
 * Version: 2.0.0
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initHessianLandscapeVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let H = [[1.0, 0.5], [0.5, 1.0]]; // Hessian matrix

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="hessian-widget" style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div id="plot-container" style="flex: 1 1 400px; min-width: 300px; height: 400px; position: relative;"></div>
            <div class="hessian-controls-container" style="flex: 1 1 250px; min-width: 250px;">
                <h4>Hessian Matrix (H)</h4>
                <div id="matrix-controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;"></div>
                <div id="output-container" class="widget-output"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const controlsContainer = container.querySelector("#matrix-controls");
    const outputContainer = container.querySelector("#output-container");

    // --- UI CONTROLS ---
    const sliders = {};
    const createSlider = (id, label, value) => {
        const controlGroup = document.createElement('div');
        controlGroup.innerHTML = `
            <label for="${id}" style="display: block; font-size: 0.9em;">${label}</label>
            <input type="range" id="${id}" min="-2" max="2" step="0.1" value="${value}" style="width: 100%;">
        `;
        sliders[id] = controlGroup.querySelector('input');
        controlsContainer.appendChild(controlGroup);
    };

    createSlider('h00', 'H [0,0]', H[0][0]);
    createSlider('h01', 'H [0,1] / H [1,0]', H[0][1]);

    // Create H[1,1] slider on a new line for better layout
    const h11Group = document.createElement('div');
    h11Group.style.gridColumn = "span 2";
    controlsContainer.appendChild(h11Group);
    createSlider('h11', 'H [1,1]', H[1][1]);

    sliders.h00.oninput = () => { H[0][0] = parseFloat(sliders.h00.value); update(); };
    sliders.h11.oninput = () => { H[1][1] = parseFloat(sliders.h11.value); update(); };
    sliders.h01.oninput = () => {
        const val = parseFloat(sliders.h01.value);
        H[0][1] = val;
        H[1][0] = val;
        update();
    };

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, plotContainer.clientWidth / plotContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(plotContainer.clientWidth, plotContainer.clientHeight);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -6, 6);
    controls.target.set(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // --- SURFACE GEOMETRY ---
    const geometry = new THREE.PlaneGeometry(8, 8, 60, 60);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    const colorScale = (val, min, max) => {
        const t = (val - min) / (max - min);
        return new THREE.Color().setHSL(0.6 * (1 - t) + 0.1, 0.7, 0.5);
    }

    let eigenvectorArrows = new THREE.Group();
    scene.add(eigenvectorArrows);

    function update() {
        updateSurface();
        const { eigenvalues, eigenvectors, type } = calculateEigenData(H);
        updateOutput(eigenvalues, type);
        updateEigenvectorArrows(eigenvectors, eigenvalues);
    }

    function updateSurface() {
        const vertices = geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < vertices.length / 3; i++) {
            const x = vertices[i * 3];
            const y = vertices[i * 3 + 1];
            const z = 0.5 * (H[0][0] * x * x + 2 * H[0][1] * x * y + H[1][1] * y * y);
            vertices[i * 3 + 2] = z;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        if (minZ === maxZ) { minZ -= 1; maxZ += 1; }

        for (let i = 0; i < vertices.length / 3; i++) {
            const z = vertices[i * 3 + 2];
            const color = colorScale(z, minZ, maxZ);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function calculateEigenData(matrix) {
        const a = matrix[0][0], b = matrix[0][1], d = matrix[1][1];
        const trace = a + d;
        const det = a * d - b * b;
        const discriminant = Math.sqrt(trace * trace - 4 * det);

        const eig1 = (trace + discriminant) / 2;
        const eig2 = (trace - discriminant) / 2;

        let type;
        const tol = 1e-4;
        if (eig1 > tol && eig2 > tol) type = "Positive Definite (Convex)";
        else if (eig1 < -tol && eig2 < -tol) type = "Negative Definite (Concave)";
        else if (Math.abs(eig1 * eig2) < tol) type = "Semi-definite";
        else type = "Indefinite (Saddle)";

        const getEigenvector = (eig) => {
            if (Math.abs(b) < tol && Math.abs(a - eig) < tol) return new THREE.Vector3(0, 1, 0);
            return new THREE.Vector3(b, eig - a, 0).normalize();
        };

        return {
            eigenvalues: [eig1, eig2],
            eigenvectors: [getEigenvector(eig1), getEigenvector(eig2)],
            type
        };
    }

    function updateOutput(eigenvalues, type) {
        outputContainer.innerHTML = `
            <p><strong>Eigenvalues:</strong></p>
            <ul>
                <li>λ₁ = ${eigenvalues[0].toFixed(3)}</li>
                <li>λ₂ = ${eigenvalues[1].toFixed(3)}</li>
            </ul>
            <p><strong>Type:</strong> ${type}</p>
        `;
    }

    function updateEigenvectorArrows(eigenvectors, eigenvalues) {
        scene.remove(eigenvectorArrows);
        eigenvectorArrows = new THREE.Group();

        const colors = [0xff0000, 0x0000ff]; // Red, Blue
        eigenvectors.forEach((vec, i) => {
            const length = 2 + Math.abs(eigenvalues[i]); // Scale arrow length by eigenvalue magnitude
            const arrow = new THREE.ArrowHelper(vec, new THREE.Vector3(0,0,0), length, colors[i], 0.5, 0.3);
            eigenvectorArrows.add(arrow);
        });
        scene.add(eigenvectorArrows);
    }

    // --- RESPONSIVENESS & ANIMATION ---
    let animationFrameId;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === plotContainer) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        }
    });

    resizeObserver.observe(plotContainer);

    // Initial render
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.getPropertyValue('--color-background') || '#0b0d12';
    scene.background = new THREE.Color(bgColor.trim());
    update();
    animate();

    // Cleanup logic
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (!document.body.contains(container)) {
                cancelAnimationFrame(animationFrameId);
                resizeObserver.disconnect();
                observer.disconnect();
                console.log("Hessian visualizer cleaned up.");
                return;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
