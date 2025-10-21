/**
 * Widget: Eigenvalue Decomposition & PSD Explorer
 *
 * Description: Shows the geometric interpretation of eigenvalues/eigenvectors for a 2x2 matrix
 *              and visualizes its quadratic form to check for positive semidefiniteness.
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initEigenvalueExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await getPyodide();

    container.innerHTML = '';

    let matrix = [[1, 0.5], [0.5, 1]];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.className = "matrix-controls";

    const matrixLabels = ['a', 'b', 'c', 'd'];
    const sliders = [];
    matrixLabels.forEach((label, i) => {
        const controlGroup = document.createElement("div");
        const labelEl = document.createElement("label");
        labelEl.textContent = `Matrix[${Math.floor(i/2)}, ${i%2}]`;
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
        controlGroup.append(labelEl, slider);
        controls.appendChild(controlGroup);
        sliders.push(slider);
    });
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 40, right: 20, bottom: 40, left: 40 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

    svg.append("text")
        .attr("x", 0)
        .attr("y", -height/2 - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Eigenvectors & Quadratic Form (xᵀAx=1)");

    const x = d3.scaleLinear().domain([-2, 2]).range([-width/2, width/2]);
    const y = d3.scaleLinear().domain([-2, 2]).range([height/2, -height/2]);

    svg.append("g").call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const quadraticFormPath = svg.append("path")
        .attr("fill", "var(--color-primary-light)")
        .attr("stroke", "var(--color-primary)")
        .style("opacity", 0.7);
    const eigenvectors = svg.append("g");

    async function updateVisualization() {
        await pyodide.globals.set("mat_val", matrix);
        const code = `
import numpy as np
mat = np.array(mat_val)
try:
    eigvals, eigvecs = np.linalg.eigh(mat)
    # Check if matrix is positive definite to draw ellipse
    is_pd = np.all(eigvals > 1e-6)
    radii = 1 / np.sqrt(np.abs(eigvals)) if is_pd else None
    angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0])) if is_pd else 0

    result = {
        "vals": eigvals.tolist(),
        "vecs": eigvecs.T.tolist(),
        "radii": radii.tolist() if radii is not None else None,
        "angle": angle,
        "is_pd": is_pd
    }
except np.linalg.LinAlgError:
    result = {"vals": [], "vecs": [], "radii": None, "angle": 0, "is_pd": False}
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
            .attr("stroke", (d,i) => result.vals[i] > 0 ? "var(--color-accent)" : "var(--color-danger)")
            .attr("stroke-width", 3);

        if(result.is_pd && result.radii) {
            const angleRad = result.angle * Math.PI / 180;
            const ellipseData = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(angle => {
                 const x_ = result.radii[0] * Math.cos(angle);
                 const y_ = result.radii[1] * Math.sin(angle);
                 const rotated_x = x_ * Math.cos(angleRad) - y_ * Math.sin(angleRad);
                 const rotated_y = x_ * Math.sin(angleRad) + y_ * Math.cos(angleRad);
                 return [rotated_x, rotated_y];
            });
            quadraticFormPath
                .datum(ellipseData)
                .transition()
                .duration(200)
                .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])));
        } else {
            quadraticFormPath.transition().duration(200).attr("d", null);
        }
    }

    updateVisualization();
}
