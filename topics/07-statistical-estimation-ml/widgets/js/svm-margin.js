/**
 * Widget: SVM Margin Explorer
 *
 * Description: Allows users to drag support vectors and see how the SVM margin and decision boundary change.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initSVMMargin(containerId) {
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

    const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Data points
    const points = [
        {x: -5, y: -5, class: -1}, {x: -3, y: -2, class: -1, support: true},
        {x: 5, y: 5, class: 1}, {x: 3, y: 2, class: 1, support: true}
    ];

    const drag = d3.drag()
        .on("drag", function(event, d) {
            if (!d.support) return;
            d.x = x.invert(event.x);
            d.y = y.invert(event.y);
            update();
        });

    function update() {
        svg.selectAll("*").remove(); // Clear for simplicity

        // Re-add axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Draw points
        svg.selectAll(".datapoint")
            .data(points)
            .enter()
            .append("circle")
            .attr("class", "datapoint")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5)
            .attr("fill", d => d.class === -1 ? "red" : "blue")
            .call(drag);

        // Highlight support vectors
        svg.selectAll(".support-vector")
            .data(points.filter(d => d.support))
            .enter()
            .append("circle")
            .attr("class", "support-vector")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 10)
            .attr("fill", "none")
            .attr("stroke", "black");


        // Calculate and draw decision boundary and margins
        const sv1 = points.find(d => d.support && d.class === -1);
        const sv2 = points.find(d => d.support && d.class === 1);

        const w = {x: sv2.x - sv1.x, y: sv2.y - sv1.y};
        const b = ((sv2.x*sv2.x + sv2.y*sv2.y) - (sv1.x*sv1.x + sv1.y*sv1.y)) / 2;

        const db_y1 = (b - w.x * -10) / w.y;
        const db_y2 = (b - w.x * 10) / w.y;
        draw_line(-10, db_y1, 10, db_y2, "black", "none");

        const m1_y1 = (b + 1 - w.x * -10) / w.y;
        const m1_y2 = (b + 1 - w.x * 10) / w.y;
        draw_line(-10, m1_y1, 10, m1_y2, "blue", "5,5");

        const m2_y1 = (b - 1 - w.x * -10) / w.y;
        const m2_y2 = (b - 1 - w.x * 10) / w.y;
        draw_line(-10, m2_y1, 10, m2_y2, "red", "5,5");

    }

    function draw_line(x1, y1, x2, y2, color, dasharray) {
         svg.append("line")
            .attr("x1", x(x1))
            .attr("y1", y(y1))
            .attr("x2", x(x2))
            .attr("y2", y(y2))
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", dasharray);
    }


    // Initial draw
    update();
}
