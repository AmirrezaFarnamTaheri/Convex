/**
 * Widget: Rank-Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined matrix.
 *              Uses THREE.js for the 3D domain and D3.js for the 2D codomain.
 * Version: 2.0.0
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js";
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
            <div class="widget-controls">
                <h4>Matrix A (m x n)</h4>
                <div class="matrix-controls">
                    <label for="rows-select">Rows (m):</label>
                    <select id="rows-select"><option value="2">2</option><option value="3">3</option></select>
                    <label for="cols-select">Cols (n):</label>
                    <select id="cols-select"><option value="2">2</option><option value="3" selected>3</option></select>
                </div>
                <div id="matrix-input-grid"></div>
            </div>
            <div id="visualization-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
                <div id="domain-space" style="flex: 1; min-width: 250px; height: 300px; position: relative;"><canvas id="domain-canvas"></canvas></div>
                <div id="codomain-space" style="flex: 1; min-width: 250px; height: 300px;"></div>
            </div>
            <div id="output-bases" class="widget-output" style="margin-top: 15px;"></div>
        </div>
    `;

    const rowsSelect = container.querySelector("#rows-select");
    const colsSelect = container.querySelector("#cols-select");
    const matrixInputGrid = container.querySelector("#matrix-input-grid");
    const domainContainer = container.querySelector("#domain-space");
    const codomainContainer = container.querySelector("#codomain-space");
    const outputEl = container.querySelector("#output-bases");

    let m = 2, n = 3;
    let A = [[1, 2, 0], [0, 1, 1]];
    let three, d3vis;

    function createMatrixInputs() {
        matrixInputGrid.innerHTML = '';
        matrixInputGrid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        A = Array(m).fill(0).map(() => Array(n).fill(0));
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.value = (i < 2 && j < 3) ? [[1, 2, 0], [0, 1, 1]][i][j] : 0;
                A[i][j] = parseFloat(input.value);
                input.oninput = () => {
                    A[i][j] = parseFloat(input.value);
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

            def to_list(basis): return basis.T.tolist() if basis.shape[1] > 0 else []

            json.dumps({
                "rank": rank,
                "col_space": to_list(orth(A)),
                "row_space": to_list(orth(A.T)),
                "null_space": to_list(null_space(A)),
                "left_null_space": to_list(null_space(A.T))
            })
        `);
        const results = JSON.parse(result_json);

        outputEl.innerHTML = `
            <p><strong>Rank:</strong> ${results.rank}</p>
            <p><strong>Row Space (in ℝ<sup>${n}</sup>):</strong> dim=${results.row_space.length}</p>
            <p><strong>Null Space (in ℝ<sup>${n}</sup>):</strong> dim=${results.null_space.length}</p>
            <p><strong>Col Space (in ℝ<sup>${m}</sup>):</strong> dim=${results.col_space.length}</p>
            <p><strong>Left Null Space (in ℝ<sup>${m}</sup>):</strong> dim=${results.left_null_space.length}</p>
        `;

        three.update(results.row_space, results.null_space, n);
        d3vis.update(results.col_space, results.left_null_space, m);
    }

    function setupThreeJS() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0d12);
        const camera = new THREE.PerspectiveCamera(50, domainContainer.clientWidth / domainContainer.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: domainContainer.querySelector('#domain-canvas'), antialias: true });
        renderer.setSize(domainContainer.clientWidth, domainContainer.clientHeight);
        camera.position.set(3, 3, 5);
        camera.lookAt(0, 0, 0);

        const controls = { update: () => {} }; // Placeholder if OrbitControls fails
        try {
            const { OrbitControls } = new Function('return import("https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js")')();
            const orbitControls = new OrbitControls(camera, renderer.domElement);
            Object.assign(controls, orbitControls);
        } catch (e) { console.error("Failed to load OrbitControls"); }

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        let currentBases = new THREE.Group();
        scene.add(currentBases);

        new ResizeObserver(() => {
            camera.aspect = domainContainer.clientWidth / domainContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(domainContainer.clientWidth, domainContainer.clientHeight);
        }).observe(domainContainer);

        return {
            update: (rowSpace, nullSpace, dim) => {
                scene.remove(currentBases);
                currentBases = new THREE.Group();
                scene.add(new THREE.AxesHelper(2.5));

                const drawBasis = (basis, color) => {
                    if (basis.length === 0) return;
                    if (basis.length === 1) { // Line
                        const v = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0])).normalize();
                        currentBases.add(new THREE.ArrowHelper(v, new THREE.Vector3(0,0,0), 2, color));
                    } else { // Plane
                        const v1 = new THREE.Vector3(...(dim === 2 ? [...basis[0], 0] : basis[0]));
                        const v2 = new THREE.Vector3(...(dim === 2 ? [...basis[1], 0] : basis[1]));
                        const planeGeom = new THREE.PlaneGeometry(4, 4);
                        const planeMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
                        const plane = new THREE.Mesh(planeGeom, planeMat);
                        plane.lookAt(new THREE.Vector3().crossVectors(v1, v2).normalize());
                        currentBases.add(plane);
                    }
                };

                drawBasis(rowSpace, 0x7cc5ff); // --color-primary
                drawBasis(nullSpace, 0xff6b6b); // a red color
                scene.add(currentBases);
            }
        };
    }

    function setupD3() {
        let svg;
        const setupChart = () => {
            codomainContainer.innerHTML = '';
            const margin = { top: 30, right: 20, bottom: 30, left: 30 };
            const width = codomainContainer.clientWidth - margin.left - margin.right;
            const height = codomainContainer.clientHeight - margin.top - margin.bottom;
            svg = d3.select(codomainContainer).append("svg")
                .attr("width", "100%").attr("height", "100%")
                .attr("viewBox", `0 0 ${codomainContainer.clientWidth} ${codomainContainer.clientHeight}`)
                .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);
            return { width, height };
        };

        return {
            update: (colSpace, leftNullSpace, dim) => {
                const { width, height } = setupChart();
                svg.append("text").text(`Codomain (ℝ\u00B2)`).attr("x", 0).attr("y", -height/2 - 5).attr("text-anchor", "middle");

                const scale = d3.scaleLinear().domain([-2, 2]).range([-Math.min(width, height) / 2, Math.min(width, height) / 2]);
                svg.append("g").call(d3.axisBottom(scale).ticks(3));
                svg.append("g").call(d3.axisLeft(scale).ticks(3));

                const drawBasis = (basis, color) => {
                     if (basis.length === 0) return;
                     if (basis.length === 1) { // Line
                         const v = basis[0];
                         svg.append("line").attr("x1", scale(-v[0]*2)).attr("y1", scale(-v[1]*2))
                           .attr("x2", scale(v[0]*2)).attr("y2", scale(v[1]*2))
                           .attr("stroke", color).attr("stroke-width", 2.5);
                     } else { // Plane (the whole space)
                         svg.append("rect").attr("x", -width/2).attr("y", -height/2).attr("width", width).attr("height", height)
                            .attr("fill", color).attr("opacity", 0.3);
                     }
                };

                drawBasis(colSpace, "var(--color-accent)");
                drawBasis(leftNullSpace, "#ffb080"); // an orange color
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
