/**
 * Widget: Least Squares 3D Visualizer
 *
 * Description: Visualizes the geometric interpretation of Least Squares.
 *              Shows the column space of A (a plane in R3), the target vector b,
 *              the projection p (b_hat), and the orthogonal residual r.
 * Version: 1.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";

export function initLeastSquaresVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    // Initial Layout
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 8px;">
                        Move <strong style="color: var(--color-primary);">Target Vector b</strong> controls to see the projection $p$ onto the subspace (plane).
                    </div>
                    <div id="vector-controls" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="height: 500px; border-bottom: 1px solid var(--color-border); position: relative;">
                <div id="scene-container" style="width: 100%; height: 100%;"></div>
                <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                        Least Squares Geometry: $p = \\text{proj}_{\\text{Col}(A)}(b)$
                    </span>
                </div>
                 <div style="position: absolute; bottom: 10px; left: 10px; pointer-events: none;">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); background: rgba(0,0,0,0.7); padding: 4px; border-radius: 4px;">
                        <span style="color: var(--color-primary);">■ Vector b</span><br>
                        <span style="color: var(--color-accent);">■ Projection p (Ax*)</span><br>
                        <span style="color: var(--color-error);">■ Residual r (b - p)</span>
                    </div>
                </div>
            </div>

            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const sceneContainer = container.querySelector("#scene-container");
    const controlsContainer = container.querySelector("#vector-controls");
    const outputContainer = container.querySelector("#output-container");

    // State
    // Subspace spanned by a1, a2
    const a1 = new THREE.Vector3(1, 0, 0.5).normalize();
    const a2 = new THREE.Vector3(0, 1, 0.5).normalize();
    // Ensure orthogonality for simple plane visualization logic (or just compute normal)
    // We'll just compute the normal from cross product to draw the plane.

    let b = new THREE.Vector3(2, 2, 3);

    // Controls for b vector
    const sliders = {};
    ['x', 'y', 'z'].forEach((axis, i) => {
        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.flexDirection = 'column';
        group.innerHTML = `
            <label style="font-size: 0.8rem; color: var(--color-text-muted);">b_${axis}: <span id="val-${axis}">${b.getComponent(i).toFixed(1)}</span></label>
            <input type="range" id="slider-${axis}" min="-4" max="4" step="0.1" value="${b.getComponent(i)}" class="widget-slider">
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

    // THREE.js Setup
    const scene = new THREE.Scene();
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColorStr = bodyStyles.getPropertyValue('--surface-1').trim() || '#14161f';
    scene.background = new THREE.Color(bgColorStr);

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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    // Helpers
    // Grid on XY for reference? No, grid on the subspace plane might be better, or just a reference grid at z=-3
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.z = -3;
    scene.add(gridHelper);

    // Objects Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Reusable Geometries/Materials
    const arrowHeadGeo = new THREE.ConeGeometry(0.15, 0.3, 12);
    const sphereGeo = new THREE.SphereGeometry(0.08);

    // Plane Mesh (Col Space)
    // Compute normal n = a1 x a2
    // Actually let's fix the plane to be fixed for simplicity of visualization logic?
    // Or allow dynamic plane? Fixed is better to focus on b moving.
    // Plane spanned by (1,0,0) and (0,1,0) is XY plane.
    // Plane spanned by (1,0,0.5) and (0,1,0.5) is tilted.
    const normal = new THREE.Vector3().crossVectors(a1, a2).normalize();
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1, depthWrite: false
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    // Orient plane
    planeMesh.lookAt(normal);
    mainGroup.add(planeMesh);

    // Grid on the plane
    const planeGrid = new THREE.GridHelper(10, 20, 0x888888, 0x444444);
    planeGrid.lookAt(normal);
    planeGrid.rotateX(Math.PI/2); // GridHelper is XZ by default
    // Actually aligning GridHelper to arbitrary plane is tricky.
    // Easier to just add lines manually or skip grid on tilted plane.
    // Let's skip specific grid on tilted plane for now, just the mesh is fine.

    // Draw Basis Vectors a1, a2
    function addArrow(dir, origin, color, length=null) {
        const len = length !== null ? length : dir.length();
        if (len < 1e-6) return;
        const arrow = new THREE.ArrowHelper(dir.clone().normalize(), origin, len, color, 0.2, 0.15);
        mainGroup.add(arrow);
    }

    function update() {
        // Clear dynamic objects (arrows)
        // Keep plane
        for (let i = mainGroup.children.length - 1; i >= 0; i--) {
            const child = mainGroup.children[i];
            if (child !== planeMesh) mainGroup.remove(child);
        }

        // Draw Basis of Col(A)
        addArrow(a1, new THREE.Vector3(), 0x888888, 3);
        addArrow(a2, new THREE.Vector3(), 0x888888, 3);

        // Project b onto plane
        // p = b - (b.n)n  (if n is unit normal)
        // n is already computed
        const dist = b.dot(normal);
        const projection = b.clone().sub(normal.clone().multiplyScalar(dist));
        const residual = b.clone().sub(projection); // Should be parallel to normal

        // Draw b (Blue)
        addArrow(b, new THREE.Vector3(), 0x7cc5ff);

        // Draw p (Green/Accent)
        addArrow(projection, new THREE.Vector3(), 0x80ffb0);

        // Draw r (Red)
        // Draw from p to b
        addArrow(residual, projection, 0xff6b6b);

        // Dashed line for r? ArrowHelper is solid.
        // We can add a dashed line visual if needed, but arrow is clear "vector".

        // Draw right angle marker at p
        // Ideally visualize that r is perp to plane.

        // Update stats
        const bLen = b.length();
        const rLen = residual.length();
        const pLen = projection.length();

        outputContainer.innerHTML = `
            <div style="display: flex; justify-content: space-around; gap: 16px; flex-wrap: wrap;">
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">TARGET</div>
                    <div style="color: var(--color-primary); font-weight: bold;">||b|| = ${bLen.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">PROJECTION</div>
                    <div style="color: var(--color-accent); font-weight: bold;">||p|| = ${pLen.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">RESIDUAL (ERROR)</div>
                    <div style="color: var(--color-error); font-weight: bold;">||r|| = ${rLen.toFixed(2)}</div>
                </div>
                 <div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted);">ORTHOGONALITY</div>
                    <div style="font-size: 0.9rem;">r ⋅ p ≈ <span style="color: var(--color-success); font-weight: bold;">${Math.abs(residual.dot(projection)).toFixed(2)}</span></div>
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
