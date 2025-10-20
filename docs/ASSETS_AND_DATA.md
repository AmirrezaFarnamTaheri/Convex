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
