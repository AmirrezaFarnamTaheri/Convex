# Changelog

## [3.1.1] - 2025-11-29

### Rigorous Linear Algebra & Advanced Convexity

#### Content Updates
- **Lecture 00 (Linear Algebra Primer):**
  - Complete "zero-to-hero" rewrite focusing on matrix analysis for optimization.
  - Added detailed sections on Algebraic Invariants (trace cyclicity, spectral identities).
  - Added geometric derivation of the Operator Norm via the Rayleigh quotient.
  - Added rigorous construction of SVD and Polar Decomposition.
  - Added Matrix Calculus section (gradients of trace, determinant, log-det).
  - Added comprehensive advanced problem set (Probelms 8-14).
- **Lecture 03 (Convex Functions):**
  - Added advanced exercises on Inverse Functions (P3.8), Classification (P3.9), and p-norm concavity (P3.10).

## [3.1.0] - 2025-11-22

### Content Consolidation & Cleanup

#### General
- **Site Structure:** Consolidate lecture list logic into `index.html` and removed redundant `content/lectures.json` and `static/js/app.js`.
- **Cleanup:** Removed `content/` directory and temporary verification scripts.
- **Writing Style:** Removed "AI-ish" jargon and "marketing" language from all lectures for a rigorous, academic tone.

#### Lecture Refinements
- **Lecture 00 (Linear Algebra):**
  - Removed dramatic language ("Crown Jewel").
  - Verified proof rigor.
  - Ensured exercises are complete and at the end.
- **Lecture 01 (Introduction):**
  - Refined "Fundamental Theorem" proof.
  - Standardized exercise solutions.
  - Clarified "Why This Matters" section.
- **Lecture 02 (Convex Sets):**
  - Verified affine/convex set definitions.
  - Ensured exercises are complete and at the end.
- **Lecture 03 (Convex Functions):**
  - Corrected strong convexity discussion ("Important" vs "Powerful").
  - Verified all exercise solutions.

## [3.0.1] - 2025-11-21

### Content & Widget Refinements (Lectures 00-03)

#### Content Improvements
- **Lecture 00 (Linear Algebra):**
  - Moved exercises to the end of the lecture for better flow.
  - Expanded proofs for Rank-Nullity, SVD, and Orthogonality.
  - Removed "AI-ish" jargon for a more professional academic tone.
- **Lecture 01 (Introduction):**
  - Refined "Loss + Regularizer" section for clarity.
  - Added new exercise P1.5 on uniqueness of strictly convex optimization.
  - Moved exercises to end.
- **Lecture 02 (Convex Sets):**
  - Added detailed step-by-step proof for the Separating Hyperplane Theorem.
  - Clarified definitions of Affine and Convex sets.
  - Moved exercises to end.
- **Lecture 03 (Convex Functions):**
  - Expanded Second-Order Condition proof.
  - Moved exercises to end.

#### Widget Enhancements
- **Convex Combination Explorer (L01):** Added KaTeX support for rendering mathematical equations in the widget output.
- **Polyhedron Visualizer (L02):** Improved UX for adding constraints via dragging, with visual hints (arrow pointing to infeasible side).
- **General:** Removed deprecated `modern-widgets.css` references from all lecture HTML files.

## [3.0.0] - 2025-11-20

### Major Refactor: Design System & Pedagogy Update

#### Design System
- **Unified Stylesheet:** Consolidated all styles into `static/css/convex-unified.css`. Deprecated `modern-widgets.css`.
- **Dark Theme:** Implemented a consistent dark theme (Surface/Base/Text hierarchy) across all pages and widgets.
- **Typography:** Standardized on 'Inter' and 'Source Code Pro'.
- **UI Components:** Standardized buttons, sliders, and dropdowns for all interactive widgets.

#### Content Updates (Lectures 00-03)
- **Lecture 00 (Linear Algebra):**
  - Added `least-squares-visualizer.js` (3D geometric interpretation).
  - Enhanced `svd-approximator.js` with error/residual visualization.
  - Enhanced `condition-number.js` to show "zig-zag" optimization path.
  - Rigorous rewrite of content to focus on optimization prerequisites.
- **Lecture 01 (Introduction):**
  - Enhanced `convex-vs-nonconvex.js` to visualize Jensen's inequality chord.
  - Enhanced `landscape-viewer.js` with better 3D physics simulation.
  - Content refined to define convexity rigorously.
- **Lecture 02 (Convex Sets):**
  - Enhanced `convex-set-checker.js` to show counter-example segment for non-convex sets.
  - Enhanced `separating-hyperplane.js` with interactive drag and collision detection.
- **Lecture 03 (Convex Functions):**
  - Merged `strong-convexity.js` into `tangent-line-explorer.js`.
  - Enhanced `hessian-heatmap.js` with interactive 3D probe of local curvature.
  - Enhanced `epigraph-visualizer.js` to show slicing and sublevel sets.

#### Widget Enhancements
- All widgets updated to use the new `getPyodide()` shared manager.
- Improved resize handling with `ResizeObserver`.
- Added loading states and error handling.
- Removed redundant/low-value widgets (`strong-convexity.js`).
