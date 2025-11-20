/**
 * Widget: Convex Hull Explorer
 *
 * Description: Demonstrates the concept of a convex hull and convex combinations.
 *              Users can drag 3 points to form a triangle and move a 4th point
 *              to see if it can be expressed as a convex combination of the vertices.
 * Version: 2.3.0 (Enhanced with KaTeX)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexCombination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls">
                <div class="widget-control-group">
                    <label class="widget-label">
                        Target Point <span style="color: var(--color-accent);">x</span>
                        as Convex Combination of <span style="color: var(--color-primary);">v₁, v₂, v₃</span>
                    </label>
                </div>
            </div>
            <div id="combo-output" class="widget-output" style="font-family: var(--widget-font-mono); font-size: 0.9rem; min-height: 80px;"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const comboOutput = container.querySelector("#combo-output");

    let svg, x, y;

    // Initial Triangle Vertices
    let vertices = [
        { x: -5, y: -5, id: 1 },
        { x: 5, y: -5, id: 2 },
        { x: 0, y: 5, id: 3 }
    ];

    // Probe point
    let target = { x: 0, y: 0 };

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left + width / 2},${margin.top + height / 2})`);

        x = d3.scaleLinear().domain([-10, 10]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-10, 10]).range([height / 2, -height / 2]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(height).tickFormat("")).attr("transform", `translate(0, ${-height/2})`);
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat("")).attr("transform", `translate(${-width/2}, 0)`);

        // Hull
        svg.append("path").attr("class", "hull-path")
            .attr("fill", "rgba(124, 197, 255, 0.2)")
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

        // Handles (Vertices)
        svg.selectAll(".vertex").data(vertices).enter().append("circle")
            .attr("class", "vertex handle")
            .attr("r", 8)
            .attr("fill", "var(--color-primary)")
            .style("cursor", "move")
            .call(d3.drag().on("drag", (event, d) => {
                const [mx, my] = d3.pointer(event, svg.node());
                d.x = x.invert(mx); d.y = y.invert(my);
                update();
            }));

        // Target Handle
        svg.append("circle").attr("class", "target handle")
            .attr("r", 6)
            .attr("fill", "var(--color-accent)")
            .attr("stroke", "white").attr("stroke-width", 2)
            .style("cursor", "move")
            .call(d3.drag().on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                target.x = x.invert(mx); target.y = y.invert(my);
                update();
            }));

        // Labels
        svg.selectAll(".vertex-label").data(vertices).enter().append("text")
            .attr("class", "vertex-label")
            .attr("dy", -12)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--color-text-main)")
            .style("pointer-events", "none")
            .text((d, i) => `v${i+1}`);

        svg.append("text").attr("class", "target-label").text("x").attr("dy", -10).attr("fill", "var(--color-accent)").style("pointer-events", "none");

        update();
    }

    // Barycentric coordinates for point P inside Triangle ABC
    function getBarycentric(p, a, b, c) {
        const det = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
        const lambda1 = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / det;
        const lambda2 = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / det;
        const lambda3 = 1 - lambda1 - lambda2;
        return [lambda1, lambda2, lambda3];
    }

    function update() {
        // Draw Triangle
        const hullData = vertices.map(v => [v.x, v.y]);
        const line = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveLinearClosed);
        svg.select(".hull-path").attr("d", line(hullData));

        // Update positions
        svg.selectAll(".vertex")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y));
        svg.selectAll(".vertex-label")
            .attr("x", d => x(d.x)).attr("y", d => y(d.y));

        svg.select(".target").attr("cx", x(target.x)).attr("cy", y(target.y));
        svg.select(".target-label").attr("x", x(target.x)).attr("y", y(target.y));

        // Compute Barycentric Coords
        const lambdas = getBarycentric(target, vertices[0], vertices[1], vertices[2]);

        // Check if inside (all lambdas >= -tolerance)
        // Using a slightly loose tolerance for easier UI interaction
        const isInside = lambdas.every(l => l >= -1e-2);

        // Format numbers
        const l1 = lambdas[0].toFixed(2);
        const l2 = lambdas[1].toFixed(2);
        const l3 = lambdas[2].toFixed(2);

        const color = isInside ? "var(--color-success)" : "var(--color-error)";
        const status = isInside ? "Inside Convex Hull" : "Outside Convex Hull";

        // KaTeX rendering if available, else fallback
        const equation = `x = ${l1}v_1 + ${l2}v_2 + ${l3}v_3`;
        const sumCheck = `\\sum \\theta_i = ${(lambdas[0]+lambdas[1]+lambdas[2]).toFixed(2)}`;

        let equationHtml = equation;
        let sumCheckHtml = sumCheck;

        if (window.katex) {
            equationHtml = window.katex.renderToString(equation, { throwOnError: false });
            sumCheckHtml = window.katex.renderToString(sumCheck, { throwOnError: false });
        }

        comboOutput.innerHTML = `
            <div style="color: ${color}; margin-bottom: 8px;"><strong>${status}</strong></div>
            <div style="margin-bottom: 8px;">${equationHtml}</div>
            <div style="color: var(--color-text-muted); font-size: 0.85rem;">
                ${sumCheckHtml}, ${isInside ? "all \\theta_i \\ge 0" : "some \\theta_i < 0"}
            </div>
        `;

        svg.select(".hull-path")
            .attr("fill", isInside ? "rgba(124, 197, 255, 0.2)" : "rgba(255, 107, 107, 0.1)")
            .attr("stroke", isInside ? "var(--color-primary)" : "var(--color-error)");
    }

    new ResizeObserver(() => {
        setupChart();
    }).observe(plotContainer);

    setupChart();
}
