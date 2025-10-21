/**
 * Widget: Problem Reformulation Tool
 *
 * Description: An interactive tool that demonstrates how various problems can be
 *              reformulated into standard convex optimization forms like LP, QP, etc.
 * Version: 2.0.0
 */
import "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.mjs";
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.mjs";

export function initReformulationTool(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const problems = {
        "abs_value": {
            title: "Absolute Value Minimization",
            original: "Minimize: |x₁| + 2|x₂|<br>Subject to: x₁ + x₂ ≥ 2",
            steps: [
                "Introduce new variables t₁, t₂ to represent |x₁| and |x₂|.",
                "The objective becomes: <strong>Minimize t₁ + 2t₂</strong>.",
                "The absolute value inequalities |x₁| ≤ t₁ and |x₂| ≤ t₂ must be added.",
                "These are equivalent to the linear inequalities: x₁ ≤ t₁, -x₁ ≤ t₁, and x₂ ≤ t₂, -x₂ ≤ t₂.",
                "The original constraint is converted to the standard form: -x₁ - x₂ ≤ -2."
            ],
            final_form: "Linear Program (LP)"
        },
        "max_value": {
            title: "Max Function Minimization",
            original: "Minimize: max(x₁, 2x₂ + 1, x₁ - x₂)",
            steps: [
                "Introduce a new variable 't' to represent the maximum value.",
                "The objective becomes: <strong>Minimize t</strong>.",
                "Add constraints ensuring 't' is greater than or equal to each term inside the max().",
                "This yields the linear constraints: x₁ ≤ t, 2x₂ + 1 ≤ t, and x₁ - x₂ ≤ t.",
                "These can be rewritten in standard form: x₁ - t ≤ 0, 2x₂ - t ≤ -1, and x₁ - x₂ - t ≤ 0."
            ],
             final_form: "Linear Program (LP)"
        },
        "sum_of_squares": {
            title: "Sum of Squares Minimization",
            original: "Minimize: (Ax-b)ᵀ(Ax-b)",
            steps: [
                "This is an unconstrained least-squares problem.",
                "Expand the objective function: xᵀAᵀAx - 2bᵀAx + bᵀb.",
                "This is a quadratic function of x.",
                "Let P = 2AᵀA, q = -2Aᵀb. The problem is equivalent to minimizing ½xᵀPx + qᵀx.",
                "This is the standard form of a convex Quadratic Program (QP)."
            ],
            final_form: "Quadratic Program (QP)"
        }
    };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="reformulation-tool-widget">
            <h4>Problem Reformulation Explorer</h4>
            <div class="widget-controls">
                <label for="problem-select">Choose a problem to reformulate:</label>
                <select id="problem-select"></select>
            </div>
            <div id="original-problem" class="widget-output" style="margin-top: 15px;"></div>
            <div id="steps-container" style="margin-top: 15px;"></div>
            <div id="final-form" class="widget-output" style="margin-top: 15px; font-weight: bold;"></div>
        </div>
    `;

    const problemSelect = container.querySelector("#problem-select");
    const originalProblemDiv = container.querySelector("#original-problem");
    const stepsContainer = container.querySelector("#steps-container");
    const finalFormDiv = container.querySelector("#final-form");

    Object.keys(problems).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = problems[key].title;
        problemSelect.appendChild(option);
    });

    let currentStep = 0;
    let selectedProblem = problems[problemSelect.value];

    function render() {
        originalProblemDiv.innerHTML = `<h5>Original Problem</h5><p>${selectedProblem.original}</p>`;
        renderMathInElement(originalProblemDiv);

        let stepsHTML = '<h5>Reformulation Steps:</h5><ol>';
        for (let i = 0; i < currentStep; i++) {
            stepsHTML += `<li>${selectedProblem.steps[i]}</li>`;
        }
        stepsHTML += '</ol>';
        stepsContainer.innerHTML = stepsHTML;
        renderMathInElement(stepsContainer);

        if (currentStep < selectedProblem.steps.length) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next Step';
            nextButton.onclick = () => { currentStep++; render(); };
            stepsContainer.appendChild(nextButton);
        } else {
            finalFormDiv.innerHTML = `Final Form: <span style="color: var(--color-success);">${selectedProblem.final_form}</span>`;
        }
    }

    function reset() {
        currentStep = 0;
        selectedProblem = problems[problemSelect.value];
        finalFormDiv.innerHTML = '';
        render();
    }

    problemSelect.addEventListener("change", reset);

    reset();
}
