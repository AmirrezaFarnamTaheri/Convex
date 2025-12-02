# Phase 1: Comprehensive Audit and Planning

## 1. Audit of Modules 00–05

### **Lecture 00: Linear Algebra Primer**
*   **Current State:** Covers subspaces, inner products, norms, orthogonality, PSD matrices, projections, least squares, QR/SVD.
*   **Gaps:** Lacks formal definition of lines vs. line segments, affine sets as translated subspaces (currently in 02, but preliminaries belong here), and the distinction between affine and convex combinations in a rigorous "zero to hero" way.
*   **Recommendation:** Move "Preliminaries" (lines, segments, formulas) from `CONTENT.txt` to Section 0 or 2.

### **Lecture 01: Introduction**
*   **Current State:** High-level overview, convex vs. non-convex landscapes, hierarchy, standard forms.
*   **Gaps:** Could benefit from the "Convex vs. Non-Convex Sets" visual and intuition from the new material to reinforce the landscape discussion.
*   **Recommendation:** Add Image 3 (Convex vs. Non-Convex Sets) here or in 02. (Likely better in 02 as the definition of convex set is there, but 01 motivates *why* we care).

### **Lecture 02: Convex Sets** (The main target)
*   **Current State:**
    *   Sec 1: Affine & Convex Sets.
    *   Sec 2: Canonical Sets (Hyperplanes, Polyhedra, Cones).
    *   Sec 3: Operations Preserving Convexity.
    *   Sec 4: Hyperplane Theorems.
    *   Sec 5: Cones & Dual Cones.
    *   Sec 6: Topology.
*   **New Material Alignment:** `CONTENT.txt` is basically a "Super Lecture 02". It offers much deeper proofs (e.g., 2 proofs for halfspace convexity), more examples (trigonometric polynomials), and rigorous definitions of affine/convex hulls.
*   **Action:**
    *   Refactor Section 1 to include rigorous "Affine sets as translated subspaces" and "solution sets of linear equations".
    *   Expand Section 2 to treat Balls, Ellipsoids, and Norm Balls with the "Matrix/Linear Map" perspective (Image 7, Image 8).
    *   Refactor Section 3 (Operations) to include "Intersection" (Image 11, 12, 13) and "Affine Maps" (Image 17, 18, 19).
    *   Expand Section 4 (Hyperplanes) with explicit Separating/Supporting proofs and images (35, 36, 37).
    *   Refactor Section 5 (Cones) to include "Proper Cones" (Image 27, 28) and Generalized Inequalities (Image 29, 30, 31).

### **Lecture 03: Convex Functions**
*   **Current State:** Defs, Epigraph, 1st/2nd order conditions, Operations, Conjugate.
*   **Gaps:** Operations preserving convexity (composition rules) can be bolstered by the "affine map" and "perspective map" rigor from `CONTENT.txt`.
*   **Recommendation:** The Perspective Map material in `CONTENT.txt` (Section 14) has deep connections here.

### **Lecture 04: Convex Optimization Problems**
*   **Current State:** LP, QP, SOCP, SDP.
*   **Recommendation:** The "Hyperbolic Cone" (Section 4.2 of `CONTENT.txt`, Image 20) and "LMI Solution Set" (Section 4.3, Image 21) provide the geometric "why" for SOCP and SDP. These should be cross-referenced or moved here.

### **Lecture 05: Duality**
*   **Current State:** Lagrangian, Dual Problem, KKT.
*   **Recommendation:** "Dual Cones" (Section 19 of Images, Section 5 of `CONTENT.txt`) is the foundation of Lagrange multipliers for conic problems. Ensure the rigorous dual cone definitions in 02 link forward to 05.

---

## 2. Mapping Matrix: New Material (`CONTENT.txt`) to Lectures

| New Material Section | Title | Target Lecture | Target Section | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **0** | Preliminaries (Inner prod, lines, segments) | **00** | Sec 0 or 2 | Foundation for geometry. |
| **1** | Affine combinations & sets | **02** | Sec 1 | Detailed "translated subspace" proof. |
| **2** | Convex combinations & sets | **02** | Sec 1 | Includes Convex Hull (Carathéodory). |
| **3** | Cones & convex cones | **02** | Sec 2 or 5 | Merge with existing Cone section. |
| **4** | Hyperplanes & halfspaces | **02** | Sec 2 | Proofs of convexity. |
| **5** | Balls & ellipsoids | **02** | Sec 2 | "Anatomy of Ellipsoid" (Image 7). |
| **6** | Norms & norm balls | **02** | Sec 2 | $L_1, L_2, L_\infty$ balls (Image 8). |
| **7** | Polyhedra | **02** | Sec 2 | Voronoi example (already in ex, move to main?). |
| **8** | PSD Cone | **02** | Sec 2 or 5 | Geometric view of PSD matrices. |
| **9** | Operations (Intersection, Affine, Preimage) | **02** | Sec 3 | Core machinery for "Recognizing Convexity". |
| **10** | Trig Polynomials Example | **02** | Sec 3 | "Infinite intersection" example (Image 12, 13). |
| **11** | Summary / Mental Map | **02** | Summary | Good wrap-up text. |
| **12** | Perspective Map | **02** / **03** | Sec 3 (Ops) | Deep dive on $P(x,t)=x/t$ (Image 23, 24). |
| **13** | Linear-Fractional Map | **02** | Sec 3 (Ops) | Composition of Affine + Perspective. |
| **14** | Proper Cones & Gen. Inequalities | **02** | Sec 5 | "Cone Zoo" (Image 27), Partial Orders. |

---

