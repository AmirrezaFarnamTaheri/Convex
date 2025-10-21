/**
 * Widget: MVEE Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "cvxpy"]);
    return pyodide;
}
const pyodidePromise = initPyodide();

export async function initMVEEVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await pyodidePromise;

    container.innerHTML = '';

    let points = [];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px;";
    const solveButton = document.createElement("button");
    solveButton.textContent = "Find MVEE";
    solveButton.onclick = solveMVEE;
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.onclick = reset;
    controls.append(solveButton, clearButton);
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

    const ellipsoidPath = svg.append("ellipse").attr("fill", "lightblue").attr("stroke", "black").style("opacity", 0.5);
    const pointsGroup = svg.append("g");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event);
            points.push([x.invert(mx), y.invert(my)]);
            drawPoints();
        });

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1]))
            .attr("r", 5).attr("fill", "blue");
    }

    function reset() {
        points = [];
        ellipsoidPath.attr("rx", 0).attr("ry", 0);
        drawPoints();
    }

    async function solveMVEE() {
        if (points.length < 2) return;

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("P_val", points);
        const code = `
import cvxpy as cp
import numpy as np

P = np.array(P_val).T
n, m = P.shape

A = cp.Variable((n, n), symmetric=True)
c = cp.Variable(n)

constraints = [cp.SOC(cp.Constant(1), A @ P[:, i] - c) for i in range(m)]
prob = cp.Problem(cp.Minimize(-cp.log_det(A)), constraints)
prob.solve(solver=cp.SCS)

A_val = A.value
c_val = c.value

eigvals, eigvecs = np.linalg.eigh(np.linalg.inv(A_val))
radii = np.sqrt(eigvals)
angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))

{"c": c_val.tolist(), "radii": radii.tolist(), "angle": angle}
        `;

        try {
            const ellipseData = await pyodide.runPythonAsync(code).then(e => e.toJs());

            ellipsoidPath
                .attr("cx", x(ellipseData.c[0]))
                .attr("cy", y(ellipseData.c[1]))
                .attr("rx", (x(ellipseData.radii[0]) - x(0)))
                .attr("ry", (y(0) - y(ellipseData.radii[1])))
                .attr("transform", `rotate(${ellipseData.angle}, ${x(ellipseData.c[0])}, ${y(ellipseData.c[1])})`);

        } catch (e) {
            console.error("MVEE calculation failed:", e);
        }
    }
}
