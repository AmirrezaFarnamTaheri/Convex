/**
 * Widget: Convex Set Checker
 *
 * Description: Allows users to draw a 2D shape and checks if it's a convex set.
 *              Provides visual feedback via the convex hull.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexSetChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="drawing-area" style="height: 400px; cursor: crosshair; background: var(--color-background);">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; color: var(--color-text-muted); opacity: 0.5; text-align: center;" id="placeholder-text">
                    Draw a shape here
                </div>
            </div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex-direction: row; gap: 12px;">
                    <button id="check-convexity-btn" class="widget-btn primary">Check Convexity</button>
                    <button id="clear-drawing-btn" class="widget-btn">Clear</button>
                </div>
            </div>
            <div id="status-output" class="widget-output" style="min-height: 2.5em; display: flex; align-items: center;">
                Draw a shape in the box above.
            </div>
        </div>
    `;

    const checkBtn = container.querySelector("#check-convexity-btn");
    const clearBtn = container.querySelector("#clear-drawing-btn");
    const statusOutput = container.querySelector("#status-output");
    const drawingArea = container.querySelector("#drawing-area");
    const placeholder = container.querySelector("#placeholder-text");

    let svg;
    let points = [];
    let isDrawing = false;

    function setupChart() {
        drawingArea.querySelector('svg')?.remove(); // Clean re-init

        const width = drawingArea.clientWidth;
        const height = drawingArea.clientHeight;

        svg = d3.select(drawingArea).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Grid
        const defs = svg.append("defs");
        const pattern = defs.append("pattern")
            .attr("id", "grid-pattern")
            .attr("width", 20).attr("height", 20)
            .attr("patternUnits", "userSpaceOnUse");
        pattern.append("circle").attr("cx", 1).attr("cy", 1).attr("r", 1).attr("fill", "var(--color-border)");

        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#grid-pattern)").style("pointer-events", "none");

        const g = svg.append("g");

        g.append("path").attr("class", "drawn-path")
            .attr("fill", "rgba(124, 197, 255, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        g.append("path").attr("class", "hull-path")
            .attr("fill", "none")
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0);

        const drag = d3.drag()
            .container(drawingArea) // Essential for correct pointer calc relative to div
            .on("start", (event) => {
                reset();
                isDrawing = true;
                placeholder.style.display = 'none';
                const [x, y] = d3.pointer(event, svg.node());
                points.push([x, y]);
            })
            .on("drag", (event) => {
                if (!isDrawing) return;
                const [x, y] = d3.pointer(event, svg.node());
                points.push([x, y]);
                updateDrawing();
            })
            .on("end", () => {
                isDrawing = false;
                updateDrawing(true); // Close loop
            });

        svg.call(drag);
    }

    function updateDrawing(close = false) {
        if (!svg || points.length < 2) return;

        // Simplify points slightly to reduce noise
        // Use a simple stride or distance filter if needed, but raw is ok for now

        const line = d3.line().curve(d3.curveBasis); // Smoothing
        // If closed, append first point
        const renderPoints = close ? [...points, points[0]] : points;

        svg.select(".drawn-path").attr("d", line(renderPoints));
    }

    function reset() {
        points = [];
        if (svg) {
            svg.select(".drawn-path").attr("d", null);
            svg.select(".hull-path").attr("d", null).attr("opacity", 0);
        }
        statusOutput.textContent = "Draw a shape in the box above.";
        placeholder.style.display = 'block';
    }

    function checkConvexity() {
        if (points.length < 10) {
            statusOutput.innerHTML = `<span style="color: var(--color-text-muted);">Please draw a more substantial shape.</span>`;
            return;
        }

        // 1. Compute Convex Hull
        const hull = d3.polygonHull(points);

        // 2. Visualize Hull
        const hullLine = d3.line().curve(d3.curveLinearClosed);
        svg.select(".hull-path").datum(hull).attr("d", hullLine).transition().attr("opacity", 1);

        // 3. Calculate Areas
        // d3.polygonArea expects a closed polygon array. points is open trace.
        // Close it for calculation
        const polyPoints = [...points];
        // Basic downsampling to speed up area calc and reduce self-intersection noise?

        const polygonArea = Math.abs(d3.polygonArea(polyPoints));
        const hullArea = Math.abs(d3.polygonArea(hull));

        // Ratio check. If shape is convex, PolyArea ~= HullArea.
        // Allow slight error due to drawing jitter / smoothing.
        const ratio = hullArea / (polygonArea + 1e-9); // Avoid div/0
        const isShapeConvex = ratio < 1.15; // 15% tolerance for hand drawing

        if (isShapeConvex) {
            statusOutput.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">✓ Convex!</span> The shape roughly matches its convex hull (Ratio: ${ratio.toFixed(2)}).`;
        } else {
            statusOutput.innerHTML = `<span style="color: var(--color-error); font-weight: bold;">✕ Not Convex.</span> The dashed line shows the convex hull (Ratio: ${ratio.toFixed(2)}).`;
        }
    }

    checkBtn.addEventListener("click", checkConvexity);
    clearBtn.addEventListener("click", reset);

    new ResizeObserver(() => setupChart()).observe(drawingArea);
    setupChart();
}
