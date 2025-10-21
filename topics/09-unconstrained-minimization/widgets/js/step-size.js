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
                <label>Function:</label> <select id="ss-func-select">
                    <option value="x**2 + 5*y**2">Well-conditioned</option>
                    <option value="x**2 + 25*y**2">Ill-conditioned</option>
                </select>
                <label>Step Size (α): <span id="ss-alpha-val">0.05</span></label>
                <input type="range" id="ss-alpha-slider" min="0.01" max="0.1" step="0.005" value="0.05">
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to set a start point. Adjust the step size to see convergence, slow progress, or divergence.</p>
        </div>
    `;

    const funcSelect = container.querySelector("#ss-func-select");
    const alphaSlider = container.querySelector("#ss-alpha-slider");
    const alphaVal = container.querySelector("#ss-alpha-val");
    const plotContainer = container.querySelector("#plot-container");

    let startPoint = {x: 3, y: 3};

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
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
    await pyodide.loadPackage("sympy");

    const pythonCode = `
import sympy
import numpy as np
import json

x, y = sympy.symbols('x y')

def get_gd_path_and_contours(f_str, start_pt, alpha):
    f = sympy.sympify(f_str)
    grad_f = sympy.lambdify((x, y), [sympy.diff(f, x), sympy.diff(f, y)], 'numpy')

    path = [np.array(start_pt)]
    p = np.array(start_pt)
    for _ in range(50):
        grad = np.array(grad_f(p[0], p[1]))
        p_next = p - alpha * grad
        path.append(p_next)
        if np.linalg.norm(p_next - p) < 1e-3 or np.linalg.norm(p_next) > 1e4:
            break
        p = p_next

    f_np = sympy.lambdify((x, y), f, 'numpy')
    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = f_np(xx, yy)

    return json.dumps({"path": np.array(path).tolist(), "contours": zz.flatten().tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_gd_path_and_contours = pyodide.globals.get('get_gd_path_and_contours');

    async function update() {
        const funcStr = funcSelect.value;
        const alpha = +alphaSlider.value;
        alphaVal.textContent = alpha.toFixed(3);

        const data = await get_gd_path_and_contours(funcStr, [startPoint.x, startPoint.y], alpha).then(r => JSON.parse(r));

        svg.selectAll(".contour").remove();
        svg.append("g").attr("class", "contour")
            .selectAll("path").data(d3.contours().size([50,50]).thresholds(20)(data.contours)).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

        svg.selectAll(".gd-path").remove();
        svg.append("path").attr("class", "gd-path").datum(data.path)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        svg.selectAll(".start-point").remove();
        svg.append("circle").attr("class", "start-point").attr("cx", x(startPoint.x)).attr("cy", y(startPoint.y)).attr("r", 5).attr("fill", "var(--color-danger)");
    }

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            startPoint = {x: x.invert(mx), y: y.invert(my)};
            update();
        });

    funcSelect.addEventListener("change", update);
    alphaSlider.addEventListener("input", update);
    update();
}
