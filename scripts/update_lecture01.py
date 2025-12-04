import re

def update_lecture01():
    filepath = 'topics/01-introduction/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    recaps = {
        'P1.1': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Convexity Rules:</b> Norms are convex. Affine constraints define convex sets. Maximizing a convex function (or minimizing a concave one) is generally non-convex.</li>
            <li><b>Integer Constraints:</b> Discrete sets like $\{0, 1\}$ are never convex, making problems NP-hard (Combinatorial Optimization).</li>
            <li><b>PSD Requirement:</b> Quadratic forms $x^\top Q x$ are only convex if $Q \succeq 0$. Indefinite $Q$ creates saddle points.</li>
        </ul>
      </div>""",
        'P1.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Sum of Convex Functions:</b> The objective is a sum of squared norms. Since norm squared is convex and sum preserves convexity, the problem is convex.</li>
            <li><b>Geometric Interpretation:</b> This is related to the Fermat-Weber problem (minimizing sum of distances), but using squared Euclidean distance makes it a simple Quadratic Program (finding the centroid).</li>
        </ul>
      </div>""",
        'P1.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Epigraph Transformation:</b> Minimizing a norm $\|y\|_1$ is equivalent to minimizing $\sum t_i$ subject to $|y_i| \le t_i$.</li>
            <li><b>Linearization:</b> Absolute values and infinity norms are piecewise linear convex functions, so they can always be converted to Linear Programs (LPs).</li>
        </ul>
      </div>""",
        'P1.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Definition of Convex Set:</b> Contains the line segment between any two points.</li>
            <li><b>Intersection Property:</b> The feasible set is the intersection of sublevel sets of convex functions (inequalities) and hyperplanes (equalities). Since intersections of convex sets are convex, $\mathcal{F}$ is convex.</li>
        </ul>
      </div>""",
        'P1.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Strict Convexity:</b> The chord lies strictly above the function graph.</li>
            <li><b>Uniqueness:</b> If there were two global minima, the midpoint would have a strictly lower value, which is impossible. Thus, the solution is unique.</li>
        </ul>
      </div>""",
        'P1.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Concavity of Log-Likelihood:</b> In exponential families, the log-likelihood is concave. Minimizing the negative log-likelihood (NLL) is a convex problem.</li>
            <li><b>Logistic Loss:</b> The function $f(z) = \log(1+e^z)$ is convex. This ensures that logistic regression has no local minima.</li>
        </ul>
      </div>"""
    }

    for pid, recap_html in recaps.items():
        header_pattern = re.compile(f'(<h3>{pid}.*?</h3>)', re.DOTALL)
        match = header_pattern.search(content)
        if match:
            start_idx = match.end()
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
    update_lecture01()
