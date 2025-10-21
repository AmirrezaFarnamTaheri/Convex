/**
 * Widget: Condition Number Impact on Gradient Descent
 *
 * Description: Visualizes how a high condition number elongates the contours of a function
 *              and slows down gradient descent.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConditionNumberImpact(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="cond-num-impact-widget">
            <div class="widget-controls">
                <label>Condition Number (κ): <span id="kappa-val">10</span></label>
                <input type="range" id="kappa-slider" min="1" max="100" step="1" value="10">
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Adjust the condition number to see how it affects the shape of the function's contours and the convergence path of gradient descent.</p>
        </div>
    `;

    const kappaSlider = container.querySelector("#kappa-slider");
    const kappaVal = container.querySelector("#kappa-val");
    const plotContainer = container.querySelector("#plot-container");

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
    const pythonCode = `
import numpy as np
import json

def get_path_and_contours(kappa):
    alpha = 1.8 / (1 + kappa)
    path = [np.array([3.5, 3.5])]
    for _ in range(100):
        p = path[-1]
        grad = np.array([p[0], kappa * p[1]])
        if np.linalg.norm(grad) < 1e-3: break
        p_next = p - alpha * grad
        path.append(p_next)
        if np.linalg.norm(p_next) > 1e4: break

    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = 0.5 * (xx**2 + kappa * yy**2)

    return json.dumps({"path": np.array(path).tolist(), "contours": zz.flatten().tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_path_and_contours = pyodide.globals.get('get_path_and_contours');

    async function update() {
        const kappa = +kappaSlider.value;
        kappaVal.textContent = kappa;

        const data = await get_path_and_contours(kappa).then(r => JSON.parse(r));

        svg.selectAll(".contour, .gd-path").remove();

        svg.append("g").attr("class", "contour")
            .selectAll("path").data(d3.contours().size([50,50]).thresholds(20)(data.contours)).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

        svg.append("path").attr("class", "gd-path").datum(data.path)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
    }

    kappaSlider.addEventListener("input", update);
    update();
}
