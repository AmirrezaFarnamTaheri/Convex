
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
                expr_str, const_str = line.split('<=')
                constraints.append(sympy.sympify(expr_str.strip()) - sympy.sympify(const_str.strip()))
            elif '>=' in line:
                expr_str, const_str = line.split('>=')
                constraints.append(sympy.sympify(const_str.strip()) - sympy.sympify(expr_str.strip()))

        if not constraints:
            return "No constraints provided."

        gradients = [sympy.Matrix([c.diff(x), c.diff(y)]) for c in constraints]

        # We need a point to check LICQ. For this demo, we'll try to solve
        # for a point on the boundary of the first two constraints.
        point = {}
        if len(constraints) >= 2:
            try:
                solution = sympy.solve(constraints[:2], (x, y))
                if solution:
                    point = {x: solution[x], y: solution[y]}
            except Exception:
                pass # Can't solve for a point

        if not point:
            return "Could not find a point to check. Please provide a simpler set of constraints for this demo."

        active_gradients = []
        for i, c in enumerate(constraints):
            if abs(c.subs(point).evalf()) < 1e-6:
                active_gradients.append(gradients[i])

        if not active_gradients:
            return "No active constraints at the solution point. LICQ is satisfied."

        matrix = sympy.Matrix.hstack(*active_gradients)
        if matrix.rank() == len(active_gradients):
            return f"LICQ is satisfied at {point}."
        else:
            return f"LICQ is NOT satisfied at {point}."

    except Exception as e:
        return f"Error: {e}"

check_licq(constraints_str)
`;
        const result = await pyodide.runPythonAsync(licq_check_code);
        resultDiv.innerText = result;
    });
}

initConstraintQualification('constraint-qualification-container');
