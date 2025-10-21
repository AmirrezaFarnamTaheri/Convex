/**
 * Widget: Best-Fit Line Finder
 *
 * Description: Finds the best-fitting line to a set of points using Total Least Squares (via PCA/SVD).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initBestFitShapeFinder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="best-fit-line-widget">
            <div id="plot-container"></div>
            <p class="widget-instructions">Click to add points. The best-fit line will update automatically.</p>
            <button id="bf-clear-btn">Clear Points</button>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const clearBtn = container.querySelector("#bf-clear-btn");

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

    const pointsGroup = svg.append("g");
    const bestFitLine = svg.append("line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push([x.invert(mx), y.invert(my)]);
            drawPoints();
            updateBestFitLine();
        });

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def find_best_fit_line(points):
    if len(points) < 2: return None

    P = np.array(points)
    center = np.mean(P, axis=0)

    # PCA via SVD on centered data
    U, S, Vt = np.linalg.svd(P - center)
    direction_vector = Vt[0]

    # Line is center + t * direction_vector
    # Find two points on the line to draw it
    p1 = center - 10 * direction_vector
    p2 = center + 10 * direction_vector

    return json.dumps({"p1": p1.tolist(), "p2": p2.tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const find_best_fit_line = pyodide.globals.get('find_best_fit_line');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d=>x(d[0])).attr("cy", d=>y(d[1])).attr("r", 4)
            .attr("fill", "var(--color-primary)");
    }

    async function updateBestFitLine() {
        if (points.length < 2) {
            bestFitLine.style("display", "none");
            return;
        }

        const line_json = await find_best_fit_line(points);
        if (line_json) {
            const line = JSON.parse(line_json);
            bestFitLine
                .attr("x1", x(line.p1[0])).attr("y1", y(line.p1[1]))
                .attr("x2", x(line.p2[0])).attr("y2", y(line.p2[1]))
                .style("display", "block");
        }
    }

    clearBtn.addEventListener("click", () => {
        points = [];
        drawPoints();
        updateBestFitLine();
    });
}
