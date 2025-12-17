/**
 * Widget: LP Visualizer & Simplex Animator
 *
 * Description: Interactively define a 2D Linear Program, visualize the feasible region,
 *              and animate the steps of the simplex algorithm vertex traversal.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "https://cdn.jsdelivr.net/npm/d3-polygon@3/+esm";

export async function initLPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="lp-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div class="widget-control-group" style="margin-bottom: 12px;">
                    <label class="widget-label" style="font-weight:bold;">Objective: Maximize cᵀx</label>
                    <div style="display:flex; align-items:center; gap:8px;">
                        c = [<input type="number" id="c1" value="1" step="0.1" class="widget-input-sm">, <input type="number" id="c2" value="2" step="0.1" class="widget-input-sm">]
                    </div>
                </div>

                <h4 style="margin-top:10px; font-size:0.9rem; color:var(--text-secondary);">Constraints: Ax ≤ b</h4>
                <p class="widget-instructions">Click-drag on the plot to add constraints. Non-negativity (x₁, x₂ ≥ 0) is assumed.</p>

                <div id="lp-constraints-list" style="max-height: 100px; overflow-y: auto; margin-bottom: 12px; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 4px;"></div>

                <div style="display:flex; gap:8px;">
                    <button id="run-simplex-btn" class="widget-btn primary">Animate Simplex</button>
                    <button id="clear-constraints-btn" class="widget-btn">Reset</button>
                </div>

                <div id="lp-solution-text" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const constraintsList = container.querySelector("#lp-constraints-list");
    const runBtn = container.querySelector("#run-simplex-btn");
    const clearBtn = container.querySelector("#clear-constraints-btn");
    const solutionText = container.querySelector("#lp-solution-text");
    const c1_in = container.querySelector("#c1");
    const c2_in = container.querySelector("#c2");

    const initialConstraints = [[-1, 1, 1], [1, 1, 3], [1, 0, 2]];
    let constraints = JSON.parse(JSON.stringify(initialConstraints));
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-1, 4]).range([0, width]);
        y = d3.scaleLinear().domain([-1, 4]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat("")).attr("opacity", 0.1);
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("g").attr("class", "content");

        // Objective Arrow Group
        svg.append("g").attr("class", "objective-arrow");

        const drag = d3.drag()
            .on("start", (event) => {
                const [x0, y0] = d3.pointer(event, svg.node());
                svg.append("line").attr("class", "drag-line")
                    .attr("x1", x0).attr("y1", y0).attr("x2", x0).attr("y2", y0)
                    .attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
            })
            .on("drag", (event) => svg.select(".drag-line").attr("x2", event.x).attr("y2", event.y))
            .on("end", (event) => {
                const dragLine = svg.select(".drag-line");
                if (dragLine.empty()) return;

                const [x0, y0] = [parseFloat(dragLine.attr("x1")), parseFloat(dragLine.attr("y1"))];
                const [x1, y1] = d3.pointer(event, svg.node());
                dragLine.remove();

                // Calculate normal vector for the line
                // The constraint is n . x <= b
                // User draws the boundary line. Which side is feasible?
                // Let's assume user draws the boundary, and we take the direction to the origin as feasible if origin is close,
                // OR better, explicit convention: normal points to RIGHT of drawn vector.

                // Let's deduce normal from line (p1 -> p2). Normal is (-dy, dx).
                const p1 = [x.invert(x0), y.invert(y0)];
                const p2 = [x.invert(x1), y.invert(y1)];

                // Vector along line
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];

                // Normal (-dy, dx) points "Right" relative to drawing direction
                // This is standard right-hand rule.
                let nx = -dy;
                let ny = dx;

                const norm = Math.sqrt(nx*nx + ny*ny);
                if (norm < 1e-6) return;
                nx /= norm;
                ny /= norm;

                // Line equation: nx*x + ny*y = b
                // Pick any point on line, e.g., p1
                const b = nx * p1[0] + ny * p1[1];

                constraints.push([nx, ny, b]);
                updateFeasibleRegion();
            });

        svg.call(drag);

        // Update objective arrow immediately
        drawObjectiveArrow();
    }

    function drawObjectiveArrow() {
        const c = [+c1_in.value, +c2_in.value];
        const arrowG = svg.select(".objective-arrow");
        arrowG.selectAll("*").remove();

        // Start at origin (or visible center)
        const startX = 0;
        const startY = 0;
        const endX = c[0];
        const endY = c[1];

        // Normalize for display length
        const len = Math.sqrt(endX*endX + endY*endY);
        if (len < 0.1) return;

        const scale = 0.8; // length in data units
        const dispX = (endX/len)*scale;
        const dispY = (endY/len)*scale;

        arrowG.append("line")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(dispX)).attr("y2", y(dispY))
            .attr("stroke", "var(--color-success)")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow-head)");

        // Define marker if not exists
        if (svg.select("#arrow-head").empty()) {
            svg.append("defs").append("marker")
                .attr("id", "arrow-head")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 8)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "var(--color-success)");
        }
    }

    // Sutherland-Hodgman Polygon Clipping
    function clipPolygon(subjectPolygon, clipEdge) {
        const [a, b, c] = clipEdge; // ax + by <= c
        const newPolygon = [];

        const isInside = (p) => (a * p[0] + b * p[1]) <= c + 1e-9;
        // Intersection of line segment p1-p2 with line ax+by=c
        const intersect = (p1, p2) => {
            const val1 = a * p1[0] + b * p1[1] - c;
            const val2 = a * p2[0] + b * p2[1] - c;
            const t = val1 / (val1 - val2);
            return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
        };

        for (let i = 0; i < subjectPolygon.length; i++) {
            const cur = subjectPolygon[i];
            const prev = subjectPolygon[(i + subjectPolygon.length - 1) % subjectPolygon.length];

            const curIn = isInside(cur);
            const prevIn = isInside(prev);

            if (curIn) {
                if (!prevIn) {
                    newPolygon.push(intersect(prev, cur));
                }
                newPolygon.push(cur);
            } else if (prevIn) {
                newPolygon.push(intersect(prev, cur));
            }
        }
        return newPolygon;
    }

    function updateFeasibleRegion() {
        renderConstraintsList();
        drawObjectiveArrow();

        // Start with a large bounding box
        let poly = [[-2, -2], [5, -2], [5, 5], [-2, 5]];

        // Add non-negativity
        const allConstraints = [...constraints, [-1, 0, 0], [0, -1, 0]];

        allConstraints.forEach(c => {
            poly = clipPolygon(poly, c);
        });

        // Check if empty
        if (poly.length < 3) {
            svg.select(".content").selectAll("*").remove();
            return null;
        }

        const lineGen = d3.line().x(d => x(d[0])).y(d => y(d[1]));
        svg.select(".content").selectAll("*").remove();

        svg.select(".content").append("path").attr("class", "feasible-region")
            .datum(poly)
            .attr("d", lineGen)
            .attr("fill", "rgba(59, 130, 246, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 1.5);

        // Vertices
        svg.select(".content").selectAll(".vertex").data(poly)
            .join("circle")
            .attr("class", "vertex")
            .attr("cx", d => x(d[0])).attr("cy", d => y(d[1]))
            .attr("r", 3)
            .attr("fill", "var(--color-text-main)");

        return poly;
    }

    function renderConstraintsList() {
        constraintsList.innerHTML = '';
        constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.fontSize = '0.85rem';
            div.style.marginBottom = '4px';
            div.innerHTML = `<span>${c[0].toFixed(2)}x₁ + ${c[1].toFixed(2)}x₂ ≤ ${c[2].toFixed(2)}</span>
                             <button data-index="${i}" class="btn-ghost btn-xs" style="color:var(--error);">×</button>`;
            div.querySelector('button').onclick = () => { constraints.splice(i, 1); updateFeasibleRegion(); };
            constraintsList.appendChild(div);
        });
    }

    async function runSimplex() {
        const poly = updateFeasibleRegion();
        solutionText.innerHTML = "";

        if (!poly || poly.length < 3) {
            solutionText.innerHTML = `<span style="color:var(--error)">Infeasible or Unbounded Region.</span>`;
            return;
        }

        const c = [+c1_in.value, +c2_in.value];

        // Identify best vertex
        let maxObj = -Infinity;
        let bestV = null;

        poly.forEach(v => {
            const val = c[0]*v[0] + c[1]*v[1];
            if (val > maxObj) {
                maxObj = val;
                bestV = v;
            }
        });

        // Simple animation: Start from origin (or closest to origin) and walk edges to best
        // This is a pseudo-simplex visualization (geometric path).

        // Find vertex closest to 0
        let currentV = poly.reduce((prev, curr) =>
            (curr[0]**2 + curr[1]**2 < prev[0]**2 + prev[1]**2) ? curr : prev
        );

        // Highlight start
        const highlight = svg.select(".content").append("circle")
            .attr("r", 6).attr("fill", "var(--color-warning)").attr("stroke", "#fff").attr("stroke-width", 2)
            .attr("cx", x(currentV[0])).attr("cy", y(currentV[1]));

        solutionText.innerHTML = "Starting Simplex...";
        await new Promise(r => setTimeout(r, 600));

        // In 2D, we can just trace the boundary in the direction of increasing objective
        // Sort vertices angularly to get adjacency
        const center = poly.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0,0]).map(v => v/poly.length);
        const sortedPoly = [...poly].sort((a,b) => Math.atan2(a[1]-center[1], a[0]-center[0]) - Math.atan2(b[1]-center[1], b[0]-center[0]));

        // Find index of start
        let idx = sortedPoly.indexOf(currentV);

        // Decide direction: Check neighbors, pick one that increases objective
        let visited = new Set();
        visited.add(idx);

        let steps = 0;
        while (steps < poly.length) {
            const valNow = c[0]*currentV[0] + c[1]*currentV[1];

            // Check neighbors in sorted polygon
            const nextIdx = (idx + 1) % sortedPoly.length;
            const prevIdx = (idx - 1 + sortedPoly.length) % sortedPoly.length;

            const nextV = sortedPoly[nextIdx];
            const prevV = sortedPoly[prevIdx];

            const valNext = c[0]*nextV[0] + c[1]*nextV[1];
            const valPrev = c[0]*prevV[0] + c[1]*prevV[1];

            let bestNext = null;
            let bestNextIdx = -1;

            // Greedy ascent
            if (valNext > valNow + 1e-6) {
                bestNext = nextV;
                bestNextIdx = nextIdx;
            } else if (valPrev > valNow + 1e-6) {
                bestNext = prevV;
                bestNextIdx = prevIdx;
            }

            if (bestNext && !visited.has(bestNextIdx)) {
                // Animate move
                highlight.transition().duration(800)
                    .attr("cx", x(bestNext[0])).attr("cy", y(bestNext[1]));

                currentV = bestNext;
                idx = bestNextIdx;
                visited.add(idx);
                await new Promise(r => setTimeout(r, 900));
            } else {
                // Local max reached (global for Convex LP)
                break;
            }
            steps++;
        }

        highlight.transition().duration(400).attr("fill", "var(--color-success)").attr("r", 8);

        solutionText.innerHTML = `
            <div style="padding: 8px; background: var(--bg-surface-2); border-radius: 4px;">
                <strong>Optimal Solution Found:</strong><br>
                x* = [${currentV[0].toFixed(3)}, ${currentV[1].toFixed(3)}]<br>
                Value = ${maxObj.toFixed(3)}
            </div>`;
    }

    c1_in.oninput = drawObjectiveArrow;
    c2_in.oninput = drawObjectiveArrow;
    runBtn.onclick = runSimplex;
    clearBtn.onclick = () => {
        constraints = JSON.parse(JSON.stringify(initialConstraints));
        updateFeasibleRegion();
        solutionText.innerHTML = "";
    };
    new ResizeObserver(() => { setupChart(); updateFeasibleRegion(); }).observe(plotContainer);
    setupChart();
    updateFeasibleRegion();
}
