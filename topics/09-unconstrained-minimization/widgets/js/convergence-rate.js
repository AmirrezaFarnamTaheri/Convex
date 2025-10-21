/**
 * Widget: Convergence Rate Comparison
 *
 * Description: Plots the convergence rates of different first-order methods.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConvergenceRate(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convergence-rate-widget">
            <div class="widget-controls" id="cr-controls"></div>
            <div id="plot-container"></div>
        </div>
    `;

    const controlsContainer = container.querySelector("#cr-controls");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 30, right: 20, bottom: 40, left: 60};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("Convergence Rates of First-Order Methods");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_convergence_paths():
    # Simulate f(x) - p* for a strongly convex function
    # GD: linear convergence
    gd_path = [10 * (0.9**i) for i in range(50)]
    # Momentum
    momentum_path = [10 * (0.7**i) for i in range(50)]
    # Nesterov
    nesterov_path = [10 * (0.5**i) for i in range(50)]

    return json.dumps({
        "Gradient Descent": gd_path,
        "Momentum": momentum_path,
        "Nesterov": nesterov_path
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const paths = await pyodide.globals.get('get_convergence_paths')().then(r => JSON.parse(r));

    const n_iter = paths["Gradient Descent"].length;
    const all_vals = Object.values(paths).flat();

    const x = d3.scaleLinear().domain([0, n_iter-1]).range([0, width]);
    const y = d3.scaleLog().domain([d3.min(all_vals), d3.max(all_vals)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).append("text").text("Iteration").attr("x", width).attr("dy", "-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
    svg.append("g").call(d3.axisLeft(y).ticks(5, ".1e")).append("text").text("f(x) - p* (log scale)").attr("transform", "rotate(-90)").attr("dy", "1.5em").attr("text-anchor", "end").attr("fill", "currentColor");

    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const line = d3.line().x((d,i) => x(i)).y(d => y(d));

    const methodPaths = {};
    for (const methodName in paths) {
        methodPaths[methodName] = svg.append("path")
            .datum(paths[methodName])
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", colors(methodName))
            .attr("stroke-width", 2.5);

        const checkbox = document.createElement("label");
        checkbox.innerHTML = `<input type="checkbox" checked value="${methodName}"> <span style="color:${colors(methodName)}">${methodName}</span>`;
        checkbox.querySelector('input').addEventListener('change', (e) => {
            methodPaths[methodName].style("display", e.target.checked ? "block" : "none");
        });
        controlsContainer.appendChild(checkbox);
    }
}
