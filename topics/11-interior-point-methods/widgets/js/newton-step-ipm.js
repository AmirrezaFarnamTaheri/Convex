/**
 * Widget: Newton Step in IPM
 *
 * Description: Shows a single Newton step within an interior-point method,
 *              including the centering and affine steps.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initNewtonStepIPM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="newton-step-widget">
            <div class="widget-controls">
                <label>Barrier Param (t): <span id="t-val-ns">1.0</span></label>
                <input type="range" id="t-slider-ns" min="-1" max="2" step="0.1" value="0">
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the red point (xₖ) to see the Newton step components at different locations.</p>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider-ns");
    const tVal = container.querySelector("#t-val-ns");
    const plotContainer = container.querySelector("#plot-container");

    let xk = {x: 0.2, y: 0.2};

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-0.1, 1.1]).range([0, width]);
    const y = d3.scaleLinear().domain([-0.1, 1.1]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Feasible region & central path
    svg.append("rect").attr("x",x(0)).attr("y",y(1)).attr("width",x(1)-x(0)).attr("height",y(0)-y(1)).attr("fill","var(--color-primary-light)").attr("opacity",0.5);
    const central_path = d3.range(0.1, 20, 0.5).map(t_val => [(t_val*1-1)/(2*t_val), (t_val*2-1)/(2*t_val)]);
    svg.append("path").datum(central_path).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-dasharray", "4 4");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

c = np.array([-1.0, -2.0])
A = np.array([[-1,0], [0,-1], [1,0], [0,1]])
b = np.array([0,0,1,1])

def get_newton_step(xk, t):
    x = np.array(xk)
    # Barrier grad and hessian
    #phi = -np.sum(np.log(b - A @ x))
    g_phi = (A.T / (b - A @ x)).sum(axis=1)
    H_phi = A.T @ np.diag(1/((b - A @ x)**2)) @ A

    # Full gradient and hessian of barrier objective
    g = t * c + g_phi
    H = H_phi

    # Newton step dx = -H^-1 * g
    dx = -np.linalg.inv(H) @ g

    # Affine step: dx_aff = - (1/t) * H^-1 * c
    dx_aff = -(1/t) * np.linalg.inv(H) @ (t*c)

    # Centering step: dx_cent = - H^-1 * g_phi
    dx_cent = -np.linalg.inv(H) @ g_phi

    return json.dumps({
        "dx": dx.tolist(),
        "dx_aff": dx_aff.tolist(),
        "dx_cent": dx_cent.tolist(),
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_newton_step = pyodide.globals.get('get_newton_step');

    const k_point = svg.append("circle").attr("r", 5).attr("fill", "var(--color-danger)").style("cursor", "move");
    const aff_vec = svg.append("line").attr("stroke", "var(--color-primary)").attr("marker-end", "url(#arrow)");
    const cent_vec = svg.append("line").attr("stroke", "var(--color-accent)").attr("marker-end", "url(#arrow)");
    const nt_vec = svg.append("line").attr("stroke", "white").attr("stroke-dasharray", "3,3");

    async function update() {
        const t = 10**(+tSlider.value);
        tVal.textContent = t.toExponential(1);

        k_point.attr("cx", x(xk.x)).attr("cy", y(xk.y));

        const step = await get_newton_step([xk.x, xk.y], t).then(r => JSON.parse(r));

        aff_vec.attr("x1", x(xk.x)).attr("y1", y(xk.y)).attr("x2", x(xk.x + step.dx_aff[0])).attr("y2", y(xk.y + step.dx_aff[1]));
        cent_vec.attr("x1", x(xk.x)).attr("y1", y(xk.y)).attr("x2", x(xk.x + step.dx_cent[0])).attr("y2", y(xk.y + step.dx_cent[1]));
        nt_vec.attr("x1", x(xk.x)).attr("y1", y(xk.y)).attr("x2", x(xk.x + step.dx[0])).attr("y2", y(xk.y + step.dx[1]));
    }

    const drag = d3.drag().on("drag", (event) => {
        const [mx,my] = d3.pointer(event, svg.node());
        xk = {x: x.invert(mx), y: y.invert(my)};
        // Ensure point stays inside feasible set
        xk.x = Math.max(1e-3, Math.min(1-1e-3, xk.x));
        xk.y = Math.max(1e-3, Math.min(1-1e-3, xk.y));
        update();
    });
    k_point.call(drag);
    tSlider.addEventListener("input", update);
    update();
}
