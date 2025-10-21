/**
 * Widget: Eigenvalues and Positive Semi-Definiteness (PSD)
 *
 * Description: Visualizes the connection between the eigenvalues of a 2x2 symmetric matrix,
 *              the shape of its quadratic form, and its classification (e.g., positive definite).
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initEigenPsd(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="eigen-psd-widget">
            <div class="widget-controls" style="margin-bottom: 20px;">
                <h4>Symmetric Matrix A = [[a, b], [b, c]]</h4>
                <div id="sliders" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"></div>
            </div>
            <div id="matrix-output" class="widget-output" style="margin-bottom: 15px;"></div>
            <div id="visualization-container" style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div id="quadratic-form-plot" style="flex: 1; min-width: 250px; height: 300px;"></div>
                <div id="transformation-plot" style="flex: 1; min-width: 250px; height: 300px;"></div>
            </div>
        </div>
    `;

    const slidersContainer = container.querySelector("#sliders");
    const matrixOutput = container.querySelector("#matrix-output");
    const quadPlotContainer = container.querySelector("#quadratic-form-plot");
    const transPlotContainer = container.querySelector("#transformation-plot");

    // --- UI CONTROLS ---
    let A = { a: 1.5, b: 0.5, c: 1.0 };
    const createSlider = (id, label, min, max, step) => {
        const div = document.createElement('div');
        div.innerHTML = `<label for="${id}-slider">${label}: <span id="${id}-value">${A[id]}</span></label>
                         <input type="range" id="${id}-slider" min="${min}" max="${max}" step="${step}" value="${A[id]}">`;
        slidersContainer.appendChild(div);
        const slider = div.querySelector('input');
        const valueSpan = div.querySelector('span');
        slider.oninput = () => {
            A[id] = parseFloat(slider.value);
            valueSpan.textContent = A[id].toFixed(2);
            update();
        };
    };
    createSlider('a', 'a', -2, 2, 0.1);
    createSlider('b', 'b', -2, 2, 0.1);
    createSlider('c', 'c', -2, 2, 0.1);

    // --- PYODIDE SETUP ---
    const pythonUpdate = pyodide.runPython(`
        import numpy as np
        def update_matrix(a, b, c):
            A = np.array([[a, b], [b, c]])
            eigvals, eigvecs = np.linalg.eigh(A)
            sort_indices = np.argsort(eigvals)[::-1]
            eigvals = eigvals[sort_indices]
            eigvecs = eigvecs[:, sort_indices]

            x = np.linspace(-1, 1, 30)
            y = np.linspace(-1, 1, 30)
            X, Y = np.meshgrid(x, y)
            Z = a*X**2 + 2*b*X*Y + c*Y**2

            return {
                "eigvals": eigvals.tolist(),
                "eigvecs": eigvecs.T.tolist(),
                "contours": Z.tolist()
            }
        update_matrix
    `);

    // --- D3 VISUALIZATIONS ---
    let quadPlot, transPlot;

    function setupPlots() {
        quadPlot = setupContourPlot(quadPlotContainer);
        transPlot = setupTransformationPlot(transPlotContainer);
        new ResizeObserver(() => {
            quadPlot.destroy();
            quadPlot = setupContourPlot(quadPlotContainer);
            transPlot.destroy();
            transPlot = setupTransformationPlot(transPlotContainer);
            update();
        }).observe(container);
    }

    function setupContourPlot(div) {
        const margin = { top: 30, right: 10, bottom: 30, left: 10 };
        const width = div.clientWidth - margin.left - margin.right;
        const height = div.clientHeight - margin.top - margin.bottom;
        const svg = d3.select(div).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${div.clientWidth} ${div.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text").text("Quadratic Form: x\u1D40Ax").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle");
        const x = d3.scaleLinear([-1, 1], [0, width]);
        const y = d3.scaleLinear([-1, 1], [height, 0]);

        return {
            update: (contours, eigvecs) => {
                svg.selectAll('.contour, .eigenvector').remove();
                const contour = d3.contourDensity().x(d=>x(d.x)).y(d=>y(d.y)).size([width, height]).bandwidth(15);

                // We need to flatten the contour data for d3
                const flatData = [];
                contours.forEach((row, i) => {
                    row.forEach((val, j) => {
                       flatData.push({x: j/29*2-1, y: i/29*2-1, val: val});
                    });
                });

                // Generate thresholds based on data range
                const thresholds = d3.scaleSequential(d3.interpolateTurbo)
                    .domain(d3.extent(flatData, d => d.val));

                svg.insert("g", "g")
                    .selectAll("path")
                    .data(d3.contours().size([30, 30]).thresholds(10)(contours.flat()))
                    .join("path")
                        .attr("class", "contour")
                        .attr("d", d3.geoPath(d3.geoTransform({point: function(x, y) { this.stream.point(x * width/29, y * height/29); }})))
                        .attr("fill", d => thresholds(d.value))
                        .attr("stroke", "#fff").attr("stroke-width", 0.2);

                svg.selectAll(".eigenvector")
                    .data(eigvecs).enter().append("line")
                    .attr("class", "eigenvector")
                    .attr("x1", x(0)).attr("y1", y(0))
                    .attr("x2", d => x(d[0])).attr("y2", y(d[1]))
                    .attr("stroke", (d,i) => i === 0 ? "var(--color-accent)" : "#ff6b6b")
                    .attr("stroke-width", 3);
            },
            destroy: () => d3.select(div).select('svg').remove()
        };
    }

    function setupTransformationPlot(div) {
        const margin = { top: 30, right: 10, bottom: 30, left: 10 };
        const width = div.clientWidth - margin.left - margin.right;
        const height = div.clientHeight - margin.top - margin.bottom;
        const svg = d3.select(div).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${div.clientWidth} ${div.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);

        svg.append("text").text("Linear Transformation: Ax").attr("x", 0).attr("y", -height/2 - 5).attr("text-anchor", "middle");
        const scale = d3.scaleLinear([-2.5, 2.5], [-Math.min(width, height)/2, Math.min(width, height)/2]);

        svg.append("circle").attr("r", scale(1)-scale(0)).attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("stroke-dasharray", "4 4");
        svg.append("path").attr("class", "transformed-circle").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)");

        return {
            update: (eigvals, eigvecs) => {
                const points = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(angle => {
                    const x = Math.cos(angle);
                    const y = Math.sin(angle);
                    const tx = A.a * x + A.b * y;
                    const ty = A.b * x + A.c * y;
                    return [scale(tx), -scale(ty)];
                });
                svg.select(".transformed-circle").attr("d", d3.line()(points));

                svg.selectAll(".eigenvector-axis").remove();
                svg.selectAll(".eigenvector-axis").data(eigvecs).enter().append("line")
                    .attr("class", "eigenvector-axis")
                    .attr("x1", 0).attr("y1", 0)
                    .attr("x2", (d,i) => scale(d[0] * eigvals[i]))
                    .attr("y2", (d,i) => -scale(d[1] * eigvals[i]))
                    .attr("stroke", (d,i) => i === 0 ? "var(--color-accent)" : "#ff6b6b")
                    .attr("stroke-width", 2.5);
            },
            destroy: () => d3.select(div).select('svg').remove()
        };
    }

    async function update() {
        const result = pythonUpdate(A.a, A.b, A.c);
        const { eigvals, eigvecs, contours } = result.toJs({create_proxies: false});

        let classification = "Indefinite";
        const tol = 1e-9;
        if (eigvals[0] >= -tol && eigvals[1] >= -tol) classification = "Positive Semidefinite";
        if (eigvals[0] > tol && eigvals[1] > tol) classification = "Positive Definite";
        if (eigvals[0] < -tol && eigvals[1] < -tol) classification = "Negative Definite";

        matrixOutput.innerHTML = `
            <strong>Matrix A:</strong> [[${A.a.toFixed(2)}, ${A.b.toFixed(2)}], [${A.b.toFixed(2)}, ${A.c.toFixed(2)}]]<br>
            <strong>Eigenvalues:</strong> &lambda;₁=${eigvals[0].toFixed(2)}, &lambda;₂=${eigvals[1].toFixed(2)}<br>
            <strong>Classification:</strong> <span style="color: var(--color-primary);">${classification}</span>
        `;

        quadPlot.update(contours, eigvecs);
        transPlot.update(eigvals, eigvecs);
    }

    setupPlots();
    update();
}
