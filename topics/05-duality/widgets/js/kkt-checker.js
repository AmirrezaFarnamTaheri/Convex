/**
 * Widget: KKT Checker
 *
 * Description: Allows users to input a problem and a potential solution, and the widget checks which KKT conditions are satisfied.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.mjs";


export async function initKKTChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const controls = document.createElement("div");
    controls.innerHTML = `
        <p><b>Problem:</b> Minimize x² + y² subject to x + y >= 2</p>
        <p>Enter a candidate solution (x, y) and Lagrange multiplier (μ) to check the KKT conditions.</p>
        x: <input id="x_val" type="number" value="1">
        y: <input id="y_val" type="number" value="1">
        μ: <input id="mu_val" type="number" value="2">
        <br>
        <button id="check_kkt">Check KKT</button>
        <div id="output"></div>
    `;
    container.appendChild(controls);

    let pyodide = await loadPyodide();
    await pyodide.loadPackage(["sympy", "numpy"]);

    d3.select("#check_kkt").on("click", async () => {
        const x_val = +document.getElementById("x_val").value;
        const y_val = +document.getElementById("y_val").value;
        const mu_val = +document.getElementById("mu_val").value;

        pyodide.globals.set("x_val", x_val);
        pyodide.globals.set("y_val", y_val);
        pyodide.globals.set("mu_val", mu_val);

        const result = await pyodide.runPythonAsync(`
            from sympy import symbols, diff

            x, y, mu = symbols('x y mu')
            f = x**2 + y**2
            g = x + y - 2

            sol = {x: x_val, y: y_val, mu: mu_val}

            primal_feasibility = g.subs(sol) >= 0
            dual_feasibility = sol[mu] >= 0
            complementary_slackness = abs(sol[mu] * g.subs(sol)) < 1e-6

            L = f - mu * g
            grad_L_x = diff(L, x).subs(sol)
            grad_L_y = diff(L, y).subs(sol)
            stationarity = abs(grad_L_x) < 1e-6 and abs(grad_L_y) < 1e-6

            f"""
            <h3>KKT Conditions Check:</h3>
            <ul>
                <li>Primal Feasibility (x + y >= 2): <b>{primal_feasibility}</b></li>
                <li>Dual Feasibility (μ >= 0): <b>{dual_feasibility}</b></li>
                <li>Complementary Slackness (μ * (x + y - 2) = 0): <b>{complementary_slackness}</b></li>
                <li>Stationarity (∇L = 0): <b>{stationarity}</b></li>
            </ul>
            """
        `);

        document.getElementById("output").innerHTML = result;
    });
}
