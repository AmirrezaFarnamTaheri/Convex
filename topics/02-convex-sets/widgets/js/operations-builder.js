/**
 * Widget: Operations Builder
 *
 * Description: A tool where users can apply operations (intersection, affine transformation) to pre-defined convex sets to see the result.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOperationsBuilder(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <select id="operation_selector">
            <option value="intersection">Intersection</option>
            <option value="affine">Affine Transformation</option>
        </select>
        <div id="plot"></div>
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

    // Pre-defined sets
    const circle = { cx: -3, cy: 0, r: 5 };
    const square = { x: -2, y: -5, width: 10, height: 10 };

    function draw(operation) {
        svg.selectAll("*").remove();
        svg.append("g").call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        if (operation === "intersection") {
            // Draw the original sets
            svg.append("circle").attr("cx", x(circle.cx)).attr("cy", y(circle.cy)).attr("r", x(circle.r) - x(0)).attr("fill", "red").attr("opacity", 0.5);
            svg.append("rect").attr("x", x(square.x)).attr("y", y(square.y + square.height)).attr("width", x(square.width)-x(0)).attr("height", y(0)-y(square.height)).attr("fill", "blue").attr("opacity", 0.5);

            svg.append("text").attr("x", 0).attr("y", 0).text("Intersection Area").style("text-anchor", "middle");

        } else if (operation === "affine") {
            const transformed_circle = { cx: circle.cx * 1.5 + 2, cy: circle.cy * 0.5 - 1, r: circle.r * 1.2 };
            svg.append("circle").attr("cx", x(transformed_circle.cx)).attr("cy", y(transformed_circle.cy)).attr("r", x(transformed_circle.r) - x(0)).attr("fill", "purple").attr("opacity", 0.7);
        }
    }


    d3.select("#operation_selector").on("change", function() {
        draw(this.value);
    });

    draw("intersection");
}
