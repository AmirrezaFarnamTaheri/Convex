/**
 * Widget: Complementary Slackness Explorer
 *
 * Description: An interactive tool that demonstrates the complementary slackness conditions for a simple LP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initComplementarySlacknessExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="comp-slack-widget">
            <div id="plot-container"></div>
            <div class="widget-output" id="cs-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#cs-output");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-1, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
import json

c = np.array([-1, -2])
A_ub = np.array([[1, 1], [-1, 1], [1, 0], [0, 1]])
b_ub = np.array([3, 1, 2, 2])

# Primal
primal_res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=(0, None))
# Dual
dual_res = linprog(b_ub, A_ub=-A_ub.T, b_ub=-c, bounds=(0, None))

primal_sol = primal_res.x
dual_sol = dual_res.x

comp_slack_primal = b_ub - A_ub @ primal_sol
comp_slack_dual = A_ub.T @ dual_sol + c

json.dumps({
    "primal_sol": primal_sol.tolist(),
    "dual_sol": dual_sol.tolist(),
    "primal_slack": comp_slack_primal.tolist(),
    "dual_slack": comp_slack_dual.tolist(),
    "A": A_ub.tolist(),
    "b": b_ub.tolist()
})
`;
    const result = await pyodide.runPythonAsync(pythonCode).then(r => JSON.parse(r));

    // Feasible Region (hardcoded for this example)
    const feasibleRegion = [[0,0], [2,0], [2,1], [1,2], [0,1]];
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasibleRegion)+"Z").attr("fill", "var(--color-primary-light)");

    // Constraints
    const constraints_lines = [
        [[2,1],[3,0]], // x+y<=3
        [[-1,0],[1,2]], // -x+y<=1
        [[2,-1],[2,4]], // x<=2
        [[-1,2],[4,2]] // y<=2
    ];
    svg.selectAll("line.constraint").data(constraints_lines).enter().append("line").attr("class", "constraint")
        .attr("x1", d=>x(d[0][0])).attr("y1", d=>y(d[0][1]))
        .attr("x2", d=>x(d[1][0])).attr("y2", d=>y(d[1][1]))
        .attr("stroke", (d,i) => Math.abs(result.primal_slack[i]) < 1e-6 ? "var(--color-danger)" : "var(--color-text-secondary)")
        .attr("stroke-width", (d,i) => Math.abs(result.primal_slack[i]) < 1e-6 ? 3 : 1);

    // Optimal point
    svg.append("circle").attr("cx", x(result.primal_sol[0])).attr("cy", y(result.primal_sol[1])).attr("r", 5).attr("fill", "var(--color-success)");

    // Output
    let outputHTML = "<h5>Primal Solution x*:</h5>" + `[${result.primal_sol.map(v=>v.toFixed(2)).join(', ')}]`
    outputHTML += "<h5>Dual Solution λ*:</h5>" + `[${result.dual_sol.map(v=>v.toFixed(2)).join(', ')}]`
    outputHTML += "<h5>Complementary Slackness Conditions:</h5><ul>"

    for(let i=0; i<result.A.length; i++) {
        const primal_slack_active = Math.abs(result.primal_slack[i]) < 1e-6;
        const dual_var_active = result.dual_sol[i] > 1e-6;

        outputHTML += `<li>Constraint ${i+1}:
            λᵢ* = ${result.dual_sol[i].toFixed(2)},
            Slack = (b-Ax)ᵢ = ${result.primal_slack[i].toFixed(2)}.
            Condition holds: ${primal_slack_active || !dual_var_active}
        </li>`;
    }
    outputHTML += "</ul><p>For each constraint, either the dual variable is zero, or the constraint is active (slack is zero), or both.</p>"

    outputDiv.innerHTML = outputHTML;
}
