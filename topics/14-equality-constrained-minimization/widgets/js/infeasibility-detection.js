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
                <p><strong>Interactive Constraint (draggable)</strong></p>
                <div id="inf-interactive-constraint"></div>
                 <p><strong>Static Constraints</strong></p>
                <div id="inf-constraints"></div>
                <button id="add-inf-constraint">+ Add Static Constraint</button>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="inf-status"></div>
        </div>
    `;

    const constraintsContainer = container.querySelector("#inf-constraints");
    const interactiveContainer = container.querySelector("#inf-interactive-constraint");
    const addBtn = container.querySelector("#add-inf-constraint");
    const plotContainer = container.querySelector("#plot-container");
    const statusDiv = container.querySelector("#inf-status");

    let static_constraints = [[-1, 0, -2], [0, -1, -3]]; // x1>=2, x2>=3
    let interactive_constraint = [1, 1, 4]; // x1+x2<=4

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
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
    if not A_val: return json.dumps({"is_feasible": True, "x_val": [0,0], "s_val": 0})

    A = np.array(A_val)
    b = np.array(b_val)

    constraints = [A @ x <= b + s, s >= 0]
    prob = cp.Problem(cp.Minimize(s), constraints)
    prob.solve()

    return json.dumps({
        "s_val": s.value,
        "x_val": x.value.tolist() if x.value is not None else None,
        "is_feasible": s.value is not None and s.value < 1e-6
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_phase1 = pyodide.globals.get('solve_phase1');

    function drawLine(c, s=0, interactive=false) {
        const [a1, a2, b_orig] = c;
        const b = b_orig + s;
        let p1, p2;
        if (Math.abs(a2) > 1e-6) { p1 = [0, b/a2]; p2 = [5, (b-5*a1)/a2]; }
        else { p1 = [b/a1, 0]; p2 = [b/a1, 5]; }

        const line = svg.append("line")
            .attr("x1", x(p1[0])).attr("y1", y(p1[1]))
            .attr("x2", x(p2[0])).attr("y2", y(p2[1]))
            .attr("stroke-width", interactive ? 3 : 1.5);
        return line;
    }

    async function renderAndSolve() {
        interactiveContainer.innerHTML = `<span>${interactive_constraint[0].toFixed(1)}x₁ + ${interactive_constraint[1].toFixed(1)}x₂ ≤ ${interactive_constraint[2].toFixed(1)}</span>`;

        constraintsContainer.innerHTML = '';
        static_constraints.forEach((c, i) => {
             const div = document.createElement("div");
            div.innerHTML = `<input value="${c[0]}">x₁ + <input value="${c[1]}">x₂ ≤ <input value="${c[2]}"> <button data-idx="${i}">X</button>`;
            div.querySelectorAll('input').forEach((input, j) => {
                input.type = "number"; input.step = "0.1";
                input.addEventListener('change', (e) => { static_constraints[i][j] = +e.target.value; renderAndSolve(); });
            });
            div.querySelector('button').addEventListener('click', () => { static_constraints.splice(i, 1); renderAndSolve(); });
            constraintsContainer.appendChild(div);
        });

        const all_constraints = [...static_constraints, interactive_constraint];
        const A = all_constraints.map(c => c.slice(0, 2));
        const b = all_constraints.map(c => c[2]);

        const result = await solve_phase1(A, b).then(r => JSON.parse(r));

        svg.selectAll(".constraint-line, .sol-point").remove();

        all_constraints.forEach((c, i) => {
            const is_interactive = i === all_constraints.length - 1;
            const line = drawLine(c, 0, is_interactive).attr("class", "constraint-line").attr("stroke", "var(--color-primary)");
            if (is_interactive) {
                line.style("cursor", "move").call(d3.drag().on("drag", function(event) {
                    const b_new = interactive_constraint[0] * x.invert(event.x) + interactive_constraint[1] * y.invert(event.y);
                    interactive_constraint[2] = b_new;
                    renderAndSolve();
                }));
            }
        });

        if (result.is_feasible) {
            statusDiv.innerHTML = `<p style="color:var(--color-success)">Feasible! A solution is x = [${result.x_val.map(v => v.toFixed(2)).join(', ')}]</p>`;
            if (result.x_val) {
                svg.append("circle").attr("class", "sol-point")
                    .attr("cx", x(result.x_val[0])).attr("cy", y(result.x_val[1]))
                    .attr("r", 5).attr("fill", "var(--color-success)");
            }
        } else if (result.s_val !== null) {
            statusDiv.innerHTML = `<p style="color:var(--color-danger)">Infeasible. Minimum slack s = ${result.s_val.toFixed(3)}</p>`;
            all_constraints.forEach(c => {
                drawLine(c, result.s_val).attr("class", "constraint-line").attr("stroke", "var(--color-danger)").attr("stroke-dasharray", "4 2");
            });
        }
    }

    addBtn.addEventListener("click", () => { static_constraints.push([1, 0, 0]); renderAndSolve(); });
    renderAndSolve();
}
