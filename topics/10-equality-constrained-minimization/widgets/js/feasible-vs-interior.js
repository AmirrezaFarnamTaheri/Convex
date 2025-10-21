/**
 * Widget: Feasible vs. Interior-Point Method Paths
 *
 * Description: Compares the paths taken by a feasible descent method (Projected GD) and an interior-point method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initFeasibleVsInterior(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="fvi-widget">
            <div class="widget-controls">
                <button id="run-fvi-btn">Run Comparison</button>
                <div class="legend">
                    <span style="color:var(--color-primary);">―</span> Projected GD
                    <span style="color:var(--color-accent); margin-left: 10px;">―</span> Interior-Point
                </div>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-fvi-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-1, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Objective: min (x-2)^2 + (y-2)^2
    const center = [2,2];
    const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0,2*Math.PI+0.1,0.1).map(a => [center[0]+r*Math.cos(a), center[1]+r*Math.sin(a)]));
    svg.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)");

    // Feasible set: x+y <= 1, x>=0, y>=0
    const feasible_poly = [[0,0], [1,0], [0,1]];
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasible_poly)+"Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

# Objective: min (x-2)^2 + (y-2)^2, Grad: [2(x-2), 2(y-2)]
# Feasible: x+y<=1, x>=0, y>=0

def project(p):
    # Project onto feasible set (simplified for this specific set)
    p = np.maximum(0, p)
    if np.sum(p) > 1:
        p = np.array([ (p[0]-p[1]+1)/2, (p[1]-p[0]+1)/2 ])
    return p

def run_projected_gd():
    path = [np.array([0.1, 0.1])]
    for _ in range(20):
        p = path[-1]
        grad = np.array([2*(p[0]-2), 2*(p[1]-2)])
        p_next = project(p - 0.1 * grad)
        path.append(p_next)
        if np.linalg.norm(p_next-p) < 1e-3: break
    return np.array(path).tolist()

def run_interior_point():
    # Barrier method: min (x-2)^2+(y-2)^2 - (1/t)*log(1-x-y) - (1/t)*log(x) - (1/t)*log(y)
    path = []
    p = np.array([0.2, 0.2])
    for t in np.logspace(0, 3, 20):
        # 10 steps of GD for each t
        for _ in range(10):
            grad_barrier_x = -1/(1-p[0]-p[1]) * -1  - 1/p[0]
            grad_barrier_y = -1/(1-p[0]-p[1]) * -1  - 1/p[1]
            grad = np.array([2*(p[0]-2), 2*(p[1]-2)]) - (1/t) * np.array([grad_barrier_x, grad_barrier_y])
            p -= 0.01 * grad
            path.append(p.copy())
    return np.array(path).tolist()

`;
    await pyodide.runPythonAsync(pythonCode);
    const run_projected_gd = pyodide.globals.get('run_projected_gd');
    const run_interior_point = pyodide.globals.get('run_interior_point');

    async function run() {
        runBtn.disabled = true;
        svg.selectAll(".path").remove();

        const pgd_path_data = await run_projected_gd().then(r => r.toJs());
        const ip_path_data = await run_interior_point().then(r => r.toJs());

        const animate = (pathEl, data, color) => {
            pathEl.datum(data).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
                .attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.5);
            const len = pathEl.node().getTotalLength();
            pathEl.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
                .transition().duration(2000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
        };

        animate(svg.append("path").attr("class", "path"), pgd_path_data, "var(--color-primary)");
        animate(svg.append("path").attr("class", "path"), ip_path_data, "var(--color-accent)");

        setTimeout(() => runBtn.disabled = false, 2000);
    }

    runBtn.addEventListener("click", run);
    run();
}
