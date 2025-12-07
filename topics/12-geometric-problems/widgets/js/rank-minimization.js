/**
 * Widget: Matrix Rank Minimization (Matrix Completion)
 *
 * Description: A toy example demonstrating rank minimization via the nuclear norm heuristic for matrix completion.
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initMatrixRankMinimization(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="rank-min-widget">
            <div class="widget-controls" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 1rem;">
                <div class="control-group">
                    <label for="dim-m">Rows (m):</label>
                    <input type="range" id="dim-m" min="5" max="15" value="8">
                    <span id="dim-m-val">8</span>
                </div>
                 <div class="control-group">
                    <label for="dim-n">Cols (n):</label>
                    <input type="range" id="dim-n" min="5" max="15" value="8">
                    <span id="dim-n-val">8</span>
                </div>
                <div class="control-group">
                    <label for="rank-r">True Rank (r):</label>
                    <input type="range" id="rank-r" min="1" max="5" value="2">
                    <span id="rank-r-val">2</span>
                </div>
                <div class="control-group">
                    <label for="known-frac">Known Entries:</label>
                    <input type="range" id="known-frac" min="0.3" max="0.9" step="0.05" value="0.7">
                    <span id="known-frac-val">70%</span>
                </div>
            </div>
            <button id="run-rank-min-btn" class="primary-btn">Generate & Solve</button>
            <div class="matrices-container">
                <div><h5>Original Low-Rank Matrix (A)</h5><div id="original-matrix"></div></div>
                <div><h5>Masked Matrix</h5><div id="masked-matrix"></div></div>
                <div><h5>Completed Matrix (X)</h5><div id="completed-matrix"></div></div>
            </div>
            <div class="widget-output" id="rank-output"></div>
        </div>
    `;

    const runBtn = container.querySelector("#run-rank-min-btn");
    const outputDiv = container.querySelector("#rank-output");
    const mSlider = container.querySelector("#dim-m");
    const nSlider = container.querySelector("#dim-n");
    const rSlider = container.querySelector("#rank-r");
    const fracSlider = container.querySelector("#known-frac");

    function updateSliderLabels() {
        container.querySelector("#dim-m-val").textContent = mSlider.value;
        container.querySelector("#dim-n-val").textContent = nSlider.value;
        // Ensure rank is not greater than dimensions
        rSlider.max = Math.min(mSlider.value, nSlider.value);
        if (parseInt(rSlider.value) > rSlider.max) rSlider.value = rSlider.max;
        container.querySelector("#rank-r-val").textContent = rSlider.value;
        container.querySelector("#known-frac-val").textContent = `${Math.round(fracSlider.value * 100)}%`;
    }
    [mSlider, nSlider, rSlider, fracSlider].forEach(s => s.addEventListener('input', updateSliderLabels));

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");

    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

def generate_and_solve(m, n, r, known_frac):
    m, n, r = int(m), int(n), int(r)

    # Generate a low-rank matrix
    A = np.random.randn(m, r) @ np.random.randn(r, n)

    # Create a mask
    mask = (np.random.rand(m, n) < known_frac).astype(float)

    # Solve completion problem
    X = cp.Variable((m, n))
    objective = cp.Minimize(cp.norm(X, "nuc"))
    constraints = [cp.multiply(mask, X) == cp.multiply(mask, A)]
    prob = cp.Problem(objective, constraints)
    prob.solve(solver=cp.SCS) # SCS is a good general-purpose solver

    if X.value is not None:
        error = np.linalg.norm(A - X.value, 'fro')
        return json.dumps({
            "A": A.tolist(),
            "mask": mask.tolist(),
            "X": X.value.tolist(),
            "rank_A": np.linalg.matrix_rank(A),
            "rank_X": np.linalg.matrix_rank(X.value),
            "error": error
        })
    return None
`;
    await pyodide.runPythonAsync(pythonCode);
    const generate_and_solve = pyodide.globals.get('generate_and_solve');

    function drawMatrix(selector, data, mask = null) {
        const container = d3.select(selector);
        container.html("");
        if (!data) return;
        const absMax = d3.max(data.flat().map(Math.abs));
        const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([absMax, -absMax]);

        const table = container.append("table").style("border-spacing", "1px").style("border-collapse", "separate");
        const tbody = table.append("tbody");
        data.forEach((row, i) => {
            const tr = tbody.append("tr");
            row.forEach((val, j) => {
                const td = tr.append("td")
                    .style("padding", "2px 4px")
                    .style("background-color", colorScale(val));
                if (mask && mask[i][j] === 0) {
                    td.text("?").style("color", "white").style("background-color", "#333");
                } else {
                    td.text(val.toFixed(2));
                }
            });
        });
    }

    async function run() {
        runBtn.disabled = true;
        outputDiv.innerHTML = "Generating problem and solving...";
        const result_json = await generate_and_solve(mSlider.value, nSlider.value, rSlider.value, fracSlider.value);

        if (result_json) {
            const result = JSON.parse(result_json);
            drawMatrix("#original-matrix", result.A);
            drawMatrix("#masked-matrix", result.A, result.mask);
            drawMatrix("#completed-matrix", result.X);

            outputDiv.innerHTML = `
                Original Rank: ${result.rank_A}<br>
                Completed Rank: ${Math.round(result.rank_X)}<br>
                Reconstruction Error (||A-X||<sub>F</sub>): ${result.error.toFixed(4)}
            `;
        } else {
            outputDiv.innerHTML = "Failed to solve the problem. Try different parameters.";
        }
        runBtn.disabled = false;
    }

    runBtn.addEventListener("click", run);
    updateSliderLabels();
    run();
}
