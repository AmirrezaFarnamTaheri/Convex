/**
 * Widget: Hessian Landscape Visualizer
 *
 * Description: Renders the 3D surface of a quadratic function and its Hessian matrix,
 *              linking eigenvalues and eigenvectors to the curvature of the surface.
 * Version: 3.1.0 (Styled)
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initHessianLandscapeVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let H = [[1.0, 0.5], [0.5, 1.0]]; 

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="control-group" style="flex: 1;">
                    <label>Hessian Matrix $H = \\begin{pmatrix} h_{00} & h_{01} \\\\ h_{01} & h_{11} \\end{pmatrix}$</label>
                    <div id="matrix-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="height: 500px; border-bottom: 1px solid var(--border-subtle); position: relative;">
                <div id="plot-container" style="width: 100%; height: 100%;"></div>
                 <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: var(--bg-surface-2); padding: 4px 8px; border-radius: 4px; font-size: var(--text-xs); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                        Surface: $z = \\frac{1}{2} x^\\top H x$
                    </span>
                </div>
                 <div style="position: absolute; bottom: 10px; left: 10px; pointer-events: none;">
                    <div style="font-size: 0.75rem; color: var(--text-secondary); background: var(--bg-surface-2); padding: 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;"><span style="width:10px; height:10px; background:var(--accent-400); display:inline-block; border-radius:50%;"></span> Eigenvector $v_1$ ($\\lambda_1$)</div>
                        <div style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:#ef4444; display:inline-block; border-radius:50%;"></span> Eigenvector $v_2$ ($\\lambda_2$)</div>
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
        group.style.display = 'flex';
        group.style.flexDirection = 'column';
        group.innerHTML = `
            <label style="display:flex; justify-content:space-between; font-size:var(--text-xs); color:var(--text-tertiary); margin-bottom:4px;">
                ${label} <span id="${id}-val" style="color:var(--primary-400); font-weight:600;">${value.toFixed(1)}</span>
            </label>
            <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" style="width:100%;">
        `;
        const slider = group.querySelector('input');
        const display = group.querySelector('span');
        slider.oninput = () => {
            display.textContent = parseFloat(slider.value).toFixed(1);
        };
        sliders[id] = slider;
        controlsContainer.appendChild(group);
    };

    createSlider('h00', 'h₀₀', H[0][0]);
    createSlider('h01', 'h₀₁ (Off-diagonal)', H[0][1]);
    createSlider('h11', 'h₁₁', H[1][1]);

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
    scene.background = new THREE.Color(0x0f172a); // --bg-surface-1

    const camera = new THREE.PerspectiveCamera(45, plotContainer.clientWidth / plotContainer.clientHeight, 0.1, 100);
    camera.position.set(5, 5, 5);
    camera.up.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, plotContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    // Grid
    const gridHelper = new THREE.GridHelper(6, 12, 0x334155, 0x1e293b);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 10);
    scene.add(directionalLight);

    // Surface
    const size = 6, segments = 60;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: true, side: THREE.DoubleSide, shininess: 50, specular: 0x222222, flatShading: false, transparent: true, opacity: 0.9
    });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    let eigenvectorArrows = new THREE.Group();
    scene.add(eigenvectorArrows);

    const colorScale = (val, min, max) => {
        const range = Math.max(1e-5, max - min);
        const t = (val - min) / range;
        const hue = 0.66 * (1 - t); // Blue to Red
        return new THREE.Color().setHSL(hue, 1.0, 0.5);
    }

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

        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = 0.5 * (H[0][0] * x * x + 2 * H[0][1] * x * y + H[1][1] * y * y);
            positions.setZ(i, z);
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
        if (maxZ - minZ < 0.1) maxZ = minZ + 0.1;

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
        const tol = 1e-2;
        if (eig1 > tol && eig2 > tol) type = "Positive Definite (Convex Bowl)";
        else if (eig1 < -tol && eig2 < -tol) type = "Negative Definite (Concave Dome)";
        else if ((eig1 > tol && eig2 < -tol) || (eig1 < -tol && eig2 > tol)) type = "Indefinite (Saddle Point)";
        else type = "Semi-Definite (Valley/Ridge)";

        const getEigenvector = (eig) => {
            if (Math.abs(b) > 1e-6) return new THREE.Vector3(b, eig - a, 0).normalize();
            else return Math.abs(eig - a) < 1e-6 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
        };

        return { eigenvalues: [eig1, eig2], eigenvectors: [getEigenvector(eig1), getEigenvector(eig2)], type };
    }

    function updateOutput(eigenvalues, type) {
        outputContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div style="flex: 1;">
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Curvature</div>
                    <div style="color: var(--primary-400); font-weight: 600; font-size: 1rem;">${type}</div>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase;">Eigenvalues</div>
                    <div style="font-family: var(--font-mono); font-size: 0.9rem;">
                       <span style="color: var(--accent-400)">λ₁ = ${eigenvalues[0].toFixed(2)}</span> &nbsp;
                       <span style="color: #ef4444">λ₂ = ${eigenvalues[1].toFixed(2)}</span>
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
            const length = 1.0 + Math.min(2.0, Math.abs(val));
            const color = i === 0 ? 0x2dd4bf : 0xef4444; // Accent-400 vs Red
            eigenvectorArrows.add(new THREE.ArrowHelper(vec, origin, length, color, 0.3, 0.2));
            eigenvectorArrows.add(new THREE.ArrowHelper(vec.clone().negate(), origin, length, color, 0.3, 0.2));
        });
        scene.add(eigenvectorArrows);
    }

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
