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
                <div class="control-group">
                    <label>Problem Sizes (n):</label>
                    <input type="text" id="ipm-sizes-input" value="10, 20, 50, 100, 200">
                </div>
                <button id="run-ipm-benchmark-btn">Run Benchmark</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Runs a primal-dual IPM on random LPs of different sizes to show how iteration count scales.</p>
            <div id="ipm-results-table"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-ipm-benchmark-btn");
    const plotContainer = container.querySelector("#plot-container");
    const sizesInput = container.querySelector("#ipm-sizes-input");
    const resultsTable = container.querySelector("#ipm-results-table");

    const margin = {top: 30, right: 20, bottom: 50, left: 50};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("IPM Iterations vs. Problem Size");
    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");

    xAxis.append("text").text("Problem Size (n, log scale)").attr("x", width / 2).attr("y", 35).attr("fill", "currentColor").style("font-size", "14px");
    yAxis.append("text").text("Iterations").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", -35)
        .attr("text-anchor", "middle").attr("fill", "currentColor").style("font-size", "14px");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def solve_lp_ipm(c, A, b):
    # Primal-Dual IPM for LP: min c'x s.t. Ax=b, x>=0
    m, n = A.shape

    # Heuristic starting point
    x = np.ones(n)
    l = np.ones(n)
    nu = np.zeros(m)

    n_iter = 0
    for i in range(25): # Max iterations
        n_iter = i + 1
        rc = A.T @ nu + l - c
        rb = A @ x - b
        rl = x * l

        # Stop if duality gap and residuals are small
        mu = np.dot(x, l) / n
        if np.linalg.norm(rc) < 1e-6 and np.linalg.norm(rb) < 1e-6 and mu < 1e-6:
            break

        # Affine scaling step
        inv_l_x = l / x
        KKT_A = A.T @ np.linalg.inv(A @ np.diag(1/inv_l_x) @ A.T)

        d_nu_aff = KKT_A @ (rb - A @ np.diag(1/inv_l_x) @ (rc - rl/x))
        d_x_aff = -np.diag(1/inv_l_x) @ (A.T @ d_nu_aff + rc - rl/x)
        d_l_aff = (-rl - l * d_x_aff) / x

        # Centering and step size
        alpha_aff = min(1.0, *[-l[j]/d_l_aff[j] for j in range(n) if d_l_aff[j] < 0],
                           *[-x[j]/d_x_aff[j] for j in range(n) if d_x_aff[j] < 0])

        mu_aff = (x + alpha_aff*d_x_aff).T @ (l + alpha_aff*d_l_aff) / n
        sigma = (mu_aff / mu)**3

        # Corrector step
        rl_corr = rl + d_x_aff * d_l_aff - sigma * mu

        d_nu = KKT_A @ (rb - A @ np.diag(1/inv_l_x) @ (rc - rl_corr/x))
        d_x = -np.diag(1/inv_l_x) @ (A.T @ d_nu + rc - rl_corr/x)
        d_l = (-rl_corr - l * d_x) / x

        alpha = min(1.0, 0.99*min(*[-l[j]/d_l[j] for j in range(n) if d_l[j] < 0],
                                  *[-x[j]/d_x[j] for j in range(n) if d_x[j] < 0]))

        x += alpha * d_x
        l += alpha * d_l
        nu += alpha * d_nu

    return n_iter

def run_ipm_benchmark(sizes):
    results = []
    for n in sizes:
        m = n // 2
        np.random.seed(n)
        # Create a feasible LP
        x0 = np.random.rand(n)
        A = np.random.randn(m, n)
        b = A @ x0
        c = np.random.rand(n)

        iterations = solve_lp_ipm(c, A, b)
        results.append({"size": n, "iterations": iterations})

    return json.dumps(results)
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_ipm_benchmark = pyodide.globals.get('run_ipm_benchmark');

    async function run() {
        runBtn.disabled = true;
        runBtn.textContent = "Running...";
        svg.selectAll(".plot-content").remove();
        resultsTable.innerHTML = "";

        const sizes_str = sizesInput.value.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s) && s > 0);
        if (sizes_str.length === 0) {
             runBtn.disabled = false; runBtn.textContent = "Run Benchmark"; return;
        }

        const data = await run_ipm_benchmark(sizes_str).then(r => JSON.parse(r));

        const x = d3.scaleLog().domain([d3.min(data, d=>d.size)*0.9, d3.max(data, d => d.size) * 1.1]).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(data, d => d.iterations) * 1.2 || 10]).range([height, 0]);

        xAxis.call(d3.axisBottom(x).ticks(5, ".0s"));
        yAxis.call(d3.axisLeft(y));

        svg.append("path").attr("class", "plot-content")
            .datum(data).attr("d", d3.line().x(d => x(d.size)).y(d => y(d.iterations)))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        svg.append("g").attr("class", "plot-content")
            .selectAll("circle").data(data).join("circle")
            .attr("cx", d => x(d.size)).attr("cy", d => y(d.iterations)).attr("r", 5)
            .attr("fill", "var(--color-primary)");

        // Update table
        let tableHTML = "<table><thead><tr><th>Size (n)</th><th>Iterations</th></tr></thead><tbody>";
        data.forEach(d => {
            tableHTML += `<tr><td>${d.size}</td><td>${d.iterations}</td></tr>`;
        });
        tableHTML += "</tbody></table>";
        resultsTable.innerHTML = tableHTML;

        runBtn.disabled = false;
        runBtn.textContent = "Run Benchmark";
    }

    runBtn.addEventListener("click", run);
}
