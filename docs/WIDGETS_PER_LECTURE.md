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
  - **Description:** Allows users to drag two vectors and see their dot product, angle, and orthogonal projection update in real-time.
  - **Dependencies:** D3.js or a simple canvas library.
  - **Status:** Completed

- **[x] Rank & Nullspace Visualizer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/rank-nullspace.js`
  - **Description:** Visualizes the four fundamental subspaces of a user-defined 2x3 or 3x2 matrix.
  - **Dependencies:** D3.js, Pyodide (NumPy for computation).
  - **Status:** Completed

- **[x] Eigenvalue Decomposition & PSD Explorer (HIGH)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/eigen-psd.js`
  - **Description:** Shows the geometric interpretation of eigenvalues/eigenvectors for a 2x2 matrix and visualizes its quadratic form to check for positive semidefiniteness.
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

- **[x] Matrix Explorer (MEDIUM)**
  - **Location:** `topics/00-linear-algebra-primer/widgets/js/matrix-explorer.js`
  - **Description:** An interactive tool to explore matrix properties.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 01: Introduction (6 Widgets)

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

- **[x] Convex Combination Animation (MEDIUM)**
  - **Location:** `topics/01-introduction/widgets/js/convex-combination.js`
  - **Description:** Animates the concept of a convex combination by showing the line segment between two points remaining within a set.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Real-World Problem Gallery (LOW)**
  - **Location:** `topics/01-introduction/widgets/js/problem-gallery.js`
  - **Description:** A simple, filterable gallery of cards, each describing a real-world application of convex optimization.
  - **Dependencies:** None (static HTML/CSS/JS).
  - **Status:** Completed

- **[x] Convergence Comparison (HIGH)**
  - **Location:** `topics/01-introduction/widgets/js/convergence-comparison.js`
  - **Description:** A simple animated plot comparing the convergence rates of a convex solver vs. a generic nonconvex solver on a sample problem.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed

---

## Lecture 02: Convex Sets (7 Widgets)

