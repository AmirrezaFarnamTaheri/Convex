/**
 * Widget: Primal-Dual IPM Visualizer
 *
 * Description: Visualizes the convergence of a primal-dual interior-point method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initPrimalDualIpm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="pd-ipm-widget">
            <div class="widget-controls">
                <button id="run-pd-ipm-btn">Run Primal-Dual IPM</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-pd-ipm-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Feasible Region & Objective
    const feasible_poly = [[0,0], [3.5,0], [2,3], [0,3]];
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasible_poly)+"Z").attr("fill", "var(--color-primary-light)").attr("opacity", 0.5);
    const contours = d3.range(1, 7, 1).map(c => [[c,0], [0,c]]);
    svg.append("g").selectAll("path").data(contours).join("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)").attr("stroke-dasharray", "3,3");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

# min -x-y s.t. x+2y<=8, 2x+y<=7, x,y>=0
def solve_pd_ipm():
    c = np.array([-1.,-1.])
    A = np.array([[1.,2.], [2.,1.], [-1.,0.], [0.,-1.]])
    b = np.array([8., 7., 0., 0.])

    x = np.array([1., 1.]) # Primal vars
    l = np.array([1., 1., 1., 1.]) # Dual vars for inequality
    s = b - A @ x # Slack vars

    path = [x.tolist()]
    mu = 10 # Duality measure

    for _ in range(15):
        # Affine scaling system
        rd = A.T @ l + c
        rp = A @ x + s - b
        rc = s * l

        # Build KKT system matrix
        KKT = np.block([
            [np.zeros((2,2)), A.T, np.eye(2)],
            [A, np.zeros((4,4)), np.eye(4)],
            [np.diag(s), np.zeros((4,4)), np.diag(l)]
        ])

        # Solve for affine step
        # This is a simplified version; a real solver would be more complex
        try:
            step = np.linalg.solve(KKT, -np.concatenate([rd, rp, rc]))
            dx, dl, ds = step[:2], step[2:6], step[6:]
        except np.linalg.LinAlgError:
            break

        # Line search for step size (simplified)
        alpha = 0.99

        x += alpha * dx
        l += alpha * dl
        s += alpha * ds
        path.append(x.tolist())

    return json.dumps(path)
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_pd_ipm = pyodide.globals.get('solve_pd_ipm');

    async function run() {
        runBtn.disabled = true;
        svg.selectAll(".path").remove();

        const path_data = await solve_pd_ipm().then(r => JSON.parse(r));

        const path = svg.append("path").attr("class", "path").datum(path_data)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);

        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
            .transition().duration(2000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

        setTimeout(() => runBtn.disabled = false, 2000);
    }

    runBtn.addEventListener("click", run);
    run();
}
