## Problem Storage & Organization

### Location

Problems stored in `/data/problems.json` as a comprehensive registry, or separately as `/data/problems/01-introduction.json`, etc.

### Problem Entry Schema

{
  "id": "01-001",                    // Format: NN-XXX (lecture-problem)
  "lecture": "01-introduction",       // Must match a lecture slug
  "type": "verification",            // One of: verification, computation, modeling, derivation, algorithm, coding
  "difficulty": "easy",              // One of: easy, medium, hard
  "title": "Prove x² is convex",
  "statement": "Show that f(x) = x² satisfies Jensen's inequality for all real x and y.",
  "hints": [                         // Array of escalating hints
    "Start with the definition: f(λx + (1-λ)y) ≤ λf(x) + (1-λ)y)",
    "Expand the left side: (λx + (1-λ)y)²",
    "Compare coefficients and use (x-y)² ≥ 0"
  ],
  "solution": "Detailed solution with steps...",
  "learningObjectives": [           // Tags linking to lecture concepts
    "jensen-inequality",
    "convexity-definition",
    "proof-technique"
  ],
  "estimatedTime": 15,              // Minutes to solve
  "relatedProblems": ["01-002", "03-005"],  // Cross-lecture problem links
  "notes": "This is a warm-up problem. Good for students new to proofs."
}

### Problem Query Interface

Developers can filter problems by:
- Lecture: `problems.filter(p => p.lecture === '01-introduction')`
- Type: `problems.filter(p => p.type === 'verification')`
- Difficulty: `problems.filter(p => p.difficulty === 'easy')`
- Learning objective: `problems.filter(p => p.learningObjectives.includes('convexity'))`

### Storage Approaches

**Option A: Single File**
```
/data/problems.json
  └─ { "problems": [ {...}, {...}, ... ] }
```
Pros: Simple, single source of truth
Cons: Large file (200+ problems), may be slow to parse

**Option B: Lecture-Separated**
```
/data/problems/
  ├─ 01-introduction.json
  ├─ 02-convex-sets.json
  └─ ...11 files total...
```
Pros: Modular, easier to edit by lecture, faster queries
Cons: Requires aggregation if you want all problems

**Recommendation:** Use Option B (lecture-separated) with a `/data/problems-index.json` that lists all problems for quick filtering.
