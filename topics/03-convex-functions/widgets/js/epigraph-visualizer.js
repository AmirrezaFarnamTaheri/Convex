/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and allows the user to toggle the visualization of its epigraph.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <label><input type="checkbox" id="show_epigraph"> Show Epigraph</label>
        <div id="plot"></div>
    `;

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plot").append("svg")
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

    // Function
    const f = x_val => x_val*x_val;

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

    // Epigraph area
    const area = d3.area()
        .x(d => x(d))
        .y0(d => y(f(d)))
        .y1(0);

    const epigraph = svg.append("path")
        .datum(d3.range(-5, 5.1, 0.1))
        .attr("class", "epigraph")
        .attr("fill", "lightblue")
        .attr("opacity", 0.5)
        .attr("d", area)
        .style("visibility", "hidden");


    d3.select("#show_epigraph").on("change", function() {
        epigraph.style("visibility", this.checked ? "visible" : "hidden");
    });
}