- **[x] Convex Set Detector (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/convex-set-checker.js`
  - **Description:** Users can draw a 2D shape, and the widget checks if it's convex by sampling pairs of points.
  - **Dependencies:** Canvas API, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Ellipsoid Explorer & Parameterization (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/ellipsoid-explorer.js`
  - **Description:** Visualizes a 2D ellipsoid defined by a matrix A and center x_c, allowing users to manipulate them and see the shape change.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Polyhedron Visualizer & Constraint Explorer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/polyhedron-visualizer.js`
  - **Description:** Users can add or modify linear inequalities (Ax <= b) and see the resulting 2D polyhedron update in real-time.
  - **Dependencies:** D3.js, Pyodide (NumPy for constraint solving).
  - **Status:** Completed

- **[x] Separating Hyperplane Theorem Visualizer (HIGH)**
  - **Location:** `topics/02-convex-sets/widgets/js/separating-hyperplane.js`
  - **Description:** Allows users to place two convex sets and watch the algorithm find a separating hyperplane between them.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Operations Preserve Convexity Builder (MEDIUM)**
  - **Location:** `topics/02-convex-sets/widgets/js/operations-builder.js`
  - **Description:** A tool where users can apply operations (intersection, affine transformation) to pre-defined convex sets to see the result.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Cone Geometry & Properties (LOW)**
  - **Location:** `topics/02-convex-sets/widgets/js/cone-geometry.js`
  - **Description:** Visualizes different types of cones (norm cones, positive semidefinite cone) in 2D or 3D.
  - **Dependencies:** D3.js or Three.js.
  - **Status:** Completed

- **[x] Convex Set Operations Composer (LOW)**
  - **Location:** `topics/02-convex-sets/widgets/js/operations-composer.js`
  - **Description:** A drag-and-drop interface for composing multiple operations on sets.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 03: Convex Functions (7 Widgets)

- **[x] Jensen's Inequality Interactive Proof (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/jensen-visualizer.js`
  - **Description:** Users can pick a point λ on the line between x and y and see that f(λx + (1-λ)y) is always below the chord.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Epigraph Visualizer (MEDIUM)**
  - **Location:** `topics/03-convex-functions/widgets/js/epigraph-visualizer.js`
  - **Description:** Shows the 2D graph of a function and allows the user to toggle the visualization of its epigraph.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] First-Order Characterization: Tangent Line Explorer (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/tangent-line-explorer.js`
  - **Description:** Users can slide a point along a convex function's graph and see that the tangent line is always a global underestimator.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Hessian Eigenvalue Heatmap (HIGH)**
  - **Location:** `topics/03-convex-functions/widgets/js/hessian-heatmap.js`
  - **Description:** Displays a 2D function's value as a heatmap and overlays the eigenvalues of the Hessian at each point, showing where it is convex.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

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

- **[x] Convex Function Library & Properties Checker (LOW)**
  - **Location:** `topics/03-convex-functions/widgets/js/function-library.js`
  - **Description:** A gallery of common convex functions with an interface to check their properties (e.g., is it differentiable?).
  - **Dependencies:** None (Static).
  - **Status:** Completed

---

## Lecture 04: Convex Opt Problems (7 Widgets)

- **[x] Problem Form Recognizer (HIGH)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/problem-form-recognizer.js`
  - **Description:** Users can input a simple optimization problem, and the tool will attempt to classify it as LP, QP, etc.
  - **Dependencies:** Pyodide (CVXPY).
  - **Status:** Completed

- **[x] LP Visualizer & Simplex Animator (HIGH)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/lp-visualizer.js`
  - **Description:** Visualizes the feasible region of a 2D LP and animates the steps of the simplex algorithm.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] QP Solver Sandbox (MEDIUM)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/qp-sandbox.js`
  - **Description:** An interactive sandbox for solving a simple 2D QP, showing the contour lines and constraints.
  - **Dependencies:** D3.js, Pyodide (CVXPY).
  - **Status:** Completed

- **[x] SDP Visualizer (MEDIUM)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/sdp-visualizer.js`
  - **Description:** Visualizes the cone of positive semidefinite matrices in 3D (for 2x2 matrices).
  - **Dependencies:** Three.js.
  - **Status:** Completed

- **[x] SOCP Explorer (LOW)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/socp-explorer.js`
  - **Description:** Shows the geometry of the second-order cone and a simple SOCP problem.
  - **Dependencies:** Three.js.
  - **Status:** Completed

- **[x] Solver Selection Guide (LOW)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/solver-guide.js`
  - **Description:** Helps users choose an appropriate solver based on problem characteristics.
  - **Dependencies:** None (Static).
  - **Status:** Completed

- **[x] Problem Reformulation Tool (MEDIUM)**
  - **Location:** `topics/04-convex-opt-problems/widgets/js/reformulation-tool.js`
  - **Description:** Shows how a problem can be reformulated to fit a standard form (e.g., absolute value to linear constraints).
  - **Dependencies:** Pyodide (SymPy).
  - **Status:** Completed

---

## Lecture 05: Duality (8 Widgets)

- **[x] Lagrangian Interactive Explainer (HIGH)**
  - **Location:** `topics/05-duality/widgets/js/lagrangian-explainer.js`
  - **Description:** Visualizes the Lagrangian function for a simple constrained problem and shows how the dual function is a pointwise infimum.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Duality Visualizer (HIGH)**
  - **Location:** `topics/05-duality/widgets/js/duality-visualizer.js`
  - **Description:** Shows the geometric relationship between the primal and dual problems for a 2D LP.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Weak vs Strong Duality Race (MEDIUM)**
  - **Location:** `topics/05-duality/widgets/js/duality-race.js`
  - **Description:** Animates the convergence of the primal and dual objectives, showing the duality gap shrinking.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed

- **[x] KKT Condition Checker (HIGH)**
  - **Location:** `topics/05-duality/widgets/js/kkt-checker.js`
  - **Description:** Users can input a problem and a potential solution, and the widget checks which KKT conditions are satisfied.
  - **Dependencies:** Pyodide (SymPy, NumPy).
  - **Status:** Completed

- **[x] Shadow Prices & Sensitivity Analysis (MEDIUM)**
  - **Location:** `topics/05-duality/widgets/js/shadow-prices.js`
  - **Description:** Allows users to perturb a constraint in a simple problem and see how the optimal value changes, illustrating the concept of shadow prices.
  - **Dependencies:** D3.js, Pyodide (CVXPY).
  - **Status:** Completed

- **[x] Duality Gap Monitor (LOW)**
  - **Location:** `topics/05-duality/widgets/js/duality-gap-monitor.js`
  - **Description:** A simple monitor that plots the duality gap for an iterative algorithm.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed

- **[x] Dual Decomposition Visualizer (LOW)**
  - **Location:** `topics/05-duality/widgets/js/dual-decomposition.js`
  - **Description:** Visualizes how a problem can be decomposed into smaller subproblems using duality.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Complementary Slackness Explorer (MEDIUM)**
  - **Location:** `topics/05-duality/widgets/js/complementary-slackness.js`
  - **Description:** An interactive tool that demonstrates the complementary slackness conditions for a simple LP.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 06: Approximation & Fitting (8 Widgets)

- **[x] Least Squares Playground (HIGH)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/least-squares-regularization.js`
  - **Description:** Users can add/remove data points and see the least-squares regression line update instantly.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Regularization Path Explorer (HIGH)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/regularization-path.js`
  - **Description:** Shows how the coefficients of a linear model change as the regularization parameter (lambda) for Lasso or Ridge is varied.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

- **[x] Robust Regression vs LS (MEDIUM)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/robust-regression.js`
  - **Description:** Compares the results of standard least squares and a robust method (e.g., Huber loss) when outliers are present.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Sparse Recovery Demo (HIGH)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/sparse-recovery.js`
  - **Description:** Demonstrates how L1 regularization can recover a sparse signal from a limited number of measurements.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Matrix Completion Visualizer (MEDIUM)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/matrix-completion.js`
  - **Description:** Users can hide entries of a low-rank matrix (e.g., an image) and watch an algorithm recover the missing values.
  - **Dependencies:** Canvas, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Robust PCA Visualizer (LOW)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/robust-pca.js`
  - **Description:** Compares standard PCA with Robust PCA on a dataset with corrupted entries.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Fitting Function Gallery (LOW)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/fitting-gallery.js`
  - **Description:** A gallery showing different basis functions for fitting data (e.g., polynomials, splines, Fourier series).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Regularization Theory Tool (MEDIUM)**
  - **Location:** `topics/06-approximation-fitting/widgets/js/regularization-theory.js`
  - **Description:** Visualizes the geometry of different regularizers (L1, L2, Elastic Net).
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 07: Statistical Estimation & ML (9 Widgets)

- **[x] Classification Boundary Visualizer (HIGH)**
  - **Location:** `topics/07-statistical-estimation/widgets/js/classification-boundary.js`
  - **Description:** Visualizes the decision boundary for classifiers like Logistic Regression and SVM on a 2D dataset.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

- **[x] Logistic Regression Solver (HIGH)**
  - **Location:** `topics/07-statistical-estimation/widgets/js/logistic-regression.js`
  - **Description:** An interactive solver for logistic regression, showing the likelihood function and convergence.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] SVM Margin Maximizer (HIGH)**
  - **Location:** `topics/07-statistical-estimation/widgets/js/svm-margin.js`
  - **Description:** Users can drag support vectors and see how the SVM margin and decision boundary change.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Naive Bayes Visualization (MEDIUM)**
  - **Location:** `topics/07-statistical-estimation/widgets/js/naive-bayes.js`
  - **Description:** Visualizes the conditional probabilities used in a Naive Bayes classifier.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Multi-class Classification (MEDIUM)**
  - **Location:** `topics/07-statistical-estimation-ml/widgets/js/multiclass-classification.js`
  - **Description:** Shows decision boundaries for one-vs-all or softmax classification on a multi-class dataset.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

