/**
 * Widget: Least Squares 3D Visualizer
 *
 * Description: Visualizes the geometric interpretation of Least Squares.
 *              Shows the column space of A (a plane in R3), the target vector b,
 *              the projection p (b_hat), and the orthogonal residual r.
 * Version: 1.1.0 (Styled)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initLeastSquaresVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Initial Layout
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="control-group" style="flex: 1;">
                    <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 8px;">
                        Move <strong style="color: var(--primary-400);">Target Vector $b$</strong> to see its projection onto the plane.
                    </div>
                    <div id="vector-controls" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="height: 500px; border-bottom: 1px solid var(--border-subtle); position: relative;">
                <div id="scene-container" style="width: 100%; height: 100%;"></div>
                <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: var(--bg-surface-2); padding: 4px 8px; border-radius: 4px; font-size: var(--text-xs); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                        Geometry: $p = \\text{proj}_{\\text{Col}(A)}(b)$
                    </span>
                </div>
                 <div style="position: absolute; bottom: 10px; left: 10px; pointer-events: none;">
                    <div style="font-size: 0.75rem; color: var(--text-secondary); background: var(--bg-surface-2); padding: 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                        <div style="margin-bottom:2px;"><span style="color: var(--primary-400);">■</span> Vector $b$</div>
                        <div style="margin-bottom:2px;"><span style="color: var(--accent-400);">■</span> Projection $p$</div>
                        <div><span style="color: #ef4444;">■</span> Residual $r$</div>
                    </div>
                </div>
            </div>

            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const sceneContainer = container.querySelector("#scene-container");
    const controlsContainer = container.querySelector("#vector-controls");
    const outputContainer = container.querySelector("#output-container");

    const a1 = new THREE.Vector3(1, 0, 0.5).normalize();
    const a2 = new THREE.Vector3(0, 1, 0.5).normalize();
    let b = new THREE.Vector3(2, 2, 3);

    const sliders = {};
    ['x', 'y', 'z'].forEach((axis, i) => {
        const group = document.createElement('div');
        group.innerHTML = `
            <label style="display:flex; justify-content:space-between; font-size:var(--text-xs); color:var(--text-tertiary); margin-bottom:4px;">
                $b_${axis}$ <span id="val-${axis}" style="color:var(--text-primary); font-weight:600;">${b.getComponent(i).toFixed(1)}</span>
            </label>
            <input type="range" id="slider-${axis}" min="-4" max="4" step="0.1" value="${b.getComponent(i)}" style="width:100%;">
        `;
        controlsContainer.appendChild(group);
        const slider = group.querySelector('input');
        const display = group.querySelector('span');
        slider.oninput = () => {
            const val = parseFloat(slider.value);
            b.setComponent(i, val);
            display.textContent = val.toFixed(1);
            update();
        };
        sliders[axis] = slider;
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); 

    const camera = new THREE.PerspectiveCamera(45, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 100);
    camera.position.set(6, 6, 6);
    camera.up.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -3;
    scene.add(gridHelper);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const normal = new THREE.Vector3().crossVectors(a1, a2).normalize();
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1, depthWrite: false
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.lookAt(normal);
    mainGroup.add(planeMesh);

    function addArrow(dir, origin, color, length=null) {
        const len = length !== null ? length : dir.length();
        if (len < 1e-6) return;
        const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, len, color, 0.2, 0.15);
        mainGroup.add(arrow);
    }

    function update() {
        for (let i = mainGroup.children.length - 1; i >= 0; i--) {
            const child = mainGroup.children[i];
            if (child !== planeMesh) mainGroup.remove(child);
        }

        addArrow(a1, new THREE.Vector3(), 0x64748b, 3); // Neutral-500
        addArrow(a2, new THREE.Vector3(), 0x64748b, 3);

        const dist = b.dot(normal);
        const projection = b.clone().sub(normal.clone().multiplyScalar(dist));
        const residual = b.clone().sub(projection); 

        addArrow(b, new THREE.Vector3(), 0x60a5fa); // Primary-400
        addArrow(projection, new THREE.Vector3(), 0x2dd4bf); // Accent-400
        addArrow(residual, projection, 0xef4444); // Red

        const bLen = b.length();
        const rLen = residual.length();
        const pLen = projection.length();

        outputContainer.innerHTML = `
            <div style="display: flex; justify-content: space-around; gap: 16px; flex-wrap: wrap;">
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary);">TARGET</div>
                    <div style="color: var(--primary-400); font-weight: 600;">||b|| = ${bLen.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary);">PROJECTION</div>
                    <div style="color: var(--accent-400); font-weight: 600;">||p|| = ${pLen.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary);">RESIDUAL</div>
                    <div style="color: #ef4444; font-weight: 600;">||r|| = ${rLen.toFixed(2)}</div>
                </div>
                 <div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary);">ORTHOGONALITY</div>
                    <div style="font-size: 0.9rem;">r ⋅ p ≈ <span style="color: var(--success); font-weight: 600;">${Math.abs(residual.dot(projection)).toFixed(2)}</span></div>
                </div>
            </div>
        `;
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === sceneContainer) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        }
    });
    observer.observe(sceneContainer);

    update();
    animate();
}
