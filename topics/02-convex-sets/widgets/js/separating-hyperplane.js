/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Allows users to draw two convex sets and watch the algorithm find a separating hyperplane between them.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSeparatingHyperplane(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="separating-hyperplane-widget">
            <div class="widget-controls">
                <p><strong>Instructions:</strong> Draw two separate, convex shapes.</p>
                <button id="find-hyperplane-btn">Find Separating Hyperplane</button>
                <button id="reset-drawing-btn">Reset</button>
            </div>
            <div id="drawing-area-hyperplane" style="position: relative;"></div>
        </div>
    `;

    const drawingArea = container.querySelector("#drawing-area-hyperplane");
    const findBtn = container.querySelector("#find-hyperplane-btn");
    const resetBtn = container.querySelector("#reset-drawing-btn");

    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = drawingArea.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(drawingArea).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let points1 = [], points2 = [];
    let currentDrawing = 1;
    let isDrawing = false;

    const line = d3.line().curve(d3.curveBasis);
    const path1 = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)");
    const path2 = svg.append("path").attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)");
    const hyperplane = svg.append("line").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5).style("display", "none");

    const drag = d3.drag()
        .on("start", (event) => {
            isDrawing = true;
            const currentPoints = (currentDrawing === 1) ? points1 : points2;
            currentPoints.length = 0; // Clear current polygon
            currentPoints.push(d3.pointer(event, svg.node()));
            hyperplane.style("display", "none");
        })
        .on("drag", (event) => {
            if (!isDrawing) return;
            const currentPoints = (currentDrawing === 1) ? points1 : points2;
            currentPoints.push(d3.pointer(event, svg.node()));
            if (currentDrawing === 1) path1.attr("d", line(currentPoints) + "Z");
            else path2.attr("d", line(currentPoints) + "Z");
        })
        .on("end", () => {
            isDrawing = false;
            currentDrawing = (currentDrawing === 1) ? 2 : 1; // Switch to drawing the other polygon
        });
    svg.call(drag);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("shapely");
    const pythonCode = `
import numpy as np
from shapely.geometry import Polygon
import json

def find_separating_hyperplane(poly1_pts, poly2_pts):
    poly1 = Polygon(poly1_pts)
    poly2 = Polygon(poly2_pts)

    if not poly1.is_valid or not poly2.is_valid or poly1.intersects(poly2):
        return {"error": "Polygons must be valid and disjoint."}

    # Find closest points between the two convex hulls
    p1, p2 = min(
        ((p1, p2) for p1 in poly1.exterior.coords for p2 in poly2.exterior.coords),
        key=lambda points: (points[0][0]-points[1][0])**2 + (points[0][1]-points[1][1])**2
    )

    mid_point = ((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2)
    direction_vec = (p2[0] - p1[0], p2[1] - p1[1])

    # Hyperplane normal is the direction vector
    a = direction_vec[0]
    b = direction_vec[1]

    # Offset c = a*x + b*y
    c = a * mid_point[0] + b * mid_point[1]

    return {"a": a, "b": b, "c": c}
`;
    await pyodide.runPythonAsync(pythonCode);
    const py_find_hyperplane = pyodide.globals.get('find_separating_hyperplane');

    async function findAndDrawHyperplane() {
        if (points1.length < 3 || points2.length < 3) return;

        const result = await py_find_hyperplane(points1, points2).then(r => r.toJs());

        if (result.error) {
            console.warn(result.error);
            return;
        }

        const { a, b, c } = result;
        // Draw the line ax + by = c
        let x1, y1, x2, y2;
        if (Math.abs(b) > 1e-6) { // Not a vertical line
            x1 = -1000; y1 = (c - a*x1) / b;
            x2 = 1000; y2 = (c - a*x2) / b;
        } else { // Vertical line
            y1 = -1000; x1 = c / a;
            y2 = 1000; x2 = c / a;
        }

        hyperplane
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x2).attr("y2", y2)
            .style("display", "block");
    }

    findBtn.addEventListener("click", findAndDrawHyperplane);
    resetBtn.addEventListener("click", () => {
        points1 = []; points2 = [];
        path1.attr("d", null);
        path2.attr("d", null);
        hyperplane.style("display", "none");
        currentDrawing = 1;
    });
}
