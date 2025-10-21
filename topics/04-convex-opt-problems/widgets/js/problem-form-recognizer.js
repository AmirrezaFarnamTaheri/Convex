/**
 * Widget: Problem Form Recognizer
 *
 * Description: Classifies a user-defined optimization problem based on its
 *              objective function and constraints.
 * Version: 2.0.0
 */

export function initProblemRecognizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="problem-recognizer-widget">
            <div class="widget-controls">
                <h4>Objective: Minimize f₀(x₁, x₂)</h4>
                <div id="objective-editor"></div>
                <h4>Constraints: fᵢ(x₁, x₂) ≤ 0</h4>
                <div id="constraints-container"></div>
                <button id="add-constraint-btn">+ Add Constraint</button>
            </div>
            <button id="recognize-btn">Recognize Problem</button>
            <div id="result-output" class="widget-output" style="margin-top: 15px;"></div>
        </div>
    `;

    const objectiveEditor = container.querySelector("#objective-editor");
    const constraintsContainer = container.querySelector("#constraints-container");
    const addBtn = container.querySelector("#add-constraint-btn");
    const recognizeBtn = container.querySelector("#recognize-btn");
    const resultOutput = container.querySelector("#result-output");

    let constraints = [];
    let objectiveType = 'linear';

    const functionTemplates = {
        linear: () => `c₁<input type="number" value="1" step="0.1">x₁ + c₂<input type="number" value="1" step="0.1">x₂`,
        quadratic: () => `½(xᵀ<input class="matrix" value="1"> <input class="matrix" value="0"> <br> <input class="matrix" value="0"> <input class="matrix" value="1">x) + qᵀx`,
        socp: () => `||<input class="matrix" value="1">x - <input class="matrix" value="0">||₂ ≤ <input value="1">ᵀx + <input value="0">`,
        sdp: () => `x₁A₁ + ... + xₙAₙ ≼ B`
    };

    function renderObjective() {
        objectiveEditor.innerHTML = `
            <select id="obj-type-select">
                <option value="linear">Linear</option>
                <option value="quadratic">Quadratic</option>
            </select>
            <div id="obj-params">${functionTemplates[objectiveType]()}</div>
        `;
        objectiveEditor.querySelector("#obj-type-select").value = objectiveType;
        objectiveEditor.querySelector("#obj-type-select").onchange = (e) => {
            objectiveType = e.target.value;
            renderObjective();
        };
    }

    function addConstraint() {
        const id = constraints.length;
        const div = document.createElement("div");
        div.className = 'constraint-row';
        div.innerHTML = `
            <select data-id="${id}" class="constraint-type">
                <option value="linear">Linear (Ax ≤ b)</option>
                <option value="quadratic">Quadratic (xᵀQx + rᵀx + s ≤ 0)</option>
                <option value="socp">Second-Order Cone (||Fx+g||₂ ≤ hᵀx+k)</option>
                <option value="sdp">Semidefinite (x₁A₁ + ... + xₙAₙ ≼ B)</option>
            </select>
            <div class="constraint-params">${functionTemplates.linear()}</div>
            <button data-id="${id}" class="remove-btn">✖</button>
        `;
        constraintsContainer.appendChild(div);

        const typeSelect = div.querySelector('.constraint-type');
        const paramsDiv = div.querySelector('.constraint-params');

        typeSelect.onchange = () => {
            const selectedType = typeSelect.value;
            paramsDiv.innerHTML = functionTemplates[selectedType] ? functionTemplates[selectedType]() : '';
        };
        div.querySelector('.remove-btn').onclick = () => div.remove();
    }

    function recognize() {
        const isObjectiveLinear = objectiveType === 'linear';
        const constraintTypes = Array.from(constraintsContainer.querySelectorAll('.constraint-type')).map(s => s.value);

        const hasLinear = constraintTypes.includes('linear');
        const hasQuadratic = constraintTypes.includes('quadratic');
        const hasSOCP = constraintTypes.includes('socp');
        const hasSDP = constraintTypes.includes('sdp');

        let form = "General Non-linear Program";
        let description = "The combination of objective and constraints does not fit a standard convex problem form.";

        if (isObjectiveLinear && !hasQuadratic && !hasSOCP && !hasSDP) {
            form = "Linear Program (LP)";
            description = "Objective and all constraints are linear functions.";
        } else if (objectiveType === 'quadratic' && !hasSOCP && !hasSDP) {
            if (!hasQuadratic) {
                form = "Quadratic Program (QP)";
                description = "Quadratic objective with only linear constraints.";
            } else {
                form = "Quadratically Constrained QP (QCQP)";
                description = "Quadratic objective with at least one quadratic constraint.";
            }
        } else if ((isObjectiveLinear || objectiveType === 'quadratic' || hasSOCP) && !hasSDP) {
            form = "Second-Order Cone Program (SOCP)";
            description = "LP, QP, or QCQP constraints, plus one or more second-order cone constraints.";
        } else if (hasSDP) {
            form = "Semidefinite Program (SDP)";
            description = "The problem includes one or more semidefinite constraints, making it an SDP.";
        }

        resultOutput.innerHTML = `
            <p><strong>Problem Type:</strong> <span style="color:var(--color-accent);">${form}</span></p>
            <p>${description}</p>
        `;
    }

    addBtn.onclick = addConstraint;
    recognizeBtn.onclick = recognize;

    renderObjective();
    addConstraint();
}
