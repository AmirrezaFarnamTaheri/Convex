/**
 * Widget: Barrier Method Path Tracer
 *
 * Description: Traces the central path as the barrier parameter `t` is increased,
 *              showing how the solutions approach the true optimum.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initBarrierPathTracer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="barrier-tracer-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Feasible Set:</label>
                    <select id="bt-set-select">
                        <option value="box">Box</option>
                        <option value="polytope">Polytope</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Barrier Param (t): <span id="t-val-display">1.0</span></label>
                    <input type="range" id="t-slider" min="-1" max="3" step="0.1" value="0">
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the objective vector (red arrow) and adjust 't' to see the barrier objective's contours and minimizer.</p>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider");
    const tValDisplay = container.querySelector("#t-val-display");
    const setSelect = container.querySelector("#bt-set-select");
    const plotContainer = container.querySelector("#plot-container");

    let c = [-1, -2]; // Objective vector
    const sets = {
        "box": { A: [[-1,0], [0,-1], [1,0], [0,1]], b: [0,0,1,1], domain: [-0.1, 1.1] },
        "polytope": { A: [[-1,0], [0,-1], [1,1], [0.2, 1]], b: [0,0,1.5,1.2], domain: [-0.1, 1.6] }
    };

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import minimize
import json

def get_barrier_data(set_A, set_b, c_vec, t):
    A = np.array(set_A)
    b = np.array(set_b)
    c = np.array(c_vec)

    def barrier_objective(x):
        residuals = b - A @ x
        if np.any(residuals <= 1e-6): return np.inf
        return t * (c @ x) - np.sum(np.log(residuals))

    # Find minimizer
    res = minimize(barrier_objective, np.mean(A, axis=0), method='Nelder-Mead', tol=1e-5)
    x_star = res.x.tolist() if res.success else None

    # Generate contours
    domain = np.linspace(A.min()-0.1, A.max()+0.1, 50) # Heuristic for domain
    xx, yy = np.meshgrid(np.linspace(x_star[0]-1, x_star[0]+1, 50), np.linspace(x_star[1]-1, x_star[1]+1, 50))
    points = np.vstack([xx.ravel(), yy.ravel()])
    zz = np.array([barrier_objective(p) for p in points.T]).reshape(50,50)

    return json.dumps({"x_star": x_star, "contours": zz.tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_barrier_data = pyodide.globals.get('get_barrier_data');

    const visGroup = svg.append("g");

    async function update() {
        const t = 10**(+tSlider.value);
        tValDisplay.textContent = t.toExponential(1);
        const currentSet = sets[setSelect.value];

        x.domain(currentSet.domain);
        y.domain(currentSet.domain);
        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));

        visGroup.selectAll("*").remove();

        // Feasible region
        // This is a bit of a hack for visualization; assumes vertices are where constraints meet
        // A proper way would be to find vertices, e.g., using a vertex enumeration algorithm.
        const feasible_poly = [[0,0],[1,0],[1,0.2],[0.5,1],[0,1.2]]; // Manual for polytope
        const poly_to_draw = setSelect.value === 'box' ? [[0,0],[1,0],[1,1],[0,1]] : feasible_poly;
        visGroup.append("path").datum(poly_to_draw)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])) + "Z")
            .attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);

        const data = await get_barrier_data(currentSet.A, currentSet.b, c, t).then(r => JSON.parse(r));

        if (data.contours) {
            const contours = d3.contours().thresholds(20)(data.contours.flat());
            visGroup.append("g").selectAll("path").data(contours)
              .join("path").attr("d", d3.geoPath(d3.geoIdentity().scale(width / (currentSet.domain[1]-currentSet.domain[0]) / 24))) // Scale is tricky
              .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("opacity", 0.7);
        }

        if (data.x_star) {
            visGroup.append("circle").attr("cx", x(data.x_star[0])).attr("cy", y(data.x_star[1]))
                .attr("r", 5).attr("fill", "var(--color-accent)");
        }

        const c_end = [ -c[0] * 0.2, -c[1] * 0.2 ];
        visGroup.append("line").attr("x1", x(0)).attr("y1", y(0)).attr("x2", x(c_end[0])).attr("y2", y(c_end[1]))
            .attr("stroke", "var(--color-danger)").attr("stroke-width", 3).attr("marker-end", "url(#arrow-c)");
        visGroup.append("circle").attr("cx", x(c_end[0])).attr("cy", y(c_end[1])).attr("r", 7)
            .attr("fill", "transparent").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                const new_c_end = [x.invert(event.x), y.invert(event.y)];
                const norm = Math.sqrt(new_c_end[0]**2 + new_c_end[1]**2) || 1;
                c = [-new_c_end[0]/norm, -new_c_end[1]/norm];
                update();
            }));
    }

    svg.append("defs").append("marker").attr("id", "arrow-c").attr("viewBox", "0 -5 10 10")
        .attr("refX", 10).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-danger)");

    tSlider.addEventListener("input", update);
    setSelect.addEventListener("change", update);
    update();
}
