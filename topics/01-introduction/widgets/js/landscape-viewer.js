/**
 * Widget: 3D Landscape Viewer
 *
 * Description: Visualizes various 3D optimization landscapes and simulates
 *              a simple gradient descent algorithm from a user-clicked starting point.
 * Version: 2.1.0 (Refined)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLandscapeViewer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide & NumPy...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    container.innerHTML = `
        <div class="landscape-viewer-widget">
            <div id="scene-container" class="scene-container"></div>
            <div class="controls-area">
                <div class="control-group">
                    <label for="function-select-3d">Function:</label>
                    <select id="function-select-3d" class="widget-select"></select>
                </div>
                <div class="control-group">
                    <label for="lr-slider">Learning Rate (α) = <span id="lr-value">0.10</span></label>
                    <input type="range" id="lr-slider" min="0.01" max="0.5" step="0.01" value="0.1" class="styled-slider">
                </div>
                <button id="reset-button" class="widget-button">Reset</button>
                <div id="output-display" class="output-box">Click on the surface to start gradient descent.</div>
            </div>
        </div>
    `;

    const sceneContainer = container.querySelector("#scene-container");
    const functionSelect = container.querySelector("#function-select-3d");
    const resetButton = container.querySelector("#reset-button");
    const lrSlider = container.querySelector("#lr-slider");
    const lrValueSpan = container.querySelector("#lr-value");
    const outputDisplay = container.querySelector("#output-display");

    let animationId;
    let marble, trace;
    let scene, camera, renderer, controls, raycaster, surface;
    let learningRate = 0.1;

    const pythonCode = `
import numpy as np
FUNCTIONS = {
    "Convex Quadratic": {
        "func": lambda x, y: x**2 + y**2,
        "grad": lambda x, y: np.array([2*x, 2*y]),
        "domain": 2.0
    },
    "Rosenbrock (Non-Convex)": {
        "func": lambda x, y: (1 - x)**2 + 100 * (y - x**2)**2,
        "grad": lambda x, y: np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)]),
        "domain": 2.0
    },
    "Rastrigin (Multi-Modal)": {
        "func": lambda x, y: 20 + (x**2 - 10 * np.cos(2 * np.pi * x)) + (y**2 - 10 * np.cos(2 * np.pi * y)),
        "grad": lambda x, y: np.array([2*x + 20*np.pi*np.sin(2*np.pi*x), 2*y + 20*np.pi*np.sin(2*np.pi*y)]),
        "domain": 3.0
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

def get_grad(func_name, x_val, y_val):
    grad = FUNCTIONS[func_name]['grad'](x_val, y_val)
    return grad.tolist()

def get_z(func_name, x_val, y_val):
    return FUNCTIONS[func_name]['func'](x_val, y_val)
`;
    await pyodide.runPythonAsync(pythonCode);
    const pyodideAPI = {
        calculate_surface: pyodide.globals.get('calculate_surface'),
        get_grad: pyodide.globals.get('get_grad'),
        get_z: pyodide.globals.get('get_z'),
        FUNCTIONS: pyodide.globals.get('FUNCTIONS').toJs({create_proxies: false})
    };
    let selectedFunctionName = Object.keys(pyodideAPI.FUNCTIONS)[0];

    Object.keys(pyodideAPI.FUNCTIONS).forEach(name => {
        functionSelect.innerHTML += `<option value="${name}">${name}</option>`;
    });

    function setupScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color("var(--color-background)");
        camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
        sceneContainer.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, -4, 3);
        controls.target.set(0, 0, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, -10, 8);
        scene.add(dirLight);

        scene.add(new THREE.GridHelper(10, 20, "var(--color-border)", "var(--color-surface-2)"));
        const axesHelper = new THREE.AxesHelper(2.5);
        axesHelper.position.y = -2.5;
        scene.add(axesHelper);

        const surfaceSize = pyodideAPI.FUNCTIONS[selectedFunctionName].domain * 2;
        const geometry = new THREE.PlaneGeometry(surfaceSize, surfaceSize, 49, 49);
        const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, metalness: 0.2, roughness: 0.8 });
        surface = new THREE.Mesh(geometry, material);
        scene.add(surface);

        raycaster = new THREE.Raycaster();
        renderer.domElement.addEventListener('click', onCanvasClick);

        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            controls.update();
            renderer.render(scene, camera);
        };
        renderLoop();
    }
    setupScene();

    async function updateSurface() {
        const spec = pyodideAPI.FUNCTIONS[selectedFunctionName];
        const z_values_flat = await pyodideAPI.calculate_surface(selectedFunctionName);
        const z_values = z_values_flat.flat();

        const vertices = surface.geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);
        let minZ = Infinity, maxZ = -Infinity;
        z_values.forEach(z => { minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); });

        for (let i = 0; i < z_values.length; i++) {
            vertices[i * 3 + 2] = z_values[i];
            const color = new THREE.Color().setHSL(0.6 * (1 - (z_values[i] - minZ) / (maxZ - minZ || 1)), 0.8, 0.6);
            colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
        }

        surface.geometry.attributes.position.needsUpdate = true;
        surface.geometry.computeVertexNormals();

        const surfaceSize = spec.domain * 2;
        if(surface.geometry.parameters.width !== surfaceSize) {
          surface.geometry = new THREE.PlaneGeometry(surfaceSize, surfaceSize, 49, 49);
          updateSurface(); // re-call to apply z values
        }
    }

    function resetAnimation() {
        cancelAnimationFrame(animationId);
        if (marble) scene.remove(marble);
        if (trace) scene.remove(trace);
        outputDisplay.innerHTML = "Click on the surface to start gradient descent.";
    }

    function onCanvasClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(surface);
        if (intersects.length > 0) {
            startAnimation(intersects[0].point);
        }
    }

    function startAnimation(startPoint) {
        resetAnimation();
        marble = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff4136, emissive: 0xaa2211 }));
        marble.position.copy(startPoint);
        scene.add(marble);

        const traceMaterial = new THREE.LineBasicMaterial({ color: 0xff4136, linewidth: 2 });
        const traceGeometry = new THREE.BufferGeometry();
        const tracePositions = new Float32Array(6000); // 1000 steps * 2 points/step * 3 coords/point
        traceGeometry.setAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
        trace = new THREE.LineSegments(traceGeometry, traceMaterial);
        scene.add(trace);

        let iter = 0;
        let tracePosCount = 0;

        async function animate() {
            if (iter >= 1000) return;
            const p = marble.position;
            const grad_list = await pyodideAPI.get_grad(selectedFunctionName, p.x, p.y);
            const grad = new THREE.Vector2(grad_list[0], grad_list[1]);

            const next_p = new THREE.Vector2(p.x - learningRate * grad.x, p.y - learningRate * grad.y);
            const z = await pyodideAPI.get_z(selectedFunctionName, next_p.x, next_p.y);

            tracePositions[tracePosCount++] = p.x;
            tracePositions[tracePosCount++] = p.y;
            tracePositions[tracePosCount++] = p.z;
            tracePositions[tracePosCount++] = next_p.x;
            tracePositions[tracePosCount++] = next_p.y;
            tracePositions[tracePosCount++] = z;

            p.x = next_p.x;
            p.y = next_p.y;
            p.z = z;

            trace.geometry.setDrawRange(0, (tracePosCount / 3));
            trace.geometry.attributes.position.needsUpdate = true;

            outputDisplay.innerHTML = `
              <div><strong>Iter:</strong> ${iter+1}</div>
              <div><strong>Pos (x,y):</strong> <code>[${p.x.toFixed(2)}, ${p.y.toFixed(2)}]</code></div>
              <div><strong>f(x,y):</strong> <code>${p.z.toFixed(3)}</code></div>
            `;

            if (grad.length() < 1e-3) return; // Stop if gradient is small
            iter++;
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    }

    functionSelect.onchange = (e) => {
        selectedFunctionName = e.target.value;
        resetAnimation();
        updateSurface();
    };
    resetButton.onclick = resetAnimation;
    lrSlider.oninput = (e) => {
        learningRate = parseFloat(e.target.value);
        lrValueSpan.textContent = learningRate.toFixed(2);
    };

    new ResizeObserver(() => {
        camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    }).observe(sceneContainer);

    updateSurface();
}

const style = document.createElement('style');
style.textContent = `
.landscape-viewer-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.scene-container { flex-grow: 1; position: relative; cursor: pointer; }
.controls-area { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); background: var(--color-surface-1); }
`;
document.head.appendChild(style);
