# Phase 1: Audit and Integration Plan (Modules 00-05)

## 1. Audit of Existing Content

### Lecture 00: Linear Algebra Primer
*   **Current State**: Covers vectors, matrices, basic operations, fundamental subspaces, inner products, norms, orthogonality, PSD matrices, projections, and least squares. Includes SVD and QR.
*   **Gaps**:
    *   Lacks formal definition of lines and line segments in the "Preliminaries" section.
    *   Lacks explicit definition of "affine set" (currently only discusses subspaces).
*   **Widgets**:
    *   `rank-nullspace` (Keep)
    *   `norm-geometry` (Keep)
    *   `orthogonality` (Keep)
    *   `matrix-geometry` (Keep)
    *   `hessian-landscape` (Keep)
    *   `least-squares` (Keep)
    *   `svd-approximator` (Keep)
    *   `condition-number` (Keep)

### Lecture 02: Convex Sets
*   **Current State**: Covers affine/convex combinations (definitions), convex hull, hyperplanes, halfspaces, norm balls, ellipsoids, polyhedra, cones (SOC, PSD), operations preserving convexity, separation/supporting theorems, topological concepts.
*   **Gaps**:
    *   Section 1.1 defines "Affine Set" but could be enriched with the "Translated Subspace" characterization and proof from `CONTENT.txt`.
    *   The "Operations that Preserve Convexity" section is present but can be expanded with the rigorous proofs and "trigonometric polynomial" example from `CONTENT.txt`.
    *   Separating Hyperplane theorem proof is constructive; could add the failure case analysis for non-convex sets.
*   **Widgets**:
    *   `ellipsoid-explorer` (Keep)
    *   `polyhedron-visualizer` (Keep - useful dynamic visualization)
    *   `convex-geometry-lab` (Keep - unifies drawing/checking)
    *   `separating-hyperplane` (Keep - interactive proof concept)

## 2. Content Mapping (`CONTENT.txt`)

| Block | Topic | Target Lecture | Action |
| :--- | :--- | :--- | :--- |
| **0. Preliminaries** | Inner product, norms, lines, segments | **Lecture 00**, Section 2 (enrichment) or new Section 0. | Add definitions of line/segment. |
| **1. Affine Sets** | Affine combinations, definition, translated subspace proof, solution set of linear eq. | **Lecture 02**, Section 1 | Enrich Section 1.1 with "Translated Subspace" theorem/proof. |
| **2. Convex Sets** | Convex combinations, definition, equivalent forms, intersection with lines. | **Lecture 02**, Section 1 | Refine Section 1.2. |
| **3. Cones** | Cones, convex cones, equivalence of definitions. | **Lecture 02**, Section 2.4 | Enrich Section 2.4. |
| **4. Hyperplanes** | Hyperplanes, halfspaces, proofs of convexity. | **Lecture 02**, Section 2.1 | Enrich Section 2.1 with "Preimage of convex set" proof. |
| **5. Balls/Ellipsoids** | Euclidean balls, ellipsoids, multiple interpretations (norm ball, linear image). | **Lecture 02**, Section 2.2 | Enrich Section 2.2 with "Affine Image" proof. |
| **6. Norms** | Norm axioms, norm balls convex (proofs), norm cones. | **Lecture 00** / **Lecture 02** | Ensure rigorous proofs in L02 or L00. |
| **7. Polyhedra** | Definition, convexity proof. | **Lecture 02**, Section 2.3 | Refine Section 2.3. |
| **8. PSD Cone** | Definition, convexity proofs (quadratic forms, eigen). | **Lecture 02**, Section 2.4 | Enrich Section 2.4. |
| **9. Operations** | Intersection, affine image/preimage. | **Lecture 02**, Section 3 | Enrich Section 3 with formal proofs. |
| **10. Trig Poly Example** | Intersection of infinite halfspaces. | **Lecture 02**, Section 3 | Add as advanced example. |
| **Perspective** | Perspective map, linear-fractional map. | **Lecture 02**, Section 3.3 | Enrich Section 3.3 with detailed algebra. |
| **Generalized Ineq.** | Proper cones, properties of $\preceq_K$. | **Lecture 02**, Section 5 | Enrich Section 5. |

## 3. Image Mapping (`IMAGES DESCRIPTION.txt`)

*   **Image 1 (Line vs Segment)**: Lecture 00 (Preliminaries) or Lecture 02 (Intro). **Decision: Lecture 00**.
*   **Image 2 (Affine Set as Translated Subspace)**: Lecture 02, Section 1.
*   **Image 3 (Convex vs Non-Convex)**: Lecture 02, Section 1 (Replace/Augment Figure 1.1).
*   **Image 4 (Convex Hull)**: Lecture 02, Section 1 (Replace/Augment Figure 1.2).
*   **Image 5 (Second Order Cone)**: Lecture 02, Section 2 (Cones).
*   **Image 6 (Hyperplane/Halfspace)**: Lecture 02, Section 2.1.
*   **Image 7 (Ellipsoid Anatomy)**: Lecture 02, Section 2.2.
*   **Image 8 (Norm Balls)**: Lecture 00, Section 2 (Replace/Augment Figure 2.2).
*   **Images 9-37**: To be mapped in Phases 3-5.

## 4. Phase 2 Detailed Plan (Preliminaries & Affine Sets)

1.  **Lecture 00**:
    *   Update **Section 0** or **Section 2** to include formal definitions of **Line** and **Line Segment** using the parametrization $x = \theta x_1 + (1-\theta)x_2$.
    *   Add **Image 1**.
2.  **Lecture 02**:
    *   Rewrite **Section 1.1** to include the "Translated Subspace" theorem and proof ($C = x_0 + V$).
    *   Add **Image 2**.
    *   Update **Glossary** with "Affine Set", "Translated Subspace".
    *   Update **Diagrams Index** for Images 1-8.
