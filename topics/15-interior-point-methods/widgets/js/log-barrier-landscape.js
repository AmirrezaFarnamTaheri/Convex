/**
 * Widget: Logarithmic Barrier Landscape
 *
 * Description: Visualizes the objective function combined with the logarithmic barrier function.
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLogBarrierLandscape(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="log-barrier-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Barrier Param (t): <span id="t-val-lb">1.0</span></label>
                    <input type="range" id="t-slider-lb" min="-1" max="3" step="0.1" value="0">
                </div>
                <div class="control-group">
                    <label>Objective c:</label>
                    <div id="c-vector-control" style="width: 80px; height: 80px; border-radius: 50%; background: #2a2d3a; position: relative; cursor: pointer;">
                        <div id="c-vector-handle" style="position: absolute; width: 10px; height: 10px; background: var(--color-danger); border-radius: 50%; transform: translate(-50%, -50%);"></div>
                    </div>
                </div>
            </div>
            <div id="plot-container" style="height:500px"></div>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider-lb");
    const tVal = container.querySelector("#t-val-lb");
    const plotContainer = container.querySelector("#plot-container");
    const cVectorControl = container.querySelector("#c-vector-control");
    const cVectorHandle = container.querySelector("#c-vector-handle");

    let c = [1, 0];
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js");
    const { OrbitControls } = await import("https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(225, 18%, 13%)");
    const camera = new THREE.PerspectiveCamera(75, plotContainer.clientWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, 500);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -2.5, 2.5);
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.7));

    const segments = 80;
    const range = 1.0;
    const geometry = new THREE.PlaneGeometry(range * 2, range * 2, segments, segments);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, metalness: 0.2, roughness: 0.8 });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    const minimizerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({ color: "var(--color-accent)" }));
    scene.add(minimizerSphere);

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_surface_data(c_vec, t):
    c = np.array(c_vec)

    # Generate surface points
    xx, yy = np.meshgrid(np.linspace(-1, 1, 81), np.linspace(-1, 1, 81))

    # Barrier is -log(1-x^2) - log(1-y^2)
    zz = t * (c[0]*xx + c[1]*yy) - np.log(1 - xx**2) - np.log(1 - yy**2)

    # Approximate minimizer using gradient
    # grad(t*c'x - log(1-x^2) - log(1-y^2)) = t*c + [2x/(1-x^2), 2y/(1-y^2)] = 0
    # => 2x/(1-x^2) = -t*c1 => 2x = -t*c1*(1-x^2) => t*c1*x^2 + 2x - t*c1 = 0
    # Solve quadratic for x and y
    def solve_quad(c_i):
        if np.abs(t * c_i) < 1e-6: return 0.0
        return (-2 + np.sqrt(4 + 4*(t*c_i)**2)) / (2*t*c_i)

    x_star = solve_quad(c[0])
    y_star = solve_quad(c[1])

    z_star = t * (c[0]*x_star + c[1]*y_star) - np.log(1 - x_star**2) - np.log(1 - y_star**2)

    return json.dumps({"zz": zz.tolist(), "min_pt": [x_star, y_star, z_star]})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_surface_data = pyodide.globals.get('get_surface_data');

    async function update() {
        const t = 10**(+tSlider.value);
        tVal.textContent = t.toExponential(1);

        const data = await get_surface_data(c, t).then(r => JSON.parse(r));
        const zz = data.zz;

        const pos = geometry.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        let minZ = Infinity, maxZ = -Infinity;

        for (let i=0; i < zz.length; i++) {
            for (let j=0; j < zz[i].length; j++) {
                const z = Math.min(zz[i][j], 15); // Clamp for visualization
                pos.setZ(j + i * (segments + 1), z);
                if (z < minZ) minZ = z;
                if (z > maxZ && z < 15) maxZ = z;
            }
        }

        const colorScale = (val) => new THREE.Color().setHSL(0.6 - 0.6 * val, 0.8, 0.5);
        for (let i = 0; i < pos.count; i++) {
            const z = pos.getZ(i);
            const t = (z - minZ) / (maxZ - minZ);
            const color = colorScale(t);
            colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        pos.needsUpdate = true;
        geometry.computeVertexNormals();

        minimizerSphere.position.set(data.min_pt[0], data.min_pt[1], Math.min(data.min_pt[2], 15) + 0.05);
    }

    function updateHandle(x,y) {
        cVectorHandle.style.left = `${x}px`;
        cVectorHandle.style.top = `${y}px`;
    }

    d3.select(cVectorControl).call(d3.drag().on("drag", function(event) {
        const rect = cVectorControl.getBoundingClientRect();
        let x = event.x - rect.left - rect.width / 2;
        let y = event.y - rect.top - rect.height / 2;
        const dist = Math.sqrt(x*x + y*y);
        if (dist > rect.width / 2) { // constrain to circle
            x = (x / dist) * rect.width / 2;
            y = (y / dist) * rect.height / 2;
        }
        c = [-x / (rect.width/2), -y / (rect.height/2)]; // map to [-1, 1]
        updateHandle(x + rect.width / 2, y + rect.height / 2);
        update();
    }));

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    tSlider.addEventListener("input", update);
    updateHandle(40, 40);
    c = [0, 0];
    update();
    animate();
}
