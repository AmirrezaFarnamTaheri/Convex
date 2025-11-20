/**
 * Widget: Orthogonality Explorer
 *
 * Description: Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOrthogonality(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-canvas-container" id="plot-container"></div>
            <div class="widget-controls">
                <div class="widget-control-group">
                   <span class="widget-label">Drag the circular handles to move vectors.</span>
                </div>
            </div>
            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputContainer = container.querySelector("#output-container");

    let width, height;
    let x, y;
    let svg;

    let vecA = {x: 5, y: 5, id: 'a'};
    let vecB = {x: -5, y: 5, id: 'b'};

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 40};

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
        svg.append("g").attr("class", "axis x-axis").call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").call(d3.axisLeft(y).ticks(5));

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
        let projVec = { x: 0, y: 0 };
        if (magB > 1e-9) {
            const projScalar = dotProduct / (magB**2);
            projVec = { x: projScalar * vecB.x, y: projScalar * vecB.y };
        }

        const isOrthogonal = !isNaN(angle) && Math.abs(angle - 90) < 1.5;

        outputContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <p><strong>Vector A:</strong> [${vecA.x.toFixed(2)}, ${vecA.y.toFixed(2)}]</p>
                    <p><strong>Vector B:</strong> [${vecB.x.toFixed(2)}, ${vecB.y.toFixed(2)}]</p>
                </div>
                <div>
                     <p><strong>Dot Product:</strong> ${dotProduct.toFixed(2)}</p>
                     <p><strong>Angle (θ):</strong> ${isNaN(angle) ? "Undefined" : angle.toFixed(1) + "°"}
                     ${isOrthogonal ? '<span style="color: var(--color-success); font-weight: bold; margin-left: 8px;">ORTHOGONAL!</span>' : ''}</p>
                </div>
            </div>
        `;

        drawVector(vecA, "var(--color-primary)", "A");
        drawVector(vecB, "var(--color-accent)", "B");
        drawProjection(projVec, vecA);
        drawOrthogonalIndicator(isOrthogonal);
    }

    function drawVector(vec, color, label) {
        svg.selectAll(`.vector-group-${vec.id}`).remove();

        const g = svg.append("g").attr("class", `vector-group-${vec.id}`);

        // Line
        g.append("line")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(vec.x)).attr("y2", y(vec.y))
            .attr("stroke", color)
            .attr("stroke-width", 3)
            .attr("marker-end", color.includes("primary") ? "url(#arrow-primary)" : "url(#arrow-accent)");

        // Handle
        g.append("circle")
            .data([vec])
            .attr("class", "handle")
            .attr("cx", x(vec.x)).attr("cy", y(vec.y))
            .attr("r", 8)
            .attr("fill", color)
            .call(drag);

        // Label
        g.append("text")
            .attr("x", x(vec.x) + 15)
            .attr("y", y(vec.y))
            .attr("fill", "var(--color-text-main)")
            .text(label)
            .style("font-weight", "bold")
            .style("font-size", "14px");
    }

    function drawProjection(proj, fromVec) {
        svg.selectAll(".projection-group").remove();
        const g = svg.append("g").attr("class", "projection-group");

        // Dashed line from A to projection
        g.append("line")
            .attr("x1", x(fromVec.x)).attr("y1", y(fromVec.y))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "var(--color-text-muted)")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4 4");

        // Projection vector
        g.append("line")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "#fbbf24") // Amber color for projection
            .attr("stroke-width", 2.5);

        // Label
        g.append("text")
            .attr("x", x(proj.x / 2))
            .attr("y", y(proj.y / 2) + 15)
            .attr("fill", "#fbbf24")
            .text("proj")
            .style("font-size", "12px");
    }

    function drawOrthogonalIndicator(isOrthogonal) {
        svg.selectAll('.orthogonal-indicator').remove();
        if (isOrthogonal) {
            const size = 20;
            // Simple square corner at origin rotated to align with B?
            // For simplicity, we just draw a fixed square at origin since we check dot product
            // Ideally this should align with vectors, but A and B move.
            // Let's just put a visual marker at the origin aligned with axes for now,
            // or better, just rely on the text output "ORTHOGONAL" which is clearer.

            // Drawing a small square at the origin is confusing if vectors are rotated.
            // Let's highlight the origin instead.
            svg.append("circle")
                .attr("class", "orthogonal-indicator")
                .attr("cx", x(0)).attr("cy", y(0))
                .attr("r", 5)
                .attr("fill", "var(--color-success)");
        }
    }

    const resizeObserver = new ResizeObserver(entries => {
        if (entries[0].target === plotContainer) {
            setupChart();
            update();
        }
    });
    resizeObserver.observe(plotContainer);

    // Initial setup
    setupChart();
    update();
}
