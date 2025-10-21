/**
 * Widget: Tangent Line Explorer
 *
 * Description: Allows users to slide a point along a convex function's graph and see that the tangent line is always a global underestimator.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initTangentLineExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([0, 25]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Function and its derivative
    const f = x_val => x_val*x_val;
    const grad_f = x_val => 2*x_val;

    // Draw the function
    const line = d3.line()
        .x(d => x(d))
        .y(d => y(f(d)));

    svg.append("path")
        .datum(d3.range(-5, 5.1, 0.1))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    const dragPoint = { x: 2, y: f(2) };

    const drag = d3.drag()
        .on("drag", function(event, d) {
            d.x = x.invert(event.x);
            d.y = f(d.x);
            update();
        });

    function update() {
        svg.selectAll(".drag-point").remove();
        svg.selectAll(".tangent-line").remove();

        // Draggable point
        svg.append("circle")
            .data([dragPoint])
            .attr("class", "drag-point")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 7)
            .attr("fill", "red")
            .call(drag);

        // Tangent line
        const slope = grad_f(dragPoint.x);
        const intercept = dragPoint.y - slope * dragPoint.x;
        const y1 = slope * (-5) + intercept;
        const y2 = slope * (5) + intercept;

        svg.append("line")
            .attr("class", "tangent-line")
            .attr("x1", x(-5))
            .attr("y1", y(y1))
            .attr("x2", x(5))
            .attr("y2", y(y2))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

    }

    // Initial draw
    update();
}
