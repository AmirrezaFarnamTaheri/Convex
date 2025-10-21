/**
 * Widget: Robust Regression vs Least Squares
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scikit-learn"]);
    return pyodide;
}
const pyodidePromise = initPyodide();

export async function initRobustRegression(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await pyodidePromise;

    container.innerHTML = '';

    let points = [];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px;";
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.onclick = reset;
    controls.appendChild(clearButton);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pointsGroup = svg.append("g");
    const lsLine = svg.append("path").attr("stroke", "red").attr("stroke-width", 2).attr("fill", "none");
    const huberLine = svg.append("path").attr("stroke", "green").attr("stroke-width", 2).attr("fill", "none");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event);
            points.push({ x: x.invert(mx), y: y.invert(my) });
            drawPoints();
            updateRegressions();
        });

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "blue");
    }

    function reset() {
        points = [];
        lsLine.attr("d", null);
        huberLine.attr("d", null);
        drawPoints();
    }

    async function updateRegressions() {
        if (points.length < 2) return;

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("points_data", points);
        const code = `
from sklearn.linear_model import LinearRegression, HuberRegressor
import numpy as np

X = np.array([p['x'] for p in points_data]).reshape(-1, 1)
y = np.array([p['y'] for p in points_data])

ls = LinearRegression().fit(X, y)
ls_line_y = ls.predict(np.array([[-5], [5]]))

huber = HuberRegressor().fit(X, y)
huber_line_y = huber.predict(np.array([[-5], [5]]))

{"ls_line": ls_line_y.tolist(), "huber_line": huber_line_y.tolist()}
        `;
        const lines = await pyodide.runPythonAsync(code).then(l => l.toJs());

        const lineGenerator = d3.line()
            .x((d, i) => x(i === 0 ? -5 : 5))
            .y(d => y(d));

        lsLine.datum(lines.ls_line).attr("d", lineGenerator);
        huberLine.datum(lines.huber_line).attr("d", lineGenerator);
    }
}
