/**
 * Widget: 3D Landscape Viewer
 *
 * Description: Visualizes various 3D optimization landscapes and simulates
 *              a marble rolling down (Gradient Descent with Momentum).
 *              Enhanced for visual quality and responsiveness.
 * Version: 3.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLandscapeViewer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Initial loading
    container.innerHTML = `
        <div class="widget-container" style="height: 500px;">
             <div class="widget-loading">
                <div class="widget-loading-spinner"></div>
                <div>Initializing Python...</div>
            </div>
        </div>
    `;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Optimization Landscape</label>
                    <select id="function-select-3d" class="widget-select"></select>
                </div>
                <div class="widget-control-group">
                    <button id="start-button" class="widget-btn primary">Drop Marble</button>
                    <button id="reset-button" class="widget-btn" disabled>Reset</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="scene-container" style="height: 400px;"></div>

            <div class="widget-output" style="text-align: center;">
                <span style="color: var(--color-text-muted);">Blue = Low Value (Minima) &nbsp;&nbsp; Red = High Value (Maxima)</span>
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

# Define functions and gradients
FUNCTIONS = {
    "Convex Quadratic (Global Min)": {
        "func": lambda x, y: 0.5*(x**2 + y**2),
        "grad": lambda x, y: np.array([x, y]),
        "domain": 3.0
    },
    "Non-Convex Rosenbrock (Narrow Valley)": {
        "func": lambda x, y: 0.1*((1 - x)**2 + 10 * (y - x**2)**2),
        "grad": lambda x, y: np.array([0.1*(-2*(1-x) - 40*x*(y-x**2)), 0.1*(20*(y-x**2))]),
        "domain": 2.0
    },
    "Multi-Modal (Many Local Minima)": {
        "func": lambda x, y: x**2 + y**2 - 2*np.cos(2*np.pi*x) - 2*np.cos(2*np.pi*y) + 4,
        "grad": lambda x, y: np.array([2*x + 4*np.pi*np.sin(2*np.pi*x), 2*y + 4*np.pi*np.sin(2*np.pi*y)]),
        "domain": 2.0
    },
    "Saddle Point": {
        "func": lambda x, y: x**2 - y**2,
        "grad": lambda x, y: np.array([2*x, -2*y]),
        "domain": 2.0
    }
}

def calculate_surface(func_name, n_points=80):
    spec = FUNCTIONS[func_name]
    domain = float(spec['domain'])
    x_ = np.linspace(-domain, domain, n_points)
    y_ = np.linspace(-domain, domain, n_points)
    xx, yy = np.meshgrid(x_, y_)
    zz = spec['func'](xx, yy)
    return {"z": zz.tolist(), "domain": domain}

def get_z_and_grad(func_name, x_val, y_val):
    spec = FUNCTIONS[func_name]
    z = spec['func'](x_val, y_val)
    grad = spec['grad'](x_val, y_val)
    return {"z": float(z), "grad": grad.tolist()}

# Get function names
list(FUNCTIONS.keys())
`;
    const functionNames = await pyodide.runPythonAsync(pythonCode);
    const pyodideAPI = {
        calculate_surface: pyodide.globals.get('calculate_surface'),
        get_z_and_grad: pyodide.globals.get('get_z_and_grad')
    };

    // Populate select
    functionNames.toJs().forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        functionSelect.appendChild(option);
    });
    let selectedFunctionName = functionNames.toJs()[0];

    // --- THREE.JS SETUP ---
    function setupScene() {
        scene = new THREE.Scene();
        const bodyStyles = window.getComputedStyle(document.body);
        const bgColor = bodyStyles.getPropertyValue('--surface-1').trim() || '#14161f';
        scene.background = new THREE.Color(bgColor);

        camera = new THREE.PerspectiveCamera(45, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 100);
        // Adjust camera for isometric-ish view
        camera.position.set(8, 8, 6);
        camera.up.set(0, 0, 1); // Z up

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        sceneContainer.innerHTML = '';
        sceneContainer.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(5, 5, 10);
        scene.add(dirLight);

        // Base geometry
        const geometry = new THREE.PlaneGeometry(6, 6, 79, 79);
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.2,
            flatShading: false
        });
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
    let currentDomain = 2.0;

    async function updateSurface() {
        const result = await pyodideAPI.calculate_surface(selectedFunctionName);
        const z_grid = result.toJs().z;
        currentDomain = result.toJs().domain;
        const z_values = z_grid.flat();

        const vertices = surface.geometry.attributes.position.array;
        const count = vertices.length / 3;
        const colors = new Float32Array(vertices.length);

        let minZ = Infinity, maxZ = -Infinity;
        z_values.forEach(z => {
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        });

        const rangeZ = maxZ - minZ || 1;

        for (let i = 0; i < count; i++) {
            const z = z_values[i];
            vertices[i * 3 + 2] = z; // Z coordinate

            // Color map: Blue (low) -> Cyan -> White -> Yellow -> Red (High)
            const t = (z - minZ) / rangeZ;
            const hue = 0.66 * (1 - t); // 0.66 is Blue, 0 is Red
            const color = new THREE.Color().setHSL(hue, 0.9, 0.5);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
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
        resetButton.disabled = true;
    }

    function startAnimation() {
        resetAnimation();
        startButton.disabled = true;
        resetButton.disabled = false;

        marble = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x444444 })
        );

        // Start at a "high" corner (domain limit)
        const startX = -currentDomain * 0.9;
        const startY = -currentDomain * 0.9;

        // Visual scale: domain maps to [-3, 3] in geometry (Plane is size 6)
        const scale = 3.0 / currentDomain;

        // Physics Position (in domain coords)
        const pos = new THREE.Vector3(startX, startY, 10);

        // Update visual position immediately
        marble.position.set(pos.x * scale, pos.y * scale, 5);
        scene.add(marble);

        // Trace
        const traceMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        const traceGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(3000);
        traceGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        traceGeometry.setDrawRange(0, 0);
        trace = new THREE.Line(traceGeometry, traceMaterial);
        scene.add(trace);

        let velocity = new THREE.Vector3(0, 0, 0);
        let count = 0;

        async function animatePhysics() {
            // Get height and gradient
            const res = await pyodideAPI.get_z_and_grad(selectedFunctionName, pos.x, pos.y);
            const { z, grad } = res.toJs();

            const surfaceZ = z;

            // "Gravity" logic: force along gradient
            // F = -grad f(x)
            const forceX = -grad[0];
            const forceY = -grad[1];

            // Update velocity (Momentum)
            velocity.x = velocity.x * 0.9 + forceX * 0.005; // 0.9 friction/momentum
            velocity.y = velocity.y * 0.9 + forceY * 0.005;

            // Update position
            pos.x += velocity.x;
            pos.y += velocity.y;

            // Clamp Z to surface (simplified rolling)
            // Get new z at new pos for visualization
            const nextRes = await pyodideAPI.get_z_and_grad(selectedFunctionName, pos.x, pos.y);
            pos.z = nextRes.toJs().z;

            // Update visual objects
            marble.position.set(pos.x * scale, pos.y * scale, pos.z + 0.15); // radius offset

            if (count < 999) {
                positions[count * 3] = marble.position.x;
                positions[count * 3 + 1] = marble.position.y;
                positions[count * 3 + 2] = marble.position.z;
                count++;
                traceGeometry.setDrawRange(0, count);
                traceGeometry.attributes.position.needsUpdate = true;
            }

            // Stop if out of bounds or very slow
            if (Math.abs(pos.x) > currentDomain * 1.1 || Math.abs(pos.y) > currentDomain * 1.1) {
                 return; // Fell off world
            }
            if (velocity.length() < 0.001 && count > 50) {
                return; // Stopped
            }

            animationId = requestAnimationFrame(animatePhysics);
        }

        animatePhysics();
    }

    // --- HANDLERS ---
    functionSelect.addEventListener("change", (e) => {
        selectedFunctionName = e.target.value;
        resetAnimation();
        updateSurface();
    });

    startButton.addEventListener("click", startAnimation);
    resetButton.addEventListener("click", resetAnimation);

    new ResizeObserver(() => {
        const w = sceneContainer.clientWidth;
        const h = sceneContainer.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }).observe(sceneContainer);

    updateSurface();
}
