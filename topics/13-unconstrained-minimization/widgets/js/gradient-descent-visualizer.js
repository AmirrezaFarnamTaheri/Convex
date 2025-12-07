/**
 * Widget: Gradient Descent Visualizer
 *
 * Description: Animates the steps of gradient descent on a 2D contour plot of a selectable function.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initGradientDescentVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="gd-visualizer-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Function:</label>
                    <select id="gd-func-select"></select>
                </div>
                <div class="control-group">
                    <label>Step Size (α): <span id="lr-val">0.10</span></label>
                    <input type="range" id="lr-slider" min="0.01" max="1.0" step="0.01" value="0.1">
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click or drag on the plot to set the starting point.</p>
            <div id="gd-output" class="widget-output"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#gd-func-select");
    const lrSlider = container.querySelector("#lr-slider");
    const lrVal = container.querySelector("#lr-val");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#gd-output");

    const functions = {
        "Simple Quadratic": { domain: [-4, 4] },
        "Ill-Conditioned Quadratic": { domain: [-4, 4] },
        "Rosenbrock": { domain: [-2, 2] },
    };
    Object.keys(functions).forEach(name => funcSelect.add(new Option(name, name)));

    let startPoint = null;
    let isRunning = false;

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");
    const contourGroup = svg.append("g");
    const pathGroup = svg.append("g");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_contours_and_run_gd(func_name, start_point_list, learning_rate, domain_str):
    domain = json.loads(domain_str)

    # Define functions and gradients
    def grad_simple(p): return np.array([2*p[0], 2*p[1]])
    def func_simple(x, y): return x**2 + y**2

    def grad_ill(p): return np.array([2*p[0], 100*p[1]])
    def func_ill(x, y): return x**2 + 50*y**2

    def grad_rosenbrock(p): return np.array([-2*(1-p[0]) - 400*p[0]*(p[1]-p[0]**2), 200*(p[1]-p[0]**2)])
    def func_rosenbrock(x, y): return (1-x)**2 + 100*(y-x**2)**2

    func_map = {
        "Simple Quadratic": (func_simple, grad_simple),
        "Ill-Conditioned Quadratic": (func_ill, grad_ill),
        "Rosenbrock": (func_rosenbrock, grad_rosenbrock)
    }

    # Generate contours
    func, grad = func_map[func_name]
    grid_pts = np.linspace(domain[0], domain[1], 80)
    xx, yy = np.meshgrid(grid_pts, grid_pts)
    zz = func(xx, yy)

    # Run GD if start point is provided
    path = []
    iterations = 0
    status = "Ready"
    if start_point_list:
        p = np.array(start_point_list)
        path.append(p.tolist())
        for i in range(200):
            g = grad(p)
            if np.linalg.norm(g) < 1e-4:
                status = f"Converged in {i} iterations"
                break
            p_next = p - learning_rate * g
            path.append(p_next.tolist())
            if np.linalg.norm(p_next) > 1e4:
                status = f"Diverged after {i+1} iterations"
                break
            p = p_next
        else:
            status = f"Max iterations (200) reached"
        iterations = len(path) -1

    return json.dumps({"contours": zz.tolist(), "path": path, "status": status})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_contours_and_run_gd = pyodide.globals.get('get_contours_and_run_gd');

    async function update() {
        if (isRunning) return;
        isRunning = true;

        const funcInfo = functions[funcSelect.value];
        const sp_list = startPoint ? [startPoint.x, startPoint.y] : null;

        const result = await get_contours_and_run_gd(
            funcSelect.value, sp_list, +lrSlider.value, JSON.stringify(funcInfo.domain)
        ).then(r => JSON.parse(r));

        // Update domain and axes only if they've changed
        if (x.domain()[0] !== funcInfo.domain[0]) {
            x.domain(funcInfo.domain);
            y.domain(funcInfo.domain);
            xAxis.transition().call(d3.axisBottom(x));
            yAxis.transition().call(d3.axisLeft(y));
        }

        contourGroup.selectAll("*").remove();
        const thresholds = funcSelect.value === "Rosenbrock"
            ? d3.range(0, 10, 0.5).concat(d3.range(10, 50, 5), d3.range(50, 400, 20))
            : d3.range(0, 100, 2);
        contourGroup.selectAll("path")
            .data(d3.contours().thresholds(thresholds)(result.contours.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 79)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);

        pathGroup.selectAll("*").remove();
        outputDiv.innerHTML = result.status;

        if (result.path && result.path.length > 0) {
            pathGroup.append("path").datum(result.path)
                .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
                .attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5)
                .call(path => {
                    const totalLength = path.node().getTotalLength();
                    if (totalLength > 0) {
                        path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                           .attr("stroke-dashoffset", totalLength)
                           .transition().duration(1500).ease(d3.easeLinear)
                           .attr("stroke-dashoffset", 0);
                    }
                });
             pathGroup.append("circle").attr("cx", x(result.path[0][0])).attr("cy", y(result.path[0][1])).attr("r", 5).attr("fill", "var(--color-danger)");
        }

        isRunning = false;
    }

    const drag = d3.drag()
        .on("start", (event) => svg.select(".start-handle").remove())
        .on("drag", (event) => {
            startPoint = {x: x.invert(event.x), y: y.invert(event.y)};
            pathGroup.selectAll(".start-handle")
                .data([startPoint]).join("circle").attr("class", "start-handle")
                .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
                .attr("r", 7).attr("fill", "var(--color-danger-light)");
        })
        .on("end", update);

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .call(drag)
        .on("click", (event) => { // For non-drag clicks
             startPoint = {x: x.invert(event.x), y: y.invert(event.y)};
             update();
        });

    funcSelect.addEventListener("change", () => { startPoint=null; pathGroup.selectAll("*").remove(); update(); });
    lrSlider.addEventListener("input", () => {
        lrVal.textContent = (+lrSlider.value).toFixed(2);
        if (startPoint) update();
    });

    update();
}
