/**
 * Widget: Primal-Dual Geometry Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scipy"]);
    return pyodide;
}
const pyodidePromise = initPyodide();

export async function initDualityVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    let c = [-1, -2];
    let A = [[1, 1], [-1, 1], [1, -1]];
    let b = [4, 2, 2];

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = (container.clientWidth / 2) - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const primalSvg = d3.select(container).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const dualSvg = d3.select(container).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const primalX = d3.scaleLinear().domain([-1, 5]).range([0, width]);
    const primalY = d3.scaleLinear().domain([-1, 5]).range([height, 0]);
    primalSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(primalX));
    primalSvg.append("g").call(d3.axisLeft(primalY));

    const dualX = d3.scaleLinear().domain([-3, 3]).range([0, width]);
    const dualY = d3.scaleLinear().domain([-3, 3]).range([height, 0]);
    dualSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(dualX));
    dualSvg.append("g").call(d3.axisLeft(dualY));


    async function drawVisuals() {
        const pyodide = await pyodidePromise;

        // --- Primal Visualization ---
        await pyodide.globals.set("c", c);
        await pyodide.globals.set("A_ub", A);
        await pyodide.globals.set("b_ub", b);
        const primalCode = `
from scipy.spatial import HalfspaceIntersection
from scipy.optimize import linprog
import numpy as np
interior_point = np.array([0.5, 0.5])
halfspaces = np.c_[A_ub, -np.array(b_ub)]
hs = HalfspaceIntersection(halfspaces, interior_point)
vertices = hs.intersections
ch = np.arctan2(vertices[:,1] - np.mean(vertices[:,1]), vertices[:,0] - np.mean(vertices[:,0]))
vertices = vertices[np.argsort(ch)]
res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=[(0, None), (0, None)])
{"vertices": vertices.tolist(), "sol": res.x.tolist()}
        `;
        const primalData = await pyodide.runPythonAsync(primalCode).then(d => d.toJs());
        primalSvg.append("polygon").datum(primalData.vertices).attr("points", d => d.map(p => `${primalX(p[0])},${primalY(p[1])}`).join(" ")).attr("fill", "lightblue");
        primalSvg.append("circle").attr("cx", primalX(primalData.sol[0])).attr("cy", primalY(primalData.sol[1])).attr("r", 5).attr("fill", "red");

        // --- Dual Visualization ---
        const c_dual = b;
        const A_dual = A.map((_, colIndex) => A.map(row => row[colIndex]));
        const b_dual = c.map(val => -val);
        await pyodide.globals.set("c_dual", c_dual);
        await pyodide.globals.set("A_dual", A_dual);
        await pyodide.globals.set("b_dual", b_dual);
        const dualCode = `
from scipy.spatial import HalfspaceIntersection
from scipy.optimize import linprog
import numpy as np
interior_point = np.array([0.5, 0.5, 0.5]) # Guess for dual interior point
halfspaces = np.c_[A_dual, -np.array(b_dual)]
# The dual is 3D, projecting to 2D is non-trivial. We will just plot the solution.
res = linprog(c_dual, A_ub=A_dual, b_ub=b_dual, bounds=[(0, None), (0, None), (0, None)])
res.x.tolist()
        `;
        const dualSol = await pyodide.runPythonAsync(dualCode).then(s => s.toJs());
        dualSvg.append("circle").attr("cx", dualX(dualSol[0])).attr("cy", dualY(dualSol[1])).attr("r", 5).attr("fill", "blue");
    }

    drawVisuals();
}
