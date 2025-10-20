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
│   └── img/
│       ├── logo.svg                   [Course logo]
│       ├── favicon.ico                [Browser icon]
│       └── icons/
│           ├── exercise-icon.svg
│           ├── video-icon.svg
│           └── pdf-icon.svg
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
