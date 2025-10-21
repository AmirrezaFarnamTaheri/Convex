/**
 * Widget: LP Path Comparison: Simplex vs. Interior-Point
 *
 * Description: A side-by-side comparison of the path taken by the Simplex algorithm (along the exterior)
 *              and an interior-point method (through the interior).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSimplexVsIPM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="svi-widget">
            <div class="widget-controls">
                <button id="run-svi-btn">Animate Paths</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-svi-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Feasible region & Objective contours
    const feasible_poly = [[0,0], [3.5,0], [2,3], [0,3]];
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasible_poly)+"Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);
    const contours = d3.range(1, 7, 1).map(c => [[c,0], [0,c]]);
    svg.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)").attr("stroke-dasharray", "3,3");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
import json

c = np.array([-1, -1])
A_ub = np.array([[1, 2], [2, 1]])
b_ub = np.array([8, 7])

def get_paths():
    simplex_path = []
    ip_path = []

    linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=(0,None), method='highs-ds', callback=lambda res: simplex_path.append(res.x.tolist()))
    linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=(0,None), method='highs-ipm', callback=lambda res: ip_path.append(res.x.tolist()))

    # Manually add start point for IP
    ip_path.insert(0, [1,1])

    return json.dumps({"simplex": simplex_path, "ip": ip_path})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_paths = pyodide.globals.get('get_paths');

    async function run() {
        runBtn.disabled = true;
        svg.selectAll(".path").remove();

        const paths = await get_paths().then(r => JSON.parse(r));

        const animate = (pathEl, data, color) => {
            pathEl.datum(data).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
                .attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.5);
            const len = pathEl.node().getTotalLength();
            pathEl.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
                .transition().duration(2000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
        };

        animate(svg.append("path").attr("class", "path"), paths.simplex, "var(--color-primary)");
        animate(svg.append("path").attr("class", "path"), paths.ip, "var(--color-accent)");

        setTimeout(() => runBtn.disabled = false, 2000);
    }

    runBtn.addEventListener("click", run);
    run();
}
