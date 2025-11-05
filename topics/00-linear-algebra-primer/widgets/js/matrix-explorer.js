/**
 * Widget: Matrix Explorer
 *
 * Description: An interactive explorer for 2x2 matrices. It visualizes the linear transformation
 *              Ax and the quadratic form xᵀAx, and details the matrix's properties.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initMatrixExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide & NumPy...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    container.innerHTML = `
        <div class="matrix-explorer-widget">
            <div class="controls-area">
                <div class="matrix-input-container">
                    <h4>Matrix A</h4>
                    <div class="matrix-grid-style" id="matrix-inputs"></div>
                </div>
                <div class="matrix-output-container" id="matrix-output"></div>
            </div>
            <div class="visualization-area">
                <div id="transformation-plot" class="plot-container"></div>
                <div id="quadratic-form-plot" class="plot-container"></div>
            </div>
        </div>
    `;

    const matrixInputsContainer = container.querySelector("#matrix-inputs");
    const matrixOutput = container.querySelector("#matrix-output");
    let A = { a: 1, b: 0.5, c: 0.5, d: 1 };
    let probeVector = { x: 1, y: 0.75 };

    const sliders = [
        { key: 'a', label: 'a', value: 1 }, { key: 'b', label: 'b', value: 0.5 },
        { key: 'c', label: 'c', value: 0.5 }, { key: 'd', label: 'd', value: 1 }
    ];

    sliders.forEach(({ key, label, value }) => {
        const div = document.createElement('div');
        div.className = 'matrix-cell';
        div.innerHTML = `
            <label for="slider-${key}">${label}</label>
            <input type="range" id="slider-${key}" value="${value}" min="-2" max="2" step="0.1" class="styled-slider">
            <span id="val-${key}">${value.toFixed(1)}</span>
        `;
        matrixInputsContainer.appendChild(div);
        div.querySelector('input').addEventListener('input', (e) => {
            A[key] = parseFloat(e.target.value);
            div.querySelector('span').textContent = A[key].toFixed(1);
            update();
        });
    });

    const pythonUpdate = pyodide.runPython(`
        import numpy as np
        def analyze_matrix(a, b, c, d):
            A = np.array([[a, b], [c, d]])
            det = np.linalg.det(A)
            trace = np.trace(A)
            eigvals, eigvecs = np.linalg.eig(A)

            S = (A + A.T) / 2
            s_eigvals, s_eigvecs = np.linalg.eigh(S)

            tol = 1e-9
            if np.all(s_eigvals > tol): classification = "Positive Definite"
            elif np.all(s_eigvals >= -tol): classification = "Positive Semidefinite"
            elif np.all(s_eigvals < -tol): classification = "Negative Definite"
            elif np.all(s_eigvals <= tol): classification = "Negative Semidefinite"
            else: classification = "Indefinite"

            return {
                "det": det, "trace": trace,
                "eigvals": eigvals.tolist(), "eigvecs": eigvecs.T.tolist(),
                "s_eigvals": s_eigvals.tolist(), "s_eigvecs": s_eigvecs.T.tolist(),
                "classification": classification
            }
        analyze_matrix
    `);

    let transPlot, quadPlot;
    const setupPlots = () => {
        transPlot = createPlot("#transformation-plot", "Linear Transformation (y = Ax)");
        quadPlot = createPlot("#quadratic-form-plot", "Quadratic Form (z = xᵀSx)");
        update();
    };

    const createPlot = (selector, title) => {
        const div = container.querySelector(selector);
        div.innerHTML = '';
        const margin = { top: 30, right: 15, bottom: 30, left: 30 };
        const width = div.clientWidth - margin.left - margin.right;
        const height = div.clientHeight - margin.top - margin.bottom;
        const svg = d3.select(div).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${div.clientWidth} ${div.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text").attr("class", "plot-title").attr("x", width/2).attr("y", -10).text(title);
        const scale = 3;
        const x = d3.scaleLinear([-scale, scale], [0, width]);
        const y = d3.scaleLinear([-scale, scale], [height, 0]);
        svg.append("g").attr("class", "grid").call(d3.axisBottom(x).ticks(5).tickSize(-height));
        svg.append("g").attr("class", "grid").call(d3.axisLeft(y).ticks(5).tickSize(-width));
        return { svg, x, y, width, height };
    };

    const drag = d3.drag().on("drag", (event) => {
        probeVector.x = transPlot.x.invert(event.x);
        probeVector.y = transPlot.y.invert(event.y);
        update();
    });

    const updateTransformationPlot = (eigvecs) => {
        const { svg, x, y } = transPlot;
        svg.selectAll(".dynamic-content").remove();

        const transformedGrid = svg.append("g").attr("class", "dynamic-content transformed-grid");
        d3.range(-3, 4).forEach(i => {
            const pathH = d3.range(-3, 3.1, 0.2).map(j => [A.a*j+A.b*i, A.c*j+A.d*i]);
            const pathV = d3.range(-3, 3.1, 0.2).map(j => [A.a*i+A.b*j, A.c*i+A.d*j]);
            transformedGrid.append("path").datum(pathH).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
            transformedGrid.append("path").datum(pathV).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
        });

        const vectors = svg.append("g").attr("class", "dynamic-content");
        const transformedProbe = {x: A.a*probeVector.x + A.b*probeVector.y, y: A.c*probeVector.x + A.d*probeVector.y};
        vectors.append("line").attr("class", "vector-probe").attr("x1", x(0)).attr("y1", y(0)).attr("x2", x(probeVector.x)).attr("y2", y(probeVector.y));
        vectors.append("line").attr("class", "vector-transformed").attr("x1", x(0)).attr("y1", y(0)).attr("x2", x(transformedProbe.x)).attr("y2", y(transformedProbe.y));
        vectors.append("circle").attr("class", "handle").attr("cx", x(probeVector.x)).attr("cy", y(probeVector.y)).attr("r", 6).call(drag);
    };

    const updateQuadraticPlot = (s_eigvals, s_eigvecs) => {
        const { svg, x, y, width, height } = quadPlot;
        svg.selectAll(".dynamic-content").remove();
        const S = { a: (A.a + A.a)/2, b: (A.b + A.c)/2, c: (A.c + A.b)/2, d: (A.d + A.d)/2 };

        const n = 80, m = 80;
        const values = new Array(n * m);
        for (let j = 0; j < m; ++j) {
            for (let i = 0; i < n; ++i) {
                const u = x.invert(i * width / (n-1));
                const v = y.invert(j * height / (m-1));
                values[j * n + i] = S.a*u*u + (S.b+S.c)*u*v + S.d*v*v;
            }
        }

        const contours = d3.contours().size([n, m]).thresholds(d3.range(-5, 6, 1))(values);
        const color = d3.scaleSequential(d3.interpolateSpectral).domain([-5, 5]);

        svg.append("g").attr("class", "dynamic-content")
            .selectAll("path")
            .data(contours)
            .join("path")
            .attr("d", d3.geoPath(d3.geoTransform({point: function(x_c, y_c) { this.stream.point(x_c * width / (n-1), y_c * height / (m-1)); }})))
            .attr("stroke", d => color(d.value)).attr("stroke-width", (d,i) => (d.value === 0 ? 2 : 1)).attr("fill", "none");

        const eigenvecs = svg.append("g").attr("class", "dynamic-content");
        s_eigvecs.forEach((v, i) => {
            eigenvecs.append("line").attr("class", "eigenvector").attr("x1", x(0)).attr("y1", y(0))
                .attr("x2", x(v[0] * s_eigvals[i])).attr("y2", y(v[1] * s_eigvals[i]));
        });
    };

    const update = () => {
        const { a, b, c, d } = A;
        const result = pythonUpdate(a, b, c, d).toJs({ create_proxies: false });
        matrixOutput.innerHTML = `
            <div><strong>Determinant:</strong> <code>${result.det.toFixed(2)}</code></div>
            <div><strong>Trace:</strong> <code>${result.trace.toFixed(2)}</code></div>
            <div><strong>Eigenvalues (A):</strong> <code>${result.eigvals.map(v => v.toFixed(2)).join(', ')}</code></div>
            <div><strong>Quadratic Form:</strong> <span class="classification-label">${result.classification}</span></div>
        `;
        updateTransformationPlot(result.eigvecs);
        updateQuadraticPlot(result.s_eigvals, result.s_eigvecs);
    };

    new ResizeObserver(setupPlots).observe(container);
    setupPlots();
}

const style = document.createElement('style');
style.textContent = `
.matrix-explorer-widget { display: flex; flex-direction: column; gap: 1rem; }
.controls-area { display: flex; flex-wrap: wrap; gap: 1.5rem; background: var(--color-surface-1); padding: 1rem; border-radius: var(--border-radius-sm); }
.matrix-input-container { flex: 1.5; min-width: 220px; }
.matrix-grid-style { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.matrix-cell { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.5rem; }
.matrix-output-container { flex: 2; min-width: 250px; font-size: 0.9rem; }
.matrix-output-container div { margin-bottom: 0.5rem; }
.matrix-output-container code { background: var(--color-background); padding: 0.2em 0.4em; border-radius: 4px; }
.classification-label { font-weight: bold; color: var(--color-primary); }
.visualization-area { display: flex; flex-wrap: wrap; gap: 1rem; }
.plot-container { flex: 1; min-width: 280px; height: 350px; }
.plot-title { text-anchor: middle; fill: var(--color-text-main); font-weight: bold; }
.grid .domain { display: none; }
.grid line { stroke: var(--color-surface-2); }
.transformed-grid path { fill: none; stroke: var(--color-surface-3); stroke-opacity: 0.8; }
.vector-probe { stroke: var(--color-primary-light); stroke-width: 2.5; }
.vector-transformed { stroke: var(--color-accent); stroke-width: 2.5; }
.eigenvector { stroke: var(--color-accent-secondary); stroke-width: 2; stroke-dasharray: 4 2; }
.handle { fill: var(--color-primary-light); cursor: grab; }
`;
document.head.appendChild(style);
