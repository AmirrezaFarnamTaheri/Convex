import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initConicSolver(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const solveBtn = container.querySelector("#solve-socp-btn");
    const resultsContainer = container.querySelector("#socp-results");

    const pythonCode = `
import cvxpy as cp
import numpy as np

def solve_socp():
    # Create a random SOCP instance
    m, n = 5, 3
    np.random.seed(1)
    A = np.random.randn(m, n)
    b = np.random.randn(m)

    # Define variables
    x = cp.Variable(n)
    y = cp.Variable()

    # SOCP constraint: ||Ax - b|| <= y
    soc_constraint = cp.SOC(y, A @ x - b)

    # Objective: Minimize y
    objective = cp.Minimize(y)

    # Problem
    problem = cp.Problem(objective, [soc_constraint])
    problem.solve()

    return {
        "status": problem.status,
        "optimal_y": y.value,
        "optimal_x": x.value.tolist()
    }
`;
    await pyodide.runPythonAsync(pythonCode);

    solveBtn.addEventListener("click", async () => {
        resultsContainer.innerHTML = "Solving...";
        const resultPy = await pyodide.runPythonAsync('solve_socp()');
        const result = resultPy.toJs();

        resultsContainer.innerHTML = \`
            <h4>Results</h4>
            <p>Solver Status: \${result.status}</p>
            <p>Optimal value for y: \${result.optimal_y.toFixed(4)}</p>
            <p>Optimal value for x: [\${result.optimal_x.map(v => v.toFixed(3)).join(', ')}]</p>
        \`;
    });
}

initConicSolver(".widget-container");
