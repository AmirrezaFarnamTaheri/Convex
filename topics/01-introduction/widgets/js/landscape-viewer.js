/**
 * Widget: Landscape Viewer (3D)
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

const pyodidePromise = getPyodide();


export async function initLandscapeViewer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const functions = {
        "Quadratic": { py_func: "x**2 + y**2", py_grad: "np.array([2*x, 2*y])" },
        "Rosenbrock": { py_func: "(1 - x)**2 + 100 * (y - x**2)**2", py_grad: "np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)])" },
    };
    let selectedFunction = "Quadratic";

    // --- UI CONTROLS ---
    const controlsContainer = document.createElement("div");
    controlsContainer.style.cssText = "padding: 10px;";
    const dropdown = document.createElement("select");
    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
    dropdown.onchange = () => {
        selectedFunction = dropdown.value;
        updateSurface();
    };
    controlsContainer.appendChild(dropdown);
    container.appendChild(controlsContainer);

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 350, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, 350);
    container.appendChild(renderer.domElement);
    const controls3d = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -5, 5);
    controls3d.target.set(0,0,0);

    // --- SURFACE GEOMETRY ---
    const geometry = new THREE.PlaneGeometry(5, 5, 50, 50);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    // --- MARBLE ---
    const marbleGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const marbleMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marble = new THREE.Mesh(marbleGeo, marbleMat);
    scene.add(marble);

    async function updateSurface() {
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("py_func_str", functions[selectedFunction].py_func);
        const code = `
import numpy as np
x_ = np.linspace(-2.5, 2.5, 51)
y_ = np.linspace(-2.5, 2.5, 51)
xx, yy = np.meshgrid(x_, y_)
x, y = xx.flatten(), yy.flatten()
zz = eval(py_func_str)
zz.tolist()
        `;
        const vertices_z = await pyodide.runPythonAsync(code).then(v => v.toJs());
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices_z.length; i++) {
            vertices[i*3 + 2] = vertices_z[i];
        }
        geometry.attributes.position.needsUpdate = true;

        marble.position.set(2, 2, await pyodide.runPythonAsync("x,y=2,2; eval(py_func_str)") + 0.1);
    }

    async function animate() {
        requestAnimationFrame(animate);

        const p = marble.position;
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("x", p.x);
        await pyodide.globals.set("y", p.y);
        await pyodide.globals.set("py_grad_str", functions[selectedFunction].py_grad);

        const grad = await pyodide.runPythonAsync("eval(py_grad_str)").then(g => g.toJs());

        p.x -= 0.01 * grad[0];
        p.y -= 0.01 * grad[1];

        await pyodide.globals.set("x", p.x);
        await pyodide.globals.set("y", p.y);
        await pyodide.globals.set("py_func_str", functions[selectedFunction].py_func);
        p.z = await pyodide.runPythonAsync("eval(py_func_str)") + 0.1;

        controls3d.update();
        renderer.render(scene, camera);
    }

    updateSurface();
    animate();
}
