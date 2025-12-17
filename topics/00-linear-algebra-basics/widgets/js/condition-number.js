/**
 * Widget: Condition Number Race
 *
 * Description: Compares the convergence of Gradient Descent, Momentum, and Newton's method
 *              on a quadratic function with a user-adjustable condition number.
 *              Visualizes the "zig-zag" behavior of GD on ill-conditioned problems.
 * Version: 3.1.0 (Styled)
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initConditionNumber(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

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
                 <div class="control-group" style="flex: 1; min-width: 200px;">
                    <label style="display:flex; justify-content:space-between; font-size:var(--text-xs); color:var(--text-tertiary);">
                        Condition Number (κ) <span id="kappa-value" style="font-weight:600; color:var(--text-primary);">10</span>
                    </label>
                    <input type="range" id="kappa-slider" min="1" max="50" step="1" value="10" style="width:100%;">
                    <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-top: 4px;">
                        Controls elliptical "stretch". High κ = Narrow Valley.
                    </div>
                </div>
                <div class="control-group">
                    <label style="font-size:var(--text-xs); color:var(--text-tertiary);">Simulation Speed</label>
                    <select id="speed-select" style="width:100%; padding:4px;">
                        <option value="200">Normal</option>
                        <option value="500" selected>Slow (See Zig-Zag)</option>
                        <option value="1000">Very Slow</option>
                    </select>
                </div>
                <div class="control-group" style="align-self: flex-end;">
                    <button id="run-button" class="btn btn-primary btn-sm" style="width:100%;">Run Simulation</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 400px; background: var(--bg-surface-1);"></div>

            <div id="output-container" class="widget-output">
                <div style="display: flex; gap: 24px; justify-content: center; text-align: center; margin-bottom:12px;">
                    <div>
                        <div style="color: var(--primary-500); font-weight: 700; font-size: 1.25rem;" id="gd-steps">-</div>
                        <div style="color: var(--text-secondary); font-size: 0.75rem; text-transform:uppercase; letter-spacing:0.5px;">Gradient Descent</div>
                    </div>
                    <div>
                        <div style="color: var(--accent-500); font-weight: 700; font-size: 1.25rem;" id="mom-steps">-</div>
                        <div style="color: var(--text-secondary); font-size: 0.75rem; text-transform:uppercase; letter-spacing:0.5px;">Momentum</div>
                    </div>
                    <div>
                        <div style="color: #ef4444; font-weight: 700; font-size: 1.25rem;" id="newton-steps">-</div>
                        <div style="color: var(--text-secondary); font-size: 0.75rem; text-transform:uppercase; letter-spacing:0.5px;">Newton's Method</div>
                    </div>
                </div>
                <div id="explanation-text" style="font-size: 0.85rem; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 8px; line-height:1.5;">
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
    x_start = np.array([3.5, 2.5])
    alpha = 1.9 / (kappa + 1) # Conservative step size

    # GD
    x_gd = x_start.copy()
    path_gd = [x_gd.tolist()]
    for _ in range(max_iter):
        grad = np.array([x_gd[0], kappa * x_gd[1]])
        if np.linalg.norm(grad) < 1e-2: break
        x_gd = x_gd - alpha * grad
        path_gd.append(x_gd.tolist())

    # Momentum
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

    # Newton (1 step for quadratic)
    path_newton = [x_start.tolist(), [0.0, 0.0]]

    return { "gd": path_gd, "momentum": path_mom, "newton": path_newton }

def get_contours(kappa):
    nx, ny = 50, 50
    x = np.linspace(-4, 4, nx)
    y = np.linspace(-4, 4, ny)
    X, Y = np.meshgrid(x, y)
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

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale).ticks(5));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(5));

        // Layers
        svg.append("g").attr("class", "contours");
        svg.append("g").attr("class", "paths");
        svg.append("g").attr("class", "points"); 

        // Legend
        const legend = svg.append("g").attr("transform", `translate(${width - 120}, 10)`);
        const addItem = (color, label, y) => {
            legend.append("rect").attr("x", 0).attr("y", y).attr("width", 10).attr("height", 10).attr("fill", color).attr("rx", 2);
            legend.append("text").attr("x", 16).attr("y", y + 9).text(label).style("font-size", "10px").style("fill", "var(--text-secondary)").style("font-family", "var(--font-sans)");
        }
        addItem("var(--primary-500)", "Gradient Descent", 0);
        addItem("var(--accent-500)", "Momentum", 16);
        addItem("#ef4444", "Newton", 32);
    }

    function drawContours(kappa) {
        const contoursData = pyodideGetContours(kappa).toJs();
        const n = contoursData.length;
        const m = contoursData[0].length;
        const values = new Float64Array(n * m);
        for (let j = 0; j < n; ++j) for (let k = 0; k < m; ++k) values[j * m + k] = contoursData[j][k];

        const contours = d3.contours().size([n, m]).thresholds(d3.range(0, 20, 1.5))(values);
        const transform = d3.geoTransform({
            point: function(px, py) { this.stream.point(xScale(px / n * 8 - 4), yScale(py / m * 8 - 4)); }
        });
        const path = d3.geoPath().projection(transform);

        svg.select(".contours").selectAll("path").remove();
        svg.select(".contours").selectAll("path").data(contours)
            .enter().append("path").attr("d", path)
            .attr("fill", "none").attr("stroke", "var(--border-strong)").attr("stroke-width", 1).attr("opacity", 0.3);
    }

    function animatePath(pathData, color, className, stepDuration) {
        const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]));
        const pathGroup = svg.select(".paths");
        const pointsGroup = svg.select(".points");

        let currentStep = 0;
        const totalSteps = pathData.length;

        function step() {
            if (currentStep >= totalSteps) return;
            const partialPath = pathData.slice(0, currentStep + 1);
            
            // Remove old partial path
            pathGroup.select(`.${className}-partial`).remove();
            
            pathGroup.append("path")
                .datum(partialPath).attr("class", `${className}-partial`)
                .attr("d", line).attr("fill", "none")
                .attr("stroke", color).attr("stroke-width", 2).attr("stroke-linejoin", "round");

            pointsGroup.selectAll(`.${className}-head`).remove();
            pointsGroup.append("circle")
                .attr("class", `${className}-head`)
                .attr("cx", xScale(pathData[currentStep][0])).attr("cy", yScale(pathData[currentStep][1]))
                .attr("r", 3).attr("fill", color).attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 1);

            currentStep++;
            if (currentStep < totalSteps) setTimeout(step, stepDuration);
        }
        step();
    }

    async function run() {
        runButton.disabled = true;
        runButton.textContent = "Running...";
        const kappa = parseFloat(kappaSlider.value);
        const delay = parseInt(speedSelect.value);

        kappaValueSpan.textContent = kappa;
        svg.select(".paths").selectAll("*").remove();
        svg.select(".points").selectAll("*").remove();
        gdStepsDisplay.textContent = "-";
        momStepsDisplay.textContent = "-";
        newtonStepsDisplay.textContent = "-";

        drawContours(kappa);
        const results = pyodideSolve(kappa).toJs({ create_proxies: false });

        animatePath(results.gd, "var(--primary-500)", "gd", delay);
        animatePath(results.momentum, "var(--accent-500)", "mom", delay);
        animatePath(results.newton, "#ef4444", "newton", delay);

        gdStepsDisplay.textContent = results.gd.length - 1;
        momStepsDisplay.textContent = results.momentum.length - 1;
        newtonStepsDisplay.textContent = results.newton.length - 1;

        if (kappa > 15) {
            explanationText.innerHTML = `At high condition number (κ=${kappa}), <strong style="color:var(--primary-500)">Gradient Descent</strong> oscillates ("zig-zags") because the gradient is nearly orthogonal to the optimal direction. <strong style="color:var(--accent-500)">Momentum</strong> dampens these oscillations. <strong style="color:#ef4444">Newton</strong> jumps straight to the solution.`;
        } else {
            explanationText.innerHTML = `At low condition number (κ=${kappa}), the problem is "round" (well-conditioned). All methods perform relatively well.`;
        }

        const maxSteps = Math.max(results.gd.length, results.momentum.length, results.newton.length);
        setTimeout(() => { 
            runButton.disabled = false; 
            runButton.textContent = "Run Simulation";
        }, maxSteps * delay + 500);
    }

    setupPlot();
    const resizeObserver = new ResizeObserver(() => {
        setupPlot();
        drawContours(parseFloat(kappaSlider.value));
    });
    resizeObserver.observe(plotContainer);

    kappaSlider.addEventListener("input", () => {
        kappaValueSpan.textContent = kappaSlider.value;
        drawContours(parseFloat(kappaSlider.value));
    });

    runButton.addEventListener("click", run);
    drawContours(10);
}
