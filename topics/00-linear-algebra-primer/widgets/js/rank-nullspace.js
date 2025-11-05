/**
 * Widget: Rank-Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined matrix.
 *              Uses THREE.js for the 3D domain and D3.js for the 2D codomain.
 * Version: 2.1.0 (Refined)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/renderers/CSS2DRenderer.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initRankNullspace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide and SciPy...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");

    container.innerHTML = `
        <div class="rank-nullspace-widget">
            <div class="controls-area">
                <h4>Matrix A (m x n)</h4>
                <div class="matrix-config">
                    <label>Rows (m): <select id="rows-select" class="widget-select"><option value="2">2</option><option value="3">3</option></select></label>
                    <label>Cols (n): <select id="cols-select" class="widget-select"><option value="2">2</option><option value="3" selected>3</option></select></label>
                </div>
                <div id="matrix-input-grid" class="matrix-grid"></div>
            </div>
            <div class="visualization-area">
                <div id="domain-space" class="space-container">
                    <div class="space-title">Domain (Input Space ℝ<sup>n</sup>)</div>
                    <div id="domain-canvas-container"></div>
                </div>
                <div id="codomain-space" class="space-container">
                    <div class="space-title">Codomain (Output Space ℝ<sup>m</sup>)</div>
                </div>
            </div>
            <div id="output-bases" class="output-area"></div>
        </div>
    `;

    const rowsSelect = container.querySelector("#rows-select");
    const colsSelect = container.querySelector("#cols-select");
    const matrixInputGrid = container.querySelector("#matrix-input-grid");
    const domainContainer = container.querySelector("#domain-space");
    const domainCanvasContainer = container.querySelector("#domain-canvas-container");
    const codomainContainer = container.querySelector("#codomain-space");
    const outputEl = container.querySelector("#output-bases");

    let m = 2, n = 3;
    let A = [[1, 2, 0], [0, 1, 1]];
    let three, d3vis;

    function createMatrixInputs() {
        matrixInputGrid.innerHTML = '';
        matrixInputGrid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        A = Array(m).fill(null).map(() => Array(n).fill(0));
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.className = "matrix-input";
                input.value = (i === 0 && j === 0) ? 1 : (i === 0 && j === 1) ? 2 : (i === 1 && j === 1) ? 1 : (i === 1 && j === 2) ? 1: 0;
                if (i < A.length && j < A[i].length) A[i][j] = parseFloat(input.value);

                input.oninput = () => {
                    if (i < A.length && j < A[i].length) A[i][j] = parseFloat(input.value) || 0;
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
            m, n = A.shape
            rank = np.linalg.matrix_rank(A)

            def to_list(basis): return np.round(basis.T, 2).tolist() if basis.shape[1] > 0 else []

            row_space_basis = to_list(orth(A.T))
            null_space_basis = to_list(null_space(A))
            col_space_basis = to_list(orth(A))
            left_null_space_basis = to_list(null_space(A.T))

            json.dumps({
                "m": m,
                "n": n,
                "rank": rank,
                "col_space": col_space_basis,
                "row_space": row_space_basis,
                "null_space": null_space_basis,
                "left_null_space": left_null_space_basis,
            })
        `);
        const results = JSON.parse(result_json);

        const formatBasis = (b) => b.length > 0 ? `Basis: <code>${JSON.stringify(b)}</code>` : 'Basis: { }';

        outputEl.innerHTML = `
            <h4>Rank-Nullity Theorem: rank(A) + dim(N(A)) = ${results.rank} + ${results.null_space.length} = ${results.rank + results.null_space.length} (n=${n})</h4>
            <div class="subspace-info"><strong>Row Space (in ℝ<sup>${n}</sup>):</strong> dim=${results.row_space.length}. ${formatBasis(results.row_space)}</div>
            <div class="subspace-info"><strong>Null Space (in ℝ<sup>${n}</sup>):</strong> dim=${results.null_space.length}. ${formatBasis(results.null_space)}</div>
            <div class="subspace-info"><strong>Col Space (in ℝ<sup>${m}</sup>):</strong> dim=${results.col_space.length}. ${formatBasis(results.col_space)}</div>
            <div class="subspace-info"><strong>Left Null Space (in ℝ<sup>${m}</sup>):</strong> dim=${results.left_null_space.length}. ${formatBasis(results.left_null_space)}</div>
        `;

        three.update(results.row_space, results.null_space, n);
        d3vis.update(results.col_space, results.left_null_space, m);
    }

    function setupThreeJS() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("var(--color-background)");
        const camera = new THREE.PerspectiveCamera(50, domainCanvasContainer.clientWidth / domainCanvasContainer.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(domainCanvasContainer.clientWidth, domainCanvasContainer.clientHeight);
        domainCanvasContainer.appendChild(renderer.domElement);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(domainCanvasContainer.clientWidth, domainCanvasContainer.clientHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        domainCanvasContainer.appendChild(labelRenderer.domElement);

        camera.position.set(3, 3, 5);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 20;

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);

        scene.add(new THREE.GridHelper(10, 10, "var(--color-border)", "var(--color-border)"));

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
        };
        animate();

        let currentBases = new THREE.Group();
        scene.add(currentBases);

        new ResizeObserver(() => {
            const { clientWidth, clientHeight } = domainCanvasContainer;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
            labelRenderer.setSize(clientWidth, clientHeight);
        }).observe(domainCanvasContainer);

        return {
            update: (rowSpace, nullSpace, dim) => {
                scene.remove(currentBases);
                currentBases = new THREE.Group();

                const axesHelper = new THREE.AxesHelper(2.5);
                currentBases.add(axesHelper);

                const createLabel = (text, position) => {
                    const div = document.createElement('div');
                    div.className = 'space-label-3d';
                    div.textContent = text;
                    const label = new CSS2DObject(div);
                    label.position.copy(position);
                    return label;
                };

                const drawBasis = (basis, color, name) => {
                    if (basis.length === 0) return;

                    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

                    if (basis.length === 1) { // Line
                        const v = new THREE.Vector3(...(dim < 3 ? [...basis[0], 0] : basis[0])).normalize();
                        currentBases.add(new THREE.ArrowHelper(v, new THREE.Vector3(0,0,0), 3, color, 0.2, 0.1));
                        const label = createLabel(name, v.multiplyScalar(1.5));
                        currentBases.add(label);
                    } else if (basis.length === 2) { // Plane
                        const v1 = new THREE.Vector3(...(dim < 3 ? [...basis[0], 0] : basis[0]));
                        const v2 = new THREE.Vector3(...(dim < 3 ? [...basis[1], 0] : basis[1]));
                        const planeGeom = new THREE.PlaneGeometry(5, 5);
                        const plane = new THREE.Mesh(planeGeom, mat);
                        plane.lookAt(new THREE.Vector3().crossVectors(v1, v2).normalize());
                        currentBases.add(plane);
                        const labelPos = v1.clone().add(v2).multiplyScalar(0.7);
                        const label = createLabel(name, labelPos);
                        currentBases.add(label);
                    }
                };

                drawBasis(rowSpace, "var(--color-primary)", "Row Space");
                drawBasis(nullSpace, "var(--color-error)", "Null Space");
                scene.add(currentBases);
            }
        };
    }

    function setupD3() {
        let svg;
        const setupChart = () => {
            codomainContainer.querySelector('svg')?.remove();
            const margin = { top: 10, right: 10, bottom: 20, left: 20 };
            const width = codomainContainer.clientWidth - margin.left - margin.right;
            const height = codomainContainer.clientHeight - margin.top - margin.right - 20; // 20 for title
            svg = d3.select(codomainContainer).append("svg")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox", `0 0 ${codomainContainer.clientWidth} ${codomainContainer.clientHeight}`)
                .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);
            return { width, height };
        };

        return {
            update: (colSpace, leftNullSpace, dim) => {
                const { width, height } = setupChart();
                const container = d3.select(codomainContainer.querySelector("svg"));
                container.select(".space-title-d3").remove();

                const domain = 2;
                const scale = d3.scaleLinear().domain([-domain, domain]).range([-Math.min(width, height) / 2, Math.min(width, height) / 2]);
                svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${scale(0)})`).call(d3.axisBottom(scale).ticks(3));
                svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${scale(0)}, 0)`).call(d3.axisLeft(scale).ticks(3));

                const drawBasis = (basis, color, name) => {
                     if (basis.length === 0) return;
                     if (basis.length === 1) { // Line
                         const v = basis[0];
                         svg.append("line").attr("x1", scale(-v[0]*domain)).attr("y1", scale(v[1]*domain))
                           .attr("x2", scale(v[0]*domain)).attr("y2", scale(-v[1]*domain))
                           .attr("stroke", color).attr("stroke-width", 3);
                         svg.append("text").attr("x", scale(v[0])).attr("y", scale(-v[1]-0.1)).text(name).attr("fill", color).attr("class", "space-label-2d");
                     } else if (dim > 1) { // Plane (the whole space)
                         svg.insert("rect", ":first-child").attr("x", -width/2).attr("y", -height/2).attr("width", width).attr("height", height)
                            .attr("fill", color).attr("opacity", 0.2);
                         svg.append("text").attr("x", 0).attr("y", 0).text(name).attr("fill", color).attr("class", "space-label-2d").attr("text-anchor", "middle");
                     }
                };

                drawBasis(colSpace, "var(--color-accent)", "Col Space");
                drawBasis(leftNullSpace, "var(--color-accent-secondary)", "Left Null Space");
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
    three = setupThreeJS();
    d3vis = setupD3();
    updateVisualization();
}

const style = document.createElement('style');
style.textContent = `
.rank-nullspace-widget { display: flex; flex-direction: column; gap: 1rem; }
.controls-area { display: flex; flex-direction: column; gap: 0.75rem; background: var(--color-surface-1); padding: 1rem; border-radius: var(--border-radius-sm); }
.matrix-config { display: flex; gap: 1rem; align-items: center; }
.matrix-grid { display: grid; gap: 0.5rem; }
.matrix-input { width: 100%; background: var(--color-background); border: 1px solid var(--color-border); color: var(--color-text-main); border-radius: 4px; padding: 0.5rem; text-align: center; }
.visualization-area { display: flex; flex-wrap: wrap; gap: 1rem; }
.space-container { flex: 1; min-width: 280px; height: 350px; display: flex; flex-direction: column; background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); overflow: hidden; }
.space-title { padding: 0.5rem; text-align: center; font-weight: bold; background: var(--color-surface-2); border-bottom: 1px solid var(--color-border); }
#domain-canvas-container { flex-grow: 1; position: relative; }
#codomain-space svg .axis path, #codomain-space svg .axis line { stroke: var(--color-border); }
#codomain-space svg .axis text { fill: var(--color-text-muted); }
.space-label-3d { color: white; background: rgba(0,0,0,0.6); padding: 2px 5px; border-radius: 3px; font-size: 12px; }
.space-label-2d { font-size: 14px; font-weight: bold; text-anchor: middle; }
.output-area { background: var(--color-surface-1); padding: 1rem; border-radius: var(--border-radius-sm); font-size: 0.9rem; }
.output-area h4 { margin-top: 0; color: var(--color-primary); }
.subspace-info { margin-top: 0.5rem; }
.subspace-info code { background: var(--color-background); padding: 2px 5px; border-radius: 3px; }
`;
document.head.appendChild(style);
