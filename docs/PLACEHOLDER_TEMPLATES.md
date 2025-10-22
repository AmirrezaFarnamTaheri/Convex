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
<body class="lecture-page">
  <!-- REQUIRED: Every lecture needs this header -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand">
        <img src="../../static/assets/branding/logo.svg" class="logo" alt="logo" />
        <a href="../../index.html" style="text-decoration:none;color:inherit">
          <strong>Convex Optimization</strong>
        </a>
      </div>
      <nav class="nav">
        <a href="../../index.html#sessions">All Lectures</a>
        <a href="#widgets">Interactive</a>
        <a href="#readings">Readings</a>
      nav>
    </div>
  </header>

  <main class="container" style="padding: 32px 0 60px;">
    <!-- REQUIRED: Every lecture needs a title and metadata -->
    <article class="card" style="margin-bottom: 32px;">
      <h1 style="margin-top: 0;">[NN]. [FULL LECTURE TITLE]</h1>
      <div class="meta">
        Date: [DATE] · Duration: [90 MIN] · Tags: [tag1], [tag2]
      </div>
    </article>

    <!-- REQUIRED: Learning objectives - the "what students will know" section -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Learning Objectives</h2>
      <ul style="line-height: 1.8;">
        <li>[Objective 1]</li>
        <li>[Objective 2]</li>
        <li>[Objective 3]</li>
      </ul>
    </section>

    <!-- OPTIONAL: Background section - especially useful for early lectures or complex topics -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Background & Prerequisites</h2>
      <p>[Link to required background; e.g., "Linear Algebra Primer" or "Lecture 02"]</p>
    </section>

    <!-- REQUIRED: Core concepts - the "why and what" section -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Key Concepts</h2>
      <p>[Detailed explanation with inline LaTeX: $\\mathcal{C}$ is convex if ...]</p>
    </section>

    <!-- RECOMMENDED: Interactive widgets - the "hands-on" section -->
    <section id="widgets" class="card" style="margin-bottom: 32px;">
      <h2>Interactive Widgets</h2>
      <div id="widget-1" class="widget-container" style="width: 100%; height: 400px;"></div>
    </section>

    <!-- REQUIRED: Readings and references -->
    <section id="readings" class="card" style="margin-bottom: 32px;">
      <h2>Readings & Resources</h2>
      <ul class="link-list">
        <li><strong>Boyd & Vandenberghe, Convex Optimization:</strong> Section [X.Y]</li>
      </ul>
    </section>

    <!-- OPTIONAL: Example problems with solutions -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Example Problems</h2>
      <p>[Problem statement and worked solution]</p>
    </section>

    <!-- OPTIONAL: Practice problems or exercises -->
    <section class="card" style="margin-bottom: 32px;">
      <h2>Exercises</h2>
      <ol style="line-height: 2;">
        <li>[Exercise 1]</li>
      </ol>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p style="margin: 0;">© <span id="year">2025</span> Convex Optimization Course</p>
    </div>
  </footer>

  <!-- Load widgets as ES modules -->
  <script type="module">
    import { initWidgetName } from './widgets/js/widget-name.js';
    initWidgetName('widget-1');
  </script>
</body>
</html>
```

## JavaScript Widget Template (with Lifecycle)

**File:** `topics/NN-slug/widgets/js/[widget-name].js`

```javascript
/**
 * Widget: [Widget Name]
 *
 * This template demonstrates the standard widget lifecycle:
 * 1. `init`: Setup canvas, DOM, and event listeners. Called once.
 * 2. `updateState`: Modify the state object.
 * 3. `render`: Redraw the visualization based on the current state. Called after every state change.
 */

// --- STATE ---
// Central state object. All rendering should be based on this.
let state = {
  param1: 1.0,
  param2: 0.5,
  mouseX: 0,
  mouseY: 0,
};

// --- DOM ELEMENTS ---
// Keep references to DOM elements to avoid repeated queries.
let container, canvas, ctx, controlPanel;

/**
 * Updates the state and triggers a re-render.
 * @param {object} updates - An object with new state values to merge.
 */
function updateState(updates) {
  Object.assign(state, updates);
  render(); // Always re-render after a state change.
}

/**
 * Main render function. Reads from the `state` object to draw.
 */
function render() {
  if (!ctx) return;
  // Clear canvas
  ctx.fillStyle = '#0b0d12'; // Use hardcoded theme color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw based on state
  ctx.fillStyle = '#7cc5ff';
  ctx.font = '16px system-ui';
  ctx.fillText(`param1 = ${state.param1.toFixed(2)}`, 20, 40);
  ctx.fillText(`Mouse: (${state.mouseX}, ${state.mouseY})`, 20, 60);
}

/**
 * Sets up event listeners for user interaction.
 */
function setupEventListeners() {
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    updateState({
      mouseX: e.clientX - rect.left,
      mouseY: e.clientY - rect.top,
    });
  });

  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
  });
}

/**
 * Creates and appends UI controls (sliders, buttons) to the control panel.
 */
function setupControls() {
  const slider1Label = document.createElement('label');
  slider1Label.innerHTML = `Parameter 1: <input type="range" min="0" max="10" step="0.1" value="${state.param1}">`;
  const slider1 = slider1Label.querySelector('input');
  slider1.addEventListener('input', (e) => {
    updateState({ param1: parseFloat(e.target.value) });
  });
  controlPanel.appendChild(slider1Label);
}

/**
 * Initialization function. Exported and called from the lecture's HTML.
 * @param {string} containerId - The ID of the DOM element to host the widget.
 */
export function initWidgetName(containerId) {
  container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Widget container #${containerId} not found.`);
    return;
  }

  // --- SETUP ---
  // Create and append core elements once.
  controlPanel = document.createElement('div');
  controlPanel.className = 'widget-controls';
  container.appendChild(controlPanel);

  canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);
  ctx = canvas.getContext('2d');

  // --- INITIALIZATION ---
  setupControls();
  setupEventListeners();

  // --- FIRST RENDER ---
  render();
}
```

## Python Widget Template

**File:** `topics/NN-slug/widgets/py/[widget-name].py`

```python
"""
This script runs in Pyodide and provides computation for a widget.
It should export a main function that JavaScript can call.
"""
import numpy as np

def analyze_data(params):
    """
    Analyzes data and returns results.
    Args:
        params (dict): A dictionary of parameters from the JavaScript side.
    Returns:
        dict: A dictionary of results to be sent back to JavaScript.
    """
    # Example: Perform a simple computation
    data = np.array(params.get('data', [1, 2, 3]))
    mean = np.mean(data)
    std_dev = np.std(data)

    return {
        'mean': float(mean),
        'std_dev': float(std_dev),
        'status': 'success'
    }
```
