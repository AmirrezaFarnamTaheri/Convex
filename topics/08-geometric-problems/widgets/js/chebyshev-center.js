/**
 * Widget: Chebyshev Center Explorer
 *
 * Description: Finds the largest circle that can fit inside a user-defined polyhedron.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initChebyshevCenter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="chebyshev-center-widget">
            <div class="widget-controls">
                <button id="solve-cc-btn">Find Chebyshev Center</button>
                <button id="reset-cc-btn">Clear Polyhedron</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to define the vertices of a convex polyhedron. The shape will be closed automatically.</p>
        </div>
    `;

    const solveBtn = container.querySelector("#solve-cc-btn");
    const resetBtn = container.querySelector("#reset-cc-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const polyPath = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const centerPoint = svg.append("circle").attr("fill", "var(--color-success)").attr("r", 5).style("display", "none");
    const inscribedCircle = svg.append("circle").attr("fill", "var(--color-success-light)").attr("stroke", "var(--color-success)").style("opacity", 0.7).style("display", "none");
    const pointsGroup = svg.append("g");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawPoly();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def get_chebyshev_center(points):
    if len(points) < 3: return None

    # Define constraints from vertices (Ax <= b form)
    # First, order points to form a convex polygon
    P = np.array(points)
    center = np.mean(P, axis=0)
    angles = np.arctan2(P[:,1] - center[1], P[:,0] - center[0])
    P_sorted = P[np.argsort(angles)]

    A = []
    b = []
    for i in range(len(P_sorted)):
        p1 = P_sorted[i]
        p2 = P_sorted[(i + 1) % len(P_sorted)]
        # Normal vector pointing inwards
        normal = np.array([p2[1] - p1[1], p1[0] - p2[0]])
        normal /= np.linalg.norm(normal)
        offset = np.dot(normal, p1)
        A.append(normal)
        b.append(offset)
    A = np.array(A)
    b = np.array(b)

    r = cp.Variable(1) # radius
    x_c = cp.Variable(2) # center

    constraints = [ A[i,:] @ x_c + r * np.linalg.norm(A[i,:]) <= b[i] for i in range(len(b)) ]
    constraints.append(r >= 0)

    prob = cp.Problem(cp.Maximize(r), constraints)
    prob.solve()

    if prob.status == 'optimal':
        return json.dumps({"r": r.value, "center": x_c.value.tolist()})
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_chebyshev_center = pyodide.globals.get('get_chebyshev_center');

    function drawPoly() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d=>x(d[0])).attr("cy", d=>y(d[1])).attr("r", 4).attr("fill", "var(--color-primary)");

        if (points.length > 2) {
            const hull = d3.polygonHull(points);
            polyPath.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(hull) + "Z");
        } else {
             polyPath.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(points));
        }
    }

    async function solve() {
        if (points.length < 3) return;
        solveBtn.disabled = true;

        const result_json = await get_chebyshev_center(points);
        if (result_json) {
            const result = JSON.parse(result_json);
            centerPoint.attr("cx", x(result.center[0])).attr("cy", y(result.center[1])).style("display", "block");
            inscribedCircle
                .attr("cx", x(result.center[0])).attr("cy", y(result.center[1]))
                .attr("r", (x(result.r) - x(0)))
                .style("display", "block");
        }
        solveBtn.disabled = false;
    }

    resetBtn.addEventListener("click", () => {
        points = [];
        drawPoly();
        centerPoint.style("display", "none");
        inscribedCircle.style("display", "none");
    });
    solveBtn.addEventListener("click", solve);

    drawPoly();
}
