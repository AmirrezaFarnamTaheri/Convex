/**
 * Widget: Solver Guide
 *
 * Description: Interactive guide to selecting the appropriate solver based on problem type
 * Version: 3.0.0 - Enhanced with modern framework
 */
import { createModernWidget, createTabs, createSelect, createBadge } from '/static/js/modern-components.js';

export function initSolverGuide(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Solver Selection Guide');
    const tabs = createTabs(vizContainer, ['Interactive', 'Comparison', 'Theory']);

    // --- SOLVER DATABASE ---
    const solvers = {
        lp: {
            name: "Linear Program (LP)",
            solvers: [
                { name: "GLPK", type: "open-source", speed: "medium", description: "GNU Linear Programming Kit - reliable and widely used" },
                { name: "CLP", type: "open-source", speed: "fast", description: "COIN-OR Linear Programming - high performance" },
                { name: "Gurobi", type: "commercial", speed: "very-fast", description: "Industry-leading performance, free for academics" },
                { name: "CPLEX", type: "commercial", speed: "very-fast", description: "IBM's solver with excellent support" },
                { name: "MOSEK", type: "commercial", speed: "very-fast", description: "Excellent for large-scale problems" }
            ],
            recommendation: "For most applications, **GLPK** or **CLP** are excellent free options. For large-scale or production systems, **Gurobi** offers superior performance.",
            complexity: "O(n³) for simplex (worst-case), O(n^3.5) for interior-point",
            applications: ["Portfolio optimization", "Resource allocation", "Network flow", "Production planning"]
        },
        qp: {
            name: "Quadratic Program (QP)",
            solvers: [
                { name: "OSQP", type: "open-source", speed: "fast", description: "Operator Splitting QP - modern and efficient" },
                { name: "qpOASES", type: "open-source", speed: "fast", description: "Online Active Set Strategy - good for real-time" },
                { name: "Gurobi", type: "commercial", speed: "very-fast", description: "Handles both convex and non-convex QPs" },
                { name: "CPLEX", type: "commercial", speed: "very-fast", description: "Robust for large-scale QPs" },
                { name: "MOSEK", type: "commercial", speed: "very-fast", description: "Excellent for conic quadratic problems" }
            ],
            recommendation: "**OSQP** is the go-to choice for most convex QPs. For non-convex or very large problems, consider **Gurobi** or **MOSEK**.",
            complexity: "O(n³) for general QP, can be faster with structure",
            applications: ["MPC (Model Predictive Control)", "Portfolio optimization", "Least-squares with constraints", "SVM training"]
        },
        socp: {
            name: "Second-Order Cone Program (SOCP)",
            solvers: [
                { name: "ECOS", type: "open-source", speed: "fast", description: "Embedded Conic Solver - efficient and reliable" },
                { name: "SCS", type: "open-source", speed: "very-fast", description: "Splitting Conic Solver - scales to large problems" },
                { name: "MOSEK", type: "commercial", speed: "very-fast", description: "Industry-leading for conic optimization" },
                { name: "Gurobi", type: "commercial", speed: "very-fast", description: "Handles SOCP alongside LP/QP" },
                { name: "CVXOPT", type: "open-source", speed: "medium", description: "Python-based, good for prototyping" }
            ],
            recommendation: "**ECOS** or **SCS** are excellent free choices. For production systems, **MOSEK** offers the best performance for conic problems.",
            complexity: "O(n³) per iteration, typically 10-50 iterations",
            applications: ["Robust optimization", "Filter design", "Antenna array design", "Robust least-squares"]
        },
        sdp: {
            name: "Semidefinite Program (SDP)",
            solvers: [
                { name: "SCS", type: "open-source", speed: "fast", description: "Handles large-scale SDPs efficiently" },
                { name: "MOSEK", type: "commercial", speed: "very-fast", description: "Best-in-class for SDP problems" },
                { name: "SeDuMi", type: "open-source", speed: "medium", description: "MATLAB-based, reliable for medium problems" },
                { name: "SDPT3", type: "open-source", speed: "medium", description: "MATLAB solver with good accuracy" },
                { name: "CVXOPT", type: "open-source", speed: "medium", description: "Python implementation" }
            ],
            recommendation: "For serious SDP work, **MOSEK** is recommended. For free alternatives, **SCS** offers excellent scaling. **SeDuMi** is good for academic use.",
            complexity: "O(n⁴.5) to O(n⁶) depending on method and structure",
            applications: ["Control theory", "Combinatorial optimization", "Machine learning", "Sum-of-squares programming"]
        },
        general: {
            name: "General Convex Problem",
            solvers: [
                { name: "CVXPY", type: "modeling", speed: "varies", description: "Python modeling language - calls other solvers" },
                { name: "CVX", type: "modeling", speed: "varies", description: "MATLAB modeling language" },
                { name: "JuMP", type: "modeling", speed: "varies", description: "Julia modeling language" },
                { name: "YALMIP", type: "modeling", speed: "varies", description: "MATLAB toolbox for optimization" }
            ],
            recommendation: "Use a **modeling language** like **CVXPY** (Python) or **CVX** (MATLAB) to automatically detect problem structure and select an appropriate solver.",
            complexity: "Depends on problem structure and solver chosen",
            applications: ["Rapid prototyping", "Algorithm research", "Educational purposes"]
        }
    };

    // --- TAB 1: INTERACTIVE SELECTION ---
    tabs[0].innerHTML = `
        <div style="padding: 20px;">
            <h4>Select Your Problem Type</h4>
            <div id="problem-type-container"></div>
            <div id="solver-recommendations" style="margin-top: 20px;"></div>
        </div>
    `;

    const problemTypeContainer = tabs[0].querySelector('#problem-type-container');
    const recommendationsDiv = tabs[0].querySelector('#solver-recommendations');

    const problemTypeSelect = createSelect(
        problemTypeContainer,
        'Problem Type',
        [
            { value: 'lp', label: 'Linear Program (LP)' },
            { value: 'qp', label: 'Quadratic Program (QP)' },
            { value: 'socp', label: 'Second-Order Cone Program (SOCP)' },
            { value: 'sdp', label: 'Semidefinite Program (SDP)' },
            { value: 'general', label: 'General Convex Problem' }
        ],
        'lp',
        updateRecommendations
    );

    function updateRecommendations() {
        const problemType = problemTypeSelect.getValue();
        const problemInfo = solvers[problemType];

        let html = `
            <div class="modern-card" style="padding: 20px;">
                <h4>${problemInfo.name}</h4>

                <div style="margin: 15px 0;">
                    <strong>Computational Complexity:</strong> ${problemInfo.complexity}
                </div>

                <div style="margin: 15px 0;">
                    <strong>Recommended Solvers:</strong>
                    <div style="margin-top: 10px;">
        `;

        problemInfo.solvers.forEach(solver => {
            const badgeColor = solver.type === 'commercial' ? 'warning' :
                              solver.type === 'modeling' ? 'info' : 'success';
            const speedColor = solver.speed === 'very-fast' ? '#00ff88' :
                              solver.speed === 'fast' ? '#88ff00' : '#ffaa00';

            html += `
                <div style="margin: 10px 0; padding: 12px; background: var(--panel); border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <strong style="font-size: 16px;">${solver.name}</strong>
                        ${createBadge(solver.type, badgeColor)}
                        <span style="color: ${speedColor}; font-size: 12px;">⚡ ${solver.speed}</span>
                    </div>
                    <div style="color: var(--muted); font-size: 14px;">${solver.description}</div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>

                <div style="margin: 15px 0; padding: 15px; background: var(--panel-dark); border-left: 4px solid var(--brand); border-radius: 8px;">
                    <strong>💡 Recommendation:</strong><br>
                    <div style="margin-top: 8px;">${problemInfo.recommendation}</div>
                </div>

                <div style="margin: 15px 0;">
                    <strong>Common Applications:</strong>
                    <ul style="margin-top: 8px;">
                        ${problemInfo.applications.map(app => `<li>${app}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        recommendationsDiv.innerHTML = html;
    }

    // --- TAB 2: COMPARISON TABLE ---
    tabs[1].innerHTML = `
        <div style="padding: 20px;">
            <h4>Solver Comparison</h4>
            <div style="overflow-x: auto;">
                <table class="comparison-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--panel); border-bottom: 2px solid var(--border);">
                            <th style="padding: 12px; text-align: left;">Problem Type</th>
                            <th style="padding: 12px; text-align: left;">Best Open-Source</th>
                            <th style="padding: 12px; text-align: left;">Best Commercial</th>
                            <th style="padding: 12px; text-align: left;">Complexity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px;"><strong>LP</strong></td>
                            <td style="padding: 12px;">GLPK, CLP</td>
                            <td style="padding: 12px;">Gurobi, MOSEK</td>
                            <td style="padding: 12px;">O(n³) - O(n^3.5)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px;"><strong>QP</strong></td>
                            <td style="padding: 12px;">OSQP, qpOASES</td>
                            <td style="padding: 12px;">Gurobi, MOSEK</td>
                            <td style="padding: 12px;">O(n³)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px;"><strong>SOCP</strong></td>
                            <td style="padding: 12px;">ECOS, SCS</td>
                            <td style="padding: 12px;">MOSEK, Gurobi</td>
                            <td style="padding: 12px;">O(n³) per iter</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 12px;"><strong>SDP</strong></td>
                            <td style="padding: 12px;">SCS, SeDuMi</td>
                            <td style="padding: 12px;">MOSEK</td>
                            <td style="padding: 12px;">O(n⁴.5) - O(n⁶)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 30px;">
                <h4>Solver Selection Decision Tree</h4>
                <div class="modern-card" style="padding: 20px; background: var(--panel);">
                    <pre style="line-height: 1.8; margin: 0; font-family: monospace; overflow-x: auto;">
Is your problem convex?
├─ Yes → What type?
│  ├─ Linear objective + linear constraints → <span style="color: var(--brand);">LP</span> → Use GLPK/CLP (free) or Gurobi (fast)
│  ├─ Quadratic objective + linear constraints → <span style="color: var(--brand);">QP</span> → Use OSQP (free) or MOSEK (fast)
│  ├─ Has second-order cone constraints → <span style="color: var(--brand);">SOCP</span> → Use ECOS/SCS (free) or MOSEK (fast)
│  ├─ Has matrix inequality constraints → <span style="color: var(--brand);">SDP</span> → Use SCS (free) or MOSEK (best)
│  └─ Not sure? → Use modeling language (<span style="color: var(--brand);">CVXPY</span>, CVX, JuMP)
└─ No → Consider global optimization solvers or approximations
                    </pre>
                </div>
            </div>
        </div>
    `;

    // --- TAB 3: THEORY ---
    tabs[2].innerHTML = `
        <div style="padding: 20px;">
            <h3>Solver Theory and Selection Criteria</h3>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>1. Problem Hierarchy</h4>
                <p>Convex optimization problems form a hierarchy based on generality:</p>
                <div style="margin: 15px 0; padding: 15px; background: var(--panel); border-radius: 8px;">
                    <strong>LP ⊂ QP ⊂ SOCP ⊂ SDP ⊂ General Convex</strong>
                </div>
                <p>Each class can be solved by solvers designed for more general problems, but specialized solvers are usually faster.</p>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>2. Algorithm Classes</h4>

                <h5 style="margin-top: 15px;">Interior-Point Methods</h5>
                <ul>
                    <li>Follow central path through interior of feasible region</li>
                    <li>Polynomial-time complexity guarantees</li>
                    <li>Used in: MOSEK, Gurobi, ECOS, CVXOPT</li>
                    <li>Best for: Medium to large problems requiring high accuracy</li>
                </ul>

                <h5 style="margin-top: 15px;">Simplex Method (LP only)</h5>
                <ul>
                    <li>Walks along edges of feasible polytope</li>
                    <li>Exponential worst-case, but often very fast in practice</li>
                    <li>Used in: GLPK, CLP, Gurobi, CPLEX</li>
                    <li>Best for: Small to medium LPs with sparse structure</li>
                </ul>

                <h5 style="margin-top: 15px;">First-Order Methods</h5>
                <ul>
                    <li>Use only gradients (not Hessians)</li>
                    <li>Fast iterations, but more iterations needed</li>
                    <li>Used in: OSQP, SCS, PDHG</li>
                    <li>Best for: Very large-scale problems where high accuracy isn't critical</li>
                </ul>

                <h5 style="margin-top: 15px;">Active-Set Methods (QP)</h5>
                <ul>
                    <li>Identify and maintain set of active constraints</li>
                    <li>Efficient for warm-starting (e.g., in MPC)</li>
                    <li>Used in: qpOASES, OOQP</li>
                    <li>Best for: Real-time control applications</li>
                </ul>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>3. Selection Criteria</h4>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px; width: 30%;"><strong>Criterion</strong></td>
                        <td style="padding: 10px;"><strong>Considerations</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>Problem Size</strong></td>
                        <td style="padding: 10px;">n < 1000: any solver | n < 100k: first-order | n > 100k: specialized methods</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>Accuracy Needed</strong></td>
                        <td style="padding: 10px;">High (ε < 10⁻⁸): interior-point | Medium: first-order OK</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>Real-time</strong></td>
                        <td style="padding: 10px;">Use active-set (QP) or fast first-order methods</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>Budget</strong></td>
                        <td style="padding: 10px;">Academic: commercial solvers often free | Industry: commercial worth it</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>Licensing</strong></td>
                        <td style="padding: 10px;">Deployment concerns? Use open-source (OSQP, SCS, etc.)</td>
                    </tr>
                </table>
            </div>

            <div class="modern-card" style="padding: 20px;">
                <h4>4. Modeling Languages vs. Direct Solvers</h4>

                <h5 style="margin-top: 15px;">Use Modeling Languages (CVXPY, CVX, JuMP) when:</h5>
                <ul>
                    <li>✅ Prototyping and experimenting with problem formulations</li>
                    <li>✅ Problem structure is complex or may change</li>
                    <li>✅ Not performance-critical</li>
                    <li>✅ Educational or research setting</li>
                </ul>

                <h5 style="margin-top: 15px;">Use Direct Solver APIs when:</h5>
                <ul>
                    <li>✅ Maximum performance needed</li>
                    <li>✅ Problem structure is fixed and well-understood</li>
                    <li>✅ Deploying in production</li>
                    <li>✅ Fine control over solver parameters needed</li>
                </ul>
            </div>
        </div>
    `;

    // Initialize
    updateRecommendations();
}
