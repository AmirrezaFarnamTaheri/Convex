/**
 * Widget: Problem Flowchart
 *
 * Description: An interactive decision tree to help users classify optimization problems.
 * Version: 3.1.0 (Styled)
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
            hint: "Check 2nd derivative (Hessian ⪰ 0) or Jensen's Inequality."
        },
        non_convex: {
            text: "Non-Convex Problem",
            type: 'terminal',
            desc: "Local optima may trap you. No polynomial-time guarantees. Use global heuristics or relaxations.",
            color: "#ef4444",
            icon: "⚠️"
        },
        check_constraints: {
            text: "Are inequality constraints convex & equality constraints affine?",
            type: 'decision',
            yes: 'convex_family',
            no: 'non_convex',
            hint: "g(x) ≤ 0 where g is convex; Ax = b."
        },
        convex_family: {
            text: "Problem is Convex! Now classify it:",
            type: 'decision',
            options: [
                { text: "Linear Objective & Constraints", target: "lp" },
                { text: "Quadratic Objective, Linear Constraints", target: "qp" },
                { text: "Constraints involve Norms (||x||)", target: "check_cone" },
                { text: "Constraints involve Matrix Eigenvalues", target: "sdp" }
            ]
        },
        lp: {
            text: "Linear Program (LP)",
            type: 'terminal',
            desc: "The workhorse of industry. Solvable in milliseconds for millions of variables.",
            color: "var(--success)",
            icon: "⚡"
        },
        qp: {
            text: "Quadratic Program (QP)",
            type: 'terminal',
            desc: "Standard for portfolio optimization and SVMs. Very efficient.",
            color: "var(--primary-500)",
            icon: "📈"
        },
        check_cone: {
            text: "What kind of norm?",
            type: 'decision',
            options: [
                { text: "Euclidean Norm (||x||₂)", target: "socp" },
                { text: "L1 or L-Infinity Norm", target: "lp_reform" }
            ]
        },
        lp_reform: {
            text: "LP (via Reformulation)",
            type: 'terminal',
            desc: "L1/L∞ minimization can be rewritten as an LP using slack variables.",
            color: "var(--success)",
            icon: "⚡"
        },
        socp: {
            text: "Second-Order Cone Program (SOCP)",
            type: 'terminal',
            desc: "Handles robust optimization and geometric constraints.",
            color: "var(--accent-500)",
            icon: "📐"
        },
        sdp: {
            text: "Semidefinite Program (SDP)",
            type: 'terminal',
            desc: "The most general class. Used in control theory and relaxations of combinatorial problems.",
            color: "var(--warning)",
            icon: "🏗️"
        }
    };

    let history = ['start'];

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls" style="justify-content: space-between; padding:var(--space-2) var(--space-4);">
                <button id="back-btn" class="btn btn-sm btn-ghost" disabled>← Back</button>
                <button id="reset-btn" class="btn btn-sm btn-ghost">Reset</button>
            </div>

            <div id="flowchart-display" style="height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; background: var(--bg-surface-1); transition: opacity 0.2s;">
                <!-- Dynamic Content -->
            </div>

            <div id="flowchart-actions" style="padding: 20px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; background: var(--bg-surface-2); border-top: 1px solid var(--border-subtle);">
                <!-- Dynamic Buttons -->
            </div>

            <div id="flowchart-info" class="widget-output" style="min-height: 80px; display: flex; align-items: center; justify-content: center; text-align: center;"></div>
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

        display.style.opacity = 0;

        setTimeout(() => {
            if (node.type === 'terminal') {
                display.innerHTML = `
                    <div style="font-size: 4rem; margin-bottom: 16px; filter: drop-shadow(0 0 20px ${node.color});">${node.icon}</div>
                    <h3 style="color: ${node.color || 'white'}; font-size: 1.8rem; margin: 0;">${node.text}</h3>
                `;
            } else {
                display.innerHTML = `
                    <h3 style="font-size: 1.4rem; margin-bottom: 12px; line-height: 1.4; color:var(--text-heading);">${node.text}</h3>
                    ${node.hint ? `<div style="color: var(--text-secondary); font-size: 0.9rem; background: var(--bg-surface-2); padding: 8px 12px; border-radius: 6px; display: inline-block;">💡 ${node.hint}</div>` : ''}
                `;
            }
            display.style.opacity = 1;
        }, 200);

        actions.innerHTML = '';
        info.innerHTML = node.desc ? `<p>${node.desc}</p>` : '';

        if (node.type === 'decision') {
            if (node.options) {
                node.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = "btn btn-secondary";
                    btn.style.flex = "1 1 40%";
                    btn.textContent = opt.text;
                    btn.onclick = () => { history.push(opt.target); render(); };
                    actions.appendChild(btn);
                });
            } else {
                const yesBtn = document.createElement('button');
                yesBtn.className = "btn btn-primary";
                yesBtn.style.minWidth = "100px";
                yesBtn.textContent = 'Yes';
                yesBtn.onclick = () => { history.push(node.yes); render(); };
                actions.appendChild(yesBtn);

                const noBtn = document.createElement('button');
                noBtn.className = "btn btn-secondary";
                noBtn.style.minWidth = "100px";
                noBtn.textContent = 'No';
                noBtn.onclick = () => { history.push(node.no); render(); };
                actions.appendChild(noBtn);
            }
        } else if (node.type === 'terminal') {
             const restartBtn = document.createElement('button');
             restartBtn.className = "btn btn-primary";
             restartBtn.textContent = "Classify Another Problem";
             restartBtn.onclick = () => { history = ['start']; render(); };
             actions.appendChild(restartBtn);
        }

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
