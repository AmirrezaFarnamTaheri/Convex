/**
 * Widget: LP Visualizer & Simplex Animator
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="lp-visualizer-widget">
            <div class="widget-controls">
                <h4>Objective: Maximize cᵀx</h4>
                c = [<input type="number" id="c1" value="1" step="0.1">, <input type="number" id="c2" value="2" step="0.1">]
                <h4>Constraints: Ax ≤ b</h4>
                <div id="lp-constraints"></div>
                <button id="add-lp-constraint">+ Add</button>
                <button id="run-simplex-btn">Animate Simplex</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsContainer = container.querySelector("#lp-constraints");
    const addBtn = container.querySelector("#add-lp-constraint");
    const runBtn = container.querySelector("#run-simplex-btn");
    const c1_in = container.querySelector("#c1");
    const c2_in = container.querySelector("#c2");

    let constraints = [[-1, 1, 1], [1, 1, 3], [1, 0, 2]]; // Default Ax <= b

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

    const contourGroup = svg.append("g");
    const feasibleRegion = svg.append("path").attr("fill", "var(--color-primary-light)").attr("opacity", 0.7);
    const simplexPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 3);
    const simplexPoints = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");

    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
from shapely.geometry import Polygon, HalfPlane
import json

def solve_lp(c, A, b):
    # We maximize by negating c
    path = []
    res = linprog(-np.array(c), A_ub=A, b_ub=b, bounds=[(0, None), (0, None)], method='highs-ds', callback=lambda res: path.append(res.x.tolist()))

    # Calculate feasible region vertices
    try:
        bounds = 100
        feasible_poly = Polygon([(-bounds,-bounds), (bounds,-bounds), (bounds,bounds), (-bounds,bounds)])
        all_A = np.vstack([A, [[-1,0], [0,-1]]]) # Add non-negativity constraints
        all_b = np.hstack([b, [0,0]])
        for i in range(all_A.shape[0]):
            a = all_A[i]
            b_val = all_b[i]
            p_on_boundary = a * b_val / np.dot(a, a) if np.dot(a, a) > 1e-9 else np.zeros(2)
            feasible_poly = feasible_poly.intersection(HalfPlane(p_on_boundary, -a))

        vertices = list(feasible_poly.exterior.coords) if not feasible_poly.is_empty else []
    except Exception:
        vertices = []

    return json.dumps({"path": path, "vertices": vertices, "solution": res.x.tolist() if res.success else None})
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_lp = pyodide.globals.get('solve_lp');

    async function update() {
        runBtn.disabled = true;
        const c = [+c1_in.value, +c2_in.value];
        const A = constraints.map(row => row.slice(0, 2));
        const b = constraints.map(row => row[2]);

        const result = await solve_lp(c, A, b).then(r => JSON.parse(r));

        // Draw feasible region
        if (result.vertices.length > 0) {
            feasibleRegion.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(result.vertices) + "Z");
        } else {
            feasibleRegion.attr("d", null);
        }

        // Draw objective contours
        contourGroup.selectAll("*").remove();
        if (result.solution) {
            const levels = d3.range(0, c[0]*result.solution[0] + c[1]*result.solution[1], 2);
            levels.forEach(level => {
                let p1, p2;
                if (Math.abs(c[1]) > 1e-6) {
                    p1 = [-1, (level - c[0]*(-1))/c[1]];
                    p2 = [4, (level - c[0]*4)/c[1]];
                } else {
                    p1 = [level/c[0], -1];
                    p2 = [level/c[0], 4];
                }
                contourGroup.append("line").attr("x1", x(p1[0])).attr("y1", y(p1[1])).attr("x2", x(p2[0])).attr("y2", y(p2[1])).attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "4 4");
            });
        }

        // Animate simplex path
        simplexPath.datum(result.path).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
        const totalLength = simplexPath.node()?.getTotalLength() || 0;
        simplexPath.attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(1500).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

        simplexPoints.selectAll("*").remove();
        result.path.forEach((p, i) => {
            simplexPoints.append("circle").attr("cx", x(p[0])).attr("cy", y(p[1])).attr("r", 0).attr("fill", "var(--color-danger)").transition().delay(i * 300).attr("r", 5);
        });

        runBtn.disabled = false;
    }

    function renderConstraints() {
        constraintsContainer.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <input type="number" value="${c[0]}" step="0.1"> x₁ +
                <input type="number" value="${c[1]}" step="0.1"> x₂ ≤
                <input type="number" value="${c[2]}" step="0.1">
                <button data-index="${i}">X</button>
            `;
            div.querySelectorAll('input').forEach((input, j) => {
                input.addEventListener('change', (e) => constraints[i][j] = +e.target.value);
            });
            div.querySelector('button').addEventListener('click', () => {
                constraints.splice(i, 1);
                renderConstraints();
            });
            constraintsContainer.appendChild(div);
        });
    }

    addBtn.addEventListener('click', () => { constraints.push([0,0,0]); renderConstraints(); });
    runBtn.addEventListener('click', update);

    renderConstraints();
}
