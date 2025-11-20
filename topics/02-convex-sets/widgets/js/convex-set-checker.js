/**
 * Widget: Convex Set Checker
 *
 * Description: Allows users to draw a 2D shape and checks if it's a convex set.
 *              Visualizes the definition: if non-convex, finds a line segment between two points
 *              that lies outside the set.
 * Version: 3.0.0
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
                    Draw a closed shape here
                </div>
            </div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex-direction: row; gap: 12px;">
                    <button id="check-convexity-btn" class="widget-btn primary">Check Convexity</button>
                    <button id="clear-drawing-btn" class="widget-btn">Clear</button>
                </div>
            </div>
            <div id="status-output" class="widget-output" style="min-height: 4em; display: flex; align-items: center; padding: 12px;">
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
        drawingArea.querySelector('svg')?.remove();

        const width = drawingArea.clientWidth;
        const height = drawingArea.clientHeight;

        svg = d3.select(drawingArea).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);

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

        // Visual elements for counter-example
        const counterGroup = g.append("g").attr("class", "counter-example-group").style("opacity", 0);

        counterGroup.append("line").attr("class", "counter-example-line")
            .attr("stroke", "var(--color-error)")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "5,5");

        counterGroup.append("circle").attr("class", "pt-a").attr("r", 6).attr("fill", "var(--color-error)").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 2);
        counterGroup.append("circle").attr("class", "pt-b").attr("r", 6).attr("fill", "var(--color-error)").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 2);

        // "X" marker at bad midpoint
        const xMark = counterGroup.append("g").attr("class", "bad-midpoint");
        xMark.append("path").attr("d", "M-4,-4L4,4M-4,4L4,-4").attr("stroke", "var(--color-error)").attr("stroke-width", 2);

        const drag = d3.drag()
            .container(drawingArea)
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
                // Basic sampling to avoid too many points
                const last = points[points.length-1];
                if (Math.hypot(x-last[0], y-last[1]) > 5) {
                    points.push([x, y]);
                    updateDrawing();
                }
            })
            .on("end", () => {
                isDrawing = false;
                updateDrawing(true);
            });

        svg.call(drag);
    }

    function updateDrawing(close = false) {
        if (!svg || points.length < 2) return;
        // Use linear closed for checking polygon containment
        const line = d3.line().curve(close ? d3.curveLinearClosed : d3.curveLinear);
        svg.select(".drawn-path").attr("d", line(points));
    }

    function reset() {
        points = [];
        if (svg) {
            svg.select(".drawn-path").attr("d", null);
            svg.select(".counter-example-group").style("opacity", 0);
        }
        statusOutput.innerHTML = "Draw a shape in the box above.";
        placeholder.style.display = 'block';
    }

    function checkConvexity() {
        if (points.length < 10) {
            statusOutput.innerHTML = `<span style="color: var(--color-text-muted);">Please draw a more substantial shape.</span>`;
            return;
        }

        // 1. Find a Counter-Example: Pair of points inside whose midpoint is outside
        let counterExample = null;
        let badPoint = null;

        const xExtent = d3.extent(points, d => d[0]);
        const yExtent = d3.extent(points, d => d[1]);

        const samples = [];
        const maxAttempts = 500;
        let attempts = 0;

        // Generate random points strictly inside
        while(samples.length < 100 && attempts < maxAttempts) {
            const rx = xExtent[0] + Math.random()*(xExtent[1]-xExtent[0]);
            const ry = yExtent[0] + Math.random()*(yExtent[1]-yExtent[0]);
            if (d3.polygonContains(points, [rx, ry])) {
                samples.push([rx, ry]);
            }
            attempts++;
        }

        // Brute force check pairs
        for(let i=0; i<samples.length; i++) {
            for(let j=i+1; j<samples.length; j++) {
                const p1 = samples[i];
                const p2 = samples[j];

                // Check midpoint
                const mid = [(p1[0]+p2[0])/2, (p1[1]+p2[1])/2];
                if (!d3.polygonContains(points, mid)) {
                    counterExample = { p1, p2 };
                    badPoint = mid;
                    break;
                }

                // Check quarters (for C-shapes)
                const q1 = [p1[0]*0.75 + p2[0]*0.25, p1[1]*0.75 + p2[1]*0.25];
                if (!d3.polygonContains(points, q1)) {
                    counterExample = { p1, p2 };
                    badPoint = q1;
                    break;
                }
            }
            if(counterExample) break;
        }

        if (counterExample) {
            // Visualize Counter Example
            const grp = svg.select(".counter-example-group");
            grp.transition().style("opacity", 1);

            grp.select(".counter-example-line")
                .attr("x1", counterExample.p1[0]).attr("y1", counterExample.p1[1])
                .attr("x2", counterExample.p2[0]).attr("y2", counterExample.p2[1]);

            grp.select(".pt-a")
                .attr("cx", counterExample.p1[0]).attr("cy", counterExample.p1[1]);

            grp.select(".pt-b")
                .attr("cx", counterExample.p2[0]).attr("cy", counterExample.p2[1]);

            grp.select(".bad-midpoint")
                .attr("transform", `translate(${badPoint[0]}, ${badPoint[1]})`);

            statusOutput.innerHTML = `
                <div>
                    <div style="color: var(--color-error); font-weight: bold; font-size: 1.1rem;">✕ Non-Convex Set</div>
                    <div style="font-size: 0.9em; margin-top: 4px;">
                        Found points <strong style="color: var(--color-error);">a, b ∈ C</strong> such that the segment [a, b]
                        leaves the set at <strong style="color: var(--color-error);">x ∉ C</strong>.
                    </div>
                </div>
            `;
        } else {
             // Backup Check: Hull Area Ratio
             const hull = d3.polygonHull(points);
             const hullArea = Math.abs(d3.polygonArea(hull));
             const polyArea = Math.abs(d3.polygonArea(points));
             const ratio = hullArea / (polyArea + 1e-9);

             if (ratio < 1.05) {
                svg.select(".counter-example-group").style("opacity", 0);
                statusOutput.innerHTML = `
                    <div>
                        <div style="color: var(--color-success); font-weight: bold; font-size: 1.1rem;">✓ Convex Set</div>
                        <div style="font-size: 0.9em; color: var(--color-text-muted); margin-top: 4px;">
                            For all pairs x, y ∈ C, the line segment [x, y] appears to lie entirely within C.
                        </div>
                    </div>
                `;
             } else {
                 statusOutput.innerHTML = `<span style="color: var(--color-text-muted);">Ambiguous shape. Try drawing cleanly.</span>`;
             }
        }
    }

    checkBtn.addEventListener("click", checkConvexity);
    clearBtn.addEventListener("click", reset);

    new ResizeObserver(() => setupChart()).observe(drawingArea);
    setupChart();
}
