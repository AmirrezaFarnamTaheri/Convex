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
                <div class="control-group">
                    <span>Presets:</span>
                    <button class="preset-btn" data-shape="triangle">Triangle</button>
                    <button class="preset-btn" data-shape="square">Square</button>
                    <button class="preset-btn" data-shape="house">House</button>
                </div>
                <button id="reset-cc-btn">Clear Polyhedron</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to define the vertices of a convex polyhedron. The center will update automatically.</p>
            <div id="cc-output" class="widget-output"></div>
        </div>
    `;

    const resetBtn = container.querySelector("#reset-cc-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#cc-output");

    let points = [];
    let isSolving = false;

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

    const polyPath = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const centerPoint = svg.append("circle").attr("fill", "var(--color-success)").attr("r", 5).style("display", "none");
    const inscribedCircle = svg.append("circle").attr("fill", "var(--color-success-light)").attr("stroke", "var(--color-success)").style("opacity", 0.7).style("display", "none");
    const pointsGroup = svg.append("g");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            if (isSolving) return;
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawAndSolve();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def get_chebyshev_center(hull_points):
    if len(hull_points) < 3: return None
    P_sorted = np.array(hull_points)

    A = []
    b = []
    for i in range(len(P_sorted)):
        p1 = P_sorted[i]
        p2 = P_sorted[(i + 1) % len(P_sorted)]
        normal = np.array([p2[1] - p1[1], p1[0] - p2[0]])
        norm_val = np.linalg.norm(normal)
        if norm_val < 1e-9: continue # Avoid division by zero for coincident points
        normal /= norm_val
        offset = np.dot(normal, p1)
        A.append(normal)
        b.append(offset)
    A = np.array(A)
    b = np.array(b)

    r = cp.Variable(1)
    x_c = cp.Variable(2)

    # A @ x_c + r <= b, but r needs to be scaled by norm of A rows, which is 1
    constraints = [ A @ x_c + r <= b, r >= 0 ]

    prob = cp.Problem(cp.Maximize(r), constraints)
    prob.solve(solver=cp.ECOS)

    if prob.status in ['optimal', 'optimal_inaccurate']:
        return json.dumps({"r": r.value, "center": x_c.value.tolist()})
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_chebyshev_center = pyodide.globals.get('get_chebyshev_center');

    function clearPlot() {
        centerPoint.style("display", "none");
        inscribedCircle.style("display", "none");
        outputDiv.innerHTML = "";
    }

    async function drawAndSolve() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 4).attr("fill", "var(--color-primary)");

        clearPlot();

        if (points.length > 2) {
            const hull = d3.polygonHull(points.map(p => [x(p[0]), y(p[1])])).map(p => [x.invert(p[0]), y.invert(p[1])]);
            polyPath.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(hull) + "Z");
            await solve(hull);
        } else {
            polyPath.attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(points));
        }
    }

    async function solve(hull) {
        if (isSolving) return;
        isSolving = true;
        outputDiv.innerHTML = "Solving...";

        const result_json = await get_chebyshev_center(hull);
        if (result_json) {
            const result = JSON.parse(result_json);
            const radius = result.r || 0;
            const center = result.center || [0,0];

            centerPoint.attr("cx", x(center[0])).attr("cy", y(center[1])).style("display", "block");
            inscribedCircle
                .attr("cx", x(center[0])).attr("cy", y(center[1]))
                .attr("r", radius * (width / 10))
                .style("display", "block");

            outputDiv.innerHTML = `Center: (${center[0].toFixed(3)}, ${center[1].toFixed(3)}), Radius: ${radius.toFixed(3)}`;
        } else {
             outputDiv.innerHTML = "Could not find a valid center. The polygon might be degenerate or too small.";
        }
        isSolving = false;
    }

    const presets = {
        triangle: [[-4, -3], [4, -3], [0, 4]],
        square: [[-3, -3], [3, -3], [3, 3], [-3, 3]],
        house: [[-3, -2], [3, -2], [3, 2], [0, 5], [-3, 2]]
    };

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            if (presets[shape]) {
                points = presets[shape];
                drawAndSolve();
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        points = [];
        pointsGroup.selectAll("circle").remove();
        polyPath.attr("d", "");
        clearPlot();
    });

    drawAndSolve();
}
