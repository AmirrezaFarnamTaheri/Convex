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
            <div id="plot-container" style="position: relative;"></div>
            <div class="widget-controls" id="gallery-controls">
                 <div class="control-group">
                    <label>Step Size (α): <span id="gallery-alpha-val">0.001</span></label>
                    <input type="range" id="gallery-alpha-slider" min="0.0001" max="0.002" step="0.0001" value="0.0012">
                </div>
                 <div class="control-group">
                    <label>Momentum (β): <span id="gallery-beta-val">0.90</span></label>
                    <input type="range" id="gallery-beta-slider" min="0.5" max="0.99" step="0.01" value="0.9">
                </div>
                <button id="gallery-reset-btn">Reset Start</button>
            </div>
             <div class="widget-controls" id="gallery-toggles" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;"></div>
        </div>
    `;

    const togglesContainer = container.querySelector("#gallery-toggles");
    const plotContainer = container.querySelector("#plot-container");
    const alphaSlider = container.querySelector("#gallery-alpha-slider");
    const betaSlider = container.querySelector("#gallery-beta-slider");
    const resetBtn = container.querySelector("#gallery-reset-btn");

    let startPoint = [-1.5, 2.5];
    const defaultStartPoint = [-1.5, 2.5];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
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
    return np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)])

def run_all_paths(start_pos_list, alpha, beta, n_iter=100):
    start_pos = np.array(start_pos_list)
    alpha, beta = float(alpha), float(beta)

    # GD
    path_gd = [start_pos]; p = start_pos.copy()
    for _ in range(n_iter): p -= alpha * rosenbrock_grad(p); path_gd.append(p.copy())

    # Momentum
    path_mom = [start_pos]; p = start_pos.copy(); v = np.zeros(2)
    for _ in range(n_iter): v = beta * v + alpha * rosenbrock_grad(p); p -= v; path_mom.append(p.copy())

    # Nesterov
    path_nag = [start_pos]; p = start_pos.copy(); v = np.zeros(2)
    for _ in range(n_iter):
        p_ahead = p - beta * v
        v = beta * v + alpha * rosenbrock_grad(p_ahead)
        p -= v
        path_nag.append(p.copy())

    # Adam - fixed reasonable parameters for this function
    path_adam = [start_pos]; p=start_pos.copy(); m=np.zeros(2); v_adam=np.zeros(2)
    beta1, beta2, eps = 0.9, 0.999, 1e-8
    alpha_adam = 0.03
    for t in range(1, n_iter + 1):
        grad = rosenbrock_grad(p)
        m = beta1 * m + (1 - beta1) * grad
        v_adam = beta2 * v_adam + (1 - beta2) * (grad**2)
        m_hat = m / (1 - beta1**t)
        v_hat = v_adam / (1 - beta2**t)
        p -= alpha_adam * m_hat / (np.sqrt(v_hat) + eps)
        path_adam.append(p.copy())

    xx, yy = np.meshgrid(np.linspace(-2, 2, 50), np.linspace(-1, 3, 50))
    zz = (1-xx)**2 + 100*(yy-xx**2)**2

    return json.dumps({
        "paths": {"GD": np.array(path_gd).tolist(), "Momentum": np.array(path_mom).tolist(), "Nesterov": np.array(path_nag).tolist(), "Adam": np.array(path_adam).tolist()},
        "contours": zz.tolist()
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_all_paths = pyodide.globals.get('run_all_paths');

    const contourGroup = svg.append("g");
    const pathGroup = svg.append("g");
    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
    const methodPaths = {};

    async function update() {
        const alpha = +alphaSlider.value;
        const beta = +betaSlider.value;
        container.querySelector("#gallery-alpha-val").textContent = alpha.toFixed(4);
        container.querySelector("#gallery-beta-val").textContent = beta.toFixed(2);

        const data = await run_all_paths(startPoint, alpha, beta).then(r => JSON.parse(r));

        contourGroup.selectAll("path").data(d3.contours().thresholds(np.logspace(0, 3, 15))(data.contours.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 49).translate([0.5, 0.5])))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);

        pathGroup.selectAll("*").remove();

        for (const methodName in data.paths) {
            const path = pathGroup.append("path")
                .datum(data.paths[methodName])
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", colors(methodName))
                .attr("stroke-width", 2);
            methodPaths[methodName].path = path;
            path.style("display", methodPaths[methodName].visible ? "block" : "none");
        }

        pathGroup.append("circle").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1])).attr("r", 7)
            .attr("fill", "var(--color-primary)").style("cursor", "move").call(d3.drag().on("drag", function(event) {
                startPoint = [x.invert(event.x), y.invert(event.y)];
                update();
            }));
    }

    // Initial setup of toggles
    ["GD", "Momentum", "Nesterov", "Adam"].forEach(methodName => {
        methodPaths[methodName] = { path: null, visible: true };
        const checkbox = document.createElement("label");
        checkbox.innerHTML = `<input type="checkbox" checked value="${methodName}"> <span style="color:${colors(methodName)}">${methodName}</span>`;
        checkbox.querySelector('input').addEventListener('change', (e) => {
            methodPaths[methodName].visible = e.target.checked;
            if (methodPaths[methodName].path) {
                methodPaths[methodName].path.style("display", e.target.checked ? "block" : "none");
            }
        });
        togglesContainer.appendChild(checkbox);
    });

    [alphaSlider, betaSlider].forEach(s => s.addEventListener("input", update));
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        update();
    });

    // Using np.logspace for better contour visualization on Rosenbrock
    pyodide.runPython('import numpy as np');
    const np = pyodide.globals.get('np');

    update();
}
