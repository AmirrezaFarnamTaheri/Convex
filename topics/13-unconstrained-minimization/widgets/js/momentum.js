/**
 * Widget: Momentum & Acceleration Methods Visualizer
 *
 * Description: Compares standard gradient descent with momentum-based methods
 *              (Classical Momentum and Nesterov Accelerated Gradient).
 * Version: 1.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import { showLoading, showError, createWidgetHeader, createInstructions } from "../../../../static/js/widget-enhancements.js";

export async function initMomentumVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    showLoading(container, "Loading Pyodide environment...");

    try {
        const pyodide = await getPyodide();

        container.innerHTML = `
            <div class="momentum-visualizer-widget">
                ${createWidgetHeader(
                    "Momentum & Acceleration Methods",
                    "Momentum methods improve gradient descent by accumulating past gradients. Classical momentum adds a velocity term, while Nesterov's accelerated gradient uses a 'look-ahead' step for better convergence. Observe how momentum helps navigate ill-conditioned landscapes and narrow valleys."
                )}
                <div class="widget-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label for="mom-func-select">Objective Function:</label>
                            <select id="mom-func-select">
                                <option value="quadratic">Simple Quadratic</option>
                                <option value="ill_conditioned">Ill-Conditioned Quadratic</option>
                                <option value="rosenbrock">Rosenbrock Function</option>
                                <option value="beale">Beale Function</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label for="lr-slider-mom">
                                Learning Rate (α): <span id="lr-val-mom" class="text-accent font-semibold">0.10</span>
                            </label>
                            <input type="range" id="lr-slider-mom" min="0.01" max="0.5" step="0.01" value="0.1">
                        </div>
                        <div class="control-group">
                            <label for="beta-slider">
                                Momentum (β): <span id="beta-val" class="text-accent font-semibold">0.90</span>
                            </label>
                            <input type="range" id="beta-slider" min="0" max="0.99" step="0.01" value="0.9">
                            <div class="range-labels">
                                <span>0 (No momentum)</span>
                                <span>0.99 (High momentum)</span>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <button id="run-all-btn" class="widget-button" style="margin-right: 10px;">
                            Run All Methods
                        </button>
                        <button id="reset-btn" class="widget-button-secondary">Reset</button>
                    </div>
                </div>
                <div id="plot-container" style="padding: 20px; min-height: 450px;"></div>
                <div style="padding: 0 20px 20px 20px;">
                    ${createInstructions("Click 'Run All Methods' to compare convergence paths. Try different functions and momentum values. Higher momentum helps navigate valleys but can overshoot.")}
                    <div id="convergence-output" class="widget-output mt-2"></div>
                </div>
            </div>
        `;

        const funcSelect = container.querySelector("#mom-func-select");
        const lrSlider = container.querySelector("#lr-slider-mom");
        const lrVal = container.querySelector("#lr-val-mom");
        const betaSlider = container.querySelector("#beta-slider");
        const betaVal = container.querySelector("#beta-val");
        const runBtn = container.querySelector("#run-all-btn");
        const resetBtn = container.querySelector("#reset-btn");
        const plotContainer = container.querySelector("#plot-container");
        const output = container.querySelector("#convergence-output");

        const pythonCode = `
import numpy as np
import json

def run_momentum_comparison(func_name, learning_rate, beta, max_iters=100):
    # Define functions and gradients
    def grad_quadratic(p):
        return np.array([2*p[0], 2*p[1]])

    def func_quadratic(x, y):
        return x**2 + y**2

    def grad_ill_cond(p):
        return np.array([2*p[0], 100*p[1]])

    def func_ill_cond(x, y):
        return x**2 + 50*y**2

    def grad_rosenbrock(p):
        return np.array([
            -2*(1-p[0]) - 400*p[0]*(p[1]-p[0]**2),
            200*(p[1]-p[0]**2)
        ])

    def func_rosenbrock(x, y):
        return (1-x)**2 + 100*(y-x**2)**2

    def grad_beale(p):
        x, y = p[0], p[1]
        dx = 2*(1.5 - x + x*y)*(y - 1) + 2*(2.25 - x + x*y**2)*(y**2 - 1) + 2*(2.625 - x + x*y**3)*(y**3 - 1)
        dy = 2*(1.5 - x + x*y)*x + 2*(2.25 - x + x*y**2)*(2*x*y) + 2*(2.625 - x + x*y**3)*(3*x*y**2)
        return np.array([dx, dy])

    def func_beale(x, y):
        return (1.5 - x + x*y)**2 + (2.25 - x + x*y**2)**2 + (2.625 - x + x*y**3)**2

    func_map = {
        "quadratic": (func_quadratic, grad_quadratic, np.array([3.0, 3.0]), [-4, 4]),
        "ill_conditioned": (func_ill_cond, grad_ill_cond, np.array([3.0, 0.5]), [-4, 4]),
        "rosenbrock": (func_rosenbrock, grad_rosenbrock, np.array([-1.0, 1.0]), [-2.5, 2.5]),
        "beale": (func_beale, grad_beale, np.array([3.0, 0.5]), [-4.5, 4.5])
    }

    func, grad, start, domain = func_map[func_name]

    # Generate contour data
    grid_pts = np.linspace(domain[0], domain[1], 80)
    xx, yy = np.meshgrid(grid_pts, grid_pts)
    zz = func(xx, yy)

    # Helper function to run optimization
    def run_method(method_type):
        p = start.copy()
        v = np.zeros(2)  # Velocity
        path = [p.copy()]

        for i in range(max_iters):
            g = grad(p)

            if method_type == "gd":
                # Standard Gradient Descent
                p = p - learning_rate * g
            elif method_type == "momentum":
                # Classical Momentum
                v = beta * v - learning_rate * g
                p = p + v
            else:  # nesterov
                # Nesterov Accelerated Gradient
                v_prev = v.copy()
                v = beta * v - learning_rate * g
                p = p - beta * v_prev + (1 + beta) * v

            path.append(p.copy())

            # Check convergence
            if np.linalg.norm(g) < 1e-4:
                break
            if np.linalg.norm(p) > 1e4:  # Divergence check
                break

        return [pt.tolist() for pt in path], len(path) - 1

    gd_path, gd_iters = run_method("gd")
    mom_path, mom_iters = run_method("momentum")
    nag_path, nag_iters = run_method("nesterov")

    return json.dumps({
        "contours": zz.tolist(),
        "domain": domain,
        "paths": {
            "gd": gd_path,
            "momentum": mom_path,
            "nesterov": nag_path
        },
        "iterations": {
            "gd": gd_iters,
            "momentum": mom_iters,
            "nesterov": nag_iters
        }
    })
`;

        await pyodide.runPythonAsync(pythonCode);
        const run_momentum_comparison = pyodide.globals.get('run_momentum_comparison');

        let svg, x, y;
        const margin = {top: 20, right: 120, bottom: 40, left: 40};

        function setupPlot() {
            plotContainer.innerHTML = '';
            const width = plotContainer.clientWidth - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            svg = d3.select(plotContainer).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${plotContainer.clientWidth} 400`)
              .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            x = d3.scaleLinear().range([0, width]);
            y = d3.scaleLinear().range([height, 0]);

            svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
            svg.append("g").attr("class", "y-axis");
            svg.append("g").attr("class", "contour-group");
            svg.append("g").attr("class", "paths-group");

            // Legend
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 10}, 0)`);

            const methods = [
                {name: "Gradient Descent", color: "var(--color-primary)"},
                {name: "Momentum", color: "var(--color-accent)"},
                {name: "Nesterov", color: "var(--color-success)"}
            ];

            methods.forEach((method, i) => {
                const g = legend.append("g")
                    .attr("transform", `translate(0, ${i * 25})`);

                g.append("line")
                    .attr("x1", 0).attr("x2", 20)
                    .attr("y1", 0).attr("y2", 0)
                    .attr("stroke", method.color)
                    .attr("stroke-width", 2.5);

                g.append("text")
                    .attr("x", 25).attr("y", 5)
                    .style("font-size", "0.75rem")
                    .attr("fill", "currentColor")
                    .text(method.name);
            });
        }

        async function update() {
            try {
                runBtn.disabled = true;
                runBtn.textContent = "Computing...";

                const lr = +lrSlider.value;
                const beta = +betaSlider.value;
                lrVal.textContent = lr.toFixed(2);
                betaVal.textContent = beta.toFixed(2);

                const resultJson = await run_momentum_comparison(funcSelect.value, lr, beta);
                const data = JSON.parse(resultJson);

                x.domain(data.domain);
                y.domain(data.domain);

                const width = x.range()[1];
                const height = y.range()[0];

                svg.select(".x-axis").call(d3.axisBottom(x));
                svg.select(".y-axis").call(d3.axisLeft(y));

                // Draw contours
                const contourGroup = svg.select(".contour-group");
                contourGroup.selectAll("*").remove();

                const thresholds = funcSelect.value === "rosenbrock" || funcSelect.value === "beale"
                    ? d3.range(0, 10, 0.5).concat(d3.range(10, 100, 10))
                    : d3.range(0, 100, 5);

                const contours = d3.contours().thresholds(thresholds)(data.contours.flat());
                contourGroup.selectAll("path")
                    .data(contours)
                    .join("path")
                    .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 79)))
                    .attr("fill", "none")
                    .attr("stroke", "var(--color-surface-1)")
                    .attr("stroke-width", 0.5)
                    .attr("opacity", 0.7);

                // Draw paths
                const pathsGroup = svg.select(".paths-group");
                pathsGroup.selectAll("*").remove();

                const pathColors = {
                    gd: "var(--color-primary)",
                    momentum: "var(--color-accent)",
                    nesterov: "var(--color-success)"
                };

                Object.entries(data.paths).forEach(([method, path]) => {
                    if (path.length > 0) {
                        // Draw path with animation
                        const line = d3.line()
                            .x(d => x(d[0]))
                            .y(d => y(d[1]));

                        pathsGroup.append("path")
                            .datum(path)
                            .attr("d", line)
                            .attr("fill", "none")
                            .attr("stroke", pathColors[method])
                            .attr("stroke-width", 2.5)
                            .attr("opacity", 0.8)
                            .attr("stroke-dasharray", function() {
                                const length = this.getTotalLength();
                                return `${length} ${length}`;
                            })
                            .attr("stroke-dashoffset", function() {
                                return this.getTotalLength();
                            })
                            .transition()
                            .duration(1500)
                            .ease(d3.easeLinear)
                            .attr("stroke-dashoffset", 0);

                        // Start point
                        pathsGroup.append("circle")
                            .attr("cx", x(path[0][0]))
                            .attr("cy", y(path[0][1]))
                            .attr("r", 5)
                            .attr("fill", pathColors[method])
                            .attr("opacity", 0.5);

                        // End point
                        pathsGroup.append("circle")
                            .attr("cx", x(path[path.length-1][0]))
                            .attr("cy", y(path[path.length-1][1]))
                            .attr("r", 5)
                            .attr("fill", pathColors[method]);
                    }
                });

                // Update output
                const iters = data.iterations;
                const speedup_mom = iters.gd > 0 ? ((iters.gd / iters.momentum) * 100).toFixed(0) : "N/A";
                const speedup_nag = iters.gd > 0 ? ((iters.gd / iters.nesterov) * 100).toFixed(0) : "N/A";

                output.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div>
                            <div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-bottom: 4px;">Gradient Descent</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${iters.gd} <span style="font-size: 0.875rem; font-weight: 400;">iters</span></div>
                        </div>
                        <div>
                            <div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-bottom: 4px;">Momentum</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${iters.momentum} <span style="font-size: 0.875rem; font-weight: 400;">iters</span></div>
                            <div style="font-size: 0.75rem; color: var(--color-success);">↑ ${speedup_mom}% of GD time</div>
                        </div>
                        <div>
                            <div style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-bottom: 4px;">Nesterov</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-success);">${iters.nesterov} <span style="font-size: 0.875rem; font-weight: 400;">iters</span></div>
                            <div style="font-size: 0.75rem; color: var(--color-success);">↑ ${speedup_nag}% of GD time</div>
                        </div>
                    </div>
                    <p style="margin-top: 15px; font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6;">
                        <strong>Insight:</strong> ${getInsight(iters)}
                    </p>
                `;

                runBtn.disabled = false;
                runBtn.textContent = "Run All Methods";

            } catch (error) {
                console.error('Update error:', error);
                output.innerHTML = `<span style="color: var(--color-danger);">Error: ${error.message}</span>`;
                runBtn.disabled = false;
                runBtn.textContent = "Run All Methods";
            }
        }

        function getInsight(iters) {
            const improvement = ((iters.gd - iters.nesterov) / iters.gd * 100).toFixed(0);
            if (improvement > 30) {
                return `Nesterov's method achieved ${improvement}% faster convergence than standard gradient descent. The 'look-ahead' gradient evaluation allows more intelligent navigation of the loss landscape.`;
            } else if (improvement > 10) {
                return `Momentum methods provide moderate speedup (${improvement}%) on this function. The benefit increases for ill-conditioned problems with narrow valleys.`;
            } else {
                return `For well-conditioned problems, momentum provides minimal benefit. Try the ill-conditioned quadratic to see dramatic improvements.`;
            }
        }

        lrSlider.addEventListener("input", () => {
            lrVal.textContent = (+lrSlider.value).toFixed(2);
        });

        betaSlider.addEventListener("input", () => {
            betaVal.textContent = (+betaSlider.value).toFixed(2);
        });

        runBtn.addEventListener("click", update);
        resetBtn.addEventListener("click", () => {
            lrSlider.value = 0.1;
            betaSlider.value = 0.9;
            funcSelect.value = "quadratic";
            setupPlot();
            output.innerHTML = "";
        });

        funcSelect.addEventListener("change", () => {
            // Adjust default learning rate based on function
            if (funcSelect.value === "rosenbrock" || funcSelect.value === "beale") {
                lrSlider.value = 0.01;
            } else {
                lrSlider.value = 0.1;
            }
            lrVal.textContent = (+lrSlider.value).toFixed(2);
        });

        setupPlot();

    } catch (error) {
        console.error('Widget initialization error:', error);
        showError(container, 'Failed to initialize Momentum Visualizer. Please refresh the page.', error);
    }
}
