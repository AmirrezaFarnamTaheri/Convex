/**
 * Widget: Gradient Descent vs. Newton's Method
 *
 * Description: A side-by-side animation comparing the convergence of Gradient Descent and Newton's method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initGDvsNewton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="gd-vs-newton-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>GD Step Size (α): <span id="gdn-alpha-val">0.0012</span></label>
                    <input type="range" id="gdn-alpha-slider" min="0.0001" max="0.002" step="0.0001" value="0.0012">
                </div>
                 <div class="legend">
                    <span style="color:var(--color-primary);">―</span> GD
                    <span style="color:var(--color-accent); margin-left: 10px;">―</span> Newton
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point. The problem is minimizing the Rosenbrock function.</p>
            <div id="gdn-output" class="widget-output"></div>
        </div>
    `;

    const alphaSlider = container.querySelector("#gdn-alpha-slider");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#gdn-output");

    let startPoint = [-1.5, 2.5];

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

def grad_rosenbrock(p):
    x, y = p
    return np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)])

def hess_rosenbrock(p):
    x, y = p
    return np.array([[1200*x**2 - 400*y + 2, -400*x], [-400*x, 200]])

def run_paths(start_point_list, alpha):
    start_point = np.array(start_point_list)

    # GD
    path_gd = [start_point.tolist()]
    p_gd = start_point.copy()
    for _ in range(100):
        grad = grad_rosenbrock(p_gd)
        if np.linalg.norm(grad) < 1e-4: break
        p_gd -= alpha * grad
        path_gd.append(p_gd.tolist())
        if np.linalg.norm(p_gd) > 1e3: break # Divergence

    # Newton
    path_newton = [start_point.tolist()]
    p_newton = start_point.copy()
    newton_info = "OK"
    for _ in range(15):
        grad = grad_rosenbrock(p_newton)
        if np.linalg.norm(grad) < 1e-4: break
        try:
            hess = hess_rosenbrock(p_newton)
            # Damping for stability
            step = np.linalg.solve(hess + 1e-4 * np.eye(2), grad)
            p_newton -= step
            path_newton.append(p_newton.tolist())
            if np.linalg.norm(p_newton) > 1e3:
                newton_info = "Diverged"; break
        except np.linalg.LinAlgError:
            newton_info = "Hessian singular"; break

    return json.dumps({
        "gd": {"path": path_gd, "iter": len(path_gd)-1},
        "newton": {"path": path_newton, "iter": len(path_newton)-1, "info": newton_info}
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_paths = pyodide.globals.get('run_paths');

    const contourGroup = svg.append("g");
    const gdPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
    const newtonPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);
    const startPointHandle = svg.append("circle").attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move");

    async function update() {
        const alpha = +alphaSlider.value;
        container.querySelector("#gdn-alpha-val").textContent = alpha.toFixed(4);

        startPointHandle.attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1]));

        const result = await run_paths(startPoint, alpha).then(r => JSON.parse(r));

        const animate = (pathEl, data) => {
            pathEl.datum(data)
                .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
                .attr("stroke-dasharray", "none")
                .node().getTotalLength(); // to flush
            const totalLength = pathEl.node().getTotalLength();
            pathEl.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition().duration(1000).ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        };

        animate(gdPath, result.gd.path);
        animate(newtonPath, result.newton.path);

        outputDiv.innerHTML = `
            GD iterations: <strong>${result.gd.iter}</strong><br>
            Newton iterations: <strong>${result.newton.iter}</strong>
            (${result.newton.info})
        `;
    }

    // Draw contours once
    pyodide.runPythonAsync(`
import numpy as np
import json
xx, yy = np.meshgrid(np.linspace(-2, 2, 80), np.linspace(-1, 3, 80))
zz = (1-xx)**2 + 100*(yy-xx**2)**2
contours_json = json.dumps(zz.tolist())
    `).then(() => {
        const contours_data = JSON.parse(pyodide.globals.get('contours_json'));
        const thresholds = d3.range(0, 10, 0.5).concat(d3.range(10, 50, 5), d3.range(50, 400, 20));
        contourGroup.selectAll("path")
            .data(d3.contours().thresholds(thresholds)(contours_data.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 79)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);
    });

    startPointHandle.call(d3.drag().on("drag", function(event) {
        startPoint = [x.invert(event.x), y.invert(event.y)];
        update();
    }));
    alphaSlider.addEventListener("input", update);

    update();
}
