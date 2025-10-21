/**
 * Widget: Sparse Recovery (Lasso) Demo
 *
 * Description: Demonstrates how L1 regularization (Lasso) can recover a sparse signal
 *              from a limited number of measurements (compressed sensing).
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js"; // For matrix mult

export async function initSparseRecoveryDemo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Pyodide...</div>`;
    const pyodide = await getPyodide();

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="sparse-recovery-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <div><label># Samples (m): <span id="samples-val">25</span></label><input type="range" id="samples-slider" min="10" max="50" value="25"></div>
                    <div><label>Sparsity (k): <span id="sparsity-val">5</span></label><input type="range" id="sparsity-slider" min="1" max="15" value="5"></div>
                    <div><label>Lasso Alpha (λ): <span id="alpha-val">0.1</span></label><input type="range" id="alpha-slider" min="0.01" max="0.5" step="0.01" value="0.1"></div>
                </div>
                <button id="run-recovery-btn" style="margin-top: 15px;">Generate New Signal & Recover</button>
            </div>
        </div>
    `;

    const sliders = {
        samples: container.querySelector("#samples-slider"),
        sparsity: container.querySelector("#sparsity-slider"),
        alpha: container.querySelector("#alpha-slider"),
    };
    const vals = {
        samples: container.querySelector("#samples-val"),
        sparsity: container.querySelector("#sparsity-val"),
        alpha: container.querySelector("#alpha-val"),
    };
    const runBtn = container.querySelector("#run-recovery-btn");
    const plotContainer = container.querySelector("#plot-container");

    let svg, x, y;
    const n_features = 50;

    // --- Pyodide (for matrix ops) & JS Lasso ---
    const pythonSetup = `
        import numpy as np
        def generate_problem(n_features, n_samples, sparsity):
            original_signal = np.zeros(n_features)
            non_zero_indices = np.random.choice(n_features, sparsity, replace=False)
            original_signal[non_zero_indices] = np.random.uniform(-1, 1, sparsity)
            A = np.random.randn(n_samples, n_features)
            y = A @ original_signal + 0.05 * np.random.randn(n_samples)
            return {"A": A, "y": y, "original": original_signal}
    `;
    await pyodide.runPythonAsync(pythonSetup);
    const generate_problem = pyodide.globals.get('generate_problem');

    function soft_threshold(rho, lam) { return Math.sign(rho) * Math.max(0, Math.abs(rho) - lam); }

    function lasso_ista(A, y, alpha, max_iter = 100) {
        const [m, n] = [A.length, A[0].length];
        let x = new Array(n).fill(0);
        const L = Math.max(...A.map(row => Math.sqrt(row.reduce((a, b) => a + b*b, 0)))); // Lipschitz constant

        for (let i = 0; i < max_iter; i++) {
            const Ax = A.map(row => row.reduce((acc, val, j) => acc + val * x[j], 0));
            const grad = A[0].map((_, j) => A.reduce((acc, row, k) => acc + (Ax[k] - y[k]) * row[j], 0));

            const x_new = x.map((val, j) => soft_threshold(val - (1/L) * grad[j], alpha / L));

            if (d3.max(x_new.map((v, j) => Math.abs(v - x[j]))) < 1e-4) break;
            x = x_new;
        }
        return x;
    }

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 30, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.2);
        y = d3.scaleLinear().domain([-1.2, 1.2]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickValues([]));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("g").attr("class", "recovered-signal");
        svg.append("g").attr("class", "original-signal");
    }

    async function runDemo() {
        runBtn.disabled = true;
        const n_samples = +sliders.samples.value;
        const sparsity = +sliders.sparsity.value;
        const alpha = +sliders.alpha.value;

        const problem = await generate_problem(n_features, n_samples, sparsity).then(r => r.toJs({create_proxies: false}));

        const recovered_signal = lasso_ista(problem.A, problem.y, alpha);

        const barWidth = x.bandwidth();
        const drawBars = (selection, data, color) => {
            selection.selectAll("rect").data(data).join("rect")
                .attr("x", (d, i) => x(i)).attr("y", d => y(Math.max(0, d)))
                .attr("width", barWidth).attr("height", d => Math.abs(y(d) - y(0)))
                .attr("fill", color);
        };

        drawBars(svg.select(".original-signal"), problem.original, "var(--color-primary)");
        drawBars(svg.select(".recovered-signal"), recovered_signal, "var(--color-success)");

        runBtn.disabled = false;
    }

    Object.entries(sliders).forEach(([key, slider]) => {
        slider.oninput = () => vals[key].textContent = (+slider.value).toFixed(key === 'alpha' ? 2 : 0);
    });
    runBtn.onclick = runDemo;

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    runDemo();
}
