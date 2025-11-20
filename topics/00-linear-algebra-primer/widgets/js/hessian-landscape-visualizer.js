/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues and eigenvectors to the curvature of the surface.
 * Version: 2.1.0
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
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Hessian Matrix H = [[a, b], [b, c]]</label>
                    <div id="matrix-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="height: 450px; border-bottom: 1px solid var(--color-border); position: relative;">
                <div id="plot-container" style="width: 100%; height: 100%;"></div>
                 <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main);">Surface: z = 0.5 xᵀHx</span>
                </div>
            </div>

            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const controlsContainer = container.querySelector("#matrix-controls");
    const outputContainer = container.querySelector("#output-container");

    // --- UI CONTROLS ---
    const sliders = {};
    const createSlider = (id, label, value, min=-2, max=2, step=0.1) => {
        const group = document.createElement('div');
        group.className = "widget-control-group";
        group.innerHTML = `
            <label class="widget-label" for="${id}">${label}: <span class="widget-value-display" id="${id}-val">${value.toFixed(1)}</span></label>
            <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" class="widget-slider">
        `;
        const slider = group.querySelector('input');
        const display = group.querySelector('span');
        slider.oninput = () => {
            display.textContent = parseFloat(slider.value).toFixed(1);
        };
        sliders[id] = slider;
        controlsContainer.appendChild(group);
    };

    createSlider('h00', 'H[0,0] (a)', H[0][0]);
    createSlider('h01', 'H[0,1] (b)', H[0][1]);
    createSlider('h11', 'H[1,1] (c)', H[1][1]);

    sliders.h00.addEventListener('input', () => { H[0][0] = parseFloat(sliders.h00.value); update(); });
    sliders.h11.addEventListener('input', () => { H[1][1] = parseFloat(sliders.h11.value); update(); });
    sliders.h01.addEventListener('input', () => {
        const val = parseFloat(sliders.h01.value);
        H[0][1] = val;
        H[1][0] = val;
        update();
    });

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, plotContainer.clientWidth / plotContainer.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, plotContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(4, 4, 6);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // --- SURFACE GEOMETRY ---
    const geometry = new THREE.PlaneGeometry(6, 6, 60, 60);
    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.1
    });
    const surface = new THREE.Mesh(geometry, material);
    surface.rotation.x = -Math.PI / 2; // Lie flat initially relative to geometry logic, but we map Z manually
    // Actually, PlaneGeometry creates X-Y plane. We want Z to be height.
    // Let's keep geometry default and modify Z in loop.
    // PlaneGeometry vertices are (x, y, 0).
    scene.add(surface);

    const colorScale = (val, min, max) => {
        // Simple blue-to-red heatmap
        const t = Math.max(0, Math.min(1, (val - min) / (max - min)));
        return new THREE.Color().setHSL(0.66 * (1 - t), 1, 0.5);
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
        const positions = geometry.attributes.position;
        const count = positions.count;
        const colors = [];

        let minZ = Infinity, maxZ = -Infinity;

        // First pass to compute Z range for coloring
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            // Quadratic form 0.5 * x^T H x
            const z = 0.5 * (H[0][0] * x * x + 2 * H[0][1] * x * y + H[1][1] * y * y);
            positions.setZ(i, z);

            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        // Avoid divide by zero
        if (Math.abs(maxZ - minZ) < 1e-5) { maxZ = minZ + 1; }

        // Second pass for colors
        for (let i = 0; i < count; i++) {
            const z = positions.getZ(i);
            const color = colorScale(z, minZ, maxZ);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function calculateEigenData(matrix) {
        const a = matrix[0][0], b = matrix[0][1], d = matrix[1][1];
        const trace = a + d;
        const det = a * d - b * b;
        const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));

        const eig1 = (trace + discriminant) / 2;
        const eig2 = (trace - discriminant) / 2;

        let type;
        const tol = 1e-3;
        if (eig1 > tol && eig2 > tol) type = "Positive Definite (Convex Bowl)";
        else if (eig1 < -tol && eig2 < -tol) type = "Negative Definite (Concave Dome)";
        else if (eig1 > tol && eig2 < -tol || eig1 < -tol && eig2 > tol) type = "Indefinite (Saddle Point)";
        else type = "Positive/Negative Semidefinite (Valley/Ridge)";

        // Eigenvectors
        const getEigenvector = (eig) => {
            // (a - lambda)x + by = 0  =>  by = -(a-lambda)x
            // If b != 0, v = [b, -(a-eig)]
            // If b = 0, then a=eig or d=eig. if a=eig, v=[1,0]. if d=eig, v=[0,1]
            if (Math.abs(b) > 1e-6) {
                return new THREE.Vector3(b, eig - a, 0).normalize();
            } else {
                 // Diagonal matrix
                 if (Math.abs(eig - a) < 1e-6) return new THREE.Vector3(1, 0, 0);
                 return new THREE.Vector3(0, 1, 0);
            }
        };

        // Map 2D eigenvectors to 3D plane for visualization (z=0 plane initially, but tangent to surface at origin)
        const v1_2d = getEigenvector(eig1);
        const v2_2d = getEigenvector(eig2);

        return {
            eigenvalues: [eig1, eig2],
            eigenvectors: [
                new THREE.Vector3(v1_2d.x, v1_2d.y, 0), // Map to 3D space x,y
                new THREE.Vector3(v2_2d.x, v2_2d.y, 0)
            ],
            type
        };
    }

    function updateOutput(eigenvalues, type) {
        outputContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                    <p><strong>Curvature Type:</strong> <span style="color: var(--color-primary); font-weight: bold;">${type}</span></p>
                </div>
                <div>
                    <p><strong>Eigenvalues (Curvature):</strong>
                       <span style="color: var(--color-accent)">λ₁=${eigenvalues[0].toFixed(2)}</span>,
                       <span style="color: #ff6b6b">λ₂=${eigenvalues[1].toFixed(2)}</span>
                    </p>
                </div>
            </div>
        `;
    }

    function updateEigenvectorArrows(eigenvectors, eigenvalues) {
        scene.remove(eigenvectorArrows);
        eigenvectorArrows = new THREE.Group();

        // Lift arrows slightly above surface at origin
        const origin = new THREE.Vector3(0, 0, 0.05);

        eigenvectors.forEach((vec, i) => {
            const val = eigenvalues[i];
            const absVal = Math.abs(val);
            const length = 1.5 + absVal * 0.5;
            const color = i === 0 ? 0x80ffb0 : 0xff6b6b; // Accent (Greenish) vs Red

            // We visualize eigenvectors in the x-y plane
            const arrow = new THREE.ArrowHelper(vec, origin, length, color, 0.3, 0.2);

            // Add label logic could go here if we used text sprites
            eigenvectorArrows.add(arrow);
        });
        scene.add(eigenvectorArrows);
    }

    // --- ANIMATION LOOP ---
    let animationFrameId;
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // --- RESIZE HANDLING ---
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === plotContainer) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        }
    });
    observer.observe(plotContainer);

    // Initial render
    // Get theme background color
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.getPropertyValue('--color-background').trim() || '#0b0d12';
    scene.background = new THREE.Color(bgColor);

    update();
    animate();

    // Cleanup
    // (Optional: add a disconnect method if needed by framework)
}
