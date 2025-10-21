/**
 * Widget: Null-Space Method Visualizer
 *
 * Description: Visualizes how the null-space method works for a simple equality-constrained QP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initNullSpaceVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="null-space-widget">
            <div class="widget-controls">
                <p><strong>Problem:</strong> min ½xᵀPx s.t. Ax=b</p>
                <div>A = [<input type="number" step="0.1" value="1">, <input type="number" step="0.1" value="2">]</div>
                <div>b = [<input type="number" step="0.1" value="2">]</div>
                <button id="ns-solve-btn">Solve</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const solveBtn = container.querySelector("#ns-solve-btn");
    const plotContainer = container.querySelector("#plot-container");
    const A_inputs = container.querySelectorAll(".widget-controls input").slice(0, 2);
    const b_input = container.querySelector(".widget-controls input[type='number']:last-of-type");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-3, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    await pyodide.loadPackage(["scipy"]);
    const pythonCode = `
import numpy as np
from scipy.linalg import null_space
import json

def solve_null_space(P, q, A, b):
    # Find a particular solution x_p
    x_p = np.linalg.lstsq(A, b, rcond=None)[0]

    # Find null space basis F
    F = null_space(A)

    if F.shape[1] == 0: # No null space, x_p is the only solution
        return json.dumps({"x_p": x_p.tolist(), "F": [], "x_star": x_p.tolist()})

    # Solve the reduced problem for z
    P_hat = F.T @ P @ F
    q_hat = F.T @ P @ x_p + F.T @ q
    z_star = -np.linalg.inv(P_hat) @ q_hat

    x_star = x_p + F @ z_star

    return json.dumps({
        "x_p": x_p.tolist(),
        "F": F.T.tolist()[0], # Assuming 1D null space
        "z_star": z_star.tolist()[0],
        "x_star": x_star.tolist()
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_null_space = pyodide.globals.get('solve_null_space');

    async function update() {
        const P = [[1,0],[0,1]];
        const q = [0,0];
        const A = [[+A_inputs[0].value, +A_inputs[1].value]];
        const b = [+b_input.value];

        const sol = await solve_null_space(P, q, A, b).then(r => JSON.parse(r));

        svg.selectAll("*").remove();
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Contours of objective
        const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0,2*Math.PI,0.1).map(a => [r*Math.cos(a), r*Math.sin(a)]));
        svg.append("g").selectAll("path").data(contours).join("path")
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)");

        // Constraint line
        const [a1, a2] = A[0];
        const b1 = b[0];
        const p1 = [-3, (b1 - a1*(-3))/a2];
        const p2 = [3, (b1 - a1*3)/a2];
        svg.append("line").attr("x1",x(p1[0])).attr("y1",y(p1[1])).attr("x2",x(p2[0])).attr("y2",y(p2[1])).attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

        // Visualization
        const [xp, F, z, xstar] = [sol.x_p, sol.F, sol.z_star, sol.x_star];
        svg.append("circle").attr("cx", x(xp[0])).attr("cy", y(xp[1])).attr("r", 5).attr("fill", "orange").append("title").text("x_p (Particular Solution)");
        svg.append("line").attr("x1", x(xp[0])).attr("y1", y(xp[1])).attr("x2", x(xp[0]+F[0])).attr("y2", y(xp[1]+F[1])).attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("marker-end", "url(#arrow)").append("title").text("F (Null Space Basis)");
        svg.append("line").attr("x1", x(xp[0])).attr("y1", y(xp[1])).attr("x2", x(xstar[0])).attr("y2", y(xstar[1])).attr("stroke", "var(--color-danger)").attr("stroke-width", 2).attr("marker-end", "url(#arrow)").append("title").text("z*F");
        svg.append("circle").attr("cx", x(xstar[0])).attr("cy", y(xstar[1])).attr("r", 6).attr("fill", "var(--color-success)").append("title").text("x* (Optimal Solution)");
    }

    solveBtn.addEventListener("click", update);
    update();
}
