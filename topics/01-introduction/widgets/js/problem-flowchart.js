import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

export async function initProblemFlowchart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    const graphDefinition = `
graph TD
    A[Start] --> B{Is it a convex problem?};
    B -- Yes --> C{Is it an LP?};
    B -- No --> D[Non-convex];
    C -- Yes --> E[LP Solver];
    C -- No --> F{Is it a QP?};
    F -- Yes --> G[QP Solver];
    F -- No --> H[General Convex Solver];
    `;

    const { svg } = await mermaid.render('graphDiv', graphDefinition);
    container.innerHTML = svg;
}