/**
 * Widget: 3D Landscape Viewer
 *
 * Description: Visualizes various 3D optimization landscapes and simulates
 *              a simple gradient descent by "dropping a marble".
 * Version: 2.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLandscapeViewer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="landscape-viewer-widget">
            <div id="scene-container" style="width: 100%; height: 400px; position: relative;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="function-select-3d">Function:</label>
                <select id="function-select-3d"></select>
                <button id="start-button">Drop Marble</button>
                <button id="reset-button">Reset</button>
            </div>
        </div>
    `;

    const sceneContainer = container.querySelector("#scene-container");
    const functionSelect = container.querySelector("#function-select-3d");
    const startButton = container.querySelector("#start-button");
    const resetButton = container.querySelector("#reset-button");

    let animationId;
    let marble, trace;
    let scene, camera, renderer, controls;

    // --- PYODIDE SETUP ---
    const pythonCode = `
import numpy as np
FUNCTIONS = {
    "Convex Quadratic": {
        "func": lambda x, y: x**2 + y**2,
        "grad": lambda x, y: np.array([2*x, 2*y]),
        "domain": 2
    },
    "Non-Convex Rosenbrock": {
        "func": lambda x, y: (1 - x)**2 + 100 * (y - x**2)**2,
        "grad": lambda x, y: np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)]),
        "domain": 2
    },
    "Multi-Modal": {
        "func": lambda x, y: np.sin(5*x)*np.cos(5*y)/5,
        "grad": lambda x, y: np.array([np.cos(5*x)*np.cos(5*y), -np.sin(5*x)*np.sin(5*y)]),
        "domain": 2
    }
}
def calculate_surface(func_name, n_points=50):
    spec = FUNCTIONS[func_name]
    domain = spec['domain']
    x_ = np.linspace(-domain, domain, n_points)
    y_ = np.linspace(-domain, domain, n_points)
    xx, yy = np.meshgrid(x_, y_)
    zz = spec['func'](xx, yy)
    return zz.tolist()

def get_z_and_grad(func_name, x_val, y_val):
    spec = FUNCTIONS[func_name]
    z = spec['func'](x_val, y_val)
    grad = spec['grad'](x_val, y_val)
    return {"z": z, "grad": grad.tolist()}
`;
    await pyodide.runPythonAsync(pythonCode);
    const pyodideAPI = {
        calculate_surface: pyodide.globals.get('calculate_surface'),
        get_z_and_grad: pyodide.globals.get('get_z_and_grad'),
        FUNCTIONS: pyodide.globals.get('FUNCTIONS').toJs()
    };
    let selectedFunctionName = Object.keys(pyodideAPI.FUNCTIONS)[0];

    Object.keys(pyodideAPI.FUNCTIONS).forEach(name => {
        functionSelect.innerHTML += `<option value="${name}">${name}</option>`;
    });

    // --- THREE.JS SETUP ---
    function setupScene() {
        scene = new THREE.Scene();
        const bodyStyles = window.getComputedStyle(document.body);
        const bgColor = bodyStyles.getPropertyValue('--color-background') || '#0b0d12';
        scene.background = new THREE.Color(bgColor.trim());

        camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
        sceneContainer.innerHTML = '';
        sceneContainer.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, -3.5, 3);
        controls.target.set(0, 0, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.5));
        scene.add(new THREE.AxesHelper(1));

        const geometry = new THREE.PlaneGeometry(4, 4, 49, 49);
        const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
        const surface = new THREE.Mesh(geometry, material);
        scene.add(surface);

        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            controls.update();
            renderer.render(scene, camera);
        };
        renderLoop();
        return surface;
    }
    const surface = setupScene();

    async function updateSurface() {
        const z_values_flat = await pyodideAPI.calculate_surface(selectedFunctionName);
        const z_values = z_values_flat.flat();

        const vertices = surface.geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);
        let minZ = Infinity, maxZ = -Infinity;
        z_values.forEach(z => {
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        });

        for (let i = 0; i < z_values.length; i++) {
            vertices[i * 3 + 2] = z_values[i];
            const color = new THREE.Color().setHSL(0.6 * (1 - (z_values[i] - minZ) / (maxZ - minZ || 1)), 0.7, 0.5);
            colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
        }

        surface.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        surface.geometry.attributes.position.needsUpdate = true;
        surface.geometry.computeVertexNormals();
    }

    function resetAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        if (marble) scene.remove(marble);
        if (trace) scene.remove(trace);
        startButton.disabled = false;
    }

    function startAnimation() {
        resetAnimation();
        startButton.disabled = true;

        marble = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff4136, emissive: 0xaa2211 }));
        marble.position.set(1.5, 1.5, 10);
        scene.add(marble);

        const traceMaterial = new THREE.LineBasicMaterial({ color: 0xff4136 });
        const traceGeometry = new THREE.BufferGeometry();
        const tracePositions = new Float32Array(3000);
        traceGeometry.setAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
        trace = new THREE.Line(traceGeometry, traceMaterial);
        let tracePosCount = 0;
        scene.add(trace);

        let velocity = new THREE.Vector3(0, 0, 0);
        async function animate() {
            const p = marble.position;
            const res = await pyodideAPI.get_z_and_grad(selectedFunctionName, p.x, p.y);
            const { z, grad } = res.toJs();

            if (p.z > z + 0.05) {
                velocity.z -= 9.8 * 0.016; // Gravity
            } else {
                p.z = z + 0.05;
                velocity.x = -0.8 * grad[0];
                velocity.y = -0.8 * grad[1];
                velocity.z = 0;
            }
            p.addScaledVector(velocity, 0.016);

            if (tracePosCount < 999) {
                tracePositions[tracePosCount * 3] = p.x;
                tracePositions[tracePosCount * 3 + 1] = p.y;
                tracePositions[tracePosCount * 3 + 2] = p.z;
                tracePosCount++;
                trace.geometry.setDrawRange(0, tracePosCount);
                trace.geometry.attributes.position.needsUpdate = true;
            }
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    }

    // --- EVENT LISTENERS & INITIALIZATION ---
    functionSelect.onchange = (e) => {
        selectedFunctionName = e.target.value;
        resetAnimation();
        updateSurface();
    };
    startButton.onclick = startAnimation;
    resetButton.onclick = resetAnimation;

    new ResizeObserver(() => {
        camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    }).observe(sceneContainer);

    updateSurface();
}
