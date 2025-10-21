/**
 * Widget: Regularization Path Explorer
 *
 * Description: Shows how the coefficients of a linear model change as the regularization parameter (lambda) is varied for Lasso and Ridge.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initRegularizationPath(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="reg-path-widget">
            <div class="widget-controls">
                <label>Regularization Type:</label>
                <select id="reg-type-select">
                    <option value="L1">L1 (Lasso)</option>
                    <option value="L2">L2 (Ridge)</option>
                </select>
                <button id="regen-data-btn">Regenerate Data</button>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="coef-output"></div>
        </div>
    `;

    const regTypeSelect = container.querySelector("#reg-type-select");
    const regenBtn = container.querySelector("#regen-data-btn");
    const plotContainer = container.querySelector("#plot-container");
    const coefOutput = container.querySelector("#coef-output");

    const margin = {top: 30, right: 30, bottom: 50, left: 60};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").style("font-size", "16px").text("Regularization Path");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");

    async function generateAndPlot() {
        coefOutput.textContent = "Generating data and computing paths...";
        svg.selectAll("*").remove(); // Clear previous plot

        const data = await pyodide.runPythonAsync(`
            import numpy as np
            from sklearn.datasets import make_regression
            from sklearn.linear_model import lasso_path, enet_path
            import json

            X, y, true_coef = make_regression(n_samples=50, n_features=8, n_informative=4, noise=20, coef=True, random_state=np.random.randint(1000))

            alphas = np.logspace(-2, 2, 100)

            _, coefs_lasso, _ = lasso_path(X, y, alphas=alphas)
            _, coefs_ridge, _ = enet_path(X, y, l1_ratio=0, alphas=alphas*0.1) # Scale alphas for Ridge for better viz

            json.dumps({
                "alphas": alphas.tolist(),
                "lasso_coefs": coefs_lasso.T.tolist(),
                "ridge_coefs": coefs_ridge.T.tolist(),
                "true_coef": true_coef.tolist()
            })
        `).then(r => JSON.parse(r));

        const n_features = data.true_coef.length;
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const all_coefs = data.lasso_coefs.flat().concat(data.ridge_coefs.flat());

        const x = d3.scaleLog().domain(d3.extent(data.alphas).reverse()).range([0, width]);
        const y = d3.scaleLinear().domain(d3.extent(all_coefs)).nice().range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5, ".1e")).append("text").text("Alpha (λ)").attr("x", width).attr("dy", "-0.5em").attr("text-anchor", "end").attr("fill", "currentColor");
        svg.append("g").call(d3.axisLeft(y)).append("text").text("Coefficient Value").attr("transform", "rotate(-90)").attr("dy", "1.5em").attr("text-anchor", "end").attr("fill", "currentColor");

        const line = d3.line().x((d,i) => x(data.alphas[i])).y(d => y(d));

        function drawPaths() {
            const regType = regTypeSelect.value;
            const coefs = (regType === 'L1') ? data.lasso_coefs : data.ridge_coefs;

            svg.selectAll(".coef-path").remove();
            for (let i = 0; i < n_features; i++) {
                svg.append("path").attr("class", "coef-path")
                    .datum(coefs.map(c => c[i]))
                    .attr("d", line)
                    .attr("fill", "none").attr("stroke", color(i)).attr("stroke-width", 2);
            }
        }

        // Interactivity
        const focus = svg.append("g").style("display", "none");
        focus.append("line").attr("class", "focus-line").attr("y1", 0).attr("y2", height).attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "3,3");
        const focusCircles = [];
        for (let i = 0; i < n_features; i++) {
            focusCircles.push(focus.append("circle").attr("r", 4).attr("fill", color(i)));
        }

        svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => focus.style("display", "none"))
            .on("mousemove", (event) => {
                const mx = d3.pointer(event)[0];
                const alpha = x.invert(mx);
                const bisect = d3.bisector(d => d).left;
                const idx = bisect(data.alphas, alpha, 1);

                const regType = regTypeSelect.value;
                const coefs = (regType === 'L1') ? data.lasso_coefs : data.ridge_coefs;

                focus.select(".focus-line").attr("transform", `translate(${x(data.alphas[idx])},0)`);
                let output = `<strong>α = ${data.alphas[idx].toFixed(2)}</strong><ul>`;
                for (let i = 0; i < n_features; i++) {
                    const val = coefs[idx][i];
                    focusCircles[i].attr("cx", x(data.alphas[idx])).attr("cy", y(val));
                    output += `<li style="color:${color(i)};">Coef ${i}: ${val.toFixed(2)}</li>`;
                }
                output += "</ul>"
                coefOutput.innerHTML = output;
            });

        regTypeSelect.onchange = drawPaths;
        drawPaths();
    }

    regenBtn.addEventListener("click", generateAndPlot);
    generateAndPlot();
}
