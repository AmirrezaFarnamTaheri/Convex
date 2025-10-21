/**
 * Widget: Conic Problem Solver (Smallest Enclosing Circle)
 *
 * Description: A simple sandbox for solving a small conic problem (Smallest Enclosing Circle),
 *              which can be formulated as an SOCP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConicSolver(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class.conic-solver-widget">
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points. The smallest enclosing circle is updated automatically.</p>
            <button id="cs-clear-btn">Clear Points</button>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const clearBtn = container.querySelector("#cs-clear-btn");

    let points = [[-1,-1], [1,-1], [0,1]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-4, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const enclosingCircle = svg.append("circle").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("fill", "none");
    const pointsGroup = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def solve_smallest_enclosing_circle(points):
    P = np.array(points)
    c = cp.Variable(2)
    r = cp.Variable()

    constraints = [cp.norm(P[i] - c) <= r for i in range(P.shape[0])]
    prob = cp.Problem(cp.Minimize(r), constraints)
    prob.solve()

    return json.dumps({"c": c.value.tolist(), "r": r.value}) if prob.status == 'optimal' else None
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_socp = pyodide.globals.get('solve_smallest_enclosing_circle');

    svg.append("rect").attr("width", width).attr("height", height).style("fill","none").style("pointer-events","all")
        .on("click", (event) => {
            const [mx,my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            update();
        });

    async function update() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d=>x(d[0])).attr("cy", d=>y(d[1])).attr("r", 4).attr("fill", "var(--color-primary)");

        if (points.length > 0) {
            const result_json = await solve_socp(points);
            if(result_json) {
                const result = JSON.parse(result_json);
                enclosingCircle.attr("cx", x(result.c[0])).attr("cy", y(result.c[1]))
                               .attr("r", x(result.r) - x(0));
            }
        } else {
            enclosingCircle.attr("r", 0);
        }
    }

    clearBtn.addEventListener("click", () => {
        points = [];
        update();
    });

    update();
}
