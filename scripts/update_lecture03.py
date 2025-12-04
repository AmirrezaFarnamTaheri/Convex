import re

def update_lecture03():
    filepath = 'topics/03-convex-functions/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    # We update the regex to look for 'proof-enhanced' as well, which is what these use.
    recaps = {
        'P3.1': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Tangent Underestimator:</b> The first-order condition says that the tangent line always lies below the function graph.</li>
            <li><b>Inequality Source:</b> Many famous inequalities (like $e^x \ge 1+x$) are simply statements that a convex function lies above its tangent.</li>
        </ul>
      </div>""",
        'P3.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Curvature Test:</b> The Hessian matrix $\nabla^2 f(x)$ captures the local curvature. Positive semidefinite curvature everywhere ensures global convexity ("bowl shape").</li>
            <li><b>Constant Hessian:</b> Quadratic functions have constant curvature. If the curvature is "flat" ($2I$) everywhere, it's convex.</li>
        </ul>
      </div>""",
        'P3.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Composition Rules:</b> The standard rules (Convex + Increasing, etc.) are sufficient but not necessary.</li>
            <li><b>Direct Check:</b> When rules fail (e.g., Convex + Decreasing), always fall back to the definition or computing derivatives. Here, cancellation made the result linear.</li>
        </ul>
      </div>""",
        'P3.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Pointwise Maximum:</b> The maximum of any collection of convex functions is convex.</li>
            <li><b>Epigraph View:</b> The epigraph of the max is the intersection of the epigraphs of the individual functions. Intersection of convex sets is convex.</li>
        </ul>
      </div>""",
        'P3.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Strong Convexity:</b> Requires a uniform minimum curvature $m > 0$.</li>
            <li><b>Quadratic Bound:</b> $f(y) \ge f(x) + \nabla f(x)^\top(y-x) + \frac{m}{2}\|y-x\|^2$.</li>
            <li><b>Matrix Inequality:</b> $Q \succeq mI$ means $\lambda_{\min}(Q) \ge m$.</li>
        </ul>
      </div>""",
        'P3.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Legendre Transform:</b> For differentiable strictly convex functions, the conjugate is obtained by solving $\nabla f(x) = y$ for $x$.</li>
            <li><b>Self-Conjugacy:</b> The quadratic function $\frac{1}{2}\|x\|^2$ is the unique function (up to scaling) that is its own convex conjugate. This mirrors the Fourier transform property of Gaussians.</li>
        </ul>
      </div>""",
        'P3.7': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Sublevel Sets:</b> Quasi-convexity requires convex sublevel sets $S_\alpha$.</li>
            <li><b>Step Functions:</b> Monotonic functions (even discontinuous ones like ceiling) are quasi-convex (and quasi-concave).</li>
            <li><b>Jensen Failure:</b> Quasi-convexity does not satisfy the average value inequality (Jensen's).</li>
        </ul>
      </div>""",
        'P3.8': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Log-Sum-Exp:</b> This is a smooth approximation of the max function ($\text{LSE}(x) \approx \max_i x_i$). Since max is convex, LSE is convex.</li>
            <li><b>Hessian Structure:</b> The Hessian is the covariance matrix of the softmax probability distribution. Covariance matrices are always PSD.</li>
        </ul>
      </div>""",
        'P3.9': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Geometric Mean:</b> $G(x)$ is concave on the positive orthant. This is related to the AM-GM inequality.</li>
            <li><b>Log-Concavity:</b> Logarithm of geometric mean is arithmetic mean of logs (concave). Homogeneity + log-concavity implies concavity.</li>
        </ul>
      </div>""",
        'P3.10': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Superlevel Set of Concave:</b> The set $\{x \mid g(x) \ge 0\}$ is convex if $g$ is concave.</li>
            <li><b>Homogeneity implies Cone:</b> If the defining functions are homogeneous, the resulting set is a cone (scale invariant).</li>
        </ul>
      </div>""",
        'P3.11': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Joint Convexity:</b> The function is convex in $(x, Y)$ jointly, not just individually.</li>
            <li><b>Schur Complement:</b> The condition for epigraph convexity ($x^\top Y^{-1} x \le t$) converts directly to an LMI using Schur complements.</li>
        </ul>
      </div>""",
        'P3.12': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Secant Slope:</b> For a convex function, the slope of the secant lines is non-decreasing.</li>
            <li><b>Geometric Meaning:</b> As you move to the right, the function gets steeper (or less steep downwards). This monotonicity of slopes is equivalent to the non-negative second derivative.</li>
        </ul>
      </div>""",
        'P3.13': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Hermite-Hadamard Inequality:</b> This is the "right half" of the famous inequality: $f(\frac{a+b}{2}) \le \frac{1}{b-a}\int_a^b f(x)dx \le \frac{f(a)+f(b)}{2}$.</li>
            <li><b>Midpoint Convexity:</b> Convexity at the midpoint, combined with continuity, implies convexity everywhere.</li>
        </ul>
      </div>""",
        'P3.14': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Integral Transform:</b> The running average is a linear operator on functions.</li>
            <li><b>Perspective Argument:</b> The change of variables reveals $F(x)$ is an integral (sum) of perspective functions $f(sx) = f(x \cdot s)/1$, which preserves convexity. Actually, simple scaling $g_s(x)=f(sx)$ is enough.</li>
        </ul>
      </div>"""
    }

    for pid, recap_html in recaps.items():
        header_pattern = re.compile(f'(<h3>{pid}.*?</h3>)', re.DOTALL)
        match = header_pattern.search(content)
        if match:
            start_idx = match.end()
            # P3.9 to P3.14 use "proof-enhanced", P3.1 to P3.8 use "solution".
            # We used a generic regex last time but it failed for P3.9+ because they might have slightly different structure or I missed it.
            # Let's inspect P3.9 again.
            # It has <div class="proof-enhanced">.

            sol_match = re.search(r'<div class="(solution|proof-enhanced)">', content[start_idx:])

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
    update_lecture03()
