/**
 * Widget: Problem Reformulation Tool
 *
 * Description: Shows how a problem can be reformulated to fit a standard form.
 *              This example focuses on converting an absolute value objective into an LP.
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initProblemReformulationTool(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="reformulation-tool-widget">
            <h4>Problem Reformulation Example</h4>
            <div class="problem-statement">
                <h5>Original Problem</h5>
                <p>Minimize: |x| + |y|</p>
                <p>Subject to: x + y ≥ 2</p>
            </div>
            <button id="reformulate-btn">Reformulate as LP</button>
            <div class="reformulated-problem" id="reformulated-output"></div>
        </div>
    `;

    const reformulateBtn = container.querySelector("#reformulate-btn");
    const outputDiv = container.querySelector("#reformulated-output");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("sympy");

    reformulateBtn.addEventListener("click", async () => {
        outputDiv.innerHTML = "Reformulating...";

        const result = await pyodide.runPythonAsync(`
            import sympy

            # Introduce slack variables t_x for |x| and t_y for |y|
            x, y, t_x, t_y = sympy.symbols('x y t_x t_y')

            # New objective is to minimize the sum of slack variables
            new_objective = "Minimize: t_x + t_y"

            # New constraints
            # |x| <= t_x  is equivalent to  x <= t_x  and -x <= t_x
            # |y| <= t_y  is equivalent to  y <= t_y  and -y <= t_y
            # And the original constraint
            constraints = [
                "x - t_x <= 0",
                "-x - t_x <= 0",
                "y - t_y <= 0",
                "-y - t_y <= 0",
                "-x - y <= -2"
            ]

            f"""
            <h5>Reformulated Linear Program (LP)</h5>
            <p>{new_objective}</p>
            <p><strong>Subject to:</strong></p>
            <ul>
                {''.join([f"<li>{c}</li>" for c in constraints])}
            </ul>
            """
        `);

        outputDiv.innerHTML = result;
    });
}
