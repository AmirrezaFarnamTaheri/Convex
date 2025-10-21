/**
 * Widget: LP Visualizer & Simplex Animator
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

const pyodidePromise = getPyodide();

export async function initLPVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    let c = [-1, -2];
    let A = [[1, 1], [-1, 1], [1, -1]];
    let b = [4, 2, 2];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center;";
    const startButton = document.createElement("button");
    startButton.textContent = "Animate Simplex";
    startButton.onclick = runAnimation;
    controls.appendChild(startButton);
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

    const x = d3.scaleLinear().domain([-1, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 5]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const feasibleRegionGroup = svg.append("g");
    const simplexPathGroup = svg.append("g");

    async function drawFeasibleRegion() {
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("A_ub", A);
        await pyodide.globals.set("b_ub", b);
        const code = `
from scipy.spatial import HalfspaceIntersection
import numpy as np
interior_point = np.array([0.5, 0.5]) # A guess for an interior point
halfspaces = np.c_[A_ub, -np.array(b_ub)]
hs = HalfspaceIntersection(halfspaces, interior_point)
vertices = hs.intersections
ch = np.arctan2(vertices[:,1] - np.mean(vertices[:,1]), vertices[:,0] - np.mean(vertices[:,0]))
vertices = vertices[np.argsort(ch)]
vertices.tolist()
        `;
        try {
            const vertices = await pyodide.runPythonAsync(code).then(v => v.toJs());
            feasibleRegionGroup.selectAll("polygon")
                .data([vertices])
                .join("polygon")
                .attr("points", d => d.map(p => `${x(p[0])},${y(p[1])}`).join(" "))
                .attr("fill", "lightblue")
                .attr("stroke", "black");
        } catch (e) {
            console.error("Could not compute feasible region:", e);
        }
    }

    async function runAnimation() {
        simplexPathGroup.selectAll("*").remove();
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("c", c);
        await pyodide.globals.set("A_ub", A);
        await pyodide.globals.set("b_ub", b);
        const code = `
from scipy.optimize import linprog
path = []
def callback(res):
    path.append(res.x.tolist())
res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=[(0, None), (0, None)], method='highs-ds', callback=callback)
path
        `;
        const path = await pyodide.runPythonAsync(code).then(p => p.toJs());

        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            simplexPathGroup.append("circle")
                .attr("cx", x(point[0]))
                .attr("cy", y(point[1]))
                .attr("r", 5)
                .attr("fill", "orange");

            if (i > 0) {
                const prevPoint = path[i-1];
                simplexPathGroup.append("line")
                    .attr("x1", x(prevPoint[0])).attr("y1", y(prevPoint[1]))
                    .attr("x2", x(point[0])).attr("y2", y(point[1]))
                    .attr("stroke", "red").attr("stroke-width", 2);
            }
            await new Promise(r => setTimeout(r, 500));
        }
    }

    drawFeasibleRegion();
}
