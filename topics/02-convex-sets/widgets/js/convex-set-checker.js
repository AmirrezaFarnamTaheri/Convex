/**
 * Widget: Convex Set Checker
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

const pyodidePromise = getPyodide();

export async function initConvexSetChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let drawing = false;
    let path = [];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center;";
    const checkButton = document.createElement("button");
    checkButton.textContent = "Check Convexity";
    checkButton.onclick = checkConvexity;
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.onclick = reset;
    const resultDiv = document.createElement("div");
    controls.append(checkButton, clearButton, resultDiv);
    container.appendChild(controls);

    // --- D3.js SVG for drawing ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const pathGenerator = d3.line();
    const drawnPath = svg.append("path").attr("fill", "lightblue").attr("stroke", "black");
    const testLinesGroup = svg.append("g");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("pointer-events", "all")
        .on("mousedown", () => { drawing = true; reset(); })
        .on("mouseup", () => { drawing = false; })
        .on("mousemove", (event) => {
            if (drawing) {
                path.push(d3.pointer(event));
                drawnPath.attr("d", pathGenerator(path));
            }
        });

    function reset() {
        path = [];
        drawnPath.attr("d", null);
        testLinesGroup.selectAll("*").remove();
        resultDiv.textContent = "";
    }

    async function checkConvexity() {
        if (path.length < 3) {
            resultDiv.textContent = "Please draw a closed shape.";
            return;
        }
        resultDiv.textContent = "Checking...";

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("polygon_points", path);

        const code = `
from shapely.geometry import Polygon, Point, LineString
import numpy as np

poly = Polygon(polygon_points)
if not poly.is_valid:
    result = ("Invalid Polygon", [])
else:
    is_convex = True
    test_lines = []
    min_x, min_y, max_x, max_y = poly.bounds
    for i in range(50):
        p1 = [np.random.uniform(min_x, max_x), np.random.uniform(min_y, max_y)]
        p2 = [np.random.uniform(min_x, max_x), np.random.uniform(min_y, max_y)]

        if poly.contains(Point(p1)) and poly.contains(Point(p2)):
            line = LineString([p1, p2])
            mid_point = list(line.interpolate(0.5, normalized=True).coords)[0]
            test_lines.append({"p1": p1, "p2": p2, "mid_point": mid_point, "in": poly.contains(Point(mid_point))})
            if not poly.contains(Point(mid_point)):
                is_convex = False

    result = ("Convex" if is_convex else "Not Convex", test_lines)

result
        `;
        const [result, test_lines] = await pyodide.runPythonAsync(code).then(r => r.toJs());
        resultDiv.textContent = `Result: ${result}`;

        testLinesGroup.selectAll("line")
            .data(test_lines)
            .join("line")
            .attr("x1", d => d.p1[0]).attr("y1", d => d.p1[1])
            .attr("x2", d => d.p2[0]).attr("y2", d => d.p2[1])
            .attr("stroke", "orange").attr("stroke-width", 1);

        testLinesGroup.selectAll("circle")
            .data(test_lines)
            .join("circle")
            .attr("cx", d => d.mid_point[0]).attr("cy", d => d.mid_point[1])
            .attr("r", 2)
            .attr("fill", d => d.in ? "green" : "red");
    }
}
