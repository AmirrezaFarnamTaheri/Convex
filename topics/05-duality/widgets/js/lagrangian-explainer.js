/**
 * Widget: Lagrangian Explainer
 *
 * Description: Visualizes the Lagrangian function for a simple constrained problem and show how the dual function is a pointwise infimum.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initLagrangianExplainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const controls = document.createElement("div");
    controls.innerHTML = `
        <label for="nu_slider">Lagrange multiplier (ν):</label>
        <input id="nu_slider" type="range" min="-10" max="10" value="0" step="0.1">
        <span id="nu_val">0</span>
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

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(10));

    const y = d3.scaleLinear().domain([-10, 25]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Draw the original function
    const f = x_val => x_val*x_val;
    const f_line = d3.line()
        .x(d => x(d))
        .y(d => y(f(d)));

    svg.append("path")
        .datum(d3.range(-5, 5.1, 0.1))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", f_line);

    // Draw the constraint line (x=1)
    svg.append("line")
        .attr("x1", x(1))
        .attr("y1", y(-10))
        .attr("x2", x(1))
        .attr("y2", y(25))
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5");


    function update(nu) {
        document.getElementById("nu_val").textContent = nu.toFixed(1);
        svg.selectAll(".lagrangian").remove();
        svg.selectAll(".infimum").remove();

        // Lagrangian function L(x, ν) = x² + ν(x - 1)
        const lagrangian = x_val => x_val*x_val + nu * (x_val - 1);
        const lagrangian_line = d3.line()
            .x(d => x(d))
            .y(d => y(lagrangian(d)));

        svg.append("path")
            .datum(d3.range(-5, 5.1, 0.1))
            .attr("class", "lagrangian")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", lagrangian_line);

        // The minimum of the Lagrangian occurs at x = -ν/2
        const min_x = -nu / 2;
        const min_y = lagrangian(min_x);

        svg.append("circle")
            .attr("class", "infimum")
            .attr("cx", x(min_x))
            .attr("cy", y(min_y))
            .attr("r", 5)
            .attr("fill", "green");
    }


    d3.select("#nu_slider").on("input", function() {
        update(+this.value);
    });

    // Initial draw
    update(0);
}
