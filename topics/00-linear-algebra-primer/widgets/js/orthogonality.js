/**
 * Widget: Orthogonality Explorer
 *
 * Description: Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
 *              Visualizes the geometric interpretation of the inner product.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import katex from "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.mjs";

export function initOrthogonality(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-canvas-container" id="plot-container" style="cursor: crosshair;"></div>
            <div class="widget-controls">
                <div class="widget-control-group" style="font-size: 0.9rem; color: var(--color-text-muted);">
                   Drag the <span style="color: var(--color-primary); font-weight: bold;">Blue (a)</span> and <span style="color: var(--color-accent); font-weight: bold;">Green (b)</span> handles.
                </div>
            </div>
            <div id="output-container" class="widget-output" style="display: flex; justify-content: space-between; align-items: center;"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputContainer = container.querySelector("#output-container");

    let width, height;
    let x, y;
    let svg;

    let vecA = {x: 5, y: 5, id: 'a'};
    let vecB = {x: 5, y: 0, id: 'b'};

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 20, left: 20};

        width = plotContainer.clientWidth - margin.left - margin.right;
        height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
        y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis x-axis").call(d3.axisBottom(x).ticks(0).tickFormat(""));
        svg.append("g").attr("class", "axis y-axis").call(d3.axisLeft(y).ticks(0).tickFormat(""));

        // Define arrowheads
        const defs = svg.append("defs");

        defs.append("marker")
            .attr("id", "arrow-primary")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "var(--color-primary)");

        defs.append("marker")
            .attr("id", "arrow-accent")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "var(--color-accent)");

        defs.append("marker")
            .attr("id", "arrow-proj")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#fbbf24"); // Amber
    }

    const drag = d3.drag()
        .on("start", (event) => d3.select(event.sourceEvent.target).raise().classed("active", true))
        .on("drag", function(event, d) {
            const [mx, my] = d3.pointer(event, svg.node());
            d.x = Math.max(-10, Math.min(10, x.invert(mx)));
            d.y = Math.max(-10, Math.min(10, y.invert(my)));
            update();
        })
        .on("end", () => d3.select(event.sourceEvent.target).classed("active", false));

    function update() {
        const dotProduct = vecA.x * vecB.x + vecA.y * vecB.y;
        const magA = Math.sqrt(vecA.x**2 + vecA.y**2);
        const magB = Math.sqrt(vecB.x**2 + vecB.y**2);

        let angle = NaN;
        if (magA > 1e-9 && magB > 1e-9) {
            const cosTheta = dotProduct / (magA * magB);
            angle = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
        }

        // Projection of A onto B
        // p = (a . b / |b|^2) * b
        let projVec = { x: 0, y: 0 };
        if (magB > 1e-9) {
            const projScalar = dotProduct / (magB**2);
            projVec = { x: projScalar * vecB.x, y: projScalar * vecB.y };
        }

        const isOrthogonal = !isNaN(angle) && Math.abs(angle - 90) < 1.5;

        // Render math
        const texString = `\\cos \\theta = \\frac{a^\\top b}{\\|a\\| \\|b\\|} = \\frac{${dotProduct.toFixed(1)}}{${(magA*magB).toFixed(1)}} = ${isNaN(angle) ? "?" : Math.cos(angle * Math.PI/180).toFixed(3)}`;

        outputContainer.innerHTML = `
            <div style="flex: 1;">
                <div id="math-output"></div>
            </div>
            <div style="text-align: right;">
                 <div style="font-size: 0.8rem; color: var(--color-text-muted);">ANGLE</div>
                 <div style="font-size: 1.5rem; font-weight: bold; ${isOrthogonal ? 'color: var(--color-success);' : 'color: var(--color-text-main);'}">
                    ${isNaN(angle) ? "--" : angle.toFixed(1) + "°"}
                 </div>
                 ${isOrthogonal ? '<div style="color: var(--color-success); font-size: 0.7rem; font-weight: bold; letter-spacing: 1px;">ORTHOGONAL</div>' : ''}
            </div>
        `;

        katex.render(texString, document.getElementById('math-output'), { throwOnError: false });

        drawVector(vecA, "var(--color-primary)", "a", "arrow-primary");
        drawVector(vecB, "var(--color-accent)", "b", "arrow-accent");
        drawProjection(projVec, vecA, vecB);
        drawAngleArc(angle, magA, magB);
    }

    function drawVector(vec, color, label, arrowId) {
        svg.selectAll(`.vector-group-${vec.id}`).remove();
        const g = svg.append("g").attr("class", `vector-group-${vec.id}`);

        g.append("line")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(vec.x)).attr("y2", y(vec.y))
            .attr("stroke", color)
            .attr("stroke-width", 3)
            .attr("marker-end", `url(#${arrowId})`);

        g.append("circle")
            .data([vec])
            .attr("class", "handle")
            .attr("cx", x(vec.x)).attr("cy", y(vec.y))
            .attr("r", 10)
            .attr("fill", color)
            .attr("stroke", "var(--color-background)") // Contrast stroke
            .attr("stroke-width", 2)
            .call(drag);

        g.append("text")
            .attr("x", x(vec.x) + (vec.x > 0 ? 15 : -15))
            .attr("y", y(vec.y) + (vec.y > 0 ? -15 : 15))
            .attr("fill", color)
            .text(label)
            .style("font-weight", "bold")
            .style("font-size", "16px")
            .style("font-family", "var(--font-mono)");
    }

    function drawProjection(proj, fromVec, ontoVec) {
        svg.selectAll(".projection-group").remove();
        const g = svg.append("g").attr("class", "projection-group");

        // Dashed line from A to projection
        g.append("line")
            .attr("x1", x(fromVec.x)).attr("y1", y(fromVec.y))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4 4");

        // Projection vector (shadow)
        // Only draw if magnitude is significant
        if (Math.abs(proj.x) > 0.1 || Math.abs(proj.y) > 0.1) {
            g.append("line")
                .attr("x1", x(0)).attr("y1", y(0))
                .attr("x2", x(proj.x)).attr("y2", y(proj.y))
                .attr("stroke", "#fbbf24")
                .attr("stroke-width", 2.5)
                .attr("opacity", 0.8)
                .attr("marker-end", "url(#arrow-proj)");

            g.append("text")
                .attr("x", x(proj.x / 2))
                .attr("y", y(proj.y / 2) + 15)
                .attr("fill", "#fbbf24")
                .text("proj_b a")
                .style("font-size", "12px")
                .style("font-family", "var(--font-mono)");
        }
    }

    function drawAngleArc(angleDeg, magA, magB) {
        svg.selectAll(".angle-arc").remove();
        if (isNaN(angleDeg) || magA < 1 || magB < 1) return;

        const radius = Math.min(x(2) - x(0), x(magA/2) - x(0), x(magB/2) - x(0));

        // Calculate start and end angles in radians
        let startAngle = Math.atan2(vecB.y, vecB.x); // y is flipped in d3 scale? No, we use x() y() mapping.
        // d3.arc uses clockwise from 12 o'clock? No, standard math is counter-clockwise from 3 o'clock.
        // We need to be careful with SVG vs Cartesian coordinates.
        // y scale is inverted: y(10) is top (small pixel val), y(-10) is bottom (large pixel val).
        // So standard atan2(y, x) works if we invert y diff?
        // Let's compute angles in screen space.
        const angleA = Math.atan2(y(vecA.y) - y(0), x(vecA.x) - x(0));
        const angleB = Math.atan2(y(vecB.y) - y(0), x(vecB.x) - x(0));

        const arc = d3.arc()
            .innerRadius(radius - 2)
            .outerRadius(radius + 2)
            .startAngle(angleB + Math.PI/2) // d3.arc 0 is at 12 o'clock?
            .endAngle(angleA + Math.PI/2);  // adjustments often needed

        // Drawing a simple path is often easier than d3.arc for general vector angles
        // Or just use a path command A
    }

    const resizeObserver = new ResizeObserver(() => {
        setupChart();
        update();
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    update();
}
