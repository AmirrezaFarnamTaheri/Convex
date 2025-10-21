/**
 * Widget: Jensen's Inequality Visualizer
 *
 * Description: Interactively demonstrates Jensen's inequality, f(θx + (1-θ)y) ≤ θf(x) + (1-θ)f(y),
 *              which is a defining property of convex functions.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initJensenVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="jensen-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div>
                        <label for="jensen-func-select">Function:</label>
                        <select id="jensen-func-select"></select>
                    </div>
                    <div>
                        <label for="jensen-t-slider">θ = <span id="t-value-display">0.50</span></label>
                        <input type="range" id="jensen-t-slider" min="0" max="1" step="0.01" value="0.5">
                    </div>
                </div>
                <button id="jensen-clear-btn" style="margin-top: 10px;">Clear Points</button>
                <div id="jensen-output" class="widget-output" style="margin-top: 10px; min-height: 2em;">
                    Click two points on the curve to test Jensen's inequality.
                </div>
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#jensen-func-select");
    const tSlider = container.querySelector("#jensen-t-slider");
    const tValueDisplay = container.querySelector("#t-value-display");
    const clearBtn = container.querySelector("#jensen-clear-btn");
    const plotContainer = container.querySelector("#jensen-plot-container");
    const output = container.querySelector("#jensen-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3] },
        "sin(x) (Non-Convex)": { func: x => Math.sin(x), domain: [-6, 6] },
        "-log(x) (Convex)": { func: x => -Math.log(x), domain: [0.1, 5] },
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let points = [];

    Object.keys(functions).forEach(name => {
        funcSelect.innerHTML += `<option value="${name}">${name}</option>`;
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "y-axis");
        svg.append("path").attr("class", "function-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
        svg.append("g").attr("class", "interaction-layer");
        svg.append("rect").attr("width", width).attr("height", height)
            .style("fill", "none").style("pointer-events", "all").on("click", handleClick);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / 200).map(d => ({ x: d, y: func(d) }));
        y.domain(d3.extent(plotData, d => d.y)).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));
        svg.select(".function-path").datum(plotData).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));
    }

    function clear() {
        points = [];
        svg.select(".interaction-layer").selectAll("*").remove();
        output.textContent = "Click two points on the curve.";
    }

    function handleClick(event) {
        if (points.length >= 2) return;
        const [mx] = d3.pointer(event, svg.node());
        const xVal = x.invert(mx);
        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 5).attr("fill", "var(--color-accent)");

        if (points.length === 2) {
            points.sort((a, b) => a.x - b.x);
            svg.select(".interaction-layer").append("line").attr("class", "chord-line")
                .attr("x1", x(points[0].x)).attr("y1", y(points[0].y))
                .attr("x2", x(points[1].x)).attr("y2", y(points[1].y))
                .attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 2);
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

        const isConvex = y_func <= y_chord + 1e-6;

        svg.select(".interaction-layer").selectAll(".interp-viz").remove();
        const vizGroup = svg.select(".interaction-layer").append("g").attr("class", "interp-viz");

        vizGroup.append("circle").attr("cx", x(x_theta)).attr("cy", y(y_func)).attr("r", 5).attr("fill", "orange").attr("id", "func-point");
        vizGroup.append("circle").attr("cx", x(x_theta)).attr("cy", y(y_chord)).attr("r", 5).attr("fill", "var(--color-accent)").attr("id", "chord-point");
        vizGroup.append("line").attr("x1", x(x_theta)).attr("y1", y(y_func)).attr("x2", x(x_theta)).attr("y2", y(y_chord))
            .attr("stroke", isConvex ? "var(--color-success)" : "var(--color-danger)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");

        output.innerHTML = `
            <span style="color: orange">f(θx + (1-θ)y)</span> = ${y_func.toFixed(2)}<br>
            <span style="color: var(--color-accent)">θf(x) + (1-θ)f(y)</span> = ${y_chord.toFixed(2)}
            <br>Inequality holds: <strong style="color: ${isConvex ? 'var(--color-success)' : 'var(--color-danger)'}">${isConvex}</strong>
        `;
    }

    funcSelect.onchange = () => { selectedFunc = functions[funcSelect.value]; clear(); draw(); };
    tSlider.oninput = updateInterpolation;
    clearBtn.onclick = clear;

    new ResizeObserver(() => { setupChart(); draw(); }).observe(plotContainer);
    setupChart();
    draw();
}
