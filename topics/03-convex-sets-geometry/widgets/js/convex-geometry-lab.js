/**
 * Widget: Convex Geometry Lab
 *
 * Description: A unified workspace for exploring convex sets.
 *              - Draw custom sets (polygons).
 *              - Add standard sets (balls, squares).
 *              - Apply operations: Intersection, Hull, Sum.
 *              - Verify convexity of results.
 *
 * Features:
 * - Interactive drawing canvas.
 * - Library of standard shapes.
 * - Operations pipeline (Select Set A, Select Set B -> Operation -> Result).
 * - Visual feedback for convexity.
 *
 * Version: 1.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexGeometryLab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- LAYOUT STRUCTURE ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                <div class="control-group" style="margin-bottom: 0;">
                    <button id="mode-draw" class="widget-btn primary small"><i data-feather="pen-tool"></i> Draw Set</button>
                    <button id="mode-add-circle" class="widget-btn small"><i data-feather="circle"></i> Add Circle</button>
                    <button id="mode-add-square" class="widget-btn small"><i data-feather="square"></i> Add Square</button>
                </div>
                <div style="border-left: 1px solid var(--border-subtle); height: 32px; margin: 0 8px;"></div>
                <div class="control-group" style="margin-bottom: 0; display: flex; gap: 8px;">
                    <select id="op-select" class="widget-select" style="width: 140px;">
                        <option value="hull">Convex Hull</option>
                        <option value="intersect">Intersection</option>
                        <option value="union">Union</option>
                        <option value="minkowski">Minkowski Sum</option>
                    </select>
                    <button id="apply-op" class="widget-btn small">Apply</button>
                </div>
                 <div style="border-left: 1px solid var(--border-subtle); height: 32px; margin: 0 8px;"></div>
                <button id="clear-all" class="widget-btn small warning">Clear All</button>
            </div>

            <div class="widget-canvas-container" id="lab-canvas" style="height: 500px; cursor: crosshair; background: var(--surface-base);">
                <div id="instruction-overlay" style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 4px 12px; border-radius: 16px; font-size: 0.85rem; pointer-events: none;">
                    Click to add points. Double-click to finish polygon.
                </div>
            </div>

            <div id="lab-status" class="widget-output" style="min-height: 50px; display: flex; align-items: center; justify-content: center;">
                <span style="color: var(--text-secondary);">Workspace ready. Add sets to begin.</span>
            </div>
        </div>
    `;

    // Initialize Feather Icons
    if (window.feather) window.feather.replace();

    const canvas = document.getElementById('lab-canvas');
    const instruction = document.getElementById('instruction-overlay');
    const status = document.getElementById('lab-status');

    let svg;
    let width, height;
    let sets = []; // Array of { id, type: 'poly'|'circle', points: [], ... }
    let currentDrawing = [];
    let isDrawing = false;
    let selectedSetIds = new Set();
    let nextId = 1;

    function init() {
        canvas.innerHTML = '';
        canvas.appendChild(instruction); // Keep overlay
        width = canvas.clientWidth;
        height = canvas.clientHeight;

        svg = d3.select(canvas).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Grid pattern
        const defs = svg.append("defs");
        const pattern = defs.append("pattern")
            .attr("id", "grid-bg")
            .attr("width", 20).attr("height", 20)
            .attr("patternUnits", "userSpaceOnUse");
        pattern.append("circle").attr("cx", 1).attr("cy", 1).attr("r", 1).attr("fill", "#333");
        svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#grid-bg)");

        // Layers
        svg.append("g").attr("class", "layer-sets");
        svg.append("g").attr("class", "layer-drawing");

        // Interaction
        svg.on("click", onCanvasClick);
        svg.on("dblclick", finishDrawing);
        svg.on("mousemove", onMouseMove);

        instruction.style.display = 'none';
    }

    // --- DRAWING LOGIC ---
    function startDrawingMode() {
        isDrawing = true;
        currentDrawing = [];
        instruction.textContent = "Click to add points. Double-click to close polygon.";
        instruction.style.display = 'block';
        svg.style("cursor", "crosshair");
    }

    function onCanvasClick(event) {
        if (!isDrawing) {
            // Deselect if clicking empty space
            if (event.target.tagName === 'svg' || event.target.tagName === 'rect') {
                selectedSetIds.clear();
                renderSets();
            }
            return;
        }

        const [x, y] = d3.pointer(event);
        currentDrawing.push([x, y]);
        renderDrawing();
    }

    function onMouseMove(event) {
        if (!isDrawing || currentDrawing.length === 0) return;
        const [x, y] = d3.pointer(event);
        // Preview line
        const g = svg.select(".layer-drawing");
        g.select(".preview-line").remove();
        const last = currentDrawing[currentDrawing.length-1];
        g.append("line").attr("class", "preview-line")
            .attr("x1", last[0]).attr("y1", last[1])
            .attr("x2", x).attr("y2", y)
            .attr("stroke", "var(--accent-300)").attr("stroke-width", 1).attr("stroke-dasharray", "4 2");
    }

    function renderDrawing() {
        const g = svg.select(".layer-drawing");
        g.selectAll(".draw-pt").remove();
        g.selectAll(".draw-line").remove();

        if (currentDrawing.length > 0) {
             // Points
             g.selectAll(".draw-pt").data(currentDrawing).enter().append("circle")
                .attr("class", "draw-pt")
                .attr("cx", d => d[0]).attr("cy", d => d[1])
                .attr("r", 4).attr("fill", "var(--accent-500)");

            // Lines
            if (currentDrawing.length > 1) {
                const line = d3.line();
                g.append("path").attr("class", "draw-line")
                    .attr("d", line(currentDrawing))
                    .attr("fill", "none").attr("stroke", "var(--accent-300)").attr("stroke-width", 2);
            }
        }
    }

    function finishDrawing() {
        if (!isDrawing || currentDrawing.length < 3) return;

        // Create polygon set
        const hull = d3.polygonHull(currentDrawing); // Auto-hull for cleanliness? Or keep raw?
        // Let's keep raw but close it. Or better: hull it to ensure convexity for "Draw Set".
        // Actually, drawing non-convex allows us to test "Convex Hull" operation.

        addSet({
            type: 'poly',
            points: currentDrawing, // Keep raw vertices
            color: getRandomColor()
        });

        isDrawing = false;
        currentDrawing = [];
        svg.select(".layer-drawing").selectAll("*").remove();
        instruction.style.display = 'none';
        svg.style("cursor", "default");
    }

    // --- SET MANAGEMENT ---
    function addSet(setProps) {
        const set = {
            id: nextId++,
            selected: true, // Auto-select new
            ...setProps
        };
        // Auto-select logic: deselect others? No, allow multi-select for ops.
        // But usually user wants to operate on latest.
        // Let's select the new one.
        sets.push(set);
        selectedSetIds.add(set.id);
        renderSets();
        updateStatus();
    }

    function renderSets() {
        const g = svg.select(".layer-sets");
        g.selectAll(".set-group").remove();

        sets.forEach(set => {
            const grp = g.append("g").attr("class", "set-group")
                .style("cursor", "pointer")
                .on("click", (e) => {
                    e.stopPropagation();
                    if (e.shiftKey) {
                        if (selectedSetIds.has(set.id)) selectedSetIds.delete(set.id);
                        else selectedSetIds.add(set.id);
                    } else {
                        selectedSetIds.clear();
                        selectedSetIds.add(set.id);
                    }
                    renderSets();
                    updateStatus();
                });

            const isSelected = selectedSetIds.has(set.id);
            const stroke = isSelected ? "white" : set.color;
            const strokeWidth = isSelected ? 3 : 2;
            const dash = isSelected ? "4 2" : null;

            if (set.type === 'poly') {
                // Check convexity visual
                const isConvex = checkPolyConvex(set.points);
                const opacity = 0.4;

                grp.append("path")
                    .attr("d", d3.line().curve(d3.curveLinearClosed)(set.points))
                    .attr("fill", set.color).attr("fill-opacity", opacity)
                    .attr("stroke", stroke).attr("stroke-width", strokeWidth)
                    .attr("stroke-dasharray", dash);

                // Label
                const c = d3.polygonCentroid(set.points);
                if(!isNaN(c[0])) {
                    grp.append("text").attr("x", c[0]).attr("y", c[1])
                    .attr("text-anchor", "middle").attr("dy", 4)
                    .attr("fill", "white").style("font-weight", "bold")
                    .style("pointer-events", "none")
                    .text(isConvex ? `C${set.id}` : `NC${set.id}`);
                }

            } else if (set.type === 'circle') {
                 grp.append("circle")
                    .attr("cx", set.cx).attr("cy", set.cy).attr("r", set.r)
                    .attr("fill", set.color).attr("fill-opacity", 0.4)
                    .attr("stroke", stroke).attr("stroke-width", strokeWidth)
                    .attr("stroke-dasharray", dash);

                 grp.append("text").attr("x", set.cx).attr("y", set.cy)
                    .attr("text-anchor", "middle").attr("dy", 4)
                    .attr("fill", "white").style("font-weight", "bold")
                    .text(`B${set.id}`);
            }
        });
    }

    function checkPolyConvex(points) {
        // Simple visual check: hull area vs poly area
        // Or better: counter-example logic from original widget
        // For speed here, assuming convex unless obviously not
        // Let's assume user wants to check.
        const hull = d3.polygonHull(points);
        if (!hull) return true; // Triangle or line
        // If hull has fewer points than poly (and poly didn't have collinear), non-convex
        // Simple approximation
        return hull.length === points.length;
    }

    function updateStatus() {
        const sel = Array.from(selectedSetIds).map(id => sets.find(s => s.id === id));
        if (sel.length === 0) {
            status.innerHTML = `<span style="color: var(--text-secondary);">Select sets to apply operations. Shift+Click to multi-select.</span>`;
        } else if (sel.length === 1) {
            status.innerHTML = `Selected Set ${sel[0].id}. Type: ${sel[0].type}. Convex: ${sel[0].type==='poly' ? (checkPolyConvex(sel[0].points)?'Yes':'No') : 'Yes'}`;
        } else {
            status.innerHTML = `${sel.length} sets selected. Ready for operation.`;
        }
    }

    // --- OPERATIONS ---
    function applyOperation() {
        const op = document.getElementById('op-select').value;
        const sel = Array.from(selectedSetIds).map(id => sets.find(s => s.id === id));

        if (sel.length === 0) return;

        // Convert all to polygons for general ops (approximate circles)
        const polys = sel.map(s => {
            if (s.type === 'poly') return s.points;
            if (s.type === 'circle') {
                // Discretize circle
                const pts = [];
                for(let i=0; i<32; i++) {
                    const a = (i/32) * Math.PI * 2;
                    pts.push([s.cx + s.r*Math.cos(a), s.cy + s.r*Math.sin(a)]);
                }
                return pts;
            }
        });

        let resultPoly = [];
        let msg = "";

        if (op === 'hull') {
            // Union of points -> Hull
            const allPoints = polys.flat();
            resultPoly = d3.polygonHull(allPoints);
            msg = "Generated Convex Hull";
        } else if (op === 'intersect') {
            // Clip intersection (only works reliably for convex inputs)
            // Assuming convex inputs for now
            if (polys.length < 2) return;
            resultPoly = polys[0];
            for(let i=1; i<polys.length; i++) {
                resultPoly = clipPolygon(resultPoly, polys[i]);
            }
            msg = "Generated Intersection";
        } else if (op === 'union') {
            // Union is not convex.
            // "Union" usually implies creating a single set. Since we are a Convex Lab,
            // we highlight that Union is NOT convex unless nested.
            // Let's do Hull(Union) to be consistent with "Operations Preserving Convexity" theme.
             const allPoints = polys.flat();
             resultPoly = d3.polygonHull(allPoints);
             msg = "Generated Convex Hull of Union";
        } else if (op === 'minkowski') {
             if (polys.length < 2) return;
             resultPoly = minkowskiSum(polys[0], polys[1]);
             msg = "Generated Minkowski Sum";
        }

        if (resultPoly && resultPoly.length > 2) {
            addSet({
                type: 'poly',
                points: resultPoly,
                color: "var(--success)"
            });
            status.innerHTML = `<strong style="color: var(--success)">${msg}</strong>`;
        } else {
            status.innerHTML = `<strong style="color: var(--error)">Operation resulted in empty set or failed.</strong>`;
        }
    }

    // --- HELPERS ---
    function getRandomColor() {
        const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Re-use clipping/minkowski from previous widget logic
    function clipPolygon(subjectPolygon, clipPolygon) {
        let output = subjectPolygon;
        if(!clipPolygon || clipPolygon.length < 3) return [];
        const cp = [...clipPolygon];
        for(let j=0; j<cp.length; j++) {
            const edgeStart = cp[j];
            const edgeEnd = cp[(j+1)%cp.length];
            const input = output;
            output = [];
            if(input.length === 0) break;
            const isInside = (p) => (edgeEnd[0]-edgeStart[0])*(p[1]-edgeStart[1]) - (edgeEnd[1]-edgeStart[1])*(p[0]-edgeStart[0]) >= 0;
            const intersect = (p1, p2) => {
                 const num = (edgeStart[0]*edgeEnd[1] - edgeStart[1]*edgeEnd[0]) * (p1[0]-p2[0]) - (edgeStart[0]-edgeEnd[0]) * (p1[0]*p2[1] - p1[1]*p2[0]);
                 const den = (edgeStart[0]-edgeEnd[0]) * (p1[1]-p2[1]) - (edgeStart[1]-edgeEnd[1]) * (p1[0]-p2[0]);
                 return [ num/den, ((edgeStart[0]*edgeEnd[1] - edgeStart[1]*edgeEnd[0]) * (p1[1]-p2[1]) - (edgeStart[1]-edgeEnd[1]) * (p1[0]*p2[1] - p1[1]*p2[0]))/den ];
            };
            let s = input[input.length-1];
            for(const e of input) {
                if(isInside(e)) {
                    if(!isInside(s)) output.push(intersect(s,e));
                    output.push(e);
                } else if(isInside(s)) {
                    output.push(intersect(s,e));
                }
                s = e;
            }
        }
        return output;
    }

    function minkowskiSum(poly1, poly2) {
        const points = [];
        // Center polys to avoid drifting off screen
        const c1 = d3.polygonCentroid(poly1);
        const c2 = d3.polygonCentroid(poly2);
        // Center offset
        const cx = width/2 - (c1[0]+c2[0]);
        const cy = height/2 - (c1[1]+c2[1]);

        for(let p1 of poly1) {
            for(let p2 of poly2) {
                // Normalize position somewhat
                points.push([p1[0]+p2[0] - width/2, p1[1]+p2[1] - height/2]);
            }
        }
        // Re-center in view
        const hull = d3.polygonHull(points);
        const c = d3.polygonCentroid(hull);
        const dx = width/2 - c[0];
        const dy = height/2 - c[1];
        return hull.map(p => [p[0]+dx, p[1]+dy]);
    }


    // --- LISTENERS ---
    document.getElementById('mode-draw').addEventListener('click', startDrawingMode);

    document.getElementById('mode-add-circle').addEventListener('click', () => {
        addSet({
            type: 'circle',
            cx: width/2 + (Math.random()-0.5)*100,
            cy: height/2 + (Math.random()-0.5)*100,
            r: 40 + Math.random()*30,
            color: getRandomColor()
        });
    });

    document.getElementById('mode-add-square').addEventListener('click', () => {
        const cx = width/2 + (Math.random()-0.5)*100;
        const cy = height/2 + (Math.random()-0.5)*100;
        const s = 60;
        addSet({
            type: 'poly',
            points: [[cx-s, cy-s], [cx+s, cy-s], [cx+s, cy+s], [cx-s, cy+s]],
            color: getRandomColor()
        });
    });

    document.getElementById('clear-all').addEventListener('click', () => {
        sets = [];
        selectedSetIds.clear();
        renderSets();
        updateStatus();
    });

    document.getElementById('apply-op').addEventListener('click', applyOperation);

    new ResizeObserver(() => {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        init();
        renderSets();
    }).observe(canvas);

    init();
}
