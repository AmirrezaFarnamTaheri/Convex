/**
 * Widget: Null-Space Method Visualizer
 *
 * Description: Visualizes how the null-space method works for a simple equality-constrained QP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initNullSpaceVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="null-space-widget">
            <div class="widget-controls">
                <p><strong>Problem:</strong> min ½(x-c)ᵀP(x-c) s.t. Ax=b</p>
                <div class="control-group">
                    <label>P₀₀: <span id="ns-p00-val">1.0</span></label>
                    <input type="range" id="ns-p00-slider" min="0.2" max="5" step="0.1" value="1.0">
                </div>
                <div class="control-group">
                    <label>P₁₁: <span id="ns-p11-val">1.0</span></label>
                    <input type="range" id="ns-p11-slider" min="0.2" max="5" step="0.1" value="1.0">
                </div>
                 <p>Drag the unconstrained minimum (red circle).</p>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const p00Slider = container.querySelector("#ns-p00-slider");
    const p11Slider = container.querySelector("#ns-p11-slider");

    let center = [0, 0];
    const A = np.array([[1, 2]]);
    const b = np.array([2]);

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-3, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    await pyodide.loadPackage(["scipy", "numpy"]);
    const pythonCode = `
import numpy as np
from scipy.linalg import null_space
import json

def solve_null_space(P_diag, c_list, A_list, b_list):
    P = np.diag(P_diag)
    c = np.array(c_list)
    q = -P @ c
    A = np.array(A_list)
    b = np.array(b_list)

    x_p = np.linalg.lstsq(A, b, rcond=None)[0]
    F = null_space(A)

    if F.shape[1] == 0:
        return json.dumps({"x_p": x_p.tolist(), "F": [], "x_star": x_p.tolist(), "c": c.tolist()})

    P_hat = F.T @ P @ F
    q_hat = F.T @ (P @ x_p + q)

    try:
        z_star = -np.linalg.inv(P_hat) @ q_hat
    except np.linalg.LinAlgError: # If P_hat is singular
        return json.dumps({"x_p": x_p.tolist(), "F": [], "x_star": x_p.tolist(), "c": c.tolist()})

    x_star = x_p + F @ z_star

    return json.dumps({
        "c": c.tolist(),
        "x_p": x_p.tolist(),
        "F": F.T.tolist()[0],
        "z_F": (F @ z_star).tolist(),
        "x_star": x_star.tolist()
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_null_space = pyodide.globals.get('solve_null_space');
    const np = pyodide.globals.get('np');

    const visGroup = svg.append("g");

    async function update() {
        const p00 = +p00Slider.value;
        const p11 = +p11Slider.value;
        container.querySelector("#ns-p00-val").textContent = p00.toFixed(1);
        container.querySelector("#ns-p11-val").textContent = p11.toFixed(1);

        const P_diag = [p00, p11];
        const sol = await solve_null_space(P_diag, center, A.toJs(), b.toJs()).then(r => JSON.parse(r));

        visGroup.selectAll("*").remove();

        // Contours
        const xx = np.linspace(-3, 3, 50);
        const yy = np.linspace(-3, 3, 50);
        const [XX, YY] = np.meshgrid(xx, yy);
        const ZZ = 0.5 * (P_diag[0]*(XX - center[0])**2 + P_diag[1]*(YY - center[1])**2);
        const contours = d3.contours().thresholds(10)(ZZ.toJs().flat());
        visGroup.append("g").selectAll("path").data(contours)
          .join("path").attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
          .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);

        // Constraint
        const [a1, a2] = A.toJs()[0];
        const b1 = b.toJs()[0];
        const p1 = [-3, (b1 - a1*(-3))/a2];
        const p2 = [3, (b1 - a1*3)/a2];
        visGroup.append("line").attr("x1",x(p1[0])).attr("y1",y(p1[1])).attr("x2",x(p2[0])).attr("y2",y(p2[1])).attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

        // Solution vectors
        const [c, xp, zF, xstar] = [sol.c, sol.x_p, sol.z_F, sol.x_star];
        visGroup.append("line").attr("x1", x(0)).attr("y1", y(0)).attr("x2", x(xp[0])).attr("y2", y(xp[1])).attr("stroke", "orange").attr("stroke-width", 2).attr("marker-end", "url(#arrow-orange)").append("title").text("x_p");
        if (zF) {
            visGroup.append("line").attr("x1", x(xp[0])).attr("y1", y(xp[1])).attr("x2", x(xstar[0])).attr("y2", y(xstar[1])).attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("marker-end", "url(#arrow-accent)").append("title").text("Fz*");
        }
        visGroup.append("line").attr("x1", x(0)).attr("y1", y(0)).attr("x2", x(xstar[0])).attr("y2", y(xstar[1])).attr("stroke", "var(--color-success)").attr("stroke-width", 3).attr("marker-end", "url(#arrow-success)").append("title").text("x*");

        // Draggable center handle
        visGroup.append("circle").attr("cx", x(c[0])).attr("cy", y(c[1])).attr("r", 7).attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                center = [x.invert(event.x), y.invert(event.y)];
                update();
            }));
    }

    const defs = svg.append("defs");
    ["orange", "var(--color-accent)", "var(--color-success)"].forEach((color, i) => {
        defs.append("marker").attr("id", `arrow-${color.replace(/[^a-zA-Z0-9]/g, '')}`).attr("viewBox", "0 -5 10 10")
        .attr("refX", 10).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
    });

    [p00Slider, p11Slider].forEach(s => s.addEventListener("input", update));
    update();
}
