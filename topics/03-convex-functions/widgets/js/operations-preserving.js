/**
 * Widget: Operations Preserving Convexity
 *
 * Description: An interactive tool to show how operations like composition with an affine map preserve convexity.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOperationsPreserving(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <label for="a_slider">Scale (a):</label>
        <input id="a_slider" type="range" min="0.1" max="5" value="1" step="0.1">
        <span id="a_val">1.0</span>
        <br>
        <label for="b_slider">Translate (b):</label>
        <input id="b_slider" type="range" min="-5" max="5" value="0" step="0.1">
        <span id="b_val">0.0</span>
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

    const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Original convex function f(x) = x^2
    const f = x_val => x_val*x_val;

    function update() {
        svg.selectAll(".transformed-function").remove();

        const a = +document.getElementById("a_slider").value;
        const b = +document.getElementById("b_slider").value;
        document.getElementById("a_val").textContent = a.toFixed(1);
        document.getElementById("b_val").textContent = b.toFixed(1);

        // Transformed function: f(ax + b) = (ax + b)^2
        const transformed_f = x_val => f(a * x_val + b);

        const line = d3.line()
            .x(d => x(d))
            .y(d => y(transformed_f(d)));

        svg.append("path")
            .datum(d3.range(-10, 10.1, 0.1))
            .attr("class", "transformed-function")
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 2)
            .attr("d", line);
    }


    d3.select("#a_slider").on("input", update);
    d3.select("#b_slider").on("input", update);

    // Initial draw
    update();
}
