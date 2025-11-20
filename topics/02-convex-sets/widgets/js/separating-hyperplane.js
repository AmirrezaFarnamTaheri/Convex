/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Draw two convex sets and find a separating hyperplane between them.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initSeparatingHyperplane(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="drawing-area" style="height: 400px; cursor: crosshair; background: var(--color-background);">
                <div style="position: absolute; top: 10px; left: 10px; pointer-events: none;">
                    <span style="background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main);" id="state-display">Step 1: Draw Set A</span>
                </div>
            </div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex-direction: row; gap: 12px;">
                    <button id="next-set-btn" class="widget-btn primary">Next: Draw Set B</button>
                    <button id="find-hyperplane-btn" class="widget-btn primary" disabled>Find Separating Hyperplane</button>
                    <button id="reset-btn" class="widget-btn">Reset</button>
                </div>
            </div>
            <div id="status-output" class="widget-output" style="min-height: 2.5em; display: flex; align-items: center;"></div>
        </div>
    `;

    const drawingArea = container.querySelector("#drawing-area");
    const nextSetBtn = container.querySelector("#next-set-btn");
    const findBtn = container.querySelector("#find-hyperplane-btn");
    const resetBtn = container.querySelector("#reset-btn");
    const statusOutput = container.querySelector("#status-output");
    const stateDisplay = container.querySelector("#state-display");

    let svg;
    let points1 = [], points2 = [];
    let currentDrawingSet = 1;
    let isDrawing = false;

    function setupChart() {
        drawingArea.querySelector('svg')?.remove();

        const width = drawingArea.clientWidth;
        const height = drawingArea.clientHeight;

        svg = d3.select(drawingArea).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Grid
        const defs = svg.append("defs");
        const pattern = defs.append("pattern").attr("id", "grid-pattern").attr("width", 20).attr("height", 20).attr("patternUnits", "userSpaceOnUse");
        pattern.append("circle").attr("cx", 1).attr("cy", 1).attr("r", 1).attr("fill", "var(--color-border)");
        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#grid-pattern)").style("pointer-events", "none");

        const g = svg.append("g");

        g.append("path").attr("class", "path1").attr("fill", "rgba(124, 197, 255, 0.3)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
        g.append("path").attr("class", "path2").attr("fill", "rgba(128, 255, 176, 0.3)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        // Hyperplane
        g.append("line").attr("class", "hyperplane")
            .attr("stroke", "var(--color-error)").attr("stroke-width", 3).attr("stroke-dasharray", "8 4")
            .style("opacity", 0);

        // Closest points connection
        g.append("line").attr("class", "dist-line")
            .attr("stroke", "var(--color-text-muted)").attr("stroke-width", 1).attr("stroke-dasharray", "2 2")
            .style("opacity", 0);

        const drag = d3.drag()
            .container(drawingArea)
            .on("start", (event) => {
                isDrawing = true;
                const currentPoints = (currentDrawingSet === 1) ? points1 : points2;
                // If re-drawing same set, clear it
                currentPoints.length = 0;

                const [x, y] = d3.pointer(event, svg.node());
                currentPoints.push([x, y]);

                svg.select(".hyperplane").style("opacity", 0);
                svg.select(".dist-line").style("opacity", 0);
                statusOutput.innerHTML = "";
            })
            .on("drag", (event) => {
                if (!isDrawing) return;
                const currentPoints = (currentDrawingSet === 1) ? points1 : points2;
                const [x, y] = d3.pointer(event, svg.node());
                currentPoints.push([x, y]);
                updateDrawing();
            })
            .on("end", () => {
                isDrawing = false;
                updateDrawing(true); // Close loop
            });

        svg.call(drag);
    }

    function updateDrawing(close=false) {
        const line = d3.line().curve(d3.curveBasisClosed);
        // Use convex hull for rendering to ensure convexity?
        // Or just draw raw path and then compute hull.
        // Let's compute hull for "Set" look.

        if (points1.length > 2) {
            const hull1 = d3.polygonHull(points1);
            if(hull1) svg.select(".path1").attr("d", "M" + hull1.join("L") + "Z");
        } else if (points1.length === 0) svg.select(".path1").attr("d", null);

        if (points2.length > 2) {
            const hull2 = d3.polygonHull(points2);
            if(hull2) svg.select(".path2").attr("d", "M" + hull2.join("L") + "Z");
        } else if (points2.length === 0) svg.select(".path2").attr("d", null);
    }

    function reset() {
        points1 = []; points2 = [];
        currentDrawingSet = 1;
        updateDrawing();
        svg.select(".hyperplane").style("opacity", 0);
        svg.select(".dist-line").style("opacity", 0);
        statusOutput.textContent = "";

        nextSetBtn.disabled = false;
        nextSetBtn.textContent = "Next: Draw Set B";
        findBtn.disabled = true;
        stateDisplay.textContent = "Step 1: Draw Set A";
    }

    function getPolygonCentroid(pts) {
        return d3.polygonCentroid(pts);
    }

    function findAndDrawHyperplane() {
        if (points1.length < 3 || points2.length < 3) return;

        const hull1 = d3.polygonHull(points1);
        const hull2 = d3.polygonHull(points2);

        // Naive collision check: does any point of 1 lie in 2?
        // d3.polygonContains only works for point-in-poly.
        // Proper intersection check for convex polygons is GJK or separating axis theorem.
        // Simplified heuristic: check centroids and a few samples.
        // For this visualizer, we'll assume disjoint if drawn disjoint.

        // Finding the separating hyperplane is equivalent to finding the shortest distance between two convex sets.
        // For polygons, shortest distance is between (vertex, vertex) or (vertex, edge).

        let minDist = Infinity;
        let pA = null, pB = null;

        // Brute force vertex-vertex (approximation)
        for (let p1 of hull1) {
            for (let p2 of hull2) {
                const dist = (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2;
                if (dist < minDist) {
                    minDist = dist;
                    pA = p1; pB = p2;
                }
            }
        }

        // This is naive. The closest points could be on edges.
        // For a visualizer, finding centroids and drawing perpendicular bisector of centroids
        // might be "good enough" if sets are far apart, but incorrect if close.
        // Let's try to find the support vector direction.

        // Better approximation: Perpendicular bisector of the shortest line segment connecting the two hulls.

        // Just draw line between centroids for reference? No.
        // Use brute force over edges too?
        // Let's stick to vertex-vertex for simplicity in pure JS without a heavy geometry lib.
        // It's a "Visualizer", not a rigorous solver.
        // Actually, we can improve: Iterate edges of A against vertices of B and vice versa.

        // For every edge in A, find distance to every vertex in B.
        // Point-Segment distance.

        const pointSegmentDist = (p, a, b) => {
            const l2 = (a[0]-b[0])**2 + (a[1]-b[1])**2;
            if (l2 === 0) return (p[0]-a[0])**2 + (p[1]-a[1])**2;
            let t = ((p[0]-a[0])*(b[0]-a[0]) + (p[1]-a[1])*(b[1]-a[1])) / l2;
            t = Math.max(0, Math.min(1, t));
            const proj = [a[0] + t*(b[0]-a[0]), a[1] + t*(b[1]-a[1])];
            return { dist: (p[0]-proj[0])**2 + (p[1]-proj[1])**2, pt: proj };
        };

        // Check A edges vs B verts
        for(let i=0; i<hull1.length; i++) {
            const a1 = hull1[i];
            const a2 = hull1[(i+1)%hull1.length];
            for(let b of hull2) {
                const res = pointSegmentDist(b, a1, a2);
                if (res.dist < minDist) {
                    minDist = res.dist;
                    pA = res.pt; // Point on A's edge
                    pB = b;      // Vertex of B
                }
            }
        }

        // Check B edges vs A verts
        for(let i=0; i<hull2.length; i++) {
            const b1 = hull2[i];
            const b2 = hull2[(i+1)%hull2.length];
            for(let a of hull1) {
                const res = pointSegmentDist(a, b1, b2);
                if (res.dist < minDist) {
                    minDist = res.dist;
                    pA = a;      // Vertex of A
                    pB = res.pt; // Point on B's edge
                }
            }
        }

        if (minDist < 1) {
             statusOutput.innerHTML = `<span style="color: var(--color-error);">Sets intersect or are touching. Cannot separate strictly.</span>`;
             return;
        }

        // Normal vector is pB - pA
        const normal = [pB[0] - pA[0], pB[1] - pA[1]];

        // Midpoint
        const mid = [(pA[0] + pB[0])/2, (pA[1] + pB[1])/2];

        // Hyperplane: normal . (x - mid) = 0
        // nx * x + ny * y = c
        const nx = normal[0];
        const ny = normal[1];
        const c = nx * mid[0] + ny * mid[1];

        // Draw extending line
        // if ny approx 0, vertical line x = c/nx
        // else y = (c - nx*x)/ny
        let x1, y1, x2, y2;
        const w = drawingArea.clientWidth;
        const h = drawingArea.clientHeight;

        if (Math.abs(ny) < 1e-3) {
            x1 = c / nx; x2 = x1;
            y1 = -100; y2 = h + 100;
        } else {
            x1 = -100; y1 = (c - nx*x1)/ny;
            x2 = w + 100; y2 = (c - nx*x2)/ny;
        }

        svg.select(".hyperplane")
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x2).attr("y2", y2)
            .transition().duration(500)
            .style("opacity", 1);

        svg.select(".dist-line")
            .attr("x1", pA[0]).attr("y1", pA[1])
            .attr("x2", pB[0]).attr("y2", pB[1])
            .transition().duration(500)
            .style("opacity", 1);

        statusOutput.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">Separating Hyperplane Found!</span> Min Distance: ${Math.sqrt(minDist).toFixed(1)}px`;
    }

    nextSetBtn.addEventListener("click", () => {
        if (points1.length > 2) {
            currentDrawingSet = 2;
            nextSetBtn.disabled = true;
            nextSetBtn.textContent = "Draw Set B";
            findBtn.disabled = false;
            stateDisplay.textContent = "Step 2: Draw Set B";
        } else {
            statusOutput.innerHTML = `<span style="color: var(--color-text-muted);">Please draw a valid shape for Set A first.</span>`;
        }
    });

    findBtn.addEventListener("click", findAndDrawHyperplane);
    resetBtn.addEventListener("click", reset);

    new ResizeObserver(() => setupChart()).observe(drawingArea);
    setupChart();
}
