/**
 * Widget: Problem Form Recognizer
 *
 * Description: Users can input a simple optimization problem using structured fields,
 *              and the tool will attempt to classify it.
 */

import { getPyodide } from "../../../../static/js/pyodide-manager.js";

const pyodidePromise = getPyodide();

export async function initProblemRecognizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div style="padding: 10px; display: flex; flex-direction: column; gap: 15px;">
            <h4>Objective: Minimize</h4>
            <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
                <input type="number" id="c_x2" value="0" style="width: 40px;"> x² +
                <input type="number" id="c_y2" value="0" style="width: 40px;"> y² +
                <input type="number" id="c_xy" value="0" style="width: 40px;"> xy +
                <input type="number" id="c_x" value="1" style="width: 40px;"> x +
                <input type="number" id="c_y" value="1" style="width: 40px;"> y
            </div>
            <h4>Constraints</h4>
            <div id="constraints-container">
                <div class="constraint" style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                    <input type="number" value="1" style="width: 40px;"> x +
                    <input type="number" value="1" style="width: 40px;"> y &le;
                    <input type="number" value="1" style="width: 40px;">
                </div>
            </div>
            <button id="add-constraint">Add Constraint</button>
            <button id="recognize-button">Recognize Problem Form</button>
            <div id="result-div"></div>
        </div>
    `;

    document.getElementById('add-constraint').addEventListener('click', () => {
        const container = document.getElementById('constraints-container');
        const newConstraint = document.createElement('div');
        newConstraint.className = 'constraint';
        newConstraint.style.cssText = "display: flex; align-items: center; gap: 5px; margin-bottom: 5px;";
        newConstraint.innerHTML = `
            <input type="number" value="0" style="width: 40px;"> x +
            <input type="number" value="0" style="width: 40px;"> y &le;
            <input type="number" value="0" style="width: 40px;">
        `;
        container.appendChild(newConstraint);
    });

    document.getElementById('recognize-button').addEventListener('click', recognizeProblem);

    async function recognizeProblem() {
        const resultDiv = document.getElementById('result-div');
        resultDiv.textContent = "Recognizing...";

        const P_x2 = parseFloat(document.getElementById('c_x2').value) * 2; // CVXPY P is 1/2 x'Px
        const P_y2 = parseFloat(document.getElementById('c_y2').value) * 2;
        const P_xy = parseFloat(document.getElementById('c_xy').value);
        const c_x = parseFloat(document.getElementById('c_x').value);
        const c_y = parseFloat(document.getElementById('c_y').value);

        const P = [[P_x2, P_xy], [P_xy, P_y2]];
        const c = [c_x, c_y];

        const constraints = [];
        document.querySelectorAll('.constraint').forEach(c_div => {
            const inputs = c_div.getElementsByTagName('input');
            constraints.push([
                parseFloat(inputs[0].value),
                parseFloat(inputs[1].value),
                parseFloat(inputs[2].value)
            ]);
        });

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("P_val", P);
        await pyodide.globals.set("c_val", c);
        await pyodide.globals.set("constraints_val", constraints);

        const code = `
import cvxpy as cp
import numpy as np

try:
    x = cp.Variable(2)
    P = np.array(P_val)
    c = np.array(c_val)

    objective = cp.Minimize(0.5 * cp.quad_form(x, P) + c.T @ x)

    constraints_list = []
    for const in constraints_val:
        constraints_list.append(const[0]*x[0] + const[1]*x[1] <= const[2])

    prob = cp.Problem(objective, constraints_list)

    if prob.is_qp():
        # is_qp() is true for LPs as well, so check for LP first.
        # An LP has a zero quadratic term.
        if np.allclose(P, np.zeros((2,2))):
             result = "Linear Program (LP)"
        else:
             result = "Quadratic Program (QP)"
    else:
        # Fallback for other potential problem types cvxpy can identify
        result = "Non-QP / Unknown Form"

except Exception as e:
    result = f"Error: {e}"

result
        `;

        const result = await pyodide.runPythonAsync(code);
        resultDiv.textContent = `Problem Form: ${result}`;
    }
}
