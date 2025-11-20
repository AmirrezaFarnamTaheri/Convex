/**
 * Widget: 3D Landscape Viewer
 *
 * Description: Visualizes various 3D optimization landscapes and simulates
 *              a simple gradient descent by "dropping a marble".
 * Version: 2.1.0
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
                    <button id="reset-button" class="widget-btn">Reset</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="scene-container" style="height: 400px;"></div>
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
    "Convex Quadratic (Bowl)": {
        "func": lambda x, y: x**2 + y**2,
        "grad": lambda x, y: np.array([2*x, 2*y]),
        "domain": 2.0
    },
    "Non-Convex Rosenbrock (Valley)": {
        "func": lambda x, y: (1 - x)**2 + 10 * (y - x**2)**2,
        "grad": lambda x, y: np.array([-2*(1-x) - 40*x*(y-x**2), 20*(y-x**2)]),
        "domain": 1.5
    },
    "Multi-Modal (Rastrigin-like)": {
        "func": lambda x, y: x**2 + y**2 - np.cos(3*x) - np.cos(3*y) + 2,
        "grad": lambda x, y: np.array([2*x + 3*np.sin(3*x), 2*y + 3*np.sin(3*y)]),
        "domain": 3.0
    },
    "Saddle Point": {
        "func": lambda x, y: x**2 - y**2,
        "grad": lambda x, y: np.array([2*x, -2*y]),
        "domain": 2.0
    }
}

def calculate_surface(func_name, n_points=60):
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
        const bgColor = bodyStyles.getPropertyValue('--color-background').trim() || '#0b0d12';
        scene.background = new THREE.Color(bgColor);

        camera = new THREE.PerspectiveCamera(50, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 100);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        sceneContainer.innerHTML = '';
        sceneContainer.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, -5, 4);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(5, -5, 10);
        scene.add(dirLight);

        // Base geometry
        const geometry = new THREE.PlaneGeometry(4, 4, 59, 59);
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1
        });
        const surface = new THREE.Mesh(geometry, material);
        scene.add(surface);

        // Grid helper? Maybe just axes
        // scene.add(new THREE.AxesHelper(2));

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
        const z_grid = result.toJs().z; // 2D array
        currentDomain = result.toJs().domain;

        const z_values = z_grid.flat(); // Flattened Z

        const vertices = surface.geometry.attributes.position.array;
        const count = vertices.length / 3;
        const colors = new Float32Array(vertices.length);

        let minZ = Infinity, maxZ = -Infinity;
        z_values.forEach(z => {
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        });

        // Update vertices
        // PlaneGeometry is constructed row by row?
        // It maps u,v 0->1.
        // We need to verify vertex ordering matches numpy flattening order.
        // Usually PlaneGeometry is row-major.

        for (let i = 0; i < count; i++) {
            const z = z_values[i];
            vertices[i * 3 + 2] = z * 0.5; // Scale height for visual

            // Color map: blue (low) to red (high)
            const t = (z - minZ) / (maxZ - minZ || 1);
            const color = new THREE.Color().setHSL(0.6 * (1 - t), 0.8, 0.5);
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
            new THREE.SphereGeometry(0.08, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa })
        );

        // Start at a corner in domain
        const startX = -currentDomain * 0.8;
        const startY = -currentDomain * 0.8;

        // Map domain coords to visual coords
        // Visual plane is 4x4, so [-2, 2]
        // Scale factor = 2 / domain
        const scale = 2.0 / currentDomain;

        // Marble position in physics space (x, y, z)
        const pos = new THREE.Vector3(startX, startY, 10); // Start high

        // Marble visual position
        marble.position.set(pos.x * scale, pos.y * scale, 5);
        scene.add(marble);

        // Trace line
        const traceMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const traceGeometry = new THREE.BufferGeometry();
        // 1000 points max
        const positions = new Float32Array(3000);
        traceGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        traceGeometry.setDrawRange(0, 0);
        trace = new THREE.Line(traceGeometry, traceMaterial);
        scene.add(trace);

        let velocity = new THREE.Vector3(0, 0, 0);
        let count = 0;

        async function animatePhysics() {
            // Get height and gradient at current position
            const res = await pyodideAPI.get_z_and_grad(selectedFunctionName, pos.x, pos.y);
            const { z, grad } = res.toJs();
            const surfaceZ = z * 0.5; // Match visual scaling

            // Simple physics
            const visualZ = pos.z; // current marble height

            if (visualZ > surfaceZ + 0.1) {
                // Free fall
                velocity.z -= 9.8 * 0.016; // Gravity
                pos.z += velocity.z * 0.016;
                // Drag
                velocity.x *= 0.99;
                velocity.y *= 0.99;
            } else {
                // On surface (Gradient Descent-ish physics)
                pos.z = surfaceZ + 0.08; // Sit on top
                velocity.z = 0;

                // Force = -Gradient
                // Add some momentum
                velocity.x -= grad[0] * 0.1; // Learning rate / Force
                velocity.y -= grad[1] * 0.1;

                // Friction
                velocity.x *= 0.9;
                velocity.y *= 0.9;
            }

            pos.x += velocity.x * 0.016;
            pos.y += velocity.y * 0.016;

            // Update visual marble
            marble.position.set(pos.x * scale, pos.y * scale, pos.z);

            // Update trace
            if (count < 999) {
                positions[count * 3] = marble.position.x;
                positions[count * 3 + 1] = marble.position.y;
                positions[count * 3 + 2] = marble.position.z;
                count++;
                traceGeometry.setDrawRange(0, count);
                traceGeometry.attributes.position.needsUpdate = true;
            }

            // Stop if out of bounds
            if (Math.abs(pos.x) > currentDomain * 1.5 || Math.abs(pos.y) > currentDomain * 1.5) {
                 return;
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
