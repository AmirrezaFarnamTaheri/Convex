# Widgets Per Lecture

This document provides a comprehensive list of all planned interactive widgets, organized by lecture. Each entry includes a description, priority, planned file location, and technical dependencies.

---

## Lecture 00: Linear Algebra Primer (7 Widgets)

- **[x] Norm Geometry Visualizer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/norm-geometry-visualizer.js`
  - **Description:** Interactively displays the unit balls for ℓ₁, ℓ₂, and ℓ∞ norms to build geometric intuition.
  - **Dependencies:** D3.js for SVG rendering.
  - **Status:** Completed

- **[x] Orthogonality & Projection Explorer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/orthogonality.js`
  - **Description:** Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
  - **Dependencies:** D3.js or a simple canvas library.
  - **Status:** Completed

- **[x] Rank & Nullspace Visualizer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/rank-nullspace.js`
  - **Description:** Visualizes the four fundamental subspaces of a user-defined 2x3 or 3x2 matrix.
  - **Dependencies:** D3.js, Pyodide (NumPy for computation).
  - **Status:** Completed

- **[x] Matrix & Geometry Explorer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/matrix-geometry.js`
  - **Description:** Comprehensive explorer for 2x2 matrices, merging properties, eigenvalues, and quadratic forms.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Condition Number & Convergence Race (LOW)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/condition-number.js`
  - **Description:** Demonstrates how a high condition number slows down iterative solvers by comparing two systems of linear equations.
  - **Dependencies:** D3.js for plotting convergence.
  - **Status:** Completed

- **[x] Hessian Landscape Visualizer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/hessian-landscape-visualizer.js`
  - **Description:** Renders the 3D surface of a quadratic function and its Hessian matrix, linking eigenvalues to curvature.
  - **Dependencies:** Three.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] SVD & Low-Rank Approximation (LOW)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/svd-approximator.js`
  - **Description:** Lets users perform a low-rank approximation of an image by selecting the number of singular values to use.
  - **Dependencies:** Canvas, Pyodide (NumPy, Scikit-image).
  - **Status:** Completed

---

## Lecture 01: Introduction (5 Widgets)

- **[x] Convex vs Nonconvex Explorer (HIGH)**
  - **Location:** `topics/01-introduction/widgets/js/convex-vs-nonconvex.js`
  - **Description:** Users can select different 1D functions and see a visual check of Jensen's inequality to classify them as convex or nonconvex.
  - **Dependencies:** D3.js, Pyodide (NumPy for checking convexity).
  - **Status:** Completed

- **[x] Landscape Viewer (3D) (HIGH)**
  - **Location:** `topics/01-introduction/widgets/js/landscape-viewer.js`
  - **Description:** A 3D surface plot where a marble "rolls" to the minimum, illustrating the concept of a global vs. local optimum.
  - **Dependencies:** Three.js.
  - **Status:** Completed

- **[x] Problem Classification Flowchart (MEDIUM)**
  - **Location:** `topics/01-introduction/widgets/js/problem-flowchart.js`
  - **Description:** An interactive flowchart that guides users through classifying an optimization problem (e.g., LP, QP, convex, nonconvex).
  - **Dependencies:** A library like Mermaid.js or custom SVG.
  - **Status:** Completed

- **[x] Convergence Comparison (LOW)**
  - **Location:** `topics/01-introduction/widgets/js/convergence-comparison.js`
  - **Description:** An animated plot comparing the convergence rates of a convex solver vs. a generic non-convex solver.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Convex Combination Explorer (LOW)**
  - **Location:** `topics/01-introduction/widgets/js/convex-combination.js`
  - **Description:** Animates the concept of a convex combination using a triangle hull.
  - **Dependencies:** D3.js.
  - **Status:** Completed (Enhanced v2.2)

---

## Lecture 02: Convex Sets (5 Widgets)

- **[x] Convex Set Checker (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/convex-set-checker.js`
  - **Description:** Users can draw a 2D shape, and the widget checks if it's convex by sampling pairs of points. Includes counter-example visualization.
  - **Dependencies:** Canvas API, Pyodide (NumPy).
  - **Status:** Completed (Enhanced v2.2)

- **[x] Ellipsoid Explorer & Parameterization (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/ellipsoid-explorer.js`
  - **Description:** Visualizes a 2D ellipsoid defined by a matrix A and center x_c, allowing users to manipulate them and see the shape change.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Polyhedron Visualizer & Constraint Explorer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/polyhedron-visualizer.js`
  - **Description:** Users can add or modify linear inequalities (Ax <= b) and see the resulting 2D polyhedron update in real-time. Shows normal vectors.
  - **Dependencies:** D3.js, Pyodide (NumPy for constraint solving).
  - **Status:** Completed (Enhanced v2.2)

- **[x] Separating Hyperplane Theorem Visualizer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/separating-hyperplane.js`
  - **Description:** Allows users to place two convex sets and watch the algorithm find a separating hyperplane between them. Supports dragging.
  - **Dependencies:** D3.js.
  - **Status:** Completed (Enhanced v2.2)

- **[x] Operations Preserve Convexity Builder (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/operations-builder.js`
  - **Description:** A tool where users can apply operations (intersection, affine transformation) to pre-defined convex sets to see the result.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 03: Convex Functions (6 Widgets)

- **[x] Jensen's Inequality Interactive Proof (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/jensen-visualizer.js`
  - **Description:** Users can pick a point λ on the line between x and y and see that f(λx + (1-λ)y) is always below the chord.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Epigraph Visualizer (MEDIUM)**
  - **Location:** `topics/03-convex-functions/widgets/js/epigraph-visualizer.js`
  - **Description:** Shows the 2D graph of a function and allows the user to toggle the visualization of its epigraph. Includes sublevel slicing.
  - **Dependencies:** D3.js.
  - **Status:** Completed (Enhanced v2.2)

- **[x] First-Order Characterization: Tangent Line Explorer (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/tangent-line-explorer.js`
  - **Description:** Users can slide a point along a convex function's graph and see that the tangent line is always a global underestimator.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Hessian Eigenvalue Heatmap (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/hessian-heatmap.js`
  - **Description:** Displays a 2D function's value as a heatmap and overlays the eigenvalues of the Hessian at each point. Includes interactive probe.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed (Enhanced v2.2)

- **[x] Operations Preserving Convexity (MEDIUM)**
  - **Location:** `topics/03-convex-functions/widgets/js/operations-preserving.js`
  - **Description:** Interactive tool to show how operations like composition with an affine map preserve convexity.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Strongly Convex vs Merely Convex Comparison (LOW)**
  - **Location:** `topics/03-convex-functions/widgets/js/strong-convexity.js`
  - **Description:** Compares the graphs of a convex function and a strongly convex function, highlighting the quadratic lower bound.
  - **Dependencies:** D3.js.
  - **Status:** Completed
