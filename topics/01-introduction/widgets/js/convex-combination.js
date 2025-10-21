/**
 * Widget: Convex Combination Animator
 *
 * Description: Animates the concept of a convex combination by showing the line segment between two points remaining within a set.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexCombination(containerId) {
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
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-10, 10]).range([height/2, -height/2]);

    // Add X and Y axes
    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Convex set (a circle)
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", x(8) - x(0))
        .attr("fill", "lightblue")
        .attr("opacity", 0.5);

    let p1 = {x: -5, y: -5};
    let p2 = {x: 5, y: 5};

    const drag = d3.drag()
        .on("drag", function(event, d) {
            d.x = x.invert(event.x);
            d.y = y.invert(event.y);
            update();
        });

    function update() {
        svg.selectAll(".draggable").remove();

        // Draggable points
        draw_point(p1, "red");
        draw_point(p2, "blue");

        // Line segment
        svg.append("line")
            .attr("class", "draggable")
            .attr("x1", x(p1.x))
            .attr("y1", y(p1.y))
            .attr("x2", x(p2.x))
            .attr("y2", y(p2.y))
            .attr("stroke", "black");

        // Animated point
        const animated_point = svg.append("circle")
            .attr("class", "draggable")
            .attr("r", 5)
            .attr("fill", "green");

        animated_point.transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attrTween("transform", function() {
                return function(t) {
                    const cx = x(p1.x * (1 - t) + p2.x * t);
                    const cy = y(p1.y * (1 - t) + p2.y * t);
                    return `translate(${cx},${cy})`;
                };
            })
            .on("end", update); // Loop the animation
    }

    function draw_point(p, color) {
        svg.append("circle")
            .data([p])
            .attr("class", "draggable")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 7)
            .attr("fill", color)
            .call(drag);
    }

    // Initial draw
    update();
}
