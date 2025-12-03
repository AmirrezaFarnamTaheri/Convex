import re
import os

# Define the new content for Section 2: Canonical Convex Sets
section_2_content = r"""
      <section class="card-v2" id="section-2">
        <h2>2. Canonical Convex Sets: Building Blocks</h2>

        <p>These fundamental convex sets appear repeatedly in optimization formulations. Recognizing them is essential for problem classification.</p>

        <h3>2.1 Hyperplanes and Halfspaces</h3>

        <p>A <a href="#" class="definition-link">hyperplane</a> is a set of the form:</p>
        $$
        H = \{x \in \mathbb{R}^n \mid a^\top x = b\}
        $$
        <p>where $a \in \mathbb{R}^n \setminus \{0\}$ and $b \in \mathbb{R}$. The vector $a$ is the <b>normal vector</b> (perpendicular to the hyperplane).</p>

        <div class="theorem-box">
          <h4>Geometric Interpretation</h4>
          <p>A hyperplane is an affine set of dimension $n-1$. It can be viewed as:</p>
          <ul>
            <li>The solution set of a single linear equation.</li>
            <li>A linear subspace ($a^\top x = 0$) translated by some vector $x_0$ (where $a^\top x_0 = b$).</li>
          </ul>
        </div>

        <p>A <a href="#" class="definition-link">halfspace</a> is a set of the form:</p>
        $$
        H^- = \{x \in \mathbb{R}^n \mid a^\top x \le b\}
        $$
        <p>This is the region on one side of the hyperplane. The complement halfspace is $H^+ = \{x \mid a^\top x \ge b\}$.</p>

        <div class="proof-enhanced">
          <h4>Proof: Hyperplanes and Halfspaces are Convex</h4>

          <div class="proof-step">
            <strong>Hyperplane:</strong> Take $x_1, x_2 \in H$ and $\theta \in [0,1]$. Then:
            $$
            a^\top(\theta x_1 + (1-\theta)x_2) = \theta a^\top x_1 + (1-\theta)a^\top x_2 = \theta b + (1-\theta)b = b
            $$
            So the entire segment lies in $H$.
          </div>

          <div class="proof-step">
            <strong>Halfspace:</strong> Take $x_1, x_2 \in H^-$ (so $a^\top x_i \le b$) and $\theta \in [0,1]$. Then:
            $$
            a^\top(\theta x_1 + (1-\theta)x_2) = \theta a^\top x_1 + (1-\theta)a^\top x_2 \le \theta b + (1-\theta)b = b
            $$
            So the segment lies in $H^-$.
          </div>

          <div class="proof-step">
            <strong>Alternate View (Preimage):</strong> Define the linear function $f(x) = a^\top x$. Then $H^- = f^{-1}((-\infty, b])$. Since $(-\infty, b]$ is a convex interval in $\mathbb{R}$ and preimages of convex sets under affine maps are convex, $H^-$ is convex.
          </div>
        </div>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/hyperplane-halfspace.png"
               alt="A 3D visualization of a hyperplane dividing space into two halfspaces"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 2.1:</i> A hyperplane (transparent plane) divides $\mathbb{R}^3$ into two halfspaces. The normal vector $a$ determines the orientation.</figcaption>
        </figure>

        <h3>2.2 Norm Balls and Ellipsoids</h3>

        <p>A <a href="#" class="definition-link" data-term="norm ball">norm ball</a> centered at $x_c$ with radius $r$ is:</p>
        $$
        B(x_c, r) = \{x \in \mathbb{R}^n \mid \|x - x_c\| \le r\}
        $$
        <p>where $\|\cdot\|$ is any norm. All norm balls are convex (by the triangle inequality).</p>

        <div class="theorem-box">
          <h4>Proof: Norm Balls are Convex</h4>
          <p>Let $x, y \in B(x_c, r)$ and $\theta \in [0,1]$. Then $\|x - x_c\| \le r$ and $\|y - x_c\| \le r$.</p>
          $$
          \begin{aligned}
          \|(\theta x + (1-\theta)y) - x_c\| &= \|\theta(x - x_c) + (1-\theta)(y - x_c)\| \\
          &\le \theta\|x - x_c\| + (1-\theta)\|y - x_c\| \\
          &\le \theta r + (1-\theta)r = r
          \end{aligned}
          $$
          <p>Thus the convex combination is in the ball.</p>
        </div>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="../../topics/00-linear-algebra-primer/assets/norm-balls.png"
               alt="Comparison of unit balls for L1, L2, and L-infinity norms"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 2.2:</i> Unit balls for different norms in $\mathbb{R}^2$: $L_1$ (diamond), $L_2$ (circle), and $L_\infty$ (square). All are convex sets.</figcaption>
        </figure>

        <p>An <a href="#" class="definition-link">ellipsoid</a> is a generalized Euclidean ball, defined as:</p>
        $$
        \mathcal{E} = \{x \in \mathbb{R}^n \mid (x - x_c)^\top P^{-1} (x - x_c) \le 1\}
        $$
        <p>where $P \in \mathbb{S}^n_{++}$ (symmetric positive definite). $P$ determines the shape and orientation.</p>

        <div class="insight">
          <h4>Geometric Interpretation via Eigendecomposition</h4>
          <p>Let $P = Q \Lambda Q^\top$ be the eigendecomposition of $P$, where $\Lambda = \text{diag}(\lambda_1, \dots, \lambda_n)$. The semi-axes of the ellipsoid are aligned with the eigenvectors $q_i$ (columns of $Q$) and have lengths $\sqrt{\lambda_i}$.</p>
          <p>Alternatively, an ellipsoid is the image of the unit Euclidean ball under an affine mapping: $\mathcal{E} = f(B(0,1))$ where $f(u) = P^{1/2}u + x_c$. Since affine maps preserve convexity, ellipsoids are convex.</p>
        </div>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/ellipsoid-axes.png"
               alt="Anatomy of an ellipsoid showing principal axes aligned with eigenvectors"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 2.3:</i> An ellipsoid is defined by a PSD matrix $P$. Its principal axes align with the eigenvectors of $P$, and their lengths are the square roots of the eigenvalues.</figcaption>
        </figure>

        <div class="widget-container" style="margin: 24px 0;">
          <h3 style="margin-top: 0;">Interactive Explorer: Ellipsoid Geometry</h3>
          <p><b>See How PSD Matrices Define Ellipsoids:</b> An ellipsoid is defined by $\{x \mid (x-x_c)^\top P^{-1} (x-x_c) \le 1\}$ where $P \succ 0$. This tool lets you:</p>
          <ul style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
            <li><b>Adjust matrix P:</b> Modify the PSD matrix entries and watch the ellipsoid reshape in real-time</li>
            <li><b>Visualize eigenvectors:</b> The principal axes align with eigenvectors of $P$</li>
            <li><b>Observe eigenvalue effects:</b> Axis lengths are proportional to $\sqrt{\lambda_i}$ where $\lambda_i$ are eigenvalues</li>
          </ul>
          <div id="widget-ellipsoid-explorer" style="width: 100%; height: 400px; position: relative;"></div>
        </div>

        <h3>2.3 Polyhedra</h3>

        <p>A <a href="#" class="definition-link">polyhedron</a> is the solution set of finitely many linear inequalities and equalities:</p>
        $$
        \mathcal{P} = \{x \in \mathbb{R}^n \mid Ax \le b, \ Cx = d\}
        $$
        <p>Geometrically, a polyhedron is the intersection of a finite number of halfspaces and hyperplanes.</p>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/polyhedron-construction.png"
               alt="A polyhedron formed by the intersection of multiple halfspaces"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 2.4:</i> A polyhedron (central solid region) is formed by intersecting multiple halfspaces. Each face corresponds to one linear inequality constraint.</figcaption>
        </figure>

        <div class="proof-enhanced">
          <h4>Convexity of Polyhedra</h4>
          <p>Since halfspaces and hyperplanes are convex sets, and the intersection of any collection of convex sets is convex (see Section 3), a polyhedron is convex.</p>
        </div>

        <p>A <a href="#" class="definition-link">polytope</a> is a bounded polyhedron. Equivalently, it is the convex hull of a finite set of points.</p>

        <div class="widget-container" style="margin: 24px 0;">
          <h3 style="margin-top: 0;">Interactive Visualizer: Polyhedron Builder</h3>
          <p><b>Build Feasible Regions from Constraints:</b> A polyhedron is the intersection of finitely many halfspaces. This tool brings LP feasible sets to life:</p>
          <ul style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
            <li><b>Add constraints one at a time:</b> Drag to define linear inequalities $a^\top x \le b$</li>
            <li><b>Visualize normals:</b> See the normal vector $a$ pointing <i>out</i> of the feasible region</li>
            <li><b>Watch the intersection:</b> As you add constraints, see how the feasible region is carved out of the plane</li>
          </ul>
          <div id="widget-polyhedron-visualizer" style="width: 100%; height: 520px; position: relative;"></div>
        </div>

        <h3>2.4 The Positive Semidefinite (PSD) Cone</h3>

        <p>The set of symmetric positive semidefinite matrices is a central object in modern convex optimization (SDP):</p>
        $$
        \mathbb{S}^n_+ = \{X \in \mathbb{S}^n \mid X \succeq 0\}
        $$
        <p>where $X \succeq 0$ means $z^\top X z \ge 0$ for all vectors $z \in \mathbb{R}^n$.</p>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/psd-cone-3d.png"
               alt="Visualization of the 2x2 PSD cone in 3D space"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 2.5:</i> The cone of $2 \times 2$ PSD matrices visualized in 3D space (axes are the matrix entries $x, y, z$). It is a convex cone with a specific "ice-cream" like shape but with a flat boundary structure.</figcaption>
        </figure>

        <div class="proof-enhanced">
          <h4>Proof: The PSD Cone is Convex</h4>
          <p>We need to show that if $A, B \in \mathbb{S}^n_+$ and $\theta \in [0,1]$, then $\theta A + (1-\theta)B \in \mathbb{S}^n_+$.</p>
          <div class="proof-step">
            <strong>Definition Check:</strong> Let $z \in \mathbb{R}^n$ be any vector.
            $$
            z^\top (\theta A + (1-\theta)B) z = \theta (z^\top A z) + (1-\theta) (z^\top B z)
            $$
          </div>
          <div class="proof-step">
            <strong>Sign Analysis:</strong> Since $A, B \succeq 0$, we know $z^\top A z \ge 0$ and $z^\top B z \ge 0$. Since $\theta \in [0,1]$, both coefficients are non-negative.
          </div>
          <div class="proof-step">
            <strong>Conclusion:</strong> The sum is non-negative, so $z^\top (\theta A + (1-\theta)B) z \ge 0$ for all $z$. Thus the combination is PSD.
          </div>
        </div>
      </section>
"""

