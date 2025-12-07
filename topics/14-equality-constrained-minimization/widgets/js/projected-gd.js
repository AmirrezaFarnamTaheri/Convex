/**
 * Widget: Projected Gradient Descent
 *
 * Description: Animates projected gradient descent, showing the gradient step and the projection back onto the feasible set.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initProjectedGradientDescent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="pgd-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Step Size (α): <span id="pgd-alpha-val">0.20</span></label>
                    <input type="range" id="pgd-alpha-slider" min="0.05" max="1.0" step="0.05" value="0.2">
                </div>
                <button id="pgd-reset-btn">Reset</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point (red) or the unconstrained minimum (green).</p>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const alphaSlider = container.querySelector("#pgd-alpha-slider");
    const resetBtn = container.querySelector("#pgd-reset-btn");

    let startPoint = [-1.5, 1.5];
    let center = [3, 2]; // Unconstrained minimum
    const defaultStartPoint = [-1.5, 1.5];
    const defaultCenter = [3, 2];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-2, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-2, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const visGroup = svg.append("g");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def run_pgd(start_pt, center_pt, alpha):
    path = []
    unconstrained_steps = []

    p = np.array(start_pt)
    center = np.array(center_pt)

    for _ in range(20):
        path.append(p.tolist())
        grad = 2 * (p - center)
        p_unconstrained = p - alpha * grad
        unconstrained_steps.append(p_unconstrained.tolist())

        # Project onto x+y <= 1
        p_next = p_unconstrained
        if p_unconstrained[0] + p_unconstrained[1] > 1:
            p_next = np.array([(p_unconstrained[0]-p_unconstrained[1]+1)/2, (p_unconstrained[1]-p_unconstrained[0]+1)/2])

        if np.linalg.norm(p_next - p) < 1e-4:
            break
        p = p_next

    path.append(p.tolist())

    return json.dumps({"path": path, "unconstrained": unconstrained_steps})
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_pgd = pyodide.globals.get('run_pgd');

    async function update() {
        const alpha = +alphaSlider.value;
        container.querySelector("#pgd-alpha-val").textContent = alpha.toFixed(2);

        const result = await run_pgd(startPoint, center, alpha).then(r => JSON.parse(r));

        visGroup.selectAll("*").remove();

        // Contours
        const contours = d3.range(0.5, 6, 0.5).map(r => d3.range(0, 2*Math.PI+0.1, 0.1).map(a => [center[0]+r*Math.cos(a), center[1]+r*Math.sin(a)]));
        visGroup.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);

        // Feasible set: x+y <= 1
        const feasible_poly = [[-2,3], [3,-2], [-2,-2], [-2,3]]; // Closed path
        visGroup.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasible_poly))
            .attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);

        // Animate path segments
        result.path.forEach((p, i) => {
            if (i < result.path.length - 1) {
                // Unconstrained step
                visGroup.append("line").attr("x1", x(p[0])).attr("y1", y(p[1]))
                    .attr("x2", x(result.unconstrained[i][0])).attr("y2", y(result.unconstrained[i][1]))
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 1.5).attr("stroke-dasharray", "3 3");
                // Projection step
                visGroup.append("line").attr("x1", x(result.unconstrained[i][0])).attr("y1", y(result.unconstrained[i][1]))
                    .attr("x2", x(result.path[i+1][0])).attr("y2", y(result.path[i+1][1]))
                    .attr("stroke", "var(--color-danger)").attr("stroke-width", 1.5).attr("stroke-dasharray", "3 3");
            }
        });

        // Final projected path
        visGroup.append("path").datum(result.path)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);

        // Draggable handles
        visGroup.append("circle").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1])).attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) { startPoint = [x.invert(event.x), y.invert(event.y)]; update(); }));
        visGroup.append("circle").attr("cx", x(center[0])).attr("cy", y(center[1])).attr("r", 7).attr("fill", "var(--color-success)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) { center = [x.invert(event.x), y.invert(event.y)]; update(); }));
    }

    alphaSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        center = [...defaultCenter];
        alphaSlider.value = 0.2;
        update();
    });

    update();
}
