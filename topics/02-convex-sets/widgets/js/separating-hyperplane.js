/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Draw two convex sets and interactively find a separating hyperplane.
 *              Allows dragging the sets to see the hyperplane update.
 * Version: 2.2.0
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
                    <button id="find-hyperplane-btn" class="widget-btn primary" disabled>Start Separation</button>
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
            .attr("fill", "rgba(124, 197, 255, 0.3)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        groupB.append("path").attr("class", "path2")
            .attr("fill", "rgba(128, 255, 176, 0.3)")
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2);

        g.append("line").attr("class", "hyperplane")
            .attr("stroke", "var(--color-error)")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "8 4")
            .style("opacity", 0);

        g.append("line").attr("class", "dist-line")
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 1)
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
                })
                .on("drag", function(event) {
                    if(!isInteractive) return;
                    const dx = event.dx;
                    const dy = event.dy;

                    // Shift all points
                    setObj.points.forEach(p => { p[0]+=dx; p[1]+=dy; });
                    setObj.hull.forEach(p => { p[0]+=dx; p[1]+=dy; });
                    setObj.centroid[0] += dx;
                    setObj.centroid[1] += dy;

                    updateDrawing();
                    updateHyperplane();
                })
            );
        };

        makeDraggable(groupA, setA);
        makeDraggable(groupB, setB);
    }

    function updateDrawing(close=false) {
        const line = d3.line().curve(d3.curveLinearClosed); // Use hull, so linear closed

        if (setA.points.length > 2) {
            // If drawing, points are raw trace. If done, use hull.
            // Actually better to always show hull while drawing if fast enough?
            // Just stick to logic:
            if (!setA.hull.length && setA.points.length > 2) setA.hull = d3.polygonHull(setA.points);
            if (setA.hull) svg.select(".path1").attr("d", line(setA.hull));
        } else svg.select(".path1").attr("d", null);

        if (setB.points.length > 2) {
             if (!setB.hull.length && setB.points.length > 2) setB.hull = d3.polygonHull(setB.points);
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
        svg.select(".hyperplane").style("opacity", 0);
        svg.select(".dist-line").style("opacity", 0);

        updateDrawing();
        statusOutput.textContent = "";

        nextSetBtn.disabled = false;
        nextSetBtn.textContent = "Next: Draw Set B";
        findBtn.disabled = true;
        findBtn.textContent = "Start Separation";
        stateDisplay.textContent = "Step 1: Draw Set A";
    }

    function enableInteraction() {
        isInteractive = true;
        svg.select(".group-a").style("cursor", "move");
        svg.select(".group-b").style("cursor", "move");
        stateDisplay.textContent = "Drag sets to move them";
        findBtn.textContent = "Separating...";
        findBtn.disabled = true;
        updateHyperplane();
    }

    function updateHyperplane() {
        if (!setA.hull || !setB.hull || setA.hull.length < 3 || setB.hull.length < 3) return;

        const hull1 = setA.hull;
        const hull2 = setB.hull;

        // Algorithm: Find closest points between two convex polygons.
        let minDist = Infinity;
        let pA = null, pB = null;

        const pointSegmentDist = (p, a, b) => {
            const l2 = (a[0]-b[0])**2 + (a[1]-b[1])**2;
            if (l2 === 0) return { dist: (p[0]-a[0])**2 + (p[1]-a[1])**2, pt: a };
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
                    pA = res.pt;
                    pB = b;
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
                    pA = a;
                    pB = res.pt;
                }
            }
        }

        if (minDist < 1) {
             statusOutput.innerHTML = `<span style="color: var(--color-error);">Sets intersect! No strict separating hyperplane.</span>`;
             svg.select(".hyperplane").style("opacity", 0);
             svg.select(".dist-line").style("opacity", 0);
             return;
        }

        // Normal vector is pB - pA
        const normal = [pB[0] - pA[0], pB[1] - pA[1]];
        const mid = [(pA[0] + pB[0])/2, (pA[1] + pB[1])/2];
        const nx = normal[0];
        const ny = normal[1];
        const c = nx * mid[0] + ny * mid[1];

        // Draw extending line
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
            .style("opacity", 1);

        svg.select(".dist-line")
            .attr("x1", pA[0]).attr("y1", pA[1])
            .attr("x2", pB[0]).attr("y2", pB[1])
            .style("opacity", 1);

        statusOutput.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">Separated!</span> Distance: ${Math.sqrt(minDist).toFixed(1)}px`;
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
