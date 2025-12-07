/**
 * Widget: Problem Form Recognizer
 *
 * Description: Classifies optimization problems into standard convex forms
 *              (LP, QP, SOCP, SDP) based on objective and constraints
 * Version: 3.0.0 - Enhanced with modern framework
 */
import { createModernWidget, createTabs, createButton, createBadge, createSelect } from '/static/js/modern-components.js';

export function initProblemRecognizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Problem Form Recognizer');
    const tabs = createTabs(vizContainer, ['Interactive', 'Examples', 'Theory']);

    // --- TAB 1: INTERACTIVE CLASSIFIER ---
    tabs[0].innerHTML = `
        <div style="padding: 20px;">
            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>Build Your Problem</h4>

                <div style="margin: 20px 0;">
                    <label style="display: block; font-weight: bold; margin-bottom: 10px;">Objective Function Type</label>
                    <div id="objective-select-container"></div>
                </div>

                <div style="margin: 20px 0;">
                    <label style="display: block; font-weight: bold; margin-bottom: 10px;">Constraints</label>
                    <div id="constraints-list" style="margin-bottom: 15px;"></div>
                    <div style="display: flex; gap: 10px;">
                        <button id="add-linear-btn" class="modern-button secondary">+ Linear</button>
                        <button id="add-quad-btn" class="modern-button secondary">+ Quadratic</button>
                        <button id="add-socp-btn" class="modern-button secondary">+ SOCP</button>
                        <button id="add-sdp-btn" class="modern-button secondary">+ SDP</button>
                    </div>
                </div>
            </div>

            <button id="classify-btn" class="modern-button primary" style="width: 100%; padding: 15px; font-size: 16px;">
                🔍 Classify Problem
            </button>

            <div id="classification-result" style="margin-top: 20px;"></div>
        </div>
    `;

    const objectiveContainer = tabs[0].querySelector('#objective-select-container');
    const constraintsList = tabs[0].querySelector('#constraints-list');
    const classifyBtn = tabs[0].querySelector('#classify-btn');
    const resultDiv = tabs[0].querySelector('#classification-result');

    let constraints = [];

    const objectiveSelect = createSelect(
        objectiveContainer,
        '',
        [
            { value: 'linear', label: 'Linear (cᵀx)' },
            { value: 'quadratic', label: 'Quadratic (½xᵀPx + qᵀx)' },
            { value: 'general', label: 'General Convex' }
        ],
        'linear'
    );

    function renderConstraints() {
        if (constraints.length === 0) {
            constraintsList.innerHTML = '<div style="color: var(--muted); font-style: italic;">No constraints added yet. Click a button above to add constraints.</div>';
            return;
        }

        constraintsList.innerHTML = constraints.map((c, idx) => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 12px; background: var(--panel); border-radius: 8px;">
                <span style="flex: 1;">
                    ${createBadge(c.label, c.color)}
                    <span style="font-family: monospace; margin-left: 10px;">${c.formula}</span>
                </span>
                <button onclick="window.removeConstraint${containerId}(${idx})" class="modern-button danger" style="padding: 5px 12px;">Remove</button>
            </div>
        `).join('');
    }

    window['removeConstraint' + containerId] = (idx) => {
        constraints.splice(idx, 1);
        renderConstraints();
    };

    tabs[0].querySelector('#add-linear-btn').onclick = () => {
        constraints.push({
            type: 'linear',
            label: 'Linear',
            formula: 'aᵀx ≤ b',
            color: 'info'
        });
        renderConstraints();
    };

    tabs[0].querySelector('#add-quad-btn').onclick = () => {
        constraints.push({
            type: 'quadratic',
            label: 'Quadratic',
            formula: 'xᵀQx + rᵀx + s ≤ 0',
            color: 'warning'
        });
        renderConstraints();
    };

    tabs[0].querySelector('#add-socp-btn').onclick = () => {
        constraints.push({
            type: 'socp',
            label: 'SOCP',
            formula: '||Ax + b||₂ ≤ cᵀx + d',
            color: 'purple'
        });
        renderConstraints();
    };

    tabs[0].querySelector('#add-sdp-btn').onclick = () => {
        constraints.push({
            type: 'sdp',
            label: 'SDP',
            formula: 'F(x) = F₀ + Σxᵢ Fᵢ ⪰ 0',
            color: 'danger'
        });
        renderConstraints();
    };

    classifyBtn.onclick = () => {
        const objType = objectiveSelect.getValue();
        const constraintTypes = constraints.map(c => c.type);

        const hasLinear = constraintTypes.includes('linear');
        const hasQuadratic = constraintTypes.includes('quadratic');
        const hasSOCP = constraintTypes.includes('socp');
        const hasSDP = constraintTypes.includes('sdp');

        let problemType = "General Convex Problem";
        let description = "This problem doesn't fit a standard form.";
        let badge = 'info';
        let solvers = [];
        let complexity = "Varies";

        // Classification logic
        if (objType === 'linear' && !hasQuadratic && !hasSOCP && !hasSDP) {
            problemType = "Linear Program (LP)";
            description = "Linear objective with only linear constraints. This is the simplest and fastest to solve.";
            badge = 'success';
            solvers = ['GLPK', 'CLP', 'Gurobi', 'CPLEX'];
            complexity = "O(n³) (Simplex) or O(n^3.5) (Interior-Point)";
        } else if (objType === 'quadratic' && !hasSOCP && !hasSDP) {
            if (!hasQuadratic) {
                problemType = "Quadratic Program (QP)";
                description = "Quadratic objective with linear constraints. Efficient solvers available.";
                badge = 'success';
                solvers = ['OSQP', 'qpOASES', 'Gurobi', 'MOSEK'];
                complexity = "O(n³)";
            } else {
                problemType = "Quadratically Constrained QP (QCQP)";
                description = "Quadratic objective with at least one quadratic constraint. Can be reformulated as SOCP.";
                badge = 'warning';
                solvers = ['Gurobi', 'MOSEK', 'ECOS'];
                complexity = "O(n³) per iteration";
            }
        } else if ((objType === 'linear' || objType === 'quadratic' || hasSOCP) && !hasSDP) {
            problemType = "Second-Order Cone Program (SOCP)";
            description = "Contains second-order cone constraints. More general than QP but more efficient than SDP.";
            badge = 'purple';
            solvers = ['ECOS', 'SCS', 'MOSEK', 'Gurobi'];
            complexity = "O(n³) per iteration, 10-50 iterations typical";
        } else if (hasSDP) {
            problemType = "Semidefinite Program (SDP)";
            description = "Contains matrix inequality constraints. Most general but computationally intensive.";
            badge = 'danger';
            solvers = ['SCS', 'MOSEK', 'SeDuMi', 'SDPT3'];
            complexity = "O(n⁴.5) to O(n⁶)";
        } else if (objType === 'general') {
            problemType = "General Convex Problem";
            description = "Use a modeling language like CVXPY or CVX to automatically detect structure.";
            badge = 'info';
            solvers = ['CVXPY', 'CVX', 'JuMP'];
            complexity = "Depends on problem structure";
        }

        resultDiv.innerHTML = `
            <div class="modern-card" style="padding: 25px; background: var(--panel);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0;">Classification Result</h3>
                    ${createBadge(problemType, badge)}
                </div>

                <div style="margin: 20px 0; padding: 20px; background: var(--panel-dark); border-left: 4px solid var(--brand); border-radius: 8px;">
                    <p style="margin: 0; font-size: 16px;">${description}</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div>
                        <strong style="display: block; margin-bottom: 8px;">Computational Complexity:</strong>
                        <div style="font-family: monospace; padding: 10px; background: var(--panel); border-radius: 6px;">
                            ${complexity}
                        </div>
                    </div>
                    <div>
                        <strong style="display: block; margin-bottom: 8px;">Recommended Solvers:</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${solvers.map(s => createBadge(s, 'info')).join(' ')}
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <strong>Problem Summary:</strong>
                    <div style="margin-top: 10px; padding: 15px; background: var(--panel); border-radius: 8px; font-family: monospace; font-size: 14px;">
                        <div><strong>Minimize:</strong> ${objType === 'linear' ? 'cᵀx' : objType === 'quadratic' ? '½xᵀPx + qᵀx' : 'f(x)'}</div>
                        <div style="margin-top: 8px;"><strong>Subject to:</strong></div>
                        ${constraints.length === 0 ? '<div style="margin-left: 20px; color: var(--muted);">(no constraints)</div>' :
                          constraints.map(c => `<div style="margin-left: 20px;">• ${c.formula}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    };

    // --- TAB 2: EXAMPLE PROBLEMS ---
    tabs[1].innerHTML = `
        <div style="padding: 20px;">
            <h4>Example Problem Classifications</h4>
            <div id="examples-grid"></div>
        </div>
    `;

    const examples = [
        {
            title: "Portfolio Optimization",
            objective: "Quadratic",
            constraints: ["Linear (budget)", "Linear (no short-selling)"],
            type: "QP",
            badge: "success",
            application: "Minimize risk (variance) while meeting return target"
        },
        {
            title: "Least-Squares Fitting",
            objective: "Quadratic (||Ax - b||₂²)",
            constraints: [],
            type: "Unconstrained QP",
            badge: "success",
            application: "Data fitting, regression analysis"
        },
        {
            title: "Linear Programming (Diet Problem)",
            objective: "Linear (minimize cost)",
            constraints: ["Linear (nutritional requirements)"],
            type: "LP",
            badge: "success",
            application: "Resource allocation, production planning"
        },
        {
            title: "Robust Least-Squares",
            objective: "Linear",
            constraints: ["SOCP (||Ax - b||₂ ≤ ε)"],
            type: "SOCP",
            badge: "purple",
            application: "Robust regression with bounded uncertainty"
        },
        {
            title: "Maximum Variance Unfolding",
            objective: "Linear (trace objective)",
            constraints: ["SDP (distance constraints)", "SDP (centering)"],
            type: "SDP",
            badge: "danger",
            application: "Dimensionality reduction, manifold learning"
        },
        {
            title: "Filter Design",
            objective: "Linear",
            constraints: ["SOCP (frequency response)", "Linear (stability)"],
            type: "SOCP",
            badge: "purple",
            application: "Digital signal processing"
        }
    ];

    const examplesGrid = tabs[1].querySelector('#examples-grid');
    examplesGrid.innerHTML = examples.map(ex => `
        <div class="modern-card" style="padding: 20px; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <h4 style="margin: 0;">${ex.title}</h4>
                ${createBadge(ex.type, ex.badge)}
            </div>
            <div style="margin: 10px 0;">
                <strong>Objective:</strong> ${ex.objective}
            </div>
            <div style="margin: 10px 0;">
                <strong>Constraints:</strong>
                ${ex.constraints.length === 0 ? '<span style="color: var(--muted);">None (unconstrained)</span>' :
                  '<ul style="margin: 5px 0 0 20px;">' + ex.constraints.map(c => `<li>${c}</li>`).join('') + '</ul>'}
            </div>
            <div style="margin-top: 15px; padding: 12px; background: var(--panel); border-radius: 6px; font-size: 14px;">
                <strong>Application:</strong> ${ex.application}
            </div>
        </div>
    `).join('');

    // --- TAB 3: THEORY ---
    tabs[2].innerHTML = `
        <div style="padding: 20px;">
            <h3>Problem Classification Theory</h3>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>1. Problem Hierarchy</h4>
                <p>Convex optimization problems are organized into a hierarchy based on the structure of the objective and constraints:</p>

                <div style="margin: 20px 0; padding: 20px; background: var(--panel); border-radius: 8px;">
                    <div style="font-family: monospace; font-size: 16px; line-height: 2;">
                        <strong style="color: var(--brand);">LP ⊂ QP ⊂ QCQP ⊂ SOCP ⊂ SDP ⊂ Convex</strong>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="border-bottom: 2px solid var(--border); background: var(--panel);">
                        <th style="padding: 12px; text-align: left;">Type</th>
                        <th style="padding: 12px; text-align: left;">Objective</th>
                        <th style="padding: 12px; text-align: left;">Constraints</th>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 12px;"><strong>LP</strong></td>
                        <td style="padding: 12px;">Linear</td>
                        <td style="padding: 12px;">Linear inequalities/equalities</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 12px;"><strong>QP</strong></td>
                        <td style="padding: 12px;">Quadratic</td>
                        <td style="padding: 12px;">Linear</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 12px;"><strong>QCQP</strong></td>
                        <td style="padding: 12px;">Quadratic</td>
                        <td style="padding: 12px;">Quadratic + Linear</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 12px;"><strong>SOCP</strong></td>
                        <td style="padding: 12px;">Linear</td>
                        <td style="padding: 12px;">Second-order cone + Linear</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 12px;"><strong>SDP</strong></td>
                        <td style="padding: 12px;">Linear</td>
                        <td style="padding: 12px;">Matrix inequality (LMI) + Linear</td>
                    </tr>
                </table>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>2. Standard Forms</h4>

                <h5 style="margin-top: 20px;">Linear Program (LP)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; font-family: monospace; margin: 10px 0;">
                    minimize: cᵀx<br>
                    subject to: Gx ≤ h<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ax = b
                </div>
                <p><strong>Key property:</strong> Optimal solution occurs at a vertex of the feasible polytope.</p>

                <h5 style="margin-top: 20px;">Quadratic Program (QP)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; font-family: monospace; margin: 10px 0;">
                    minimize: ½xᵀPx + qᵀx + r<br>
                    subject to: Gx ≤ h<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ax = b<br>
                    where P ⪰ 0 (positive semidefinite)
                </div>
                <p><strong>Key property:</strong> P ⪰ 0 ensures convexity. If P ≻ 0, unique global minimum exists.</p>

                <h5 style="margin-top: 20px;">Second-Order Cone Program (SOCP)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; font-family: monospace; margin: 10px 0;">
                    minimize: fᵀx<br>
                    subject to: ||Aᵢx + bᵢ||₂ ≤ cᵢᵀx + dᵢ, i=1,...,m<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fx = g
                </div>
                <p><strong>Key property:</strong> Each constraint defines a second-order (Lorentz) cone. More expressive than QP.</p>

                <h5 style="margin-top: 20px;">Semidefinite Program (SDP)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; font-family: monospace; margin: 10px 0;">
                    minimize: trace(CᵀX)<br>
                    subject to: trace(AᵢᵀX) = bᵢ, i=1,...,p<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X ⪰ 0
                </div>
                <p><strong>Key property:</strong> X ⪰ 0 means X is positive semidefinite (all eigenvalues ≥ 0).</p>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>3. How to Classify a Problem</h4>

                <div style="margin: 15px 0;">
                    <h5>Step 1: Identify the Objective Function</h5>
                    <ul>
                        <li>Is it linear in the variables? → Could be LP, SOCP, or SDP</li>
                        <li>Is it quadratic? → Could be QP, QCQP, or reformulated as SOCP</li>
                        <li>Is it a general convex function? → General convex problem</li>
                    </ul>
                </div>

                <div style="margin: 15px 0;">
                    <h5>Step 2: Examine the Constraints</h5>
                    <ul>
                        <li>All linear? → If objective is linear: <strong>LP</strong>; if quadratic: <strong>QP</strong></li>
                        <li>Contains ||·||₂ norms? → Likely <strong>SOCP</strong></li>
                        <li>Contains matrix inequalities (X ⪰ 0)? → <strong>SDP</strong></li>
                        <li>Mix of quadratic and linear? → <strong>QCQP</strong> (can be reformulated as SOCP)</li>
                    </ul>
                </div>

                <div style="margin: 15px 0;">
                    <h5>Step 3: Check Convexity</h5>
                    <p>For the problem to be convex:</p>
                    <ul>
                        <li>Objective must be convex (for minimization)</li>
                        <li>All inequality constraints must be convex (fᵢ(x) ≤ 0 where fᵢ is convex)</li>
                        <li>All equality constraints must be affine (Ax = b)</li>
                    </ul>
                </div>
            </div>

            <div class="modern-card" style="padding: 20px;">
                <h4>4. Why Classification Matters</h4>

                <h5 style="margin-top: 15px;">Solver Selection</h5>
                <p>Different problem classes have specialized solvers optimized for their structure:</p>
                <ul>
                    <li><strong>LP:</strong> Simplex and interior-point methods are highly efficient</li>
                    <li><strong>QP:</strong> Active-set and interior-point methods, good for real-time control</li>
                    <li><strong>SOCP:</strong> Interior-point methods, faster than SDP for many problems</li>
                    <li><strong>SDP:</strong> Computationally expensive, but necessary for some problems</li>
                </ul>

                <h5 style="margin-top: 15px;">Computational Efficiency</h5>
                <p>Using a specialized solver for the tightest problem class gives best performance:</p>
                <ul>
                    <li>LP solver on LP: milliseconds for thousands of variables</li>
                    <li>SDP solver on LP: seconds (unnecessary overhead)</li>
                    <li>Incorrectly using non-convex solver: no guarantees, may not converge</li>
                </ul>

                <h5 style="margin-top: 15px;">Problem Reformulation</h5>
                <p>Sometimes problems can be reformulated into a more efficient class:</p>
                <ul>
                    <li>ℓ₁ minimization can be reformulated as LP</li>
                    <li>QCQP can often be reformulated as SOCP</li>
                    <li>Some non-convex problems can be relaxed to SDP</li>
                </ul>
            </div>
        </div>
    `;

    // Initialize
    renderConstraints();
}
