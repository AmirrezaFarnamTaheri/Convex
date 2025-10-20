## Widget Loading & Initialization Pattern

### 1. HTML Setup in Lecture Page

Every lecture includes widget containers in the HTML:

<div id="widget-1" class="widget-container" style="width: 100%; height: 400px;"></div>
<div id="widget-2" class="widget-container"></div>

Then load widgets as ES modules AFTER the container exists:

<script type="module">
  import { initConvexVsNonconvex } from './widgets/js/convex-vs-nonconvex.js';
  initConvexVsNonconvex('widget-1');
</script>

### 2. Widget Initialization Signature

Every widget exports a single async function that takes a container ID:

export async function initWidgetName(containerId) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container ${containerId} not found`);

  // Setup canvas, SVG, or DOM elements
  // Initialize state
  // Attach event listeners
  // Call initial render
}

### 3. State Management Pattern

Widgets should follow this minimal state pattern:

let state = {
  param1: 1.0,
  param2: 0.5,
  // ... other state
};

function updateState(updates) {
  Object.assign(state, updates);
  render();  // Always re-render on state change
}

### 4. Pyodide Integration Pattern

For widgets that need Python computation:

let pyodideReady = null;

async function getPyodide() {
  if (!pyodideReady) {
    pyodideReady = loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    }).then(py => {
      // Pre-load common libraries once
      return py.runPythonAsync(`import numpy as np; import scipy`).then(() => py);
    });
  }
  return pyodideReady;
}

async function solveWithPython(inputData) {
  const py = await getPyodide();
  const result = await py.runPythonAsync(`
    import json
    data = json.loads('''${JSON.stringify(inputData)}''')
    # Computation...
    json.dumps({'result': output})
  `);
  return JSON.parse(result);
}
