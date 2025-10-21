/**
 * Widget: Problem Flowchart
 *
 * Description: An interactive, custom-built flowchart to classify optimization problems.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initProblemFlowchart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const flowchartData = {
        start: { text: "Is the problem convex?", type: 'decision', yes: 'convex', no: 'non-convex' },
        'non-convex': { text: "General Non-linear Program (NLP)", type: 'terminal', desc: "Hard to solve globally." },
        convex: { text: "Objective & Constraints Type?", type: 'decision', options: [
            { text: "Linear", target: "linear_obj" },
            { text: "Quadratic", target: "quad_obj" },
            { text: "General Convex", target: "general_convex" }
        ]},
        linear_obj: { text: "Linear Constraints?", type: 'decision', yes: 'lp', no: 'conic_constraints' },
        lp: { text: "Linear Program (LP)", type: 'terminal', desc: "Fast, reliable solvers exist." },
        conic_constraints: { text: "Conic Constraints?", type: 'decision', yes: 'socp', no: 'gp' },
        socp: { text: "Second-Order Cone Program (SOCP)", type: 'terminal', desc: "More general than LPs." },
        gp: { text: "Geometric Program (GP)", type: 'terminal', desc: "Can be transformed to convex." },
        quad_obj: { text: "Linear Constraints?", type: 'decision', yes: 'qp', no: 'quad_constraints' },
        qp: { text: "Quadratic Program (QP)", type: 'terminal', desc: "Minimizes a quadratic over a polyhedron." },
        quad_constraints: { text: "Quadratic Constraints?", type: 'decision', yes: 'qcqp', no: 'sdp_q' },
        qcqp: { text: "Quadratically Constrained QP (QCQP)", type: 'terminal', desc: "All constraints are quadratic." },
        sdp_q: { text: "Semidefinite Program (SDP)", type: 'terminal', desc: "Optimization over the cone of PSD matrices." },
        general_convex: { text: "General Convex Program", type: 'terminal', desc: "Solved with methods like interior-point." }
    };

    let history = ['start'];

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="problem-flowchart-widget">
            <div id="flowchart-display" style="padding: 20px; border: 1px solid var(--color-surface-1); border-radius: 8px; text-align: center;"></div>
            <div id="flowchart-controls" style="margin-top: 15px; text-align: center;"></div>
            <div id="flowchart-info" class="widget-output" style="margin-top: 15px;"></div>
        </div>
    `;

    const display = container.querySelector("#flowchart-display");
    const controls = container.querySelector("#flowchart-controls");
    const info = container.querySelector("#flowchart-info");

    function render() {
        const currentId = history[history.length - 1];
        const node = flowchartData[currentId];

        display.innerHTML = `<h3>${node.text}</h3>`;
        controls.innerHTML = '';
        info.innerHTML = node.desc ? `<p>${node.desc}</p>` : '';

        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.disabled = history.length === 1;
        backButton.onclick = () => { history.pop(); render(); };
        controls.appendChild(backButton);

        if (node.type === 'decision') {
            if (node.options) {
                node.options.forEach(opt => {
                    const button = document.createElement('button');
                    button.textContent = opt.text;
                    button.onclick = () => { history.push(opt.target); render(); };
                    controls.appendChild(button);
                });
            } else {
                const yesButton = document.createElement('button');
                yesButton.textContent = 'Yes';
                yesButton.onclick = () => { history.push(node.yes); render(); };
                controls.appendChild(yesButton);

                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.onclick = () => { history.push(node.no); render(); };
                controls.appendChild(noButton);
            }
        }
    }

    render();
}
