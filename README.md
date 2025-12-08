# Personal HandNotes for Convex Optimization

**Course**: Convex Optimization
**Instructor**: Prof. Hesam Rajabzadeh, TeIAS (2025)
**Main Reference**: *Convex Optimization* by Boyd & Vandenberghe

## ⚠️ Disclaimer
**This is my Personal HandNotes for the Convex Optimization Course by Prof. Hesam Rajabzadeh, TeIAS-2025.**

I do not personally have eligibility for providing any sort of educational material. So these are **JUST** my personal handnotes, and while the content is proofread by **OpenAI GPT-5.1-Pro-Extended-Thinking** and **Google Gemini 3 Pro-Preview**, they still might have mistakes.

---

## 📚 Course Structure & Breakdown

These notes cover the following modules, with detailed breakdowns of the topics explored in each lecture.

### Part I: Mathematical Foundations
* **Lecture 00: Linear Algebra Basics**
  * **Core Concepts**: Notation, Subspaces, and the Four Fundamental Spaces.
  * **Algebraic Invariants**: Determinant, Trace, and Eigenvalues (including spectral mapping).
  * **Geometry**: Inner Products, Norms, Angles, and Orthogonality.
  * **Matrices**: Positive Semidefinite (PSD) Matrices and their properties.
  * **Optimization Tools**: Projections onto Subspaces/Affine Sets and the Method of Least Squares.

* **Lecture 01: Linear Algebra Advanced**
  * **Factorizations**: The QR Decomposition and its applications.
  * **Spectral Theory**: The Singular Value Decomposition (SVD) and its geometric interpretation.
  * **Inversion**: The Moore-Penrose Pseudoinverse and Condition Number analysis.

### Part II: Introduction to Optimization
* **Lecture 02: Introduction to Convex Optimization**
  * **Definitions**: Formal definition of optimization problems and convexity.
  * **The Fundamental Theorem**: Proof that local optima are global in convex problems.
  * **Problem Families**: The hierarchy of convex problems (LP $\subset$ QP $\subset$ SOCP $\subset$ SDP).
  * **Modeling**: The "Loss + Regularizer" paradigm and Standard Form transformations.
  * **DCP**: Introduction to Disciplined Convex Programming rules.

### Part III: Convex Sets
* **Lecture 03: Convex Sets & Geometry**
  * **Basics**: Affine and Convex sets, hulls, and combinations.
  * **Canonical Sets**: Hyperplanes, Halfspaces, Polyhedra, and Norm Balls.
  * **Operations**: Intersection, Affine functions, Perspective functions, and Linear-Fractional transformations.
  * **Topology**: Interior, Closure, Relative Interior, and Boundary definitions.

* **Lecture 04: Cones & Separation Theorems**
  * **Theorems**: Separating and Supporting Hyperplane theorems.
  * **Conic Geometry**: Proper cones, Generalized Inequalities, and Dual Cones.
  * **Applications**: Theorems of Alternatives (Farkas' Lemma).

### Part IV: Convex Functions
* **Lecture 05: Convex Functions Basics**
  * **Definitions**: Convexity, Concavity, and Strict/Strong convexity.
  * **Characterizations**: Epigraphs, First-Order (Gradient), and Second-Order (Hessian) conditions.
  * **Operations**: Pointwise maximum, composition rules, and minimization.
  * **Examples**: Verification of convexity for common functions.

* **Lecture 06: Convex Functions Advanced**
  * **Conjugacy**: The Fenchel Conjugate and its geometric interpretation.
  * **Quasiconvexity**: Definitions, sublevel sets, and properties.
  * **Log-Concavity**: Log-concave and Log-convex functions, integration properties.

### Part V: Standard Problems & Duality
* **Lecture 07: Standard Convex Problems**
  * **Linear Programming (LP)**: Diet problem, Transportation, Chebyshev center.
  * **Quadratic Programming (QP)**: Portfolio optimization, LASSO, Support Vector Machines.
  * **Reformulations**: Converting piecewise linear and norm minimization problems to standard forms.

* **Lecture 08: Conic Optimization**
  * **SOCP**: Second-Order Cone Programming and Robust Least Squares.
  * **SDP**: Semidefinite Programming, Matrix Norm Minimization, and MAX-CUT relaxation.
  * **Quasiconvex Optimization**: Bisection methods for fractional programming.

* **Lecture 09: Duality Theory**
  * **The Lagrangian**: Primal and Dual variables, the Dual Function.
  * **The Dual Problem**: Weak and Strong Duality, Slater's Condition.
  * **Optimality**: KKT Conditions (Stationarity, Primal/Dual Feasibility, Complementary Slackness).
  * **Sensitivity**: Interpretation of dual variables as shadow prices.
  * **Generalized Inequalities**: Duality for conic problems (SOCP/SDP).

### Part VI: Applications & Algorithms (Upcoming)
* **Lecture 10**: Approximation & Fitting
* **Lecture 11**: Statistical Estimation
* **Lecture 12**: Geometric Problems
* **Lecture 13**: Unconstrained Minimization
* **Lecture 14**: Equality-Constrained Minimization
* **Lecture 15**: Interior-Point Methods

---

## 🚀 Usage

To view the course notes locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Convex.git
   cd Convex
   ```

2. **Run a local server** (recommended for widgets/Pyodide):
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000`

---

## 📜 License

**License**: All my self-created lectures are licensed under Fair Use, and the same applies for the Whole Lecture.

*Note: The original course structure and primary references belong to their respective authors. These notes are a personal study aid.*
