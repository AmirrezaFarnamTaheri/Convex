## Table of Contents

*   **Linear Algebra**
    *   [Introduction to Linear Algebra](#introduction-to-linear-algebra)
    *   [Gaussian Elimination](#gaussian-elimination)
    *   [Vector Spaces](#vector-spaces)
    *   [Eigenvalues and Eigenvectors](#eigenvalues-and-eigenvectors)
    *   [Singular Value Decomposition (SVD)](#singular-value-decomposition-svd)
*   **Calculus**
    *   [Limits and Continuity](#limits-and-continuity)
    *   [Derivatives](#derivatives)
    *   [Integrals](#integrals)
    *   [Taylor Series](#taylor-series)
*   **Probability and Statistics**
    *   [Basic Probability](#basic-probability)
    *   [Random Variables](#random-variables)
    *   [Common Distributions](#common-distributions)
    *   [Hypothesis Testing](#hypothesis-testing)
*   **Numerical Methods**
    *   [Floating-Point Arithmetic](#floating-point-arithmetic)
    *   [Root Finding](#root-finding)
    *   [Optimization](#optimization)
    *   [Monte Carlo Methods](#monte-carlo-methods)

---

## Detailed Lecture Notes

### Introduction to Linear Algebra
*   **Matrices and Vectors:** Understanding the basic building blocks of linear algebra.
*   **Matrix Operations:** Addition, subtraction, multiplication, and scalar multiplication.
*   **Linear Combinations:** The concept of combining vectors to form new vectors.
*   **Systems of Linear Equations:** Representing and solving systems of linear equations using matrices.

### Gaussian Elimination
*   **Row Echelon Form:** Transforming a matrix into a simplified form to solve linear systems.
*   **Pivoting:** A technique to improve numerical stability during Gaussian elimination.
*   **LU Decomposition:** Factoring a matrix into a product of lower and upper triangular matrices.

### Vector Spaces
*   **Subspaces:** Understanding subsets of vector spaces that are themselves vector spaces.
*   **Basis and Dimension:** The concept of a basis for a vector space and its dimension.
*   **Linear Independence:** Determining if a set of vectors is linearly independent.
*   **Change of Basis:** Transforming coordinates from one basis to another.

### Eigenvalues and Eigenvectors
*   **Characteristic Polynomial:** Finding the eigenvalues of a matrix by solving the characteristic equation.
*   **Eigenspaces:** The set of eigenvectors corresponding to an eigenvalue.
*   **Diagonalization:** Decomposing a matrix into a product of an invertible matrix and a diagonal matrix.

### Singular Value Decomposition (SVD)
*   **Geometric Interpretation:** Understanding the geometric meaning of SVD.
*   **Applications:** Image compression, principal component analysis (PCA), and recommendation systems.

---

## Common Widget Patterns
*   **Model-View-Controller (MVC):** Separating the application's data, user interface, and control logic.
*   **Observer Pattern:** A behavioral pattern where an object maintains a list of its dependents (observers) and notifies them of any state changes.
*   **Singleton Pattern:** Restricting the instantiation of a class to a single object.

---

## Backend Architecture
*   **Microservices:** A software development technique that structures an application as a collection of loosely coupled services.
*   **RESTful APIs:** A set of rules that developers follow when they create their API.
*   **Database Design:** The process of producing a detailed data model of a database.

---

## Advanced Topics
*   **Fourier Analysis:** Decomposing a function into a sum of simple oscillating functions.
*   **Wavelets:** A mathematical function used to divide a given function or continuous-time signal into different scale components.
*   **Tensor Calculus:** A generalization of vector calculus.

---

## Appendices
*   **Appendix A: Mathematical Notation**
*   **Appendix B: Further Reading**
*   **Appendix C: Glossary of Terms**

---

# Complete File Structure

Here is the final, complete directory structure with all files, placeholders, and organization:

```
convex-optimization-course/
│
├── index.html                          [Homepage: course intro, session list, search]
├── README.md                           [Setup instructions, contribution guide]
├── LICENSE                             [MIT or similar]
│
├── /content/
│   ├── lectures.json                   [Master list: 11 lectures with metadata]
│   ├── resources.json                  [Links: Boyd book, CVXPY, solvers, papers]
│   └── prerequisites.json              [LA primer links, background required per lecture]
│
├── /topics/
│   ├── 00-linear-algebra-primer/       [BONUS: Prerequisite material]
│   │   ├── index.html
│   │   ├── images/
│   │   │   ├── norms-inner-products.svg
│   │   │   ├── eigenvalues-psd.svg
│   │   │   ├── rank-nullity.svg
│   │   │   ├── quadratic-forms.svg
│   │   │   └── second-derivative-test.svg
│   │   └── widgets/
│   │       ├── js/
│   │       │   └── matrix-explorer.js  [Eigenvalue/PSD visualizer]
│   │       └── py/
│   │           └── [None yet]
│   │
│   ├── 01-introduction/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── convex-vs-nonconvex.js
│   │   │   │   └── landscape-viewer.js
│   │   │   └── py/
│   │   │       └── [None yet]
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── optimization-problem.svg
│   │       │   ├── convex-vs-nonconvex.svg
│   │       │   └── landscape-examples.svg
│   │       └── applications/
│   │           ├── portfolio.jpg
│   │           ├── ml-boundary.jpg
│   │           └── signal-processing.jpg
│   │
│   ├── 02-convex-sets/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── convex-set-checker.js
│   │   │   │   ├── ellipsoid-explorer.js
│   │   │   │   └── polyhedron-viz.js
│   │   │   └── py/
│   │   │       └── polyhedron-compute.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── affine-vs-convex.svg
│   │       │   ├── cone-definition.svg
│   │       │   ├── ball-ellipsoid.svg
│   │       │   ├── polyhedron-constraints.svg
│   │       │   └── separating-hyperplane.svg
│   │       └── examples/
│   │           └── convex-sets-gallery.png
│   │
│   ├── 03-convex-functions/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── jensen-visualizer.js
│   │   │   │   ├── hessian-explorer.js
│   │   │   │   └── operations-composer.js
│   │   │   └── py/
│   │   │       ├── function-analyzer.py
│   │   │       └── symbolic-derivatives.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── jensen-inequality.svg
│   │       │   ├── epigraph.svg
│   │       │   ├── first-order-characterization.svg
│   │       │   ├── second-order-characterization.svg
│   │       │   └── operations-preserving-convexity.svg
│   │       └── function-examples/
│   │           └── convex-shapes.png
│   │
│   ├── 04-convex-opt-problems/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── problem-form-recognizer.js
│   │   │   │   ├── lp-visualizer.js
│   │   │   │   └── lp-simplex-animator.js
│   │   │   └── py/
│   │   │       └── solver-wrapper.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── standard-form.svg
│   │       │   ├─ lp-geometry.svg
│   │       │   ├── qp-illustration.svg
│   │       │   ├── sdp-illustration.svg
│   │       │   └── problem-classification-flowchart.svg
│   │       └── applications/
│   │           ├── portfolio-problem.jpg
│   │           ├── ml-svm.jpg
│   │           └── structural-design.jpg
│   │
│   ├── 05-duality/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── lagrangian-explainer.js
│   │   │   │   └── duality-visualizer.js
│   │   │   └── py/
│   │   │       └── kkt-checker.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── lagrangian-visualization.svg
│   │       │   ├── primal-dual-geometry.svg
│   │       │   ├── weak-vs-strong-duality.svg
│   │       │   ├── kkt-conditions-flowchart.svg
│   │       │   └── complementary-slackness.svg
│   │       └── applications/
│   │           └── shadow-prices.png
│   │
│   ├── 06-approximation-fitting/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── least-squares-regularization.js
│   │   │   │   └── robust-regression.js
│   │   │   └── py/
│   │   │       ├── sparse-recovery-demo.py
│   │   │       └── data-generator.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── least-squares-geometry.svg
│   │       │   ├── regularization-paths.svg
│   │       │   ├── robust-loss-functions.svg
│   │       │   └── matrix-completion.svg
│   │       └── applications/
│   │           ├── outlier-example.jpg
│   │           ├── compressed-sensing.jpg
│   │           └── image-recovery.jpg
│   │
│   ├── 07-statistical-estimation/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── classification-boundary.js
│   │   │   │   ├── svm-margin-viz.js
│   │   │   │   └── decision-boundary-common.js
│   │   │   └── py/
│   │   │       ├── logistic-regression.py
│   │   │       └── svm-trainer.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── logistic-sigmoid.svg
│   │       │   ├── svm-margin-geometry.svg
│   │       │   ├── cross-entropy-loss.svg
│   │       │   ├── mle-illustration.svg
│   │       │   └── glm-framework.svg
│   │       └── datasets/
│   │           └── classification-examples.csv
│   │
│   ├── 08-geometric-problems/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── mvee-visualizer.js
│   │   │   │   └── chebyshev-center.js
│   │   │   └── py/
│   │   │       ├── mvee-solver.py
│   │   │       ├── shape-fitter.py
│   │   │       └── geometry-utils.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── mvee-illustration.svg
│   │       │   ├── chebyshev-center-geometry.svg
│   │       │   ├── distance-between-sets.svg
│   │       │   ├── best-fit-examples.svg
│   │       │   └── matrix-completion-geometry.svg
│   │       └── examples/
│   │           └── point-clouds.csv
│   │
│   ├── 09-unconstrained-minimization/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── gradient-descent-visualizer.js
│   │   │   │   ├── gd-vs-newton-race.js
│   │   │   │   ├── step-size-explorer.js
│   │   │   │   └── optimization-common.js
│   │   │   └── py/
│   │   │       └── [None yet]
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── gd-trajectory.svg
│   │       │   ├── newton-method-geometry.svg
│   │       │   ├── convergence-rates.svg
│   │       │   ├── step-size-selection.svg
│   │       │   ├── condition-number-effect.svg
│   │       │   └── proximal-methods.svg
│   │       └── convergence-plots/
│   │           └── rate-comparison.png
│   │
│   ├── 10-equality-constrained-minimization/
│   │   ├── index.html
│   │   ├── widgets/
│   │   │   ├── js/
│   │   │   │   ├── null-space-visualizer.js
│   │   │   │   ├── projected-gd.js
│   │   │   │   └── penalty-barrier-methods.js
│   │   │   └── py/
│   │   │       └── constraint-utils.py
│   │   └── images/
│   │       ├── diagrams/
│   │       │   ├── null-space-method.svg
│   │       │   ├── projection-onto-constraint.svg
│   │       │   ├── kkt-equality-constraints.svg
│   │       │   ├── penalty-method-progression.svg
│   │       │   └── barrier-method-illustration.svg
│   │       └── examples/
│   │           └── constrained-quadratic.png
│   │
│   └── 11-interior-point-methods/
│       ├── index.html
│       ├── widgets/
│       │   ├── js/
│       │   │   ├── barrier-method-path-tracer.js
│       │   │   └── lp-simplex-vs-ip.js
│       │   └── py/
│       │       ├── barrier-solver.py
│       │       └── conic-solver-wrapper.py
│       └── images/
│           ├── diagrams/
│           │   ├── interior-point-trajectory.svg
│           │   ├── barrier-function-landscape.svg
│           │   ├── central-path-illustration.svg
│           │   ├── simplex-vs-interior-point.svg
│           │   ├── conic-structures.svg
│           │   └── complexity-vs-problem-size.svg
│           └── algorithms/
│               └── ip-algorithm-pseudocode.png
│
├── /static/
│   ├── css/
│   │   ├── styles.css                 [Main stylesheet: dark theme]
│   │   └── math.css                   [KaTeX/MathJax styling]
│   ├── js/
│   │   ├── app.js                     [Homepage: load sessions, search, routing]
│   │   ├── widgets-loader.js          [Auto-load widgets for each lecture]
│   │   ├── math-renderer.js           [LaTeX rendering wrapper]
│   │   └── analytics.js               [Optional: Plausible/Fathom setup]
│   └── assets/
│       ├── branding/
│       │   ├── logo.svg               [Course logo]
│       │   └── favicon.ico            [Browser icon]
│       ├── topics/
│       │   └── 00-linear-algebra-primer/
│       │       └── …                  [Lecture-scoped imagery & animations]
│       └── shared/
│           └── illustrations/
│               └── …                  [Reusable diagrams across lectures]
│
├── /lib/
│   ├── math/
│   │   └── katex.min.js              [Local KaTeX copy for equation rendering]
│   └── pyodide/                       [Optional: vendor Pyodide locally if usage is heavy]
│
├── /data/
│   ├── sample-datasets.json           [Shared data for widgets: classification, fitting, etc.]
│   ├── iris.csv                       [Iris dataset for ML examples]
│   └── finance-data.csv               [Portfolio optimization data]
│
└── /docs/
    ├── SETUP.md                       [Developer setup: git, local server, testing]
    ├── WIDGET-GUIDE.md                [How to build new widgets (JS & Python)]
    ├── CONTRIBUTING.md                [Contribution guidelines]
    └── MATH-REFERENCE.md              [Quick LaTeX & notation reference]
```

---

# Placeholder Templates

Below are ready-to-use starter templates for each lecture and widget type.

## Lecture HTML Template

**File:** `topics/NN-slug/index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>[LECTURE_NUMBER]. [TITLE] — Convex Optimization</title>
  <link rel="stylesheet" href="../../static/css/styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</head>
<body>
  <!-- Header with navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand">
        <img src="../../static/assets/branding/logo.svg" class="logo" alt="logo" />
        <a href="../../index.html" style="text-decoration:none;color:inherit">
          <strong>Convex Optimization</strong>
        </a>
      </div>
      <nav class="nav">
        <a href="../../index.html#sessions">All Lectures</a>
        <a href="#widgets">Interactive</a>
        <a href="#readings">Readings</a>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main class="container" style="padding: 32px 0 60px;">
    <!-- Lecture header -->
    <article class="card" style="margin-bottom: 32px;">
      <h1 style="margin-top: 0;">[NN]. [FULL LECTURE TITLE]</h1>
      <div class="meta">
        Date: [DATE] · Duration: [90 MIN] · Tags: [tag1], [tag2]
      </div>

      <!-- Brief introduction -->
      <section style="margin-top: 16px;">
        <p><strong>Overview:</strong> [2–3 sentence summary of what we'll learn and why it matters]</p>
        <p><strong>Prerequisites:</strong> [Link to required background; e.g., "Linear Algebra Primer" or "Lecture 02"]</p>
      </section>
    </article>

    <!-- Learning objectives -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Learning Objectives</h2>
      <p>After this lecture, you should understand:</p>
      <ul style="line-height: 1.8;">
        <li>[Objective 1]</li>
        <li>[Objective 2]</li>
        <li>[Objective 3]</li>
      </ul>
    </section>

    <!-- Main lecture content -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Key Concepts</h2>

      <h3>Concept 1: [NAME]</h3>
      <p>[Detailed explanation with inline LaTeX: $\mathcal{C}$ is convex if ...]</p>
      <p>Visual intuition: [Description of accompanying diagram]</p>

      <h3>Concept 2: [NAME]</h3>
      <p>[Another concept with examples]</p>

      <!-- Include images as needed -->
      <figure style="margin: 16px 0; text-align: center;">
        <img src="./images/diagrams/[DIAGRAM].svg" alt="[Description]" style="max-width: 100%; height: auto;" />
        <figcaption style="font-size: 13px; color: var(--muted); margin-top: 8px;">
          [Caption with key insight]
        </figcaption>
      </figure>
    </section>

    <!-- Interactive widgets -->
    <section class="card" id="widgets" style="margin-bottom: 32px;">
      <h2>Interactive Widgets</h2>
      <p>Below are tools to explore the concepts interactively. Try tweaking parameters to build intuition.</p>

      <!-- Widget 1 -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 1 TITLE]</h3>
        <p>[Brief description of what this widget does]</p>
        <div id="widget-1" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>

      <!-- Widget 2 -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 2 TITLE]</h3>
        <p>[Description]</p>
        <div id="widget-2" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>

      <!-- Widget 3 (if exists) -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 3 TITLE]</h3>
        <p>[Description]</p>
        <div id="widget-3" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>
    </section>

    <!-- Readings -->
    <section class="card" id="readings" style="margin-bottom: 32px;">
      <h2>Readings & Resources</h2>
      <ul class="link-list">
        <li><strong>Boyd & Vandenberghe, Convex Optimization:</strong> Section [X.Y] — [topic]</li>
        <li><strong>Course slides:</strong> [Link if available]</li>
        <li><strong>Additional resources:</strong> [Papers, blog posts, videos]</li>
      </ul>
    </section>

    <!-- Example problems -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Example Problems</h2>

      <h3>Example 1: [Problem title]</h3>
      <p>[Problem statement and worked solution]</p>

      <h3>Example 2: [Problem title]</h3>
      <p>[Another example]</p>
    </section>

    <!-- Exercises (optional) -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Exercises</h2>
      <p>Try these problems to deepen your understanding. Solutions are provided at the end of the course.</p>
      <ol style="line-height: 2;">
        <li>[Exercise 1]</li>
        <li>[Exercise 2]</li>
        <li>[Exercise 3]</li>
      </ol>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <p style="margin: 0;">
        © <span id="year"></span> Convex Optimization Course ·
        <a href="../../README.md" style="color: var(--brand);">About</a>
      </p>
    </div>
  </footer>

  <!-- Load Pyodide for Python widgets (optional) -->
  <script defer src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"></script>

  <!-- Widget loaders -->
  <script type="module" src="./widgets/js/[WIDGET1].js"></script>
  <script type="module" src="./widgets/js/[WIDGET2].js"></script>
  <!-- <script type="module" src="./widgets/js/[WIDGET3].js"></script> -->

  <!-- Global utilities -->
  <script src="../../static/js/math-renderer.js"></script>
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>
</body>
</html>
```

## JavaScript Widget Template

**File:** `topics/NN-slug/widgets/js/[widget-name].js`

```javascript
/**
 * Widget: [Widget Name]
 *
 * Description: [What does this widget do?]
 *
 * Uses: Canvas/SVG for rendering, event listeners for interactivity
 *
 * DOM target: #widget-1 (or appropriate ID)
 */

export function initWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Widget container #${containerId} not found.`);
    return;
  }

  // Create canvas or SVG
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // State
  let state = {
    // Initialize state here
    param1: 1.0,
    param2: 0.5,
  };

  // UI controls (sliders, buttons, etc.)
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = 'margin-bottom: 12px; display: flex; gap: 12px; flex-wrap: wrap;';

  const slider1Label = document.createElement('label');
  slider1Label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  slider1Label.textContent = 'Parameter 1:';

  const slider1 = document.createElement('input');
  slider1.type = 'range';
  slider1.min = '0';
  slider1.max = '10';
  slider1.step = '0.1';
  slider1.value = state.param1;
  slider1.addEventListener('input', (e) => {
    state.param1 = parseFloat(e.target.value);
    render();
  });

  slider1Label.appendChild(slider1);
  controlPanel.appendChild(slider1Label);
  container.insertBefore(controlPanel, canvas);

  // Render function
  function render() {
    // Clear canvas
    ctx.fillStyle = 'var(--bg)'; // Won't work; use actual color
    ctx.fillStyle = '#0b0d12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on state
    ctx.fillStyle = '#7cc5ff';
    ctx.font = '16px system-ui';
    ctx.fillText(`param1 = ${state.param1.toFixed(2)}`, 16, 32);

    // [Add actual drawing logic here]
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
  });

  // Initial render
  render();
}

// Auto-initialize if this is a module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initWidget('widget-1'));
} else {
  initWidget('widget-1');
}
```

## Python Widget Template (Pyodide Wrapper)

**File:** `topics/NN-slug/widgets/py/[widget-name].py`

```python
"""
Widget: [Widget Name]

This Python script runs in Pyodide (in-browser Python).
It provides computation/analysis that JS calls.

Usage from JS:
  const py = await getPyodide();
  await py.runPythonAsync(`
    import sys; sys.path.append('.')
    from widgets_py_widget_name import analyze
    result = analyze(params)
  `);
"""

import numpy as np
from scipy.optimize import minimize
# ... other imports

def analyze(params):
    """
    Main function that JS calls.

    Args:
        params: dict with problem parameters

    Returns:
        result: dict with output (vectors, matrices, scalars, etc.)
    """

    # Extract parameters
    n = params.get('n', 10)
    lambda_ = params.get('lambda', 0.1)

    # Compute
    x_opt = np.random.randn(n)  # Placeholder
    obj_value = np.sum(x_opt**2)

    # Return results
    return {
        'x_opt': x_opt.tolist(),  # Convert to list for JSON serialization
        'obj_value': float(obj_value),
        'status': 'solved'
    }


# Example: gradient descent
def gradient_descent(f_grad, x0, alpha=0.01, max_iter=100):
    """
    Simple gradient descent.

    Args:
        f_grad: function that returns (f(x), grad_f(x))
        x0: initial point
        alpha: step size
        max_iter: max iterations

    Returns:
        trajectory (list of x iterates)
    """
    trajectory = [x0.copy()]
    x = x0.copy()

    for k in range(max_iter):
        f_val, grad = f_grad(x)
        if np.linalg.norm(grad) < 1e-6:
            break
        x = x - alpha * grad
        trajectory.append(x.copy())

    return trajectory
```

## Data Files & JSONs

**File:** `content/lectures.json` (Complete template)

```json
[
  {
    "slug": "00-linear-algebra-primer",
    "title": "Linear Algebra Primer",
    "date": "2025-10-14",
    "duration": "60 min",
    "blurb": "Essential review: norms, inner products, eigenvalues, PSD matrices, quadratic forms. Start here if you need background.",
    "tags": ["prerequisites", "review", "linear-algebra"],
    "slides": null,
    "is_optional": true
  },
  {
    "slug": "01-introduction",
    "title": "Introduction: What & Why of Convex Optimization",
    "date": "2025-10-21",
    "duration": "90 min",
    "blurb": "Optimization landscape, convex vs nonconvex, examples in ML, control, and geometry.",
    "tags": ["intro", "motivation", "overview"],
    "slides": null,
    "prerequisites": []
  },
  {
    "slug": "02-convex-sets",
    "title": "Convex Sets: Affine, Cones, Balls, Ellipsoids",
    "date": "2025-10-28",
    "duration": "90 min",
    "blurb": "Geometric foundations: convex sets, operations preserving convexity, supporting hyperplanes.",
    "tags": ["sets", "geometry", "foundational"],
    "slides": null,
    "prerequisites": ["01-introduction"]
  },
  {
    "slug": "03-convex-functions",
    "title": "Convex Functions: Characterization & Operations",
    "date": "2025-11-04",
    "duration": "90 min",
    "blurb": "Jensen, epigraphs, first/second-order tests, operations preserving convexity.",
    "tags": ["functions", "theory"],
    "slides": null,
    "prerequisites": ["02-convex-sets"]
  },
  {
    "slug": "04-convex-opt-problems",
    "title": "Convex Optimization Problems: Standard Forms",
    "date": "2025-11-11",
    "duration": "90 min",
    "blurb": "LP, QP, SDP, SOCP—how to recognize and formulate convex problems.",
    "tags": ["standard-forms", "classification"],
    "slides": null,
    "prerequisites": ["03-convex-functions"]
  },
  {
    "slug": "05-duality",
    "title": "Duality: Lagrangian, KKT, Strong Duality",
    "date": "2025-11-18",
    "duration": "90 min",
    "blurb": "Dual problems, optimality conditions, shadow prices, and why duality powers algorithms.",
    "tags": ["duality", "theory"],
    "slides": null,
    "prerequisites": ["04-convex-opt-problems"]
  },
  {
    "slug": "06-approximation-fitting",
    "title": "Applications I: Approximation & Fitting",
    "date": "2025-11-25",
    "duration": "90 min",
    "blurb": "Least squares, robust regression, sparse recovery, regularization.",
    "tags": ["applications", "fitting"],
    "slides": null,
    "prerequisites": ["04-convex-opt-problems"]
  },
  {
    "slug": "07-statistical-estimation",
    "title": "Applications II: Statistical Estimation & Machine Learning",
    "date": "2025-12-02",
    "duration": "90 min",
    "blurb": "MLE, logistic regression, SVM, classification—convex optimization at the heart of ML.",
    "tags": ["applications", "ml", "statistics"],
    "slides": null,
    "prerequisites": ["06-approximation-fitting"]
  },
  {
    "slug": "08-geometric-problems",
    "title": "Applications III: Geometric Problems",
    "date": "2025-12-09",
    "duration": "90 min",
    "blurb": "MVEE, Chebyshev center, best-fit shapes, distance problems.",
    "tags": ["applications", "geometry"],
    "slides": null,
    "prerequisites": ["02-convex-sets"]
  },
  {
    "slug": "09-unconstrained-minimization",
    "title": "Algorithms I: Unconstrained Minimization",
    "date": "2025-12-16",
    "duration": "90 min",
    "blurb": "Gradient descent, Newton's method, step size selection, convergence rates.",
    "tags": ["algorithms", "unconstrained"],
    "slides": null,
    "prerequisites": ["03-convex-functions"]
  },
  {
    "slug": "10-equality-constrained-minimization",
    "title": "Algorithms II: Equality-Constrained Minimization",
    "date": "2026-01-06",
    "duration": "90 min",
    "blurb": "Null-space methods, projected gradient descent, penalty methods.",
    "tags": ["algorithms", "constrained"],
    "slides": null,
    "prerequisites": ["05-duality", "09-unconstrained-minimization"]
  },
  {
    "slug": "11-interior-point-methods",
    "title": "Algorithms III: Interior-Point Methods",
    "date": "2026-01-13",
    "duration": "90 min",
    "blurb": "Barrier methods, central path, polynomial-time complexity, practical implementations.",
    "tags": ["algorithms", "interior-point"],
    "slides": null,
    "prerequisites": ["10-equality-constrained-minimization"]
  }
]
```

---

# Widget Development Priority

**High Priority (start here):**
1. Convex vs Nonconvex Explorer (Lecture 01) — Teaches the core intuition
2. Gradient Descent Visualizer (Lecture 09) — Algorithm understanding is central
3. Jensen's Inequality Visualizer (Lecture 03) — Foundational for convexity
4. Classification Boundary Visualizer (Lecture 07) — Real-world relevance, exciting for students
5. Barrier Method Path Tracer (Lecture 11) — Elegant illustration of modern solvers

**Medium Priority (next batch):**
6. Ellipsoid Explorer (Lecture 02) — Beautiful geometry
7. Duality Visualizer (Lecture 05) — Profound concept, worth illustrating
8. LP Visualizer: Simplex (Lecture 04) — Classic algorithm
9. Hessian Eigenvalue Visualizer (Lecture 03) — Connects LA to convexity
10. Convex Set Checker (Lecture 02) — Interactive definition testing

**Lower Priority (polish later):**
11. Least Squares & Regularization Playground (Lecture 06) — Educational but less dramatic
12. Robust Regression Visualizer (Lecture 06) — More niche
13. Sparse Recovery Demo (Lecture 06) — Needs solid Python backend
14. MVEE Visualizer (Lecture 08) — Complex SDP, nice but optional
15. Problem Form Recognizer (Lecture 04) — Educational, lower engagement
16. (Other widgets from Lectures 08, 10, etc.)

**Implementation Strategy:**
- **Week 1–2:** Build high-priority widgets; they unblock conceptual understanding
- **Week 3–5:** Expand to medium-priority; cover all lectures
- **Week 6+:** Polish, optimize performance, gather student feedback
- **Parallel:** Create diagrams and SVGs as soon as lecture outlines are finalized

---

# Assets & Data Requirements

## Diagrams to Create (SVG)

Each diagram should:
- Use consistent color scheme (dark theme, brand blue `#7cc5ff`, accent green `#80ffb0`)
- Include labels and annotations
- Be minimal but clear (no clutter)
- Support light/dark modes if possible

**Per-Lecture Diagrams:**

| Lecture | Diagram | Purpose | Priority |
|---------|---------|---------|----------|
| 00 LA | Vector norms illustration | Show $\ell_2$, $\ell_1$, $\ell_\infty$ geometrically | High |
| 00 LA | Eigenvalue/PSD visualization | Positive vs negative eigenvalues | High |
| 00 LA | Matrix rank illustration | Full rank vs rank-deficient | Medium |
| 01 Intro | Optimization problem schematic | Minimize $f(x)$ subject to $\mathcal{C}$ | High |
| 01 Intro | Convex vs nonconvex landscape | Side-by-side bowls | High |
| 02 Sets | Affine vs convex sets | Two contrasting examples | High |
| 02 Sets | Cone definition & visualization | Cone property: $\lambda x \in K$ if $x \in K$ | Medium |
| 02 Sets | Ball and ellipsoid comparison | Circle vs stretched ellipse | High |
| 02 Sets | Polyhedron from constraints | $Ax \leq b$ as half-space intersection | High |
| 02 Sets | Separating hyperplane theorem | Gap between convex sets | Medium |
| 03 Functions | Jensen's inequality diagram | Curve, line segment, point | High |
| 03 Functions | Epigraph illustration | 3D: function + region above | High |
| 03 Functions | First-order characterization | Tangent line below function | Medium |
| 03 Functions | Second-order characterization | Hessian PSD → curvature | Medium |
| 03 Functions | Operations preserving convexity | Flowchart: which combinations stay convex | Medium |
| 04 Problems | Standard form summary | Variables, objective, constraints, feasible set | High |
| 04 Problems | LP/QP/SDP/SOCP comparison table | Icons and descriptions | Medium |
| 04 Problems | Simplex geometry on 2D polytope | Vertices, edges, objective | High |
| 05 Duality | Lagrangian surface plot | Primal objective + dual objective | High |
| 05 Duality | Weak vs strong duality | Dual ≤ Primal schematic | High |
| 05 Duality | KKT conditions flowchart | Stationarity, feasibility, complementary slackness | Medium |
| 06 Fitting | Least squares geometry | Data points, hyperplane, projection | Medium |
| 06 Fitting | Regularization paths | LASSO/ridge: how coefficients vary with $\lambda$ | Medium |
| 06 Fitting | Robust loss functions | Plots: quadratic vs Huber vs absolute value | Medium |
| 07 ML | Logistic sigmoid curve | S-shaped function | Medium |
| 07 ML | SVM margin geometry | Separating hyperplanes, margin | High |
| 07 ML | Cross-entropy loss landscape | 2D contour plot | Medium |
| 08 Geometry | MVEE illustration | Point cloud + smallest enclosing ellipsoid | Medium |
| 08 Geometry | Chebyshev center geometry | Polygon + inscribed circle | Medium |
| 09 Unconstrained | GD trajectory on contours | Spiral converging to center | High |
| 09 Unconstrained | Newton vs GD comparison | Different trajectories on same function | High |
| 09 Unconstrained | Convergence rate curves | Iterations vs error, log scale | Medium |
| 10 Constrained | Null-space method diagram | Feasible affine subspace, 2D problem embedded in 3D | Medium |
| 10 Constrained | Projected gradient step | GD step + projection back to constraint | Medium |
| 11 Interior-Point | Interior-point trajectory | Interior points spiraling toward boundary | High |
| 11 Interior-Point | Barrier function landscape | As $t$ increases, barrier flattens | High |
| 11 Interior-Point | Central path illustration | Curve of solutions connecting interior to boundary | Medium |
| 11 Interior-Point | Simplex vs interior-point paths | Vertices hopping vs interior passage | Medium |

**Total:** ~45 SVG diagrams to create or source.

## Real Datasets

- **Iris dataset:** Built-in via scikit-learn, or include `data/iris.csv`
- **MNIST sample:** 100–1000 handwritten digit images for image classification demos
- **Finance data:** Stock returns for portfolio optimization (synthetic or Yahoo Finance)
- **Simple 2D synthetic data:** Generated on-the-fly by widgets
- **Point clouds:** Randomly generated or from specific distributions for geometric examples

## Images & Photos

- **Portfolio allocation:** Screenshot of allocation pie chart or portfolio diversification photo
- **ML decision boundaries:** Photo of a Support Vector Machine separating two classes
- **Signal processing:** Compressed sensing recovery example
- **Network topology:** Graph visualization for network optimization (optional)

**Sourcing:**
- Create SVGs yourself (Figma, Inkscape) or use open-source libraries (SVG.js, D3.js for programmatic generation)
- Use synthetic data and matplotlib to generate PNG plots
- License images under CC-BY or purchase from Unsplash/Pexels

---

# Implementation Timeline

## Pre-Launch Phase (Weeks 1–2)

### Week 1
- **Monday:** Finalize all 11 lectures.json entries, set up Git repo, deploy skeleton to GitHub Pages
- **Tuesday–Wed:** Build lecture templates (HTML stubs for all 11 lectures + Lecture 00 optional)
- **Thursday:** Create core CSS and branding (dark theme refinements, KaTeX math rendering setup)
- **Friday:** Set up Pyodide environment, test simple Python widget scaffold

### Week 2
- **Monday–Tue:** Draw/create ~15 essential SVG diagrams (prioritize Lectures 01, 02, 03, 09, 11)
- **Wednesday:** Build top 3 high-priority widgets (convex vs nonconvex, GD visualizer, Jensen)
- **Thursday:** Wire up widget loaders; test on local server
- **Friday:** User testing (colleagues/advisors): feedback on UI, clarity, interactivity

## Launch Phase (Weeks 3–4)

### Week 3 (Lecture 00 & 01)
- **Monday:** Publish Lecture 00 (LA Primer) with matrix explorer widget
- **Tuesday:** Finalize Lecture 01 with full notes, 2 working widgets, diagrams
- **Wednesday–Thu:** Build Lecture 02 widgets (ellipsoid explorer, convex set checker)
- **Friday:** Publish Lectures 01–02

### Week 4 (Lectures 02–04)
- **Monday–Tue:** Complete Lecture 02 diagrams and content
- **Wednesday:** Build Lecture 03 widgets (Jensen visualizer, Hessian explorer)
- **Thursday:** Lecture 04 form recognizer + simplex visualizer
- **Friday:** Publish Lectures 02–04

## Content Phase (Weeks 5–11)

### Week 5 (Lectures 05–06)
- Monday–Fri: Lecture 05 (Lagrangian, duality, KKT checker), Lecture 06 (LS + robust regression)

### Week 6 (Lectures 07–08)
- Monday–Fri: Lecture 07 (logistic regression, SVM), Lecture 08 (geometric problems)

### Week 7 (Lecture 09)
- All effort on Lecture 09: GD vs Newton race, step-size explorer, convergence analysis
- Heavy emphasis: this is the algorithms turning point

### Week 8 (Lectures 09–10)
- Monday–Wed: Finish Lecture 09 polishing
- Thursday–Fri: Lecture 10 null-space and projected GD visualizers

### Week 9 (Lecture 11)
- Entire week: Lecture 11 (interior-point methods)
- Build barrier method path tracer, LP simplex vs IP comparison
- This is the capstone; make it impressive

### Weeks 10–11 (Polish & Feedback)
- Gather student feedback on all lectures
- Fix bugs in widgets
- Optimize performance (reduce load times, smooth animations)
- Add missing diagrams or examples based on confusion points
- Create study guides or review sheets (optional)

## Post-Launch (Ongoing)

**Maintenance & Iteration:**
- **Weekly:** Monitor student feedback; fix critical bugs same day
- **Bi-weekly:** Refine widget UX based on usage patterns
- **Monthly:** Add missing examples, create bonus challenges
- **Semester-end:** Archive everything, document lessons learned

---

# Pre-Launch Checklist

Before publishing the first lecture, ensure you have:

## Technical Setup
- [ ] Git repository initialized, pushed to GitHub
- [ ] GitHub Pages / Netlify configured and working
- [ ] Local server running (`python -m http.server 8010`) for testing
- [ ] Pyodide loading correctly; test with simple Python widget
- [ ] KaTeX rendering LaTeX equations in lectures
- [ ] All relative paths working (no hardcoded URLs)

## Content Structure
- [ ] All 11 lectures.json entries complete (title, date, slug, tags, prerequisites)
- [ ] Lecture 0 (LA Primer) outline drafted
- [ ] All 11 topic folders created with skeleton `index.html`
- [ ] Placeholder images/ and widgets/ directories in place
- [ ] Shared `/widgets/` folder structure set up

## Design & Branding
- [ ] Dark theme CSS applied consistently (colors, fonts, spacing)
- [ ] Logo SVG in place and sized correctly
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Accessibility: color contrast ratios > 4.5:1, proper semantic HTML

## Documentation
- [ ] README.md updated with setup instructions
- [ ] WIDGET-GUIDE.md written (template for new widgets)
- [ ] CONTRIBUTING.md drafted (code style, PR process)
- [ ] SETUP.md with local dev instructions

## Initial Diagrams (at minimum)
- [ ] Optimization problem schematic (Lecture 01)
- [ ] Convex vs nonconvex visualization (Lecture 01)
- [ ] Affine vs convex sets (Lecture 02)
- [ ] Jensen's inequality (Lecture 03)
- [ ] Standard form summary (Lecture 04)
- [ ] Gradient descent trajectory (Lecture 09)
- [ ] Interior-point trajectory (Lecture 11)

## First 2–3 Widgets
- [ ] Convex vs nonconvex explorer fully functional
- [ ] Gradient descent visualizer working (2D, animating)
- [ ] Jensen inequality visualizer interactive
- [ ] All tested on Chrome, Firefox, Safari
- [ ] Mobile-responsive; touch-friendly controls

## Readings & Resources
- [ ] Link to Boyd & Vandenberghe book working
- [ ] CVXPY documentation link live
- [ ] Solver links (SCS, Mosek, etc.) curated
- [ ] Optional: embed or link video lectures (if you have them)

## Analytics & Tracking (Optional)
- [ ] Plausible or Fathom analytics set up (or skip initially)
- [ ] Google Search Console verified
- [ ] Sitemap.xml generated

---

# Quick-Start Commands

Copy-paste these commands to get started:

```bash
# Create project directory
mkdir convex-optimization-course
cd convex-optimization-course

# Initialize Git
git init
git remote add origin https://github.com/[YOUR-GITHUB]/convex-optimization-course.git

# Create directory structure
mkdir -p {content,topics,static/{css,js,img},lib,data,docs,widgets/{js,py}}

# Topics: Create skeleton for all 11 lectures
for i in {00..11}; do
  mkdir -p "topics/$i-slug/images/{diagrams,examples}"
  mkdir -p "topics/$i-slug/widgets/{js,py}"
done

# Start local server
python -m http.server 8010
# Open http://localhost:8010 in browser

# Create initial content files (copy templates above)
# Copy lecture template to each topics/NN-slug/index.html
# Create content/lectures.json from template
# Create static/css/styles.css and static/js/app.js

# Test setup
# Open localhost:8010 in browser
# Check console for errors

# Commit initial structure
git add .
git commit -m "Initial project structure: 11 lectures, templates, styling"
git push -u origin main

# Deploy to GitHub Pages (if using)
# Push to gh-pages branch or configure Pages in repo settings
```

---

# Key Success Factors

1. **Start Simple:** First widgets should be 2D, fast to load, visually immediate
2. **Iterate Weekly:** Push new lecture each week; gather feedback immediately
3. **Link Everything:** Every new concept references prior concepts and prerequisites
4. **Use Color & Animation:** Humans learn by seeing things move and change
5. **Make It Playable:** Students should want to click, drag, explore—not just read
6. **Balance Theory & Practice:** Theory (definitions) + intuition (visuals) + practice (widgets)
7. **Performance Matters:** Widgets that load slowly or lag will frustrate users; prioritize performance
8. **Accessibility:** Ensure colors aren't the only information carrier; use text labels, captions
9. **Document as You Go:** Every widget and asset needs a README explaining its purpose
10. **Feedback Loop:** Share drafts early; iterate based on student confusion points

---

# Final Notes

This roadmap is **comprehensive but flexible**. You don't need to build all widgets at once. Start with the high-priority ones, ship those, gather feedback, then expand. The beauty of a static site is that you can add, modify, and publish incrementally without downtime.

**Your teaching goal:** By the end of the course, students don't just understand convex optimization theory—they've *felt* it through interactive exploration. Algorithms converge visually on their screen. Duality clicks because they've seen it animated. That's the power of this scaffold.

**Your engineering goal:** A maintainable codebase that future instructors can fork, extend, and customize. Clean file organization, clear widget templates, and good documentation make this possible.

**Questions to ask yourself as you build:**
- Would I want to interact with this widget as a student?
- Can I explain what each file does in one sentence?
- Would a colleague be able to add a new lecture without asking me how?

Good luck! This is an ambitious, beautiful project. 🚀
