# Placeholder Templates

Below are ready-to-use starter templates for each lecture and widget type.

## Lecture HTML Template

**File:** `topics/NN-slug/index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>[LECTURE_NUMBER]. [TITLE] — Convex Optimization</title>
  <link rel="stylesheet" href="../../static/css/styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</head>
<body>
  <!-- Header with navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand">
        <img src="../../static/img/logo.svg" class="logo" alt="logo" />
        <a href="../../index.html" style="text-decoration:none;color:inherit">
          <strong>Convex Optimization</strong>
        </a>
      </div>
      <nav class="nav">
        <a href="../../index.html#sessions">All Lectures</a>
        <a href="#widgets">Interactive</a>
        <a href="#readings">Readings</a>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main class="container" style="padding: 32px 0 60px;">
    <!-- Lecture header -->
    <article class="card" style="margin-bottom: 32px;">
      <h1 style="margin-top: 0;">[NN]. [FULL LECTURE TITLE]</h1>
      <div class="meta">
        Date: [DATE] · Duration: [90 MIN] · Tags: [tag1], [tag2]
      </div>

      <!-- Brief introduction -->
      <section style="margin-top: 16px;">
        <p><strong>Overview:</strong> [2–3 sentence summary of what we'll learn and why it matters]</p>
        <p><strong>Prerequisites:</strong> [Link to required background; e.g., "Linear Algebra Primer" or "Lecture 02"]</p>
      </section>
    </article>

    <!-- Learning objectives -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Learning Objectives</h2>
      <p>After this lecture, you should understand:</p>
      <ul style="line-height: 1.8;">
        <li>[Objective 1]</li>
        <li>[Objective 2]</li>
        <li>[Objective 3]</li>
      </ul>
    </section>

    <!-- Main lecture content -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Key Concepts</h2>

      <h3>Concept 1: [NAME]</h3>
      <p>[Detailed explanation with inline LaTeX: $\mathcal{C}$ is convex if ...]</p>
      <p>Visual intuition: [Description of accompanying diagram]</p>

      <h3>Concept 2: [NAME]</h3>
      <p>[Another concept with examples]</p>

      <!-- Include images as needed -->
      <figure style="margin: 16px 0; text-align: center;">
        <img src="./images/diagrams/[DIAGRAM].svg" alt="[Description]" style="max-width: 100%; height: auto;" />
        <figcaption style="font-size: 13px; color: var(--muted); margin-top: 8px;">
          [Caption with key insight]
        </figcaption>
      </figure>
    </section>

    <!-- Interactive widgets -->
    <section class="card" id="widgets" style="margin-bottom: 32px;">
      <h2>Interactive Widgets</h2>
      <p>Below are tools to explore the concepts interactively. Try tweaking parameters to build intuition.</p>

      <!-- Widget 1 -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 1 TITLE]</h3>
        <p>[Brief description of what this widget does]</p>
        <div id="widget-1" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>

      <!-- Widget 2 -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 2 TITLE]</h3>
        <p>[Description]</p>
        <div id="widget-2" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>

      <!-- Widget 3 (if exists) -->
      <div style="margin: 24px 0; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px;">
        <h3 style="margin-top: 0;">[WIDGET 3 TITLE]</h3>
        <p>[Description]</p>
        <div id="widget-3" style="width: 100%; height: 400px; position: relative;">
          <!-- Widget will be rendered here -->
        </div>
      </div>
    </section>

    <!-- Readings -->
    <section class="card" id="readings" style="margin-bottom: 32px;">
      <h2>Readings & Resources</h2>
      <ul class="link-list">
        <li><strong>Boyd & Vandenberghe, Convex Optimization:</strong> Section [X.Y] — [topic]</li>
        <li><strong>Course slides:</strong> [Link if available]</li>
        <li><strong>Additional resources:</strong> [Papers, blog posts, videos]</li>
      </ul>
    </section>

    <!-- Example problems -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Example Problems</h2>

      <h3>Example 1: [Problem title]</h3>
      <p>[Problem statement and worked solution]</p>

      <h3>Example 2: [Problem title]</h3>
      <p>[Another example]</p>
    </section>

    <!-- Exercises (optional) -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Exercises</h2>
      <p>Try these problems to deepen your understanding. Solutions are provided at the end of the course.</p>
      <ol style="line-height: 2;">
        <li>[Exercise 1]</li>
        <li>[Exercise 2]</li>
        <li>[Exercise 3]</li>
      </ol>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <p style="margin: 0;">
        © <span id="year"></span> Convex Optimization Course ·
        <a href="../../README.md" style="color: var(--brand);">About</a>
      </p>
    </div>
  </footer>

  <!-- Load Pyodide for Python widgets (optional) -->
  <script defer src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"></script>

  <!-- Widget loaders -->
  <script type="module" src="./widgets/js/[WIDGET1].js"></script>
  <script type="module" src="./widgets/js/[WIDGET2].js"></script>
  <!-- <script type="module" src="./widgets/js/[WIDGET3].js"></script> -->

  <!-- Global utilities -->
  <script src="../../static/js/math-renderer.js"></script>
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>
</body>
</html>
```

