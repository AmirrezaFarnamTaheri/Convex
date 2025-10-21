/**
 * Widget: Problem Flowchart
 *
 * Description: An interactive flowchart that guides users through classifying an optimization problem.
 */
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.js";

export function initProblemFlowchart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="problem-flowchart-widget">
            <p class="widget-instructions">Click through the flowchart to classify your optimization problem.</p>
            <div id="mermaid-container"></div>
            <button id="reset-flowchart">Reset</button>
        </div>
    `;

    const mermaidContainer = container.querySelector("#mermaid-container");
    const resetButton = container.querySelector("#reset-flowchart");

    const graphDefinition = `
    graph TD
        A(Start) --> B{Is it a convex problem?};
        B -- No --> B_no[General Non-linear Program];
        B -- Yes --> C{Objective & Constraints Type};

        C --> D{Linear Objective?};
        D -- Yes --> E{Linear Constraints?};
        E -- Yes --> LP[Linear Program (LP)];
        E -- No --> F{Conic Constraints?};
        F -- Yes --> SOCP[Second-Order Cone Program (SOCP)];
        F -- No --> GP[Geometric Program];

        C --> G{Quadratic Objective?};
        G -- Yes --> H{Linear Constraints?};
        H -- Yes --> QP[Quadratic Program (QP)];
        H -- No --> I{Quadratic Constraints?};
        I -- Yes --> QCQP[Quadratically Constrained QP];
        I -- No --> SDP_Q[Semidefinite Program (SDP)];

        C --> J{General Convex Objective?};
        J -- Yes --> K[General Convex Program];

        %% Styling
        classDef final fill:#2ecc71,stroke:#27ae60,color:#fff;
        class LP,SOCP,GP,QP,QCQP,SDP_Q,K,B_no final;
    `;

    const renderFlowchart = () => {
        mermaidContainer.innerHTML = `<div class="mermaid">${graphDefinition}</div>`;
        mermaid.run({
            nodes: document.querySelectorAll('.mermaid'),
        });
    };

    resetButton.addEventListener("click", renderFlowchart);

    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            background: '#1a1d24',
            primaryColor: '#2e323b',
            primaryTextColor: '#e0e0e0',
            lineColor: '#a0a0a0',
            textColor: '#e0e0e0',
        }
    });

    renderFlowchart();
}
