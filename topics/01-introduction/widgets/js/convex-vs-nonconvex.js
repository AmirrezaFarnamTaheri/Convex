/**
 * Widget: Convex vs. Non-convex Explorer
 *
 * Description: Interactively demonstrates Jensen's inequality to classify functions
 *              as convex, concave, or neither. Visualizes the chord vs curve condition.
 * Version: 3.0.0
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
                <span style="color: var(--color-text-muted);">Click two points on the curve to visualize Jensen's Inequality.</span>
            </div>
        </div>
    `;

    const functionSelect = container.querySelector("#function-select");
    const clearButton = container.querySelector("#clear-button");
    const resultDisplay = container.querySelector("#result-display");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2, 2], label: "f(x) = x²" },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 1.5], label: "f(x) = eˣ" },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-2, 2], label: "f(x) = |x|" },
        "x³ (Non-convex)": { func: x => x**3, domain: [-1.5, 1.5], label: "f(x) = x³" },
        "log(x) (Concave)": { func: x => Math.log(x), domain: [0.2, 4], label: "f(x) = log(x)" },
        "sin(x) (Neither)": { func: x => Math.sin(x), domain: [-3, 3], label: "f(x) = sin(x)" },
        "Non-convex W": { func: x => 0.2*x**4 - x**2, domain: [-2.5, 2.5], label: "Double Well" }
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
        const yExtent = d3.extent(dataPoints, d => d.y);
        // Add padding
        const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
        y.domain([yExtent[0] - yPadding, yExtent[1] + yPadding]);

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
        if (points.length >= 2) clear();

        const [mx] = d3.pointer(event);
        const xVal = x.invert(mx);

        // Clamp to domain
        const dom = x.domain();
        if(xVal < dom[0] || xVal > dom[1]) return;

        const yVal = selectedFunc.func(xVal);
        points.push({ x: xVal, y: yVal });

        svg.select(".interaction-layer").append("circle")
            .attr("cx", x(xVal)).attr("cy", y(yVal))
            .attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 2);

        if (points.length === 2) {
            checkConvexity();
        }
    }

    function checkConvexity() {
        points.sort((a, b) => a.x - b.x);
        const [p1, p2] = points;

        const interactLayer = svg.select(".interaction-layer");

        // Draw Chord
        interactLayer.append("line")
            .attr("class", "chord")
            .attr("x1", x(p1.x)).attr("y1", y(p1.y))
            .attr("x2", x(p2.x)).attr("y2", y(p2.y))
            .attr("stroke", "#fbbf24").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        // Check samples between points
        let isLocallyConvex = true;
        let isLocallyConcave = true;
        const steps = 50;

        const areaData = [];

        for(let i=0; i<=steps; i++) {
            const t = i/steps;
            const interX = (1 - t) * p1.x + t * p2.x;
            const chordY = (1 - t) * p1.y + t * p2.y; // Value on line
            const funcY = selectedFunc.func(interX); // Value on curve

            areaData.push({ x: interX, y0: chordY, y1: funcY });

            if (funcY > chordY + 1e-5) isLocallyConvex = false; // Curve goes above chord
            if (funcY < chordY - 1e-5) isLocallyConcave = false; // Curve goes below chord
        }

        let resultText = "";
        let color = "var(--color-text-main)";
        let fill = "rgba(128, 128, 128, 0.2)";

        if (isLocallyConvex) {
            resultText = `
                <div style="font-weight: bold; color: var(--color-success); margin-bottom: 4px;">✓ Jensen's Inequality Holds</div>
                <div style="font-size: 0.85rem;">The chord is <strong>above</strong> the graph. Locally convex.</div>
                <div style="font-family: var(--font-mono); font-size: 0.8rem; margin-top: 4px;">f(θx + (1-θ)y) ≤ θf(x) + (1-θ)f(y)</div>
            `;
            color = "var(--color-success)";
            fill = "rgba(74, 222, 128, 0.2)"; // Success green alpha
        }
        else if (isLocallyConcave) {
            resultText = `
                <div style="font-weight: bold; color: #fbbf24; margin-bottom: 4px;">⚠ Locally Concave</div>
                <div style="font-size: 0.85rem;">The chord is <strong>below</strong> the graph.</div>
            `;
            color = "#fbbf24";
            fill = "rgba(251, 191, 36, 0.2)"; // Warning yellow alpha
        }
        else {
            resultText = `
                <div style="font-weight: bold; color: var(--color-error); margin-bottom: 4px;">✕ Non-Convex</div>
                <div style="font-size: 0.85rem;">The chord crosses the graph. Neither convex nor concave here.</div>
            `;
            color = "var(--color-error)";
            fill = "rgba(248, 113, 113, 0.2)"; // Error red alpha
        }

        // Draw area between chord and curve
        const area = d3.area()
            .x(d => x(d.x))
            .y0(d => y(d.y0))
            .y1(d => y(d.y1));

        interactLayer.insert("path", ":first-child")
            .datum(areaData)
            .attr("d", area)
            .attr("fill", fill)
            .attr("opacity", 0); // Fade in

        interactLayer.select("path").transition().duration(500).attr("opacity", 1);

        resultDisplay.innerHTML = `<div style="border-left: 4px solid ${color}; padding-left: 12px;">${resultText}</div>`;
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
        if(points.length > 0) {
             // Re-plot points if simple resizing
             // Actually simpler to just clear or redraw based on stored data logic
             // For now just clearing to avoid misalignment bugs
             clear();
        }
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    draw();
}
