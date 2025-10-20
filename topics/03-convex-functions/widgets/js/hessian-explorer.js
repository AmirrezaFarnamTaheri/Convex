/**
 * Widget: Hessian Eigenvalue Heatmap
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    return pyodide;
}

const pyodidePromise = initPyodide();

export async function initHessianExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const functions = {
        "x^2 + y^2": { py_hessian: "np.array([[2.0, 0.0], [0.0, 2.0]])" },
        "x^3 + y^3": { py_hessian: "np.array([[6*x, 0], [0, 6*y]])" },
        "sin(x) + cos(y)": { py_hessian: "np.array([[-np.sin(x), 0], [0, -np.cos(y)]])" },
    };
    let selectedFunction = "x^2 + y^2";

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px;";
    const dropdown = document.createElement("select");
    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
    dropdown.onchange = () => {
        selectedFunction = dropdown.value;
        drawHeatmap();
    };
    controls.appendChild(dropdown);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const canvas = d3.select(container).append("canvas")
        .attr("width", width)
        .attr("height", height)
        .style("margin-left", `${margin.left}px`)
        .style("margin-top", `${margin.top}px`);

    const context = canvas.node().getContext("2d");

    async function drawHeatmap() {
        const pyodide = await pyodidePromise;
        const { py_hessian } = functions[selectedFunction];

        const resolution = 10; // pixels per grid cell
        for (let i = 0; i < width; i += resolution) {
            for (let j = 0; j < height; j += resolution) {
                const x_val = (i / width) * 4 - 2; // Map pixel to domain [-2, 2]
                const y_val = (j / height) * 4 - 2;

                await pyodide.globals.set("x", x_val);
                await pyodide.globals.set("y", y_val);

                const code = `
import numpy as np
hessian = ${py_hessian}
eigenvalues = np.linalg.eigvals(hessian)
eigenvalues.tolist()
                `;
                const eigenvalues = await pyodide.runPythonAsync(code).then(e => e.toJs());

                let color = "rgba(128, 128, 128, 0.5)"; // Indefinite (gray)
                if (eigenvalues[0] > 1e-6 && eigenvalues[1] > 1e-6) {
                    color = "rgba(0, 255, 0, 0.5)"; // Convex (green)
                } else if (eigenvalues[0] < -1e-6 && eigenvalues[1] < -1e-6) {
                    color = "rgba(255, 0, 0, 0.5)"; // Concave (red)
                }

                context.fillStyle = color;
                context.fillRect(i, j, resolution, resolution);
            }
        }
    }

    drawHeatmap();
}
