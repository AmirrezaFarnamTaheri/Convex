/**
 * Widget: Convex Set Checker
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConvexSetChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convex-checker-widget">
            <div class="widget-controls">
                <button id="check-convexity-btn">Check Convexity</button>
                <button id="clear-drawing-btn">Clear</button>
                <div id="status-output" class="widget-output"></div>
            </div>
            <div id="drawing-area"></div>
            <p class="widget-instructions">Draw a single continuous shape in the box above. The widget will automatically close the shape for you.</p>
        </div>
    `;

    const checkBtn = container.querySelector("#check-convexity-btn");
    const clearBtn = container.querySelector("#clear-drawing-btn");
    const statusOutput = container.querySelector("#status-output");
    const drawingArea = container.querySelector("#drawing-area");

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = drawingArea.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(drawingArea).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    let points = [];
    let isDrawing = false;

    const line = d3.line().curve(d3.curveBasis);
    const drawnPath = g.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const hullPath = g.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
    const testLinesGroup = g.append("g");

    const drag = d3.drag()
        .on("start", (event) => {
            reset();
            isDrawing = true;
            points.push(d3.pointer(event, g.node()));
        })
        .on("drag", (event) => {
            if (!isDrawing) return;
            points.push(d3.pointer(event, g.node()));
            drawnPath.attr("d", line(points) + "Z");
        })
        .on("end", () => {
            isDrawing = false;
        });

    svg.call(drag);

    function reset() {
        points = [];
        drawnPath.attr("d", null);
        hullPath.attr("d", null);
        testLinesGroup.selectAll("*").remove();
        statusOutput.textContent = "";
    }

    async function checkConvexity() {
        if (points.length < 10) {
            statusOutput.textContent = "Please draw a more substantial shape.";
            return;
        }
        statusOutput.textContent = "Checking...";

        const pyodide = await getPyodide();
        await pyodide.loadPackage("shapely");

        await pyodide.globals.set("polygon_points", points);
        const result_json = await pyodide.runPythonAsync(`
from shapely.geometry import Polygon, MultiPoint, Point, LineString
import json
import numpy as np

poly = Polygon(polygon_points)
if not poly.is_valid:
    result = {"is_convex": False, "message": "Invalid shape (self-intersecting).", "hull": [], "test_lines": []}
else:
    is_convex = poly.is_convex
    hull_points = list(poly.convex_hull.exterior.coords)

    test_lines = []
    if not is_convex:
        # Generate points showing non-convexity
        min_x, min_y, max_x, max_y = poly.bounds
        for _ in range(50):
            p1 = Point(np.random.uniform(min_x, max_x), np.random.uniform(min_y, max_y))
            p2 = Point(np.random.uniform(min_x, max_x), np.random.uniform(min_y, max_y))
            if poly.contains(p1) and poly.contains(p2):
                line = LineString([p1, p2])
                if not poly.contains(line):
                    # This line segment goes outside the polygon
                    test_lines.append({
                        "p1": list(p1.coords)[0], "p2": list(p2.coords)[0],
                        "mid_point": list(line.interpolate(0.5, normalized=True).coords)[0],
                        "in": False
                    })
                    break # Found a counterexample

    result = {
        "is_convex": is_convex,
        "message": "This set is convex." if is_convex else "This set is not convex.",
        "hull": hull_points,
        "test_lines": test_lines
    }

json.dumps(result)
        `);
        const result = JSON.parse(result_json);

        statusOutput.innerHTML = `<span style="color: ${result.is_convex ? 'var(--color-success)' : 'var(--color-danger)'};">${result.message}</span>`;

        if (!result.is_convex) {
            hullPath.attr("d", d3.line()(result.hull));

            testLinesGroup.selectAll("line")
                .data(result.test_lines)
                .join("line")
                .attr("x1", d => d.p1[0]).attr("y1", d => d.p1[1])
                .attr("x2", d => d.p2[0]).attr("y2", d => d.p2[1])
                .attr("stroke", "var(--color-danger)").attr("stroke-width", 2);
        }
    }

    checkBtn.addEventListener("click", checkConvexity);
    clearBtn.addEventListener("click", reset);
}