## JavaScript Widget Template

**File:** `topics/NN-slug/widgets/js/[widget-name].js`

```javascript
/**
 * Widget: [Widget Name]
 *
 * Description: [What does this widget do?]
 *
 * Uses: Canvas/SVG for rendering, event listeners for interactivity
 *
 * DOM target: #widget-1 (or appropriate ID)
 */

export function initWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Widget container #${containerId} not found.`);
    return;
  }

  // Create canvas or SVG
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // State
  let state = {
    // Initialize state here
    param1: 1.0,
    param2: 0.5,
  };

  // UI controls (sliders, buttons, etc.)
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = 'margin-bottom: 12px; display: flex; gap: 12px; flex-wrap: wrap;';

  const slider1Label = document.createElement('label');
  slider1Label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  slider1Label.textContent = 'Parameter 1:';

  const slider1 = document.createElement('input');
  slider1.type = 'range';
  slider1.min = '0';
  slider1.max = '10';
  slider1.step = '0.1';
  slider1.value = state.param1;
  slider1.addEventListener('input', (e) => {
    state.param1 = parseFloat(e.target.value);
    render();
  });

  slider1Label.appendChild(slider1);
  controlPanel.appendChild(slider1Label);
  container.insertBefore(controlPanel, canvas);

  // Render function
  function render() {
    // Clear canvas
    ctx.fillStyle = 'var(--bg)'; // Won't work; use actual color
    ctx.fillStyle = '#0b0d12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on state
    ctx.fillStyle = '#7cc5ff';
    ctx.font = '16px system-ui';
    ctx.fillText(`param1 = ${state.param1.toFixed(2)}`, 16, 32);

    // [Add actual drawing logic here]
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
  });

  // Initial render
  render();
}

// Auto-initialize if this is a module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initWidget('widget-1'));
} else {
  initWidget('widget-1');
}
```

## Python Widget Template (Pyodide Wrapper)

**File:** `topics/NN-slug/widgets/py/[widget-name].py`

```python
"""
Widget: [Widget Name]

This Python script runs in Pyodide (in-browser Python).
It provides computation/analysis that JS calls.

Usage from JS:
  const py = await getPyodide();
  await py.runPythonAsync(`
    import sys; sys.path.append('.')
    from widgets_py_widget_name import analyze
    result = analyze(params)
  `);
"""

import numpy as np
from scipy.optimize import minimize
# ... other imports

def analyze(params):
    """
    Main function that JS calls.

    Args:
        params: dict with problem parameters

    Returns:
        result: dict with output (vectors, matrices, scalars, etc.)
    """

    # Extract parameters
    n = params.get('n', 10)
    lambda_ = params.get('lambda', 0.1)

    # Compute
    x_opt = np.random.randn(n)  # Placeholder
    obj_value = np.sum(x_opt**2)

    # Return results
    return {
        'x_opt': x_opt.tolist(),  # Convert to list for JSON serialization
        'obj_value': float(obj_value),
        'status': 'solved'
    }


# Example: gradient descent
def gradient_descent(f_grad, x0, alpha=0.01, max_iter=100):
    """
    Simple gradient descent.

    Args:
        f_grad: function that returns (f(x), grad_f(x))
        x0: initial point
        alpha: step size
        max_iter: max iterations

    Returns:
        trajectory (list of x iterates)
    """
    trajectory = [x0.copy()]
    x = x0.copy()

    for k in range(max_iter):
        f_val, grad = f_grad(x)
        if np.linalg.norm(grad) < 1e-6:
            break
        x = x - alpha * grad
        trajectory.append(x.copy())

    return trajectory
```
