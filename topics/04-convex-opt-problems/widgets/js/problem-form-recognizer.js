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
        linear: () => `c₁ <input type="number" value="1" step="0.1"> + c₂ <input type="number" value="1" step="0.1">`,
        quadratic: () => `P₁₁ <input type="number" value="1" step="0.1">² + P₂₂ <input type="number" value="1" step="0.1">² + P₁₂ <input type="number" value="0" step="0.1">x₁x₂`,
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
                <option value="linear">Linear</option>
                <option value="quadratic">Quadratic</option>
            </select>
            <div class="constraint-params">${functionTemplates.linear()}</div>
            <button data-id="${id}">✖</button>
        `;
        constraintsContainer.appendChild(div);

        const typeSelect = div.querySelector('.constraint-type');
        const paramsDiv = div.querySelector('.constraint-params');

        typeSelect.onchange = () => {
             paramsDiv.innerHTML = functionTemplates[typeSelect.value]();
        };
        div.querySelector('button').onclick = () => {
             div.remove();
        };
    }

    function recognize() {
        const isObjectiveLinear = objectiveType === 'linear';
        const P_inputs = objectiveEditor.querySelectorAll("input");
        const isObjectiveQuadratic = objectiveType === 'quadratic' && (+P_inputs[0].value > 0 && +P_inputs[1].value > 0 && (4 * +P_inputs[0].value * +P_inputs[1].value - (+P_inputs[2].value)**2) >= 0);

        let constraintsAreLinear = true;
        constraintsContainer.querySelectorAll('.constraint-row').forEach(row => {
            if (row.querySelector('.constraint-type').value !== 'linear') {
                constraintsAreLinear = false;
            }
        });

        let form = "General Non-linear Program";
        if (isObjectiveLinear && constraintsAreLinear) form = "Linear Program (LP)";
        else if (isObjectiveQuadratic && constraintsAreLinear) form = "Quadratic Program (QP)";
        else if(isObjectiveQuadratic && !constraintsAreLinear) form = "Quadratically Constrained QP (QCQP)";

        resultOutput.innerHTML = `
            <p><strong>Problem Type:</strong> <span style="color:var(--color-accent);">${form}</span></p>
            <p>This is a simplified classification based on the forms you've selected.</p>
        `;
    }

    addBtn.onclick = addConstraint;
    recognizeBtn.onclick = recognize;

    renderObjective();
    addConstraint();
}