# Define the new content for Section 3.1: Intersection (Updated with example)
section_3_1_content = r"""
        <h3>3.1 Intersection</h3>

        <div class="theorem-box">
          <h4>Theorem (Intersection Preserves Convexity)</h4>
          <p>The intersection of any collection (finite or infinite) of convex sets is convex.</p>
          $$ C = \bigcap_{i \in I} C_i $$
        </div>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/convex-intersection.png"
               alt="Venn diagram showing the intersection of two convex sets is convex"
               style="max-width: 60%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 3.1:</i> The intersection of two convex sets (blue and yellow) is the green region. Note that while the union is not necessarily convex, the intersection always is.</figcaption>
        </figure>

        <div class="proof-enhanced">
          <h4>Proof</h4>
          <div class="proof-step">
            Let $x, y \in C$. By definition, $x \in C_i$ and $y \in C_i$ for all $i \in I$.
          </div>
          <div class="proof-step">
            Since each $C_i$ is convex, $\theta x + (1-\theta)y \in C_i$ for all $i \in I$.
          </div>
          <div class="proof-step">
            Therefore, $\theta x + (1-\theta)y \in \bigcap_{i \in I} C_i = C$.
          </div>
        </div>

        <div class="example">
          <h4>Advanced Example: Trigonometric Polynomials</h4>
          <p>Consider the set of coefficients $x \in \mathbb{R}^m$ such that the trigonometric polynomial $p_x(t) = \sum_{k=1}^m x_k \cos(kt)$ is bounded by 1 on an interval:</p>
          $$
          S = \{x \in \mathbb{R}^m \mid |p_x(t)| \le 1 \text{ for all } |t| \le \pi/3\}
          $$
          <p>This set can be written as an infinite intersection of halfspaces:</p>
          $$
          S = \bigcap_{|t| \le \pi/3} \{x \mid -1 \le c(t)^\top x \le 1\}
          $$
          <p>where $c(t) = (\cos(t), \dots, \cos(mt))$. Since each constraint defines a convex "slab" (intersection of two halfspaces), the infinite intersection $S$ is convex.</p>
        </div>

        <div class="row" style="display: flex; gap: 20px; justify-content: center; margin: 24px 0;">
            <figure style="text-align: center; flex: 1;">
              <img src="assets/trig-poly-intersection.png"
                   alt="Plot of the convex set of bounded trigonometric polynomials"
                   style="width: 100%; height: auto; border-radius: 8px;" />
              <figcaption><i>Figure 3.2:</i> The set $S$ defined by infinite constraints.</figcaption>
            </figure>
            <figure style="text-align: center; flex: 1;">
              <img src="assets/gonzo-shape.png"
                   alt="Visualizing the intersection of infinite halfspaces"
                   style="width: 100%; height: auto; border-radius: 8px;" />
              <figcaption><i>Figure 3.3:</i> The smooth convex "safe zone" formed by tangent hyperplanes.</figcaption>
            </figure>
        </div>
"""

