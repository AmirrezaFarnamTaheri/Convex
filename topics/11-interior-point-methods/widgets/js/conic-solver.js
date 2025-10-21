/**
 * Widget: Conic Problem Solver (Smallest Enclosing Circle)
 *
 * Description: A simple sandbox for solving a small conic problem (Smallest Enclosing Circle),
 *              which can be formulated as an SOCP.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConicSolver(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="conic-solver-widget">
             <div class="widget-controls">
                <div class="control-group">
                    <span>Presets:</span>
                    <button class="preset-btn" data-shape="triangle">Triangle</button>
                    <button class="preset-btn" data-shape="line">Line</button>
                    <button class="preset-btn" data-shape="cluster">Cluster</button>
                </div>
                <button id="cs-clear-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points, or drag existing points. The circle updates automatically.</p>
            <div id="cs-output" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const clearBtn = container.querySelector("#cs-clear-btn");
    const outputDiv = container.querySelector("#cs-output");

    let points = [];
    const defaultPoints = [[-1,-1], [1,-1], [0,1]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
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

    const enclosingCircle = svg.append("circle").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("fill", "var(--color-accent-light)").attr("opacity", 0.5);
    const pointsGroup = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");
    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def solve_smallest_enclosing_circle(points):
    if not points: return None
    P = np.array(points)
    c = cp.Variable(2)
    r = cp.Variable()

    constraints = [cp.norm(P[i] - c) <= r for i in range(P.shape[0])]
    prob = cp.Problem(cp.Minimize(r), constraints)
    prob.solve(solver=cp.ECOS)

    return json.dumps({"c": c.value.tolist(), "r": r.value}) if prob.status in ['optimal', 'optimal_inaccurate'] else None
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_socp = pyodide.globals.get('solve_smallest_enclosing_circle');

    const pointDrag = d3.drag().on("drag", function(event, d) {
        d[0] = x.invert(event.x);
        d[1] = y.invert(event.y);
        update();
    });

    svg.append("rect").attr("width", width).attr("height", height).style("fill","none").style("pointer-events","all")
        .on("click", (event) => {
            const [mx,my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            update();
        });

    function setPoints(newPoints) {
        points = JSON.parse(JSON.stringify(newPoints));
        update();
    }

    async function update() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 5)
            .attr("fill", "var(--color-primary)").style("cursor", "move")
            .call(pointDrag);

        if (points.length > 0) {
            outputDiv.innerHTML = "Solving...";
            const result_json = await solve_socp(points);
            if (result_json) {
                const result = JSON.parse(result_json);
                const radius = result.r || 0;
                enclosingCircle.attr("cx", x(result.c[0])).attr("cy", y(result.c[1]))
                               .attr("r", Math.abs(x(radius) - x(0)));
                outputDiv.innerHTML = `Center: (${result.c[0].toFixed(2)}, ${result.c[1].toFixed(2)}), Radius: ${radius.toFixed(2)}`;
            } else {
                 outputDiv.innerHTML = "Could not find a solution.";
            }
        } else {
            enclosingCircle.attr("r", 0);
            outputDiv.innerHTML = "Click to add points.";
        }
    }

    const presets = {
        triangle: [[-2, -1], [2, -1], [0, 2]],
        line: [[-3, 0], [-1, 0], [1, 0], [3,0]],
        cluster: [[-2.5, 1], [-2, 1.2], [-2.2, 0.8], [2, -1], [2.5, -1.2], [2.2, -0.8]]
    };

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            if (presets[shape]) {
                setPoints(presets[shape]);
            }
        });
    });

    clearBtn.addEventListener("click", () => {
        points = [];
        update();
    });

    setPoints(defaultPoints);
}
