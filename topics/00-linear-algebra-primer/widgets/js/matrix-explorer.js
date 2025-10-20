/**
 * Widget: Eigenvalue Decomposition & PSD Explorer
 *
 * Description: Shows the geometric interpretation of eigenvalues/eigenvectors for a 2x2 matrix
 *              and visualizes its quadratic form to check for positive semidefiniteness.
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    return pyodide;
}

const pyodidePromise = initPyodide();

export async function initEigenvalueExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let matrix = [[1, 0.5], [0.5, 1]];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;";

    const sliders = [];
    ['m00', 'm01', 'm10', 'm11'].forEach((id, i) => {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = -2;
        slider.max = 2;
        slider.step = 0.1;
        slider.value = matrix[Math.floor(i/2)][i%2];
        slider.oninput = () => {
            matrix[Math.floor(i/2)][i%2] = parseFloat(slider.value);
            // Symmetric matrix for this demo
            if(i === 1) { matrix[1][0] = parseFloat(slider.value); sliders[2].value = slider.value; }
            if(i === 2) { matrix[0][1] = parseFloat(slider.value); sliders[1].value = slider.value; }
            updateVisualization();
        };
        controls.appendChild(slider);
        sliders.push(slider);
    });
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

    const x = d3.scaleLinear().domain([-2, 2]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-2, 2]).range([height/2, -height/2]);

    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const quadraticFormPath = svg.append("path")
        .attr("fill", "lightblue")
        .style("opacity", 0.5);
    const eigenvectors = svg.append("g");

    async function updateVisualization() {
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("mat_val", matrix);
        const code = `
import numpy as np
mat = np.array(mat_val)
try:
    eigvals, eigvecs = np.linalg.eigh(mat)
    if np.all(eigvals > 1e-6):
        radii = 1 / np.sqrt(eigvals)
        angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))
        result = {"vals": eigvals.tolist(), "vecs": eigvecs.T.tolist(), "radii": radii.tolist(), "angle": angle}
    else:
        result = {"vals": eigvals.tolist(), "vecs": eigvecs.T.tolist(), "radii": None, "angle": None}
except np.linalg.LinAlgError:
    result = {"vals": [], "vecs": [], "radii": None, "angle": None}
result
        `;
        const result = await pyodide.runPythonAsync(code).then(r => r.toJs());

        eigenvectors.selectAll("line")
            .data(result.vecs)
            .join("line")
            .attr("x1", x(0))
            .attr("y1", y(0))
            .attr("x2", (d, i) => x(d[0] * result.vals[i]))
            .attr("y2", (d, i) => y(d[1] * result.vals[i]))
            .attr("stroke", (d,i) => result.vals[i] > 0 ? "green" : "red")
            .attr("stroke-width", 2);

        if(result.radii) {
            const angleRad = result.angle * Math.PI / 180;
            const ellipseData = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(angle => {
                 const x_ = result.radii[0] * Math.cos(angle);
                 const y_ = result.radii[1] * Math.sin(angle);
                 const rotated_x = x_ * Math.cos(angleRad) - y_ * Math.sin(angleRad);
                 const rotated_y = x_ * Math.sin(angleRad) + y_ * Math.cos(angleRad);
                 return [rotated_x, rotated_y];
            });
            quadraticFormPath.datum(ellipseData).attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
        } else {
            quadraticFormPath.attr("d", null);
        }
    }

    updateVisualization();
}
