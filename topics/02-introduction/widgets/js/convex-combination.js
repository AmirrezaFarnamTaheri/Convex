/**
 * Widget: Convex Hull Explorer
 *
 * Description: Demonstrates the concept of a convex hull and convex combinations.
 *              Users can drag 3 points to form a triangle and move a 4th point
 *              to see if it can be expressed as a convex combination of the vertices.
 * Version: 2.4.0 (Styled)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexCombination(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: crosshair; background: var(--bg-surface-1);"></div>
            <div class="widget-controls">
                <div class="control-group">
                    <label style="font-size:var(--text-sm); color:var(--text-secondary);">
                        Target Point <strong style="color:var(--accent-400);">x</strong>
                        as Convex Combination of <strong style="color:var(--primary-400);">v₁, v₂, v₃</strong>
                    </label>
                </div>
            </div>
            <div id="combo-output" class="widget-output" style="font-family:var(--font-mono); font-size:0.9rem; min-height:80px; display:flex; flex-direction:column; justify-content:center;"></div>
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
        const gridGroup = svg.append("g").attr("class", "grid-group");
        gridGroup.append("g").attr("class", "grid-line axis-x").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat("")).attr("transform", `translate(0, ${height/2})`).attr("opacity", 0.1);
        gridGroup.append("g").attr("class", "grid-line axis-y").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat("")).attr("transform", `translate(${-width/2}, 0)`).attr("opacity", 0.1);

        // Hull
        svg.append("path").attr("class", "hull-path")
            .attr("fill", "rgba(59, 130, 246, 0.1)") // Primary-500 alpha
            .attr("stroke", "var(--primary-500)")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round");

        // Handles (Vertices)
        const verticesGroup = svg.selectAll(".vertex-group").data(vertices).enter().append("g").attr("class", "vertex-group");

        verticesGroup.append("circle").attr("class", "vertex-glow")
            .attr("r", 15).attr("fill", "var(--primary-500)").attr("opacity", 0).attr("cx", d => x(d.x)).attr("cy", d => y(d.y));

        verticesGroup.append("circle").attr("class", "vertex handle")
            .attr("r", 6).attr("fill", "var(--primary-500)").attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2)
            .style("cursor", "grab")
            .call(d3.drag()
                .on("drag", (event, d) => {
                    const [mx, my] = d3.pointer(event, svg.node());
                    d.x = Math.max(-10, Math.min(10, x.invert(mx)));
                    d.y = Math.max(-10, Math.min(10, y.invert(my)));
                    update();
                })
            );

        // Target Handle
        const targetGroup = svg.append("g").attr("class", "target-group");
        targetGroup.append("circle").attr("class", "target-glow")
            .attr("r", 12).attr("fill", "var(--accent-400)").attr("opacity", 0);

        targetGroup.append("circle").attr("class", "target handle")
            .attr("r", 6).attr("fill", "var(--accent-400)").attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2)
            .style("cursor", "grab")
            .call(d3.drag()
                .on("drag", (event) => {
                    const [mx, my] = d3.pointer(event, svg.node());
                    target.x = Math.max(-10, Math.min(10, x.invert(mx)));
                    target.y = Math.max(-10, Math.min(10, y.invert(my)));
                    update();
                })
            );

        // Labels
        svg.selectAll(".vertex-label").data(vertices).enter().append("text")
            .attr("class", "vertex-label").attr("dy", -10).attr("text-anchor", "middle")
            .attr("fill", "var(--text-secondary)").style("pointer-events", "none").style("font-size", "10px")
            .text((d, i) => `v${i+1}`);

        svg.append("text").attr("class", "target-label").text("x").attr("dy", -10).attr("fill", "var(--accent-400)").style("pointer-events", "none").style("font-weight", "bold");

        update();
    }

    function getBarycentric(p, a, b, c) {
        const det = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
        const lambda1 = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / det;
        const lambda2 = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / det;
        const lambda3 = 1 - lambda1 - lambda2;
        return [lambda1, lambda2, lambda3];
    }

    function update() {
        const hullData = vertices.map(v => [v.x, v.y]);
        const line = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveLinearClosed);
        svg.select(".hull-path").attr("d", line(hullData));

        svg.selectAll(".vertex").attr("cx", d => x(d.x)).attr("cy", d => y(d.y));
        svg.selectAll(".vertex-glow").attr("cx", d => x(d.x)).attr("cy", d => y(d.y));
        svg.selectAll(".vertex-label").attr("x", d => x(d.x)).attr("y", d => y(d.y));

        svg.select(".target").attr("cx", x(target.x)).attr("cy", y(target.y));
        svg.select(".target-glow").attr("cx", x(target.x)).attr("cy", y(target.y));
        svg.select(".target-label").attr("x", x(target.x)).attr("y", y(target.y));

        const lambdas = getBarycentric(target, vertices[0], vertices[1], vertices[2]);
        const isInside = lambdas.every(l => l >= -1e-2);

        const l1 = lambdas[0].toFixed(2);
        const l2 = lambdas[1].toFixed(2);
        const l3 = lambdas[2].toFixed(2);

        const color = isInside ? "var(--success)" : "var(--error)";
        const status = isInside ? "Inside Convex Hull" : "Outside Convex Hull";

        comboOutput.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:8px; margin-bottom:8px;">
                <span style="font-size:var(--text-sm); color:var(--text-secondary);">Status</span>
                <strong style="color:${color}; font-size:var(--text-sm);">${status}</strong>
            </div>
            <div style="font-size:0.85rem; color:var(--text-primary);">
                $x = ${l1}v_1 + ${l2}v_2 + ${l3}v_3$
            </div>
            <div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:4px;">
                Sum $\\approx ${(lambdas[0]+lambdas[1]+lambdas[2]).toFixed(2)}$, ${isInside ? "all $\\theta_i \\ge 0$" : "some $\\theta_i < 0$"}
            </div>
        `;

        if (window.renderMathInElement) {
            window.renderMathInElement(comboOutput, {
                delimiters: [{left: "$", right: "$", display: false}]
            });
        }

        svg.select(".hull-path")
            .attr("fill", isInside ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 68, 68, 0.05)")
            .attr("stroke", isInside ? "var(--primary-500)" : "var(--error)");
    }

    new ResizeObserver(() => {
        setupChart();
    }).observe(plotContainer);

    setupChart();
}
