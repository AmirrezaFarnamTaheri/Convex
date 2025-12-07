/**
 * Widget: Convergence Rate Comparison
 *
 * Description: Plots the convergence rates of different first-order methods.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConvergenceRate(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convergence-rate-widget">
             <div class="widget-controls" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 1rem; margin-bottom: 1rem;">
                <div class="control-group">
                    <label>Cond. Num (κ): <span id="cr-kappa-val">10</span></label>
                    <input type="range" id="cr-kappa-slider" min="1" max="1000" value="10">
                </div>
                <div class="control-group">
                    <label>Dimension (n): <span id="cr-dim-val">10</span></label>
                    <input type="range" id="cr-dim-slider" min="2" max="50" value="10">
                </div>
                <div class="control-group">
                    <label>Momentum (β): <span id="cr-beta-val">0.90</span></label>
                    <input type="range" id="cr-beta-slider" min="0" max="0.99" step="0.01" value="0.9">
                </div>
            </div>
            <button id="cr-run-btn" class="primary-btn">Run Simulation</button>
            <div id="plot-container"></div>
            <div class="widget-controls" id="cr-toggles" style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;"></div>
        </div>
    `;

    const runBtn = container.querySelector("#cr-run-btn");
    const togglesContainer = container.querySelector("#cr-toggles");
    const plotContainer = container.querySelector("#plot-container");
    const kappaSlider = container.querySelector("#cr-kappa-slider");
    const dimSlider = container.querySelector("#cr-dim-slider");
    const betaSlider = container.querySelector("#cr-beta-slider");

    [kappaSlider, dimSlider, betaSlider].forEach(slider => {
        const valEl = container.querySelector(`#${slider.id.replace('slider', 'val')}`);
        slider.addEventListener('input', () => {
            valEl.textContent = (+slider.value).toFixed(slider.step ? 2 : 0);
        });
    });

    const margin = {top: 30, right: 20, bottom: 50, left: 60};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("Convergence Rates of First-Order Methods");
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");
    const pathGroup = svg.append("g");

    xAxis.append("text").text("Iteration").attr("x", width / 2).attr("y", 35).attr("fill", "currentColor").style("font-size", "14px");
    yAxis.append("text").text("f(x) - p* (log scale)").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", -45)
        .attr("text-anchor", "middle").attr("fill", "currentColor").style("font-size", "14px");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def run_optimizers(n, kappa, beta, max_iter=100):
    n, kappa, beta = int(n), float(kappa), float(beta)

    # Define the quadratic problem: f(x) = 0.5 * x.T @ Q @ x
    eigenvalues = np.linspace(1, kappa, n)
    Q = np.diag(eigenvalues)

    def f(x): return 0.5 * x.T @ Q @ x
    def grad(x): return Q @ x

    x0 = np.random.randn(n) * 5

    # --- Gradient Descent ---
    # Optimal step size for quadratic
    alpha_gd = 2.0 / (1 + kappa)
    x_gd = x0.copy()
    path_gd = [f(x_gd)]
    for _ in range(max_iter):
        x_gd = x_gd - alpha_gd * grad(x_gd)
        path_gd.append(f(x_gd))

    # --- Momentum ---
    x_mom = x0.copy()
    v_mom = np.zeros(n)
    path_mom = [f(x_mom)]
    for _ in range(max_iter):
        v_mom = beta * v_mom + grad(x_mom)
        x_mom = x_mom - alpha_gd * v_mom
        path_mom.append(f(x_mom))

    # --- Nesterov Accelerated Gradient ---
    x_nes = x0.copy()
    v_nes = np.zeros(n)
    path_nes = [f(x_nes)]
    for _ in range(max_iter):
        # Lookahead gradient
        grad_lookahead = grad(x_nes - alpha_gd * beta * v_nes)
        v_nes = beta * v_nes + grad_lookahead
        x_nes = x_nes - alpha_gd * v_nes
        path_nes.append(f(x_nes))

    return json.dumps({
        "Gradient Descent": path_gd,
        "Momentum": path_mom,
        "Nesterov": path_nes
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_optimizers = pyodide.globals.get('run_optimizers');

    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const methodPaths = {};

    async function update() {
        runBtn.disabled = true;
        runBtn.textContent = "Simulating...";

        const paths = await run_optimizers(dimSlider.value, kappaSlider.value, betaSlider.value).then(r => JSON.parse(r));
        const all_vals = Object.values(paths).flat();
        const n_iter = paths["Gradient Descent"].length;

        togglesContainer.innerHTML = '';
        pathGroup.selectAll("*").remove();

        const x = d3.scaleLinear().domain([0, n_iter - 1]).range([0, width]);
        const y = d3.scaleLog().domain([d3.min(all_vals, d => d > 1e-8 ? d : 1e-8), d3.max(all_vals)]).range([height, 0]);

        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y).ticks(5, ".0e"));

        const line = d3.line().x((d, i) => x(i)).y(d => y(d));

        for (const methodName in paths) {
            methodPaths[methodName] = pathGroup.append("path")
                .datum(paths[methodName])
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", colors(methodName))
                .attr("stroke-width", 2.5);

            const checkbox = document.createElement("label");
            checkbox.innerHTML = `<input type="checkbox" checked value="${methodName}"> <span style="color:${colors(methodName)}">${methodName}</span>`;
            checkbox.querySelector('input').addEventListener('change', (e) => {
                methodPaths[methodName].style("display", e.target.checked ? "block" : "none");
            });
            togglesContainer.appendChild(checkbox);
        }

        runBtn.disabled = false;
        runBtn.textContent = "Run Simulation";
    }

    runBtn.addEventListener("click", update);
    update();
}
