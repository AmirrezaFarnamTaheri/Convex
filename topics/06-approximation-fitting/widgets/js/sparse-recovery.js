/**
 * Widget: Sparse Recovery Demo
 *
 * Description: Demonstrates how L1 regularization (Lasso) can recover a sparse signal from a limited number of measurements.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSparseRecoveryDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="sparse-recovery-widget">
            <div class="widget-controls">
                <div><label># Features: 50</label></div>
                <div><label># Samples (m): <span id="samples-val">25</span></label><input type="range" id="samples-slider" min="10" max="50" value="25"></div>
                <div><label>Sparsity (k): <span id="sparsity-val">5</span></label><input type="range" id="sparsity-slider" min="1" max="15" value="5"></div>
                <div><label>Lasso Alpha (λ): <span id="alpha-val">0.1</span></label><input type="range" id="alpha-slider" min="0.01" max="0.5" step="0.01" value="0.1"></div>
                <button id="run-recovery-btn">Generate New Signal & Recover</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const samplesSlider = container.querySelector("#samples-slider");
    const samplesVal = container.querySelector("#samples-val");
    const sparsitySlider = container.querySelector("#sparsity-slider");
    const sparsityVal = container.querySelector("#sparsity-val");
    const alphaSlider = container.querySelector("#alpha-slider");
    const alphaVal = container.querySelector("#alpha-val");
    const runBtn = container.querySelector("#run-recovery-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 30, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const n_features = 50;
    const x = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([-1.2, 1.2]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickValues([]));
    svg.append("g").call(d3.axisLeft(y));

    const originalSignalGroup = svg.append("g");
    const recoveredSignalGroup = svg.append("g");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
import numpy as np
from sklearn.linear_model import Lasso
import json

def recover_signal(n_features, n_samples, sparsity, alpha):
    original_signal = np.zeros(n_features)
    non_zero_indices = np.random.choice(n_features, sparsity, replace=False)
    original_signal[non_zero_indices] = np.random.uniform(-1, 1, sparsity)

    A = np.random.randn(n_samples, n_features)
    y = A @ original_signal + 0.05 * np.random.randn(n_samples) # Add a little noise

    lasso = Lasso(alpha=alpha, max_iter=2000)
    lasso.fit(A, y)
    recovered_signal = lasso.coef_

    return json.dumps({"original": original_signal.tolist(), "recovered": recovered_signal.tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const recover_signal = pyodide.globals.get('recover_signal');

    async function runDemo() {
        runBtn.disabled = true;
        const n_samples = +samplesSlider.value;
        const sparsity = +sparsitySlider.value;
        const alpha = +alphaSlider.value;

        samplesVal.textContent = n_samples;
        sparsityVal.textContent = sparsity;
        alphaVal.textContent = alpha.toFixed(2);

        const signals = await recover_signal(n_features, n_samples, sparsity, alpha).then(r => JSON.parse(r));

        const barWidth = x.bandwidth();

        originalSignalGroup.selectAll("rect").data(signals.original).join("rect")
            .attr("x", (d, i) => x(i)).attr("y", d => y(Math.max(0, d)))
            .attr("width", barWidth).attr("height", d => Math.abs(y(d) - y(0)))
            .attr("fill", "var(--color-primary)");

        recoveredSignalGroup.selectAll("rect").data(signals.recovered).join("rect")
            .attr("x", (d, i) => x(i)).attr("y", d => y(Math.max(0, d)))
            .attr("width", barWidth).attr("height", d => Math.abs(y(d) - y(0)))
            .attr("fill", "var(--color-success)").style("opacity", 0.7);

        runBtn.disabled = false;
    }

    samplesSlider.addEventListener("input", () => samplesVal.textContent = samplesSlider.value);
    sparsitySlider.addEventListener("input", () => sparsityVal.textContent = sparsitySlider.value);
    alphaSlider.addEventListener("input", () => alphaVal.textContent = (+alphaSlider.value).toFixed(2));
    runBtn.addEventListener("click", runDemo);

    runDemo();
}
