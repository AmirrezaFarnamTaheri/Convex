## Content Schemas

### /content/lectures.json Schema

Every lecture entry must follow this structure:

{
  "slug": "02-convex-sets",           // URL-safe identifier, numeric prefix + hyphen-separated
  "title": "Convex Sets",             // Short, clear title (30-50 chars recommended)
  "date": "2025-10-28",               // YYYY-MM-DD format, scheduled teaching date
  "duration": "90 min",               // Standard format for consistency
  "blurb": "...",                     // 1-2 sentence summary (80-120 chars), elevator pitch
  "tags": ["geometry", "foundational"],  // Array of lowercase tags, max 5 per lecture
  "slides": "https://...",            // External slides link or null if not available
  "is_optional": false,               // Boolean: true only for LA Primer (Lecture 00)
  "prerequisites": ["01-introduction"] // Array of lecture slugs that must be completed first
}

Required fields: slug, title, date, duration, blurb, tags
Optional fields: slides, is_optional, prerequisites

---

### /data/problems.json Schema

Every problem entry must follow this structure:

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

---

### /content/resources.json Schema

Every resource entry must follow this structure:

{
  "title": "Convex Optimization by Boyd & Vandenberghe",
  "href": "https://web.stanford.edu/~boyd/cvxbook/"
}
