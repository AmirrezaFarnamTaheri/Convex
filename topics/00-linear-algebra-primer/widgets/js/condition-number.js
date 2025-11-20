/**
 * Widget: Condition Number Race
 *
 * Description: Compares the convergence of Gradient Descent, Momentum, and Newton's method
 *              on a quadratic function with a user-adjustable condition number.
 *              Visualizes the "zig-zag" behavior of GD on ill-conditioned problems.
 * Version: 3.0.0
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
        <div class="widget-container" style="height: 550px;">
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
                 <div class="widget-control-group" style="flex: 1; min-width: 200px;">
                    <label class="widget-label">Condition Number (κ): <span id="kappa-value" class="widget-value-display">10</span></label>
                    <input type="range" id="kappa-slider" min="1" max="50" step="1" value="10" class="widget-slider">
                    <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px;">
                        Controls the "stretch" of the elliptical contours. High κ = Narrow Valley.
                    </div>
                </div>
                <div class="widget-control-group">
                    <label class="widget-label">Simulation Speed</label>
                    <select id="speed-select" class="widget-select">
                        <option value="200">Normal</option>
                        <option value="500" selected>Slow (See Zig-Zag)</option>
                        <option value="1000">Very Slow</option>
                    </select>
                </div>
                <div class="widget-control-group">
                    <button id="run-button" class="widget-btn primary">Run Simulation</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>

            <div id="output-container" class="widget-output">
                <div style="display: flex; gap: 24px; justify-content: center; text-align: center;">
                    <div>
                        <div style="color: var(--color-primary); font-weight: bold; font-size: 1.2rem;" id="gd-steps">-</div>
                        <div style="color: var(--color-text-muted); font-size: 0.8rem;">Gradient Descent</div>
                    </div>
                    <div>
                        <div style="color: var(--color-accent); font-weight: bold; font-size: 1.2rem;" id="mom-steps">-</div>
                        <div style="color: var(--color-text-muted); font-size: 0.8rem;">Momentum</div>
                    </div>
                    <div>
                        <div style="color: #ff6b6b; font-weight: bold; font-size: 1.2rem;" id="newton-steps">-</div>
                        <div style="color: var(--color-text-muted); font-size: 0.8rem;">Newton's Method</div>
                    </div>
                </div>
                <div id="explanation-text" style="margin-top: 12px; font-size: 0.85rem; color: var(--color-text-main); border-top: 1px solid var(--color-border); padding-top: 8px;">
                    Adjust <strong>Condition Number</strong> and click <strong>Run</strong>. Observe how Gradient Descent struggles with high curvature.
                </div>
            </div>
        </div>
    `;

    const kappaSlider = container.querySelector("#kappa-slider");
    const kappaValueSpan = container.querySelector("#kappa-value");
    const speedSelect = container.querySelector("#speed-select");
    const runButton = container.querySelector("#run-button");
    const plotContainer = container.querySelector("#plot-container");
    const gdStepsDisplay = container.querySelector("#gd-steps");
    const momStepsDisplay = container.querySelector("#mom-steps");
    const newtonStepsDisplay = container.querySelector("#newton-steps");
    const explanationText = container.querySelector("#explanation-text");

    // --- PYODIDE SETUP ---
    const pythonCode = `
import numpy as np

def solve(kappa, max_iter=100):
    # Problem: Minimize f(x, y) = 0.5 * (x^2 + kappa * y^2)
    # This corresponds to A = diag(1, kappa).
    # Condition number = kappa / 1 = kappa.
    # Target optimum is (0, 0).

    # Start point: intentionally off-axis to provoke zig-zag
    x_start = np.array([3.5, 2.5])

    # --- Gradient Descent ---
    # Step size alpha. Ideally 1/L to 2/L. L = kappa.
    # To show stable but slow convergence, we pick alpha slightly less than 2/kappa.
    # Let's use alpha = 1.8 / (kappa + 1) for guaranteed convergence but slow.
    # Actually, optimal constant step is 2/(L+mu) = 2/(kappa+1).
    alpha = 1.9 / (kappa + 1)

    x_gd = x_start.copy()
    path_gd = [x_gd.tolist()]
    for _ in range(max_iter):
        grad = np.array([x_gd[0], kappa * x_gd[1]])
        if np.linalg.norm(grad) < 1e-2: break
        x_gd = x_gd - alpha * grad
        path_gd.append(x_gd.tolist())

    # --- Momentum (Polyak) ---
    # Parameters from theory for quadratics
    sqrt_k = np.sqrt(kappa)
    beta = ((sqrt_k - 1) / (sqrt_k + 1))**2
    alpha_mom = 4 / (sqrt_k + 1)**2

    v_mom = np.zeros(2)
    x_mom = x_start.copy()
    path_mom = [x_mom.tolist()]
    for _ in range(max_iter):
        grad = np.array([x_mom[0], kappa * x_mom[1]])
        if np.linalg.norm(grad) < 1e-2: break
        v_mom = beta * v_mom + alpha_mom * grad
        x_mom = x_mom - v_mom
        path_mom.append(x_mom.tolist())

    # --- Newton's Method ---
    # Converges in 1 step for quadratics
    # x_new = x_old - H_inv @ grad
    # H = diag(1, kappa), H_inv = diag(1, 1/kappa)
    path_newton = [x_start.tolist(), [0.0, 0.0]]

    return {
        "gd": path_gd,
        "momentum": path_mom,
        "newton": path_newton
    }

def get_contours(kappa):
    # Generate grid for contour plot
    nx, ny = 50, 50
    x = np.linspace(-4, 4, nx)
    y = np.linspace(-4, 4, ny)
    X, Y = np.meshgrid(x, y)
    # f(x,y) = 0.5 * (x^2 + kappa * y^2)
    Z = 0.5 * (X**2 + kappa * Y**2)
    return Z.tolist()
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
        svg.append("g").attr("class", "points"); // For dots at each step

        // Legend
        const legend = svg.append("g").attr("transform", `translate(${width - 140}, 20)`);
        const addItem = (color, label, y) => {
            legend.append("rect").attr("x", 0).attr("y", y).attr("width", 12).attr("height", 12).attr("fill", color).attr("rx", 2);
            legend.append("text").attr("x", 20).attr("y", y + 10).text(label).style("font-size", "12px").style("fill", "var(--color-text-main)");
        }
        addItem("var(--color-primary)", "Gradient Descent", 0);
        addItem("var(--color-accent)", "Momentum", 20);
        addItem("#ff6b6b", "Newton", 40);
    }

    function drawContours(kappa) {
        const contoursData = pyodideGetContours(kappa).toJs();
        const n = contoursData.length;
        const m = contoursData[0].length;
        const values = new Float64Array(n * m);
        for (let j = 0; j < n; ++j) {
            for (let k = 0; k < m; ++k) values[j * m + k] = contoursData[j][k];
        }

        const contours = d3.contours().size([n, m]).thresholds(d3.range(0, 20, 1))(values);
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
            .attr("opacity", 0.4);
    }

    function animatePath(pathData, color, className, stepDuration) {
        const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));
        const pathGroup = svg.select(".paths");
        const pointsGroup = svg.select(".points");

        // Draw full path initially invisible
        const p = pathGroup.append("path")
            .datum(pathData)
            .attr("class", className)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0) // Hidden start
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round");

        // Animate point by point
        let currentStep = 0;
        const totalSteps = pathData.length;

        function step() {
            if (currentStep >= totalSteps) return;

            // Show path up to current index
            const partialPath = pathData.slice(0, currentStep + 1);
            pathGroup.select(`.${className}-partial`).remove();
            pathGroup.append("path")
                .datum(partialPath)
                .attr("class", `${className}-partial`)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round");

            // Draw dot at current head
            pointsGroup.selectAll(`.${className}-head`).remove();
            pointsGroup.append("circle")
                .attr("class", `${className}-head`)
                .attr("cx", xScale(pathData[currentStep][0]))
                .attr("cy", yScale(pathData[currentStep][1]))
                .attr("r", 4)
                .attr("fill", color)
                .attr("stroke", "var(--color-surface-1)")
                .attr("stroke-width", 1);

            currentStep++;
            if (currentStep < totalSteps) {
                setTimeout(step, stepDuration);
            }
        }
        step();
    }

    async function run() {
        runButton.disabled = true;
        const kappa = parseFloat(kappaSlider.value);
        const delay = parseInt(speedSelect.value);

        kappaValueSpan.textContent = kappa;

        // Clear previous
        svg.select(".paths").selectAll("*").remove();
        svg.select(".points").selectAll("*").remove();
        gdStepsDisplay.textContent = "-";
        momStepsDisplay.textContent = "-";
        newtonStepsDisplay.textContent = "-";

        drawContours(kappa);

        const results = pyodideSolve(kappa).toJs({ create_proxies: false });

        // Animate concurrently
        animatePath(results.gd, "var(--color-primary)", "gd", delay);
        animatePath(results.momentum, "var(--color-accent)", "mom", delay);
        animatePath(results.newton, "#ff6b6b", "newton", delay);

        // Update texts after animation roughly finishes? Or immediately?
        // Let's update immediately so user sees the final count
        gdStepsDisplay.textContent = results.gd.length - 1;
        momStepsDisplay.textContent = results.momentum.length - 1;
        newtonStepsDisplay.textContent = results.newton.length - 1;

        // Update explanation
        if (kappa > 15) {
            explanationText.innerHTML = `At high condition number (κ=${kappa}), <strong>Gradient Descent</strong> oscillates ("zig-zags") because the gradient is nearly orthogonal to the direction of the minimum. <strong>Momentum</strong> dampens these oscillations. <strong>Newton's method</strong> rescales the space and jumps straight to the solution.`;
        } else {
            explanationText.innerHTML = `At low condition number (κ=${kappa}), the problem is "round" (well-conditioned). All methods perform relatively well, though Newton is still exact in one step.`;
        }

        // Re-enable button after estimated time
        const maxSteps = Math.max(results.gd.length, results.momentum.length, results.newton.length);
        setTimeout(() => { runButton.disabled = false; }, maxSteps * delay + 500);
    }

    // --- INITIALIZATION ---
    setupPlot();

    const resizeObserver = new ResizeObserver(() => {
        setupPlot();
        // If we wanted to retain the last run state we'd need to store it.
        // For now just redraw contours at current kappa
        drawContours(parseFloat(kappaSlider.value));
    });
    resizeObserver.observe(plotContainer);

    kappaSlider.addEventListener("input", () => {
        kappaValueSpan.textContent = kappaSlider.value;
        drawContours(parseFloat(kappaSlider.value));
    });

    runButton.addEventListener("click", run);

    // Run once on load
    drawContours(10);
    // Small delay to let layout settle before auto-running or just wait for user?
    // Let's just wait for user to click run, or run once quickly.
    // run(); // Let's wait for user to preserve "Race" feel.
}
