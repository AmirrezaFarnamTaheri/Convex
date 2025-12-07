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
                 <div class="control-group">
                    <span>Presets:</span>
                    <button class="preset-btn" data-shape="default">Default</button>
                    <button class="preset-btn" data-shape="square">Square</button>
                    <button class="preset-btn" data-shape="line">Line</button>
                </div>
                <button id="reset-mvee-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points, or drag existing points. The MVEE updates automatically.</p>
            <div id="mvee-output" class="widget-output"></div>
        </div>
    `;

    const resetBtn = container.querySelector("#reset-mvee-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#mvee-output");

    let points = [];
    const defaultPoints = [[-1,-1], [1,-1], [0,1]];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth > 0 ? plotContainer.clientWidth - margin.left - margin.right : 500;
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

    const ellipsoid = svg.append("ellipse").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).style("opacity", 0.8);
    const pointsGroup = svg.append("g");

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
    # Using ECOS solver as it can be more robust for this type of problem
    prob.solve(solver=cp.ECOS, verbose=False)

    if prob.status in ["optimal", "optimal_inaccurate"]:
        A_val = A.value
        c_val = c.value

        # The ellipsoid is {x | ||Ax + c|| <= 1}
        # Center is x_c = -inv(A) @ c
        # Shape is defined by P = A.T @ A, (x-x_c).T @ P @ (x-x_c) <= 1
        try:
            A_inv = np.linalg.inv(A_val)
        except np.linalg.LinAlgError:
            return None # Matrix is singular

        center = -A_inv @ c_val

        # P_inv gives the geometry of the ellipse
        P_inv = A_inv @ A_inv.T
        eigvals, eigvecs = np.linalg.eigh(P_inv)

        # Radii are the sqrt of the eigenvalues
        radii = np.sqrt(eigvals)

        # Angle of the first eigenvector
        angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))

        return json.dumps({"c": center.tolist(), "radii": radii.tolist(), "angle": angle})
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_mvee = pyodide.globals.get('get_mvee');

    function setPoints(newPoints) {
        points = JSON.parse(JSON.stringify(newPoints));
        drawAndSolve();
    }

    const pointDrag = d3.drag()
        .on("drag", function(event, d) {
            d[0] = x.invert(event.x);
            d[1] = y.invert(event.y);
            drawAndSolve();
        });

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawAndSolve();
        });

    async function drawAndSolve() {
        // Draw points
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 5)
            .attr("fill", "var(--color-primary)")
            .style("cursor", "move")
            .call(pointDrag);

        // Solve and draw ellipsoid
        outputDiv.innerHTML = "Calculating...";
        ellipsoid.style("display", "none");

        const result_json = await get_mvee(points);
        if (result_json) {
            const ellipse = JSON.parse(result_json);

            // D3 scale ranges can be inverted, so take absolute value for radius
            const rx = Math.abs(x(ellipse.radii[0]) - x(0));
            const ry = Math.abs(y(ellipse.radii[1]) - y(0));

            ellipsoid
                .attr("cx", x(ellipse.c[0]))
                .attr("cy", y(ellipse.c[1]))
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("transform", `rotate(${-ellipse.angle}, ${x(ellipse.c[0])}, ${y(ellipse.c[1])})`)
                .style("display", "block");

            outputDiv.innerHTML = `
                Center: (${ellipse.c[0].toFixed(2)}, ${ellipse.c[1].toFixed(2)})<br>
                Radii: (${ellipse.radii[0].toFixed(2)}, ${ellipse.radii[1].toFixed(2)}),
                Angle: ${ellipse.angle.toFixed(1)}°`;
        } else {
             outputDiv.innerHTML = "Could not compute MVEE. Add more points or try a different configuration.";
        }
    }

    const presets = {
        default: defaultPoints,
        square: [[-2, -2], [2, -2], [2, 2], [-2, 2]],
        line: [[-3, -1], [-1, 0], [1, 1], [3, 2]]
    };

    container.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            if (presets[shape]) {
                setPoints(presets[shape]);
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        points = [];
        pointsGroup.selectAll("circle").remove();
        ellipsoid.style("display", "none");
        outputDiv.innerHTML = "Click to add points.";
    });

    setPoints(defaultPoints);
}
