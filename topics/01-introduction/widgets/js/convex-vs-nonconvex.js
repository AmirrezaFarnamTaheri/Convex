/**
 * Widget: Convex vs. Non-convex Explorer
 *
 * Description: Interactively demonstrates Jensen's inequality to classify functions
 *              as convex, concave, or neither.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexVsNonconvex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="convex-explorer-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="function-select">Function:</label>
                <select id="function-select"></select>
                <button id="clear-button">Clear Points</button>
                <div id="result-display" class="widget-output" style="margin-top: 10px; min-height: 2em;">
                    Click two points on the curve to test for convexity.
                </div>
            </div>
        </div>
    `;

    const functionSelect = container.querySelector("#function-select");
    const clearButton = container.querySelector("#clear-button");
    const resultDisplay = container.querySelector("#result-display");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5] },
        "x³ (Non-convex)": { func: x => x**3, domain: [-3, 3] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3] },
        "log(x) (Concave)": { func: x => Math.log(x), domain: [0.1, 10] },
        "sin(x) (Non-convex)": { func: x => Math.sin(x), domain: [-6, 6] },
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
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
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
        svg.append("path").attr("class", "function-path").attr("fill", "none")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
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
        resultDisplay.textContent = "Click two points on the curve.";
    }

    function handleClick(event) {
        if (points.length >= 2) return;

        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);
        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 5).attr("fill", "var(--color-accent)");

        if (points.length === 2) {
            checkConvexity();
        }
    }

    function checkConvexity() {
        points.sort((a, b) => a.x - b.x);
        const [p1, p2] = points;

        svg.select(".interaction-layer").append("line")
            .attr("class", "chord")
            .attr("x1", x(p1.x)).attr("y1", y(p1.y))
            .attr("x2", x(p2.x)).attr("y2", y(p2.y))
            .attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 2);

        const samples = d3.range(0, 1.01, 0.05);
        let isConvex = true, isConcave = true;

        samples.forEach(t => {
            const interX = (1 - t) * p1.x + t * p2.x;
            const chordY = (1 - t) * p1.y + t * p2.y;
            const funcY = selectedFunc.func(interX);

            if (funcY > chordY + 1e-6) isConvex = false;
            if (funcY < chordY - 1e-6) isConcave = false;
        });

        let resultText = "";
        let color = "var(--color-primary)";
        if (isConvex) { resultText = "The function is <strong>convex</strong> between these points."; color = "var(--color-success)"; }
        else if (isConcave) { resultText = "The function is <strong>concave</strong> between these points."; color = "#ffb080"; }
        else { resultText = "The function is <strong>neither convex nor concave</strong> here."; color = "var(--color-danger)"; }

        resultDisplay.innerHTML = `<span style="color: ${color};">${resultText}</span>`;
    }

    functionSelect.onchange = () => {
        selectedFunc = functions[functionSelect.value];
        clear();
        draw();
    };
    clearButton.onclick = clear;

    new ResizeObserver(() => {
        setupChart();
        draw();
    }).observe(plotContainer);

    setupChart();
    draw();
}
