# Widgets Per Lecture

This document provides a comprehensive list of all planned interactive widgets, organized by lecture. Each entry includes a description, priority, planned file location, and technical dependencies.

---

## Lecture 00: Linear Algebra Primer (8 Widgets)

- **[x] Norm Geometry Visualizer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/norm-geometry-visualizer.js`
  - **Description:** Interactively displays the unit balls for ℓ₁, ℓ₂, and ℓ∞ norms to build geometric intuition.
  - **Dependencies:** D3.js for SVG rendering.
  - **Status:** Completed

- **[x] Orthogonality & Projection Explorer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/orthogonality.js`
  - **Description:** Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time. Includes LaTeX math display.
  - **Dependencies:** D3.js, KaTeX.
  - **Status:** Completed

- **[x] Rank & Nullspace Visualizer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/rank-nullspace.js`
  - **Description:** Visualizes the four fundamental subspaces of a user-defined 2x3 or 3x2 matrix using 3D (THREE.js) and 2D views.
  - **Dependencies:** D3.js, THREE.js, Pyodide (NumPy/SciPy).
  - **Status:** Completed

- **[x] Matrix & Geometry Explorer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/matrix-geometry.js`
  - **Description:** Comprehensive explorer for 2x2 matrices, merging properties, eigenvalues, and quadratic forms.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Condition Number & Convergence Race (LOW)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/condition-number.js`
  - **Description:** Demonstrates how a high condition number slows down iterative solvers (GD vs Momentum vs Newton) by comparing two systems. Includes zig-zag visualization.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Hessian Landscape Visualizer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/hessian-landscape-visualizer.js`
  - **Description:** Renders the 3D surface of a quadratic function and its Hessian matrix, linking eigenvalues to curvature.
  - **Dependencies:** THREE.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] SVD & Low-Rank Approximation (LOW)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/svd-approximator.js`
  - **Description:** Lets users perform a low-rank approximation of an image by selecting the number of singular values to use. Shows error image and energy stats.
  - **Dependencies:** Canvas, Pyodide (NumPy, Scikit-image).
  - **Status:** Completed

- **[x] Least Squares Visualizer (NEW)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/least-squares-visualizer.js`
  - **Description:** 3D visualization of the geometric interpretation of Least Squares (projection onto column space).
  - **Dependencies:** THREE.js.
  - **Status:** Completed

---

## Lecture 01: Introduction (5 Widgets)

- **[x] Convex vs Nonconvex Explorer (HIGH)**
  - **Location:** `topics/01-introduction/widgets/js/convex-vs-nonconvex.js`
  - **Description:** Users can select different 1D functions and see a visual check of Jensen's inequality to classify them as convex or nonconvex. Shows chord vs curve.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Landscape Viewer (3D) (HIGH)**
  - **Location:** `topics/01-introduction/widgets/js/landscape-viewer.js`
  - **Description:** A 3D surface plot where a marble "rolls" to the minimum (gradient descent physics), illustrating global vs. local optima.
  - **Dependencies:** THREE.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Problem Classification Flowchart (MEDIUM)**
  - **Location:** `topics/01-introduction/widgets/js/problem-flowchart.js`
  - **Description:** An interactive flowchart that guides users through classifying an optimization problem (e.g., LP, QP, convex, nonconvex).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Convergence Comparison (LOW)**
  - **Location:** `topics/01-introduction/widgets/js/convergence-comparison.js`
  - **Description:** An animated plot comparing the convergence rates of a convex solver vs. a generic non-convex solver (getting stuck).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Convex Combination Explorer (LOW)**
  - **Location:** `topics/01-introduction/widgets/js/convex-combination.js`
  - **Description:** Animates the concept of a convex combination using a triangle hull and barycentric coordinates. Uses KaTeX for math.
  - **Dependencies:** D3.js, KaTeX.
  - **Status:** Completed

---

## Lecture 02: Convex Sets (5 Widgets)

- **[x] Convex Set Checker (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/convex-set-checker.js`
  - **Description:** Users can draw a 2D shape, and the widget checks if it's convex by sampling pairs of points. Shows counter-example segment for non-convex sets.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Ellipsoid Explorer & Parameterization (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/ellipsoid-explorer.js`
  - **Description:** Visualizes a 2D ellipsoid defined by a matrix P and center x_c, allowing users to manipulate axes and see the matrix update.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Polyhedron Visualizer & Constraint Explorer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/polyhedron-visualizer.js`
  - **Description:** Users can add or modify linear inequalities (half-spaces) by dragging on the canvas and see the resulting 2D polyhedron intersection.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Separating Hyperplane Theorem Visualizer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/separating-hyperplane.js`
  - **Description:** Allows users to draw/drag two convex sets and watch the algorithm find a separating hyperplane (or detect collision).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Operations Preserve Convexity Builder (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/operations-builder.js`
  - **Description:** A tool where users can apply operations (intersection, affine transformation, Minkowski sum) to sets to see the result.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 03: Convex Functions (5 Widgets)

- **[x] Jensen's Inequality Interactive Proof (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/jensen-visualizer.js`
  - **Description:** Users can pick points on a curve to visualize Jensen's inequality (chord above function).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Epigraph Visualizer (MEDIUM)**
  - **Location:** `topics/03-convex-functions/widgets/js/epigraph-visualizer.js`
  - **Description:** Shows the 2D graph of a function and allows slicing the epigraph to see sublevel sets. Highlights convexity relationship.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] First-Order Characterization: Tangent Line Explorer (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/tangent-line-explorer.js`
  - **Description:** Users check if the tangent line is a global underestimator. Now includes **Strong Convexity** quadratic bound visualization.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Hessian Eigenvalue Heatmap (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/hessian-heatmap.js`
  - **Description:** Displays a 2D function's curvature as a heatmap of the Hessian's min eigenvalue. Includes interactive 3D probe.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Operations Preserving Convexity (MEDIUM)**
  - **Location:** `topics/03-convex-functions/widgets/js/operations-preserving.js`
  - **Description:** Interactive tool to show how operations like composition and weighted sums preserve function convexity.
  - **Dependencies:** D3.js.
  - **Status:** Completed
