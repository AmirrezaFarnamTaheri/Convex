/**
 * Widget: Orthogonality Explorer
 *
 * Description: Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOrthogonality(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="orthogonality-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div id="output-container" class="widget-output" style="padding-top: 10px;"></div>
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
        height = 400 - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} 400`)
            .append("g")
            .attr("transform", `translate(${plotContainer.clientWidth / 2}, ${200})`);

        x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
        y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

        // Add X and Y axes
        svg.append("g").attr("class", "axis x-axis").call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").call(d3.axisLeft(y).ticks(5));

        // Add axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", width / 2)
            .attr("y", height/2 + 35)
            .text("x");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "start")
            .attr("x", -margin.left -10)
            .attr("y", -height / 2 - 5)
            .text("y");

        // Define arrowheads
        svg.append("defs").append("marker")
            .attr("id", "arrow-primary")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "var(--color-primary)");

        svg.append("defs").append("marker")
            .attr("id", "arrow-accent")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
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
            d.x = x.invert(mx);
            d.y = y.invert(my);
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
            angle = Math.acos(d3.max([-1, d3.min([1, cosTheta])])) * (180 / Math.PI);
        }

        // Projection of A onto B
        let projVec = { x: 0, y: 0 };
        if (magB > 1e-9) {
            const projScalar = dotProduct / (magB**2);
            projVec = { x: projScalar * vecB.x, y: projScalar * vecB.y };
        }

        outputContainer.innerHTML = `
            <p><strong>Vector A:</strong> [${vecA.x.toFixed(2)}, ${vecA.y.toFixed(2)}] | <strong>Magnitude:</strong> ${magA.toFixed(2)}</p>
            <p><strong>Vector B:</strong> [${vecB.x.toFixed(2)}, ${vecB.y.toFixed(2)}] | <strong>Magnitude:</strong> ${magB.toFixed(2)}</p>
            <p><strong>Dot Product (A ⋅ B):</strong> ${dotProduct.toFixed(2)}</p>
            <p><strong>Angle (θ):</strong> ${isNaN(angle) ? "Undefined" : angle.toFixed(2) + "°"}</p>
        `;

        drawVector(vecA, "var(--color-primary)", "A");
        drawVector(vecB, "var(--color-accent)", "B");
        drawProjection(projVec, vecA);

        const isOrthogonal = !isNaN(angle) && Math.abs(angle - 90) < 1.5;
        drawOrthogonalIndicator(isOrthogonal);
    }

    function drawVector(vec, color, label) {
        svg.selectAll(`.vector-${vec.id}`).remove();

        const line = svg.append("line")
            .attr("class", `vector vector-${vec.id}`)
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(vec.x)).attr("y2", y(vec.y))
            .attr("stroke", color)
            .attr("stroke-width", 3)
            .attr("marker-end", color === "var(--color-primary)" ? "url(#arrow-primary)" : "url(#arrow-accent)");

        svg.append("circle")
            .data([vec])
            .attr("class", `vector-handle vector-${vec.id}`)
            .attr("cx", x(vec.x)).attr("cy", y(vec.y))
            .attr("r", 10)
            .attr("fill", color)
            .style("cursor", "grab")
            .call(drag);

        svg.append("text")
            .attr("class", `vector-label vector-${vec.id}`)
            .attr("x", x(vec.x) + 15)
            .attr("y", y(vec.y))
            .attr("fill", "var(--color-text-main)")
            .text(label)
            .style("font-size", "16px")
            .style("font-weight", "bold");
    }

    function drawProjection(proj, fromVec) {
        svg.selectAll(".projection").remove();
        svg.selectAll(".projection-line").remove();

        // Line from A to its projection on B
        svg.append("line")
            .attr("class", "projection-line")
            .attr("x1", x(fromVec.x)).attr("y1", y(fromVec.y))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "var(--color-text-main)")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3 3");

        // The projection vector itself
        svg.append("line")
            .attr("class", "projection")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "orange")
            .attr("stroke-width", 2.5);

        svg.append("text")
            .attr("class", "projection")
            .attr("x", x(proj.x / 2) + 5)
            .attr("y", y(proj.y / 2) + 5)
            .attr("fill", "orange")
            .text("proj_B(A)")
            .style("font-size", "12px");
    }

    function drawOrthogonalIndicator(isOrthogonal) {
        svg.selectAll('.orthogonal-indicator').remove();
        if (isOrthogonal) {
            const size = 15;
            const path = d3.path();
            path.moveTo(x(size / 10), y(0));
            path.lineTo(x(size / 10), y(size / 10));
            path.lineTo(x(0), y(size / 10));

            svg.append('path')
                .attr('class', 'orthogonal-indicator')
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', 'var(--color-text-main)')
                .attr('stroke-width', 2);
        }
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === plotContainer) {
                setupChart();
                update();
            }
        }
    });

    resizeObserver.observe(plotContainer);

    // Initial setup and draw
    setupChart();
    update();
}
