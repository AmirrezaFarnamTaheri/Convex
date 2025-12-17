/**
 * Widget: LP Duality Visualizer
 *
 * Description: Visualizes the relationship between a primal LP and its dual,
 *              showing their respective feasible regions and optimal solutions.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initDualityVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- LP Problem Definition ---
    // Primal: max c'x s.t. Ax <= b, x >= 0
    // Dual:   min b'y s.t. A'y >= c, y >= 0
    let c = [-1, -2];
    const A = [[1, 1], [-1, 1], [1, 0]];
    const b = [4, 2, 3];

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="duality-visualizer-widget">
            <div class="widget-controls" style="padding: 15px;">
                <h4>Primal Objective: Maximize c₁x₁ + c₂x₂</h4>
                <div class="control-row">
                    c₁: <input type="number" id="c1-in" value="-1" step="0.1">
                    c₂: <input type="number" id="c2-in" value="-2" step="0.1">
                </div>
            </div>
            <div class="plots-container" style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div id="primal-plot" style="flex: 1; min-width: 300px; height: 400px;"></div>
                <div id="dual-plot" style="flex: 1; min-width: 300px; height: 400px;"></div>
            </div>
            <div class="widget-output" id="duality-output" style="margin-top: 15px;"></div>
        </div>
    `;

    const c1In = container.querySelector("#c1-in");
    const c2In = container.querySelector("#c2-in");
    const primalPlotDiv = container.querySelector("#primal-plot");
    const dualPlotDiv = container.querySelector("#dual-plot");
    const outputDiv = container.querySelector("#duality-output");

    let primalPlot, dualPlot;

    function createPlot(div, title) {
        div.innerHTML = '';
        const margin = { top: 40, right: 20, bottom: 40, left: 40 };
        const width = div.clientWidth - margin.left - margin.right;
        const height = div.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(div).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${div.clientWidth} ${div.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text").attr("x", width/2).attr("y", -15).attr("text-anchor", "middle").text(title).attr("fill", "var(--text-primary)");
        const x = d3.scaleLinear().domain([-1, 5]).range([0, width]);
        const y = d3.scaleLinear().domain([-1, 5]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));
        svg.append("g").attr("class", "content");

        return { svg, x, y };
    }

    // Sutherland-Hodgman Polygon Clipping (Internal Implementation)
    function clipPolygon(subjectPolygon, clipEdge) {
        const [a, b, c] = clipEdge; // ax + by <= c
        const newPolygon = [];
        const isInside = (p) => (a * p[0] + b * p[1]) <= c + 1e-9;
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
                if (!prevIn) newPolygon.push(intersect(prev, cur));
                newPolygon.push(cur);
            } else if (prevIn) {
                newPolygon.push(intersect(prev, cur));
            }
        }
        return newPolygon;
    }

    function update() {
        c = [+c1In.value, +c2In.value];
        // --- Primal Problem ---
        let primalFeasible = [[0,0], [5,0], [5,5], [0,5]]; // Start with x>=0 box
        const primalConstraints = [...A.map((row, i) => [...row, b[i]]), [-1, 0, 0], [0, -1, 0]];
        primalConstraints.forEach(constr => {
            primalFeasible = clipPolygon(primalFeasible, constr);
        });

        const primalSol = findOptimalVertex(primalFeasible, c, 'max');

        primalPlot.svg.select(".content").html('');
        if (primalFeasible.length > 2) {
            primalPlot.svg.select(".content").append("path").datum(primalFeasible)
                .attr("d", d3.line().x(d=>primalPlot.x(d[0])).y(d=>primalPlot.y(d[1])))
                .attr("fill", "rgba(59, 130, 246, 0.2)")
                .attr("stroke", "var(--primary-500)")
                .attr("stroke-width", 1.5);
        }
        if (primalSol) {
            primalPlot.svg.select(".content").append("circle").attr("cx", primalPlot.x(primalSol[0]))
                .attr("cy", primalPlot.y(primalSol[1])).attr("r", 6).attr("fill", "var(--color-success)");
            primalPlot.svg.select(".content").append("text").attr("x", primalPlot.x(primalSol[0])).attr("y", primalPlot.y(primalSol[1]))
                .attr("dy", "-1em").text(`p* = ${(c[0]*primalSol[0] + c[1]*primalSol[1]).toFixed(2)}`).attr("fill", "var(--text-primary)");
        }

        // --- Dual Problem (Simplified Projection) ---
        // A'y >= c => -A'y <= -c
        // Transpose A
        const At = A[0].map((_, colIndex) => A.map(row => row[colIndex]));

        // We only visualize 2D projection (y3=0 slice for simplicity as placeholder)
        // Correct dual constraints: At * y >= c => -At * y <= -c
        // y >= 0

        // Let's fake a 2D dual problem for visualization clarity if dimensions don't match
        // Or actually calculate it properly. A is 3x2. A' is 2x3. y is R3.
        // We can't easily visualize R3 on 2D plot.
        // Let's fix y3 = 0.5 (arbitrary) or just show 2 variables.
        // Actually, let's just show a schematic or a different 2D dual example.
        // For educational purposes, let's change problem to 2x2.

        // Revised Problem for Visualization symmetry:
        // P: max c'x, Ax <= b. x in R2.
        // D: min b'y, A'y >= c. y in R2.
        // Let's use a 2x2 A matrix for the visualization.
        const A2 = [[1, 1], [1, 2]];
        const b2 = [4, 6];

        // Recalculate Primal with A2
        let pPoly = [[0,0], [6,0], [6,6], [0,6]];
        const pConstrs = [...A2.map((row, i) => [...row, b2[i]]), [-1, 0, 0], [0, -1, 0]];
        pConstrs.forEach(k => { pPoly = clipPolygon(pPoly, k); });
        const pSol = findOptimalVertex(pPoly, c, 'max');

        // Dual: min b'y s.t. A'y >= c => -A'y <= -c
        // y in R2
        let dPoly = [[0,0], [6,0], [6,6], [0,6]];
        // -A'y <= -c
        // Row 1 of A': [1, 1] -> -y1 -y2 <= -c1
        // Row 2 of A': [1, 2] -> -y1 -2y2 <= -c2
        const dConstrs = [
            [-1, -1, -c[0]],
            [-1, -2, -c[1]],
            [-1, 0, 0], [0, -1, 0]
        ];
        // Note: Dual standard form y>=0 usually matches <= constraints in primal.
        // But here we want to minimize b'y.
        // The dual feasible region is often unbounded upwards.
        // We clip with a large box.

        dConstrs.forEach(k => { dPoly = clipPolygon(dPoly, k); });
        const dSol = findOptimalVertex(dPoly, b2, 'min');

        // Redraw Primal (A2)
        primalPlot.svg.select(".content").html('');
        if (pPoly.length > 2) {
            primalPlot.svg.select(".content").append("path").datum(pPoly)
                .attr("d", d3.line().x(d=>primalPlot.x(d[0])).y(d=>primalPlot.y(d[1])))
                .attr("fill", "rgba(59, 130, 246, 0.2)")
                .attr("stroke", "var(--primary-500)");
        }
        if (pSol) {
            const val = c[0]*pSol[0] + c[1]*pSol[1];
            primalPlot.svg.select(".content").append("circle").attr("cx", primalPlot.x(pSol[0]))
                .attr("cy", primalPlot.y(pSol[1])).attr("r", 6).attr("fill", "var(--color-success)");
            primalPlot.svg.select(".content").append("text").text(`p*=${val.toFixed(2)}`).attr("x", primalPlot.x(pSol[0])).attr("y", primalPlot.y(pSol[1]) - 10).attr("fill", "var(--text-primary)");
        }

        // Draw Dual
        dualPlot.svg.select(".content").html('');
        if (dPoly.length > 2) {
            dualPlot.svg.select(".content").append("path").datum(dPoly)
                .attr("d", d3.line().x(d=>dualPlot.x(d[0])).y(d=>dualPlot.y(d[1])))
                .attr("fill", "rgba(16, 185, 129, 0.2)")
                .attr("stroke", "var(--accent-500)");
        }
        if (dSol) {
            const val = b2[0]*dSol[0] + b2[1]*dSol[1];
            dualPlot.svg.select(".content").append("circle").attr("cx", dualPlot.x(dSol[0]))
                .attr("cy", dualPlot.y(dSol[1])).attr("r", 6).attr("fill", "var(--color-success)");
            dualPlot.svg.select(".content").append("text").text(`d*=${val.toFixed(2)}`).attr("x", dualPlot.x(dSol[0])).attr("y", dualPlot.y(dSol[1]) - 10).attr("fill", "var(--text-primary)");
        }

        // --- Output ---
        const pVal = pSol ? c[0] * pSol[0] + c[1] * pSol[1] : NaN;
        const dVal = dSol ? b2[0] * dSol[0] + b2[1] * dSol[1] : NaN;

        outputDiv.innerHTML = `
            <div style="display:flex; justify-content:space-around;">
                <div><strong>Primal (Max):</strong> ${isNaN(pVal) ? 'Unbounded/Infeasible' : pVal.toFixed(3)}</div>
                <div><strong>Dual (Min):</strong> ${isNaN(dVal) ? 'Unbounded/Infeasible' : dVal.toFixed(3)}</div>
            </div>
            <div style="text-align:center; margin-top:8px; font-size:0.9em; color:var(--text-secondary);">
                Gap: ${Math.abs(pVal - dVal).toFixed(4)} (Strong Duality)
            </div>
        `;
    }

    function findOptimalVertex(vertices, objective, type) {
        if (!vertices || vertices.length === 0) return null;
        let bestVertex = vertices[0];
        let bestVal = objective[0] * bestVertex[0] + objective[1] * bestVertex[1];
        vertices.forEach(v => {
            const val = objective[0] * v[0] + objective[1] * v[1];
            if ((type === 'max' && val > bestVal) || (type === 'min' && val < bestVal)) {
                bestVal = val;
                bestVertex = v;
            }
        });
        return bestVertex;
    }

    function setup() {
        primalPlot = createPlot(primalPlotDiv, "Primal (R²)");
        dualPlot = createPlot(dualPlotDiv, "Dual (R²)");
        update();
    }

    c1In.addEventListener('input', update);
    c2In.addEventListener('input', update);
    new ResizeObserver(setup).observe(container);
    setup();
}