- **[x] Mixture Model Solver (LOW)**
  - **Location:** `topics/07-statistical-estimation-ml/widgets/js/mixture-model.js`
  - **Description:** Animates the Expectation-Maximization algorithm for a Gaussian Mixture Model.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

- **[x] ROC Curve & Threshold Explorer (LOW)**
  - **Location:** `topics/07-statistical-estimation-ml/widgets/js/roc-curve.js`
  - **Description:** Interactive tool to explore the ROC curve and see how classification threshold affects TPR and FPR. Includes confusion matrix and performance metrics.
  - **Dependencies:** D3.js, Pyodide (scikit-learn).
  - **Status:** Completed (2025-10-21)

- **[x] Feature Selection via Sparsity (MEDIUM)**
  - **Location:** `topics/07-statistical-estimation-ml/widgets/js/feature-selection.js`
  - **Description:** Shows how L1 regularization in logistic regression can drive feature coefficients to zero.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

- **[x] Model Comparison Dashboard (MEDIUM)**
  - **Location:** `topics/07-statistical-estimation-ml/widgets/js/model-comparison.js`
  - **Description:** A dashboard to compare the performance of different classifiers on a given dataset.
  - **Dependencies:** D3.js, Pyodide (Scikit-learn).
  - **Status:** Completed

