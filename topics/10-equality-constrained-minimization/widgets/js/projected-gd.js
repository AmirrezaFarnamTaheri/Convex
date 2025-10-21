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
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to set a starting point.</p>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");

    let startPoint = {x: -1.5, y: 1.5};
    let path = [];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
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

    // Objective contours (min (x-3)^2 + (y-2)^2)
    const center = [3, 2];
    const contours = d3.range(0.5, 6, 0.5).map(r => d3.range(0, 2*Math.PI+0.1, 0.1).map(a => [center[0]+r*Math.cos(a), center[1]+r*Math.sin(a)]));
    svg.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)");
    svg.append("circle").attr("cx", x(center[0])).attr("cy", y(center[1])).attr("r", 4).attr("fill", "var(--color-success)").append("title").text("Unconstrained Minimum");

    // Feasible set: x+y <= 1
    const feasible_poly = [[-2,3], [3,-2], [-2,-2]];
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasible_poly)+"Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.7);

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def project(p):
    if p[0] + p[1] <= 1:
        return p
    # Project onto x+y=1
    return np.array([ (p[0]-p[1]+1)/2, (p[1]-p[0]+1)/2 ])

def run_pgd(start_pt):
    path = [np.array(start_pt)]
    p = np.array(start_pt)
    for _ in range(20):
        grad = np.array([2*(p[0]-3), 2*(p[1]-2)])
        p_unconstrained = p - 0.2 * grad
        p_next = project(p_unconstrained)
        path.append(p_next)
        if np.linalg.norm(p_next-p) < 1e-3: break
        p = p_next
    return json.dumps(np.array(path).tolist())
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_pgd = pyodide.globals.get('run_pgd');

    async function run() {
        svg.selectAll(".pgd-path").remove();
        const path_json = await run_pgd([startPoint.x, startPoint.y]);
        const path = JSON.parse(path_json);

        svg.append("path").attr("class", "pgd-path").datum(path)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2)
            .call(p => {
                const len = p.node().getTotalLength();
                p.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
                 .transition().duration(1500).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
            });
    }

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            startPoint = {x: x.invert(mx), y: y.invert(my)};
            svg.selectAll(".start-point").remove();
            svg.append("circle").attr("class", "start-point").attr("cx", mx).attr("cy", my).attr("r", 5).attr("fill", "var(--color-danger)");
            run();
        });

    // Initial run
    svg.append("circle").attr("class", "start-point").attr("cx", x(startPoint.x)).attr("cy", y(startPoint.y)).attr("r", 5).attr("fill", "var(--color-danger)");
    run();
}
