
async function initConstraintQualification(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const button = container.querySelector('#check-button');
    const resultDiv = container.querySelector('#qualification-result');
    const constraintsInput = container.querySelector('#constraints-input');

    resultDiv.innerText = "Pyodide loading...";
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("sympy");
    resultDiv.innerText = "Ready.";

    button.addEventListener('click', async () => {
        const constraints = constraintsInput.value;
        resultDiv.innerText = "Checking...";

        pyodide.globals.set("constraints_str", constraints);

        const licq_check_code = `
import sympy

def check_licq(constraints_str):
    try:
        x, y = sympy.symbols('x y')
        constraints = []
        for line in constraints_str.strip().split('\\n'):
            if '<=' in line:
                expr_str = line.split('<=')[0].strip()
                constraints.append(sympy.sympify(expr_str))
            elif '>=' in line:
                expr_str = line.split('>=')[0].strip()
                constraints.append(-sympy.sympify(expr_str))

        if not constraints:
            return "No constraints provided."

        gradients = [sympy.Matrix([c.diff(x), c.diff(y)]) for c in constraints]

        # This is a simplification. A full implementation would need to
        # evaluate the gradients at a specific point.
        # For now, we check for linear independence of the gradient vectors.
        if len(gradients) == 1:
            return "LICQ is satisfied."

        # Check for linear independence of the first two gradients as a demo
        if len(gradients) >= 2:
            matrix = gradients[0].row_join(gradients[1])
            if matrix.rank() == 2:
                 return "LICQ is satisfied (for the first two constraints)."
            else:
                 return "LICQ may not be satisfied."

        return "Checking for more than 2 constraints is not implemented in this demo."

    except Exception as e:
        return f"Error: {e}"

check_licq(constraints_str)
`;
        const result = await pyodide.runPythonAsync(licq_check_code);
        resultDiv.innerText = result;
    });
}

initConstraintQualification('constraint-qualification-container');
