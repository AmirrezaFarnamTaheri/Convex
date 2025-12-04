import re

def update_lecture02():
    filepath = 'topics/02-convex-sets/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    recaps = {
        'P2.1': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Bisector Geometry:</b> The set of points closer to $x_0$ than $y_0$ is a halfspace. The boundary is the perpendicular bisector of the segment $[x_0, y_0]$.</li>
            <li><b>Algebraic Verification:</b> Expanding $\|x - x_0\|^2 \le \|x - y_0\|^2$ always cancels the quadratic term $x^\top x$, leaving a linear inequality.</li>
        </ul>
      </div>""",
        'P2.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Linear vs. Conic Dual:</b> For a subspace, the dual cone is the orthogonal complement. The "non-negative" requirement of the dual cone forces equality because subspaces are closed under negation.</li>
            <li><b>Geometric Intuition:</b> A subspace is "flat". The only vectors making a non-negative angle with <i>every</i> direction in a plane are those perpendicular to it.</li>
        </ul>
      </div>""",
        'P2.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Sublevel Sets:</b> The sublevel set $\{x \mid f(x) \le 0\}$ of a convex function $f$ is always a convex set.</li>
            <li><b>Hessian Condition:</b> For a quadratic $f(x) = x^\top Q x + c^\top x + d$, convexity is determined solely by $Q \succeq 0$.</li>
        </ul>
      </div>""",
        'P2.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Relative Interior Definition:</b> Points in the set that are not on the "edge" relative to the affine hull.</li>
            <li><b>Simplex Geometry:</b> The standard simplex lies in the hyperplane $\sum x_i = 1$. Its relative interior consists of strictly positive probability distributions.</li>
        </ul>
      </div>""",
        'P2.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Constructive Separation:</b> The projection theorem provides an explicit construction for the separating hyperplane between a point and a closed convex set.</li>
            <li><b>Normal Vector:</b> The separating normal is simply the error vector $y - \Pi_C(y)$.</li>
        </ul>
      </div>""",
        'P2.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Self-Duality:</b> The Lorentz cone $\mathcal{Q}$ is its own dual. This is a special property shared by the non-negative orthant and the PSD cone.</li>
            <li><b>Proof Strategy:</b> Show $\mathcal{Q} \subseteq \mathcal{Q}^*$ using Cauchy-Schwarz, then show $\mathcal{Q}^* \subseteq \mathcal{Q}$ by contradiction or by choosing specific test vectors.</li>
        </ul>
      </div>""",
        'P2.7': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Sum and Intersection Duality:</b> The dual of a sum is the intersection of duals: $(K_1 + K_2)^* = K_1^* \cap K_2^*$.</li>
            <li><b>Analogy:</b> This is analogous to De Morgan's laws in logic or the fact that the support function of a sum is the sum of support functions.</li>
        </ul>
      </div>""",
        'P2.8': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Cone-Induced Ordering:</b> Every proper cone defines a partial order.</li>
            <li><b>Antisymmetry requires Pointedness:</b> If the cone contained a line (e.g., a half-plane), we could have $x \preceq y$ and $y \preceq x$ without $x=y$. Pointedness prevents this.</li>
        </ul>
      </div>""",
        'P2.9': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Voronoi Decomposition:</b> Space is partitioned into polyhedral regions based on the nearest neighbor rule.</li>
            <li><b>Intersection of Halfspaces:</b> The region closest to point $x_i$ is the intersection of all halfspaces defined by perpendicular bisectors between $x_i$ and neighbors $x_j$.</li>
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
    update_lecture02()
