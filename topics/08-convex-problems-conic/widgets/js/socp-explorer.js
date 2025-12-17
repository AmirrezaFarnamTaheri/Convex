/**
 * Widget: SOCP Explorer
 *
 * Description: Interactive visualization of Second-Order Cone Programs (SOCP)
 *              with 3D cone visualization and problem examples
 * Version: 3.0.0 - Enhanced with modern framework
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js';

export function initSOCPExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- HELPER COMPONENTS ---
    // Minimal implementation of components since we can't rely on external file yet
    const createTabs = (parent, tabs) => {
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.borderBottom = '1px solid var(--border-subtle)';
        header.style.marginBottom = '16px';
        parent.appendChild(header);

        const content = document.createElement('div');
        parent.appendChild(content);

        const tabContentDivs = tabs.map(() => {
            const div = document.createElement('div');
            div.style.display = 'none';
            content.appendChild(div);
            return div;
        });

        tabs.forEach((tab, i) => {
            const btn = document.createElement('button');
            btn.textContent = tab;
            btn.className = 'btn btn-ghost btn-sm';
            btn.style.borderRadius = '0';
            if (i === 0) {
                btn.style.borderBottom = '2px solid var(--primary-500)';
                btn.style.color = 'var(--text-primary)';
                tabContentDivs[0].style.display = 'block';
            }
            btn.onclick = () => {
                header.childNodes.forEach(b => {
                    b.style.borderBottom = 'none';
                    b.style.color = 'var(--text-secondary)';
                });
                btn.style.borderBottom = '2px solid var(--primary-500)';
                btn.style.color = 'var(--text-primary)';
                tabContentDivs.forEach(d => d.style.display = 'none');
                tabContentDivs[i].style.display = 'block';
            };
            header.appendChild(btn);
        });
        return tabContentDivs;
    };

    const createSlider = (parent, label, min, max, step, val, onChange) => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '8px';
        wrapper.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">
                <span>${label}</span>
                <span class="val-disp">${val}</span>
            </div>
            <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;">
        `;
        const input = wrapper.querySelector('input');
        const disp = wrapper.querySelector('.val-disp');
        input.oninput = (e) => {
            disp.textContent = parseFloat(e.target.value).toFixed(2);
            onChange(parseFloat(e.target.value));
        };
        parent.appendChild(wrapper);
        return { setValue: (v) => { input.value = v; disp.textContent = v.toFixed(2); } };
    };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `<div class="widget-container" style="padding:16px;"></div>`;
    const inner = container.querySelector('.widget-container');

    const tabs = createTabs(inner, ['Interactive', 'Examples']);

    // --- TAB 1: INTERACTIVE 3D VISUALIZATION ---
    tabs[0].innerHTML = `
        <div style="display: flex; flex-direction: column; height: 500px;">
            <div id="scene-container" style="flex: 1; position: relative; background: #0f172a; border-radius: 8px; overflow:hidden;"></div>
            <div id="cone-controls" style="padding: 15px; background: var(--bg-surface-2); margin-top:12px; border-radius:8px;"></div>
            <div id="point-status" style="padding: 10px; background: var(--bg-surface-1); margin-top:8px; border:1px solid var(--border-subtle); border-radius:4px;"></div>
        </div>
    `;

    const sceneContainer = tabs[0].querySelector('#scene-container');
    const controlsContainer = tabs[0].querySelector('#cone-controls');
    const statusContainer = tabs[0].querySelector('#point-status');

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Dark blue bg

    const camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(5, 4, 5);
    controls.target.set(0, 2, 0);
    controls.update();

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Axes
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // --- SECOND-ORDER CONE GEOMETRY ---
    // ||x|| <= t. In 3D: sqrt(x^2 + z^2) <= y (mapping t to y-axis for standard cone orientation)

    function createSOCone(height = 5, radius = 5, segments = 64) {
        // ConeGeometry(radius, height, radialSegments)
        // Default Three.js cone has base at y = -height/2.
        // We want apex at origin (y=0) growing upwards.
        const geometry = new THREE.ConeGeometry(radius, height, segments, 1, true); // openEnded=true
        const material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6, // Primary blue
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            roughness: 0.1,
            metalness: 0.1
        });
        const cone = new THREE.Mesh(geometry, material);

        // Default cylinder/cone is centered at local origin.
        // Height 5 means y goes from -2.5 to 2.5.
        // We want tip at 0, base at 5.
        // Geometry is constructed with tip at top (y=2.5) and base at bottom (y=-2.5).
        // We need to invert it (tip at bottom) and shift up.
        cone.rotation.x = Math.PI;
        cone.position.y = height / 2;

        return cone;
    }

    let cone = createSOCone();
    scene.add(cone);

    // Grid helper on XZ plane
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Test point sphere
    const pointGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 });
    const testPoint = new THREE.Mesh(pointGeometry, pointMaterial);
    scene.add(testPoint);

    // Projection line (from point to axis or projection onto cone)
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, dashSize: 0.2, gapSize: 0.1 });
    const projLine = new THREE.Line(lineGeo, lineMat);
    scene.add(projLine);

    // --- CONTROLS ---
    let px = 1, py = 1, pt = 2; // x1, x2, t (mapped to x, z, y in 3D)

    controlsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h5 style="margin:0 0 10px 0; color:var(--text-secondary);">Position</h5>
                <div id="x-slider"></div>
                <div id="y-slider"></div>
                <div id="t-slider"></div>
            </div>
            <div>
                <h5 style="margin:0 0 10px 0; color:var(--text-secondary);">Visualization</h5>
                <div id="opacity-slider"></div>
                <div style="margin-top:10px; font-size:0.8rem; color:var(--text-tertiary);">
                    <p>The SOC constraint <strong>||x||₂ ≤ t</strong> defines the interior of the cone.</p>
                    <p>Green = Feasible, Red = Infeasible.</p>
                </div>
            </div>
        </div>
    `;

    createSlider(controlsContainer.querySelector('#x-slider'), 'x₁', -3, 3, 0.1, px, (v) => { px = v; updatePoint(); });
    createSlider(controlsContainer.querySelector('#y-slider'), 'x₂', -3, 3, 0.1, py, (v) => { py = v; updatePoint(); });
    createSlider(controlsContainer.querySelector('#t-slider'), 't (Height)', 0, 5, 0.1, pt, (v) => { pt = v; updatePoint(); });

    createSlider(controlsContainer.querySelector('#opacity-slider'), 'Cone Opacity', 0.1, 1, 0.1, 0.5, (v) => { cone.material.opacity = v; });

    function updatePoint() {
        // Map (x1, x2, t) -> (x, z, y) in 3D space
        // y is up (t)
        testPoint.position.set(px, pt, py);

        const norm = Math.sqrt(px*px + py*py);
        const isFeasible = norm <= pt + 1e-5; // Tolerance

        testPoint.material.color.setHex(isFeasible ? 0x10b981 : 0xef4444);
        testPoint.material.emissive.setHex(isFeasible ? 0x004400 : 0x440000);

        statusContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; font-family:monospace;">
                <span>x = [${px.toFixed(2)}, ${py.toFixed(2)}], t = ${pt.toFixed(2)}</span>
                <span>||x||₂ = ${norm.toFixed(3)} ${isFeasible ? '≤' : '>'} ${pt.toFixed(3)}</span>
                <span style="padding:2px 6px; border-radius:4px; background:${isFeasible ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color:${isFeasible ? 'var(--success)' : 'var(--error)'}; font-weight:bold;">${isFeasible ? 'FEASIBLE' : 'INFEASIBLE'}</span>
            </div>
        `;

        // Update projection line (drop to t=0 or nearest point on cone surface)
        // Visual aid: line to axis (0, t, 0)
        const pts = [];
        pts.push(new THREE.Vector3(px, pt, py));
        pts.push(new THREE.Vector3(0, pt, 0)); // Axis
        projLine.geometry.setFromPoints(pts);
    }

    // --- TAB 2: EXAMPLES ---
    tabs[1].innerHTML = `
        <div style="padding: 10px;">
            <h4 style="margin-top:0;">Common SOCP Constraints</h4>

            <div class="example-box" style="margin-bottom:12px;">
                <strong style="color:var(--primary-400);">1. Quadratic Constraints</strong><br>
                <div style="font-size:0.9em; margin-top:4px;">
                    xᵀx ≤ z  ⟺  ||[2x, z-1]||₂ ≤ z+1
                </div>
            </div>

            <div class="example-box" style="margin-bottom:12px;">
                <strong style="color:var(--primary-400);">2. Robust Linear Constraint</strong><br>
                <div style="font-size:0.9em; margin-top:4px;">
                    aᵀx ≤ b for all a ∈ E (Ellipsoid)<br>
                    ⟺  āᵀx + ||P¹/² x||₂ ≤ b
                </div>
            </div>

            <div class="example-box">
                <strong style="color:var(--primary-400);">3. Hyperbolic Constraints</strong><br>
                <div style="font-size:0.9em; margin-top:4px;">
                    xy ≥ z², x,y ≥ 0  ⟺  ||[2z, x-y]||₂ ≤ x+y
                </div>
            </div>
        </div>
    `;

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
        if (!sceneContainer.clientWidth) return;
        camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    });
    resizeObserver.observe(sceneContainer);

    // Initialize
    updatePoint();
    animate();
}
