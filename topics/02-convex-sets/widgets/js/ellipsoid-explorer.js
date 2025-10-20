/**
 * Widget: Ellipsoid Explorer & Parameterization
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    return pyodide;
}

const pyodidePromise = initPyodide();

export async function initEllipsoidExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let A = [[2, 0.5], [0.5, 1]];
    let xc = [0, 0];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;";

    const sliders = {};
    ['a00', 'a01', 'a11', 'xc0', 'xc1'].forEach(id => {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = -3;
        slider.max = 3;
        slider.step = 0.1;

        if(id.startsWith('a')) {
             slider.value = A[parseInt(id[1])][parseInt(id[2])];
        } else {
             slider.value = xc[parseInt(id[2])];
        }

        slider.oninput = () => {
            if(id.startsWith('a')) {
                A[parseInt(id[1])][parseInt(id[2])] = parseFloat(slider.value);
                if(id === 'a01') { A[1][0] = parseFloat(slider.value); sliders['a10'].value = slider.value; }
            } else {
                xc[parseInt(id[2])] = parseFloat(slider.value);
            }
            drawEllipsoid();
        };
        controls.appendChild(slider);
        sliders[id] = slider;
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
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const ellipsoidPath = svg.append("path").attr("fill", "lightblue").attr("stroke", "black");

    async function drawEllipsoid() {
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("A_val", A);
        await pyodide.globals.set("xc_val", xc);
        const code = `
import numpy as np
A = np.array(A_val)
xc = np.array(xc_val)
try:
    L = np.linalg.cholesky(A)
    t = np.linspace(0, 2*np.pi, 100)
    u = np.vstack([np.cos(t), np.sin(t)])
    points = np.linalg.inv(L).T @ u + xc[:, np.newaxis]
    result = points.T.tolist()
except np.linalg.LinAlgError:
    result = []
result
        `;

        const points = await pyodide.runPythonAsync(code).then(p => p.toJs());
        if(points.length > 0) {
            const lineGenerator = d3.line().x(d => x(d[0])).y(d => y(d[1]));
            ellipsoidPath.datum(points).attr("d", lineGenerator);
        } else {
            ellipsoidPath.attr("d", null);
        }
    }

    drawEllipsoid();
}
