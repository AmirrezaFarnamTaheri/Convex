/**
 * Widget: Classification Tree
 *
 * Description: An interactive decision tree to help classify optimization problems.
 */
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/+esm";

export function initClassificationTree(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const graphDefinition = `
    graph TD
        A{Problem} --> B{Is the objective function linear?};
        B -- Yes --> C{Are the constraints linear?};
        B -- No --> D{Is the objective function quadratic?};
        C -- Yes --> E[Linear Program (LP)];
        C -- No --> F[Non-linear Program];
        D -- Yes --> G{Are the constraints linear?};
        D -- No --> H[Non-linear Program];
        G -- Yes --> I[Quadratic Program (QP)];
        G -- No --> J[Quadratically Constrained Quadratic Program (QCQP)];
    `;

    const mermaidContainer = document.createElement("div");
    mermaidContainer.classList.add("mermaid");
    mermaidContainer.textContent = graphDefinition;
    container.appendChild(mermaidContainer);

    mermaid.initialize({ startOnLoad: true });
}
