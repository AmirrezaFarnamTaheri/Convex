/**
 * Widget: First-Order Method Gallery
 *
 * Description: A gallery comparing the paths taken by various first-order methods on the same problem.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initFirstOrderGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="fo-gallery-widget">
            <div class="widget-controls" id="gallery-controls">
                <p>Comparing paths on the Rosenbrock function:</p>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const controlsContainer = container.querySelector("#gallery-controls");
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

def rosenbrock_grad(p):
    x, y = p
    return np.array([-2*(1-x)-400*x*(y-x**2), 200*(y-x**2)])

def run_all_paths():
    start_pos = np.array([-1.5, 2.5])

    # GD
    path_gd = [start_pos]; p = start_pos.copy()
    for _ in range(50): p -= 0.0012 * rosenbrock_grad(p); path_gd.append(p.copy())

    # Momentum
    path_mom = [start_pos]; p = start_pos.copy(); v = np.zeros(2)
    for _ in range(50): v = 0.9 * v + 0.001 * rosenbrock_grad(p); p -= v; path_mom.append(p.copy())

    # Nesterov
    path_nag = [start_pos]; p = start_pos.copy(); v = np.zeros(2)
    for _ in range(50):
        p_ahead = p - 0.9 * v
        v = 0.9 * v + 0.001 * rosenbrock_grad(p_ahead)
        p -= v
        path_nag.append(p.copy())

    # Adam
    path_adam = [start_pos]; p=start_pos.copy(); m=np.zeros(2); v=np.zeros(2)
    for t in range(1, 51):
        grad = rosenbrock_grad(p)
        m = 0.9 * m + 0.1 * grad
        v = 0.999 * v + 0.001 * (grad**2)
        m_hat = m / (1 - 0.9**t)
        v_hat = v / (1 - 0.999**t)
        p -= 0.03 * m_hat / (np.sqrt(v_hat) + 1e-8)
        path_adam.append(p.copy())

    xx, yy = np.meshgrid(np.linspace(-2, 2, 50), np.linspace(-1, 3, 50))
    zz = (1-xx)**2 + 100*(yy-xx**2)**2

    return json.dumps({
        "paths": {"GD": np.array(path_gd).tolist(), "Momentum": np.array(path_mom).tolist(), "Nesterov": np.array(path_nag).tolist(), "Adam": np.array(path_adam).tolist()},
        "contours": zz.flatten().tolist()
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const data = await pyodide.globals.get('run_all_paths')().then(r => JSON.parse(r));

    svg.append("g").selectAll("path").data(d3.contours().size([50,50]).thresholds([2, 5, 10, 25, 50, 100, 200])(data.contours)).join("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
        .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const line = d3.line().x(d=>x(d[0])).y(d=>y(d[1]));
    const methodPaths = {};

    for (const methodName in data.paths) {
        methodPaths[methodName] = svg.append("path")
            .datum(data.paths[methodName])
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", colors(methodName))
            .attr("stroke-width", 2.5);

        const checkbox = document.createElement("label");
        checkbox.innerHTML = `<input type="checkbox" checked value="${methodName}"> <span style="color:${colors(methodName)}">${methodName}</span>`;
        checkbox.querySelector('input').addEventListener('change', (e) => {
            methodPaths[methodName].style("display", e.target.checked ? "block" : "none");
        });
        controlsContainer.appendChild(checkbox);
    }
}
