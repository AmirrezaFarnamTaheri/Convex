/**
 * Widget: Robust Regression vs Least Squares
 *
 * Description: Compares the results of standard least squares and a robust method (Huber regression) when outliers are present.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initRobustRegression(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="robust-regression-widget">
            <div class="widget-controls">
                <button id="clear-rr-btn">Clear Points</button>
                <div class="legend">
                    <span style="color:var(--color-primary);">■</span> Data Points
                    <span style="color:var(--color-danger); margin-left: 10px;">―</span> Least Squares
                    <span style="color:var(--color-success); margin-left: 10px;">―</span> Huber (Robust)
                </div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points. Try adding an outlier far from the main trend.</p>
        </div>
    `;

    const clearBtn = container.querySelector("#clear-rr-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [ {x: -3, y: -2.5}, {x: -2, y: -1.5}, {x: -1, y: -0.5}, {x: 0, y: 0.5}, {x: 1, y: 1.5}, {x: 2, y: 2.5} ];

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
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

    const pointsGroup = svg.append("g");
    const lsLine = svg.append("path").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5).attr("fill", "none");
    const huberLine = svg.append("path").attr("stroke", "var(--color-success)").attr("stroke-width", 2.5).attr("fill", "none");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push({ x: x.invert(mx), y: y.invert(my) });
            drawPoints();
            updateRegressions();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
from sklearn.linear_model import LinearRegression, HuberRegressor
import numpy as np

def fit_regressions(points_data):
    if len(points_data) < 2:
        return None

    X = np.array([p['x'] for p in points_data]).reshape(-1, 1)
    y = np.array([p['y'] for p in points_data])

    line_x = np.array([[-5], [5]])

    ls = LinearRegression().fit(X, y)
    ls_line_y = ls.predict(line_x)

    huber = HuberRegressor().fit(X, y)
    huber_line_y = huber.predict(line_x)

    return {"ls_line": ls_line_y.tolist(), "huber_line": huber_line_y.tolist()}
`;
    await pyodide.runPythonAsync(pythonCode);
    const fit_regressions = pyodide.globals.get('fit_regressions');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "var(--color-primary)");
    }

    async function updateRegressions() {
        const lines = await fit_regressions(points).then(l => l ? l.toJs() : null);
        if (!lines) return;

        const lineGenerator = d3.line().x((d, i) => x(i === 0 ? -5 : 5)).y(d => y(d));
        lsLine.datum(lines.ls_line).transition().duration(200).attr("d", lineGenerator);
        huberLine.datum(lines.huber_line).transition().duration(200).attr("d", lineGenerator);
    }

    clearBtn.addEventListener("click", () => {
        points = [];
        lsLine.attr("d", null);
        huberLine.attr("d", null);
        drawPoints();
    });

    drawPoints();
    updateRegressions();
}
