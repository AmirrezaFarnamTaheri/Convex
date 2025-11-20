/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Interactively define a polyhedron by adding linear inequality constraints.
 *              Visualizes half-spaces, normal vectors, and the resulting intersection.
 *              Improved controls for precise constraint manipulation.
 * Version: 3.1.0 (Enhanced Dragging)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function clipPolygon(subjectPolygon, clipEdge) {
    const newPolygon = [];
    if (subjectPolygon.length === 0) return newPolygon;

    const { a, b } = clipEdge; // ax + by <= c
    const c = clipEdge.c;
    const isInside = (p) => (a * p[0] + b * p[1]) <= c + 1e-9; // Tolerance

    const intersect = (p1, p2) => {
        const num = c - (a * p1[0] + b * p1[1]);
        const den = (a * (p2[0] - p1[0]) + b * (p2[1] - p1[1]));
        if (Math.abs(den) < 1e-9) return p1;
        const t = num / den;
        return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
    };

    for (let i = 0; i < subjectPolygon.length; i++) {
        const curr = subjectPolygon[i];
        const prev = subjectPolygon[(i + subjectPolygon.length - 1) % subjectPolygon.length];

        const currIn = isInside(curr);
        const prevIn = isInside(prev);

        if (currIn) {
            if (!prevIn) newPolygon.push(intersect(prev, curr));
            newPolygon.push(curr);
        } else if (prevIn) {
            newPolygon.push(intersect(prev, curr));
        }
    }
    return newPolygon;
}

