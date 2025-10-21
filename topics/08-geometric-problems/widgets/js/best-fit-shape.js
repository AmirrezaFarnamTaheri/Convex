/**
 * Widget: Best-Fit Shape Finder
 *
 * Description: Finds the best-fitting line or circle to a set of points.
 * Line fitting uses Total Least Squares (via PCA/SVD).
 * Circle fitting uses a linear least squares method (Taubin's method).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initBestFitShapeFinder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="best-fit-shape-widget">
            <div class="widget-controls">
                <label>Shape:</label>
                <input type="radio" id="fit-line" name="shape-type" value="line" checked>
                <label for="fit-line">Line</label>
                <input type="radio" id="fit-circle" name="shape-type" value="circle">
                <label for="fit-circle">Circle</label>
                <button id="bf-clear-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points. The best-fit shape will update automatically.</p>
            <div id="result-display" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const clearBtn = container.querySelector("#bf-clear-btn");
    const resultDisplay = container.querySelector("#result-display");

    let points = [];
    let fitType = 'line';

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

    const pointsGroup = svg.append("g");
    const bestFitLine = svg.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);
    const bestFitCircle = svg.append("circle").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5).attr("fill", "none");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawPoints();
            updateBestFitShape();
        });

    container.querySelectorAll('input[name="shape-type"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            fitType = event.target.value;
            updateBestFitShape();
        });
    });

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def find_best_fit_line(points_list):
    if len(points_list) < 2: return None
    P = np.array(points_list)
    center = np.mean(P, axis=0)
    U, S, Vt = np.linalg.svd(P - center)
    direction_vector = Vt[0]
    p1 = center - 10 * direction_vector
    p2 = center + 10 * direction_vector
    return json.dumps({"p1": p1.tolist(), "p2": p2.tolist()})

def find_best_fit_circle(points_list):
    if len(points_list) < 3: return None
    points = np.array(points_list)
    n = len(points)
    x = points[:, 0]
    y = points[:, 1]

    # Taubin method for circle fitting
    x_mean = np.mean(x)
    y_mean = np.mean(y)
    x_c = x - x_mean
    y_c = y - y_mean

    # Additional parameters
    z = x_c**2 + y_c**2
    z_mean = np.mean(z)

    # Covariance matrix
    Mxx = np.sum(x_c**2) / n
    Myy = np.sum(y_c**2) / n
    Mxy = np.sum(x_c * y_c) / n
    Mxz = np.sum(x_c * z) / n
    Myz = np.sum(y_c * z) / n
    Mzz = np.sum(z**2) / n - z_mean**2

    # System of equations
    M_c = np.array([
        [Mxx, Mxy, Mxz],
        [Mxy, Myy, Myz],
        [Mxz, Myz, Mzz]
    ])

    b_c = np.array([Mxz, Myz, Mzz])

    # Solve M_c * A = b_c
    try:
        A = np.linalg.solve(M_c, b_c)
    except np.linalg.LinAlgError:
        return None # Singular matrix

    # Circle parameters
    a = A[0] / 2
    b = A[1] / 2
    R_sq = a**2 + b**2 + A[2]

    if R_sq <= 0: return None

    R = np.sqrt(R_sq)
    cx = a + x_mean
    cy = b + y_mean

    return json.dumps({"cx": cx, "cy": cy, "r": R})
`;
    await pyodide.runPythonAsync(pythonCode);
    const find_best_fit_line = pyodide.globals.get('find_best_fit_line');
    const find_best_fit_circle = pyodide.globals.get('find_best_fit_circle');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1])).attr("r", 4)
            .attr("fill", "var(--color-primary)");
    }

    async function updateBestFitShape() {
        bestFitLine.style("display", "none");
        bestFitCircle.style("display", "none");
        resultDisplay.textContent = '';

        if (fitType === 'line' && points.length >= 2) {
            const line_json = await find_best_fit_line(points);
            if (line_json) {
                const line = JSON.parse(line_json);
                bestFitLine
                    .attr("x1", x(line.p1[0])).attr("y1", y(line.p1[1]))
                    .attr("x2", x(line.p2[0])).attr("y2", y(line.p2[1]))
                    .style("display", "block");
                resultDisplay.textContent = `Best-fit line found.`;
            }
        } else if (fitType === 'circle' && points.length >= 3) {
            const circle_json = await find_best_fit_circle(points);
            if (circle_json) {
                const circle = JSON.parse(circle_json);
                bestFitCircle
                    .attr("cx", x(circle.cx)).attr("cy", y(circle.cy))
                    .attr("r", circle.r * (width / 10)) // Scale radius correctly
                    .style("display", "block");
                resultDisplay.innerHTML = `Center: (${circle.cx.toFixed(2)}, ${circle.cy.toFixed(2)}), Radius: ${circle.r.toFixed(2)}`;
            }
        }
    }

    clearBtn.addEventListener("click", () => {
        points = [];
        drawPoints();
        updateBestFitShape();
    });

    // Initial draw
    updateBestFitShape();
}
