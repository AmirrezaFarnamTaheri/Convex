/**
 * Widget: Convex Set Checker
 *
 * Description: Allows users to draw a 2D shape and checks if it's a convex set.
 *              Provides visual feedback via the convex hull.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexSetChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="convex-checker-widget">
            <div id="drawing-area" style="width: 100%; height: 400px; touch-action: none;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <button id="check-convexity-btn">Check Convexity</button>
                <button id="clear-drawing-btn">Clear</button>
                <div id="status-output" class="widget-output" style="margin-top: 10px; min-height: 2em;">
                    Draw a shape in the box above.
                </div>
            </div>
        </div>
    `;

    const checkBtn = container.querySelector("#check-convexity-btn");
    const clearBtn = container.querySelector("#clear-drawing-btn");
    const statusOutput = container.querySelector("#status-output");
    const drawingArea = container.querySelector("#drawing-area");

    let svg;
    let points = [];
    let isDrawing = false;

    function setupChart() {
        drawingArea.innerHTML = '';
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = drawingArea.clientWidth - margin.left - margin.right;
        const height = drawingArea.clientHeight - margin.top - margin.bottom;

        svg = d3.select(drawingArea).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${drawingArea.clientWidth} ${drawingArea.clientHeight}`);

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("path").attr("class", "drawn-path").attr("fill", "var(--color-primary-light)")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
        g.append("path").attr("class", "hull-path").attr("fill", "none")
            .attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");

        const drag = d3.drag()
            .on("start", (event) => {
                reset();
                isDrawing = true;
                points.push(d3.pointer(event, g.node()));
            })
            .on("drag", (event) => {
                if (!isDrawing) return;
                points.push(d3.pointer(event, g.node()));
                updateDrawing();
            })
            .on("end", () => { isDrawing = false; });

        svg.call(drag);
    }

    function updateDrawing() {
        if (!svg) return;
        const line = d3.line().curve(d3.curveBasis);
        svg.select(".drawn-path").attr("d", line(points) + (points.length > 2 ? "Z" : ""));
    }

    function reset() {
        points = [];
        if (svg) {
            svg.select(".drawn-path").attr("d", null);
            svg.select(".hull-path").attr("d", null);
        }
        statusOutput.textContent = "Draw a shape in the box above.";
    }

    // --- CONVEXITY CHECK (JS IMPLEMENTATION) ---
    function isConvex(polygon) {
        if (polygon.length < 4) return true;
        let sign = false;
        const n = polygon.length;
        for (let i = 0; i < n; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % n];
            const p3 = polygon[(i + 2) % n];
            const crossProduct = (p2[0] - p1[0]) * (p3[1] - p2[1]) - (p2[1] - p1[1]) * (p3[0] - p2[0]);

            if (i === 0) {
                sign = crossProduct > 0;
            } else if ((crossProduct > 0) !== sign) {
                return false;
            }
        }
        return true;
    }

    function checkConvexity() {
        if (points.length < 10) {
            statusOutput.textContent = "Please draw a more substantial shape.";
            return;
        }

        const hull = d3.polygonHull(points);
        svg.select(".hull-path").datum(hull).attr("d", d3.line().x(d=>d[0]).y(d=>d[1]) + "Z");

        // A simple heuristic: if the area of the hull is significantly larger than the polygon's area,
        // it's likely not convex. A proper check would compare the paths.
        const polygonArea = Math.abs(d3.polygonArea(points));
        const hullArea = d3.polygonArea(hull);
        const isShapeConvex = (hullArea / polygonArea) < 1.15;

        if (isShapeConvex) {
            statusOutput.innerHTML = `<span style="color: var(--color-success);">This shape appears to be convex.</span>`;
        } else {
            statusOutput.innerHTML = `<span style="color: var(--color-danger);">Not convex. The green line shows its convex hull.</span>`;
        }
    }

    checkBtn.addEventListener("click", checkConvexity);
    clearBtn.addEventListener("click", reset);

    new ResizeObserver(setupChart).observe(drawingArea);
    setupChart();
}
