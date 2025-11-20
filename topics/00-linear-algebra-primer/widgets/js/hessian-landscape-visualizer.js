/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues and eigenvectors to the curvature of the surface.
 *              Features projected contours and eigenvector visualization.
 * Version: 3.0.0
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
                    <label class="widget-label">Hessian Matrix Entries</label>
                    <div id="matrix-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="height: 500px; border-bottom: 1px solid var(--color-border); position: relative;">
                <div id="plot-container" style="width: 100%; height: 100%;"></div>
                 <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                        Surface: z = 0.5 xᵀHx
                    </span>
                </div>
                 <div style="position: absolute; bottom: 10px; left: 10px; pointer-events: none;">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); background: rgba(0,0,0,0.7); padding: 4px; border-radius: 4px;">
                        <span style="color: var(--color-accent);">Green Arrow: v₁ (λ₁)</span><br>
                        <span style="color: #ff6b6b;">Red Arrow: v₂ (λ₂)</span>
                    </div>
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

    createSlider('h00', 'H[0,0]', H[0][0]);
    createSlider('h01', 'H[0,1]', H[0][1]);
    createSlider('h11', 'H[1,1]', H[1][1]);

    sliders.h00.addEventListener('input', () => { H[0][0] = parseFloat(sliders.h00.value); update(); });
    sliders.h11.addEventListener('input', () => { H[1][1] = parseFloat(sliders.h11.value); update(); });
    sliders.h01.addEventListener('input', () => {
        const val = parseFloat(sliders.h01.value);
        H[0][1] = val;
        H[1][0] = val; // Enforce symmetry
        update();
    });

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    // Get theme background color
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColorStr = bodyStyles.getPropertyValue('--surface-1').trim() || '#14161f';
    scene.background = new THREE.Color(bgColorStr);

    const camera = new THREE.PerspectiveCamera(45, plotContainer.clientWidth / plotContainer.clientHeight, 0.1, 100);
    camera.position.set(5, 5, 5);
    camera.up.set(0, 0, 1); // Z-up

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, plotContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    // Axes
    // const axesHelper = new THREE.AxesHelper(3);
    // scene.add(axesHelper);

    // Grid
    const gridHelper = new THREE.GridHelper(6, 12, 0x555555, 0x222222);
    gridHelper.rotation.x = Math.PI / 2; // Rotate to XY plane (Z-up world)
    scene.add(gridHelper);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 10);
    scene.add(directionalLight);

    // --- SURFACE GEOMETRY ---
    const size = 6;
    const segments = 60;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 50,
        specular: 0x222222,
        flatShading: false,
        transparent: true,
        opacity: 0.9
    });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    const colorScale = (val, min, max) => {
        // Map value to heatmap (blue -> white -> red)
        const range = Math.max(1e-5, max - min);
        const t = (val - min) / range;

        // Custom heatmap: Dark Blue -> Cyan -> White -> Yellow -> Red
        // Simple HSL logic
        // 0.66 (blue) -> 0 (red)
        const hue = 0.66 * (1 - t);
        return new THREE.Color().setHSL(hue, 1.0, 0.5);
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

        // First pass for range
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            // Quadratic form z = 0.5 * x^T H x
            // PlaneGeometry default is XY plane. We keep X,Y and set Z.
            const z = 0.5 * (H[0][0] * x * x + 2 * H[0][1] * x * y + H[1][1] * y * y);
            positions.setZ(i, z);

            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        // Fix range if flat
        if (maxZ - minZ < 0.1) { maxZ = minZ + 0.1; }

        // Second pass for colors
        for (let i = 0; i < count; i++) {
            const z = positions.getZ(i);
            // Use symmetric range around 0 for definiteness clarity if needed,
            // but min-max scale shows shape best.
            // Let's stick to local min-max for contrast.
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
        const tol = 1e-2;
        if (eig1 > tol && eig2 > tol) type = "Positive Definite (Convex Bowl)";
        else if (eig1 < -tol && eig2 < -tol) type = "Negative Definite (Concave Dome)";
        else if ((eig1 > tol && eig2 < -tol) || (eig1 < -tol && eig2 > tol)) type = "Indefinite (Saddle Point)";
        else type = "Positive/Negative Semidefinite (Valley/Ridge)";

        // Eigenvectors
        const getEigenvector = (eig) => {
            if (Math.abs(b) > 1e-6) {
                return new THREE.Vector3(b, eig - a, 0).normalize();
            } else {
                 if (Math.abs(eig - a) < 1e-6) return new THREE.Vector3(1, 0, 0);
                 return new THREE.Vector3(0, 1, 0);
            }
        };

        const v1 = getEigenvector(eig1);
        const v2 = getEigenvector(eig2);

        return {
            eigenvalues: [eig1, eig2],
            eigenvectors: [v1, v2],
            type
        };
    }

    function updateOutput(eigenvalues, type) {
        outputContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div style="flex: 1;">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Curvature Type</div>
                    <div style="color: var(--color-primary); font-weight: bold; font-size: 1.1rem;">${type}</div>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Eigenvalues</div>
                    <div style="font-family: var(--font-mono); font-size: 1rem;">
                       <span style="color: var(--color-accent)">λ₁ = ${eigenvalues[0].toFixed(2)}</span> &nbsp;
                       <span style="color: #ff6b6b">λ₂ = ${eigenvalues[1].toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function updateEigenvectorArrows(eigenvectors, eigenvalues) {
        scene.remove(eigenvectorArrows);
        eigenvectorArrows = new THREE.Group();

        const origin = new THREE.Vector3(0, 0, 0.05);

        eigenvectors.forEach((vec, i) => {
            const val = eigenvalues[i];
            const absVal = Math.abs(val);
            // Scale length by eigenvalue magnitude roughly, but keep min size
            const length = 1.0 + Math.min(2.0, absVal);
            const color = i === 0 ? 0x80ffb0 : 0xff6b6b; // Green vs Red

            const arrow = new THREE.ArrowHelper(vec, origin, length, color, 0.3, 0.2);
            eigenvectorArrows.add(arrow);

            // Mirror arrow
            const arrowNeg = new THREE.ArrowHelper(vec.clone().negate(), origin, length, color, 0.3, 0.2);
            eigenvectorArrows.add(arrowNeg);
        });
        scene.add(eigenvectorArrows);
    }

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

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

    update();
    animate();
}
