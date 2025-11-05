/**
 * Widget: Ellipsoid Explorer
 *
 * Description: Interactively explore the geometry of an ellipsoid defined by
 *              the quadratic form xᵀ P⁻¹ x ≤ 1, controlled by matrix P.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initEllipsoidExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide & NumPy...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    container.innerHTML = `
        <div class="ellipsoid-explorer-widget">
            <div id="plot-area" class="plot-area"></div>
            <div class="controls-area">
                <h4>Matrix P (Positive Definite)</h4>
                <div class="matrix-controls" id="matrix-controls"></div>
                <div id="matrix-output" class="output-box"></div>
            </div>
        </div>
    `;

    const plotArea = container.querySelector("#plot-area");
    const matrixControls = container.querySelector("#matrix-controls");
    const matrixOutput = container.querySelector("#matrix-output");

    let svg, x, y;
    let P = { p11: 2, p12: 1, p22: 3 };

    const controls = [
        { key: 'p11', label: 'P₁₁', min: 0.1, max: 5, value: 2 },
        { key: 'p12', label: 'P₁₂', min: -3, max: 3, value: 1 },
        { key: 'p22', label: 'P₂₂', min: 0.1, max: 5, value: 3 }
    ];

    controls.forEach(({ key, label, min, max, value }) => {
        const div = document.createElement('div');
        div.className = 'control-group';
        div.innerHTML = `
            <label>${label} = <span id="val-${key}">${value.toFixed(1)}</span></label>
            <input type="range" id="slider-${key}" min="${min}" max="${max}" step="0.1" value="${value}" class="styled-slider">
        `;
        matrixControls.appendChild(div);
        div.querySelector('input').addEventListener('input', (e) => {
            P[key] = parseFloat(e.target.value);
            div.querySelector('span').textContent = P[key].toFixed(1);
            update();
        });
    });

    const pythonUpdate = pyodide.runPython(`
        import numpy as np
        def analyze_matrix(p11, p12, p22):
            P = np.array([[p11, p12], [p12, p22]])
            try:
                eigvals, eigvecs = np.linalg.eigh(P)
                # Ensure positive definite for this visualization
                if np.any(eigvals <= 1e-6):
                    return None
                return {
                    "eigvals": eigvals.tolist(),
                    "eigvecs": eigvecs.T.tolist(),
                }
            except np.linalg.LinAlgError:
                return None
    `);

    function setupChart() {
        plotArea.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotArea.clientWidth - margin.left - margin.right;
        const height = plotArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotArea.clientWidth} ${plotArea.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

        const domain = 4;
        x = d3.scaleLinear().domain([-domain, domain]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height / 2, -height / 2]);

        const grid = svg.append("g").attr("class", "grid");
        grid.selectAll(".grid-line-x").data(x.ticks(10)).enter().append("line").attr("class","grid-line-x").attr("x1",d=>x(d)).attr("x2",d=>x(d)).attr("y1",-height/2).attr("y2",height/2);
        grid.selectAll(".grid-line-y").data(y.ticks(10)).enter().append("line").attr("class","grid-line-y").attr("x1",-width/2).attr("x2",width/2).attr("y1",d=>y(d)).attr("y2",d=>y(d));
        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${y(0)})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").attr("transform", `translate(${x(0)}, 0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("g").attr("class", "axes-group");
        svg.append("path").attr("class", "ellipsoid-path");
    }

    function update() {
        const { p11, p12, p22 } = P;
        const result = pythonUpdate(p11, p12, p22)?.toJs({ create_proxies: false });

        if (!result) {
            matrixOutput.innerHTML = `<div class="error-text">Matrix P is not positive definite. Ellipsoid is undefined.</div>`;
            svg.select(".ellipsoid-path").attr("d", null);
            svg.select(".axes-group").selectAll("*").remove();
            return;
        }

        const { eigvals, eigvecs } = result;
        const angle = Math.atan2(eigvecs[0][1], eigvecs[0][0]);
        const len1 = 1 / Math.sqrt(eigvals[0]);
        const len2 = 1 / Math.sqrt(eigvals[1]);

        const ellipsePoints = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(a => {
            const ex = len1 * Math.cos(a);
            const ey = len2 * Math.sin(a);
            const rx = ex * Math.cos(angle) - ey * Math.sin(angle);
            const ry = ex * Math.sin(angle) + ey * Math.cos(angle);
            return { x: rx, y: ry };
        });

        svg.select(".ellipsoid-path").datum(ellipsePoints).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

        const axesGroup = svg.select(".axes-group");
        axesGroup.selectAll("*").remove();
        axesGroup.append("line").attr("class", "axis-1").attr("x1",x(0)).attr("y1",y(0)).attr("x2",x(len1*eigvecs[0][0])).attr("y2",y(len1*eigvecs[0][1]));
        axesGroup.append("line").attr("class", "axis-2").attr("x1",x(0)).attr("y1",y(0)).attr("x2",x(len2*eigvecs[1][0])).attr("y2",y(len2*eigvecs[1][1]));

        matrixOutput.innerHTML = `
            <div><strong>Matrix P:</strong> <code>[[${p11.toFixed(2)}, ${p12.toFixed(2)}], [${p12.toFixed(2)}, ${p22.toFixed(2)}]]</code></div>
            <div><strong>Eigenvalues (λ):</strong> <code>[${eigvals[0].toFixed(2)}, ${eigvals[1].toFixed(2)}]</code></div>
            <div><strong>Axis Lengths (1/√λ):</strong> <code>[${len1.toFixed(2)}, ${len2.toFixed(2)}]</code></div>
        `;
    }

    new ResizeObserver(setupChart).observe(plotArea);
    setupChart();
    update();
}

const style = document.createElement('style');
style.textContent = `
.ellipsoid-explorer-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex-grow: 1; position: relative; }
.controls-area { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); background: var(--color-surface-1); }
.matrix-controls .control-group { display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
.output-box .error-text { color: var(--color-error); font-weight: bold; }
/* D3 styles */
.grid line { stroke: var(--color-surface-2); }
.ellipsoid-path { fill: var(--color-primary); fill-opacity: 0.3; stroke: var(--color-primary); stroke-width: 2; }
.axis-1, .axis-2 { stroke-width: 2.5; }
.axis-1 { stroke: var(--color-accent); }
.axis-2 { stroke: var(--color-accent-secondary); }
`;
document.head.appendChild(style);
