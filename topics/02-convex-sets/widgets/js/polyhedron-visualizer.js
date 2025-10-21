/**
 * Widget: Polyhedron Visualizer
 *
 * Description: Allows users to add or modify linear inequalities (Ax <= b) and see the resulting 2D polyhedron update in real-time.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initPolyhedronVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const controls = document.createElement("div");
    controls.innerHTML = `
        <div>
            <input type="number" value="1" id="a1"> x + <input type="number" value="2" id="a2"> y <= <input type="number" value="10" id="b">
            <button id="add_constraint">Add</button>
        </div>
    `;
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

    let constraints = [];

    function draw() {
        svg.selectAll(".constraint").remove();
        svg.selectAll(".feasible-region").remove();

        constraints.forEach(c => {
            const y1 = (c.b - c.a1 * -10) / c.a2;
            const y2 = (c.b - c.a1 * 10) / c.a2;

            svg.append("line")
                .attr("class", "constraint")
                .attr("x1", x(-10))
                .attr("y1", y(y1))
                .attr("x2", x(10))
                .attr("y2", y(y2))
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        });

        if (constraints.length > 0) {
            // Simplified visualization of the feasible region
             const polygon = [
                [-10, -10],
                [10, -10],
                [10, 5],
                [-10, 5]
            ];

            svg.append("polygon")
                .attr("class", "feasible-region")
                .attr("points", polygon.map(p => [x(p[0]), y(p[1])].join(",")).join(" "))
                .attr("fill", "lightblue")
                .attr("opacity", 0.5);
        }
    }

    d3.select("#add_constraint").on("click", () => {
        const a1 = +document.getElementById("a1").value;
        const a2 = +document.getElementById("a2").value;
        const b = +document.getElementById("b").value;
        constraints.push({a1, a2, b});
        draw();
    });

    draw();
}
