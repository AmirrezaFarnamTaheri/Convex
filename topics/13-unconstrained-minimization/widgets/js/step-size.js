/**
 * Widget: Step Size Selector
 *
 * Description: Shows how different step sizes (too large, too small, just right) affect the convergence of gradient descent.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initStepSize(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="step-size-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Function:</label> <select id="ss-func-select">
                        <option value="well">Well-conditioned Quadratic</option>
                        <option value="ill">Ill-conditioned Quadratic</option>
                    </select>
                </div>
                <div class="control-group">
                    <label>Step Size (α):</label>
                    <input type="radio" name="alpha-type" value="fixed" checked> Fixed
                    <input type="radio" name="alpha-type" value="auto"> Auto (Backtracking)
                    <input type="range" id="ss-alpha-slider" min="0.01" max="0.2" step="0.005" value="0.05">
                    <span id="ss-alpha-val">0.050</span>
                </div>
                <button id="ss-reset-btn">Reset Start</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point. Adjust the fixed step size or use backtracking line search.</p>
            <div id="ss-output" class="widget-output"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#ss-func-select");
    const alphaSlider = container.querySelector("#ss-alpha-slider");
    const alphaVal = container.querySelector("#ss-alpha-val");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#ss-output");
    const resetBtn = container.querySelector("#ss-reset-btn");

    let startPoint = [3, 3];
    const defaultStartPoint = [3, 3];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-4, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_data(func_name, start_pt_list, alpha_type, alpha_val):
    # --- Function definitions ---
    def func_well(p): return p[0]**2 + 5*p[1]**2
    def grad_well(p): return np.array([2*p[0], 10*p[1]])

    def func_ill(p): return p[0]**2 + 50*p[1]**2
    def grad_ill(p): return np.array([2*p[0], 100*p[1]])

    func_map = {'well': (func_well, grad_well), 'ill': (func_ill, grad_ill)}
    func, grad = func_map[func_name]

    # --- Path calculation ---
    path = [np.array(start_pt_list)]
    p = np.array(start_pt_list)
    status = "Running"
    for i in range(100):
        g = grad(p)
        if np.linalg.norm(g) < 1e-4:
            status = f"Converged in {i} iterations."; break

        if alpha_type == 'fixed':
            alpha = float(alpha_val)
        else: # Backtracking
            alpha, beta_bt, c_bt = 1.0, 0.5, 0.5
            while func(p - alpha * g) > func(p) - c_bt * alpha * np.dot(g, g):
                alpha *= beta_bt

        p_next = p - alpha * g
        path.append(p_next)
        if np.linalg.norm(p_next) > 1e4:
            status = f"Diverged after {i+1} iterations."; break
        p = p_next
    else:
        status = "Max iterations (100) reached."

    # --- Contour calculation ---
    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = func(np.array([xx, yy]))

    return json.dumps({"path": np.array(path).tolist(), "contours": zz.tolist(), "status": status})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_data = pyodide.globals.get('get_data');

    async function update() {
        const funcName = funcSelect.value;
        const alphaType = container.querySelector('input[name="alpha-type"]:checked').value;
        const alpha = +alphaSlider.value;
        alphaVal.textContent = alpha.toFixed(3);
        alphaSlider.style.display = alphaType === 'fixed' ? 'inline-block' : 'none';
        alphaVal.style.display = alphaType === 'fixed' ? 'inline-block' : 'none';

        const data = await get_data(funcName, startPoint, alphaType, alpha).then(r => JSON.parse(r));

        svg.selectAll(".contour, .gd-path, .start-point").remove();

        const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([d3.max(data.contours.flat()), 0]);
        svg.append("g").attr("class", "contour")
            .selectAll("path").data(d3.contours().thresholds(d3.range(0, 200, 5))(data.contours.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 49)))
            .attr("fill", d => colorScale(d.value))
            .attr("stroke", "#000").attr("stroke-width", 0.2);

        svg.append("path").attr("class", "gd-path").datum(data.path)
            .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);

        svg.append("circle").attr("class", "start-point").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1]))
            .attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                startPoint = [x.invert(event.x), y.invert(event.y)];
                update();
            }));

        outputDiv.textContent = data.status;
    }

    container.querySelectorAll('input[name="alpha-type"]').forEach(radio => radio.addEventListener('change', update));
    funcSelect.addEventListener("change", update);
    alphaSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        update();
    });

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            startPoint = [x.invert(mx), y.invert(my)];
            update();
        });

    update();
}
