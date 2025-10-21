/**
 * Widget: Jensen's Inequality Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initJensenVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="jensen-visualizer-widget">
            <div class="widget-controls">
                <label for="jensen-func-select">Function:</label>
                <select id="jensen-func-select"></select>
                <label for="jensen-t-slider">θ (theta):</label>
                <input type="range" id="jensen-t-slider" min="0" max="1" step="0.01" value="0.5">
                <span id="t-value-display">0.50</span>
                <button id="jensen-reset-btn">Reset Points</button>
            </div>
            <div id="jensen-plot-container"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#jensen-func-select");
    const tSlider = container.querySelector("#jensen-t-slider");
    const tValueDisplay = container.querySelector("#t-value-display");
    const resetBtn = container.querySelector("#jensen-reset-btn");
    const plotContainer = container.querySelector("#jensen-plot-container");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3] },
        "sin(x) (Non-Convex)": { func: x => Math.sin(x), domain: [-6, 6] },
        "-log(x) (Convex)": { func: x => -Math.log(x), domain: [0.1, 5] },
    };
    let selectedFunctionName = Object.keys(functions)[0];
    let points = [];
    let theta = 0.5;

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        funcSelect.appendChild(option);
    });

    const margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").style("font-size", "16px").text("Jensen's Inequality: f(θx + (1-θ)y) ≤ θf(x) + (1-θ)f(y)");

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");

    const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
    const path = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2);
    const interactionGroup = svg.append("g");
    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all").on("click", handleClick);

    function drawFunction() {
        const { func, domain } = functions[selectedFunctionName];
        x.domain(domain);
        const yData = d3.range(domain[0], domain[1], 0.05).map(val => func(val));
        y.domain(d3.extent(yData)).nice();
        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));
        const data = d3.range(domain[0], domain[1], 0.05).map(val => ({ x: val, y: func(val) }));
        path.datum(data).attr("d", line);
    }

    function reset() {
        points = [];
        interactionGroup.selectAll("*").remove();
        drawFunction();
    }

    function handleClick(event) {
        if (points.length >= 2) return;
        const [mx] = d3.pointer(event, svg.node());
        const xVal = x.invert(mx);
        const yVal = functions[selectedFunctionName].func(xVal);
        points.push({ x: xVal, y: yVal });

        interactionGroup.append("circle").attr("cx", x(xVal)).attr("cy", y(yVal)).attr("r", 5).attr("fill", "var(--color-accent)");
        if (points.length === 2) {
            points.sort((a, b) => a.x - b.x);
            interactionGroup.append("line").attr("class", "chord-line").attr("x1", x(points[0].x)).attr("y1", y(points[0].y)).attr("x2", x(points[1].x)).attr("y2", y(points[1].y)).attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 2).attr("stroke-dasharray", "4");
            updateInterpolation();
        }
    }

    function updateInterpolation() {
        if (points.length < 2) return;
        tValueDisplay.textContent = theta.toFixed(2);
        const [p1, p2] = points;
        const x_theta = (1 - theta) * p1.x + theta * p2.x;
        const y_func = functions[selectedFunctionName].func(x_theta);
        const y_chord = (1 - theta) * p1.y + theta * p2.y;

        const isConvex = y_func <= y_chord + 1e-6;

        interactionGroup.selectAll(".interp-viz").remove();
        interactionGroup.append("circle").attr("class", "interp-viz").attr("cx", x(x_theta)).attr("cy", y(y_func)).attr("r", 5).attr("fill", "var(--color-primary)");
        interactionGroup.append("circle").attr("class", "interp-viz").attr("cx", x(x_theta)).attr("cy", y(y_chord)).attr("r", 5).attr("fill", isConvex ? "var(--color-success)" : "var(--color-danger)");
        interactionGroup.append("line").attr("class", "interp-viz").attr("x1", x(x_theta)).attr("y1", y(y_func)).attr("x2", x(x_theta)).attr("y2", y(y_chord)).attr("stroke", isConvex ? "var(--color-success)" : "var(--color-danger)").attr("stroke-width", 2);
    }

    funcSelect.addEventListener("change", (e) => { selectedFunctionName = e.target.value; reset(); });
    tSlider.addEventListener("input", (e) => { theta = +e.target.value; updateInterpolation(); });
    resetBtn.addEventListener("click", reset);

    reset();
}
