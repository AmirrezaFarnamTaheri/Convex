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
                <div class="control-group">
                    <label>Barrier Param (t): <span id="t-val-ns">1.0</span></label>
                    <input type="range" id="t-slider-ns" min="-1" max="3" step="0.1" value="0">
                </div>
                <button id="ns-reset-btn">Reset</button>
            </div>
            <div id="plot-container"></div>
            <div class="legend">
                <span style="color:var(--color-primary);">―</span> Affine Step
                <span style="color:var(--color-accent); margin-left: 10px;">―</span> Centering Step
                <span style="color:white; margin-left: 10px;">---</span> Full Newton Step
            </div>
            <p class="widget-instructions">Drag the point xₖ (red) and the objective vector (purple).</p>
        </div>
    `;

    const tSlider = container.querySelector("#t-slider-ns");
    const tVal = container.querySelector("#t-val-ns");
    const plotContainer = container.querySelector("#plot-container");
    const resetBtn = container.querySelector("#ns-reset-btn");

    let xk = [0.2, 0.2];
    let c = [-1.0, -2.0];
    const defaultXk = [0.2, 0.2];
    const defaultC = [-1.0, -2.0];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
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

    const visGroup = svg.append("g");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_newton_step(xk_list, t, c_vec):
    x = np.array(xk_list)
    c = np.array(c_vec)
    A = np.array([[-1,0], [0,-1], [1,0], [0,1]])
    b = np.array([0,0,1,1])

    # Barrier grad and hessian
    residuals = b - A @ x
    if np.any(residuals <= 0): return None

    g_phi = (A.T / residuals).sum(axis=1)
    H_phi = A.T @ np.diag(1/(residuals**2)) @ A

    try:
        H_inv = np.linalg.inv(H_phi)
    except np.linalg.LinAlgError:
        return None

    dx_aff = -H_inv @ c
    dx_cent = -H_inv @ g_phi
    dx = dx_aff + (1/t) * dx_cent

    return json.dumps({
        "dx": dx.tolist(),
        "dx_aff": dx_aff.tolist(),
        "dx_cent": dx_cent.tolist(),
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_newton_step = pyodide.globals.get('get_newton_step');

    async function update() {
        const t = 10**(+tSlider.value);
        tVal.textContent = t.toExponential(1);

        visGroup.selectAll("*").remove();

        // Feasible region & central path
        visGroup.append("rect").attr("x",x(0)).attr("y",y(1)).attr("width",x(1)-x(0)).attr("height",y(0)-y(1)).attr("fill","var(--color-primary-light)").attr("opacity",0.3);
        const central_path_data = Array.from({length: 100}, (_, i) => {
            const t_val = 10**(-1 + 4*i/99);
            return [(t_val*(-c[0])-1)/(2*t_val), (t_val*(-c[1])-1)/(2*t_val)];
        });
        visGroup.append("path").datum(central_path_data).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-dasharray", "3 3").attr("opacity",0.7);

        const step = await get_newton_step(xk, t, c).then(r => r ? JSON.parse(r) : null);

        if (step) {
            visGroup.append("line").attr("x1", x(xk[0])).attr("y1", y(xk[1])).attr("x2", x(xk[0] + step.dx_aff[0])).attr("y2", y(xk[1] + step.dx_aff[1])).attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5).attr("marker-end", "url(#arrow-aff)");
            visGroup.append("line").attr("x1", x(xk[0])).attr("y1", y(xk[1])).attr("x2", x(xk[0] + step.dx_cent[0])).attr("y2", y(xk[1] + step.dx_cent[1])).attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5).attr("marker-end", "url(#arrow-cent)");
            visGroup.append("line").attr("x1", x(xk[0])).attr("y1", y(xk[1])).attr("x2", x(xk[0] + step.dx[0])).attr("y2", y(xk[1] + step.dx[1])).attr("stroke", "white").attr("stroke-dasharray", "3 3").attr("stroke-width", 2);
        }

        visGroup.append("circle").attr("cx", x(xk[0])).attr("cy", y(xk[1])).attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                xk = [x.invert(event.x), y.invert(event.y)];
                xk[0] = Math.max(1e-3, Math.min(1-1e-3, xk[0]));
                xk[1] = Math.max(1e-3, Math.min(1-1e-3, xk[1]));
                update();
            }));

        const c_handle_pos = [-c[0] * 0.2, -c[1] * 0.2];
        visGroup.append("circle").attr("cx", x(c_handle_pos[0])).attr("cy", y(c_handle_pos[1])).attr("r", 7).attr("fill", "transparent").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                c = [-x.invert(event.x)*5, -y.invert(event.y)*5];
                update();
            }));
        visGroup.append("line").attr("x1",x(0)).attr("y1",y(0)).attr("x2",x(c_handle_pos[0])).attr("y2",y(c_handle_pos[1])).attr("stroke","purple").attr("stroke-width",2).attr("marker-end","url(#arrow-c)");
    }

    const defs = svg.append("defs");
    [["aff", "var(--color-primary)"], ["cent", "var(--color-accent)"], ["c", "purple"]].forEach(([id, color]) => {
         defs.append("marker").attr("id", `arrow-${id}`).attr("viewBox", "0 -5 10 10")
            .attr("refX", 10).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
            .attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
    });

    tSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        xk = [...defaultXk];
        c = [...defaultC];
        tSlider.value = 0;
        update();
    });
    update();
}
