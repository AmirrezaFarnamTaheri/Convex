# Changelog

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
- Removed redundant/low-value widgets (`strong-convexity`).
