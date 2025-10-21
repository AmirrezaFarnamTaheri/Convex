/**
 * Widget: Barrier Method Path Tracer
 *
 * Description: Traces the central path as the barrier parameter `t` is increased,
 *              showing how the solutions approach the true optimum.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initBarrierPathTracer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="barrier-tracer-widget">
            <div class="widget-controls">
                <label>Barrier Param (t): <span id="t-val-display">1.0</span></label>
                <input type="range" id="t-slider" min="-1" max="3" step="0.1" value="0">
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Adjust 't' to see how the minimizer of the barrier objective approaches the true LP solution.</p>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider");
    const tValDisplay = container.querySelector("#t-val-display");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-0.1, 1.1]).range([0, width]);
    const y = d3.scaleLinear().domain([-0.1, 1.1]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Feasible region: 0 <= x,y <= 1
    svg.append("rect").attr("x", x(0)).attr("y", y(1)).attr("width", x(1)-x(0)).attr("height", y(0)-y(1))
        .attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import minimize
import json

c = np.array([-1.0, -2.0]) # Objective: max x + 2y
# Constraints: x<=1, y<=1, x>=0, y>=0
A = np.array([[-1,0], [0,-1], [1,0], [0,1]])
b = np.array([0,0,1,1])

def barrier_objective(x, t):
    if np.any(b - A @ x <= 1e-6): return np.inf
    return t * (c @ x) - np.sum(np.log(b - A @ x))

def get_central_path():
    path = []
    for t_exp in np.linspace(-1, 3, 50):
        t = 10**t_exp
        res = minimize(lambda x: barrier_objective(x, t), np.array([0.5, 0.5]), method='Nelder-Mead')
        if res.success:
            path.append(res.x.tolist())
    return json.dumps(path)
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_central_path = pyodide.globals.get('get_central_path');
    const path_data = await get_central_path().then(r => JSON.parse(r));

    svg.append("path").datum(path_data)
        .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
        .attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");

    const solutionPoint = svg.append("circle").attr("r", 5).attr("fill", "var(--color-accent)");

    async function update() {
        const t = 10**(+tSlider.value);
        tValDisplay.textContent = t.toExponential(1);

        // Find current point on path by interpolation
        const t_vals = d3.range(-1, 3, 4/50).map(v => 10**v);
        const bisect = d3.bisector(d => d).left;
        const idx = bisect(t_vals, t);
        const pt = path_data[idx] || path_data[path_data.length-1];

        solutionPoint.attr("cx", x(pt[0])).attr("cy", y(pt[1]));
    }

    tSlider.addEventListener("input", update);
    update();
}
