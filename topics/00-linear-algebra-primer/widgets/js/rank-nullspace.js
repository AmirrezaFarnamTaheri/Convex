/**
 * Widget: Rank-Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined matrix.
 *              Uses THREE.js for the 3D domain and D3.js for the 2D codomain.
 *              Demonstrates the orthogonality relationships and rank-nullity theorem.
 * Version: 3.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initRankNullspace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Initial loading state
    container.innerHTML = `
        <div class="widget-container" style="height: 600px;">
            <div class="widget-loading">
                <div class="widget-loading-spinner"></div>
                <div>Initializing Python environment...</div>
            </div>
        </div>
    `;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");

    // Render main UI
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group">
                    <label class="widget-label">Matrix Dimensions</label>
                    <div style="display: flex; gap: 8px;">
                        <select id="rows-select" class="widget-select"><option value="2">2 Rows</option><option value="3">3 Rows</option></select>
                        <span style="align-self: center; color: var(--color-text-muted);">x</span>
                        <select id="cols-select" class="widget-select"><option value="2">2 Cols</option><option value="3" selected>3 Cols</option></select>
                    </div>
                </div>
                <div class="widget-control-group" style="flex-grow: 1;">
                    <label class="widget-label">Matrix Entries A (m x n)</label>
                    <div id="matrix-input-grid" style="display: grid; gap: 8px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="display: flex; flex-wrap: wrap; height: 500px; border-bottom: 1px solid var(--color-border);">
                <div id="domain-space" style="flex: 1; min-width: 300px; height: 100%; position: relative; border-right: 1px solid var(--color-border);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                        <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                            Domain (Input Space) ℝ<sup>n</sup>
                        </span>
                        <div style="margin-top: 4px; font-size: 0.75rem; color: var(--color-text-muted);">
                            <span style="color: var(--color-primary);">■ Row Space</span> ⊥ <span style="color: var(--color-error);">■ Null Space</span>
                        </div>
                    </div>
                    <canvas id="domain-canvas" style="width: 100%; height: 100%; display: block; outline: none;"></canvas>
                </div>
                <div id="codomain-space" style="flex: 1; min-width: 300px; height: 100%; position: relative; background: var(--surface-1);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                         <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                            Codomain (Output Space) ℝ<sup>m</sup>
                        </span>
                        <div style="margin-top: 4px; font-size: 0.75rem; color: var(--color-text-muted);">
                            <span style="color: var(--color-accent);">■ Col Space</span> ⊥ <span style="color: #fbbf24;">■ Left Null Space</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="output-bases" class="widget-output" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: var(--surface-2);"></div>
        </div>
    `;

    const rowsSelect = container.querySelector("#rows-select");
    const colsSelect = container.querySelector("#cols-select");
    const matrixInputGrid = container.querySelector("#matrix-input-grid");
    const domainContainer = container.querySelector("#domain-space");
    const codomainContainer = container.querySelector("#codomain-space");
    const outputEl = container.querySelector("#output-bases");

    let m = 2, n = 3;
    // Default full rank matrix
    let A = [[1, 0, 0], [0, 1, 0]];

    let threeScene, d3Scene;

    function createMatrixInputs() {
        matrixInputGrid.innerHTML = '';
        matrixInputGrid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

        // Resize A if needed or preserve values
        const newA = Array(m).fill(0).map(() => Array(n).fill(0));
        for(let i=0; i<m; i++) {
            for(let j=0; j<n; j++) {
                if (A[i] && A[i][j] !== undefined) newA[i][j] = A[i][j];
                // Default identity-like structure if expanding
                else if (i === j) newA[i][j] = 1;
            }
        }
        A = newA;

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = A[i][j];
                input.className = "widget-input";
                input.style.width = "100%";
                input.style.textAlign = "center";
                input.style.fontFamily = "var(--font-mono)";
                input.onchange = () => {
                    A[i][j] = parseFloat(input.value) || 0;
                    updateVisualization();
                };
                matrixInputGrid.appendChild(input);
            }
        }
    }

    async function updateVisualization() {
        await pyodide.globals.set("matrix_A", A);
        const result_json = await pyodide.runPythonAsync(`
            import numpy as np
            from scipy.linalg import null_space, orth
            import json

            A = np.array(matrix_A)
            rank = np.linalg.matrix_rank(A)

            def to_list(basis):
                if basis.size == 0: return []
                return basis.T.tolist()

            json.dumps({
                "rank": int(rank),
                "col_space": to_list(orth(A)),
                "row_space": to_list(orth(A.T)),
                "null_space": to_list(null_space(A)),
                "left_null_space": to_list(null_space(A.T))
            })
        `);
        const results = JSON.parse(result_json);

        const formatDim = (dim, spaceName) => {
            if (dim === 0) return "0 (Point)";
            if (dim === 1) return "1 (Line)";
            if (dim === 2) return "2 (Plane)";
            return dim;
        };

        outputEl.innerHTML = `
            <div>
                <p style="color: var(--color-text-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Fundamental Dimensions</p>
                <div style="font-size: 0.9rem;">Rank: <strong style="color: var(--color-text-main);">${results.rank}</strong></div>
                <div style="font-size: 0.9rem;">Nullity: <strong style="color: var(--color-text-main);">${n - results.rank}</strong></div>
                <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px;">(Rank + Nullity = ${n})</div>
            </div>
            <div>
                <p style="color: var(--color-text-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Domain Subspaces</p>
                <div style="color: var(--color-primary); font-weight: 600;">Row Space: Dim ${formatDim(results.row_space.length)}</div>
                <div style="color: var(--color-error); font-weight: 600;">Null Space: Dim ${formatDim(results.null_space.length)}</div>
            </div>
            <div>
                <p style="color: var(--color-text-muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Codomain Subspaces</p>
                <div style="color: var(--color-accent); font-weight: 600;">Col Space: Dim ${formatDim(results.col_space.length)}</div>
                <div style="color: #fbbf24; font-weight: 600;">Left Null Space: Dim ${formatDim(results.left_null_space.length)}</div>
            </div>
        `;

        threeScene.update(results.row_space, results.null_space, n);
        d3Scene.update(results.col_space, results.left_null_space, m);
    }

    function setupThreeJS() {
        const canvas = domainContainer.querySelector('#domain-canvas');
        const scene = new THREE.Scene();
        // Update background color to match --surface-1 #14161f
        scene.background = new THREE.Color(0x14161f);

        const camera = new THREE.PerspectiveCamera(45, domainContainer.clientWidth / domainContainer.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(domainContainer.clientWidth, domainContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        camera.position.set(4, 3, 5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        const axesHelper = new THREE.AxesHelper(3);
        scene.add(axesHelper);

        let subspaceGroup = new THREE.Group();
        scene.add(subspaceGroup);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        new ResizeObserver(() => {
            const w = domainContainer.clientWidth;
            const h = domainContainer.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }).observe(domainContainer);

        return {
            update: (rowSpace, nullSpace, dim) => {
                scene.remove(subspaceGroup);
                subspaceGroup = new THREE.Group();

                // Draw grid if 3D
                if (dim === 3) {
                    const grid = new THREE.GridHelper(6, 6, 0x333333, 0x222222);
                    subspaceGroup.add(grid);
                }

                const drawBasis = (basis, color) => {
                    if (basis.length === 0) {
                        // Draw origin point
                        const geom = new THREE.SphereGeometry(0.1);
                        const mat = new THREE.MeshBasicMaterial({ color });
                        subspaceGroup.add(new THREE.Mesh(geom, mat));
                        return;
                    }

                    if (basis.length === 1) {
                        // Line
                        const v = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0])).normalize().multiplyScalar(10);
                        const geom = new THREE.BufferGeometry().setFromPoints([v.clone().negate(), v]);
                        const mat = new THREE.LineBasicMaterial({ color, linewidth: 3 });
                        subspaceGroup.add(new THREE.Line(geom, mat));
                    }
                    else if (basis.length === 2) {
                        // Plane
                        const v1 = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0]));
                        const v2 = new THREE.Vector3(...(dim === 2 ? [...basis[1], 0] : basis[1]));
                        const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

                        // Use a large plane geometry
                        const planeGeom = new THREE.PlaneGeometry(10, 10);
                        const planeMat = new THREE.MeshPhongMaterial({
                            color,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.2,
                            depthWrite: false
                        });
                        const plane = new THREE.Mesh(planeGeom, planeMat);

                        // Rotate plane to align with normal
                        // Default plane normal is (0,0,1). We want to rotate it to 'normal'
                        const defaultNormal = new THREE.Vector3(0, 0, 1);
                        plane.quaternion.setFromUnitVectors(defaultNormal, normal);

                        subspaceGroup.add(plane);

                        // Also draw basis vectors? Optional.
                    }
                    // If dim=3 and rank=3, it's whole space, maybe just fill faintly?
                };

                // Row Space (Primary Blue)
                drawBasis(rowSpace, 0x7cc5ff);
                // Null Space (Error Red)
                drawBasis(nullSpace, 0xff6b6b);

                scene.add(subspaceGroup);
            }
        };
    }

    function setupD3() {
        let svg, g;
        let width, height;
        let scale;

        const initSvg = () => {
            codomainContainer.innerHTML = '';
            // Re-add header
            codomainContainer.innerHTML = `
                <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                     <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);">
                        Codomain (Output Space) ℝ<sup>m</sup>
                    </span>
                    <div style="margin-top: 4px; font-size: 0.75rem; color: var(--color-text-muted);">
                        <span style="color: var(--color-accent);">■ Col Space</span> ⊥ <span style="color: #fbbf24;">■ Left Null Space</span>
                    </div>
                </div>
            `;

            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            width = codomainContainer.clientWidth - margin.left - margin.right;
            height = codomainContainer.clientHeight - margin.top - margin.bottom;

            svg = d3.select(codomainContainer).append("svg")
                .attr("class", "widget-svg")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox", `0 0 ${codomainContainer.clientWidth} ${codomainContainer.clientHeight}`);

            g = svg.append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);

            scale = d3.scaleLinear().domain([-3, 3]).range([-Math.min(width, height) / 2 + 20, Math.min(width, height) / 2 - 20]);

            // Grid
            g.append("g").attr("class", "grid-line").call(d3.axisBottom(scale).ticks(5).tickSize(-height).tickFormat(""));
            g.append("g").attr("class", "grid-line").call(d3.axisLeft(scale).ticks(5).tickSize(-width).tickFormat(""));

            // Axes
            g.append("g").attr("class", "axis").call(d3.axisBottom(scale).ticks(0));
            g.append("g").attr("class", "axis").call(d3.axisLeft(scale).ticks(0));
        };

        initSvg();

        new ResizeObserver(() => {
            // We rely on updateVisualization being called or state preservation.
            // For now simple init.
            initSvg();
        }).observe(codomainContainer);

        return {
            update: (colSpace, leftNullSpace, dim) => {
                if (!g) initSvg();
                g.selectAll(".basis-element").remove();

                const drawBasis = (basis, color) => {
                     if (basis.length === 0) {
                         g.append("circle").attr("class", "basis-element").attr("cx", 0).attr("cy", 0).attr("r", 6).attr("fill", color).attr("stroke", "#fff").attr("stroke-width", 1);
                         return;
                     }

                     if (m === 3) {
                         // Simple isometric projection for 3D codomain in 2D SVG
                         const project = (v) => [v[0] - v[2]*0.5, v[1] - v[2]*0.5]; // simple dimetric
                         // Actually let's just use 2 components for simplicity or a better projection

                         if (basis.length === 1) {
                             const v = project(basis[0]);
                             g.append("line")
                                .attr("class", "basis-element")
                                .attr("x1", scale(-v[0]*3)).attr("y1", scale(-v[1]*3))
                                .attr("x2", scale(v[0]*3)).attr("y2", scale(v[1]*3))
                                .attr("stroke", color).attr("stroke-width", 4);
                         }
                         // Drawing plane in 2D projection is harder without 3D engine.
                         // Since we have THREE.js on left, maybe we should use THREE for right too if m=3.
                         // But the request was for D3 on right. We'll stick to basics.
                     } else {
                         // 2D
                         if (basis.length === 1) {
                             const v = basis[0];
                             g.append("line")
                                .attr("class", "basis-element")
                                .attr("x1", scale(-v[0]*10)).attr("y1", scale(-v[1]*10))
                                .attr("x2", scale(v[0]*10)).attr("y2", scale(v[1]*10))
                                .attr("stroke", color).attr("stroke-width", 4).attr("stroke-opacity", 0.8);
                         } else if (basis.length === 2) {
                             // Whole plane
                             g.append("rect")
                                .attr("class", "basis-element")
                                .attr("x", -width/2).attr("y", -height/2).attr("width", width).attr("height", height)
                                .attr("fill", color).attr("opacity", 0.2);
                         }
                     }
                };

                drawBasis(colSpace, "var(--color-accent)");
                drawBasis(leftNullSpace, "#fbbf24");
            }
        };
    }

    rowsSelect.onchange = colsSelect.onchange = () => {
        m = parseInt(rowsSelect.value);
        n = parseInt(colsSelect.value);
        createMatrixInputs();
        updateVisualization();
    };

    createMatrixInputs();
    threeScene = setupThreeJS();
    d3Scene = setupD3();
    updateVisualization();
}
