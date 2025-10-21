/**
 * Widget: Landscape Viewer (3D)
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLandscapeViewer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="landscape-viewer-widget">
            <div class="widget-controls">
                <label for="function-select-3d">Function:</label>
                <select id="function-select-3d"></select>
                <button id="start-button">Drop Marble</button>
            </div>
            <div id="scene-container" style="height: 400px; position: relative;"></div>
        </div>
    `;

    const sceneContainer = container.querySelector("#scene-container");
    const functionSelect = container.querySelector("#function-select-3d");
    const startButton = container.querySelector("#start-button");

    let animationId;
    let marble, trace;

    const functions = {
        "Convex Quadratic": { py_func: "x**2 + y**2", py_grad: "[2*x, 2*y]", domain: 2 },
        "Non-Convex Rosenbrock": { py_func: "(1 - x)**2 + 100 * (y - x**2)**2", py_grad: "[-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)]", domain: 2 },
        "Multi-Modal": { py_func: "np.sin(5*x)*np.cos(5*y)/5", py_grad: "[np.cos(5*x)*np.cos(5*y), -np.sin(5*x)*np.sin(5*y)]", domain: 2},
    };
    let selectedFunctionName = Object.keys(functions)[0];
    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        functionSelect.appendChild(option);
    });

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
def calculate_surface(func_str, domain):
    x_ = np.linspace(-domain, domain, 50)
    y_ = np.linspace(-domain, domain, 50)
    xx, yy = np.meshgrid(x_, y_)
    x, y = xx.flatten(), yy.flatten()
    zz = eval(func_str)
    return zz.tolist()

def calculate_gradient(grad_str, x_val, y_val):
    x, y = x_val, y_val
    return eval(grad_str)

def calculate_z(func_str, x_val, y_val):
    x, y = x_val, y_val
    return eval(func_str)
`;
    await pyodide.runPythonAsync(pythonCode);
    const py_calculate_surface = pyodide.globals.get('calculate_surface');
    const py_calculate_gradient = pyodide.globals.get('calculate_gradient');
    const py_calculate_z = pyodide.globals.get('calculate_z');

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(225, 18%, 13%)");
    const camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, 400);
    sceneContainer.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -6, 6);
    controls.target.set(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

    const geometry = new THREE.PlaneGeometry(4, 4, 49, 49);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    async function updateSurface() {
        const funcInfo = functions[selectedFunctionName];
        const z_values = await py_calculate_surface(funcInfo.py_func, funcInfo.domain);

        const vertices = geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);
        let minZ = Infinity, maxZ = -Infinity;
        for(let i=0; i < z_values.length; i++) {
            vertices[i*3 + 2] = z_values[i];
            if (z_values[i] < minZ) minZ = z_values[i];
            if (z_values[i] > maxZ) maxZ = z_values[i];
        }

        for (let i = 0; i < z_values.length; i++) {
            const color = new THREE.Color().setHSL(0.7 * (1 - (z_values[i] - minZ)/(maxZ-minZ)), 0.8, 0.5);
            colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        if (marble) scene.remove(marble);
        if (trace) scene.remove(trace);

        marble = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff4136 }));
        marble.position.set(1.5, 1.5, 10); // Start high
        scene.add(marble);

        const traceMaterial = new THREE.LineBasicMaterial({ color: 0xff4136, linewidth: 2 });
        const traceGeometry = new THREE.BufferGeometry();
        const tracePositions = new Float32Array(3000); // 1000 points
        traceGeometry.setAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
        trace = new THREE.Line(traceGeometry, traceMaterial);
        let tracePosCount = 0;
        scene.add(trace);

        let lastTime = 0;
        async function animate(time) {
            const dt = (time - lastTime) * 0.001;
            lastTime = time;

            const funcInfo = functions[selectedFunctionName];
            const p = marble.position;

            const z = await py_calculate_z(funcInfo.py_func, p.x, p.y);

            if (p.z > z + 0.05) { // Is airborne
                p.z -= 9.8 * dt; // Gravity
            } else {
                p.z = z + 0.05;
                const grad = await py_calculate_gradient(funcInfo.py_grad, p.x, p.y);
                p.x -= 0.5 * grad[0] * dt;
                p.y -= 0.5 * grad[1] * dt;

                if (tracePosCount < 999) {
                    tracePositions[tracePosCount * 3] = p.x;
                    tracePositions[tracePosCount * 3 + 1] = p.y;
                    tracePositions[tracePosCount * 3 + 2] = p.z;
                    tracePosCount++;
                    trace.geometry.setDrawRange(0, tracePosCount);
                    trace.geometry.attributes.position.needsUpdate = true;
                }
            }

            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    functionSelect.addEventListener("change", (e) => {
        selectedFunctionName = e.target.value;
        if (animationId) cancelAnimationFrame(animationId);
        if (marble) scene.remove(marble);
        if (trace) scene.remove(trace);
        updateSurface();
    });
    startButton.addEventListener("click", startAnimation);

    updateSurface();
    render();
}
