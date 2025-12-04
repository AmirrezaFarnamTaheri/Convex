import re

def update_lecture00():
    filepath = 'topics/00-linear-algebra-primer/index.html'
    with open(filepath, 'r') as f:
        content = f.read()

    # Dictionary mapping problem IDs to Recap HTML
    recaps = {
        'P0.2': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Vectorization Isomorphism:</b> The space of matrices $M_{m \times n}$ is isomorphic to $\mathbb{R}^{mn}$ via the vectorization operation $\mathrm{vec}(A)$.</li>
            <li><b>Frobenius Norm Compatibility:</b> Under this isomorphism, the Frobenius inner product $\langle A, B \rangle_F = \mathrm{tr}(A^\top B)$ corresponds exactly to the standard Euclidean dot product in $\mathbb{R}^{mn}$.</li>
            <li><b>Cauchy-Schwarz:</b> Since it is a valid inner product space, the standard Cauchy-Schwarz inequality applies.</li>
        </ul>
      </div>""",
        'P0.3': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Loewner Order:</b> The relation $A \succeq B$ (defined by $A - B \in \mathbb{S}^n_+$) is a partial order.</li>
            <li><b>Cone Property:</b> The set of PSD matrices forms a convex cone. A fundamental property of convex cones is that they are closed under addition ($X, Y \in K \implies X+Y \in K$). This ensures transitivity.</li>
        </ul>
      </div>""",
        'P0.4': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Affine vs. Linear:</b> Projection onto an affine set $Ax=b$ is equivalent to projecting onto the subspace $Ax=0$ after shifting the coordinate system.</li>
            <li><b>Shift-Project-Shift:</b> The general strategy is $x_{proj} = x_0 + \Pi_{\mathcal{N}(A)}(y - x_0)$.</li>
            <li><b>Explicit Formula:</b> For a hyperplane $a^\top x = b$, the projection is a simple geometric correction along the normal vector $a$.</li>
        </ul>
      </div>""",
        'P0.5': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Subspace Definition:</b> A subset is a subspace if it is closed under linear combinations (addition and scaling).</li>
            <li><b>Fundamental Orthogonality:</b> The row space and nullspace are orthogonal complements in $\mathbb{R}^n$. The column space and left nullspace are orthogonal complements in $\mathbb{R}^m$. This is the geometric heart of the Fundamental Theorem of Linear Algebra.</li>
        </ul>
      </div>""",
        'P0.6': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Normal Equations:</b> Arise from the condition $\nabla f(x) = 0$.</li>
            <li><b>Geometric Orthogonality:</b> The optimal residual $r = b - Ax^*$ is always orthogonal to the range of $A$.</li>
            <li><b>Numerical Stability:</b> While $A^\top A x = A^\top b$ is the theoretical solution, computing $A^\top A$ squares the condition number $\kappa$, leading to precision loss. QR and SVD are numerically superior.</li>
        </ul>
      </div>""",
        'P0.7': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>General Solution:</b> When $A$ has a nullspace, solutions are not unique. They form an affine set $x_{p} + \mathcal{N}(A)$.</li>
            <li><b>Pseudoinverse Role:</b> $A^+ b$ gives the specific solution that has the minimum Euclidean norm. It projects $b$ onto the range, then inverts the restriction of $A$.</li>
            <li><b>Projector Construction:</b> $P = AA^+$ projects onto the range, $I - AA^+$ projects onto the orthogonal complement (left nullspace).</li>
        </ul>
      </div>""",
        'P0.8': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Isometry:</b> Orthogonal matrices ($Q^\top Q = I$) preserve lengths and angles ($\|Qx\| = \|x\|$). They represent rotations or reflections.</li>
            <li><b>Projector Properties:</b> A matrix $P$ is an orthogonal projector if and only if it is symmetric ($P=P^\top$) and idempotent ($P^2=P$).</li>
            <li><b>Geometric Construction:</b> To project onto a span, form an orthogonal basis (or use the general formula with inverses).</li>
        </ul>
      </div>""",
        'P0.9': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Cyclic Property:</b> The trace is invariant under cyclic permutations: $\mathrm{tr}(ABC) = \mathrm{tr}(BCA)$. This is critical for matrix calculus.</li>
            <li><b>Commutators:</b> The trace of a commutator $[A, B] = AB - BA$ is always zero. This distinguishes matrix algebra from scalar algebra and has deep implications in physics and operator theory (e.g., Heisenberg Uncertainty Principle).</li>
        </ul>
      </div>""",
        'P0.10': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Matrix Space Geometry:</b> We can treat $m \times n$ matrices as vectors in a high-dimensional Euclidean space.</li>
            <li><b>Frobenius Norm:</b> This is the "Euclidean length" of the matrix entries. It is submultiplicative ($\|AB\| \le \|A\|\|B\|$), making it a matrix norm.</li>
            <li><b>Inner Product:</b> $\langle A, B \rangle = \mathrm{tr}(A^\top B)$ generalizes the dot product.</li>
        </ul>
      </div>""",
        'P0.11': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Operator Norm:</b> Defined as the maximum stretch factor $\sup \|Ax\|/\|x\|$.</li>
            <li><b>SVD Connection:</b> The operator norm equals the largest singular value $\sigma_1$.</li>
            <li><b>Spectral Radius:</b> For symmetric matrices, $\|A\|_2 = \rho(A) = \max |\lambda_i|$. For general matrices, $\|A\|_2 \ge \rho(A)$.</li>
        </ul>
      </div>""",
        'P0.12': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Orthogonal Invariance:</b> Rotating the domain or codomain does not change the "size" (norm) of a matrix. Both Frobenius and Spectral norms are unitarily invariant.</li>
            <li><b>Norm Comparison:</b> The Frobenius norm is always larger than or equal to the Spectral norm ($\|A\|_F \ge \|A\|_2$), but they are equivalent up to a factor of $\sqrt{\mathrm{rank}(A)}$.</li>
        </ul>
      </div>""",
        'P0.13': r"""
      <div class="recap-box" style="background: var(--surface-2); border: 1px dashed var(--primary-300); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="margin-top: 0; font-size: 0.9em; color: var(--primary-300); text-transform: uppercase; letter-spacing: 0.05em;">Recap & Key Concepts</h4>
        <ul style="margin: 8px 0 0 20px; font-size: 0.9em; color: var(--text-secondary);">
            <li><b>Compact Group:</b> The set of orthogonal matrices $O(n)$ is a compact Lie group. It is closed (preimage of closed set) and bounded (rows have unit norm).</li>
            <li><b>Rigidity:</b> Linear maps that preserve Euclidean structure (lengths or angles) are necessarily orthogonal transformations (rotations/reflections).</li>
        </ul>
      </div>"""
    }

    # Regex to find problem blocks and insert recaps
    # Pattern: <h3>P0.X ...</h3> ... (insertion point) ... <div class="proof-enhanced"> (or other start)
    # Actually, simpler to just find the H3 and insert after it, or after the <p><b>Problem:</b>...</p>

    for pid, recap_html in recaps.items():
        # Find the header
        header_pattern = re.compile(f'(<h3>{pid}.*?</h3>)', re.DOTALL)
        match = header_pattern.search(content)
        if match:
            # We want to insert AFTER the problem description.
            # Usually the problem description is in a <p> tag immediately following the H3,
            # OR the H3 itself is the start of the block.
            # Let's look for the <div class="proof-enhanced"> or <div class="solution-enhanced"> or <div class="problem"> and insert BEFORE it.

            # Strategy: Find the header. Then find the next occurrence of a solution/proof block.
            # Insert the recap before that block.

            # Find the start of the section for this problem
            start_idx = match.end()

            # Look for the next solution/proof div
            sol_match = re.search(r'<div class="(proof|solution)-enhanced">', content[start_idx:])

            if sol_match:
                insert_pos = start_idx + sol_match.start()
                # Insert the recap
                content = content[:insert_pos] + recap_html + "\n\n" + content[insert_pos:]
            else:
                print(f"Warning: Could not find solution block for {pid}")

        else:
            print(f"Warning: Could not find header for {pid}")

    # Write the updated content
    with open(filepath, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_lecture00()
