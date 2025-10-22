## File & Folder Naming Conventions

### Lecture Folders
- Location: `/topics/`
- Format: `NN-slug` where NN is 00-11 (zero-padded), slug is kebab-case
- Examples: `00-linear-algebra-primer`, `01-introduction`, `09-unconstrained-minimization`
- Pattern: Numeric prefix ensures natural ordering without extra sorting logic

### Widget Files
- Location: `/topics/NN-slug/widgets/js/` or `/topics/NN-slug/widgets/py/`
- Naming: `kebab-case-with-type.js` (not camelCase, not snake_case)
- Examples: `convex-vs-nonconvex.js`, `jensen-visualizer.js`, `gradient-descent-viz.js`
- Rationale: Kebab-case matches URL conventions and improves readability

### Shared Components
- Location: `/shared/visualization/`, `/shared/computation/`, `/shared/styles/`
- Naming: PascalCase for classes, camelCase for utilities
- Examples: `ContourPlotter.js`, `OptimizationAnimator.js`, `convexityChecker.py`
- Purpose: Reuse across multiple lectures/widgets

### Image Assets
- Lecture-specific: `/static/assets/topics/NN-slug/`
- Shared illustrations: `/static/assets/shared/illustrations/`
- Branding: `/static/assets/branding/`
- Format: `kebab-case-descriptor.svg` or `.png`
- Examples: `jensen-inequality-illustration.svg`, `portfolio-allocation.jpg`

### Data Files
- Location: `/data/` for shared, `/topics/NN-slug/data/` for lecture-specific
- Format: Prefer JSON for structured data, CSV for tables
- Examples: `/data/iris.csv`, `/data/problems.json`, `/topics/01-intro/data/sample-functions.json`
