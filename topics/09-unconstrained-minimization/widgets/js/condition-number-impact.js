/**
 * Widget: Condition Number Impact on Gradient Descent
 *
 * Description: Visualizes how a high condition number elongates the contours of a function
 *              and slows down gradient descent.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConditionNumberImpact(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="cond-num-impact-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Condition Number (κ): <span id="kappa-val">10</span></label>
                    <input type="range" id="kappa-slider" min="1" max="100" step="1" value="10">
                </div>
                <button id="cni-reset-btn">Reset Start</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the starting point (large circle) and adjust the condition number to see the impact on GD convergence.</p>
            <div id="cni-output" class="widget-output"></div>
        </div>
    `;

    const kappaSlider = container.querySelector("#kappa-slider");
    const kappaVal = container.querySelector("#kappa-val");
    const resetBtn = container.querySelector("#cni-reset-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#cni-output");

    let startPoint = [3.5, 3.5];
    const defaultStartPoint = [3.5, 3.5];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth > 0 ? plotContainer.clientWidth - margin.left - margin.right : 500;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-4, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const contourGroup = svg.append("g").attr("class", "contours");
    const pathGroup = svg.append("g").attr("class", "paths");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_path_and_contours(kappa, start_point_list):
    kappa = float(kappa)
    start_point = np.array(start_point_list)

    # Optimal step size for this quadratic function
    alpha = 1.8 / (1 + kappa)

    path = [start_point]
    for i in range(500): # Max iterations
        p = path[-1]
        grad = np.array([p[0], kappa * p[1]])
        if np.linalg.norm(grad) < 1e-4:
            break
        p_next = p - alpha * grad
        path.append(p_next)
        if np.linalg.norm(p_next) > 1e4: # Divergence check
            break

    # Generate contours
    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = 0.5 * (xx**2 + kappa * yy**2)

    return json.dumps({
        "path": np.array(path).tolist(),
        "contours": zz.tolist(),
        "iterations": len(path) - 1
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_path_and_contours = pyodide.globals.get('get_path_and_contours');

    const drag = d3.drag().on("drag", function(event) {
        startPoint = [x.invert(event.x), y.invert(event.y)];
        update();
    });

    async function update() {
        const kappa = +kappaSlider.value;
        kappaVal.textContent = kappa;

        const data = await get_path_and_contours(kappa, startPoint).then(r => JSON.parse(r));

        // Clear previous drawings
        contourGroup.selectAll("*").remove();
        pathGroup.selectAll("*").remove();

        // Draw Contours
        const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([d3.max(data.contours.flat()), 0]);
        contourGroup.selectAll("path")
            .data(d3.contours().thresholds(d3.range(0, 50, 2))(data.contours.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 49).translate([0.5, 0.5])))
            .attr("fill", d => colorScale(d.value))
            .attr("stroke", "#000")
            .attr("stroke-width", 0.2);

        // Draw GD Path
        pathGroup.append("path").datum(data.path)
            .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5)
            .attr("marker-end", "url(#arrow)");

        // Draw start/end points
        pathGroup.append("circle").attr("cx", x(data.path[0][0])).attr("cy", y(data.path[0][1])).attr("r", 7)
            .attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2)
            .style("cursor", "move").call(drag);

        const endPoint = data.path[data.path.length - 1];
        pathGroup.append("circle").attr("cx", x(endPoint[0])).attr("cy", y(endPoint[1])).attr("r", 4)
            .attr("fill", "var(--color-danger)");

        outputDiv.innerHTML = `Iterations to converge: <strong>${data.iterations}</strong>`;
    }

    svg.append("defs").append("marker").attr("id", "arrow").attr("viewBox", "0 -5 10 10")
        .attr("refX", 10).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-accent)");

    kappaSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        update();
    });

    update();
}
