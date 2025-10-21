/**
 * Widget: Rank Nullspace Visualizer
 *
 * Description: Visualizes the four fundamental subspaces of a user-defined 2x3 or 3x2 matrix.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.mjs";


export async function initRankNullspace(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div id="matrix_input">
            [ <input type="number" value="1">, <input type="number" value="2">, <input type="number" value="3"> ]<br>
            [ <input type="number" value="4">, <input type="number" value="5">, <input type="number" value="6"> ]
        </div>
        <button id="calculate">Calculate</button>
        <div id="output"></div>
    `;

    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    // scipy is not available in pyodide, so we will use numpy for SVD

    d3.select("#calculate").on("click", async () => {
        const inputs = d3.selectAll("#matrix_input input").nodes();
        const matrix_data = inputs.map(i => +i.value);

        pyodide.globals.set("matrix_A", matrix_data);
        const result = await pyodide.runPythonAsync(`
            import numpy as np

            A = np.array(matrix_A).reshape(2, 3)

            U, s, VT = np.linalg.svd(A)

            rank = np.sum(s > 1e-10)

            col_space = U[:, :rank]

            null_sp = VT[rank:, :].T

            row_space = VT[:rank, :].T

            left_null_space = U[:, rank:]


            def format_basis(name, basis):
                res = f"<h3>{name} (Basis):</h3><pre>"
                if basis.shape[1] == 0:
                    res += "Trivial (zero vector only)"
                else:
                    res += np.array2string(basis, precision=2)
                res += "</pre>"
                return res

            f"""
            {format_basis("Column Space", col_space)}
            {format_basis("Null Space", null_sp)}
            {format_basis("Row Space", row_space)}
            {format_basis("Left Null Space", left_null_space)}
            """
        `);

        document.getElementById("output").innerHTML = result;
    });
}