---

## Lecture 08: Geometric Problems (8 Widgets)

- **[x] MVEE Visualizer (HIGH)**
  - **Location:** `topics/08-geometric-problems/widgets/js/mvee-visualizer.js`
  - **Description:** Finds and displays the Minimum Volume Enclosing Ellipsoid for a set of user-defined points in 2D.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Chebyshev Center Explorer (MEDIUM)**
  - **Location:** `topics/08-geometric-problems/widgets/js/chebyshev-center.js`
  - **Description:** Finds the largest circle that can fit inside a user-defined polyhedron.
  - **Dependencies:** D3.js, Pyodide (CVXPY).
  - **Status:** Completed

- **[x] Best-Fit Shape Finder (MEDIUM)**
  - **Location:** `topics/08-geometric-problems/widgets/js/best-fit-shape.js`
  - **Description:** Finds the best-fitting line or plane to a set of points.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Distance Between Convex Sets (HIGH)**
  - **Location:** `topics/08-geometric-problems/widgets/js/distance-between-sets.js`
  - **Description:** Calculates and visualizes the shortest distance between two convex sets.
  - **Dependencies:** D3.js, Pyodide (CVXPY).
  - **Status:** Completed

- **[x] Facility Location Problem (LOW)**
  - **Location:** `topics/08-geometric-problems/widgets/js/facility-location.js`
  - **Description:** A simple interactive example of a facility location problem.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Packing Problem (LOW)**
  - **Location:** `topics/08-geometric-problems/widgets/js/packing-problem.js`
  - **Description:** Visualizes a simple circle packing problem.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Matrix Rank Minimization (MEDIUM)**
  - **Location:** `topics/08-geometric-problems/widgets/js/rank-minimization.js`
  - **Description:** A toy example demonstrating rank minimization via the nuclear norm heuristic.
  - **Dependencies:** Pyodide (NumPy).
  - **Status:** Completed

- **[x] Robust Geometry Optimizer (MEDIUM)**
  - **Location:** `topics/08-geometric-problems/widgets/js/robust-geometry.js`
  - **Description:** Compares a standard geometric optimization with its robust counterpart.
  - **Dependencies:** D3.js, Pyodide (CVXPY).
  - **Status:** Completed

---

## Lecture 09: Unconstrained Minimization (9 Widgets)

