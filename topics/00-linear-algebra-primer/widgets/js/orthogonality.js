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
        <div id="plot"></div>
        <div id="output"></div>
    `;

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

    // Add X and Y axes
    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));


    let vec1 = {x: 5, y: 5};
    let vec2 = {x: -5, y: 5};

    const drag = d3.drag()
        .on("drag", function(event, d) {
            d.x = x.invert(event.x);
            d.y = y.invert(event.y);
            update();
        });

    function update() {
        svg.selectAll(".vector").remove();

        draw_vector(vec1, "blue");
        draw_vector(vec2, "red");

        // Calculate dot product and angle
        const dot_product = vec1.x * vec2.x + vec1.y * vec2.y;
        const mag1 = Math.sqrt(vec1.x**2 + vec1.y**2);
        const mag2 = Math.sqrt(vec2.x**2 + vec2.y**2);
        const angle = Math.acos(dot_product / (mag1 * mag2)) * (180 / Math.PI);

        document.getElementById("output").innerHTML = `
            <p>Dot Product: ${dot_product.toFixed(2)}</p>
            <p>Angle: ${angle.toFixed(2)}°</p>
        `;
    }

    function draw_vector(vec, color) {
        svg.append("line")
            .attr("class", "vector")
            .attr("x1", x(0))
            .attr("y1", y(0))
            .attr("x2", x(vec.x))
            .attr("y2", y(vec.y))
            .attr("stroke", color)
            .attr("stroke-width", 2);

        svg.append("circle")
            .data([vec])
            .attr("class", "vector")
            .attr("cx", x(vec.x))
            .attr("cy", y(vec.y))
            .attr("r", 7)
            .attr("fill", color)
            .call(drag);
    }

    // Initial draw
    update();
}
