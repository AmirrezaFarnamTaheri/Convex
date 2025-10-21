/**
 * Widget: Problem Form Recognizer
 *
 * Description: Users can input a simple optimization problem using structured fields,
 *              and the tool will attempt to classify it.
 */
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initProblemRecognizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="problem-recognizer-widget">
            <div class="widget-controls">
                <h4>Objective: Minimize</h4>
                <div class="objective-form">
                    <input type="number" id="c_x2" value="1"> x² +
                    <input type="number" id="c_y2" value="1"> y² +
                    <input type="number" id="c_xy" value="0"> xy +
                    <input type="number" id="c_x" value="0"> x +
                    <input type="number" id="c_y" value="0"> y
                </div>
                <h4>Constraints (Ax ≤ b)</h4>
                <div id="constraints-container"></div>
                <button id="add-constraint-btn">+ Add Constraint</button>
            </div>
            <button id="recognize-btn">Recognize Problem</button>
            <div id="result-output" class="widget-output"></div>
        </div>
    `;

    const constraintsContainer = container.querySelector("#constraints-container");
    const addBtn = container.querySelector("#add-constraint-btn");
    const recognizeBtn = container.querySelector("#recognize-btn");
    const resultOutput = container.querySelector("#result-output");

    let constraint_count = 0;

    function addConstraint(a1=0, a2=0, b=0) {
        const id = ++constraint_count;
        const div = document.createElement("div");
        div.className = 'constraint-row';
        div.id = `constraint-${id}`;
        div.innerHTML = `
            <input type="number" value="${a1}"> x +
            <input type="number" value="${a2}"> y ≤
            <input type="number" value="${b}">
            <button data-id="${id}">Remove</button>
        `;
        div.querySelector('button').addEventListener('click', () => {
            document.getElementById(`constraint-${id}`).remove();
        });
        constraintsContainer.appendChild(div);
    }

    const pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");

    async function recognize() {
        resultOutput.innerHTML = "Analyzing...";

        const P_x2 = +container.querySelector('#c_x2').value * 2;
        const P_y2 = +container.querySelector('#c_y2').value * 2;
        const P_xy = +container.querySelector('#c_xy').value;
        const c = [+container.querySelector('#c_x').value, +container.querySelector('#c_y').value];
        const P = [[P_x2, P_xy], [P_xy, P_y2]];

        const constraints = Array.from(constraintsContainer.querySelectorAll('.constraint-row')).map(row => {
            const inputs = row.querySelectorAll('input');
            return [ +inputs[0].value, +inputs[1].value, +inputs[2].value ];
        });

        await pyodide.globals.set("P_val", P);
        await pyodide.globals.set("c_val", c);
        await pyodide.globals.set("constraints_val", constraints);

        const result_json = await pyodide.runPythonAsync(`
            import cvxpy as cp
            import numpy as np
            import json

            x = cp.Variable(2)
            P = np.array(P_val)
            c = np.array(c_val)
            objective = cp.Minimize(0.5 * cp.quad_form(x, P) + c.T @ x)

            constraints = [ A_i[0]*x[0] + A_i[1]*x[1] <= b_i for *A_i, b_i in constraints_val ]

            prob = cp.Problem(objective, constraints)

            is_lp = np.allclose(P, 0)
            is_qp = prob.is_qp() and not is_lp
            is_convex = prob.is_convex()

            form = "Unknown"
            if is_lp: form = "Linear Program (LP)"
            elif is_qp: form = "Quadratic Program (QP)"
            elif is_convex: form = "General Convex Program"
            else: form = "Non-Convex Program"

            json.dumps({
                "form": form,
                "is_convex": is_convex,
                "solver": prob.solver if prob.solver else "N/A"
            })
        `);
        const result = JSON.parse(result_json);

        resultOutput.innerHTML = `
            <p><strong>Problem Type:</strong> ${result.form}</p>
            <p><strong>Is Convex:</strong>
                <span style="color:${result.is_convex ? 'var(--color-success)' : 'var(--color-danger)'};">
                ${result.is_convex}
                </span>
            </p>
        `;
    }

    addBtn.addEventListener('click', () => addConstraint());
    recognizeBtn.addEventListener('click', recognize);

    // Add some initial constraints
    addConstraint(1, 1, 1);
    addConstraint(1, 0, 0);
    addConstraint(0, 1, 0);
}
