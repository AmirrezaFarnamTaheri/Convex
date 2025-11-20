/**
 * Widget: Convex vs. Non-convex Explorer
 *
 * Description: Interactively demonstrates Jensen's inequality to classify functions
 *              as convex, concave, or neither.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initConvexVsNonconvex(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function to Test</label>
                    <select id="function-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group">
                     <button id="clear-button" class="widget-btn">Clear Points</button>
                </div>
            </div>

            <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>

            <div id="result-display" class="widget-output" style="min-height: 60px;">
                <span style="color: var(--color-text-muted);">Click two points on the curve to test Jensen's inequality.</span>
            </div>
        </div>
    `;

    const functionSelect = container.querySelector("#function-select");
    const clearButton = container.querySelector("#clear-button");
    const resultDisplay = container.querySelector("#result-display");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2.5, 2.5] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 2] },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-3, 3] },
        "x³ (Non-convex)": { func: x => x**3, domain: [-2, 2] },
        "log(x) (Concave)": { func: x => Math.log(x), domain: [0.1, 5] },
        "sin(x) (Neither)": { func: x => Math.sin(x), domain: [-3, 3] },
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
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        svg.append("g").attr("class", "x-axis axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "y-axis axis");

        // Grid
        svg.append("g").attr("class", "x-grid grid-line");
        svg.append("g").attr("class", "y-grid grid-line");

        svg.append("path").attr("class", "function-path").attr("fill", "none")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        svg.append("g").attr("class", "interaction-layer");

        // Rect to capture clicks
        svg.append("rect").attr("width", width).attr("height", height)
            .style("fill", "transparent").style("cursor", "crosshair")
            .on("click", handleClick);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);

        const dataPoints = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / 200).map(d => ({ x: d, y: func(d) }));
        y.domain(d3.extent(dataPoints, d => d.y)).nice();

        const width = plotContainer.clientWidth - 60;
        const height = plotContainer.clientHeight - 50;

        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));

        svg.select(".x-grid").call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));
        svg.select(".function-path").datum(dataPoints).attr("d", line);
    }

    function clear() {
        points = [];
        svg.select(".interaction-layer").selectAll("*").remove();
        resultDisplay.innerHTML = `<span style="color: var(--color-text-muted);">Click two points on the curve to test Jensen's inequality.</span>`;
    }

    function handleClick(event) {
        if (points.length >= 2) return;

        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);

        // Clamp to domain
        const dom = x.domain();
        if(xVal < dom[0] || xVal > dom[1]) return;

        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "#fff").attr("stroke-width", 2);

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
            .attr("stroke", "var(--color-text-main)").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        // Check samples between points
        let isConvex = true;
        let isConcave = true;
        const steps = 20;

        for(let i=1; i<steps; i++) {
            const t = i/steps;
            const interX = (1 - t) * p1.x + t * p2.x;
            const chordY = (1 - t) * p1.y + t * p2.y; // Value on line
            const funcY = selectedFunc.func(interX); // Value on curve

            // Screen coordinates: Y increases downwards.
            // But our logic compares math values. y-scale handles visual mapping.
            // If funcY < chordY (curve below chord), it is CONVEX.
            // If funcY > chordY (curve above chord), it is CONCAVE.

            if (funcY > chordY + 1e-5) isConvex = false;
            if (funcY < chordY - 1e-5) isConcave = false;
        }

        let resultText = "";
        let color = "var(--color-text-main)";

        if (isConvex) {
            resultText = "✓ Jensen's Inequality holds: f(θx + (1-θ)y) ≤ θf(x) + (1-θ)f(y). The function is locally <strong>CONVEX</strong>.";
            color = "var(--color-success)";
            svg.select(".interaction-layer").append("path")
               .attr("d", d3.area().x(d=>x(d.x)).y0(d=>y(d.y)).y1(d=>y((1-d.t)*p1.y + d.t*p2.y))(
                   d3.range(0, 1.05, 0.05).map(t => ({t, x: (1-t)*p1.x + t*p2.x, y: selectedFunc.func((1-t)*p1.x + t*p2.x)}))
               ))
               .attr("fill", "var(--color-success)").attr("opacity", 0.2);
        }
        else if (isConcave) {
            resultText = "✕ Jensen's Inequality fails. The function is locally <strong>CONCAVE</strong>.";
            color = "#ffb080";
        }
        else {
            resultText = "The function is <strong>neither convex nor concave</strong> in this interval.";
            color = "var(--color-error)";
        }

        resultDisplay.innerHTML = `<div style="border-left: 4px solid ${color}; padding-left: 10px;">${resultText}</div>`;
    }

    functionSelect.onchange = () => {
        selectedFunc = functions[functionSelect.value];
        clear();
        draw();
    };
    clearButton.onclick = clear;

    const resizeObserver = new ResizeObserver(() => {
        setupChart();
        draw();
        // Re-draw points if they exist
        if(points.length > 0) {
             points.forEach(p => {
                 svg.select(".interaction-layer").append("circle")
                    .attr("cx", x(p.x)).attr("cy", y(p.y))
                    .attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "#fff").attr("stroke-width", 2);
             });
             if(points.length === 2) checkConvexity();
        }
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    draw();
}
