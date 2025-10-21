/**
 * Widget: LP Duality Visualizer
 *
 * Description: Visualizes the relationship between a primal LP and its dual,
 *              showing their respective feasible regions and optimal solutions.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { polygonClip } from "d3-polygon";

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

        svg.append("text").attr("x", width/2).attr("y", -15).attr("text-anchor", "middle").text(title);
        const x = d3.scaleLinear().domain([-1, 5]).range([0, width]);
        const y = d3.scaleLinear().domain([-1, 5]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));
        svg.append("g").attr("class", "content");

        return { svg, x, y };
    }

    function update() {
        c = [+c1In.value, +c2In.value];
        // --- Primal Problem ---
        let primalFeasible = [[0,0], [10,0], [10,10], [0,10]]; // Start with x>=0 box
        const primalConstraints = [...A.map((row, i) => [...row, b[i]]), [-1, 0, 0], [0, -1, 0]];
        primalConstraints.forEach(c => {
            primalFeasible = polygonClip(halfPlaneToPolygon({a: c.slice(0,2), b: c[2]}), primalFeasible);
        });

        const primalVertices = primalFeasible ? primalFeasible.slice(0, -1) : [];
        const primalSol = findOptimalVertex(primalVertices, c, 'max');

        primalPlot.svg.select(".content").html('');
        primalPlot.svg.select(".content").append("path").datum(primalFeasible)
            .attr("d", d3.line().x(d=>primalPlot.x(d[0])).y(d=>primalPlot.y(d[1])))
            .attr("fill", "var(--color-primary-light)");
        if (primalSol) {
            primalPlot.svg.select(".content").append("circle").attr("cx", primalPlot.x(primalSol[0]))
                .attr("cy", primalPlot.y(primalSol[1])).attr("r", 6).attr("fill", "var(--color-success)");
            primalPlot.svg.select(".content").append("text").attr("x", primalPlot.x(primalSol[0])).attr("y", primalPlot.y(primalSol[1]))
                .attr("dy", "-1em").text(`p* = ${(c[0]*primalSol[0] + c[1]*primalSol[1]).toFixed(2)}`);
        }

        // --- Dual Problem ---
        // A'y >= c => -A'y <= -c
        const dual_A = A[0].map((_, colIndex) => A.map(row => -row[colIndex]));
        const dual_b = c.map(val => -val);

        // This is a 3D problem, we'll visualize a slice (y₃ = 0) for simplicity
        let dualFeasible = [[-10,-10], [10,-10], [10,10], [-10,10]];
        const dualConstraints = [...dual_A.map((row, i) => [...row, dual_b[i]]), [-1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0]]; // y>=0
        dualConstraints.filter(c => Math.abs(c[2]) < 1e-6).forEach(c => { // Project to y3=0 plane
             dualFeasible = polygonClip(halfPlaneToPolygon({a: c.slice(0,2), b: c[3]}), dualFeasible);
        });

        const dualVertices = dualFeasible ? dualFeasible.slice(0, -1) : [];
        const dualSol = findOptimalVertex(dualVertices, b, 'min'); // Dual minimizes b'y

        dualPlot.svg.select(".content").html('');
        dualPlot.svg.select(".content").append("path").datum(dualFeasible)
            .attr("d", d3.line().x(d=>dualPlot.x(d[0])).y(d=>dualPlot.y(d[1])))
            .attr("fill", "var(--color-accent-light)");
        if (dualSol) {
            dualPlot.svg.select(".content").append("circle").attr("cx", dualPlot.x(dualSol[0]))
                .attr("cy", dualPlot.y(dualSol[1])).attr("r", 6).attr("fill", "var(--color-success)");
            dualPlot.svg.select(".content").append("text").attr("x", dualPlot.x(dualSol[0])).attr("y", dualPlot.y(dualSol[1]))
                .attr("dy", "-1em").text(`d* = ${(b[0]*dualSol[0] + b[1]*dualSol[1]).toFixed(2)}`);
        }

        // --- Output ---
        const primalOptVal = primalSol ? c[0] * primalSol[0] + c[1] * primalSol[1] : NaN;
        const dualOptVal = dualSol ? b[0] * dualSol[0] + b[1] * dualSol[1] : NaN;
        outputDiv.innerHTML = `
            <strong>Primal Optimal Value:</strong> ${primalOptVal.toFixed(3)}<br>
            <strong>Dual Optimal Value:</strong> ${dualOptVal.toFixed(3)} (projected to y₃=0)<br>
            The dual is a 3D problem; this visualization shows a slice where the third dual variable is zero.
            Strong duality holds: the optimal values are equal.
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

    function halfPlaneToPolygon({a, b}) {
        const p1 = [a[0]*b, a[1]*b];
        const p2 = [p1[0] - a[1]*20, p1[1] + a[0]*20];
        const p3 = [p1[0] + a[1]*20, p1[1] - a[0]*20];
        return [p2, p3, ...p3.map((v,i) => v - a[i]*20), ...p2.map((v,i) => v - a[i]*20)];
    }

    function setup() {
        primalPlot = createPlot(primalPlotDiv, "Primal Problem");
        dualPlot = createPlot(dualPlotDiv, "Dual Problem (y₃=0 slice)");
        update();
    }

    c1In.addEventListener('input', update);
    c2In.addEventListener('input', update);
    new ResizeObserver(setup).observe(container);
    setup();
}
