/**
 * Widget: Distance Between Convex Sets
 *
 * Description: Calculates and visualizes the shortest distance between two draggable convex polygons.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initDistanceBetweenSets(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="distance-sets-widget">
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the polygons. The shortest distance is updated automatically.</p>
            <div class="widget-output" id="distance-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#distance-output");

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

    let poly1_pts = [[-3,-1], [-1,-2], [-2,-3]];
    let poly2_pts = [[1,1], [3,2], [2,3]];

    const poly1 = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").style("cursor", "move");
    const poly2 = svg.append("path").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").style("cursor", "move");
    const distanceLine = svg.append("line").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def get_dist_between_polys(p1, p2):
    P1 = np.array(p1)
    P2 = np.array(p2)

    x1 = cp.Variable(2)
    x2 = cp.Variable(2)

    # We need to find the convex combination coefficients
    lambda1 = cp.Variable(P1.shape[0], nonneg=True)
    lambda2 = cp.Variable(P2.shape[0], nonneg=True)

    constraints = [
        x1 == P1.T @ lambda1,
        x2 == P2.T @ lambda2,
        cp.sum(lambda1) == 1,
        cp.sum(lambda2) == 1
    ]

    objective = cp.Minimize(cp.sum_squares(x1 - x2))
    problem = cp.Problem(objective, constraints)
    problem.solve()

    if problem.status == 'optimal':
        return json.dumps({
            "distance": np.sqrt(problem.value),
            "p1": x1.value.tolist(),
            "p2": x2.value.tolist()
        })
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_dist_between_polys = pyodide.globals.get('get_dist_between_polys');

    const dragBehavior = (poly) => d3.drag()
        .on("start", () => distanceLine.style("display", "none"))
        .on("drag", (event) => {
            const dx = x.invert(event.dx) - x.invert(0);
            const dy = y.invert(event.dy) - y.invert(0);
            for(let i=0; i<poly.length; i++) {
                poly[i][0] += dx;
                poly[i][1] += dy;
            }
            draw();
        })
        .on("end", updateDistance);

    poly1.call(dragBehavior(poly1_pts));
    poly2.call(dragBehavior(poly2_pts));

    function draw() {
        poly1.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(poly1_pts) + "Z");
        poly2.attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(poly2_pts) + "Z");
    }

    async function updateDistance() {
        const result_json = await get_dist_between_polys(poly1_pts, poly2_pts);
        if(result_json) {
            const result = JSON.parse(result_json);
            distanceLine
                .attr("x1", x(result.p1[0])).attr("y1", y(result.p1[1]))
                .attr("x2", x(result.p2[0])).attr("y2", y(result.p2[1]))
                .style("display", "block");
            outputDiv.innerHTML = `Shortest Distance: <strong>${result.distance.toFixed(2)}</strong>`;
        }
    }

    draw();
    updateDistance();
}
