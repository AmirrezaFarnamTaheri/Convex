/**
 * Widget: Convex vs. Non-convex Explorer
 *
 * Description: Interactively demonstrates Jensen's inequality to classify functions
 *              as convex, concave, or neither.
 * Version: 2.1.0 (Refined)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexVsNonconvex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="convex-explorer-widget">
            <div class="plot-area" id="plot-container"></div>
            <div class="controls-area">
                <div class="control-group">
                    <label for="function-select">Function:</label>
                    <select id="function-select" class="widget-select"></select>
                </div>
                <div class="control-group">
                    <label for="theta-slider">θ = <span id="theta-value">0.50</span></label>
                    <input type="range" id="theta-slider" min="0" max="1" step="0.01" value="0.5" class="styled-slider">
                </div>
                <button id="clear-button" class="widget-button">Clear Points</button>
                <div id="result-display" class="output-box">Click two points on the curve.</div>
            </div>
        </div>
    `;

    const functionSelect = container.querySelector("#function-select");
    const clearButton = container.querySelector("#clear-button");
    const resultDisplay = container.querySelector("#result-display");
    const plotContainer = container.querySelector("#plot-container");
    const thetaSlider = container.querySelector("#theta-slider");
    const thetaValueSpan = container.querySelector("#theta-value");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3] },
        "√x (Concave)": { func: x => Math.sqrt(x), domain: [0.01, 10] },
        "sin(x) (Non-convex)": { func: x => Math.sin(x), domain: [-6.28, 6.28] },
        "x³ (Non-convex)": { func: x => x**3, domain: [-3, 3] },
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let points = [];

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        functionSelect.appendChild(option);
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        const grid = svg.append("g").attr("class", "grid");
        grid.append("g").attr("class", "x-grid");
        grid.append("g").attr("class", "y-grid");

        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis y-axis");
        svg.append("path").attr("class", "function-path");
        svg.append("g").attr("class", "interaction-layer");

        svg.append("rect").attr("width", width).attr("height", height)
            .style("fill", "none").style("pointer-events", "all").on("click", handleClick);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1] + 0.01, (domain[1] - domain[0]) / 200).map(d => ({ x: d, y: func(d) }));
        y.domain(d3.extent(plotData, d => d.y)).nice();

        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));
        svg.select(".x-grid").call(d3.axisBottom(x).ticks(10).tickSize(-plotContainer.clientHeight).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(10).tickSize(-plotContainer.clientWidth).tickFormat(""));

        svg.select(".function-path").datum(plotData).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));
    }

    function clear() {
        points = [];
        svg.select(".interaction-layer").selectAll("*").remove();
        resultDisplay.innerHTML = "Click two points on the curve.";
        thetaSlider.disabled = true;
    }

    function handleClick(event) {
        if (points.length >= 2) return;

        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);
        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("class", `point-handle p${points.length}`)
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 6);

        if (points.length === 2) {
            thetaSlider.disabled = false;
            checkConvexity();
        }
    }

    function checkConvexity() {
        points.sort((a, b) => a.x - b.x);
        const interaction = svg.select(".interaction-layer");
        interaction.append("line").attr("class", "chord");
        interaction.append("line").attr("class", "jensen-gap");
        interaction.append("circle").attr("class", "chord-point").attr("r", 5);
        interaction.append("circle").attr("class", "func-point").attr("r", 5);

        updateInterpolation();

        const samples = d3.range(0.01, 0.99, 0.01);
        let isConvex = true, isConcave = true;
        samples.forEach(t => {
            const ix = (1 - t) * points[0].x + t * points[1].x;
            const iy_chord = (1 - t) * points[0].y + t * points[1].y;
            const iy_func = selectedFunc.func(ix);
            if (iy_func > iy_chord + 1e-6) isConvex = false;
            if (iy_func < iy_chord - 1e-6) isConcave = false;
        });

        let resultText = "";
        if (isConvex) { resultText = "The function appears <strong>convex</strong> here."; }
        else if (isConcave) { resultText = "The function appears <strong>concave</strong> here."; }
        else { resultText = "The function is <strong>neither</strong> convex nor concave here."; }
        resultDisplay.innerHTML = resultText;
    }

    function updateInterpolation() {
        if (points.length < 2) return;
        const [p1, p2] = points;
        const theta = parseFloat(thetaSlider.value);
        thetaValueSpan.textContent = theta.toFixed(2);

        const ix = (1 - theta) * p1.x + theta * p2.x;
        const iy_chord = (1 - theta) * p1.y + theta * p2.y;
        const iy_func = selectedFunc.func(ix);

        const interaction = svg.select(".interaction-layer");
        interaction.select(".chord").attr("x1", x(p1.x)).attr("y1", y(p1.y)).attr("x2", x(p2.x)).attr("y2", y(p2.y));
        interaction.select(".chord-point").attr("cx", x(ix)).attr("cy", y(iy_chord));
        interaction.select(".func-point").attr("cx", x(ix)).attr("cy", y(iy_func));

        const gap = interaction.select(".jensen-gap").attr("x1", x(ix)).attr("y1", y(iy_chord)).attr("x2", x(ix)).attr("y2", y(iy_func));
        if (iy_func <= iy_chord + 1e-6) gap.attr("class", "jensen-gap convex");
        else gap.attr("class", "jensen-gap nonconvex");
    }

    functionSelect.onchange = () => {
        selectedFunc = functions[functionSelect.value];
        clear();
        draw();
    };
    clearButton.onclick = clear;
    thetaSlider.oninput = updateInterpolation;
    thetaSlider.disabled = true;

    new ResizeObserver(() => {
        setupChart();
        draw();
        if (points.length === 2) {
          svg.select(".interaction-layer").selectAll("circle.point-handle").data(points).attr("cx", d => x(d.x)).attr("cy", d => y(d.y));
          checkConvexity();
        }
    }).observe(plotContainer);

    setupChart();
    draw();
}

const style = document.createElement('style');
style.textContent = `
.convex-explorer-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex-grow: 1; position: relative; }
.controls-area { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); background: var(--color-surface-1); }
.control-group { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
/* D3 styles */
.axis path, .axis line { stroke: var(--color-border); }
.axis text { fill: var(--color-text-muted); }
.grid .domain { display: none; }
.grid line { stroke: var(--color-surface-2); }
.function-path { fill: none; stroke: var(--color-primary); stroke-width: 2.5; }
.point-handle { stroke: var(--color-background); stroke-width: 2; }
.point-handle.p1 { fill: var(--color-accent); }
.point-handle.p2 { fill: var(--color-accent-secondary); }
.chord { stroke: var(--color-text-muted); stroke-width: 2; stroke-dasharray: 4 4; }
.chord-point { fill: var(--color-text-muted); }
.func-point { fill: var(--color-primary); }
.jensen-gap { stroke-width: 3; }
.jensen-gap.convex { stroke: var(--color-success); }
.jensen-gap.nonconvex { stroke: var(--color-error); }
.output-box strong { color: var(--color-primary); }
`;
document.head.appendChild(style);