## 3. Image Mapping: Images 1–37 to Lectures

| Image ID | Description | Target Lecture | Section | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Line vs Segment | 00 | Prelims | New |
| **2** | Affine Set (Translated Subspace) | 02 | 1 | New |
| **3** | Convex vs Non-Convex | 02 | 1 | New |
| **4** | Convex Hull (Rubber Band) | 02 | 1 | New |
| **5** | Second-Order Cone | 02 | 2/5 | New |
| **6** | Hyperplane & Halfspace 3D | 02 | 2 | Replace/Augment |
| **7** | Anatomy of Ellipsoid | 02 | 2 | New |
| **8** | Unit Balls ($L_1, L_2, L_\infty$) | 02 | 2 | New |
| **9** | Polyhedron (Intersection) | 02 | 2 | New |
| **10** | PSD Cone (2x2) | 02 | 2/5 | New |
| **11** | Intersection of Sets (Venn) | 02 | 3 | New |
| **12** | Trig Poly (Infinite Intersection) | 02 | 3 | New |
| **13** | Trig Poly (Gonzo Shape) | 02 | 3 | New |
| **14** | Indicator Function Sublevel | 02 | 3 | New |
| **15** | Convex Hull of Non-Convex | 02 | 1 | New |
| **16** | Carathéodory’s Theorem | 02 | 1 | New |
| **17** | Affine Image (Projection) | 02 | 3 | New |
| **18** | Affine Preimage (Slice) | 02 | 3 | New |
| **19** | Division Counterexample | 02 | 3 | New |
| **20** | Hyperbolic Cone | 04 | SOCP | New |
| **21** | LMI Feasible Region | 04 | SDP | New |
| **22** | Image vs Preimage (Ball) | 02 | 3 | New |
| **23** | Perspective Map (Pinhole) | 02 | 3 | New |
| **24** | Perspective Domain | 02 | 3 | New |
| **25** | Linear-Fractional Warping | 02 | 3 | New |
| **26** | Composition Diagram | 02 | 3 | New |
| **27** | Cone Zoo (Proper/Improper) | 02 | 5 | New |
| **28** | Nonnegative Poly Cone | 02 | 5 | New |
| **29** | Visualizing $\preceq_K$ | 02 | 5 | New |
| **30** | Matrix Inequality Order | 02 | 5 | New |
| **31** | Minimum vs Minimal | 04 | Multi-obj | New (Move to 04?) |
| **32** | Dual Cone Geometry | 02 | 5 | New |
| **33** | Self-Dual Cones | 02 | 5 | New |
| **34** | Dual Norm Cones | 02 | 5 | New |
| **35** | Separating Hyperplane | 02 | 4 | Replace existing SVG |
| **36** | Supporting Hyperplane | 02 | 4 | New |
| **37** | Separation Failure | 02 | 4 | New |

---

## 4. Widget Audit

| Widget | File | Current Role | Verdict |
| :--- | :--- | :--- | :--- |
| **Ellipsoid Explorer** | `ellipsoid-explorer.js` | Visualize $P$ matrix effects | **Keep/Enhance**. Interactive counterpart to Image 7. |
| **Polyhedron Visualizer** | `polyhedron-visualizer.js` | Show intersection of halfspaces | **Refactor**. Image 9 is static; this widget allows rotation/param changes. Keep, but simplify if it's too heavy. |
| **Convex Geometry Lab** | `convex-geometry-lab.js` | General purpose hull/ops | **Refactor**. Can demonstrate "Operations" (Intersection, Hull). Ensure it matches Images 11, 15. |
| **Separating Hyperplane** | `separating-hyperplane.js` | Interactive separation | **Keep**. Image 35 is static; interactivity here is high value. Ensure it handles the "Failure" case (Image 37) if possible. |
| **Operations Builder** | `operations-builder.html` | Construct sets via ops | **Audit**. If it overlaps heavily with `convex-geometry-lab`, merge or remove. |

**Decision:** The existing widgets are high-quality ("Lab" style). The static images (37 of them!) provide the "textbook" clarity, while the widgets provide exploration. We will **retain** the main widgets but update their context to reference the new static figures (e.g., "Try exploring this concept interactively below...").

---

## 5. Draft Table of Contents for Lecture 02 (Refactored)

1.  **Affine Sets**
    *   Definition & Lines (Image 1 - *from L00 ref*)
    *   Subspaces & Translation (Image 2)
    *   Solution Sets of Linear Equations
2.  **Convex Sets & Hulls**
    *   Convex Combinations & Sets (Image 3)
    *   The Convex Hull (Image 4, 15, 16)
3.  **Canonical Convex Sets**
    *   Hyperplanes & Halfspaces (Image 6)
    *   Euclidean Balls & Ellipsoids (Image 7)
    *   Norm Balls (Image 8)
    *   Polyhedra (Image 9)
    *   The PSD Cone (Image 10)
4.  **Operations Preserving Convexity**
    *   Intersection (Image 11, 12, 13)
    *   Affine Functions (Images 17, 18, 22)
    *   Perspective Functions (Images 23, 24)
    *   Linear-Fractional Functions (Images 25, 26)
5.  **Separating & Supporting Hyperplanes**
    *   Separating Hyperplane Theorem (Image 35, 37)
    *   Supporting Hyperplane Theorem (Image 36)
6.  **Cones & Generalized Inequalities**
    *   Proper Cones (Image 27, 28)
    *   Generalized Inequalities (Image 29, 30, 31)
    *   Dual Cones (Image 32, 33, 34)
7.  **Topological Toolkit**
    *   Interior, Closure, Relative Interior
8.  **Exercises**
