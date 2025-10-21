/**
 * Widget: Gradient Descent Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    return pyodide;
}
const pyodidePromise = initPyodide();

export async function initGradientDescentVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await pyodidePromise;

    container.innerHTML = '';

    const functions = {
        "Quadratic": { func: (x, y) => x**2 + y**2, py_grad: "np.array([2*x, 2*y])", domain: {x: [-5, 5], y: [-5, 5]} },
        "Rosenbrock": { func: (x, y) => (1 - x)**2 + 100 * (y - x**2)**2, py_grad: "np.array([-2*(1-x) - 400*x*(y-x**2), 200*(y-x**2)])", domain: {x:[-2,2], y:[-1,3]} },
    };
    let selectedFunctionName = "Quadratic";
    let learningRate = 0.1;
    let running = false;
    let startPoint = null;

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;";
    const dropdown = document.createElement("select");
    Object.keys(functions).forEach(name => { dropdown.add(new Option(name, name)); });
    dropdown.onchange = () => { selectedFunctionName = dropdown.value; reset(); };
    const lrSlider = document.createElement("input");
    lrSlider.type = "range"; lrSlider.min = 0.01; lrSlider.max = 0.5; lrSlider.step = 0.01; lrSlider.value = learningRate;
    lrSlider.oninput = () => learningRate = parseFloat(lrSlider.value);
    const startButton = document.createElement("button");
    startButton.textContent = "Start";
    startButton.onclick = () => { if (!running && startPoint) runAnimation(); };
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.onclick = reset;
    controls.append("Function:", dropdown, "LR:", lrSlider, startButton, resetButton);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const svg = d3.select(container).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const contoursGroup = svg.append("g");
    const pathGroup = svg.append("g");
    const interactionLayer = svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all").on("click", (event) => {
        if(running) return;
        const [mx, my] = d3.pointer(event);
        startPoint = { x: x.invert(mx), y: y.invert(my) };
        pathGroup.selectAll("*").remove();
        pathGroup.append("circle").attr("cx", mx).attr("cy", my).attr("r", 5).attr("fill", "red");
    });

    function drawContours() {
        const { func, domain } = functions[selectedFunctionName];
        x.domain(domain.x);
        y.domain(domain.y);
        const grid = new Float32Array(width * height);
        for (let j = 0; j < height; ++j) for (let i = 0; i < width; ++i) grid[j * width + i] = func(x.invert(i), y.invert(j));

        contoursGroup.selectAll("path").remove();
        contoursGroup.selectAll("path").data(d3.contours().size([width, height]).thresholds(20)(grid)).join("path").attr("d", d3.geoPath()).attr("fill", "none").attr("stroke", "#ccc");
    }

    function reset() {
        running = false;
        startPoint = null;
        pathGroup.selectAll("*").remove();
        drawContours();
    }

    async function runAnimation() {
        running = true;
        const pyodide = await pyodidePromise;
        await pyodide.globals.set("start_point", [startPoint.x, startPoint.y]);
        await pyodide.globals.set("learning_rate", learningRate);
        await pyodide.globals.set("py_grad_str", functions[selectedFunctionName].py_grad);
        const pathData = await pyodide.runPythonAsync(`
import numpy as np
path = [start_point]
current_point = np.array(start_point)
for _ in range(100):
    x, y = current_point
    grad = eval(py_grad_str)
    next_point = current_point - learning_rate * grad
    path.append(next_point.tolist())
    if np.linalg.norm(next_point - current_point) < 1e-4: break
    current_point = next_point
path
        `).then(p => p.toJs());

        for (let i = 1; i < pathData.length; i++) {
            const p1 = pathData[i-1], p2 = pathData[i];
            pathGroup.append("line").attr("x1", x(p1[0])).attr("y1", y(p1[1])).attr("x2", x(p2[0])).attr("y2", y(p2[1])).attr("stroke", "red").attr("stroke-width", 2);
            pathGroup.append("circle").attr("cx", x(p2[0])).attr("cy", y(p2[1])).attr("r", 3).attr("fill", "red");
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        running = false;
    }
    reset();
}
