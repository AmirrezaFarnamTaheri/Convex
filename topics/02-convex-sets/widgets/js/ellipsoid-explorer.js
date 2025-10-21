/**
 * Widget: Ellipsoid Explorer & Parameterization
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initEllipsoidExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="ellipsoid-explorer-widget">
            <div class="widget-controls" id="ellipsoid-controls"></div>
            <div id="plot-container"></div>
        </div>
    `;

    const controlsContainer = container.querySelector("#ellipsoid-controls");
    const plotContainer = container.querySelector("#plot-container");

    let P = [[2, 0.5], [0.5, 1]]; // Matrix P for (x-xc)ᵀP(x-xc) ≤ 1
    let xc = [0, 0];

    const sliders = {};
    const controlSetup = [
        { id: 'p00', label: 'P₀₀', min: 0.1, max: 5, step: 0.1, value: P[0][0] },
        { id: 'p01', label: 'P₀₁', min: -3, max: 3, step: 0.1, value: P[0][1] },
        { id: 'p11', label: 'P₁₁', min: 0.1, max: 5, step: 0.1, value: P[1][1] },
        { id: 'xc0', label: 'x_c', min: -4, max: 4, step: 0.1, value: xc[0] },
        { id: 'xc1', label: 'y_c', min: -4, max: 4, step: 0.1, value: xc[1] },
    ];

    controlSetup.forEach(c => {
        const div = document.createElement("div");
        div.innerHTML = `<label for="${c.id}">${c.label}:</label><input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">`;
        controlsContainer.appendChild(div);
        sliders[c.id] = div.querySelector('input');
        sliders[c.id].addEventListener('input', updateFromSliders);
    });

    function updateFromSliders() {
        P[0][0] = +sliders.p00.value;
        P[0][1] = +sliders.p01.value;
        P[1][0] = +sliders.p01.value; // Symmetric
        P[1][1] = +sliders.p11.value;
        xc[0] = +sliders.xc0.value;
        xc[1] = +sliders.xc1.value;
        drawEllipsoid();
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const ellipsoidPath = svg.append("path").attr("fill", "var(--color-primary-light)").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const centerPoint = svg.append("circle").attr("r", 5).attr("fill", "var(--color-accent)");
    const errorText = svg.append("text").attr("x", width/2).attr("y", height/2).attr("text-anchor", "middle").attr("fill", "var(--color-danger)").style("display", "none");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
def generate_ellipsoid(P_val, xc_val):
    P = np.array(P_val)
    xc = np.array(xc_val)
    try:
        # P must be positive definite
        np.linalg.cholesky(P)
        eigvals, eigvecs = np.linalg.eigh(np.linalg.inv(P))
        radii = np.sqrt(eigvals)
        angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))

        return {"radii": radii.tolist(), "angle": angle, "center": xc.tolist(), "error": None}
    except np.linalg.LinAlgError:
        return {"radii": [], "angle": 0, "center": xc.tolist(), "error": "Matrix P is not positive definite."}
`;
    await pyodide.runPythonAsync(pythonCode);
    const py_generate_ellipsoid = pyodide.globals.get('generate_ellipsoid');

    async function drawEllipsoid() {
        const result = await py_generate_ellipsoid(P, xc).then(r => r.toJs());

        if (result.error) {
            ellipsoidPath.attr("d", null);
            errorText.text(result.error).style("display", "block");
        } else {
            errorText.style("display", "none");
            const angleRad = result.angle * Math.PI / 180;

            const ellipseData = d3.range(0, 2 * Math.PI + 0.1, 0.1).map(angle => {
                 const x_ = result.radii[0] * Math.cos(angle);
                 const y_ = result.radii[1] * Math.sin(angle);
                 const rotated_x = x_ * Math.cos(angleRad) - y_ * Math.sin(angleRad);
                 const rotated_y = x_ * Math.sin(angleRad) + y_ * Math.cos(angleRad);
                 return [rotated_x + result.center[0], rotated_y + result.center[1]];
            });
            ellipsoidPath.datum(ellipseData).attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])));
        }

        centerPoint.attr("cx", x(result.center[0])).attr("cy", y(result.center[1]));
    }

    drawEllipsoid();
}
