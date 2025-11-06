# Convex Optimization: An Interactive Course

A comprehensive, mathematically rigorous course on convex optimization with interactive visualizations, step-by-step proofs, and hands-on examples. This self-contained resource takes learners from foundational linear algebra through advanced optimization algorithms.

## 📚 Course Structure

### Core Theory (Lectures 00-05)
- **Lecture 00**: Linear Algebra Primer — Vectors, matrices, norms, projections, SVD, eigenvalues
- **Lecture 01**: Introduction to Optimization — Problem formulation, least squares, gradient descent
- **Lecture 02**: Convex Sets — Definitions, operations, polyhedra, cones, separation theorems
- **Lecture 03**: Convex Functions — First/second-order conditions, operations, conjugate functions
- **Lecture 04**: Convex Optimization Problems — LP, QP, SOCP, SDP, problem transformations
- **Lecture 05**: Duality Theory — Lagrangian duality, KKT conditions, strong/weak duality

### Applications (Lectures 06-08)
- **Lecture 06**: Approximation & Fitting — Least squares, regularization, robust regression, sparse recovery
- **Lecture 07**: Statistical Estimation & ML — MLE, logistic regression, SVMs, GLMs
- **Lecture 08**: Geometric Problems — Distance problems, MVEE, Chebyshev center, placement

### Algorithms (Lectures 09-11)
- **Lecture 09**: Unconstrained Minimization — Gradient descent, Newton's method, quasi-Newton, acceleration
- **Lecture 10**: Equality-Constrained Minimization — KKT systems, null-space methods, augmented Lagrangian
- **Lecture 11**: Interior-Point Methods — Barrier methods, central path, polynomial-time complexity, conic optimization

## ✨ Features

### Mathematical Rigor
- **Complete Proofs**: Every major theorem includes detailed, step-by-step proofs
- **Worked Examples**: 5-8 fully solved examples per lecture demonstrating concepts
- **Problem Sets**: 10+ exercises per lecture with varying difficulty levels
- **Zero Prerequisites**: Lecture 00 provides all necessary linear algebra background

### Interactive Learning
- **30+ Interactive Widgets**: Visualize optimization landscapes, convergence trajectories, and geometric concepts
- **Real-Time Exploration**: Adjust parameters and observe algorithm behavior instantly
- **D3.js Visualizations**: High-quality, responsive graphics that adapt to your device
- **Pyodide Integration**: Run Python-based computations directly in your browser

### Modern Design
- **Dark Theme**: Eye-friendly interface optimized for extended study sessions
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile
- **Table of Contents**: Collapsible navigation sidebar for easy reference
- **LaTeX Rendering**: Beautiful mathematical typesetting via KaTeX
- **Smooth Animations**: Engaging transitions and visual feedback

### Educational Excellence
- **Progressive Difficulty**: Concepts build naturally from foundations to advanced topics
- **Cross-References**: Extensive links showing how ideas connect across lectures
- **Historical Context**: Notes on who developed key results and when
- **Practical Guidance**: When to use which algorithm, numerical considerations
- **No Jargon**: Clear, precise mathematical language without marketing speak

