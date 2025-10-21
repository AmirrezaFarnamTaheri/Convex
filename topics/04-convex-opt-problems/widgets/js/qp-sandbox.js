/**
 * Widget: QP Solver Sandbox
 *
 * Description: An interactive sandbox for solving a simple 2D QP, showing the contour lines and constraints.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initQPSandbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="qp-sandbox-widget">
            <div class="widget-controls">
                <h4>Minimize ½xᵀPx + qᵀx</h4>
                <div id="qp-objective">
                    P = [[<input type="number" step="0.1" value="1">, <input type="number" step="0.1" value="0">],
                         [<input type="number" step="0.1" value="0">, <input type="number" step="0.1" value="1">]]
                    <br>
                    q = [<input type="number" step="0.1" value="0">, <input type="number" step="0.1" value="0">]
                </div>
                <h4>Constraints: Ax ≤ b</h4>
                <div id="qp-constraints"></div>
                <button id="add-qp-constraint">+ Add</button>
            </div>
            <button id="solve-qp-btn">Solve QP</button>
            <div id="plot-container"></div>
            <div class="widget-output" id="qp-solution-text"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsContainer = container.querySelector("#qp-constraints");
    const addBtn = container.querySelector("#add-qp-constraint");
    const solveBtn = container.querySelector("#solve-qp-btn");
    const solutionText = container.querySelector("#qp-solution-text");
    const P_inputs = container.querySelectorAll("#qp-objective input").slice(0, 4);
    const q_inputs = container.querySelectorAll("#qp-objective input").slice(4);

    let constraints = [[1, 1, 2]];

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

    const contourGroup = svg.append("g");
    const feasibleRegion = svg.append("path").attr("fill", "var(--color-primary-light)").attr("opacity", 0.7);
    const solutionPoint = svg.append("circle").attr("r", 6).attr("fill", "var(--color-success)").style("display", "none");

    const pyodide = await getPyodide();
    await pyodide.loadPackage(["cvxpy", "scipy", "shapely"]);

    const pythonCode = `
import numpy as np
import cvxpy as cp
from shapely.geometry import Polygon, HalfPlane
import json

def solve_qp(P_val, q_val, A_val, b_val):
    x = cp.Variable(2)
    P = np.array(P_val)
    q = np.array(q_val)
    A = np.array(A_val)
    b = np.array(b_val)

    objective = cp.Minimize(0.5 * cp.quad_form(x, P) + q.T @ x)
    constraints = [A @ x <= b] if A.shape[0] > 0 else []

    prob = cp.Problem(objective, constraints)
    prob.solve()

    # Feasible region
    bounds = 100
    feasible_poly = Polygon([(-bounds,-bounds), (bounds,-bounds), (bounds,bounds), (-bounds,bounds)])
    if A.shape[0] > 0:
        for i in range(A.shape[0]):
            a, b_i = A[i], b[i]
            p_on_boundary = a * b_i / np.dot(a, a) if np.dot(a, a) > 1e-9 else np.zeros(2)
            feasible_poly = feasible_poly.intersection(HalfPlane(p_on_boundary, -a))

    vertices = list(feasible_poly.exterior.coords) if not feasible_poly.is_empty else []

    return json.dumps({
        "solution": x.value.tolist() if x.value is not None else None,
        "vertices": vertices
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_qp = pyodide.globals.get('solve_qp');

    async function update() {
        solveBtn.disabled = true;
        const P = [[+P_inputs[0].value, +P_inputs[1].value], [+P_inputs[2].value, +P_inputs[3].value]];
        const q = [+q_inputs[0].value, +q_inputs[1].value];
        const A = constraints.map(c => c.slice(0, 2));
        const b = constraints.map(c => c[2]);

        // Draw contours
        const gridSize = 50;
        const range = 3;
        const grid = d3.range(-range, range + 0.1, 2*range/gridSize);
        const contourData = [];
        for (let yi of grid) {
            for (let xi of grid) {
                const val = 0.5 * (P[0][0]*xi*xi + (P[0][1]+P[1][0])*xi*yi + P[1][1]*yi*yi) + q[0]*xi + q[1]*yi;
                contourData.push(val);
            }
        }
        const contours = d3.contours().size([gridSize, gridSize]).thresholds(10)(contourData);
        contourGroup.selectAll("path").data(contours).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width/gridSize)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

        const result = await solve_qp(P, q, A, b).then(r => JSON.parse(r));

        feasibleRegion.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(result.vertices) + "Z");

        if (result.solution) {
            solutionPoint.attr("cx", x(result.solution[0])).attr("cy", y(result.solution[1])).style("display", "block");
            solutionText.textContent = `Solution: [${result.solution[0].toFixed(2)}, ${result.solution[1].toFixed(2)}]`;
        } else {
            solutionPoint.style("display", "none");
            solutionText.textContent = "No solution found (problem might be infeasible or unbounded).";
        }
        solveBtn.disabled = false;
    }

    function renderConstraints() {
        constraintsContainer.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `<input type="number" value="${c[0]}" step="0.1"> x₁ + <input type="number" value="${c[1]}" step="0.1"> x₂ ≤ <input type="number" value="${c[2]}" step="0.1"> <button data-index="${i}">X</button>`;
            div.querySelectorAll('input').forEach((input, j) => input.addEventListener('change', (e) => constraints[i][j] = +e.target.value));
            div.querySelector('button').addEventListener('click', () => { constraints.splice(i, 1); renderConstraints(); });
            constraintsContainer.appendChild(div);
        });
    }

    addBtn.addEventListener('click', () => { constraints.push([0,0,0]); renderConstraints(); });
    solveBtn.addEventListener('click', update);

    renderConstraints();
    update();
}
