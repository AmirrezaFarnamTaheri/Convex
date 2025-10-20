/**
 * Widget: Jensen's Inequality Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initJensenVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    // --- CONFIGURATION ---
    const functions = {
        "x^2": { func: x => x**2, domain: { x: [-5, 5], y: [0, 25] } },
        "e^x": { func: x => Math.exp(x), domain: { x: [-3, 3], y: [0, 20] } },
        "sin(x)": { func: x => Math.sin(x), domain: { x: [-6, 6], y: [-1.5, 1.5] } },
        "-log(x)": { func: x => -Math.log(x), domain: { x: [0.1, 5], y: [-2, 3] } },
    };
    let selectedFunctionName = "x^2";
    let points = [];
    let t = 0.5; // Interpolation factor

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;";

    const dropdown = document.createElement("select");
    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = option.textContent = name;
        dropdown.appendChild(option);
    });
    dropdown.addEventListener("change", () => {
        selectedFunctionName = dropdown.value;
        reset();
    });

    const tLabel = document.createElement("label");
    tLabel.textContent = "t:";
    const tSlider = document.createElement("input");
    tSlider.type = "range";
    tSlider.min = 0;
    tSlider.max = 1;
    tSlider.step = 0.01;
    tSlider.value = t;
    tSlider.addEventListener("input", () => {
        t = parseFloat(tSlider.value);
        if (points.length === 2) updateInterpolation();
    });

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Points";
    resetButton.addEventListener("click", reset);

    controls.append("Function:", dropdown, tLabel, tSlider, resetButton);
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

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");

    const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
    const path = svg.append("path").attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2);

    const interactionGroup = svg.append("g");

    const interactionLayer = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", handleClick);

    function drawFunction() {
        const { func, domain } = functions[selectedFunctionName];
        x.domain(domain.x);
        y.domain(domain.y);

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const data = d3.range(domain.x[0], domain.x[1], 0.05).map(val => ({ x: val, y: func(val) }));
        path.datum(data).attr("d", line);
    }

    function reset() {
        points = [];
        interactionGroup.selectAll("*").remove();
        drawFunction();
    }

    function handleClick(event) {
        if (points.length >= 2) return;

        const [mx, my] = d3.pointer(event);
        const xVal = x.invert(mx);
        const yVal = functions[selectedFunctionName].func(xVal);
        points.push({ x: xVal, y: yVal });

        interactionGroup.append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 5).attr("fill", "red");

        if (points.length === 2) {
            points.sort((a, b) => a.x - b.x);

            interactionGroup.append("line")
                .attr("class", "chord-line")
                .attr("x1", x(points[0].x)).attr("y1", y(points[0].y))
                .attr("x2", x(points[1].x)).attr("y2", y(points[1].y))
                .attr("stroke", "orange").attr("stroke-width", 2).attr("stroke-dasharray", "4");

            updateInterpolation();
        }
    }

    function updateInterpolation() {
        const p1 = points[0];
        const p2 = points[1];
        const x_t = (1 - t) * p1.x + t * p2.x;
        const y_func = functions[selectedFunctionName].func(x_t);
        const y_chord = (1 - t) * p1.y + t * p2.y;

        interactionGroup.selectAll(".interp-dot").remove();

        interactionGroup.append("circle")
            .attr("class", "interp-dot")
            .attr("cx", x(x_t)).attr("cy", y(y_func))
            .attr("r", 5).attr("fill", "purple");

        interactionGroup.append("circle")
            .attr("class", "interp-dot")
            .attr("cx", x(x_t)).attr("cy", y(y_chord))
            .attr("r", 5).attr("fill", "green");

        interactionGroup.append("line")
            .attr("class", "interp-dot")
            .attr("x1", x(x_t)).attr("y1", y(y_func))
            .attr("x2", x(x_t)).attr("y2", y(y_chord))
            .attr("stroke", y_func <= y_chord + 1e-6 ? "green" : "red")
            .attr("stroke-width", 2);
    }

    reset();
}
