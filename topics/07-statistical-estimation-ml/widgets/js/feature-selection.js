/**
 * Widget: Feature Selection via Sparsity
 *
 * Description: Shows how L1 regularization in logistic regression can drive feature coefficients to zero, effectively performing feature selection.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initFeatureSelection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="feature-selection-widget">
            <div class="widget-controls">
                <label>Regularization Strength (C⁻¹): smaller C = stronger regularization</label>
                <input type="range" id="fs-c-slider" min="-2" max="2" step="0.1" value="0">
                <span id="c-val-display">C = 1.0</span>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="sparsity-output"></div>
        </div>
    `;

    const cSlider = container.querySelector("#fs-c-slider");
    const cValDisplay = container.querySelector("#c-val-display");
    const plotContainer = container.querySelector("#plot-container");
    const sparsityOutput = container.querySelector("#sparsity-output");

    const margin = {top: 30, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("Logistic Regression Coefficients (L1 Penalty)");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
import json

X, y = make_classification(n_samples=100, n_features=20, n_informative=5, n_redundant=5, n_classes=2, random_state=42)
# Scale features for better performance
X = (X - X.mean(axis=0)) / X.std(axis=0)

def get_coefs(C):
    clf = LogisticRegression(penalty='l1', C=C, solver='liblinear', random_state=42, tol=1e-6, max_iter=500)
    clf.fit(X, y)
    return clf.coef_.flatten().tolist()
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_coefs = pyodide.globals.get('get_coefs');

    const n_features = 20;
    const x = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.3);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(i => `w${i}`));
    const yAxis = svg.append("g");
    const bars = svg.append("g");
    svg.append("line").attr("x1", 0).attr("x2", width).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 0.5);

    async function update(C) {
        cValDisplay.textContent = `C = ${C.toExponential(1)}`;

        const coefs = await get_coefs(C).then(c => c.toJs());
        const non_zero = coefs.filter(c => Math.abs(c) > 1e-5).length;
        sparsityOutput.textContent = `${non_zero} of ${n_features} features are non-zero.`;

        y.domain(d3.extent([-0.1, 0.1, ...coefs])).nice();
        yAxis.transition().duration(200).call(d3.axisLeft(y));

        bars.selectAll("rect").data(coefs).join(
            enter => enter.append("rect")
                        .attr("x", (d,i) => x(i))
                        .attr("y", y(0))
                        .attr("width", x.bandwidth())
                        .attr("height", 0),
            update => update,
            exit => exit.remove()
        )
        .transition().duration(200)
        .attr("y", d => y(Math.max(0, d)))
        .attr("height", d => Math.abs(y(d) - y(0)))
        .attr("fill", d => d > 0 ? "var(--color-accent)" : "var(--color-primary)");
    }

    cSlider.addEventListener("input", () => {
        const C = Math.pow(10, +cSlider.value);
        update(C);
    });

    update(1.0);
}
