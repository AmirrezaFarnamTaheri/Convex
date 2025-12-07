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
            <div class="widget-controls">
                <span>Editing:</span>
                <input type="radio" id="edit-set1" name="edit-set" value="set1" checked>
                <label for="edit-set1">Set 1</label>
                <input type="radio" id="edit-set2" name="edit-set" value="set2">
                <label for="edit-set2">Set 2</label>
                <button id="reset-ds-btn">Reset</button>
                <button id="clear-ds-btn">Clear All</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Select a set to edit, then click to add/drag vertices. Distance updates in real-time.</p>
            <div class="widget-output" id="distance-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#distance-output");
    const resetBtn = container.querySelector("#reset-ds-btn");
    const clearBtn = container.querySelector("#clear-ds-btn");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth > 0 ? plotContainer.clientWidth - margin.left - margin.right : 500;
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

    let poly1_pts = [], poly2_pts = [];
    const default_poly1 = [[-3, -1], [-1, -2], [-2, -3]];
    const default_poly2 = [[1, 1], [3, 2], [2, 3]];

    function resetPoints() {
        poly1_pts = JSON.parse(JSON.stringify(default_poly1));
        poly2_pts = JSON.parse(JSON.stringify(default_poly2));
    }
    resetPoints();

    const poly1 = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)");
    const poly2 = svg.append("path").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)");
    const distanceLine = svg.append("line").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5).style("pointer-events", "none");
    const pointsGroup1 = svg.append("g");
    const pointsGroup2 = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def get_dist_between_polys(p1_list, p2_list):
    # Ensure there are enough points to form a convex set
    if len(p1_list) == 0 or len(p2_list) == 0: return None

    P1 = np.array(p1_list)
    P2 = np.array(p2_list)

    x1 = cp.Variable(2)
    x2 = cp.Variable(2)

    constraints = []
    if P1.shape[0] > 1:
        lambda1 = cp.Variable(P1.shape[0], nonneg=True)
        constraints += [x1 == P1.T @ lambda1, cp.sum(lambda1) == 1]
    else: # A single point
        constraints += [x1 == P1[0]]

    if P2.shape[0] > 1:
        lambda2 = cp.Variable(P2.shape[0], nonneg=True)
        constraints += [x2 == P2.T @ lambda2, cp.sum(lambda2) == 1]
    else: # A single point
        constraints += [x2 == P2[0]]

    objective = cp.Minimize(cp.sum_squares(x1 - x2))
    problem = cp.Problem(objective, constraints)
    problem.solve(solver=cp.ECOS)

    if problem.status in ['optimal', 'optimal_inaccurate']:
        return json.dumps({
            "distance": np.sqrt(problem.value),
            "p1": x1.value.tolist(),
            "p2": x2.value.tolist()
        })
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_dist_between_polys = pyodide.globals.get('get_dist_between_polys');

    let currentEditSet = 'set1';
    container.querySelectorAll('input[name="edit-set"]').forEach(radio => {
        radio.addEventListener('change', e => currentEditSet = e.target.value);
    });

    const pointDrag = d3.drag()
        .on("drag", function(event, d) {
            d[0] = x.invert(event.x);
            d[1] = y.invert(event.y);
            drawAndSolve();
        });

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            const newPoint = [x.invert(mx), y.invert(my)];
            (currentEditSet === 'set1' ? poly1_pts : poly2_pts).push(newPoint);
            drawAndSolve();
        });

    function drawAndSolve() {
        // Draw polygons
        if (poly1_pts.length > 2) {
            const hull1 = d3.polygonHull(poly1_pts);
            poly1.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(hull1) + "Z");
        } else {
             poly1.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(poly1_pts));
        }
        if (poly2_pts.length > 2) {
            const hull2 = d3.polygonHull(poly2_pts);
            poly2.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(hull2) + "Z");
        } else {
             poly2.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(poly2_pts));
        }

        // Draw vertices
        pointsGroup1.selectAll("circle").data(poly1_pts).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 5).attr("fill", "var(--color-primary)")
            .style("cursor", "move").call(pointDrag);
        pointsGroup2.selectAll("circle").data(poly2_pts).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 5).attr("fill", "var(--color-accent)")
            .style("cursor", "move").call(pointDrag);

        updateDistance();
    }

    async function updateDistance() {
        if (poly1_pts.length === 0 || poly2_pts.length === 0) {
            distanceLine.style("display", "none");
            outputDiv.innerHTML = "Define two sets to calculate the distance.";
            return;
        }

        const hull1 = poly1_pts.length > 2 ? d3.polygonHull(poly1_pts) : poly1_pts;
        const hull2 = poly2_pts.length > 2 ? d3.polygonHull(poly2_pts) : poly2_pts;

        const result_json = await get_dist_between_polys(hull1, hull2);
        if (result_json) {
            const result = JSON.parse(result_json);
            const dist = result.distance || 0;
            if (result.p1 && result.p2) {
                distanceLine
                    .attr("x1", x(result.p1[0])).attr("y1", y(result.p1[1]))
                    .attr("x2", x(result.p2[0])).attr("y2", y(result.p2[1]))
                    .style("display", "block");
            } else {
                 distanceLine.style("display", "none");
            }
            outputDiv.innerHTML = `Shortest Distance: <strong>${dist.toFixed(3)}</strong>`;
        } else {
            distanceLine.style("display", "none");
            outputDiv.innerHTML = `Could not compute distance.`;
        }
    }

    resetBtn.addEventListener("click", () => {
        resetPoints();
        drawAndSolve();
    });

    clearBtn.addEventListener("click", () => {
        poly1_pts = [];
        poly2_pts = [];
        drawAndSolve();
    });

    drawAndSolve();
}
