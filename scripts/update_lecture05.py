import re

def update_lecture05():
    filepath = 'topics/05-duality/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    recaps = {
        'P5.1': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Conjugate Relation:</b> The dual function of a QP is related to the conjugate of the quadratic objective. Specifically, $\inf (x^\top P x + c^\top x) = -\sup (-x^\top P x - c^\top x)$.</li>
            <li><b>Unconstrained Dual:</b> Equality constrained QPs often have unconstrained duals (maximization over $\nu \in \mathbb{R}^p$).</li>
        </ul>
      </div>""",
        'P5.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Stationarity:</b> The gradient of the objective must be cancelled by a non-negative linear combination of constraint gradients.</li>
            <li><b>Active Set:</b> The constraint $x_1+x_2 \ge 1$ is active (tight), so its multiplier $\lambda_1$ can be positive. The non-negativity constraints are inactive, so their multipliers must be zero.</li>
        </ul>
      </div>""",
        'P5.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Standard LP Dual:</b> The dual of $\min c^\top x$ s.t. $Ax \ge b, x \ge 0$ is $\max b^\top y$ s.t. $A^\top y \le c, y \ge 0$.</li>
            <li><b>Strong Duality:</b> For LPs, if a feasible solution exists, strong duality holds (unless both are infeasible).</li>
        </ul>
      </div>""",
        'P5.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Slater's Necessity:</b> Without a strictly feasible point, strong duality is not guaranteed, even for convex problems.</li>
            <li><b>Constraint Geometry:</b> The constraint $(x-1)^2 \le 0$ forces $x=1$ (a single point). It behaves like an equality constraint but without the dual variable freedom of an equality constraint.</li>
        </ul>
      </div>""",
        'P5.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Economic Interpretation:</b> $\lambda_i^*$ is the marginal price of the resource represented by constraint $i$.</li>
            <li><b>Sensitivity:</b> $p^*(u) \approx p^*(0) - \lambda^* u$. Relaxing the constraint ($u>0$) decreases the cost.</li>
        </ul>
      </div>""",
        'P5.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Representer Theorem:</b> The optimal weight vector $w$ is a linear combination of support vectors: $w = \sum \alpha_i y_i x_i$.</li>
            <li><b>Kernel Trick:</b> The dual problem depends only on inner products $x_i^\top x_j$, allowing replacement with kernels $K(x_i, x_j)$.</li>
        </ul>
      </div>""",
        'P5.7': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Reduced Cost:</b> The value $\lambda_3$ represents the "reduced cost" of asset 3. It measures how much the objective would improve if we forced a small investment in asset 3. Since it wasn't chosen, its marginal contribution was insufficient.</li>
            <li><b>Zero Investment:</b> $x_i^*=0 \implies$ constraint active $\implies \lambda_i^* \ge 0$.</li>
        </ul>
      </div>""",
        'P5.8': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Geometric Programming:</b> The dual of entropy maximization is related to the dual of geometric programming (Log-Sum-Exp).</li>
            <li><b>Exponential Families:</b> In statistics, this duality relates maximum likelihood estimation (primal) to moment matching (dual constraints).</li>
        </ul>
      </div>""",
        'P5.9': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Lagrange Multiplier for PSD:</b> The multiplier for $X \succeq 0$ is a PSD matrix $S \succeq 0$. The term in Lagrangian is $-\mathrm{tr}(SX)$.</li>
            <li><b>Standard SDP Pair:</b> Primal minimizes $\mathrm{tr}(CX)$, Dual maximizes $b^\top y$. Primal constraints are linear equations on $X$, Dual constraints are LMIs on $y$.</li>
        </ul>
      </div>"""
    }

    for pid, recap_html in recaps.items():
        header_pattern = re.compile(f'(<h3>{pid}.*?</h3>)', re.DOTALL)
        match = header_pattern.search(content)
        if match:
            start_idx = match.end()
            # Look for solution div
            sol_match = re.search(r'<div class="(solution|proof|solution-enhanced)">', content[start_idx:])

            if sol_match:
                insert_pos = start_idx + sol_match.start()
                content = content[:insert_pos] + recap_html + "\n\n" + content[insert_pos:]
            else:
                print(f"Warning: Could not find solution block for {pid}")
        else:
            print(f"Warning: Could not find header for {pid}")

    with open(filepath, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_lecture05()
