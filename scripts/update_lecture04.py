import re

def update_lecture04():
    filepath = 'topics/04-convex-opt-problems/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    recaps = {
        'P4.1': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Convexity Rules:</b> The objective $\max_i |a_i^\top x - b_i|$ is a composition of convex functions (affine $\to$ absolute value $\to$ max), so it is convex.</li>
            <li><b>Epigraph Transformation:</b> Minimizing a maximum ($t \ge \max f_i$) is equivalent to minimizing $t$ subject to $f_i \le t$ for all $i$.</li>
        </ul>
      </div>""",
        'P4.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Standard QP Form:</b> $\min \frac{1}{2}x^\top P x + q^\top x$ s.t. $Gx \le h, Ax = b$.</li>
            <li><b>Strict Convexity:</b> A QP is strictly convex if $P \succ 0$ (positive definite). For least squares, $P = 2A^\top A$, so strict convexity requires $A$ to have full column rank.</li>
        </ul>
      </div>""",
        'P4.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>SOCP Definition:</b> Minimizing a linear objective subject to Second-Order Cone constraints $\|Ax+b\|_2 \le c^\top x + d$.</li>
            <li><b>Norm Handling:</b> To minimize a sum of norms $\sum \|A_i x\|$, introduce slack variables $t_i$ and constraints $\|A_i x\| \le t_i$.</li>
        </ul>
      </div>""",
        'P4.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>LMI Representation:</b> The constraint $\lambda_{\max}(A) \le t$ is equivalent to the Linear Matrix Inequality $tI - A \succeq 0$.</li>
            <li><b>SDP Duality:</b> The dual of minimizing the max eigenvalue involves the trace inner product and a PSD matrix variable with trace 1 (a density matrix).</li>
        </ul>
      </div>""",
        'P4.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>QCQP:</b> Quadratic constraints are convex only if the matrix is PSD.</li>
            <li><b>SOCP equivalence:</b> A convex quadratic constraint $x^\top P x \le t$ can always be written as $\|P^{1/2}x\|_2 \le \sqrt{t}$ (if $t$ is constant) or rotated SOC constraints.</li>
        </ul>
      </div>""",
        'P4.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>L1 Reformulation:</b> $|x| \le t \iff -t \le x \le t$. This splits one non-linear constraint into two linear ones.</li>
            <li><b>Sparse Solutions:</b> While the LP formulation doesn't explicitly show "corners", the geometry of the feasible set (polytope) ensures vertex solutions, which often correspond to sparse vectors in $\ell_1$ problems.</li>
        </ul>
      </div>""",
        'P4.7': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Quasiconvexity:</b> Sublevel sets are convex. For linear-fractional functions, $f(x) \le t \iff c^\top x + d \le t(e^\top x + f)$, which is linear in $x$ for fixed $t$.</li>
            <li><b>Bisection Method:</b> A robust algorithm for quasiconvex problems. It solves a sequence of convex feasibility problems to bracket the optimal value.</li>
        </ul>
      </div>""",
        'P4.8': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Geometric Volume:</b> The volume of $\{x \mid \|Ax\| \le 1\}$ is proportional to $\det(A^{-1})$.</li>
            <li><b>Log-Det Concavity:</b> $\log \det X$ is a barrier function for the PSD cone. Maximizing it (or minimizing $-\log \det$) pushes the matrix away from singularity.</li>
        </ul>
      </div>""",
        'P4.9': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Concave Utility:</b> Diminishing returns ($\log x$, $\sqrt{x}$) lead to concave utility functions.</li>
            <li><b>Separable Objective:</b> The objective is a sum of functions of single variables $\sum f_i(x_i)$. This structure is computationally favorable (e.g., for distributed optimization).</li>
        </ul>
      </div>""",
        'P4.10': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Projective Transformation:</b> The change of variables $y = x/t, z = 1/t$ linearizes the ratio. This is the "homogenization" trick in projective geometry.</li>
            <li><b>Constraint Mapping:</b> Linear constraints on $x$ map to linear constraints on $y, z$.</li>
        </ul>
      </div>""",
        'P4.11': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Scalarization:</b> Converting a vector problem to a scalar one via weighted sum is a standard technique.</li>
            <li><b>Sufficiency vs Necessity:</b> Minimizing weighted sums (with positive weights) always finds a Pareto point. For convex problems, <i>every</i> Pareto point can be found this way (necessity).</li>
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
    update_lecture04()
