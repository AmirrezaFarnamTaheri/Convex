/**
 * Widget: Feasible vs. Interior-Point Method Paths
 *
 * Description: Compares the paths taken by a feasible descent method (Projected GD) and an interior-point method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initFeasibleVsInterior(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="fvi-widget">
            <div class="widget-controls">
                 <div class="control-group">
                    <label>Barrier Param (t₀): <span id="fvi-t0-val">1</span></label>
                    <input type="range" id="fvi-t0-slider" min="0.1" max="10" step="0.1" value="1">
                </div>
                <button id="fvi-reset-btn">Reset Start</button>
                <div class="legend">
                    <span style="color:var(--color-primary);">―</span> Projected GD
                    <span style="color:var(--color-accent); margin-left: 10px;">―</span> Interior-Point
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point. Note that Interior-Point requires a strictly feasible start.</p>
        </div>
    `;

    const t0Slider = container.querySelector("#fvi-t0-slider");
    const resetBtn = container.querySelector("#fvi-reset-btn");
    const plotContainer = container.querySelector("#plot-container");

    let startPoint = [0.1, 0.1];
    const defaultStartPoint = [0.1, 0.1];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-1, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Static elements
    const center = [2,2];
    const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0, 2*Math.PI+0.1, 0.1).map(a => [center[0]+r*Math.cos(a), center[1]+r*Math.sin(a)]));
    svg.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))).attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);
    const feasible_poly = [[0,0], [1,0], [0,1]];
    svg.append("path").attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(feasible_poly)+"Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.3).style("pointer-events", "none");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def run_methods(start_point_list, t0):
    start_point = np.array(start_point_list)

    # --- Projected GD ---
    def project(p):
        p = np.maximum(1e-6, p) # Keep it slightly away from boundary
        if np.sum(p) > 1: p = np.array([(p[0]-p[1]+1)/2, (p[1]-p[0]+1)/2])
        return p

    path_pgd = [start_point]
    p_pgd = start_point.copy()
    for _ in range(30):
        grad = np.array([2*(p_pgd[0]-2), 2*(p_pgd[1]-2)])
        p_next = project(p_pgd - 0.1 * grad)
        path_pgd.append(p_next)
        if np.linalg.norm(p_next - p_pgd) < 1e-4: break
        p_pgd = p_next

    # --- Interior Point (Barrier Method) ---
    path_ip = []
    p_ip = start_point.copy()

    # Check if starting point is strictly feasible for IP
    if p_ip[0] > 0 and p_ip[1] > 0 and (p_ip[0] + p_ip[1]) < 1:
        path_ip.append(p_ip.copy())
        for t in np.logspace(np.log10(t0), 3, 15):
            for _ in range(15): # Inner centering steps
                grad_barrier = np.array([1/(1-p_ip[0]-p_ip[1]) - 1/p_ip[0],
                                         1/(1-p_ip[0]-p_ip[1]) - 1/p_ip[1]])
                grad = np.array([2*(p_ip[0]-2), 2*(p_ip[1]-2)]) - (1/t) * grad_barrier
                # A simple line search could be added here for robustness
                p_ip -= 0.01 * grad
                path_ip.append(p_ip.copy())

    return json.dumps({"pgd": path_pgd, "ip": path_ip})
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_methods = pyodide.globals.get('run_methods');

    const pgdPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
    const ipPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);

    async function update() {
        const t0 = +t0Slider.value;
        container.querySelector("#fvi-t0-val").textContent = t0.toFixed(1);

        const paths = await run_methods(startPoint, t0).then(r => JSON.parse(r));

        const animate = (pathEl, data) => {
             pathEl.datum(data).attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])));
             const len = pathEl.node().getTotalLength();
             if (len > 0) {
                 pathEl.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
                     .transition().duration(1000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
             }
        };

        animate(pgdPath, paths.pgd);
        animate(ipPath, paths.ip);

        svg.selectAll(".start-point").remove();
        svg.append("circle").attr("class", "start-point").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1]))
            .attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                startPoint = [x.invert(event.x), y.invert(event.y)];
                update();
            }));
    }

    t0Slider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        t0Slider.value = 1.0;
        update();
    });

    update();
}