- **[x] Gradient Descent Visualizer (HIGH)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/gradient-descent-visualizer.js`
  - **Description:** Animates the steps of gradient descent on a 2D contour plot of a selectable function.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Gradient Descent vs Newton Race (HIGH)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/gd-vs-newton.js`
  - **Description:** A side-by-side animation comparing the convergence of Gradient Descent and Newton's method.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Step Size Selector (MEDIUM)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/step-size.js`
  - **Description:** Shows how different step sizes (too large, too small, just right) affect the convergence of gradient descent.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Convergence Rate Comparison (HIGH)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/convergence-rate.js`
  - **Description:** Plots the convergence rates of different first-order methods.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed

- **[x] Condition Number Impact (MEDIUM)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/condition-number-impact.js`
  - **Description:** Visualizes how a high condition number elongates the contours of a function and slows down gradient descent.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Momentum & Acceleration (LOW)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/momentum.js`
  - **Description:** Compares standard gradient descent with Classical Momentum and Nesterov Accelerated Gradient. Shows convergence paths and speedup metrics on various test functions.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed (2025-10-21)

- **[x] Adaptive Methods (Adam, RMSprop) (LOW)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/adaptive-methods.js`
  - **Description:** Visual comparison of adaptive learning rate methods like Adam and RMSprop.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Coordinate Descent Visualizer (MEDIUM)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/coordinate-descent.js`
  - **Description:** Animates the steps of coordinate descent, showing how it optimizes along one axis at a time.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] First-Order Method Gallery (MEDIUM)**
  - **Location:** `topics/09-unconstrained-minimization/widgets/js/first-order-gallery.js`
  - **Description:** A gallery comparing the paths taken by various first-order methods on the same problem.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 10: Equality-Constrained Minimization (7 Widgets)

- **[x] Null-Space Method Visualizer (HIGH)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/null-space-visualizer.js`
  - **Description:** Visualizes how the null-space method works for a simple equality-constrained QP.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Projected Gradient Descent (HIGH)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/projected-gd.js`
  - **Description:** Animates projected gradient descent, showing the gradient step and the projection back onto the feasible set.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Augmented Lagrangian Method (MEDIUM)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/augmented-lagrangian.js`
  - **Description:** Visualizes the convergence of the augmented Lagrangian method.
  - **Dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] Penalty Method Path (MEDIUM)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/penalty-method.js`
  - **Description:** Shows the path of solutions as the penalty parameter increases in the penalty method.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Constraint Qualification Checker (LOW)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/constraint-qualification.js`
  - **Description:** A tool to check constraint qualifications like LICQ for a given set of constraints.
  - **Dependencies:** Pyodide (SymPy).
  - **Status:** Completed

- **[x] Infeasibility Detection (MEDIUM)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/infeasibility-detection.js`
  - **Description:** Visualizes how a Phase I method can detect infeasibility in an LP.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Feasible vs Interior-Point Methods (HIGH)**
  - **Location:** `topics/10-equality-constrained-minimization/widgets/js/feasible-vs-interior.js`
  - **Description:** Compares the paths taken by a feasible descent method and an interior-point method.
  - **Dependencies:** D3.js.
  - **Status:** Completed

---

## Lecture 11: Interior-Point Methods (9 Widgets)

- **[x] Barrier Method Path Tracer (HIGH)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/barrier-method-path-tracer.js`
  - **Description:** Traces the central path as the barrier parameter `t` is increased, showing how the solutions approach the true optimum.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Logarithmic Barrier Landscape (MEDIUM)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/log-barrier-landscape.js`
  - **Description:** Visualizes the objective function combined with the logarithmic barrier function.
  - **Dependencies:** Three.js.
  - **Status:** Completed

- **[x] Newton Step in IPM (HIGH)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/newton-step-ipm.js`
  - **Description:** Shows a single Newton step within an interior-point method, including the centering and affine steps.
  - **dependencies:** D3.js, Pyodide (NumPy).
  - **Status:** Completed

- **[x] LP via Simplex vs IPM (HIGH)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/lp-simplex-vs-ip.js`
  - **Description:** A side-by-side comparison of the path taken by the Simplex algorithm (along the exterior) and an interior-point method (through the interior).
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Conic Problem Solver (MEDIUM)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/conic-solver.js`
  - **Description:** A simple sandbox for solving a small conic problem.
  - **Dependencies:** Pyodide (CVXPY).
  - **Status:** Completed

- **[x] Primal-Dual IPM Visualizer (MEDIUM)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/primal-dual-ipm.js`
  - **Description:** Visualizes the convergence of a primal-dual interior-point method.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Self-Concordant Functions Explorer (LOW)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/self-concordant.js`
  - **Description:** An interactive plot to explore the properties of self-concordant functions.
  - **Dependencies:** D3.js.
  - **Status:** Completed

- **[x] Warm Start & Predictor-Corrector (LOW)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/warm-start.js`
  - **Description:** Compares the convergence of an IPM with and without a warm start.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed

- **[x] Large-Scale IPM Behavior (MEDIUM)**
  - **Location:** `topics/11-interior-point-methods/widgets/js/large-scale-ipm.js`
  - **Description:** A plot showing the number of iterations for an IPM as problem size grows, illustrating the near-constant iteration count.
  - **Dependencies:** D3.js or Chart.js.
  - **Status:** Completed
