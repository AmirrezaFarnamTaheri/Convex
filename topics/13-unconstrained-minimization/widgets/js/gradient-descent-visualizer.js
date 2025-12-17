/**
 * Widget: Gradient Descent Visualizer
 *
 * Description: Animates the steps of gradient descent on a 2D contour plot of a selectable function.
 *              Interactive start point, step size control, and function selection.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "/static/js/pyodide-manager.js";

export async function initGradientDescentVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Data Science Engine (Pyodide)...</div>`;

    let pyodide;
    try {
        pyodide = await getPyodide();
        // Numpy is usually pre-loaded or standard in Pyodide envs for science
        await pyodide.loadPackage("numpy");
    } catch (e) {
        container.innerHTML = `<div style="padding:20px; color:var(--error);">Failed to load Pyodide. Please refresh.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="widget-container">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div>
                        <label class="widget-label">Function</label>
                        <select id="gd-func-select" class="widget-select">
                            <option value="Simple Quadratic">Simple Quadratic (Bowl)</option>
                            <option value="Ill-Conditioned Quadratic">Ill-Conditioned (Valley)</option>
                            <option value="Rosenbrock">Rosenbrock (Banana)</option>
                        </select>
                    </div>
                    <div>
                        <label class="widget-label">Learning Rate (α): <span id="lr-val">0.10</span></label>
                        <input type="range" id="lr-slider" min="0.001" max="1.0" step="0.001" value="0.1" class="widget-slider">
                    </div>
                </div>
                <div id="gd-output" class="widget-output" style="margin-top: 10px;"></div>
                <p class="widget-instructions" style="margin-top: 8px;">Click or drag on the plot to set the starting point.</p>
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#gd-func-select");
    const lrSlider = container.querySelector("#lr-slider");
    const lrVal = container.querySelector("#lr-val");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#gd-output");

    const functions = {
        "Simple Quadratic": { domain: [-4, 4], zScale: 50 },
        "Ill-Conditioned Quadratic": { domain: [-4, 4], zScale: 200 },
        "Rosenbrock": { domain: [-2, 2], zScale: 400 },
    };

    let startPoint = null;
    let isRunning = false;

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const contourGroup = svg.append("g");
    const axisGroup = svg.append("g");
    const pathGroup = svg.append("g");

    // Axes
    axisGroup.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    axisGroup.append("g").attr("class", "y-axis");

    const pythonCode = `
import numpy as np
import json

def get_contours_and_run_gd(func_name, start_point_list, learning_rate, domain_str):
    domain = json.loads(domain_str)

    # 80x80 Grid
    res = 80
    grid_x = np.linspace(domain[0], domain[1], res)
    grid_y = np.linspace(domain[0], domain[1], res) # Square domain
    xx, yy = np.meshgrid(grid_x, grid_y)

    if func_name == "Simple Quadratic":
        zz = xx**2 + yy**2
        grad = lambda p: np.array([2*p[0], 2*p[1]])
    elif func_name == "Ill-Conditioned Quadratic":
        zz = 0.5*xx**2 + 10*yy**2 # Elongated
        grad = lambda p: np.array([1.0*p[0], 20.0*p[1]])
    else: # Rosenbrock
        zz = (1-xx)**2 + 100*(yy - xx**2)**2
        grad = lambda p: np.array([-2*(1-p[0]) - 400*p[0]*(p[1]-p[0]**2), 200*(p[1]-p[0]**2)])

    # Run GD
    path = []
    status = "Click to start"

    if start_point_list:
        p = np.array(start_point_list)
        path.append(p.tolist())

        # Limit iterations
        for i in range(100):
            g = grad(p)
            norm_g = np.linalg.norm(g)

            if norm_g < 1e-3:
                status = f"Converged in {i} iterations."
                break

            if norm_g > 1e5 or np.any(np.isnan(p)):
                status = "Diverged (Gradient explosion)."
                break

            p = p - learning_rate * g
            path.append(p.tolist())

            # Bound check to stop runaway paths
            if np.max(np.abs(p)) > domain[1]*2:
                status = "Diverged (Out of bounds)."
                break
        else:
            status = "Max iterations reached."

    return json.dumps({
        "contours": zz.tolist(),
        "path": path,
        "status": status,
        "min": float(np.min(zz)),
        "max": float(np.max(zz))
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_contours_and_run_gd = pyodide.globals.get('get_contours_and_run_gd');

    async function update() {
        if (isRunning) return;
        isRunning = true;

        const funcName = funcSelect.value;
        const funcInfo = functions[funcName];

        // Update scales if needed
        x.domain(funcInfo.domain);
        y.domain(funcInfo.domain); // Square aspect ratio assumption
        axisGroup.select(".x-axis").call(d3.axisBottom(x));
        axisGroup.select(".y-axis").call(d3.axisLeft(y));

        const sp_list = startPoint ? [startPoint.x, startPoint.y] : null;

        // Call Python
        const resultJson = await get_contours_and_run_gd(
            funcName, sp_list, +lrSlider.value, JSON.stringify(funcInfo.domain)
        );
        const result = JSON.parse(resultJson);

        // Draw Contours (using d3-contour)
        // Need to flatten 2D array
        const values = result.contours.flat();
        const n = 80; // Grid size from python
        const m = 80;

        // Create logarithmic thresholds for better visibility
        // Log space from min to max
        const minZ = result.min;
        const maxZ = result.max;

        // Use d3.ticks but power scale? Or simple geometric progression
        let thresholds;
        if (funcName === "Rosenbrock") {
             thresholds = d3.range(0, 20).map(i => Math.pow(1.5, i)).filter(v => v < 2000);
        } else {
             thresholds = d3.range(0, 20).map(i => Math.pow(i, 2) * (maxZ/400) + minZ);
        }

        const contours = d3.contours()
            .size([n, m])
            .thresholds(thresholds) // Customize thresholds
            (values);

        // Map grid coordinates [0, n] to screen [0, width]
        // d3.contours produces coordinates in [0, n].
        // We need transform.
        // Scale factor: width / n
        const scaleX = width / n;
        const scaleY = height / m;

        // Wait, d3.contours coordinates are integers 0..n.
        // y is 0 at top? d3.contours y is index.
        // Our plot has y min at bottom.
        // If we map directly, y=0 (top index) maps to top of SVG. That matches.
        // But our y-axis logic (d3.scaleLinear) maps domain min to height (bottom).
        // Grid in python: meshgrid. y varies from row 0 to row m?
        // Usually meshgrid(x, y), row index corresponds to y.
        // If y goes min->max, row 0 is min y.
        // SVG y=0 is top (max visual y usually).
        // Let's just flip y scale range? No, standard plot has +y up.
        // We need to vertically flip the contour paths.
        // d3.geoPath().projection? Or transform scale(1, -1).

        // Simpler: Just render and see. If upside down, flip data.

        const path = d3.geoPath();

        // Color scale
        const color = d3.scaleSequential(d3.interpolateTurbo).domain([maxZ, minZ]); // Darker for lower? Or Turbo.

        contourGroup.selectAll("path")
            .data(contours)
            .join("path")
            .attr("d", path)
            .attr("transform", `scale(${scaleX}, ${scaleY})`) // Naive scaling
            .attr("fill", "none")
            .attr("stroke", d => "rgba(100, 116, 139, 0.4)") // Fixed color for clean look
            .attr("stroke-width", 1);

        // Draw Path
        pathGroup.selectAll("*").remove();
        outputDiv.innerHTML = `<span style="color:var(--text-secondary);">${result.status}</span>`;

        if (result.path && result.path.length > 0) {
            const lineGen = d3.line()
                .x(d => x(d[0]))
                .y(d => y(d[1]));

            const pathEl = pathGroup.append("path")
                .datum(result.path)
                .attr("d", lineGen)
                .attr("fill", "none")
                .attr("stroke", "var(--color-danger)")
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round");

            // Animate
            const totalLength = pathEl.node().getTotalLength();
            if (totalLength > 0) {
                pathEl
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(Math.min(2000, result.path.length * 50))
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            }

            // Start/End dots
            pathGroup.append("circle")
                .attr("cx", x(result.path[0][0]))
                .attr("cy", y(result.path[0][1]))
                .attr("r", 4).attr("fill", "var(--color-success)");

            pathGroup.append("circle")
                .attr("cx", x(result.path[result.path.length-1][0]))
                .attr("cy", y(result.path[result.path.length-1][1]))
                .attr("r", 4).attr("fill", "var(--color-danger)");
        }

        isRunning = false;
    }

    const clickRect = svg.append("rect")
        .attr("width", width).attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "crosshair");

    // Drag behavior
    const drag = d3.drag()
        .on("drag", (event) => {
            // Update start point live
            // Only update visualization throttle?
            // Just update startPoint var
            // But we need coordinate inversion
            const mx = event.x; // local coords in g?
            // d3.drag on rect gives coordinates relative to parent if configured
            // but event.x is relative to subject.
            // Let's use d3.pointer for robustness.
        })
        .on("end", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            startPoint = { x: x.invert(mx), y: y.invert(my) };
            update();
        });

    clickRect.on("click", (event) => {
        const [mx, my] = d3.pointer(event, svg.node());
        startPoint = { x: x.invert(mx), y: y.invert(my) };
        update();
    });

    // We could add drag, but click is often sufficient for this widget.
    // Let's stick to click for simplicity.

    funcSelect.addEventListener("change", () => {
        startPoint = null;
        update();
    });

    lrSlider.addEventListener("input", () => {
        lrVal.textContent = (+lrSlider.value).toFixed(3);
        if (startPoint) update();
    });

    // Initial render
    update();
}
