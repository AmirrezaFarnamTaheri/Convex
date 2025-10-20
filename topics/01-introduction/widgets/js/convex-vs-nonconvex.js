/**
 * Widget: Convex vs Nonconvex Explorer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    return pyodide;
}

const pyodidePromise = initPyodide();

export async function initConvexVsNonconvex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    const functions = {
        "x^2": { js_func: x => x**2, domain: [-5, 5] },
        "x^3": { js_func: x => x**3, domain: [-5, 5] },
        "e^x": { js_func: x => Math.exp(x), domain: [-3, 3] },
        "log(x)": { js_func: x => Math.log(x), domain: [0.1, 10] },
    };
    let selectedFunctionName = "x^2";
    let points = [];

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; align-items: center; gap: 15px;";

    const dropdown = document.createElement("select");
    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = option.textContent = name;
        dropdown.appendChild(option);
    });
    dropdown.onchange = () => {
        selectedFunctionName = dropdown.value;
        reset();
    };

    const resultDisplay = document.createElement("div");
    resultDisplay.style.fontWeight = "bold";

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Points";
    resetButton.onclick = reset;

    controls.append("Function:", dropdown, resultDisplay, resetButton);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");
    const path = svg.append("path").attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2);
    const interactionGroup = svg.append("g");
    const interactionLayer = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", handleClick);

    function drawPlot() {
        const { js_func, domain } = functions[selectedFunctionName];
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1], 0.1).map(d => ({x: d, y: js_func(d)}));
        y.domain(d3.extent(plotData, d => d.y)).nice();

        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));
        path.datum(plotData).attr("d", d3.line().x(d=>x(d.x)).y(d=>y(d.y)));
    }

    function reset() {
        points = [];
        interactionGroup.selectAll("*").remove();
        resultDisplay.textContent = "";
        drawPlot();
    }

    function handleClick(event) {
        if (points.length >= 2) return;
        const [mx, my] = d3.pointer(event);
        const xVal = x.invert(mx);
        const yVal = functions[selectedFunctionName].js_func(xVal);
        points.push({x: xVal, y: yVal});

        interactionGroup.append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 5).attr("fill", "red");

        if (points.length === 2) {
            drawChordAndCheckConvexity();
        }
    }

    async function drawChordAndCheckConvexity() {
        interactionGroup.append("line")
            .attr("x1", x(points[0].x)).attr("y1", y(points[0].y))
            .attr("x2", x(points[1].x)).attr("y2", y(points[1].y))
            .attr("stroke", "orange").attr("stroke-width", 2);

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("func_name", selectedFunctionName);
        await pyodide.globals.set("x1", points[0].x);
        await pyodide.globals.set("y1", points[0].y);
        await pyodide.globals.set("x2", points[1].x);
        await pyodide.globals.set("y2", points[1].y);
        const code = `
import numpy as np
py_funcs = {"x^2": lambda x: x**2, "x^3": lambda x: x**3, "e^x": lambda x: np.exp(x), "log(x)": lambda x: np.log(x)}
func = py_funcs[func_name]
is_convex = True
for t in np.linspace(0.1, 0.9, 10):
    interp_x = t * x1 + (1 - t) * x2
    interp_y_chord = t * y1 + (1 - t) * y2
    if func(interp_x) > interp_y_chord + 1e-6:
        is_convex = False
        break
is_convex
        `;
        const isConvex = await pyodide.runPythonAsync(code);
        resultDisplay.textContent = isConvex ? "Locally Convex" : "Not Convex";
        resultDisplay.style.color = isConvex ? "green" : "red";
    }

    reset();
}
