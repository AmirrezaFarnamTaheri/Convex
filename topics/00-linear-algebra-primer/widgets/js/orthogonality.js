/**
 * Widget: Orthogonality Explorer
 *
 * Description: Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
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
            <div id="plot-container"></div>
            <div id="output-container" class="widget-output"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const outputContainer = container.querySelector("#output-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = plotContainer.clientWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

    // Add X and Y axes
    svg.append("g").attr("class", "axis").call(d3.axisBottom(x));
    svg.append("g").attr("class", "axis").call(d3.axisLeft(y));


    let vecA = {x: 5, y: 5, id: 'a'};
    let vecB = {x: -5, y: 5, id: 'b'};

    const drag = d3.drag()
        .on("start", (event, d) => d3.select(event.sourceEvent.target).raise())
        .on("drag", function(event, d) {
            const [mx, my] = d3.pointer(event, svg.node());
            d.x = x.invert(mx);
            d.y = y.invert(my);
            update();
        });

    function update() {
        const dotProduct = vecA.x * vecB.x + vecA.y * vecB.y;
        const magA = Math.sqrt(vecA.x**2 + vecA.y**2);
        const magB = Math.sqrt(vecB.x**2 + vecB.y**2);
        const angle = Math.acos(dotProduct / (magA * magB)) * (180 / Math.PI);

        // Projection of A onto B
        const projScalar = dotProduct / (magB**2);
        const projVec = { x: projScalar * vecB.x, y: projScalar * vecB.y };

        outputContainer.innerHTML = `
            <p><strong>Vector A:</strong> [${vecA.x.toFixed(2)}, ${vecA.y.toFixed(2)}]</p>
            <p><strong>Vector B:</strong> [${vecB.x.toFixed(2)}, ${vecB.y.toFixed(2)}]</p>
            <p><strong>Dot Product (A ⋅ B):</strong> ${dotProduct.toFixed(2)}</p>
            <p><strong>Angle:</strong> ${angle.toFixed(2)}°</p>
        `;

        drawVector(vecA, "var(--color-primary)", "A");
        drawVector(vecB, "var(--color-accent)", "B");
        drawProjection(projVec);
    }

    function drawVector(vec, color, label) {
        svg.selectAll(`.vector-${vec.id}`).remove();

        svg.append("line")
            .attr("class", `vector vector-${vec.id}`)
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(vec.x)).attr("y2", y(vec.y))
            .attr("stroke", color)
            .attr("stroke-width", 3);

        svg.append("circle")
            .data([vec])
            .attr("class", `vector-handle vector-${vec.id}`)
            .attr("cx", x(vec.x)).attr("cy", y(vec.y))
            .attr("r", 8)
            .attr("fill", color)
            .style("cursor", "pointer")
            .call(drag);
    }

    function drawProjection(proj) {
        svg.selectAll(".projection").remove();

        svg.append("line")
            .attr("class", "projection")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(proj.x)).attr("y2", y(proj.y))
            .attr("stroke", "var(--color-text-main)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4 4");
    }

    // Initial draw
    update();
}
