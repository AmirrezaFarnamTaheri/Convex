/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Draw two convex sets and interactively find a separating hyperplane.
 *              Allows dragging the sets to see the hyperplane update in real-time.
 *              Visualizes the geometric separation theorem.
 * Version: 3.0.0
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
                    <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: var(--color-text-main); border: 1px solid var(--color-border);" id="state-display">Step 1: Draw Set A</span>
                </div>
            </div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex-direction: row; gap: 12px;">
                    <button id="next-set-btn" class="widget-btn primary">Next: Draw Set B</button>
                    <button id="find-hyperplane-btn" class="widget-btn primary" disabled>Find Separator</button>
                    <button id="reset-btn" class="widget-btn">Reset</button>
                </div>
            </div>
            <div id="status-output" class="widget-output" style="min-height: 3em; display: flex; align-items: center; padding: 12px;"></div>
        </div>
    `;

    const drawingArea = container.querySelector("#drawing-area");
    const nextSetBtn = container.querySelector("#next-set-btn");
    const findBtn = container.querySelector("#find-hyperplane-btn");
    const resetBtn = container.querySelector("#reset-btn");
    const statusOutput = container.querySelector("#status-output");
    const stateDisplay = container.querySelector("#state-display");

    let svg;
    // Store points relative to centroid for dragging logic
    let setA = { points: [], centroid: [0,0], hull: [] };
    let setB = { points: [], centroid: [0,0], hull: [] };

    let currentDrawingSet = 1;
    let isDrawing = false;
    let isInteractive = false;

    function setupChart() {
        drawingArea.querySelector('svg')?.remove();

        const width = drawingArea.clientWidth;
        const height = drawingArea.clientHeight;

        svg = d3.select(drawingArea).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);

        const defs = svg.append("defs");
        const pattern = defs.append("pattern").attr("id", "grid-pattern").attr("width", 20).attr("height", 20).attr("patternUnits", "userSpaceOnUse");
        pattern.append("circle").attr("cx", 1).attr("cy", 1).attr("r", 1).attr("fill", "var(--color-border)");
        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#grid-pattern)").style("pointer-events", "none");

        const g = svg.append("g");

        // Groups for sets
        const groupA = g.append("g").attr("class", "group-a");
        const groupB = g.append("g").attr("class", "group-b");

        groupA.append("path").attr("class", "path1")
            .attr("fill", "rgba(124, 197, 255, 0.4)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        groupB.append("path").attr("class", "path2")
            .attr("fill", "rgba(128, 255, 176, 0.4)")
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2);

        // Hyperplane group
        const sepGroup = g.append("g").attr("class", "separator").style("opacity", 0);

        sepGroup.append("line").attr("class", "hyperplane")
            .attr("stroke", "#fbbf24") // Amber
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "8 4");

        // Normal vectors on hyperplane
        sepGroup.append("line").attr("class", "normal-vec")
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#arrow-normal)");

        // Min distance line
        g.append("line").attr("class", "dist-line")
            .attr("stroke", "var(--color-text-main)")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "2 2")
            .style("opacity", 0);

        // Drawing Interaction
        const drawDrag = d3.drag()
            .container(drawingArea)
            .on("start", (event) => {
                if (isInteractive) return; // Disable drawing in interactive mode
                isDrawing = true;
                const set = (currentDrawingSet === 1) ? setA : setB;
                set.points = []; // Clear
                set.hull = [];

                const [x, y] = d3.pointer(event, svg.node());
                set.points.push([x, y]);
                statusOutput.innerHTML = "";
            })
            .on("drag", (event) => {
                if (!isDrawing || isInteractive) return;
                const set = (currentDrawingSet === 1) ? setA : setB;
                const [x, y] = d3.pointer(event, svg.node());
                set.points.push([x, y]);
                updateDrawing();
            })
            .on("end", () => {
                if (isInteractive) return;
                isDrawing = false;
                // Finalize set
                const set = (currentDrawingSet === 1) ? setA : setB;
                if(set.points.length > 2) {
                    set.hull = d3.polygonHull(set.points);
                    set.centroid = d3.polygonCentroid(set.hull);
                }
                updateDrawing(true);
            });

        svg.call(drawDrag);

        // Set Dragging Interaction (enabled later)
        const makeDraggable = (selection, setObj) => {
            selection.call(d3.drag()
                .on("start", function() {
                    if(!isInteractive) return;
                    d3.select(this).raise();
                    d3.select(this).style("cursor", "grabbing");
                })
                .on("drag", function(event) {
                    if(!isInteractive) return;
                    const dx = event.dx;
                    const dy = event.dy;

                    // Shift all points
                    setObj.points.forEach(p => { p[0]+=dx; p[1]+=dy; });
                    if (setObj.hull) setObj.hull.forEach(p => { p[0]+=dx; p[1]+=dy; });
                    if (setObj.centroid) { setObj.centroid[0] += dx; setObj.centroid[1] += dy; }

                    updateDrawing();
                    updateHyperplane();
                })
                .on("end", function() {
                    if(!isInteractive) return;
                    d3.select(this).style("cursor", "grab");
                })
            );
        };

        makeDraggable(groupA, setA);
        makeDraggable(groupB, setB);

        // Arrow def
        defs.append("marker").attr("id", "arrow-normal").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-text-muted)");
    }

    function updateDrawing(close=false) {
        const line = d3.line().curve(d3.curveLinearClosed);

        if (setA.points.length > 2) {
            if (!setA.hull && setA.points.length > 2) setA.hull = d3.polygonHull(setA.points);
            if (setA.hull) svg.select(".path1").attr("d", line(setA.hull));
        } else svg.select(".path1").attr("d", null);

        if (setB.points.length > 2) {
             if (!setB.hull && setB.points.length > 2) setB.hull = d3.polygonHull(setB.points);
             if (setB.hull) svg.select(".path2").attr("d", line(setB.hull));
        } else svg.select(".path2").attr("d", null);
    }

    function reset() {
        setA = { points: [], centroid: [0,0], hull: [] };
        setB = { points: [], centroid: [0,0], hull: [] };
        currentDrawingSet = 1;
        isInteractive = false;

        svg.select(".group-a").style("cursor", "default");
        svg.select(".group-b").style("cursor", "default");
        svg.select(".separator").style("opacity", 0);
        svg.select(".dist-line").style("opacity", 0);

        updateDrawing();
        statusOutput.textContent = "Draw the first convex set.";

        nextSetBtn.disabled = false;
        nextSetBtn.textContent = "Next: Draw Set B";
        findBtn.disabled = true;
        findBtn.textContent = "Find Separator";
        stateDisplay.textContent = "Step 1: Draw Set A";
    }

    function enableInteraction() {
        isInteractive = true;
        svg.select(".group-a").style("cursor", "grab");
        svg.select(".group-b").style("cursor", "grab");
        stateDisplay.textContent = "Drag sets to verify separation";
        findBtn.textContent = "Interactive Mode Active";
        findBtn.disabled = true;
        updateHyperplane();
    }

    function updateHyperplane() {
        if (!setA.hull || !setB.hull || setA.hull.length < 3 || setB.hull.length < 3) return;

        const hull1 = setA.hull;
        const hull2 = setB.hull;

        // GJK is standard, but for small 2D polygons, brute force vertex-edge is fast enough.
        let minDist = Infinity;
        let pA = null, pB = null;

        const pointSegmentDist = (p, a, b) => {
            const dx = b[0]-a[0];
            const dy = b[1]-a[1];
            const l2 = dx*dx + dy*dy;
            if (l2 === 0) return { dist: (p[0]-a[0])**2 + (p[1]-a[1])**2, pt: a };
            let t = ((p[0]-a[0])*dx + (p[1]-a[1])*dy) / l2;
            t = Math.max(0, Math.min(1, t));
            const proj = [a[0] + t*dx, a[1] + t*dy];
            return { dist: (p[0]-proj[0])**2 + (p[1]-proj[1])**2, pt: proj };
        };

        // A vertices vs B edges
        for(let p of hull1) {
            for(let i=0; i<hull2.length; i++) {
                const res = pointSegmentDist(p, hull2[i], hull2[(i+1)%hull2.length]);
                if (res.dist < minDist) { minDist = res.dist; pA = p; pB = res.pt; }
            }
        }
        // B vertices vs A edges
        for(let p of hull2) {
            for(let i=0; i<hull1.length; i++) {
                const res = pointSegmentDist(p, hull1[i], hull1[(i+1)%hull1.length]);
                if (res.dist < minDist) { minDist = res.dist; pA = res.pt; pB = p; }
            }
        }

        // Overlap check (heuristic: distance ~ 0)
        // Better: d3.polygonContains check if any vertex of A in B or vice versa
        // But we want separating hyperplane logic.
        // If overlapping, minDist is technically 0.

        // For true robustness we'd use Separating Axis Theorem (SAT).
        // Let's assume separation if min dist > 0.1.

        if (minDist < 1) {
             statusOutput.innerHTML = `
                <div>
                    <div style="color: var(--color-error); font-weight: bold;">Sets Intersect</div>
                    <div style="font-size: 0.9em; color: var(--color-text-muted);">No separating hyperplane exists.</div>
                </div>
             `;
             svg.select(".separator").style("opacity", 0);
             svg.select(".dist-line").style("opacity", 0);

             // Visual feedback for intersection
             svg.select(".path1").attr("fill", "rgba(239, 68, 68, 0.4)").attr("stroke", "var(--color-error)");
             svg.select(".path2").attr("fill", "rgba(239, 68, 68, 0.4)").attr("stroke", "var(--color-error)");
             return;
        }

        // Restore colors if separated
        svg.select(".path1").attr("fill", "rgba(124, 197, 255, 0.4)").attr("stroke", "var(--color-primary)");
        svg.select(".path2").attr("fill", "rgba(128, 255, 176, 0.4)").attr("stroke", "var(--color-accent)");

        // Hyperplane passes through midpoint of shortest link, perpendicular to it.
        const mid = [(pA[0] + pB[0])/2, (pA[1] + pB[1])/2];
        const normal = [pB[0] - pA[0], pB[1] - pA[1]]; // from A to B
        const nx = normal[0];
        const ny = normal[1];
        // a^T x = b => nx*x + ny*y = nx*midx + ny*midy
        const c = nx * mid[0] + ny * mid[1];

        // Draw huge line
        const w = drawingArea.clientWidth;
        const h = drawingArea.clientHeight;
        let x1, y1, x2, y2;

        if (Math.abs(ny) < 1e-3) { // Vertical
            x1 = c / nx; x2 = x1;
            y1 = -500; y2 = h + 500;
        } else {
            x1 = -500; y1 = (c - nx*x1)/ny;
            x2 = w + 500; y2 = (c - nx*x2)/ny;
        }

        const sepGroup = svg.select(".separator");
        sepGroup.transition().duration(200).style("opacity", 1);

        sepGroup.select(".hyperplane")
            .transition().duration(200)
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x2).attr("y2", y2);

        // Draw normal vector visual
        sepGroup.select(".normal-vec")
            .attr("x1", mid[0]).attr("y1", mid[1])
            .attr("x2", mid[0] + nx/Math.sqrt(minDist)*30).attr("y2", mid[1] + ny/Math.sqrt(minDist)*30);

        svg.select(".dist-line")
            .attr("x1", pA[0]).attr("y1", pA[1])
            .attr("x2", pB[0]).attr("y2", pB[1])
            .style("opacity", 1);

        statusOutput.innerHTML = `
            <div>
                <div style="color: var(--color-success); font-weight: bold;">Sets Separated</div>
                <div style="font-size: 0.9em; color: var(--color-text-muted);">
                    Minimum Distance: ${Math.sqrt(minDist).toFixed(1)}px. Hyperplane normal <strong>a</strong> points from Set A to Set B.
                </div>
            </div>
        `;
    }

    nextSetBtn.addEventListener("click", () => {
        if (setA.points.length > 2) {
            currentDrawingSet = 2;
            nextSetBtn.disabled = true;
            nextSetBtn.textContent = "Draw Set B";
            findBtn.disabled = false;
            stateDisplay.textContent = "Step 2: Draw Set B";
        } else {
            statusOutput.innerHTML = `<span style="color: var(--color-text-muted);">Please draw a valid shape for Set A first.</span>`;
        }
    });

    findBtn.addEventListener("click", enableInteraction);
    resetBtn.addEventListener("click", reset);

    new ResizeObserver(() => setupChart()).observe(drawingArea);
    setupChart();
}
