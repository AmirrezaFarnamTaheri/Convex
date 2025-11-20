/**
 * Widget: Condition Number Race
 *
 * Description: Compares the convergence of Gradient Descent, Momentum, and Newton's method
 *              on a quadratic function with a user-adjustable condition number.
 * Version: 2.1.0
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initConditionNumber(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    // Initial loading
    container.innerHTML = `
        <div class="widget-container" style="height: 500px;">
             <div class="widget-loading">
                <div class="widget-loading-spinner"></div>
                <div>Initializing Python...</div>
            </div>
        </div>
    `;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Condition Number (κ): <span id="kappa-value" class="widget-value-display">10</span></label>
                    <input type="range" id="kappa-slider" min="1" max="50" step="1" value="10" class="widget-slider">
                </div>
                <div class="widget-control-group">
                    <button id="run-button" class="widget-btn primary">Run Simulation</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>

            <div id="output-container" class="widget-output" style="min-height: 80px;"></div>
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
def solve(kappa, max_iter=200):
    # A = [[kappa, 0], [0, 1]]
    # We define f(x) = 0.5 * x.T A x
    # To make it aligned with typical "valley", let x-axis be 'flat' direction if kappa large?
    # Actually typical is eigenvalues 1 and kappa. If kappa=10, evalues are 1 and 10.
    # Let's align large curvature with x-axis so ellipses are 'tall'.
    # A = [[kappa, 0], [0, 1]] -> 0.5(kappa x^2 + y^2)
    # Condition number = kappa/1 = kappa.

    A = np.array([[1.0, 0.0], [0.0, kappa]]) # Make Y axis steep, X axis flat? No, usually plot X as elongated.
    # Let's make X axis flat: eval 1. Y axis steep: eval kappa.
    # 0.5(x^2 + kappa y^2). Condition number kappa.
    # Wait, usually "elongated" means contours are stretched along an axis.
    # If A = diag(1, kappa), contours x^2 + kappa y^2 = c are ellipses.
    # If kappa=10, y is 'squashed', x is 'long'. Yes.

    x_start = np.array([3.5, 3.5])

    # --- Gradient Descent ---
    # Optimal step size for quadratic is 2 / (L + mu) = 2 / (kappa + 1)
    # Let's pick something slightly suboptimal to show the "zigzag" if we want,
    # or optimal to show best case.
    alpha = 1.9 / (1 + kappa) # Nearly optimal

    x_gd = x_start.copy()
    path_gd = [x_gd.tolist()]
    for _ in range(max_iter):
        grad = A @ x_gd
        if np.linalg.norm(grad) < 1e-3: break
        x_gd = x_gd - alpha * grad
        path_gd.append(x_gd.tolist())

    # --- Momentum ---
    # Polyak's Heavy Ball
    # alpha ~ 4 / (sqrt(L) + sqrt(mu))^2
    # beta ~ ( (sqrt(kappa)-1)/(sqrt(kappa)+1) )^2

    beta = ((np.sqrt(kappa) - 1) / (np.sqrt(kappa) + 1))**2
    alpha_mom = 4 / (np.sqrt(kappa) + 1)**2

    v_mom = np.zeros(2)
    x_mom = x_start.copy()
    path_mom = [x_mom.tolist()]
    for _ in range(max_iter):
        grad = A @ x_mom
        if np.linalg.norm(grad) < 1e-3: break
        v_mom = beta * v_mom + alpha_mom * grad
        x_mom = x_mom - v_mom
        path_mom.append(x_mom.tolist())

    # --- Newton's Method ---
    x_newton = x_start.copy()
    # For a quadratic, Newton converges in one step: x - Hinv g = x - Ainv (Ax) = 0
    path_newton = [x_newton.tolist(), [0.0, 0.0]]

    return {
        "gd": path_gd,
        "momentum": path_mom,
        "newton": path_newton
    }

def get_contours(kappa):
    # f(x,y) = 0.5 * (x^2 + kappa * y^2)
    # We want x to be the 'slow' direction (small eigenvalue 1) and y to be fast (large eigenvalue kappa)
    # So contours x^2 + kappa y^2 = C are ellipses elongated along x.

    vals = []
    nx, ny = 50, 50
    x = np.linspace(-4, 4, nx)
    y = np.linspace(-4, 4, ny)
    # Create grid of values
    for j in range(ny):
        row = []
        for i in range(nx):
             val = 0.5 * (x[i]**2 + kappa * y[j]**2)
             row.append(float(val))
        vals.append(row)
    return vals
`;
    await pyodide.runPythonAsync(pythonCode);
    const pyodideSolve = pyodide.globals.get('solve');
    const pyodideGetContours = pyodide.globals.get('get_contours');

    // --- D3 VISUALIZATION ---
    let svg, xScale, yScale, width, height;

    function setupPlot() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        width = plotContainer.clientWidth - margin.left - margin.right;
        height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        xScale = d3.scaleLinear().domain([-4, 4]).range([0, width]);
        yScale = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

        svg.append("g").attr("class", "contours");
        svg.append("g").attr("class", "paths");
        svg.append("g").attr("class", "points");

        // Legend
        const legend = svg.append("g").attr("transform", `translate(${width - 120}, 20)`);

        const addItem = (color, label, y) => {
            legend.append("rect").attr("x", 0).attr("y", y).attr("width", 12).attr("height", 12).attr("fill", color);
            legend.append("text").attr("x", 16).attr("y", y + 10).text(label).style("font-size", "12px").style("fill", "var(--color-text-main)");
        }

        addItem("var(--color-primary)", "Gradient Descent", 0);
        addItem("var(--color-accent)", "Momentum", 20);
        addItem("#ff6b6b", "Newton", 40);
    }

    function drawContours(kappa) {
        const contoursData = pyodideGetContours(kappa).toJs(); // 2D array
        const n = contoursData.length;
        const m = contoursData[0].length;

        // Flatten
        const values = new Float64Array(n * m);
        for (let j = 0; j < n; ++j) {
            for (let k = 0; k < m; ++k) {
                values[j * m + k] = contoursData[j][k];
            }
        }

        const contours = d3.contours().size([n, m])
            .thresholds(d3.range(0, 20, 1))(values);

        // Grid space [0, n] -> [-4, 4] -> SVG
        const transform = d3.geoTransform({
            point: function(px, py) {
                this.stream.point(xScale(px / n * 8 - 4), yScale(py / m * 8 - 4));
            }
        });
        const path = d3.geoPath().projection(transform);

        svg.select(".contours").selectAll("path").remove();
        svg.select(".contours").selectAll("path").data(contours)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "var(--color-border)")
            .attr("stroke-width", 1)
            .attr("opacity", 0.5);
    }

    function drawPath(pathData, color, name) {
        const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));
        const pathGroup = svg.select(".paths");

        const p = pathGroup.append("path")
            .datum(pathData)
            .attr("class", `path-${name}`)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2.5)
            .attr("stroke-opacity", 0.8);

        const totalLength = p.node().getTotalLength();

        p.attr("stroke-dasharray", totalLength + " " + totalLength)
         .attr("stroke-dashoffset", totalLength)
         .transition()
         .duration(2000)
         .ease(d3.easeLinear)
         .attr("stroke-dashoffset", 0);

        // End point
        svg.select(".points").append("circle")
            .attr("cx", xScale(pathData[pathData.length-1][0]))
            .attr("cy", yScale(pathData[pathData.length-1][1]))
            .attr("r", 0)
            .attr("fill", color)
            .transition().delay(2000).duration(200)
            .attr("r", 4);
    }

    async function run() {
        runButton.disabled = true;
        const kappa = parseFloat(kappaSlider.value);
        kappaValueSpan.textContent = kappa.toFixed(0);

        svg.select(".paths").selectAll("*").remove();
        svg.select(".points").selectAll("*").remove();

        drawContours(kappa);

        const results = pyodideSolve(kappa).toJs({ create_proxies: false });

        drawPath(results.gd, "var(--color-primary)", "gd");
        drawPath(results.momentum, "var(--color-accent)", "momentum");
        drawPath(results.newton, "#ff6b6b", "newton");

        outputContainer.innerHTML = `
            <div style="display: flex; gap: 24px; justify-content: center;">
                <div style="text-align: center;">
                    <div style="color: var(--color-primary); font-weight: bold; font-size: 1.2rem;">${results.gd.length - 1}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">GD Steps</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: var(--color-accent); font-weight: bold; font-size: 1.2rem;">${results.momentum.length - 1}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">Momentum Steps</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #ff6b6b; font-weight: bold; font-size: 1.2rem;">${results.newton.length - 1}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">Newton Steps</div>
                </div>
            </div>
        `;

        setTimeout(() => { runButton.disabled = false; }, 2200);
    }

    // --- INITIALIZATION ---
    setupPlot();

    const resizeObserver = new ResizeObserver(() => {
        setupPlot();
        run();
    });
    resizeObserver.observe(plotContainer);

    kappaSlider.addEventListener("input", () => {
        kappaValueSpan.textContent = kappaSlider.value;
        // Interactive update of contours only?
        // For now let's wait for run
    });

    runButton.addEventListener("click", run);

    // Initial run
    run();
}
