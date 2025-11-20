/**
 * Widget: Jensen's Inequality Visualizer
 *
 * Description: Interactively demonstrates Jensen's inequality, f(θx + (1-θ)y) ≤ θf(x) + (1-θ)f(y).
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initJensenVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="jensen-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Mixing Parameter θ = <span id="t-value-display" class="widget-value-display">0.50</span></label>
                    <input type="range" id="jensen-t-slider" min="0" max="1" step="0.01" value="0.5" class="widget-slider">
                </div>
                <div class="widget-control-group">
                    <button id="jensen-clear-btn" class="widget-btn">Clear Points</button>
                </div>
            </div>

            <div id="jensen-output" class="widget-output" style="min-height: 2.5em; display: flex; flex-direction: column; justify-content: center;">
                 <span style="color: var(--color-text-muted);">Click two points on the curve to test Jensen's inequality.</span>
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#jensen-func-select");
    const tSlider = container.querySelector("#jensen-t-slider");
    const tValueDisplay = container.querySelector("#t-value-display");
    const clearBtn = container.querySelector("#jensen-clear-btn");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#jensen-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2, 2] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 2] },
        "sin(x) (Non-Convex)": { func: x => Math.sin(x), domain: [-Math.PI, Math.PI] },
        "-log(x) (Convex)": { func: x => -Math.log(x), domain: [0.1, 4] },
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let points = [];

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        funcSelect.appendChild(option);
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 30, left: 40};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line x-grid");
        svg.append("g").attr("class", "grid-line y-grid");

        // Axes
        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis y-axis");

        svg.append("path").attr("class", "function-path").attr("fill", "none")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        svg.append("g").attr("class", "interaction-layer");

        svg.append("rect").attr("width", width).attr("height", height)
            .style("fill", "transparent").style("cursor", "crosshair")
            .on("click", handleClick);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / 100).map(d => ({ x: d, y: func(d) }));
        y.domain(d3.extent(plotData, d => d.y)).nice();

        const height = plotContainer.clientHeight - 50;
        const width = plotContainer.clientWidth - 60;

        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));

        svg.select(".x-grid").call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

        svg.select(".function-path").datum(plotData).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));
    }

    function clear() {
        points = [];
        svg.select(".interaction-layer").selectAll("*").remove();
        output.innerHTML = `<span style="color: var(--color-text-muted);">Click two points on the curve.</span>`;
    }

    function handleClick(event) {
        if (points.length >= 2) return;
        const [mx] = d3.pointer(event, svg.node());
        const xVal = x.invert(mx);

        // Clamp
        const dom = x.domain();
        if(xVal < dom[0] || xVal > dom[1]) return;

        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "#fff").attr("stroke-width", 2);

        if (points.length === 2) {
            points.sort((a, b) => a.x - b.x);
            svg.select(".interaction-layer").append("line").attr("class", "chord-line")
                .attr("x1", x(points[0].x)).attr("y1", y(points[0].y))
                .attr("x2", x(points[1].x)).attr("y2", y(points[1].y))
                .attr("stroke", "var(--color-text-main)").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");
            updateInterpolation();
        }
    }

    function updateInterpolation() {
        if (points.length < 2) return;
        const theta = parseFloat(tSlider.value);
        tValueDisplay.textContent = theta.toFixed(2);

        const [p1, p2] = points;
        const x_theta = (1 - theta) * p1.x + theta * p2.x;
        const y_func = selectedFunc.func(x_theta);
        const y_chord = (1 - theta) * p1.y + theta * p2.y;

        // Screen coords Y is flipped relative to value, but math logic holds:
        // func <= chord means func is "below" chord (if convex).
        // But in y-values (math), "below" means numerically smaller.
        const isConvex = y_func <= y_chord + 1e-5;

        svg.select(".interaction-layer").selectAll(".interp-viz").remove();
        const vizGroup = svg.select(".interaction-layer").append("g").attr("class", "interp-viz");

        // Vertical line connecting them
        vizGroup.append("line").attr("x1", x(x_theta)).attr("y1", y(y_func)).attr("x2", x(x_theta)).attr("y2", y(y_chord))
            .attr("stroke", isConvex ? "var(--color-success)" : "var(--color-error)").attr("stroke-width", 2);

        // Points
        vizGroup.append("circle").attr("cx", x(x_theta)).attr("cy", y(y_func)).attr("r", 5).attr("fill", "#fbbf24").attr("stroke", "#fff"); // Function value
        vizGroup.append("circle").attr("cx", x(x_theta)).attr("cy", y(y_chord)).attr("r", 5).attr("fill", "var(--color-text-main)").attr("stroke", "#fff"); // Chord value

        output.innerHTML = `
            <div style="font-family: var(--widget-font-mono);">
                <span style="color: #fbbf24">f(z)</span> = ${y_func.toFixed(2)}
                <span style="margin: 0 8px;">${isConvex ? '≤' : '>'}</span>
                <span style="color: var(--color-text-main)">L(z)</span> = ${y_chord.toFixed(2)}
            </div>
            <div style="font-size: 0.9rem; color: ${isConvex ? 'var(--color-success)' : 'var(--color-error)'};">
                ${isConvex ? "Jensen's Inequality Holds (Convex locally)" : "Jensen's Inequality Fails (Non-Convex locally)"}
            </div>
        `;
    }

    funcSelect.onchange = () => { selectedFunc = functions[funcSelect.value]; clear(); draw(); };
    tSlider.oninput = updateInterpolation;
    clearBtn.onclick = clear;

    new ResizeObserver(() => { setupChart(); draw(); }).observe(plotContainer);
    setupChart();
    draw();
}
