/**
 * Widget: Barrier Method Path Tracer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scipy"]);
    return pyodide;
}
const pyodidePromise = initPyodide();

export async function initBarrierPathTracer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    let t = 1; // Barrier parameter

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center;";
    const tSlider = document.createElement("input");
    tSlider.type = "range"; tSlider.min = 0.1; tSlider.max = 50; tSlider.step = 0.1; tSlider.value = t;
    tSlider.addEventListener("input", () => { t = parseFloat(tSlider.value); updateSolution(); });
    controls.append("Barrier parameter (t):", tSlider);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const svg = d3.select(container).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0, 1.5]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1.5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const feasibleRegion = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}];
    svg.append("polygon").attr("points", feasibleRegion.map(p => `${x(p.x)},${y(p.y)}`).join(" ")).attr("fill", "lightblue").attr("stroke", "black");

    const solutionPoint = svg.append("circle").attr("r", 6).attr("fill", "red");
    const centralPathLine = svg.append("path").attr("fill", "none").attr("stroke", "red").attr("stroke-dasharray", "4").attr("stroke-width", 2);

    const pyodideCode = `
import numpy as np
from scipy.optimize import minimize
c = np.array([-1.0, -1.0])
A = np.array([[-1.0, 0.0], [0.0, -1.0], [1.0, 0.0], [0.0, 1.0]])
b = np.array([0.0, 0.0, 1.0, 1.0])
def objective(x, t):
    if np.any(b - A.dot(x) <= 0): return np.inf
    return t * c.dot(x) - np.sum(np.log(b - A.dot(x)))
def solve_for_t(t):
    res = minimize(lambda x: objective(x, t), np.array([0.5, 0.5]), method='Nelder-Mead')
    return res.x.tolist()
`;

    async function updateSolution() {
        const pyodide = await pyodidePromise;
        await pyodide.runPythonAsync(pyodideCode);
        const solve_for_t = pyodide.globals.get('solve_for_t');
        const [solX, solY] = await solve_for_t(t);
        solutionPoint.attr("cx", x(solX)).attr("cy", y(solY));
    }

    async function tracePath() {
        const pyodide = await pyodidePromise;
        await pyodide.runPythonAsync(pyodideCode);
        const solve_for_t = pyodide.globals.get('solve_for_t');
        const pathPoints = [];
        for (let t_val of d3.range(0.1, 50, 1)) {
            const [solX, solY] = await solve_for_t(t_val);
            pathPoints.push({x: solX, y: solY});
        }
        centralPathLine.datum(pathPoints).attr("d", d3.line().x(d=>x(d.x)).y(d=>y(d.y)));
    }

    updateSolution();
    tracePath();
}