export function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 class="widget-label" style="margin: 0;">Constraints H = {x | aᵀx ≤ b}</h4>
                        <button id="clear-btn" class="widget-btn small">Clear All</button>
                    </div>
                    <div id="constraints-list" style="max-height: 150px; overflow-y: auto; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;"></div>
                </div>
            </div>
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair; background: var(--color-background); position: relative;">
                <div id="drag-hint" style="position: absolute; top: 10px; left: 10px; color: var(--color-text-muted); font-size: 0.8rem; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; pointer-events: none; transition: opacity 0.3s;">
                    Drag to add a half-space constraint.<br>The line is the boundary, arrow points to infeasible side.
                </div>
             </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#constraints-list");
    const clearBtn = container.querySelector("#clear-btn");
    const dragHint = container.querySelector("#drag-hint");

    let constraints = []; // { a, b, c, id }
    let nextId = 0;
    let svg, x, y;

    // Initialize with a box to make it interesting
    constraints.push({ a: 1, b: 0, c: 3, id: nextId++ });   // x <= 3
    constraints.push({ a: -1, b: 0, c: 3, id: nextId++ });  // x >= -3
    constraints.push({ a: 0, b: 1, c: 3, id: nextId++ });   // y <= 3
    constraints.push({ a: 0, b: -1, c: 3, id: nextId++ });  // y >= -3

    function setupChart() {
        // Clear existing SVG but keep the hint
        const existingSvg = plotContainer.querySelector('svg');
        if (existingSvg) existingSvg.remove();

        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat("")).attr("transform", `translate(0,0)`);
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis").attr("transform", `translate(${width/2},0)`).call(d3.axisLeft(y).ticks(5));

        // The Polyhedron
        svg.append("path").attr("class", "feasible-region")
            .attr("fill", "rgba(124, 197, 255, 0.4)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Groups for lines and normals
        svg.append("g").attr("class", "constraint-lines");
        svg.append("g").attr("class", "normals");

        // Drag behavior for creating new constraints
        const dragCreate = d3.drag()
            .container(plotContainer.querySelector('svg'))
            .on("start", (event) => {
                dragHint.style.opacity = 0;
                const [mx, my] = d3.pointer(event, svg.node());
                svg.append("line").attr("class", "drag-line")
                    .attr("x1", mx).attr("y1", my).attr("x2", mx).attr("y2", my)
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow-accent)");

                // Shade the "bad" side visually during drag
                svg.append("path").attr("class", "drag-shade")
                   .attr("fill", "rgba(255, 107, 107, 0.2)");
            })
            .on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                const line = svg.select(".drag-line");
                const x1 = parseFloat(line.attr("x1"));
                const y1 = parseFloat(line.attr("y1"));
                line.attr("x2", mx).attr("y2", my);

                // Draw shading perpendicular to drag direction
                // Vector v = (mx-x1, my-y1)
                // Normal n = (v.y, -v.x) (Right side)
                // Boundary is line thru (x1,y1) perpendicular to v?
                // Wait, logic: Drag defines the normal vector pointing to infeasible region.
                // So boundary is perpendicular to drag, passing through start point.
                // Let's visualize this standard logic.
                // Actually, typically "drag a line" means drawing the boundary itself.
                // But for half-spaces, we need direction.
                // Let's stick to: Line drawn IS the normal vector. Start point is on the boundary.
                // Then user drags INTO the forbidden zone.

                // To make it clearer: Draw the boundary line perpendicular to drag line at x1,y1

                // Just keeping the line for now.
            })
            .on("end", (event) => {
                dragHint.style.opacity = 1;
                const line = svg.select(".drag-line");
                const shade = svg.select(".drag-shade");
                const x1 = parseFloat(line.attr("x1"));
                const y1 = parseFloat(line.attr("y1"));
                const x2 = parseFloat(line.attr("x2"));
                const y2 = parseFloat(line.attr("y2"));
                line.remove();
                shade.remove();

                if (Math.hypot(x2-x1, y2-y1) < 10) return; // Ignore small drags

                // Convert to data coordinates
                const p1 = [x.invert(x1), y.invert(y1)];
                const p2 = [x.invert(x2), y.invert(y2)];

                // Logic: The drag vector (p1 -> p2) represents the normal vector 'a'.
                // The constraint boundary passes through p1.
                // So a = p2 - p1.
                // Constraint: a . (x - p1) <= 0
                // => a.x <= a.p1
                // c = a.p1

                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                // Normalize a bit so numbers aren't huge, though linear scaling doesn't matter for inequality
                const len = Math.hypot(dx, dy);
                const a = dx / len;
                const b = dy / len;
                const c = a * p1[0] + b * p1[1];

                constraints.push({ a, b, c, id: nextId++ });
                update();
            });

        // We attach drag to a rect overlay so we can drag anywhere
        svg.append("rect").attr("class", "overlay")
            .attr("width", width).attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(dragCreate);

        // Defs for markers
        const defs = svg.append("defs");
        defs.append("marker").attr("id", "arrow-accent").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-accent)");
        defs.append("marker").attr("id", "arrow-normal").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-error)");

        update();
    }

    function update() {
        renderConstraintsList();

        // Clip a large box with all constraints
        let poly = [[-10, -10], [10, -10], [10, 10], [-10, 10]];

        constraints.forEach(con => {
            poly = clipPolygon(poly, con);
        });

        if (poly.length > 2) {
             const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
             svg.select(".feasible-region").attr("d", line(poly) + "Z");
        } else {
             svg.select(".feasible-region").attr("d", null);
        }

        // Calculate line segments for visual representation within view box
        const linesData = constraints.map(con => {
            const seg = getLineSegment(con.a, con.b, con.c, -5, 5, -5, 5);
            if(!seg) return null;
            // Midpoint for normal vector visual
            const midX = (seg.x1 + seg.x2)/2;
            const midY = (seg.y1 + seg.y2)/2;
            return { ...seg, midX, midY, a: con.a, b: con.b, id: con.id };
        }).filter(l => l !== null);

        // Bind Data for Lines
        svg.select(".constraint-lines").selectAll("line")
            .data(linesData, d => d.id)
            .join("line")
            .attr("x1", d => x(d.x1)).attr("y1", y(d.y1))
            .attr("x2", d => x(d.x2)).attr("y2", y(d.y2))
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .style("pointer-events", "none"); // Pass thru to overlay

        // Bind Data for Normals
        svg.select(".normals").selectAll("line")
            .data(linesData, d => d.id)
            .join("line")
            .attr("x1", d => x(d.midX)).attr("y1", y(d.midY))
            .attr("x2", d => x(d.midX + d.a * 0.5)).attr("y2", y(d.midY + d.b * 0.5)) // Short normal
            .attr("stroke", "var(--color-error)")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#arrow-normal)")
            .style("pointer-events", "none");
    }

    // Helper to intersect line ax+by=c with bounding box
    function getLineSegment(a, b, c, xMin, xMax, yMin, yMax) {
        const points = [];
        // ax + by = c
        // x = xMin => by = c - a*xMin
        if (Math.abs(b) > 1e-6) {
            const y1 = (c - a * xMin) / b;
            if (y1 >= yMin - 1e-6 && y1 <= yMax + 1e-6) points.push({x: xMin, y: Math.max(yMin, Math.min(yMax, y1))});
            const y2 = (c - a * xMax) / b;
            if (y2 >= yMin - 1e-6 && y2 <= yMax + 1e-6) points.push({x: xMax, y: Math.max(yMin, Math.min(yMax, y2))});
        }
        // y = yMin => ax = c - b*yMin
        if (Math.abs(a) > 1e-6) {
            const x1 = (c - b * yMin) / a;
            if (x1 >= xMin - 1e-6 && x1 <= xMax + 1e-6) points.push({x: Math.max(xMin, Math.min(xMax, x1)), y: yMin});
            const x2 = (c - b * yMax) / a;
            if (x2 >= xMin - 1e-6 && x2 <= xMax + 1e-6) points.push({x: Math.max(xMin, Math.min(xMax, x2)), y: yMax});
        }

        // Remove duplicates
        const unique = [];
        points.forEach(p => {
            if(!unique.some(u => Math.hypot(u.x-p.x, u.y-p.y) < 1e-4)) unique.push(p);
        });

        if (unique.length >= 2) {
            return { x1: unique[0].x, y1: unique[0].y, x2: unique[1].x, y2: unique[1].y };
        }
        return null;
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        if (constraints.length === 0) {
            constraintsList.innerHTML = '<div style="color: var(--color-text-muted); font-size: 0.8rem; padding: 8px; text-align: center; font-style: italic;">No constraints active. The feasible set is all of ℝ².</div>';
        }
        constraints.forEach((c, index) => {
            const div = document.createElement("div");
            div.className = "widget-control-group";
            div.style.cssText = "flex-direction: row; justify-content: space-between; align-items: center; padding: 6px 12px; background: var(--surface-1); border-radius: 4px; border-left: 3px solid var(--color-primary);";

            // Pretty print equation
            let eq = "";
            if (Math.abs(c.a) > 1e-3) eq += `${c.a.toFixed(1)}x `;
            if (Math.abs(c.b) > 1e-3) eq += `${c.b >= 0 ? '+' : '-'} ${Math.abs(c.b).toFixed(1)}y `;
            eq += `≤ ${c.c.toFixed(1)}`;

            div.innerHTML = `
                <div style="font-family: var(--widget-font-mono); font-size: 0.8rem;">
                    ${eq}
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="widget-btn small" title="Flip Inequality">↺</button>
                    <button class="widget-btn small" style="color: var(--color-error); border-color: var(--color-error);" title="Remove">✖</button>
                </div>
            `;

            const buttons = div.querySelectorAll('button');
            buttons[0].onclick = () => {
                c.a = -c.a;
                c.b = -c.b;
                c.c = -c.c;
                update();
            };
            buttons[1].onclick = () => {
                constraints = constraints.filter(con => con.id !== c.id);
                update();
            };
            constraintsList.appendChild(div);
        });
    }

    clearBtn.onclick = () => {
        constraints = [];
        update();
    };

    new ResizeObserver(() => {
        setupChart();
        update();
    }).observe(plotContainer);
    setupChart();
}
