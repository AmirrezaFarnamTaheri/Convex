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
            <div class="widget-controls">
                <p>Goal: Complete the matrix to be low-rank.</p>
                <button id="run-rank-min-btn">Solve using Nuclear Norm</button>
            </div>
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

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");

    const pythonCode = `
import cvxpy as cp
import numpy as np
import json

# Generate a low-rank matrix
np.random.seed(1)
A = np.random.randn(5, 3) @ np.random.randn(3, 5)

# Create a mask (some entries are unknown)
mask = np.ones((5, 5))
mask[0,0] = mask[1,2] = mask[2,3] = mask[3,1] = mask[4,4] = 0

def solve_completion():
    X = cp.Variable((5,5))
    objective = cp.Minimize(cp.norm(X, "nuc"))
    constraints = [cp.multiply(mask, X) == cp.multiply(mask, A)]
    prob = cp.Problem(objective, constraints)
    prob.solve()

    return json.dumps({
        "A": A.tolist(),
        "mask": mask.tolist(),
        "X": X.value.tolist(),
        "rank_A": np.linalg.matrix_rank(A),
        "rank_X": np.linalg.matrix_rank(X.value)
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const solve_completion = pyodide.globals.get('solve_completion');

    function drawMatrix(selector, data, mask=null) {
        const container = d3.select(selector);
        container.html("");
        const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([-d3.max(data.flat(), Math.abs), d3.max(data.flat(), Math.abs)]);

        const table = container.append("table");
        const tbody = table.append("tbody");
        data.forEach((row, i) => {
            const tr = tbody.append("tr");
            row.forEach((val, j) => {
                const td = tr.append("td").style("background-color", colorScale(val));
                if(mask && mask[i][j] === 0) {
                    td.text("?").style("color", "white").style("background-color", "black");
                } else {
                    td.text(val.toFixed(2));
                }
            });
        });
    }

    async function run() {
        runBtn.disabled = true;
        const result = await solve_completion().then(r => JSON.parse(r));

        drawMatrix("#original-matrix", result.A);
        drawMatrix("#masked-matrix", result.A, result.mask);
        drawMatrix("#completed-matrix", result.X);

        outputDiv.innerHTML = `Original Rank: ${result.rank_A}<br>Completed Rank: ${result.rank_X.toFixed(0)}`;
        runBtn.disabled = false;
    }

    runBtn.addEventListener("click", run);
    run();
}