# Define the new content for Section 5: Cones, Proper Cones, and Dual Cones
section_5_content = r"""
      <section class="card-v2" id="section-5">
        <h2>5. Cones, Proper Cones, and Dual Cones</h2>

        <h3>5.1 Cones and Convex Cones</h3>

        <p>A set $K \subseteq \mathbb{R}^n$ is a <a href="#" class="definition-link">cone</a> if it is closed under non-negative scaling:</p>
        $$ x \in K, \ \alpha \ge 0 \implies \alpha x \in K $$

        <p>A <a href="#" class="definition-link">convex cone</a> is a cone that is also a convex set. Equivalently, it is closed under non-negative linear combinations:</p>
        $$ x, y \in K, \ \alpha, \beta \ge 0 \implies \alpha x + \beta y \in K $$

        <div class="example">
            <h4>Examples of Convex Cones</h4>
            <ul>
                <li><b>Non-negative orthant:</b> $\mathbb{R}^n_+ = \{x \in \mathbb{R}^n \mid x_i \ge 0\}$</li>
                <li><b>Second-order cone (Lorentz cone):</b> $\mathcal{Q}^{n+1} = \{(x, t) \in \mathbb{R}^{n+1} \mid \|x\|_2 \le t\}$</li>
                <li><b>PSD Cone:</b> $\mathbb{S}^n_+ = \{X \in \mathbb{S}^n \mid X \succeq 0\}$</li>
            </ul>
        </div>

        <figure style="text-align: center; margin: 24px 0;">
          <img src="assets/second-order-cone.png"
               alt="3D visualization of the second-order cone (ice cream cone)"
               style="max-width: 50%; height: auto; border-radius: 8px;" />
          <figcaption><i>Figure 5.1:</i> The Second-Order Cone in $\mathbb{R}^3$, often called the "ice-cream cone".</figcaption>
        </figure>

        <h3>5.2 Proper Cones</h3>

        <p>A <a href="#" class="definition-link">proper cone</a> is a convex cone $K$ that satisfies three additional properties:</p>
        <ol>
          <li><b>Closed:</b> $K$ contains its boundary.</li>
          <li><b>Pointed:</b> $K$ contains no lines ($K \cap -K = \{0\}$).</li>
          <li><b>Solid:</b> $K$ has a non-empty interior.</li>
        </ol>

        <p>Proper cones are geometrically "sharp" (pointed) and "full-dimensional" (solid). They are used to define generalized inequalities.</p>

        <h3>5.3 Generalized Inequalities</h3>

        <p>A proper cone $K$ defines a partial ordering $\preceq_K$ on $\mathbb{R}^n$:</p>
        $$
        x \preceq_K y \iff y - x \in K
        $$
        <p>Strict inequality is defined using the interior of the cone:</p>
        $$
        x \prec_K y \iff y - x \in \text{int}(K)
        $$

        <div class="theorem-box">
          <h4>Properties of Generalized Inequalities</h4>
          <ul>
            <li><b>Reflexive:</b> $x \preceq_K x$</li>
            <li><b>Antisymmetric:</b> $x \preceq_K y \text{ and } y \preceq_K x \implies x = y$</li>
            <li><b>Transitive:</b> $x \preceq_K y \text{ and } y \preceq_K z \implies x \preceq_K z$</li>
            <li><b>Additivity:</b> $x \preceq_K y \implies x + u \preceq_K y + u$</li>
          </ul>
        </div>

        <h3>5.4 The Dual Cone</h3>

        <p>The <a href="#" class="definition-link">dual cone</a> of a cone $K$ is the set of all vectors making a non-obtuse angle with every vector in $K$:</p>
        $$
        K^* = \{y \in \mathbb{R}^n \mid y^\top x \ge 0 \ \forall x \in K\}
        $$
        <p>The dual cone $K^*$ is always a closed convex cone, regardless of whether $K$ is convex or closed.</p>

        <div class="theorem-box">
            <h4>Important Dualities</h4>
            <ul>
                <li>$\mathbb{R}^n_+$ is <b>self-dual</b>: $(\mathbb{R}^n_+)^* = \mathbb{R}^n_+$</li>
                <li>$\mathbb{S}^n_+$ is <b>self-dual</b>: $(\mathbb{S}^n_+)^* = \mathbb{S}^n_+$ (under trace inner product)</li>
                <li>$\mathcal{Q}^{n+1}$ is <b>self-dual</b>: $(\mathcal{Q}^{n+1})^* = \mathcal{Q}^{n+1}$</li>
                <li>$(L_p \text{ norm cone})^* = L_q \text{ norm cone}$ where $1/p + 1/q = 1$.</li>
            </ul>
        </div>
      </section>
"""

file_path = 'topics/02-convex-sets/index.html'

with open(file_path, 'r') as f:
    content = f.read()

# Replace Section 2
pattern_sec2 = re.compile(r'<section class="card-v2" id="section-2">.*?</section>', re.DOTALL)
# Use a function for replacement to avoid interpreting escape sequences in the replacement string
content = pattern_sec2.sub(lambda m: section_2_content, content)

# Replace Section 3.1
pattern_sec3_1 = re.compile(r'<h3>3.1 Intersection</h3>.*?(?=<h3>3.2)', re.DOTALL)
content = pattern_sec3_1.sub(lambda m: section_3_1_content, content)

# Replace Section 5
pattern_sec5 = re.compile(r'<section class="card-v2" id="section-5">.*?</section>', re.DOTALL)
content = pattern_sec5.sub(lambda m: section_5_content, content)

with open(file_path, 'w') as f:
    f.write(content)

print(f"Successfully refactored {file_path}")
