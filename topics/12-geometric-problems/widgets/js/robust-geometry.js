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
            <div class="widget-controls" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <div class="control-group">
                    <label for="uncertainty-slider">Uncertainty Radius (δ):</label>
                    <input type="range" id="uncertainty-slider" min="0" max="1" step="0.05" value="0.5">
                    <span id="uncertainty-val">0.50</span>
                </div>
                <div class="control-group">
                    <input type="checkbox" id="show-nominal-cb" checked>
                    <label for="show-nominal-cb">Show Nominal Solution</label>
                </div>
                 <button id="rg-reset-btn">Reset Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the points to see how the nominal and robust solutions change.</p>
            <div id="rg-output" class="widget-output"></div>
        </div>
    `;

    const uncertaintySlider = container.querySelector("#uncertainty-slider");
    const uncertaintyVal = container.querySelector("#uncertainty-val");
    const showNominalCb = container.querySelector("#show-nominal-cb");
    const resetBtn = container.querySelector("#rg-reset-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#rg-output");

    let points = [];
    const defaultPoints = [[-2, -1], [1, -2], [0, 2]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth > 0 ? plotContainer.clientWidth - margin.left - margin.right : 500;
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

    const nominalCircle = svg.append("circle").attr("stroke", "var(--color-primary)").attr("fill", "none").attr("stroke-width", 1.5).attr("stroke-dasharray", "4 2");
    const robustCircle = svg.append("circle").attr("stroke", "var(--color-danger)").attr("stroke-width", 2).attr("fill", "none");
    const pointsGroup = svg.append("g");

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 10)`);
    legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).attr("stroke", "var(--color-primary)").attr("fill","none").attr("stroke-dasharray", "2 1");
    legend.append("text").attr("x", 10).attr("y", 5).text("Nominal").style("font-size", "12px").attr("fill", "var(--color-text-main)");
    legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 5).attr("stroke", "var(--color-danger)").attr("fill","none");
    legend.append("text").attr("x", 10).attr("y", 25).text("Robust").style("font-size", "12px").attr("fill", "var(--color-text-main)");


    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def solve_robust_sec(points, delta):
    P = np.array(points)
    if P.shape[0] == 0: return None

    # Nominal problem (Smallest Enclosing Circle)
    c_nom = cp.Variable(2)
    r_nom = cp.Variable()
    constraints_nom = [cp.norm(P[i] - c_nom) <= r_nom for i in range(P.shape[0])]
    prob_nom = cp.Problem(cp.Minimize(r_nom), constraints_nom)
    prob_nom.solve(solver=cp.ECOS)

    # Robust problem
    c_rob = cp.Variable(2)
    r_rob = cp.Variable()
    constraints_rob = [cp.norm(P[i] - c_rob) + delta <= r_rob for i in range(P.shape[0])]
    prob_rob = cp.Problem(cp.Minimize(r_rob), constraints_rob)
    prob_rob.solve(solver=cp.ECOS)

    res = {}
    if prob_nom.status in ['optimal', 'optimal_inaccurate']:
        res["nominal"] = {"c": c_nom.value.tolist(), "r": r_nom.value}
    if prob_rob.status in ['optimal', 'optimal_inaccurate']:
        res["robust"] = {"c": c_rob.value.tolist(), "r": r_rob.value}

    return json.dumps(res) if res else None
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_robust_sec = pyodide.globals.get('solve_robust_sec');

    function setPoints(newPoints) {
        points = JSON.parse(JSON.stringify(newPoints));
        update();
    }

    const pointDrag = d3.drag().on("drag", function(event, d) {
        d[0] = x.invert(event.x);
        d[1] = y.invert(event.y);
        update();
    });

    function drawPoints(delta) {
        pointsGroup.selectAll("g.point-group").data(points).join(
            enter => {
                const g = enter.append("g").attr("class", "point-group").style("cursor", "move");
                g.append("circle").attr("class", "uncertainty-disk").attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);
                g.append("circle").attr("class", "center-point").attr("r", 4).attr("fill", "var(--color-primary)");
                return g;
            }
        ).call(pointDrag)
        .attr("transform", d => `translate(${x(d[0])},${y(d[1])})`)
        .select(".uncertainty-disk").attr("r", Math.abs(x(delta) - x(0)));
    }

    async function update() {
        const delta = +uncertaintySlider.value;
        uncertaintyVal.textContent = delta.toFixed(2);
        const showNominal = showNominalCb.checked;

        drawPoints(delta);

        outputDiv.innerHTML = "Solving...";
        nominalCircle.style("display", "none");
        robustCircle.style("display", "none");

        const result_json = await solve_robust_sec(points, delta);
        if (result_json) {
            const result = JSON.parse(result_json);
            let outputHTML = "";

            if (result.nominal && showNominal) {
                nominalCircle
                    .attr("cx", x(result.nominal.c[0])).attr("cy", y(result.nominal.c[1]))
                    .attr("r", Math.abs(x(result.nominal.r) - x(0)))
                    .style("display", "block");
                outputHTML += `<b>Nominal:</b> Center (${result.nominal.c[0].toFixed(2)}, ${result.nominal.c[1].toFixed(2)}), Radius ${result.nominal.r.toFixed(2)}<br>`;
            }
            if (result.robust) {
                robustCircle
                    .attr("cx", x(result.robust.c[0])).attr("cy", y(result.robust.c[1]))
                    .attr("r", Math.abs(x(result.robust.r) - x(0)))
                    .style("display", "block");
                outputHTML += `<b>Robust:</b> Center (${result.robust.c[0].toFixed(2)}, ${result.robust.c[1].toFixed(2)}), Radius ${result.robust.r.toFixed(2)}`;
            }
            outputDiv.innerHTML = outputHTML;
        } else {
            outputDiv.innerHTML = "Could not find a solution.";
        }
    }

    [uncertaintySlider, showNominalCb].forEach(el => el.addEventListener("input", update));
    resetBtn.addEventListener("click", () => setPoints(defaultPoints));

    setPoints(defaultPoints);
}
