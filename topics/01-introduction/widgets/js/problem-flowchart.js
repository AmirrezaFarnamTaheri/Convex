/**
 * Widget: Problem Flowchart
 *
 * Description: An interactive, custom-built flowchart to classify optimization problems.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initProblemFlowchart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const flowchartData = {
        start: {
            text: "Is the objective function convex?",
            type: 'decision',
            yes: 'check_constraints',
            no: 'non_convex',
            hint: "Check curvature (Hessian PSD) or Jensen's inequality."
        },
        non_convex: {
            text: "Non-Convex Problem",
            type: 'terminal',
            desc: "Generally hard. Heuristics or local search only.",
            color: "var(--color-error)"
        },
        check_constraints: {
            text: "Are inequality constraints convex & equality affine?",
            type: 'decision',
            yes: 'convex_family',
            no: 'non_convex',
            hint: "Feasible set must be convex."
        },
        convex_family: {
            text: "Problem is Convex. Determine family:",
            type: 'decision',
            options: [
                { text: "Linear Obj & Constraints", target: "lp" },
                { text: "Quadratic Obj, Linear Constr", target: "qp" },
                { text: "Norm / Cone Constraints", target: "check_cone" },
                { text: "Matrix PSD Constraints", target: "sdp" }
            ]
        },
        lp: {
            text: "Linear Program (LP)",
            type: 'terminal',
            desc: "Fastest. Solved via Simplex or Interior Point.",
            color: "var(--color-success)"
        },
        qp: {
            text: "Quadratic Program (QP)",
            type: 'terminal',
            desc: "Standard for SVMs, Portfolio Opt. Efficient.",
            color: "var(--color-primary)"
        },
        check_cone: {
            text: "Which type of cone constraint?",
            type: 'decision',
            options: [
                { text: "Euclidean (L2) Norm", target: "socp" },
                { text: "L1 / L-inf Norm", target: "lp_reform" }
            ]
        },
        lp_reform: {
            text: "LP (via Reformulation)",
            type: 'terminal',
            desc: "L1 and L-inf norms can be rewritten as linear constraints.",
            color: "var(--color-success)"
        },
        socp: {
            text: "Second-Order Cone Program (SOCP)",
            type: 'terminal',
            desc: "Robust optimization, antenna design.",
            color: "var(--color-accent)"
        },
        sdp: {
            text: "Semidefinite Program (SDP)",
            type: 'terminal',
            desc: "Most general. Relaxations, control theory.",
            color: "#fbbf24"
        }
    };

    let history = ['start'];

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="justify-content: space-between;">
                <button id="back-btn" class="widget-btn" disabled>← Back</button>
                <button id="reset-btn" class="widget-btn">Reset</button>
            </div>

            <div id="flowchart-display" style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; background: var(--color-surface-1);">
                <!-- Dynamic Content -->
            </div>

            <div id="flowchart-actions" style="padding: 20px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; background: var(--color-surface-2); border-top: 1px solid var(--color-border);">
                <!-- Dynamic Buttons -->
            </div>

            <div id="flowchart-info" class="widget-output" style="min-height: 60px; display: flex; align-items: center; justify-content: center;"></div>
        </div>
    `;

    const display = container.querySelector("#flowchart-display");
    const actions = container.querySelector("#flowchart-actions");
    const info = container.querySelector("#flowchart-info");
    const backBtn = container.querySelector("#back-btn");
    const resetBtn = container.querySelector("#reset-btn");

    function render() {
        const currentId = history[history.length - 1];
        const node = flowchartData[currentId];

        // Animate transition (simple fade)
        display.style.opacity = 0;
        setTimeout(() => {
            if (node.type === 'terminal') {
                display.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 16px;">🎯</div>
                    <h3 style="color: ${node.color || 'white'}; font-size: 1.5rem; margin: 0;">${node.text}</h3>
                `;
            } else {
                display.innerHTML = `
                    <h3 style="font-size: 1.2rem; margin-bottom: 10px;">${node.text}</h3>
                    ${node.hint ? `<p style="color: var(--color-text-muted); font-size: 0.9rem;">${node.hint}</p>` : ''}
                `;
            }
            display.style.opacity = 1;
        }, 150);
        display.style.transition = "opacity 0.3s ease";

        // Update controls
        actions.innerHTML = '';
        info.innerHTML = node.desc ? `<p>${node.desc}</p>` : '';

        if (node.type === 'decision') {
            if (node.options) {
                node.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = "widget-btn primary";
                    btn.textContent = opt.text;
                    btn.onclick = () => { history.push(opt.target); render(); };
                    actions.appendChild(btn);
                });
            } else {
                const yesBtn = document.createElement('button');
                yesBtn.className = "widget-btn primary";
                yesBtn.textContent = 'Yes';
                yesBtn.onclick = () => { history.push(node.yes); render(); };
                actions.appendChild(yesBtn);

                const noBtn = document.createElement('button');
                noBtn.className = "widget-btn";
                noBtn.textContent = 'No';
                noBtn.onclick = () => { history.push(node.no); render(); };
                actions.appendChild(noBtn);
            }
        } else if (node.type === 'terminal') {
             const restartBtn = document.createElement('button');
             restartBtn.className = "widget-btn primary";
             restartBtn.textContent = "Classify Another Problem";
             restartBtn.onclick = () => { history = ['start']; render(); };
             actions.appendChild(restartBtn);
        }

        // Update nav buttons
        backBtn.disabled = history.length === 1;
    }

    backBtn.onclick = () => {
        if (history.length > 1) {
            history.pop();
            render();
        }
    };

    resetBtn.onclick = () => {
        history = ['start'];
        render();
    };

    render();
}
