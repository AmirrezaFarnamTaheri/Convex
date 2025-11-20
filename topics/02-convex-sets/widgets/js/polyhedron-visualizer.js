/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Interactively define a polyhedron by adding and manipulating
 *              linear inequality constraints.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// Need a clipping function. d3-polygon is minimal.
// We'll implement Sutherland-Hodgman for convex polygons.

function clipPolygon(subjectPolygon, clipEdge) {
    const newPolygon = [];
    if (subjectPolygon.length === 0) return newPolygon;

    const { a, b } = clipEdge; // ax + by <= c
    // Inside test: a*x + b*y <= c
    const isInside = (p) => (a * p[0] + b * p[1]) <= c;
    const c = clipEdge.c; // Renaming b to c for clarity (Ax <= b -> ax+by <= c)

    // Compute intersection of line (p1, p2) with line ax+by=c
    const intersect = (p1, p2) => {
        const num = c - (a * p1[0] + b * p1[1]);
        const den = (a * (p2[0] - p1[0]) + b * (p2[1] - p1[1]));
        if (Math.abs(den) < 1e-9) return p1; // Parallel
        const t = num / den;
        return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
    };

    for (let i = 0; i < subjectPolygon.length; i++) {
        const curr = subjectPolygon[i];
        const prev = subjectPolygon[(i + subjectPolygon.length - 1) % subjectPolygon.length];

        const currIn = a * curr[0] + b * curr[1] <= c + 1e-9;
        const prevIn = a * prev[0] + b * prev[1] <= c + 1e-9;

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
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 class="widget-label" style="margin: 0;">Constraints (Ax ≤ b)</h4>
                        <button id="clear-btn" class="widget-btn">Clear All</button>
                    </div>
                    <div id="constraints-list" style="max-height: 100px; overflow-y: auto; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;"></div>
                </div>
            </div>
            <div class="widget-output">
                Click and drag on the plot to add a half-space constraint (normal points away from drag direction).
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#constraints-list");
    const clearBtn = container.querySelector("#clear-btn");

    let constraints = []; // { a, b, c } where ax + by <= c
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
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
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height/2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis").attr("transform", `translate(${width/2},0)`).call(d3.axisLeft(y).ticks(5));

        svg.append("path").attr("class", "feasible-region")
            .attr("fill", "rgba(124, 197, 255, 0.4)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        svg.append("g").attr("class", "constraint-lines");

        const drag = d3.drag()
            .container(plotContainer.querySelector('svg')) // Fix coordinates
            .on("start", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                svg.append("line").attr("class", "drag-line")
                    .attr("x1", mx).attr("y1", my).attr("x2", mx).attr("y2", my)
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 2)
                    .attr("marker-end", "url(#arrow-accent)");
            })
            .on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                svg.select(".drag-line").attr("x2", mx).attr("y2", my);
            })
            .on("end", (event) => {
                const line = svg.select(".drag-line");
                const x1 = parseFloat(line.attr("x1"));
                const y1 = parseFloat(line.attr("y1"));
                const x2 = parseFloat(line.attr("x2"));
                const y2 = parseFloat(line.attr("y2"));
                line.remove();

                if (Math.hypot(x2-x1, y2-y1) < 5) return; // Click vs Drag

                // User dragged from p1 to p2.
                // Interpretation: p1 is on the boundary. p2 indicates the VALID side?
                // Or p2 indicates the NORMAL (invalid side)?
                // Standard UI: Drag vector represents the Normal direction pointing OUT of the set.
                // So ax + by <= c.
                // Normal vector n = p2 - p1.
                // Point p1 is on the line.

                const p1 = [x.invert(x1), y.invert(y1)];
                const p2 = [x.invert(x2), y.invert(y2)];

                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                const len = Math.hypot(dx, dy);

                const a = dx / len;
                const b = dy / len;

                // Boundary passes through p1. n dot x <= n dot p1
                const c = a * p1[0] + b * p1[1]; // Wait, if n points OUT (drag direction), we want n dot x <= c?
                // If drag is "pulling the wall", usually drag direction is normal.
                // Let's assume drag direction is Normal vector n. The set is "behind" the line.
                // So n dot (x - p1) <= 0  => n dot x <= n dot p1.

                constraints.push({ a, b, c });
                update();
            });

        svg.call(drag);

        // Marker
        const defs = svg.append("defs");
        defs.append("marker").attr("id", "arrow-accent").attr("viewBox", "0 -5 10 10").attr("refX", 8).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--color-accent)");

        update(); // Initial draw
    }

    function update() {
        renderConstraintsList();

        // Initial Bounding Box (The "Universe")
        // Use a box slightly larger than the view
        let poly = [[-10, -10], [10, -10], [10, 10], [-10, 10]];

        constraints.forEach(con => {
            poly = clipPolygon(poly, con);
        });

        // Draw region
        if (poly.length > 0) {
             const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));
             svg.select(".feasible-region").attr("d", line(poly) + "Z");
        } else {
             svg.select(".feasible-region").attr("d", null);
        }

        // Draw constraint lines (clipped to view)
        // For each constraint ax + by = c, finding intersection with bounding box lines
        // x = -5, x = 5, y = -5, y = 5
        const linesData = constraints.map(con => {
            return getLineSegment(con.a, con.b, con.c, -5, 5, -5, 5);
        }).filter(l => l !== null);

        svg.select(".constraint-lines").selectAll("line")
            .data(linesData)
            .join("line")
            .attr("x1", d => x(d.x1)).attr("y1", y(d.y1))
            .attr("x2", d => x(d.x2)).attr("y2", y(d.y2))
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5");

        // Normal indicators? Maybe too cluttered.
    }

    function getLineSegment(a, b, c, xMin, xMax, yMin, yMax) {
        // ax + by = c. Find intersections with box.
        const points = [];

        // if b != 0, y = (c - ax)/b
        if (Math.abs(b) > 1e-6) {
            const yAtXMin = (c - a * xMin) / b;
            if (yAtXMin >= yMin && yAtXMin <= yMax) points.push({x: xMin, y: yAtXMin});

            const yAtXMax = (c - a * xMax) / b;
            if (yAtXMax >= yMin && yAtXMax <= yMax) points.push({x: xMax, y: yAtXMax});
        }

        // if a != 0, x = (c - by)/a
        if (Math.abs(a) > 1e-6) {
            const xAtYMin = (c - b * yMin) / a;
            if (xAtYMin >= xMin && xAtYMin <= xMax) points.push({x: xAtYMin, y: yMin});

            const xAtYMax = (c - b * yMax) / a;
            if (xAtYMax >= xMin && xAtYMax <= xMax) points.push({x: xAtYMax, y: yMax});
        }

        // Need exactly 2 distinct points for a segment across the box
        // Deduplicate
        const unique = [];
        points.forEach(p => {
            if(!unique.some(u => Math.hypot(u.x-p.x, u.y-p.y) < 1e-6)) unique.push(p);
        });

        if (unique.length >= 2) {
            return { x1: unique[0].x, y1: unique[0].y, x2: unique[1].x, y2: unique[1].y };
        }
        return null;
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        if (constraints.length === 0) {
            constraintsList.innerHTML = '<div style="color: var(--color-text-muted); font-size: 0.8rem; padding: 4px;">No constraints defined.</div>';
        }
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: var(--color-background); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;";
            div.innerHTML = `
                <span style="font-family: var(--widget-font-mono);">${c.a.toFixed(1)}x + ${c.b.toFixed(1)}y ≤ ${c.c.toFixed(1)}</span>
                <button class="widget-btn" style="padding: 2px 6px; font-size: 0.7rem;">✖</button>
            `;
            div.querySelector('button').onclick = () => {
                constraints.splice(i, 1);
                update();
            };
            constraintsList.appendChild(div);
        });
    }

    clearBtn.onclick = () => {
        constraints = [];
        update();
    };

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
}
