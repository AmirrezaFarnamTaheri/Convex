/**
 * Widget: Rank-Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined matrix.
 *              Uses THREE.js for the 3D domain and D3.js for the 2D codomain.
 *              Demonstrates the orthogonality relationships and rank-nullity theorem.
 * Version: 3.1.0 (Styled)
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
                <div class="control-group">
                    <label>Matrix Size</label>
                    <div style="display: flex; gap: 8px;">
                        <select id="rows-select"><option value="2">2 Rows</option><option value="3">3 Rows</option></select>
                        <span style="align-self: center; color: var(--text-tertiary);">×</span>
                        <select id="cols-select"><option value="2">2 Cols</option><option value="3" selected>3 Cols</option></select>
                    </div>
                </div>
                <div class="control-group" style="flex-grow: 1;">
                    <label>Matrix Entries $A_{mn}$</label>
                    <div id="matrix-input-grid" style="display: grid; gap: 8px;"></div>
                </div>
            </div>

            <div id="visualization-area" style="display: flex; flex-wrap: wrap; height: 500px; border-bottom: 1px solid var(--border-subtle);">
                <div id="domain-space" style="flex: 1; min-width: 300px; height: 100%; position: relative; border-right: 1px solid var(--border-subtle);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                        <span style="background: var(--bg-surface-2); padding: 4px 8px; border-radius: 4px; font-size: var(--text-xs); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                            Domain $\\mathbb{R}^n$
                        </span>
                        <div style="margin-top: 4px; font-size: 0.7rem; color: var(--text-secondary);">
                            <span style="color: var(--primary-400);">■ Row Space</span> ⊥ <span style="color: var(--error);">■ Null Space</span>
                        </div>
                    </div>
                    <canvas id="domain-canvas" style="width: 100%; height: 100%; display: block; outline: none;"></canvas>
                </div>
                <div id="codomain-space" style="flex: 1; min-width: 300px; height: 100%; position: relative; background: var(--bg-surface-1);">
                    <div style="position: absolute; top: 10px; left: 10px; z-index: 5; pointer-events: none;">
                         <span style="background: var(--bg-surface-2); padding: 4px 8px; border-radius: 4px; font-size: var(--text-xs); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                            Codomain $\\mathbb{R}^m$
                        </span>
                        <div style="margin-top: 4px; font-size: 0.7rem; color: var(--text-secondary);">
                            <span style="color: var(--accent-400);">■ Col Space</span> ⊥ <span style="color: var(--warning);">■ Left Null Space</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="output-bases" class="widget-output" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: var(--bg-surface-2);"></div>
        </div>
    `;

    const rowsSelect = container.querySelector("#rows-select");
    const colsSelect = container.querySelector("#cols-select");
    const matrixInputGrid = container.querySelector("#matrix-input-grid");
    const domainContainer = container.querySelector("#domain-space");
    const codomainContainer = container.querySelector("#codomain-space");
    const outputEl = container.querySelector("#output-bases");

    let m = 2, n = 3;
    let A = [[1, 0, 0], [0, 1, 0]];

    let threeScene, d3Scene;

    function createMatrixInputs() {
        matrixInputGrid.innerHTML = '';
        matrixInputGrid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

        const newA = Array(m).fill(0).map(() => Array(n).fill(0));
        for(let i=0; i<m; i++) {
            for(let j=0; j<n; j++) {
                if (A[i] && A[i][j] !== undefined) newA[i][j] = A[i][j];
                else if (i === j) newA[i][j] = 1;
            }
        }
        A = newA;

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = A[i][j];
                input.style.width = "100%";
                input.style.textAlign = "center";
                input.style.fontFamily = "var(--font-mono)";
                input.style.background = "var(--bg-surface-3)";
                input.style.border = "1px solid var(--border-subtle)";
                input.style.color = "var(--text-primary)";
                input.style.padding = "4px";
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

        const formatDim = (dim) => {
            if (dim === 0) return "0 (Point)";
            if (dim === 1) return "1 (Line)";
            if (dim === 2) return "2 (Plane)";
            return dim;
        };

        outputEl.innerHTML = `
            <div>
                <p style="color:var(--text-tertiary); font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Rank-Nullity</p>
                <div style="font-size:0.9rem;">Rank: <strong style="color:var(--text-primary);">${results.rank}</strong></div>
                <div style="font-size:0.9rem;">Nullity: <strong style="color:var(--text-primary);">${n - results.rank}</strong></div>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">(Rank + Nullity = ${n})</div>
            </div>
            <div>
                <p style="color:var(--text-tertiary); font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Domain Subspaces</p>
                <div style="color:var(--primary-400); font-weight:600;">Row Space: ${formatDim(results.row_space.length)}</div>
                <div style="color:var(--error); font-weight:600;">Null Space: ${formatDim(results.null_space.length)}</div>
            </div>
            <div>
                <p style="color:var(--text-tertiary); font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Codomain Subspaces</p>
                <div style="color:var(--accent-400); font-weight:600;">Col Space: ${formatDim(results.col_space.length)}</div>
                <div style="color:var(--warning); font-weight:600;">Left Null Space: ${formatDim(results.left_null_space.length)}</div>
            </div>
        `;

        threeScene.update(results.row_space, results.null_space, n);
        d3Scene.update(results.col_space, results.left_null_space, m);
    }

    function setupThreeJS() {
        const canvas = domainContainer.querySelector('#domain-canvas');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a); // Match --neutral-900

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

                if (dim === 3) {
                    const grid = new THREE.GridHelper(6, 6, 0x334155, 0x1e293b);
                    subspaceGroup.add(grid);
                }

                const drawBasis = (basis, color) => {
                    if (basis.length === 0) {
                        const geom = new THREE.SphereGeometry(0.1);
                        const mat = new THREE.MeshBasicMaterial({ color });
                        subspaceGroup.add(new THREE.Mesh(geom, mat));
                        return;
                    }

                    if (basis.length === 1) {
                        const v = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0])).normalize().multiplyScalar(10);
                        const geom = new THREE.BufferGeometry().setFromPoints([v.clone().negate(), v]);
                        const mat = new THREE.LineBasicMaterial({ color, linewidth: 3 });
                        subspaceGroup.add(new THREE.Line(geom, mat));
                    }
                    else if (basis.length === 2) {
                        const v1 = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0]));
                        const v2 = new THREE.Vector3(...(dim === 2 ? [...basis[1], 0] : basis[1]));
                        const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
                        const planeGeom = new THREE.PlaneGeometry(10, 10);
                        const planeMat = new THREE.MeshPhongMaterial({
                            color, side: THREE.DoubleSide, transparent: true, opacity: 0.2, depthWrite: false
                        });
                        const plane = new THREE.Mesh(planeGeom, planeMat);
                        const defaultNormal = new THREE.Vector3(0, 0, 1);
                        plane.quaternion.setFromUnitVectors(defaultNormal, normal);
                        subspaceGroup.add(plane);
                    }
                };

                drawBasis(rowSpace, 0x60a5fa); // Primary-400
                drawBasis(nullSpace, 0xef4444); // Error
                scene.add(subspaceGroup);
            }
        };
    }

    function setupD3() {
        let svg, g, width, height, scale;

        const initSvg = () => {
            const existingSvg = codomainContainer.querySelector('.widget-svg');
            if (existingSvg) existingSvg.remove();

            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            width = codomainContainer.clientWidth - margin.left - margin.right;
            height = codomainContainer.clientHeight - margin.top - margin.bottom;

            svg = d3.select(codomainContainer).append("svg")
                .attr("class", "widget-svg")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox", `0 0 ${codomainContainer.clientWidth} ${codomainContainer.clientHeight}`);

            g = svg.append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);
            scale = d3.scaleLinear().domain([-3, 3]).range([-Math.min(width, height) / 2 + 20, Math.min(width, height) / 2 - 20]);

            // Axes
            g.append("line").attr("x1", scale(-3)).attr("x2", scale(3)).attr("y1", 0).attr("y2", 0).attr("stroke", "var(--border-default)");
            g.append("line").attr("x1", 0).attr("x2", 0).attr("y1", scale(-3)).attr("y2", scale(3)).attr("stroke", "var(--border-default)");
        };

        initSvg();
        new ResizeObserver(() => initSvg()).observe(codomainContainer);

        return {
            update: (colSpace, leftNullSpace) => {
                if (!g) initSvg();
                g.selectAll(".basis-element").remove();

                const drawBasis = (basis, color) => {
                     if (basis.length === 0) {
                         g.append("circle").attr("class", "basis-element").attr("cx", 0).attr("cy", 0).attr("r", 4).attr("fill", color);
                         return;
                     }
                     if (m === 2) {
                         if (basis.length === 1) {
                             const v = basis[0];
                             g.append("line").attr("class", "basis-element")
                                .attr("x1", scale(-v[0]*10)).attr("y1", scale(-v[1]*10))
                                .attr("x2", scale(v[0]*10)).attr("y2", scale(v[1]*10))
                                .attr("stroke", color).attr("stroke-width", 3).attr("stroke-opacity", 0.8);
                         } else if (basis.length === 2) {
                             g.append("rect").attr("class", "basis-element")
                                .attr("x", -width/2).attr("y", -height/2).attr("width", width).attr("height", height)
                                .attr("fill", color).attr("opacity", 0.15);
                         }
                     }
                };

                drawBasis(colSpace, "var(--accent-400)");
                drawBasis(leftNullSpace, "var(--warning)");
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
