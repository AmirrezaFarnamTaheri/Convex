/**
 * Widget: Sparse Recovery Demo
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initSparseRecoveryDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");

    container.innerHTML = '';

    let n_features = 50;
    let n_samples = 20;
    let alpha = 0.1;

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center;";
    const runButton = document.createElement("button");
    runButton.textContent = "Run Sparse Recovery";
    runButton.onclick = runDemo;
    const alphaSlider = document.createElement("input");
    alphaSlider.type = "range";
    alphaSlider.min = 0.01;
    alphaSlider.max = 1;
    alphaSlider.step = 0.01;
    alphaSlider.value = alpha;
    alphaSlider.oninput = () => { alpha = parseFloat(alphaSlider.value); };

    controls.append(runButton, "Alpha:", alphaSlider);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([-1.1, 1.1]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${y(0)})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const originalSignal = svg.append("g");
    const recoveredSignal = svg.append("g");

    async function runDemo() {
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("n_features", n_features);
        await pyodide.globals.set("n_samples", n_samples);
        await pyodide.globals.set("alpha", alpha);
        const code = `
import numpy as np
from sklearn.linear_model import Lasso

np.random.seed(0)
original_signal = np.zeros(n_features)
non_zero_indices = np.random.choice(n_features, 5, replace=False)
original_signal[non_zero_indices] = np.random.uniform(-1, 1, 5)

A = np.random.randn(n_samples, n_features)
y = A @ original_signal

lasso = Lasso(alpha=alpha)
lasso.fit(A, y)
recovered_signal = lasso.coef_

{"original": original_signal.tolist(), "recovered": recovered_signal.tolist()}
        `;

        const signals = await pyodide.runPythonAsync(code).then(s => s.toJs());

        originalSignal.selectAll("rect")
            .data(signals.original)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(Math.max(0, d)))
            .attr("width", x.bandwidth())
            .attr("height", d => Math.abs(y(d) - y(0)))
            .attr("fill", "blue");

        recoveredSignal.selectAll("rect")
            .data(signals.recovered)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(Math.max(0, d)))
            .attr("width", x.bandwidth())
            .attr("height", d => Math.abs(y(d) - y(0)))
            .attr("fill", "red")
            .style("opacity", 0.7);
    }
}
