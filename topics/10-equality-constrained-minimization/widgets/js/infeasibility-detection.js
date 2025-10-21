/**
 * Widget: Infeasibility Detection (Phase I Method)
 *
 * Description: Visualizes how a Phase I method can detect infeasibility in an LP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initInfeasibilityDetection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="infeasibility-widget">
            <div class="widget-controls">
                <h4>Constraints: Ax ≤ b</h4>
                <div id="inf-constraints"></div>
                <button id="add-inf-constraint">+ Add</button>
                <button id="run-phase-one-btn">Run Phase I</button>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="inf-status"></div>
        </div>
    `;

    const constraintsContainer = container.querySelector("#inf-constraints");
    const addBtn = container.querySelector("#add-inf-constraint");
    const runBtn = container.querySelector("#run-phase-one-btn");
    const plotContainer = container.querySelector("#plot-container");
    const statusDiv = container.querySelector("#inf-status");

    let constraints = [[-1, 0, -2], [0, -1, -3], [1, 1, 4]]; // Default: x1>=2, x2>=3, x1+x2<=4

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def solve_phase1(A_val, b_val):
    x = cp.Variable(2)
    s = cp.Variable()
    A = np.array(A_val)
    b = np.array(b_val)

    constraints = [A @ x <= b + s, s >= 0]
    prob = cp.Problem(cp.Minimize(s), constraints)
    prob.solve()

    return json.dumps({
        "s_val": s.value,
        "x_val": x.value.tolist() if x.value is not None else None,
        "is_feasible": s.value < 1e-6
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_phase1 = pyodide.globals.get('solve_phase1');

    function renderConstraints() {
        constraintsContainer.innerHTML = '';
        svg.selectAll(".constraint-line").remove();

        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `<input value="${c[0]}">x₁ + <input value="${c[1]}">x₂ ≤ <input value="${c[2]}"> <button data-idx="${i}">X</button>`;
            div.querySelectorAll('input').forEach((input, j) => {
                input.type = "number"; input.step="0.1";
                input.addEventListener('change', (e) => constraints[i][j] = +e.target.value);
            });
            div.querySelector('button').addEventListener('click', () => { constraints.splice(i, 1); renderConstraints(); });
            constraintsContainer.appendChild(div);

            const [a1, a2, b] = c;
            let p1, p2;
            if(Math.abs(a2) > 1e-6) {
                p1 = {x: 0, y: b/a2}; p2 = {x: 5, y: (b-5*a1)/a2};
            } else {
                p1 = {x: b/a1, y: 0}; p2 = {x: b/a1, y: 5};
            }
            svg.append("line").attr("class", "constraint-line")
                .attr("x1", x(p1.x)).attr("y1", y(p1.y))
                .attr("x2", x(p2.x)).attr("y2", y(p2.y))
                .attr("stroke", "var(--color-primary)");
        });
    }

    async function run() {
        runBtn.disabled = true;
        const A = constraints.map(c => c.slice(0, 2));
        const b = constraints.map(c => c[2]);

        const result = await solve_phase1(A, b).then(r => JSON.parse(r));

        svg.selectAll(".sol-point").remove();
        if (result.is_feasible) {
            statusDiv.innerHTML = `<p style="color:var(--color-success)">Feasible! A solution is x = [${result.x_val.map(v=>v.toFixed(2)).join(', ')}]</p>`;
            svg.append("circle").attr("class", "sol-point")
                .attr("cx", x(result.x_val[0])).attr("cy", y(result.x_val[1]))
                .attr("r", 5).attr("fill", "var(--color-success)");
        } else {
            statusDiv.innerHTML = `<p style="color:var(--color-danger)">Infeasible. The minimum slack required is s = ${result.s_val.toFixed(3)}</p>`;
        }
        runBtn.disabled = false;
    }

    addBtn.addEventListener("click", () => { constraints.push([0,0,0]); renderConstraints(); });
    runBtn.addEventListener("click", run);

    renderConstraints();
    run();
}
