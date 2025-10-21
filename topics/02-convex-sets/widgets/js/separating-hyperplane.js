/**
 * Widget: Separating Hyperplane Visualizer
 *
 * Description: Allows users to place two convex sets and watch the algorithm find a separating hyperplane between them.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initSeparatingHyperplane(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const controls = document.createElement("div");
    controls.innerHTML = `<button id="find_hyperplane">Find Hyperplane</button>`;
    container.appendChild(controls);

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Draggable circles representing convex sets
    const circle1 = { x: -5, y: -5, r: 2 };
    const circle2 = { x: 5, y: 5, r: 2 };

    const drag = d3.drag()
        .on("drag", function(event, d) {
            d.x = x.invert(event.x);
            d.y = y.invert(event.y);
            d3.select(this)
                .attr("cx", x(d.x))
                .attr("cy", y(d.y));
            svg.select(".hyperplane").remove(); // Remove hyperplane on drag
        });

    svg.append("circle")
        .data([circle1])
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", x(circle1.r) - x(0))
        .attr("fill", "red")
        .call(drag);

    svg.append("circle")
        .data([circle2])
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", x(circle2.r) - x(0))
        .attr("fill", "blue")
        .call(drag);


    d3.select("#find_hyperplane").on("click", () => {
        svg.select(".hyperplane").remove();

        const mid_x = (circle1.x + circle2.x) / 2;
        const mid_y = (circle1.y + circle2.y) / 2;
        const dx = circle2.x - circle1.x;
        const dy = circle2.y - circle1.y;

        const tangent = { x: -dy, y: dx };

        const p1 = { x: mid_x + 10 * tangent.x, y: mid_y + 10 * tangent.y };
        const p2 = { x: mid_x - 10 * tangent.x, y: mid_y - 10 * tangent.y };

        svg.append("line")
            .attr("class", "hyperplane")
            .attr("x1", x(p1.x))
            .attr("y1", y(p1.y))
            .attr("x2", x(p2.x))
            .attr("y2", y(p2.y))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    });
}
