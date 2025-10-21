/**
 * Widget: Convex vs Nonconvex Explorer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initConvexVsNonconvex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="convex-explorer-widget">
            <div class="widget-controls">
                <label for="function-select">Select a function:</label>
                <select id="function-select"></select>
                <button id="reset-button">Reset Points</button>
                <div id="result-display" class="widget-output"></div>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on two points on the curve to check for convexity.</p>
        </div>
    `;

    const functionSelect = container.querySelector("#function-select");
    const resetButton = container.querySelector("#reset-button");
    const resultDisplay = container.querySelector("#result-display");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "x² (Convex)": { js_func: x => x**2, domain: [-5, 5] },
        "x³ (Non-convex)": { js_func: x => x**3, domain: [-3, 3] },
        "eˣ (Convex)": { js_func: x => Math.exp(x), domain: [-3, 3] },
        "log(x) (Concave)": { js_func: x => Math.log(x), domain: [0.1, 10] },
        "sin(x) (Non-convex)": { js_func: x => Math.sin(x), domain: [-6, 6]},
    };
    let selectedFunctionName = Object.keys(functions)[0];
    let points = [];

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        functionSelect.appendChild(option);
    });

    functionSelect.onchange = () => {
        selectedFunctionName = functionSelect.value;
        reset();
    };
    resetButton.onclick = reset;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`).attr("class", "axis");
    const yAxis = svg.append("g").attr("class", "axis");
    const path = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const interactionGroup = svg.append("g");
    const clickOverlay = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", handleClick);

    function drawPlot() {
        const { js_func, domain } = functions[selectedFunctionName];
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1], (domain[1] - domain[0])/200).map(d => ({x: d, y: js_func(d)}));
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
        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);
        const yVal = functions[selectedFunctionName].js_func(xVal);
        points.push({x: xVal, y: yVal});

        interactionGroup.append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 5).attr("fill", "var(--color-accent)");

        if (points.length === 2) {
            drawChordAndCheckConvexity();
        }
    }

    async function drawChordAndCheckConvexity() {
        // Sort points by x-value
        points.sort((a, b) => a.x - b.x);

        const [p1, p2] = points;

        interactionGroup.append("line")
            .attr("class", "chord")
            .attr("x1", x(p1.x)).attr("y1", y(p1.y))
            .attr("x2", x(p2.x)).attr("y2", y(p2.y))
            .attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 2);

        const pyodide = await getPyodide();
        const func_str = functions[selectedFunctionName].js_func.toString().replace('Math.','np.');

        await pyodide.globals.set("func_str", func_str);
        await pyodide.globals.set("x1", p1.x);
        await pyodide.globals.set("y1", p1.y);
        await pyodide.globals.set("x2", p2.x);
        const code = `
import numpy as np
func = eval("lambda x: " + func_str)
is_convex = True
mid_x = (x1 + x2) / 2
mid_y_chord = (y1 + y2) / 2
if func(mid_x) > mid_y_chord + 1e-6:
    is_convex = False
is_convex
        `;
        const isConvex = await pyodide.runPythonAsync(code);

        resultDisplay.innerHTML = isConvex
            ? '<span style="color: var(--color-success);">Locally Convex</span>'
            : '<span style="color: var(--color-danger);">Not Convex</span>';

        // Visualize Jensen's inequality
        const mid_x = (p1.x + p2.x) / 2;
        const mid_y_func = functions[selectedFunctionName].js_func(mid_x);
        const mid_y_chord = (p1.y + p2.y) / 2;

        interactionGroup.append("line")
            .attr("class", "jensen-line")
            .attr("x1", x(mid_x)).attr("y1", y(mid_y_func))
            .attr("x2", x(mid_x)).attr("y2", y(mid_y_chord))
            .attr("stroke", isConvex ? "var(--color-success)" : "var(--color-danger)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4 4");
    }

    reset();
}
