/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Interactively define a polyhedron by adding linear inequality constraints.
 *              Visualizes half-spaces, normal vectors, and the resulting intersection.
 *              Improved controls for precise constraint manipulation.
 * Version: 3.0.0
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
                        <button id="clear-btn" class="widget-btn">Clear All</button>
                    </div>
                    <div id="constraints-list" style="max-height: 150px; overflow-y: auto; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;"></div>
                </div>
            </div>
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair; background: var(--color-background);">
                <div style="position: absolute; top: 10px; left: 10px; color: var(--color-text-muted); font-size: 0.8rem; background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; pointer-events: none;">
                    Drag to add a half-space constraint.
                </div>
             </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#constraints-list");
    const clearBtn = container.querySelector("#clear-btn");

    let constraints = []; // { a, b, c, id }
    let nextId = 0;
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        // Re-add help text
        const helpDiv = document.createElement('div');
        helpDiv.style.cssText = "position: absolute; top: 10px; left: 10px; color: var(--color-text-muted); font-size: 0.8rem; background: rgba(0,0,0,0.5); padding: 4px; border-radius: 4px; pointer-events: none;";
        helpDiv.textContent = "Drag to add a half-space constraint.";
        plotContainer.appendChild(helpDiv);

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

        svg.append("path").attr("class", "feasible-region")
            .attr("fill", "rgba(124, 197, 255, 0.4)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        svg.append("g").attr("class", "constraint-lines");
        svg.append("g").attr("class", "normals");

        const drag = d3.drag()
            .container(plotContainer.querySelector('svg'))
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

                if (Math.hypot(x2-x1, y2-y1) < 10) return; // Ignore small drags

                const p1 = [x.invert(x1), y.invert(y1)];
                const p2 = [x.invert(x2), y.invert(y2)];

                // Line vector: p2 - p1
                // Normal vector: Rotate (p2-p1) by -90 deg (right hand rule relative to drag direction)
                // (dy, -dx) points "right" relative to forward drag
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                const len = Math.hypot(dx, dy);

                // Normal pointing "right" of the drag direction is consistent with standard half-space visualization
                // Or let the drag define the normal direction directly?
                // "Drag to draw normal" is intuitive: drag points in the direction of the normal (bad side).
                // Let's say drag defines normal vector 'a'. The constraint boundary is perpendicular at the start point.
                // So line is thru p1, with normal (p2-p1).
                // a = (p2 - p1) / len
                // Equation: a . (x - p1) <= 0  => a.x <= a.p1

                const a = dx / len;
                const b = dy / len;
                const c = a * p1[0] + b * p1[1];

                constraints.push({ a, b, c, id: nextId++ });
                update();
            });

        svg.call(drag);

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

        const linesData = constraints.map(con => {
            const seg = getLineSegment(con.a, con.b, con.c, -5, 5, -5, 5);
            if(!seg) return null;
            // Midpoint for normal vector visual
            const midX = (seg.x1 + seg.x2)/2;
            const midY = (seg.y1 + seg.y2)/2;
            return { ...seg, midX, midY, a: con.a, b: con.b, id: con.id };
        }).filter(l => l !== null);

        // Draw Boundary Lines
        svg.select(".constraint-lines").selectAll("line")
            .data(linesData, d => d.id)
            .join("line")
            .attr("x1", d => x(d.x1)).attr("y1", y(d.y1))
            .attr("x2", d => x(d.x2)).attr("y2", y(d.y2))
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        // Draw Normal Vectors (pointing into the INFEASIBLE side)
        // Wait, convention: a^T x <= b. Gradient 'a' points in direction of increase.
        // Since we want <= b, 'a' points OUT of the feasible set.
        svg.select(".normals").selectAll("line")
            .data(linesData, d => d.id)
            .join("line")
            .attr("x1", d => x(d.midX)).attr("y1", y(d.midY))
            .attr("x2", d => x(d.midX + d.a * 0.8)).attr("y2", y(d.midY + d.b * 0.8)) // Scale normal
            .attr("stroke", "var(--color-error)")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#arrow-normal)");
    }

    function getLineSegment(a, b, c, xMin, xMax, yMin, yMax) {
        const points = [];
        // ax + by = c
        // Intersection with borders
        // Left: x = xMin => by = c - a*xMin
        if (Math.abs(b) > 1e-6) {
            const y1 = (c - a * xMin) / b;
            if (y1 >= yMin && y1 <= yMax) points.push({x: xMin, y: y1});
            const y2 = (c - a * xMax) / b;
            if (y2 >= yMin && y2 <= yMax) points.push({x: xMax, y: y2});
        }
        // Top/Bottom: y = yMin => ax = c - b*yMin
        if (Math.abs(a) > 1e-6) {
            const x1 = (c - b * yMin) / a;
            if (x1 >= xMin && x1 <= xMax) points.push({x: x1, y: yMin});
            const x2 = (c - b * yMax) / a;
            if (x2 >= xMin && x2 <= xMax) points.push({x: x2, y: yMax});
        }

        // Remove duplicates
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
            constraintsList.innerHTML = '<div style="color: var(--color-text-muted); font-size: 0.8rem; padding: 4px; text-align: center;">No constraints. Drag on canvas to add one.</div>';
        }
        constraints.forEach((c, index) => {
            const div = document.createElement("div");
            div.className = "widget-control-group";
            div.style.cssText = "flex-direction: row; justify-content: space-between; align-items: center; padding: 6px 12px; background: var(--surface-1); border-radius: 4px;";

            div.innerHTML = `
                <div style="font-family: var(--widget-font-mono); font-size: 0.8rem;">
                    <span style="color: var(--color-text-muted);">C${index+1}:</span>
                    ${c.a.toFixed(1)}x + ${c.b.toFixed(1)}y ≤ ${c.c.toFixed(1)}
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="widget-btn small" title="Flip Inequality">↺</button>
                    <button class="widget-btn small" style="color: var(--color-error); border-color: var(--color-error);" title="Remove">✖</button>
                </div>
            `;

            const buttons = div.querySelectorAll('button');

            // Flip
            buttons[0].onclick = () => {
                c.a = -c.a;
                c.b = -c.b;
                c.c = -c.c;
                update();
            };

            // Remove
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
