// static/js/pyodide-manager.js
let pyodideInstance = null;

export async function getPyodide() {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });
    // Explicitly load packages before running code that uses them
    await pyodideInstance.loadPackage(["numpy", "scipy"]);

    // Pre-load common libraries to warm up
    await pyodideInstance.runPythonAsync(`
      import numpy as np
      import scipy
      import json
      print("Python environment initialized")
    `);
  }
  return pyodideInstance;
}

export async function runPythonAsync(code, context = {}) {
  const py = await getPyodide();
  // If context is provided, we might want to set globals, but for now we assume code handles it or globals are set separately
  return py.runPythonAsync(code);
}
