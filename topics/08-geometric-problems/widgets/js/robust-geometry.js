/**
 * Widget: Robust Geometry Optimizer
 *
 * Description: Compares a standard geometric optimization (Smallest Enclosing Circle)
 *              with its robust counterpart where point locations are uncertain.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initRobustGeometryOptimizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="robust-geo-widget">
            <div class="widget-controls">
                <label>Uncertainty Radius (δ):</label>
                <input type="range" id="uncertainty-slider" min="0" max="1" step="0.05" value="0.5">
                <span id="uncertainty-val">0.5</span>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the points to see how the nominal and robust solutions change.</p>
        </div>
    `;

    const uncertaintySlider = container.querySelector("#uncertainty-slider");
    const uncertaintyVal = container.querySelector("#uncertainty-val");
    const plotContainer = container.querySelector("#plot-container");

    let points = [[-2, -1], [1, -2], [0, 2]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const nominalCircle = svg.append("circle").attr("stroke", "var(--color-primary)").attr("fill", "none");
    const robustCircle = svg.append("circle").attr("stroke", "var(--color-danger)").attr("stroke-width", 2).attr("fill", "none");
    const pointsGroup = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def solve_robust_sec(points, delta):
    P = np.array(points)

    # Nominal problem
    c_nom = cp.Variable(2)
    r_nom = cp.Variable()
    constraints_nom = [cp.norm(P[i] - c_nom) <= r_nom for i in range(P.shape[0])]
    prob_nom = cp.Problem(cp.Minimize(r_nom), constraints_nom)
    prob_nom.solve()

    # Robust problem
    c_rob = cp.Variable(2)
    r_rob = cp.Variable()
    # Robust constraint: ||P[i] - c|| + delta <= r
    constraints_rob = [cp.norm(P[i] - c_rob) + delta <= r_rob for i in range(P.shape[0])]
    prob_rob = cp.Problem(cp.Minimize(r_rob), constraints_rob)
    prob_rob.solve()

    return json.dumps({
        "nominal": {"c": c_nom.value.tolist(), "r": r_nom.value},
        "robust": {"c": c_rob.value.tolist(), "r": r_rob.value}
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_robust_sec = pyodide.globals.get('solve_robust_sec');

    const drag = d3.drag().on("drag", function(event, d, i) {
        const [mx, my] = d3.pointer(event, svg.node());
        points[i] = [x.invert(mx), y.invert(my)];
        update();
    });

    function drawPoints(delta) {
        pointsGroup.selectAll("g.point-group").data(points).join("g").attr("class", "point-group").call(drag)
            .each(function(d) {
                const g = d3.select(this);
                g.selectAll("*").remove();
                g.append("circle").attr("cx", x(d[0])).attr("cy", y(d[1])).attr("r", 4).attr("fill", "var(--color-primary)");
                g.append("circle").attr("cx", x(d[0])).attr("cy", y(d[1])).attr("r", x(delta)-x(0)).attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);
            });
    }

    async function update() {
        const delta = +uncertaintySlider.value;
        uncertaintyVal.textContent = delta.toFixed(2);

        drawPoints(delta);

        const result_json = await solve_robust_sec(points, delta);
        if (result_json) {
            const result = JSON.parse(result_json);

            nominalCircle
                .attr("cx", x(result.nominal.c[0])).attr("cy", y(result.nominal.c[1]))
                .attr("r", x(result.nominal.r) - x(0));

            robustCircle
                .attr("cx", x(result.robust.c[0])).attr("cy", y(result.robust.c[1]))
                .attr("r", x(result.robust.r) - x(0));
        }
    }

    uncertaintySlider.addEventListener("input", update);
    update();
}