## 🚀 Getting Started

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Convex.git
   cd Convex
   ```

2. **Open in your browser**:
   ```bash
   open index.html
   # Or on Linux: xdg-open index.html
   # Or on Windows: start index.html
   ```

3. **Start with Lecture 00** if you need linear algebra review, or jump to **Lecture 01** if you're ready for optimization.

### Recommended Learning Path
1. **Beginners**: Follow lectures 00 → 01 → 02 → 03 sequentially
2. **With Linear Algebra Background**: Start at Lecture 01
3. **Applications Focus**: Complete 00-05, then explore lectures 06-08
4. **Algorithms Focus**: Complete 00-05, then dive into lectures 09-11

### Prerequisites
- **None for Lecture 00**: Start here if you need linear algebra review
- **Basic Linear Algebra**: Required for Lecture 01 onward (or complete Lecture 00)
- **Multivariable Calculus**: Helpful but not essential; concepts are introduced as needed
- **Programming**: Not required, but Python knowledge enhances widget exploration

## 🔧 Technical Details

### Technologies Used
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Math Rendering**: [KaTeX](https://katex.org/) for fast, beautiful LaTeX
- **Visualizations**: [D3.js v7](https://d3js.org/) for interactive graphics
- **Python Backend**: [Pyodide](https://pyodide.org/) for in-browser computation
- **Fonts**: Inter (UI), Crimson Pro (serif), Source Code Pro (monospace)

### Browser Support
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: Full support on iOS Safari and Chrome for Android
- **Fallbacks**: Graceful degradation for older browsers

### File Structure
```
Convex/
├── index.html                  # Homepage with lecture grid
├── static/
│   ├── assets/                 # SVGs, GIFs, and images
│   │   ├── branding/          # Logos and icons
│   │   └── topics/            # Lecture-specific assets
│   ├── css/                    # Stylesheets
│   │   ├── styles.css         # Main stylesheet
│   │   ├── improved-styles.css # Theme support
│   │   └── widget-enhancements.css # Widget styling
│   └── js/                     # Global JavaScript
│       ├── math-renderer.js   # KaTeX initialization
│       ├── theme-switcher.js  # Theme toggle
│       ├── toc.js             # Table of contents
│       └── pyodide-manager.js # Python backend
├── topics/                     # Lecture content
│   ├── 00-linear-algebra-primer/
│   │   ├── index.html         # Lecture HTML
│   │   └── widgets/           # Interactive widgets
│   │       └── js/            # Widget JavaScript
│   ├── 01-introduction/
│   ├── ...
│   └── 11-interior-point-methods/
└── docs/
    ├── CONTRIBUTING.md         # Contribution guidelines
    ├── ARCHITECTURE.md         # Technical architecture
    └── PEDAGOGY.md             # Educational philosophy
```

## 🎯 Learning Outcomes

After completing this course, you will be able to:

1. **Recognize Convex Problems**: Identify when a problem is convex and formulate it properly
2. **Prove Convexity**: Use first/second-order conditions and composition rules
3. **Apply Duality**: Derive dual problems and interpret dual variables
4. **Implement Algorithms**: Code gradient descent, Newton's method, and interior-point methods
5. **Choose Methods**: Select appropriate algorithms based on problem structure
6. **Analyze Convergence**: Understand convergence rates and complexity
7. **Model Real Problems**: Formulate machine learning, statistics, and engineering problems as convex optimization

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- **Content**: Add examples, exercises, or applications
- **Widgets**: Create new interactive visualizations
- **Accessibility**: Improve screen reader support and keyboard navigation
- **Translations**: Help make content available in other languages
- **Bug Fixes**: Report or fix any errors you find

## 📖 References

This course draws from and extends several excellent resources:

1. **Boyd & Vandenberghe** (2004). *Convex Optimization*. Cambridge University Press.
   - The definitive textbook; our lectures follow its structure
2. **Nesterov** (2004). *Introductory Lectures on Convex Optimization*.
   - Advanced algorithmic perspectives
3. **Rockafellar** (1970). *Convex Analysis*.
   - Comprehensive mathematical foundations
4. **Ben-Tal & Nemirovski** (2001). *Lectures on Modern Convex Optimization*.
   - Conic programming and applications

### Additional Resources
- **CVX**: MATLAB software for disciplined convex programming
- **CVXPY**: Python-embedded modeling language for convex optimization
- **Mosek**: Commercial optimizer with academic licenses
- **Stanford EE364a**: Stephen Boyd's legendary course (videos online)

## 📜 License

This educational resource is provided for academic and personal learning. Content is original unless otherwise cited.

## 🙏 Acknowledgments

Special thanks to:
- **Stephen Boyd** for pioneering accessible convex optimization education
- **The D3.js team** for making beautiful visualizations possible
- **The KaTeX project** for fast, high-quality math rendering
- **All contributors** who have improved this course

## 📧 Contact

For questions, suggestions, or collaboration:
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [Your contact if desired]

---

**Start your journey into convex optimization today!** Open `index.html` and begin with Lecture 00.

*Last updated: November 2025*
