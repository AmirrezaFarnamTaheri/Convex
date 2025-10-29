/**
 * Widget: SOCP Explorer
 *
 * Description: Interactive visualization of Second-Order Cone Programs (SOCP)
 *              with 3D cone visualization and problem examples
 * Version: 3.0.0 - Enhanced with modern framework
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js';
import { createModernWidget, createTabs, createSlider, createSelect, createButton, createBadge } from '/static/js/modern-components.js';

export function initSOCPExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Second-Order Cone Program Explorer');
    const tabs = createTabs(vizContainer, ['Interactive', 'Examples', 'Theory']);

    // --- TAB 1: INTERACTIVE 3D VISUALIZATION ---
    tabs[0].innerHTML = `
        <div style="display: flex; flex-direction: column; height: 500px;">
            <div id="scene-container" style="flex: 1; position: relative; background: var(--panel);"></div>
            <div id="cone-controls" style="padding: 15px; background: var(--panel-dark);"></div>
            <div id="point-status" style="padding: 10px; background: var(--panel);"></div>
        </div>
    `;

    const sceneContainer = tabs[0].querySelector('#scene-container');
    const controlsContainer = tabs[0].querySelector('#cone-controls');
    const statusContainer = tabs[0].querySelector('#point-status');

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.getPropertyValue('--color-background') || '#0b0d12';
    scene.background = new THREE.Color(bgColor.trim());

    const camera = new THREE.PerspectiveCamera(60, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(6, 6, 6);
    controls.target.set(0, 0, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // --- SECOND-ORDER CONE GEOMETRY ---
    // The second-order cone is defined as: ||x|| ≤ t where x ∈ R^n, t ∈ R
    // For n=2: sqrt(x₁² + x₂²) ≤ t  =>  cone opening upward in t-axis

    function createSOCone(height = 5, radius = 5, segments = 64) {
        const geometry = new THREE.ConeGeometry(radius, height, segments);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            wireframe: false
        });
        const cone = new THREE.Mesh(geometry, material);

        // Position cone so apex is at origin and opens upward
        cone.position.y = height / 2;
        cone.rotation.x = 0;

        return cone;
    }

    let cone = createSOCone();
    scene.add(cone);

    // Wireframe overlay
    const wireframeGeo = new THREE.ConeGeometry(5, 5, 64);
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframeCone = new THREE.Mesh(wireframeGeo, wireframeMat);
    wireframeCone.position.y = 2.5;
    scene.add(wireframeCone);

    // Test point sphere
    const pointGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const testPoint = new THREE.Mesh(pointGeometry, pointMaterial);
    scene.add(testPoint);

    // --- CONTROLS ---
    let pointX = 1, pointY = 1, pointZ = 2;

    controlsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <div id="x-slider-container"></div>
                <div id="y-slider-container"></div>
                <div id="z-slider-container"></div>
            </div>
            <div>
                <h4>Cone Parameters</h4>
                <div id="cone-type-container"></div>
                <div id="opacity-container"></div>
            </div>
        </div>
    `;

    const xSlider = createSlider(
        controlsContainer.querySelector('#x-slider-container'),
        'x₁',
        -5, 5, 0.1, pointX,
        (val) => { pointX = val; updatePoint(); }
    );

    const ySlider = createSlider(
        controlsContainer.querySelector('#y-slider-container'),
        'x₂',
        -5, 5, 0.1, pointY,
        (val) => { pointY = val; updatePoint(); }
    );

    const zSlider = createSlider(
        controlsContainer.querySelector('#z-slider-container'),
        't',
        0, 5, 0.1, pointZ,
        (val) => { pointZ = val; updatePoint(); }
    );

    const coneTypeSelect = createSelect(
        controlsContainer.querySelector('#cone-type-container'),
        'Cone Type',
        [
            { value: 'standard', label: 'Standard SO Cone' },
            { value: 'rotated', label: 'Rotated SO Cone' },
            { value: 'quadratic', label: 'Quadratic Cone' }
        ],
        'standard',
        updateConeType
    );

    const opacitySlider = createSlider(
        controlsContainer.querySelector('#opacity-container'),
        'Cone Opacity',
        0, 1, 0.05, 0.6,
        (val) => {
            cone.material.opacity = val;
            wireframeCone.material.opacity = val * 0.5;
        }
    );

    function updatePoint() {
        testPoint.position.set(pointX, pointZ, pointY);

        const norm = Math.sqrt(pointX * pointX + pointY * pointY);
        const isInCone = norm <= pointZ && pointZ >= 0;

        testPoint.material.color.setHex(isInCone ? 0x00ff00 : 0xff0000);

        const status = isInCone ?
            `${createBadge('FEASIBLE', 'success')} Point is inside the second-order cone` :
            `${createBadge('INFEASIBLE', 'danger')} Point is outside the second-order cone`;

        statusContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; justify-content: space-between;">
                <div>
                    <strong>Point:</strong> (${pointX.toFixed(2)}, ${pointY.toFixed(2)}, ${pointZ.toFixed(2)})
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>||x||:</strong> ${norm.toFixed(3)}
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Constraint:</strong> ||x|| ≤ t  ⟹  ${norm.toFixed(3)} ≤ ${pointZ.toFixed(3)}
                </div>
                <div>${status}</div>
            </div>
        `;
    }

    function updateConeType() {
        // For now, just update labels and description
        // Could add different cone visualizations in future
        const type = coneTypeSelect.getValue();
        console.log('Cone type changed to:', type);
    }

    // --- TAB 2: SOCP EXAMPLES ---
    tabs[1].innerHTML = `
        <div style="padding: 20px;">
            <h4>Example SOCP Problems</h4>
            <div id="examples-container"></div>
        </div>
    `;

    const examples = [
        {
            title: "Robust Linear Programming",
            description: "Minimize worst-case linear objective under uncertainty",
            problem: `
                <strong>Minimize:</strong> cᵀx<br>
                <strong>Subject to:</strong> ||Aᵢx - bᵢ||₂ ≤ εᵢ, i = 1,...,m<br>
                <strong>Variables:</strong> x ∈ Rⁿ
            `,
            application: "Portfolio optimization with uncertain returns",
            badge: "Finance"
        },
        {
            title: "Robust Least Squares",
            description: "Least squares with bounded noise",
            problem: `
                <strong>Minimize:</strong> ||Ax - b||₂<br>
                <strong>Subject to:</strong> ||x||₂ ≤ R<br>
                <strong>Variables:</strong> x ∈ Rⁿ
            `,
            application: "Signal processing with noise constraints",
            badge: "Signal Processing"
        },
        {
            title: "Filter Design",
            description: "Design FIR filter with frequency response constraints",
            problem: `
                <strong>Minimize:</strong> max |H(ω)|<br>
                <strong>Subject to:</strong> |H(ωᵢ) - H_desired(ωᵢ)| ≤ δᵢ<br>
                <strong>Variables:</strong> Filter coefficients h
            `,
            application: "Digital signal processing",
            badge: "DSP"
        },
        {
            title: "Antenna Array Design",
            description: "Optimal beam pattern design",
            problem: `
                <strong>Minimize:</strong> Side-lobe level<br>
                <strong>Subject to:</strong> ||B(θ)ᵀw - d(θ)||₂ ≤ ε<br>
                <strong>Variables:</strong> Antenna weights w
            `,
            application: "Wireless communications",
            badge: "Communications"
        },
        {
            title: "Stochastic Programming",
            description: "Two-stage optimization under uncertainty",
            problem: `
                <strong>Minimize:</strong> cᵀx + 𝔼[Q(x,ξ)]<br>
                <strong>Subject to:</strong> Ax ≤ b, x ≥ 0<br>
                <strong>Variables:</strong> First-stage x, second-stage y(ξ)
            `,
            application: "Supply chain optimization",
            badge: "Operations"
        },
        {
            title: "Quadratically Constrained QP",
            description: "QP with quadratic constraints reformulated as SOCP",
            problem: `
                <strong>Minimize:</strong> ½xᵀPx + qᵀx<br>
                <strong>Subject to:</strong> ||Aᵢx + bᵢ||₂ ≤ cᵢᵀx + dᵢ<br>
                <strong>Variables:</strong> x ∈ Rⁿ
            `,
            application: "Control systems, robotics",
            badge: "Control"
        }
    ];

    const examplesContainer = tabs[1].querySelector('#examples-container');
    examplesContainer.innerHTML = examples.map((ex, idx) => `
        <div class="modern-card" style="padding: 20px; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <h4 style="margin: 0;">${idx + 1}. ${ex.title}</h4>
                ${createBadge(ex.badge, 'info')}
            </div>
            <p style="color: var(--muted); margin: 10px 0;">${ex.description}</p>
            <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0; font-family: monospace; font-size: 14px;">
                ${ex.problem}
            </div>
            <div style="margin-top: 10px;">
                <strong>Application:</strong> ${ex.application}
            </div>
        </div>
    `).join('');

    // --- TAB 3: THEORY ---
    tabs[2].innerHTML = `
        <div style="padding: 20px;">
            <h3>Second-Order Cone Programming Theory</h3>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>1. Definition</h4>
                <p>A Second-Order Cone Program (SOCP) is an optimization problem of the form:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 15px 0; font-family: monospace;">
                    <strong>Minimize:</strong> fᵀx<br>
                    <strong>Subject to:</strong> ||Aᵢx + bᵢ||₂ ≤ cᵢᵀx + dᵢ, i = 1,...,m<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fx = g
                </div>
                <p>where x ∈ Rⁿ is the optimization variable.</p>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>2. The Second-Order Cone</h4>
                <p>The second-order cone (also called Lorentz cone or ice-cream cone) in R^(n+1) is defined as:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 15px 0;">
                    <strong>K^{n+1} = {(x, t) ∈ Rⁿ × R : ||x||₂ ≤ t}</strong>
                </div>
                <p>Geometrically, this is a cone in (n+1)-dimensional space where:</p>
                <ul>
                    <li>The apex is at the origin</li>
                    <li>The axis is along the t-direction</li>
                    <li>The opening angle is 45° (when using the 2-norm)</li>
                </ul>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>3. Problem Hierarchy</h4>
                <p>SOCPs generalize several important problem classes:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>LP</strong></td>
                        <td style="padding: 10px;">Linear Programs are SOCPs with ||·||₂ replaced by individual constraints</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>QP</strong></td>
                        <td style="padding: 10px;">Convex QPs can be reformulated as SOCPs</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>QCQP</strong></td>
                        <td style="padding: 10px;">Quadratically constrained QPs are naturally SOCPs</td>
                    </tr>
                </table>
                <p style="margin-top: 15px;">Hierarchy: <strong>LP ⊂ QP ⊂ QCQP ⊂ SOCP ⊂ SDP</strong></p>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>4. Why SOCPs Matter</h4>

                <h5 style="margin-top: 15px;">Computational Efficiency</h5>
                <ul>
                    <li>More expressive than LP/QP, can model wider range of problems</li>
                    <li>More efficient than SDP for problems with cone structure</li>
                    <li>Modern solvers (ECOS, MOSEK, SCS) are highly optimized</li>
                    <li>Complexity: O(n³) per iteration, typically 10-50 iterations</li>
                </ul>

                <h5 style="margin-top: 15px;">Modeling Power</h5>
                <ul>
                    <li>Can model robust optimization naturally (uncertainty sets)</li>
                    <li>Norm constraints appear frequently in engineering</li>
                    <li>Many geometric problems have natural SOCP formulations</li>
                    <li>Can approximate non-convex problems via successive SOCP</li>
                </ul>

                <h5 style="margin-top: 15px;">Applications</h5>
                <ul>
                    <li><strong>Finance:</strong> Robust portfolio optimization</li>
                    <li><strong>Signal Processing:</strong> Filter design, beamforming</li>
                    <li><strong>Control:</strong> Robust control, MPC with uncertainty</li>
                    <li><strong>Machine Learning:</strong> Robust regression, SVM variants</li>
                    <li><strong>Communications:</strong> Antenna design, power control</li>
                </ul>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>5. Conic Duality</h4>
                <p>SOCPs have a beautiful duality theory. The dual of an SOCP is also an SOCP.</p>

                <h5 style="margin-top: 15px;">Self-Dual Property</h5>
                <p>The second-order cone is self-dual: K* = K</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 15px 0;">
                    If (x, t) ∈ K, then for all (y, s) ∈ K:<br>
                    <strong>⟨x, y⟩ + ts ≥ 0</strong>
                </div>

                <h5 style="margin-top: 15px;">Strong Duality</h5>
                <p>Under Slater's condition (strict feasibility), strong duality holds:</p>
                <ul>
                    <li>Primal and dual optimal values are equal</li>
                    <li>Complementary slackness conditions apply</li>
                    <li>KKT conditions are necessary and sufficient</li>
                </ul>
            </div>

            <div class="modern-card" style="padding: 20px;">
                <h4>6. Solution Algorithms</h4>

                <h5 style="margin-top: 15px;">Interior-Point Methods</h5>
                <p>Most common approach for SOCPs:</p>
                <ul>
                    <li>Follow central path in cone</li>
                    <li>Polynomial-time complexity</li>
                    <li>Used in: MOSEK, ECOS, CVXOPT</li>
                </ul>

                <h5 style="margin-top: 15px;">First-Order Methods</h5>
                <p>For large-scale problems:</p>
                <ul>
                    <li>Alternating Direction Method of Multipliers (ADMM)</li>
                    <li>Operator splitting methods</li>
                    <li>Used in: SCS (Splitting Conic Solver)</li>
                </ul>

                <h5 style="margin-top: 15px;">Successive Approximation</h5>
                <p>For non-convex extensions:</p>
                <ul>
                    <li>Linearize/convexify constraints</li>
                    <li>Solve sequence of SOCPs</li>
                    <li>Applications: Trajectory optimization, non-convex QCQP</li>
                </ul>
            </div>
        </div>
    `;

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    new ResizeObserver(() => {
        camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    }).observe(sceneContainer);

    // Initialize
    updatePoint();
    animate();
}
