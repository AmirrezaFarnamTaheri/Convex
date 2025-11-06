# Contributing to Convex Optimization Course

Thank you for your interest in improving this educational resource! This guide will help you contribute effectively.

## 🎯 Types of Contributions

### 1. Content Improvements
- **Add Examples**: Create new worked examples demonstrating concepts
- **Enhance Explanations**: Clarify difficult topics or add intuition
- **Fix Errors**: Correct mathematical mistakes or typos
- **Add Exercises**: Design new practice problems with solutions

### 2. Interactive Widgets
- **New Visualizations**: Create widgets for unexplored concepts
- **Enhance Existing**: Improve UX, add features, or optimize performance
- **Fix Bugs**: Resolve issues in widget functionality

### 3. Design & Accessibility
- **UI/UX**: Improve visual design or user experience
- **Accessibility**: Add ARIA labels, keyboard navigation, screen reader support
- **Responsive Design**: Ensure mobile/tablet compatibility

### 4. Documentation
- **Tutorials**: Write guides for using features
- **Architecture**: Document technical implementation details
- **Translations**: Help make content available in other languages

## 📝 Content Standards

### Mathematical Rigor
All mathematical content must be:
- **Accurate**: Double-check all statements and proofs
- **Complete**: Include all necessary steps; no hand-waving
- **Precise**: Use standard notation and terminology
- **Referenced**: Cite sources for non-original material

### Writing Style
- **Clear**: Write for learners encountering concepts for the first time
- **Concise**: Respect the reader's time; avoid unnecessary verbosity
- **Progressive**: Build naturally from prerequisites
- **No Jargon**: Avoid marketing speak or AI-generated fluff
  - ❌ "Leverage cutting-edge techniques"
  - ✅ "Apply these methods"

### Proof Standards
Every proof should:
1. **State the claim** clearly before proving it
2. **Define variables** and assumptions explicitly
3. **Progress step-by-step** with clear logical flow
4. **Use proof-step divs** to structure the argument
5. **Conclude explicitly** (e.g., "This completes the proof.")

Example:
```html
<div class="proof">
  <h4>Proof</h4>
  <div class="proof-step">
    <strong>Setup:</strong> Let $C$ be a convex set and $x, y \in C$.
  </div>
  <div class="proof-step">
    <strong>Step 1:</strong> By definition of convexity...
  </div>
  <div class="proof-step">
    <strong>Conclusion:</strong> Therefore, $C$ is convex. ∎
  </div>
</div>
```

## 💻 Widget Development

### Technology Stack
- **D3.js v7** for visualizations
- **Pyodide** for Python computation (when needed)
- **Vanilla JavaScript** (ES6+); no frameworks
- **CSS Variables** for theming

### Widget Structure Template
```javascript
/**
 * Widget: [Name]
 * Description: [What it visualizes/demonstrates]
 * Version: 1.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function init[WidgetName](containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }
    // Widget implementation...
}
```

### Widget Best Practices
1. **Responsive**: Adapt to container size changes using ResizeObserver
2. **Accessible**: Include ARIA labels and keyboard controls
3. **Performant**: Optimize for smooth 60fps animations
4. **Error Handling**: Gracefully handle edge cases and invalid inputs
5. **Documentation**: Comment complex logic inline

## 🎨 Design Guidelines

### Color Palette
Use CSS variables defined in `styles.css`:
```css
--color-primary: #5eb3ff     /* Primary blue */
--color-accent: #5ffaad      /* Accent green */
--color-surface-1: #14161f   /* Card backgrounds */
--color-text-main: #e8eaf2   /* Body text */
```

### Typography
- **Headings**: Use defined h1-h6 with automatic styling
- **Body**: 1.85 line-height for readability
- **Math**: KaTeX for all mathematical expressions
- **Code**: Use `<code>` for inline, `<pre>` for blocks

### Spacing System
Use multiples of 8px spacing unit:
```css
margin: calc(var(--spacing-unit) * 4);  /* 32px */
```

## 🔧 Development Setup

### Prerequisites
- Git for version control
- A modern web browser
- Text editor (VS Code recommended)
- Basic HTML, CSS, JavaScript knowledge

### Local Development
1. **Clone and branch**:
   ```bash
   git clone https://github.com/username/Convex.git
   cd Convex
   git checkout -b feature/your-feature-name
   ```

2. **Test locally**:
   ```bash
   open index.html  # Or use a local server
   ```

3. **Commit with clear messages**:
   ```bash
   git commit -m "feat: Add Newton's method visualization"
   ```

### Commit Message Format
- `feat:` New feature or content
- `fix:` Bug fix or error correction
- `docs:` Documentation updates
- `style:` Formatting, CSS changes
- `refactor:` Code restructuring
- `perf:` Performance improvements

## 📋 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All changes tested in multiple browsers
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] No placeholders (TODO, FIXME) remain
- [ ] Content is mathematically verified

### PR Template
```markdown
## Description
[Brief summary]

## Type of Change
- [ ] Content improvement
- [ ] New widget
- [ ] Bug fix
- [ ] UI/UX enhancement

## Testing
[How you tested]

## Screenshots
[If applicable]
```

## 🐛 Reporting Issues

### Bug Reports Include
1. **Description**: What went wrong?
2. **Steps to Reproduce**: How to see the issue?
3. **Expected vs Actual**: What should happen vs what happens?
4. **Environment**: Browser, OS, screen size
5. **Screenshots**: If applicable

## 🎓 Key Success Factors (From Original Guide)

1. **Start Simple:** First widgets should be 2D, fast to load, visually immediate
2. **Iterate Weekly:** Push new content regularly; gather feedback immediately
3. **Link Everything:** Every new concept references prior concepts and prerequisites
4. **Use Color & Animation:** Humans learn by seeing things move and change
5. **Make It Playable:** Students should want to click, drag, explore—not just read
6. **Balance Theory & Practice:** Theory + intuition + practice
7. **Performance Matters:** Widgets that lag will frustrate users; prioritize performance
8. **Accessibility:** Colors aren't the only information carrier; use text labels
9. **Document as You Go:** Every widget and asset needs clear documentation
10. **Feedback Loop:** Share drafts early; iterate based on student confusion points

## 🏆 Recognition

Contributors are:
- Listed in README acknowledgments
- Credited in release notes
- Thanked in community discussions

## ❓ Good First Contributions

Not sure where to start?
1. Fix a typo or improve clarity in any lecture
2. Add a worked example to a familiar topic
3. Create a visualization for an interesting concept
4. Improve documentation or add code comments
5. Test widgets and report any issues

## 📧 Questions?

- **Discussions**: Use GitHub Discussions for questions
- **Bugs**: File an issue with reproduction steps
- **Feature Ideas**: Start a Discussion first
- **Help**: Tag maintainers in your PR/issue

## Final Notes

**Your teaching goal:** By the end of the course, students don't just understand convex optimization theory—they've *felt* it through interactive exploration. Algorithms converge visually on their screen. Duality clicks because they've seen it animated.

**Your engineering goal:** A maintainable codebase that future instructors can fork, extend, and customize. Clean file organization, clear widget templates, and good documentation make this possible.

**Questions to ask yourself as you build:**
- Would I want to interact with this widget as a student?
- Can I explain what each file does in one sentence?
- Would a colleague be able to add a new lecture without asking me how?

---

**Remember**: Every contribution, no matter how small, makes this course better for learners worldwide. Thank you for being part of this project!

*This guide is itself open to improvement. Suggestions welcome!*
