/**
 * Widget: Gradient Descent vs. Newton's Method
 *
 * Description: A side-by-side animation comparing the convergence of Gradient Descent and Newton's method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initGDvsNewton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="gd-vs-newton-widget">
            <div class="widget-controls">
                <button id="run-race-btn">Run Race</button>
                <div class="legend">
                    <span style="color:var(--color-primary);">―</span> Gradient Descent
                    <span style="color:var(--color-accent); margin-left: 10px;">―</span> Newton's Method
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click "Run Race" to see the optimization paths. The problem is minimizing the non-convex Rosenbrock function.</p>
        </div>
    `;

    const runBtn = container.querySelector("#run-race-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-2, 2]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def rosenbrock(x, y):
    return (1 - x)**2 + 100 * (y - x**2)**2

def grad_rosenbrock(p):
    x, y = p
    return np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)])

def hess_rosenbrock(p):
    x, y = p
    return np.array([[1200*x**2 - 400*y + 2, -400*x], [-400*x, 200]])

def run_paths():
    start_point = np.array([-1.5, 2.5])

    # GD
    path_gd = [start_point.tolist()]
    p_gd = start_point.copy()
    for _ in range(50):
        p_gd -= 0.0012 * grad_rosenbrock(p_gd)
        path_gd.append(p_gd.tolist())
        if np.linalg.norm(grad_rosenbrock(p_gd)) < 1e-3: break

    # Newton
    path_newton = [start_point.tolist()]
    p_newton = start_point.copy()
    for _ in range(6):
        p_newton -= np.linalg.inv(hess_rosenbrock(p_newton)) @ grad_rosenbrock(p_newton)
        path_newton.append(p_newton.tolist())
        if np.linalg.norm(grad_rosenbrock(p_newton)) < 1e-3: break

    return json.dumps({"gd": path_gd, "newton": path_newton})
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_paths = pyodide.globals.get('run_paths');

    // Contours
    const grid = d3.range(-2, 2.1, 0.1).flatMap(i => d3.range(-1, 3.1, 0.1).map(j => ({x: i, y: j, v: (1 - i)**2 + 100 * (j - i*i)**2})));
    const contours = d3.contourDensity().x(d=>x(d.x)).y(d=>y(d.y)).weight(d=>d.v).thresholds(30)(grid);
    svg.append("g").selectAll("path").data(contours).join("path")
        .attr("d", d3.geoPath()).attr("fill", "none").attr("stroke", "var(--color-surface-1)");

    const gdPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const newtonPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

    async function run() {
        runBtn.disabled = true;
        const paths = await run_paths().then(r => JSON.parse(r));

        const animate = (pathEl, data) => {
            pathEl.datum(data).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
            const totalLength = pathEl.node().getTotalLength();
            pathEl.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
                .transition().duration(2000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);
        };

        animate(gdPath, paths.gd);
        animate(newtonPath, paths.newton);

        setTimeout(() => runBtn.disabled = false, 2000);
    }

    runBtn.addEventListener("click", run);
}
