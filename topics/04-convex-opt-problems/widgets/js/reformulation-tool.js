/**
 * Widget: Problem Reformulation Tool
 *
 * Description: Interactive demonstrations of reformulating problems into standard
 *              convex forms (LP, QP, SOCP, SDP)
 * Version: 3.0.0 - Enhanced with modern framework
 */
import { createModernWidget, createTabs, createSelect, createButton, createBadge } from '/static/js/modern-components.js';

export function initProblemReformulationTool(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { viz: vizContainer } = createModernWidget(container, 'Problem Reformulation Tool');
    const tabs = createTabs(vizContainer, ['Interactive', 'Catalog', 'Theory']);

    // --- REFORMULATION EXAMPLES DATABASE ---
    const reformulations = {
        "l1_norm": {
            title: "ℓ₁ Norm Minimization",
            category: "Norm",
            original: {
                form: "minimize ||x||₁",
                description: "Minimize the sum of absolute values"
            },
            steps: [
                "The ℓ₁ norm is ||x||₁ = Σᵢ |xᵢ|, which is non-smooth.",
                "Introduce auxiliary variables tᵢ to represent |xᵢ|.",
                "Replace objective with: minimize Σᵢ tᵢ",
                "Add constraints: |xᵢ| ≤ tᵢ for all i",
                "Split each absolute value: xᵢ ≤ tᵢ AND -xᵢ ≤ tᵢ",
                "Result: Linear objective with linear constraints!"
            ],
            finalForm: {
                problem: "minimize: 1ᵀt\nsubject to: x ≤ t\n            -x ≤ t",
                type: "Linear Program (LP)"
            },
            badge: "success"
        },
        "linf_norm": {
            title: "ℓ∞ Norm Minimization",
            category: "Norm",
            original: {
                form: "minimize ||x||∞",
                description: "Minimize the maximum absolute value"
            },
            steps: [
                "The ℓ∞ norm is ||x||∞ = maxᵢ |xᵢ|",
                "Introduce auxiliary variable t to represent the maximum",
                "Replace objective with: minimize t",
                "Add constraints: |xᵢ| ≤ t for all i",
                "Split each: xᵢ ≤ t AND -xᵢ ≤ t",
                "Result: LP with (2n+1) constraints!"
            ],
            finalForm: {
                problem: "minimize: t\nsubject to: x ≤ t·1\n            -x ≤ t·1",
                type: "Linear Program (LP)"
            },
            badge: "success"
        },
        "abs_value": {
            title: "Absolute Value in Objective",
            category: "Basic",
            original: {
                form: "minimize |x₁| + 2|x₂|\nsubject to x₁ + x₂ ≥ 2",
                description: "Weighted sum of absolute values"
            },
            steps: [
                "Introduce variables t₁, t₂ to represent |x₁| and |x₂|",
                "Objective becomes: minimize t₁ + 2t₂",
                "Add constraints: |x₁| ≤ t₁ and |x₂| ≤ t₂",
                "Split: x₁ ≤ t₁, -x₁ ≤ t₁, x₂ ≤ t₂, -x₂ ≤ t₂",
                "Convert original constraint: -x₁ - x₂ ≤ -2"
            ],
            finalForm: {
                problem: "minimize: t₁ + 2t₂\nsubject to: x₁ ≤ t₁, -x₁ ≤ t₁\n            x₂ ≤ t₂, -x₂ ≤ t₂\n            -x₁ - x₂ ≤ -2",
                type: "Linear Program (LP)"
            },
            badge: "success"
        },
        "max_function": {
            title: "Maximum Function",
            category: "Basic",
            original: {
                form: "minimize max(x₁, 2x₂ + 1, x₁ - x₂)",
                description: "Minimize maximum of linear functions"
            },
            steps: [
                "Introduce variable t to represent max value",
                "Objective becomes: minimize t",
                "Add constraint: t ≥ x₁",
                "Add constraint: t ≥ 2x₂ + 1",
                "Add constraint: t ≥ x₁ - x₂",
                "Rewrite in standard form (Gx ≤ h)"
            ],
            finalForm: {
                problem: "minimize: t\nsubject to: x₁ - t ≤ 0\n            2x₂ - t ≤ -1\n            x₁ - x₂ - t ≤ 0",
                type: "Linear Program (LP)"
            },
            badge: "success"
        },
        "least_squares": {
            title: "Least Squares",
            category: "Quadratic",
            original: {
                form: "minimize ||Ax - b||₂²",
                description: "Standard least squares problem"
            },
            steps: [
                "Expand: ||Ax - b||₂² = (Ax-b)ᵀ(Ax-b)",
                "= xᵀAᵀAx - 2bᵀAx + bᵀb",
                "Identify: P = 2AᵀA (positive semidefinite)",
                "Identify: q = -2Aᵀb, r = bᵀb",
                "Standard QP form: minimize ½xᵀPx + qᵀx + r"
            ],
            finalForm: {
                problem: "minimize: ½xᵀ(2AᵀA)x - 2bᵀAx + bᵀb\n(unconstrained)",
                type: "Quadratic Program (QP)"
            },
            badge: "success"
        },
        "huber_loss": {
            title: "Huber Loss",
            category: "Robust",
            original: {
                form: "minimize Σᵢ huber(rᵢ)\nwhere huber(r) = {r² if |r| ≤ M; 2M|r| - M² otherwise}",
                description: "Robust regression with Huber penalty"
            },
            steps: [
                "Introduce variables (u, v) for each residual rᵢ",
                "Add constraint: |rᵢ| = uᵢ + vᵢ",
                "Add constraint: uᵢ ≤ M, vᵢ ≥ 0",
                "Objective becomes: Σᵢ (uᵢ² + 2Mvᵢ)",
                "This is a QP with linear constraints"
            ],
            finalForm: {
                problem: "minimize: Σᵢ (uᵢ² + 2Mvᵢ)\nsubject to: linear constraints on u, v, r",
                type: "Quadratic Program (QP)"
            },
            badge: "success"
        },
        "l2_ball": {
            title: "Euclidean Norm Constraint",
            category: "SOCP",
            original: {
                form: "minimize cᵀx\nsubject to ||Ax - b||₂ ≤ ε",
                description: "Linear objective with norm constraint"
            },
            steps: [
                "The constraint ||Ax - b||₂ ≤ ε is already a second-order cone",
                "This is exactly the form: ||Fx + g||₂ ≤ hᵀx + k",
                "where F = A, g = -b, h = 0, k = ε",
                "No reformulation needed - already SOCP standard form!"
            ],
            finalForm: {
                problem: "minimize: cᵀx\nsubject to: ||Ax - b||₂ ≤ ε",
                type: "Second-Order Cone Program (SOCP)"
            },
            badge: "purple"
        },
        "quadratic_constraint": {
            title: "Quadratic Constraint to SOCP",
            category: "SOCP",
            original: {
                form: "minimize cᵀx\nsubject to xᵀQx + 2pᵀx + r ≤ 0",
                description: "LP with quadratic constraint"
            },
            steps: [
                "Factor Q = LLᵀ (Cholesky decomposition)",
                "Rewrite: ||Lᵀx + L⁻ᵀp||₂² ≤ pᵀQ⁻¹p - r",
                "Let t² = pᵀQ⁻¹p - r (constant)",
                "Constraint becomes: ||Lᵀx + L⁻ᵀp||₂ ≤ t",
                "This is second-order cone form!"
            ],
            finalForm: {
                problem: "minimize: cᵀx\nsubject to: ||Lᵀx + L⁻ᵀp||₂ ≤ √(pᵀQ⁻¹p - r)",
                type: "Second-Order Cone Program (SOCP)"
            },
            badge: "purple"
        },
        "robust_lp": {
            title: "Robust Linear Program",
            category: "SOCP",
            original: {
                form: "minimize cᵀx\nsubject to aᵢᵀx ≤ bᵢ ∀aᵢ ∈ {ā + Pᵢu : ||u||₂ ≤ 1}",
                description: "LP with uncertain constraints"
            },
            steps: [
                "Worst-case constraint: maxᵤ(āᵢ + Pᵢu)ᵀx ≤ bᵢ, ||u||₂ ≤ 1",
                "Inner maximization: āᵢᵀx + maxᵤ uᵀPᵢᵀx, ||u||₂ ≤ 1",
                "The maximum is ||Pᵢᵀx||₂ (Cauchy-Schwarz)",
                "Robust constraint: āᵢᵀx + ||Pᵢᵀx||₂ ≤ bᵢ",
                "This is SOCP standard form!"
            ],
            finalForm: {
                problem: "minimize: cᵀx\nsubject to: ||Pᵢᵀx||₂ ≤ bᵢ - āᵢᵀx",
                type: "Second-Order Cone Program (SOCP)"
            },
            badge: "purple"
        },
        "trace_minimization": {
            title: "Matrix Trace Minimization",
            category: "SDP",
            original: {
                form: "minimize trace(AX)\nsubject to: X ⪰ 0, trace(X) = 1",
                description: "Optimization over positive semidefinite matrices"
            },
            steps: [
                "This is already in SDP standard form!",
                "X ⪰ 0 means X is positive semidefinite",
                "Linear objective: trace(AX) = Σᵢⱼ Aᵢⱼ Xᵢⱼ",
                "Linear equality constraint: trace(X) = 1",
                "Common in control theory and combinatorial optimization"
            ],
            finalForm: {
                problem: "minimize: trace(AX)\nsubject to: X ⪰ 0\n            trace(X) = 1",
                type: "Semidefinite Program (SDP)"
            },
            badge: "danger"
        },
        "maxcut_relaxation": {
            title: "MAXCUT SDP Relaxation",
            category: "SDP",
            original: {
                form: "maximize Σᵢⱼ wᵢⱼ(1 - xᵢxⱼ)/2\nsubject to: xᵢ ∈ {-1, +1}",
                description: "Non-convex combinatorial problem"
            },
            steps: [
                "Let X = xxᵀ (rank-1 matrix)",
                "Relax: allow X ⪰ 0 with diag(X) = 1",
                "Rewrite objective: ¼Σᵢⱼ wᵢⱼ(1 - Xᵢⱼ)",
                "= constant - ¼ trace(WX) where W is weight matrix",
                "Result: SDP relaxation with approximation guarantee!"
            },
            finalForm: {
                problem: "maximize: -(1/4)trace(WX)\nsubject to: X ⪰ 0\n            diag(X) = 1",
                type: "Semidefinite Program (SDP)"
            },
            badge: "danger"
        }
    };

    // --- TAB 1: INTERACTIVE REFORMULATION ---
    tabs[0].innerHTML = `
        <div style="padding: 20px;">
            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>Select a Problem to Reformulate</h4>
                <div id="problem-selector"></div>
            </div>

            <div id="reformulation-viewer"></div>
        </div>
    `;

    const selectorContainer = tabs[0].querySelector('#problem-selector');
    const viewerContainer = tabs[0].querySelector('#reformulation-viewer');

    const problemOptions = Object.keys(reformulations).map(key => ({
        value: key,
        label: reformulations[key].title
    }));

    const problemSelector = createSelect(
        selectorContainer,
        '',
        problemOptions,
        'l1_norm',
        () => renderReformulation(problemSelector.getValue())
    );

    let currentStep = 0;

    function renderReformulation(problemKey) {
        currentStep = 0;
        const problem = reformulations[problemKey];

        viewerContainer.innerHTML = `
            <div class="modern-card" style="padding: 25px; background: var(--panel);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <h3 style="margin: 0;">${problem.title}</h3>
                    ${createBadge(problem.category, 'info')}
                </div>

                <div style="margin: 20px 0;">
                    <h4>Original Problem:</h4>
                    <div style="padding: 20px; background: var(--panel-dark); border-radius: 8px; border-left: 4px solid #ff6b6b;">
                        <div style="font-family: monospace; white-space: pre-line; line-height: 1.8;">
${problem.original.form}
                        </div>
                        <div style="margin-top: 10px; color: var(--muted); font-size: 14px;">
                            ${problem.original.description}
                        </div>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <h4>Reformulation Steps:</h4>
                    <div id="steps-container-${problemKey}"></div>
                    <div style="margin-top: 15px;">
                        <button id="next-step-btn" class="modern-button primary">Next Step →</button>
                        <button id="reset-btn" class="modern-button secondary">Reset</button>
                        <button id="show-all-btn" class="modern-button secondary">Show All</button>
                    </div>
                </div>

                <div id="final-form-container" style="margin: 20px 0; display: none;">
                    <h4>Final Standard Form:</h4>
                    <div style="padding: 20px; background: var(--panel-dark); border-radius: 8px; border-left: 4px solid var(--brand);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <strong>Result Type:</strong>
                            ${createBadge(problem.finalForm.type, problem.badge)}
                        </div>
                        <div style="font-family: monospace; white-space: pre-line; line-height: 1.8; background: var(--panel); padding: 15px; border-radius: 6px;">
${problem.finalForm.problem}
                        </div>
                    </div>
                </div>
            </div>
        `;

        updateSteps(problemKey);

        viewerContainer.querySelector('#next-step-btn').onclick = () => {
            if (currentStep < problem.steps.length) {
                currentStep++;
                updateSteps(problemKey);
            }
        };

        viewerContainer.querySelector('#reset-btn').onclick = () => {
            currentStep = 0;
            updateSteps(problemKey);
        };

        viewerContainer.querySelector('#show-all-btn').onclick = () => {
            currentStep = problem.steps.length;
            updateSteps(problemKey);
        };
    }

    function updateSteps(problemKey) {
        const problem = reformulations[problemKey];
        const stepsContainer = viewerContainer.querySelector(`#steps-container-${problemKey}`);
        const finalContainer = viewerContainer.querySelector('#final-form-container');
        const nextBtn = viewerContainer.querySelector('#next-step-btn');

        let html = '<ol style="line-height: 2;">';
        for (let i = 0; i < currentStep; i++) {
            html += `<li style="margin: 10px 0; padding: 10px; background: var(--panel-dark); border-radius: 6px;">${problem.steps[i]}</li>`;
        }
        html += '</ol>';

        stepsContainer.innerHTML = html || '<div style="color: var(--muted); font-style: italic;">Click "Next Step" to begin the reformulation...</div>';

        if (currentStep >= problem.steps.length) {
            finalContainer.style.display = 'block';
            nextBtn.disabled = true;
            nextBtn.textContent = 'Complete!';
        } else {
            finalContainer.style.display = 'none';
            nextBtn.disabled = false;
            nextBtn.textContent = `Next Step (${currentStep + 1}/${problem.steps.length}) →`;
        }
    }

    // --- TAB 2: REFORMULATION CATALOG ---
    tabs[1].innerHTML = `
        <div style="padding: 20px;">
            <h4>Reformulation Techniques Catalog</h4>
            <div id="catalog-grid"></div>
        </div>
    `;

    const catalogGrid = tabs[1].querySelector('#catalog-grid');
    catalogGrid.innerHTML = Object.keys(reformulations).map(key => {
        const prob = reformulations[key];
        return `
            <div class="modern-card" style="padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h4 style="margin: 0;">${prob.title}</h4>
                        ${createBadge(prob.category, 'info')}
                    </div>
                    ${createBadge(prob.finalForm.type, prob.badge)}
                </div>

                <div style="margin: 15px 0;">
                    <strong>From:</strong>
                    <div style="margin: 8px 0; padding: 12px; background: var(--panel); border-radius: 6px; font-family: monospace; font-size: 13px;">
                        ${prob.original.form.replace(/\n/g, '<br>')}
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <strong>To:</strong>
                    <div style="margin: 8px 0; padding: 12px; background: var(--panel); border-radius: 6px; font-family: monospace; font-size: 13px;">
                        ${prob.finalForm.problem.replace(/\n/g, '<br>')}
                    </div>
                </div>

                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                    <strong>Steps:</strong> ${prob.steps.length} reformulation steps
                </div>
            </div>
        `;
    }).join('');

    // --- TAB 3: THEORY ---
    tabs[2].innerHTML = `
        <div style="padding: 20px;">
            <h3>Reformulation Theory and Techniques</h3>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>1. Why Reformulate?</h4>

                <h5 style="margin-top: 15px;">Computational Efficiency</h5>
                <ul>
                    <li><strong>Specialized solvers:</strong> Standard forms have highly optimized solvers</li>
                    <li><strong>Tighter formulations:</strong> Can reduce solve time by orders of magnitude</li>
                    <li><strong>Numerical stability:</strong> Well-conditioned formulations converge faster</li>
                </ul>

                <h5 style="margin-top: 15px;">Problem Recognition</h5>
                <ul>
                    <li><strong>Identify structure:</strong> Reveal hidden convexity or special structure</li>
                    <li><strong>Solver selection:</strong> Know which algorithms to apply</li>
                    <li><strong>Complexity analysis:</strong> Understand computational requirements</li>
                </ul>

                <h5 style="margin-top: 15px;">Theoretical Insights</h5>
                <ul>
                    <li><strong>Duality:</strong> Reformulations reveal dual structure</li>
                    <li><strong>Relaxations:</strong> Approximate hard problems with tractable ones</li>
                    <li><strong>Approximation guarantees:</strong> Quantify solution quality</li>
                </ul>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>2. Common Reformulation Techniques</h4>

                <h5 style="margin-top: 15px;">Epigraph Form</h5>
                <p>Convert <code>minimize f(x)</code> to:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0; font-family: monospace;">
                    minimize: t<br>
                    subject to: f(x) ≤ t
                </div>
                <p>Moves objective into constraints. Useful when f(x) has special structure.</p>

                <h5 style="margin-top: 15px;">Absolute Value Splitting</h5>
                <p>Replace |x| with:</p>
                <ul>
                    <li>Introduce t with constraints: x ≤ t and -x ≤ t</li>
                    <li>Converts non-smooth |·| to smooth linear constraints</li>
                    <li>Key technique for ℓ₁ minimization → LP</li>
                </ul>

                <h5 style="margin-top: 15px;">Maximum Function</h5>
                <p>Replace max(f₁(x), ..., fₙ(x)) with:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0; font-family: monospace;">
                    minimize: t<br>
                    subject to: fᵢ(x) ≤ t, i=1,...,n
                </div>

                <h5 style="margin-top: 15px;">Norm Constraints</h5>
                <p>Different norms reformulate to different problem classes:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>||x||₁</strong></td>
                        <td style="padding: 10px;">→ LP (split absolute values)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>||x||₂</strong></td>
                        <td style="padding: 10px;">→ SOCP (already second-order cone)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>||x||∞</strong></td>
                        <td style="padding: 10px;">→ LP (t ≥ |xᵢ| for all i)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 10px;"><strong>||x||₂²</strong></td>
                        <td style="padding: 10px;">→ QP (quadratic objective)</td>
                    </tr>
                </table>

                <h5 style="margin-top: 15px;">Quadratic to SOCP</h5>
                <p>Quadratic constraint xᵀQx ≤ 1 (Q ≻ 0) reformulates to:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0; font-family: monospace;">
                    ||Lᵀx||₂ ≤ 1, where Q = LLᵀ (Cholesky)
                </div>
                <p>SOCP solvers can be more efficient than QP for certain problems.</p>

                <h5 style="margin-top: 15px;">Rank Relaxation</h5>
                <p>Non-convex rank constraint rank(X) = 1 relaxes to:</p>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0; font-family: monospace;">
                    X ⪰ 0 (drop rank constraint)
                </div>
                <p>Key technique for relaxing combinatorial problems to SDP.</p>
            </div>

            <div class="modern-card" style="padding: 20px; margin-bottom: 20px;">
                <h4>3. Reformulation Decision Tree</h4>

                <div style="padding: 20px; background: var(--panel); border-radius: 8px; font-family: monospace; line-height: 2;">
                    Problem type?<br>
                    ├─ Contains |·|, max, min → <strong style="color: var(--brand);">Reformulate to LP</strong><br>
                    │  ├─ Absolute value → split with auxiliary variables<br>
                    │  ├─ max/min → epigraph form with linear constraints<br>
                    │  └─ ℓ₁, ℓ∞ norms → LP reformulation<br>
                    │<br>
                    ├─ Contains ||·||₂² → <strong style="color: var(--brand);">QP</strong><br>
                    │  ├─ Least-squares: expand and identify P = AᵀA<br>
                    │  └─ If P ⪰ 0: convex QP<br>
                    │<br>
                    ├─ Contains ||·||₂ → <strong style="color: var(--brand);">SOCP</strong><br>
                    │  ├─ Already in standard form!<br>
                    │  ├─ Quadratic constraints → Cholesky factorization<br>
                    │  └─ Robust LP → uncertainty ellipsoid<br>
                    │<br>
                    ├─ Contains X ⪰ 0 → <strong style="color: var(--brand);">SDP</strong><br>
                    │  ├─ Already in standard form if linear objective<br>
                    │  ├─ Combinatorial → rank-1 relaxation<br>
                    │  └─ Control problems → LMI formulation<br>
                    │<br>
                    └─ Non-convex → Consider relaxation or approximation
                </div>
            </div>

            <div class="modern-card" style="padding: 20px;">
                <h4>4. Important Reformulation Examples</h4>

                <h5 style="margin-top: 15px;">Compressed Sensing (ℓ₁ minimization)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0;">
                    <strong>Original:</strong> minimize ||x||₁ subject to Ax = b<br>
                    <strong>Reformulation:</strong> Introduce t with |xᵢ| ≤ tᵢ → LP with 2n extra constraints
                </div>

                <h5 style="margin-top: 15px;">Support Vector Machine (SVM)</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0;">
                    <strong>Original:</strong> min ||w||₂² s.t. yᵢ(wᵀxᵢ + b) ≥ 1<br>
                    <strong>Form:</strong> Already convex QP! P = I, linear constraints
                </div>

                <h5 style="margin-top: 15px;">Robust Optimization</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0;">
                    <strong>Original:</strong> min cᵀx s.t. aᵀx ≤ b ∀a ∈ ε<br>
                    <strong>Reformulation:</strong> If ε is ellipsoid → SOCP; if polytope → LP
                </div>

                <h5 style="margin-top: 15px;">MAXCUT Relaxation</h5>
                <div style="padding: 15px; background: var(--panel); border-radius: 8px; margin: 10px 0;">
                    <strong>Original:</strong> max Σ wᵢⱼ(1-xᵢxⱼ)/2, xᵢ ∈ {±1}<br>
                    <strong>Relaxation:</strong> Let X = xxᵀ, relax to X ⪰ 0 → SDP<br>
                    <strong>Result:</strong> 0.878-approximation algorithm!
                </div>
            </div>
        </div>
    `;

    // Initialize
    renderReformulation('l1_norm');
}
