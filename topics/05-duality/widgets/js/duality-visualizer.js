/**
 * Widget: Primal-Dual Geometry Visualizer
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initDualityVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="duality-visualizer-widget">
            <div class="widget-controls">
                <h4>Primal: max cᵀx s.t. Ax ≤ b, x ≥ 0</h4>
                c = [<input type="number" id="c1" value="-1" step="0.1">, <input type="number" id="c2" value="-2" step="0.1">]
                <button id="solve-lp-btn">Solve</button>
            </div>
            <div class="plots-container">
                <div id="primal-plot"><h4>Primal Problem</h4></div>
                <div id="dual-plot"><h4>Dual Problem</h4></div>
            </div>
        </div>
    `;

    const solveBtn = container.querySelector("#solve-lp-btn");
    const c1_in = container.querySelector("#c1");
    const c2_in = container.querySelector("#c2");

    let A = [[1, 1], [-1, 1], [1, -1]];
    let b = [4, 2, 2];

    const margin = {top: 40, right: 20, bottom: 40, left: 40};
    const width = (container.querySelector('#primal-plot').clientWidth) - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const setupSvg = (selector) => d3.select(selector).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const primalSvg = setupSvg("#primal-plot");
    const dualSvg = setupSvg("#dual-plot");

    const pyodide = await getPyodide();
    await pyodide.loadPackage(["scipy", "shapely"]);
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
from shapely.geometry import Polygon, HalfPlane
import json

def solve_primal_and_dual(c, A, b):
    # Primal
    primal_res = linprog(c, A_ub=A, b_ub=b, bounds=[(0, None), (0, None)])

    # Dual: min bᵀy s.t. Aᵀy ≥ -c, y ≥ 0
    dual_res = linprog(b, A_ub=-np.array(A).T, b_ub=-np.array(c), bounds=(0, None))

    # Feasible regions (simplified using shapely)
    bounds = 100
    primal_poly = Polygon([(-bounds,-bounds), (bounds,-bounds), (bounds,bounds), (-bounds,bounds)])
    primal_A_full = np.vstack([A, [[-1,0], [0,-1]]])
    primal_b_full = np.hstack([b, [0,0]])
    for i in range(primal_A_full.shape[0]):
        a, b_i = primal_A_full[i], primal_b_full[i]
        p = a * b_i / np.dot(a, a) if np.dot(a, a) > 1e-9 else np.zeros(2)
        primal_poly = primal_poly.intersection(HalfPlane(p, -a))
    primal_verts = list(primal_poly.exterior.coords) if not primal_poly.is_empty else []

    dual_poly = Polygon([(-bounds,-bounds), (bounds,-bounds), (bounds,bounds), (-bounds,bounds)])
    dual_A_full = np.vstack([-np.array(A).T, [[-1,0,0], [0,-1,0], [0,0,-1]]])
    dual_b_full = np.hstack([-np.array(c), [0,0,0]])
    # Can't easily visualize 3D dual feasible set in 2D

    return json.dumps({
        "primal_sol": primal_res.x.tolist() if primal_res.success else None,
        "dual_sol": dual_res.x.tolist() if dual_res.success else None,
        "primal_verts": primal_verts
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_primal_and_dual = pyodide.globals.get('solve_primal_and_dual');

    async function update() {
        const c = [+c1_in.value, +c2_in.value];
        const result = await solve_primal_and_dual(c, A, b).then(r => JSON.parse(r));

        // Primal plot
        primalSvg.selectAll("*").remove();
        const px = d3.scaleLinear().domain([-1, 5]).range([0, width]);
        const py = d3.scaleLinear().domain([-1, 5]).range([height, 0]);
        primalSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(px));
        primalSvg.append("g").call(d3.axisLeft(py));
        primalSvg.append("path").attr("d", d3.line().x(d=>px(d[0])).y(d=>py(d[1]))(result.primal_verts)+"Z").attr("fill", "var(--color-primary-light)");
        if(result.primal_sol) {
            primalSvg.append("circle").attr("cx", px(result.primal_sol[0])).attr("cy", py(result.primal_sol[1])).attr("r", 5).attr("fill", "var(--color-success)");
        }

        // Dual plot (Note: The dual is 3D, we are plotting the solution's projection)
        dualSvg.selectAll("*").remove();
        const dx = d3.scaleLinear().domain([-1, 5]).range([0, width]);
        const dy = d3.scaleLinear().domain([-1, 5]).range([height, 0]);
        dualSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(dx));
        dualSvg.append("g").call(d3.axisLeft(dy));
        if(result.dual_sol){
            dualSvg.append("circle").attr("cx", dx(result.dual_sol[0])).attr("cy", dy(result.dual_sol[1])).attr("r", 5).attr("fill", "var(--color-accent)");
            dualSvg.append("text").text(`Cannot visualize 3D feasible set. Sol=[${result.dual_sol.map(v=>v.toFixed(1))}]`).attr("x", 10).attr("y", 10);
        }
    }

    solveBtn.addEventListener("click", update);
    update();
}
