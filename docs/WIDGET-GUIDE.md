# Widget Guide

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
