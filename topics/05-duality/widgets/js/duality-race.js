/**
 * Widget: Duality Gap Convergence Animator
 *
 * Description: Animates the convergence of the primal and dual objectives for an LP, showing the duality gap shrinking.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initDualityRace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="duality-race-widget">
            <div class="widget-controls">
                <button id="run-duality-race-btn">Run Primal-Dual Simplex</button>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="duality-gap-text"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-duality-race-btn");
    const plotContainer = container.querySelector("#plot-container");
    const gapText = container.querySelector("#duality-gap-text");

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");

    const primalPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
    const dualPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
import json

def run_simplex_path(c, A_ub, b_ub):
    primal_path, dual_path = [], []

    def primal_callback(res):
        primal_path.append(np.dot(c, res.x))

    # Primal: min cᵀx s.t. Ax <= b, x >= 0
    linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=(0,None), callback=primal_callback, method='highs-ds')

    # Dual: max -bᵀy s.t. -Aᵀy <= c, y >= 0
    # Or: min bᵀy s.t. Aᵀy >= -c, y >= 0
    def dual_callback(res):
        # We need to flip the objective back because scipy minimizes
        dual_path.append(np.dot(b_ub, res.x))

    linprog(b_ub, A_ub=-np.array(A_ub).T, b_ub=-np.array(c), bounds=(0,None), callback=dual_callback, method='highs-ds')

    return json.dumps({"primal": primal_path, "dual": dual_path})
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_simplex_path = pyodide.globals.get('run_simplex_path');

    async function runAnimation() {
        runBtn.disabled = true;
        gapText.textContent = "Running...";

        const c = [-1, -2];
        const A = [[1,1], [-1,1], [1,-1]];
        const b = [4, 2, 2];

        const data = await run_simplex_path(c, A, b).then(r => JSON.parse(r));
        const n_iter = Math.max(data.primal.length, data.dual.length);

        x.domain([0, n_iter - 1]);
        const all_vals = data.primal.concat(data.dual);
        y.domain(d3.extent(all_vals)).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const line = (path_data) => d3.line()
            .x((d, i) => x(i))
            .y(d => y(d))
            (path_data);

        animatePath(primalPath, data.primal, "Primal Objective");
        animatePath(dualPath, data.dual, "Dual Objective");

        setTimeout(() => {
            runBtn.disabled = false;
            const gap = data.primal[data.primal.length-1] - data.dual[data.dual.length-1];
            gapText.textContent = `Final Duality Gap: ${Math.abs(gap).toFixed(4)}`;
        }, 2000);
    }

    function animatePath(pathElement, data, label) {
        pathElement.datum(data).attr("d", line(data));
        const totalLength = pathElement.node().getTotalLength();
        pathElement
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(2000).ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    runBtn.addEventListener("click", runAnimation);
}
