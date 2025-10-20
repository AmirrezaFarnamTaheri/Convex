// static/js/pyodide-manager.js
let pyodideInstance = null;

export async function getPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });
    // Pre-load common libraries
    await pyodideInstance.runPythonAsync(`
      import numpy as np
      import scipy
      import json
    `);
  }
  return pyodideInstance;
}

export async function runPythonAsync(code, context = {}) {
  const py = await getPyodide();
  return py.runPythonAsync(code);
}
