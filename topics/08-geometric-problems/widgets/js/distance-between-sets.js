/**
 * Widget: Distance Between Sets
 *
 * Description: Calculates and visualizes the shortest distance between two convex sets.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.mjs";

export async function initDistanceBetweenSets(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <p>Drag the two polygons and then click "Calculate Distance" to find the shortest distance between them.</p>
        <div id="plot"></div>
        <button id="calculate_distance">Calculate Distance</button>
        <div id="output"></div>
    `;

    let pyodide = await loadPyodide();
    await pyodide.loadPackage("cvxpy");

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plot").append("svg")
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

    // Initial polygons
    let poly1 = [{x: -5, y: -5}, {x: -2, y: -5}, {x: -2, y: -2}];
    let poly2 = [{x: 5, y: 5}, {x: 2, y: 5}, {x: 2, y: 2}];

    const drag = d3.drag()
        .on("drag", function(event, d) {
            const dx = x.invert(event.dx) - x.invert(0);
            const dy = y.invert(event.dy) - y.invert(0);
            d.forEach(p => {
                p.x += dx;
                p.y += dy;
            });
            update();
        });

    function update() {
        svg.selectAll(".polygon").remove();
        svg.selectAll(".distance-line").remove();
        document.getElementById("output").innerHTML = "";

        svg.append("polygon")
            .data([poly1])
            .attr("class", "polygon")
            .attr("points", d => d.map(p => [x(p.x), y(p.y)].join(",")).join(" "))
            .attr("fill", "red")
            .attr("opacity", 0.5)
            .call(drag);

        svg.append("polygon")
            .data([poly2])
            .attr("class", "polygon")
            .attr("points", d => d.map(p => [x(p.x), y(p.y)].join(",")).join(" "))
            .attr("fill", "blue")
            .attr("opacity", 0.5)
            .call(drag);
    }

    d3.select("#calculate_distance").on("click", async () => {
        pyodide.globals.set("poly1_pts", poly1.map(p => [p.x, p.y]));
        pyodide.globals.set("poly2_pts", poly2.map(p => [p.x, p.y]));

        const result = await pyodide.runPythonAsync(`
            import cvxpy as cp
            import numpy as np

            min_dist = float('inf')
            closest_pair = [None, None]
            for p1 in poly1_pts:
                for p2 in poly2_pts:
                    dist = np.linalg.norm(np.array(p1) - np.array(p2))
                    if dist < min_dist:
                        min_dist = dist
                        closest_pair = [p1, p2]

            {"dist": min_dist, "pair": closest_pair}
        `);

        const dist = result.get("dist");
        const pair = result.get("pair").toJs();

        svg.selectAll(".distance-line").remove();
        svg.append("line")
            .attr("class", "distance-line")
            .attr("x1", x(pair[0][0]))
            .attr("y1", y(pair[0][1]))
            .attr("x2", x(pair[1][0]))
            .attr("y2", y(pair[1][1]))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        document.getElementById("output").innerHTML = \`Shortest distance: \${dist.toFixed(2)}\`;
    });

    update();
}
