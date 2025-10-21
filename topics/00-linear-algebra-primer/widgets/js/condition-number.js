/**
 * Widget: Condition Number Race
 *
 * Description: Compares the convergence of Gradient Descent, Momentum, and Newton's method
 *              on a quadratic function with a user-adjustable condition number.
 * Version: 2.0.0
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initConditionNumber(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="condition-number-widget">
            <div class="widget-controls">
                <label for="kappa-slider">Condition Number (κ): <span id="kappa-value">10</span></label>
                <input type="range" id="kappa-slider" min="1" max="100" step="1" value="10" style="width: 100%;">
                <button id="run-button" style="margin-top: 10px;">Run Simulation</button>
            </div>
            <div id="plot-container" style="width: 100%; height: 400px; margin-top: 15px;"></div>
            <div id="output-container" class="widget-output" style="margin-top: 15px;"></div>
        </div>
    `;

    const kappaSlider = container.querySelector("#kappa-slider");
    const kappaValueSpan = container.querySelector("#kappa-value");
    const runButton = container.querySelector("#run-button");
    const plotContainer = container.querySelector("#plot-container");
    const outputContainer = container.querySelector("#output-container");

    // --- PYODIDE SETUP ---
    const pythonCode = `
import numpy as np
def solve(kappa, max_iter=100):
    A = np.array([[kappa, 0], [0, 1]])
    x_start = np.array([3.5, 3.5])

    # --- Gradient Descent ---
    alpha = 1.8 / (1 + kappa)
    x_gd = x_start.copy()
    path_gd = [x_gd.tolist()]
    for _ in range(max_iter):
        grad = A @ x_gd
        if np.linalg.norm(grad) < 1e-4: break
        x_gd = x_gd - alpha * grad
        path_gd.append(x_gd.tolist())

    # --- Momentum ---
    beta = 0.9
    v_mom = np.zeros(2)
    x_mom = x_start.copy()
    path_mom = [x_mom.tolist()]
    for _ in range(max_iter):
        grad = A @ x_mom
        if np.linalg.norm(grad) < 1e-4: break
        v_mom = beta * v_mom + alpha * grad
        x_mom = x_mom - v_mom
        path_mom.append(x_mom.tolist())

    # --- Newton's Method ---
    x_newton = x_start.copy()
    # For a quadratic, Newton converges in one step
    path_newton = [x_newton.tolist(), [0, 0]]

    return {
        "gd": path_gd,
        "momentum": path_mom,
        "newton": path_newton
    }

def get_contours(kappa):
    f = lambda x, y: 0.5 * (kappa * x**2 + y**2)
    x_range = np.linspace(-4, 4, 40)
    y_range = np.linspace(-4, 4, 40)
    X, Y = np.meshgrid(x_range, y_range)
    Z = f(X, Y)
    return Z.tolist()
`;
    await pyodide.runPythonAsync(pythonCode);
    const pyodideSolve = pyodide.globals.get('solve');
    const pyodideGetContours = pyodide.globals.get('get_contours');

    // --- D3 VISUALIZATION ---
    let svg, xScale, yScale, width, height;

    function setupPlot() {
        plotContainer.innerHTML = '';
        const margin = { top: 30, right: 20, bottom: 40, left: 40 };
        width = plotContainer.clientWidth - margin.left - margin.right;
        height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        xScale = d3.scaleLinear().domain([-4, 4]).range([0, width]);
        yScale = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
        svg.append("g").call(d3.axisLeft(yScale));

        svg.append("g").attr("class", "contours");
        svg.append("g").attr("class", "paths");
        svg.append("g").attr("class", "points");
    }

    function drawContours(kappa) {
        const contoursData = pyodideGetContours(kappa).toJs();
        const contours = d3.contours().size([40, 40])
            .thresholds(d3.range(0, 50, 2.5))(contoursData.flat());

        const geoPath = d3.geoPath(d3.geoIdentity()
            .scale(width / 39)
            .translate([xScale(-3.95) - xScale(-4), yScale(3.95) - yScale(4)]));

        svg.select(".contours").selectAll("path").data(contours)
            .join("path")
            .attr("d", geoPath)
            .attr("fill", "none")
            .attr("stroke", "var(--color-surface-1)");
    }

    function animatePath(path, color, name) {
        const pathGroup = svg.select(".paths");
        const pointsGroup = svg.select(".points");

        const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));

        pathGroup.append("path").datum(path)
            .attr("class", `path-${name}`)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2);

        const totalLength = pathGroup.select(`.path-${name}`).node().getTotalLength();

        pathGroup.select(`.path-${name}`)
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(2000).ease(d3.easeSinInOut)
            .attr("stroke-dashoffset", 0);
    }

    async function run() {
        const kappa = parseFloat(kappaSlider.value);
        kappaValueSpan.textContent = kappa.toFixed(0);

        svg.selectAll(".paths > *, .points > *").remove();
        drawContours(kappa);

        const results = pyodideSolve(kappa).toJs({ create_proxies: false });

        animatePath(results.gd, "var(--color-primary)", "gd");
        animatePath(results.momentum, "var(--color-accent)", "momentum");
        animatePath(results.newton, "#ff6b6b", "newton");

        outputContainer.innerHTML = `
            <h4>Convergence Results:</h4>
            <ul>
                <li style="color: var(--color-primary);"><b>Gradient Descent:</b> ${results.gd.length - 1} iterations</li>
                <li style="color: var(--color-accent);"><b>Momentum:</b> ${results.momentum.length - 1} iterations</li>
                <li style="color: #ff6b6b;"><b>Newton's Method:</b> ${results.newton.length - 1} iteration</li>
            </ul>
        `;
    }

    // --- INITIALIZATION ---
    setupPlot();
    new ResizeObserver(() => {
        setupPlot();
        run();
    }).observe(plotContainer);

    kappaSlider.addEventListener("input", () => kappaValueSpan.textContent = kappaSlider.value);
    runButton.addEventListener("click", run);

    run();
}
