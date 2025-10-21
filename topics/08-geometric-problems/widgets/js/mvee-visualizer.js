/**
 * Widget: MVEE Visualizer
 *
 * Description: Finds and displays the Minimum Volume Enclosing Ellipsoid (MVEE)
 *              for a set of user-defined points in 2D.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initMVEEVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="mvee-widget">
            <div class="widget-controls">
                <button id="solve-mvee-btn">Find MVEE</button>
                <button id="reset-mvee-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to add points, then click "Find MVEE".</p>
        </div>
    `;

    const solveBtn = container.querySelector("#solve-mvee-btn");
    const resetBtn = container.querySelector("#reset-mvee-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [[-1,-1], [1,-1], [0,1]];

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

    const ellipsoidPath = svg.append("path").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).style("opacity", 0.8);
    const pointsGroup = svg.append("g");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawPoints();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def get_mvee(points):
    if len(points) < 2: return None

    P = np.array(points).T
    n, m = P.shape

    A = cp.Variable((n, n), symmetric=True)
    c = cp.Variable(n)

    constraints = [cp.SOC(cp.Constant(1), A @ P[:, i] + c) for i in range(m)]
    prob = cp.Problem(cp.Minimize(-cp.log_det(A)), constraints)
    prob.solve(solver=cp.SCS, verbose=False)

    if prob.status not in ["infeasible", "unbounded"]:
        A_val = A.value
        c_val = c.value

        # Ellipsoid is (x-c)T A.T A (x-c) <= 1, where A=chol(inv(E))
        # Easier to work with E = inv(A.T A)
        E = np.linalg.inv(A_val.T @ A_val)
        eigvals, eigvecs = np.linalg.eigh(E)

        radii = np.sqrt(eigvals)
        angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))

        return json.dumps({"c": (-c_val).tolist(), "radii": radii.tolist(), "angle": angle})
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_mvee = pyodide.globals.get('get_mvee');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d=>x(d[0])).attr("cy", d=>y(d[1])).attr("r", 5)
            .attr("fill", "var(--color-primary)");
    }

    async function solve() {
        solveBtn.disabled = true;
        const result_json = await get_mvee(points);
        if (result_json) {
            const ellipse = JSON.parse(result_json);

            const angleRad = ellipse.angle * Math.PI / 180;
            const ellipseData = d3.range(0, 2*Math.PI+0.1, 0.1).map(a => {
                const r1x = ellipse.radii[0] * Math.cos(a);
                const r1y = ellipse.radii[0] * Math.sin(a);
                const r2x = ellipse.radii[1] * Math.cos(a + Math.PI/2);
                const r2y = ellipse.radii[1] * Math.sin(a + Math.PI/2);

                const rotated_x = r1x * Math.cos(angleRad) - r1y * Math.sin(angleRad);
                const rotated_y = r1x * Math.sin(angleRad) + r1y * Math.cos(angleRad);

                return [rotated_x + ellipse.c[0], rotated_y + ellipse.c[1]];
            });

            const lineGenerator = d3.line()
                .x(d => x(d[0]))
                .y(d => y(d[1]));

            // This is complex. A simpler way is to use SVG transforms.
            ellipsoidPath
                 .attr("d", null) // Clear path
                 .attr("transform", `translate(${x(ellipse.c[0])},${y(ellipse.c[1])}) rotate(${-ellipse.angle})`)
                 .attr("d", d3.line()(d3.range(0, 2 * Math.PI + 0.1, 0.1).map(angle =>
                    [x(ellipse.radii[1] * Math.cos(angle)) - x(0),
                     y(ellipse.radii[0] * Math.sin(angle)) - y(0)]
                 )));
        }
        solveBtn.disabled = false;
    }

    resetBtn.addEventListener("click", () => {
        points = [];
        drawPoints();
        ellipsoidPath.attr("d", null);
    });
    solveBtn.addEventListener("click", solve);

    drawPoints();
}
