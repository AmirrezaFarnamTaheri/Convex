/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and visualizes its epigraph.
 *              Allows slicing with a horizontal plane to see sublevel sets.
 *              Demonstrates: f is convex <=> epi(f) is a convex set.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 450px; cursor: crosshair;"></div>
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="epigraph-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Slicing Plane (α) = <span id="alpha-val">1.0</span></label>
                    <input type="range" id="alpha-slider" class="widget-slider" step="0.1">
                </div>
                <div class="widget-control-group" style="flex-direction: row; align-items: center; gap: 8px;">
                    <input type="checkbox" id="show-epigraph-toggle" class="widget-checkbox" checked>
                    <label for="show-epigraph-toggle" class="widget-label" style="cursor: pointer; margin: 0;">Show Epigraph</label>
                </div>
            </div>
             <div id="epigraph-output" class="widget-output" style="text-align: center; min-height: 3em; display: flex; flex-direction: column; justify-content: center;"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#epigraph-func-select");
    const toggle = container.querySelector("#show-epigraph-toggle");
    const alphaSlider = container.querySelector("#alpha-slider");
    const alphaDisplay = container.querySelector("#alpha-val");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#epigraph-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2.2, 2.2], convex: true, yRange: [-0.5, 5] },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-2.5, 2.5], convex: true, yRange: [-0.5, 3] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 1.5], convex: true, yRange: [-0.5, 5] },
        "x³ (Non-Convex)": { func: x => x**3, domain: [-1.8, 1.8], convex: false, yRange: [-6, 6] },
        "Double Well (Non-Convex)": { func: x => 0.5*x**4 - x**2 + 0.5, domain: [-1.8, 1.8], convex: false, yRange: [-0.2, 2.0] }
    };

    let selectedName = Object.keys(functions)[0];
    let selectedFunc = functions[selectedName];

    Object.keys(functions).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        funcSelect.appendChild(opt);
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 60, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        // Layers
        svg.append("path").attr("class", "epigraph-area")
            .attr("fill", "rgba(124, 197, 255, 0.25)")
            .style("opacity", 1);

        svg.append("g").attr("class", "grid-x");
        svg.append("g").attr("class", "grid-y");
        svg.append("g").attr("class", "axis-x").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis-y");

        svg.append("path").attr("class", "function-path")
            .attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        svg.append("line").attr("class", "slice-line")
            .attr("stroke", "#fbbf24").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");

        // Sublevel set container
        const sublevelGroup = svg.append("g").attr("class", "sublevel-group").attr("transform", `translate(0, ${height + 15})`);

        // Legend for sublevel
        sublevelGroup.append("text")
            .attr("x", width/2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--color-text-muted)")
            .style("font-size", "0.8rem")
            .text("Sublevel Set S_α (projection onto domain)");
    }

    function update() {
        const { func, domain, yRange } = selectedFunc;
        const height = plotContainer.clientHeight - 80;
        const width = plotContainer.clientWidth - 70;

        x.domain(domain);
        y.domain(yRange).nice();

        // Update axes
        svg.select(".axis-x").call(d3.axisBottom(x));
        svg.select(".axis-y").call(d3.axisLeft(y));
        svg.select(".grid-x").call(d3.axisBottom(x).tickSize(-height).tickFormat("")).attr("opacity", 0.1);
        svg.select(".grid-y").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

        const data = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / 300);
        data.push(domain[1]);

        // Draw function
        const line = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(data).attr("d", line);

        // Draw epigraph
        const area = d3.area()
            .x(d => x(d))
            .y0(d => y(func(d)))
            .y1(0); // Top of SVG is y=0

        svg.select(".epigraph-area").datum(data).attr("d", area)
            .transition().duration(200)
            .style("opacity", toggle.checked ? 1 : 0);

        updateSlice();
        updateText();
    }

    function updateSlice() {
        const alpha = parseFloat(alphaSlider.value);
        const { func, domain } = selectedFunc;

        // Draw slice line
        const yAlpha = y(alpha);
        // Ensure within bounds
        const clampedY = Math.max(0, Math.min(plotContainer.clientHeight-80, yAlpha));

        svg.select(".slice-line")
            .attr("x1", 0).attr("x2", plotContainer.clientWidth)
            .attr("y1", clampedY).attr("y2", clampedY);

        // Calculate intervals
        const intervals = [];
        let inSet = false;
        let start = null;
        const step = (domain[1] - domain[0]) / 500;

        for(let t = domain[0]; t <= domain[1]; t += step) {
            const val = func(t);
            if (val <= alpha) {
                if (!inSet) { inSet = true; start = t; }
            } else {
                if (inSet) { inSet = false; intervals.push([start, t]); }
            }
        }
        if (inSet) intervals.push([start, domain[1]]);

        // Draw intervals
        const g = svg.select(".sublevel-group");
        g.selectAll("line").remove();
        g.selectAll("rect").remove(); // Clear old rects

        // Axis line
        g.append("line").attr("x1", 0).attr("x2", plotContainer.clientWidth - 70).attr("y1", 0).attr("y2", 0).attr("stroke", "var(--color-border)");

        intervals.forEach(interval => {
            const x1 = x(interval[0]);
            const x2 = x(interval[1]);
            if (Math.abs(x2-x1) < 1) return;

            g.append("rect")
                .attr("x", x1)
                .attr("y", -4)
                .attr("width", x2 - x1)
                .attr("height", 8)
                .attr("fill", "#fbbf24")
                .attr("rx", 2);
        });
    }

    function updateText() {
        const alpha = parseFloat(alphaSlider.value);
        alphaDisplay.textContent = alpha.toFixed(1);

        let status = "";
        if (selectedFunc.convex) {
            status = `<span style="color: var(--color-success); font-weight: bold;">Convex Function</span> → Epigraph is a Convex Set.`;
        } else {
            status = `<span style="color: var(--color-error); font-weight: bold;">Non-Convex Function</span> → Epigraph is Non-Convex.`;
        }

        output.innerHTML = `
            <div style="margin-bottom: 4px;">${status}</div>
            <div style="font-size: 0.9rem; color: var(--color-text-muted);">
                Sublevel set {x | f(x) ≤ ${alpha.toFixed(1)}} is shown in <span style="color: #fbbf24; font-weight: bold;">amber</span> below.
            </div>
        `;
    }

    funcSelect.addEventListener("change", (e) => {
        selectedName = e.target.value;
        selectedFunc = functions[selectedName];

        const [min, max] = selectedFunc.yRange;
        alphaSlider.min = min;
        alphaSlider.max = max;
        alphaSlider.value = (min+max)/2;

        update();
    });

    alphaSlider.addEventListener("input", () => {
        updateSlice();
        updateText();
    });

    toggle.addEventListener("change", () => {
        svg.select(".epigraph-area").transition().style("opacity", toggle.checked ? 1 : 0);
    });

    new ResizeObserver(() => {
        setupChart();
        // Restore slider
        const [min, max] = selectedFunc.yRange;
        alphaSlider.min = min; alphaSlider.max = max;
        if(!alphaSlider.value) alphaSlider.value = 1.0;
        update();
    }).observe(plotContainer);

    // Init bounds
    const [min, max] = selectedFunc.yRange;
    alphaSlider.min = min; alphaSlider.max = max;
    alphaSlider.value = 1.0;

    setupChart();
    update();
}
