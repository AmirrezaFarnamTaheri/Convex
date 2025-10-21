/**
 * Widget: Large-Scale IPM Behavior
 *
 * Description: A plot showing the number of iterations for an IPM as problem size grows,
 *              illustrating the near-constant iteration count.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLargeScaleIpm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="large-scale-ipm-widget">
            <div class="widget-controls">
                <button id="run-ipm-benchmark-btn">Run Benchmark</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Runs a series of LPs of increasing size to show how IPM iteration count scales.</p>
        </div>
    `;

    const runBtn = container.querySelector("#run-ipm-benchmark-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 30, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("IPM Iterations vs. Problem Size");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scipy");
    const pythonCode = `
import numpy as np
from scipy.optimize import linprog
import json

def run_ipm_benchmark(sizes):
    results = []
    for n in sizes:
        m = n // 2
        np.random.seed(n)
        c = -np.random.rand(n)
        A_ub = np.random.rand(m, n)
        b_ub = np.ones(m)

        res = linprog(c, A_ub=A_ub, b_ub=b_ub, method='highs-ipm')

        if res.success:
            results.append({"size": n, "iterations": res.nit})

    return json.dumps(results)
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_ipm_benchmark = pyodide.globals.get('run_ipm_benchmark');

    async function run() {
        runBtn.disabled = true;
        svg.selectAll(".plot-content").remove();
        svg.append("text").attr("class", "loading-text").attr("x", width/2).attr("y", height/2).attr("text-anchor", "middle").text("Running... (this may take a moment)");

        const sizes = [10, 20, 50, 100, 200, 400];
        const data = await run_ipm_benchmark(sizes).then(r => JSON.parse(r));

        svg.selectAll(".loading-text").remove();

        const x = d3.scaleLog().domain(d3.extent(data, d => d.size)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(data, d => d.iterations) * 1.2]).range([height, 0]);

        svg.append("g").attr("class", "plot-content").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5, ".0s")).append("text").text("Problem Size (n)").attr("x", width).attr("dy","-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
        svg.append("g").attr("class", "plot-content").call(d3.axisLeft(y)).append("text").text("Iterations").attr("transform", "rotate(-90)").attr("dy", "1.5em").attr("text-anchor", "end").attr("fill", "currentColor");

        svg.append("path").attr("class", "plot-content")
            .datum(data).attr("d", d3.line().x(d=>x(d.size)).y(d=>y(d.iterations)))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        svg.append("g").attr("class", "plot-content")
            .selectAll("circle").data(data).join("circle")
            .attr("cx", d=>x(d.size)).attr("cy", d=>y(d.iterations)).attr("r", 4)
            .attr("fill", "var(--color-primary)");

        runBtn.disabled = false;
    }

    runBtn.addEventListener("click", run);
    run();
}
