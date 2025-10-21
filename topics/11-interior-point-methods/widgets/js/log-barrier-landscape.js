/**
 * Widget: Logarithmic Barrier Landscape
 *
 * Description: Visualizes the objective function combined with the logarithmic barrier function.
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initLogBarrierLandscape(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="log-barrier-widget">
            <div class="widget-controls">
                <label>Barrier Param (t): <span id="t-val-lb">1.0</span></label>
                <input type="range" id="t-slider-lb" min="-1" max="2" step="0.1" value="0">
            </div>
            <div id="plot-container" style="height:400px"></div>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider-lb");
    const tVal = container.querySelector("#t-val-lb");
    const plotContainer = container.querySelector("#plot-container");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(225, 18%, 13%)");
    const camera = new THREE.PerspectiveCamera(60, plotContainer.clientWidth/400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(plotContainer.clientWidth, 400);
    plotContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, -3, 3);
    controls.target.set(0,0,0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

    const segments = 50;
    const range = 1.5;
    const geometry = new THREE.PlaneGeometry(range * 2, range * 2, segments, segments);
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const surface = new THREE.Mesh(geometry, material);
    scene.add(surface);

    // Feasible region boundary
    const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2,2,4)),
        new THREE.LineBasicMaterial({color: "var(--color-primary)"})
    );
    box.position.set(0,0,-1); // Center it
    scene.add(box);

    const colorScale = (val, min, max) => {
        const t = Math.min(1, Math.max(0, (val - min) / (max - min)));
        return new THREE.Color().setHSL(0.7 * (1 - t), 0.8, 0.5);
    };

    function update() {
        const t = 10**(+tSlider.value);
        tVal.textContent = t.toExponential(1);

        const pos = geometry.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);

            let z;
            if (x > -1 && x < 1 && y > -1 && y < 1) {
                // Objective: x. Constraint: 1-x^2>=0, 1-y^2>=0
                z = t * x - Math.log(1 - x*x) - Math.log(1 - y*y);
            } else {
                z = 10;
            }
            z = Math.min(z, 10);
            pos.setZ(i, z);
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        for (let i = 0; i < pos.count; i++) {
            const z = pos.getZ(i);
            const color = colorScale(z, minZ, maxZ);
            colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        pos.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    tSlider.addEventListener("input", update);
    update();
    animate();
}
