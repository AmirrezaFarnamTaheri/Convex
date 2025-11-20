/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and visualizes its epigraph.
 *              Allows slicing with a horizontal plane to see sublevel sets.
 * Version: 2.2.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px;"></div>
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="epigraph-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Slicing Plane (α) = <span id="alpha-val">0.0</span></label>
                    <input type="range" id="alpha-slider" class="widget-slider" step="0.1">
                </div>
                <div class="widget-control-group" style="flex-direction: row; align-items: center; gap: 8px;">
                    <input type="checkbox" id="show-epigraph-toggle" class="widget-checkbox">
                    <label for="show-epigraph-toggle" class="widget-label" style="cursor: pointer; margin: 0;">Show Epigraph</label>
                </div>
            </div>
             <div id="epigraph-output" class="widget-output"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#epigraph-func-select");
    const toggle = container.querySelector("#show-epigraph-toggle");
    const alphaSlider = container.querySelector("#alpha-slider");
    const alphaDisplay = container.querySelector("#alpha-val");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#epigraph-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2.5, 2.5], convex: true, yRange: [-1, 6] },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-3, 3], convex: true, yRange: [-1, 4] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 1.5], convex: true, yRange: [-1, 5] },
        "x³ (Non-Convex)": { func: x => x**3, domain: [-1.8, 1.8], convex: false, yRange: [-6, 6] },
        "sin(x) (Non-Convex)": { func: x => Math.sin(x), domain: [-3.2, 3.2], convex: false, yRange: [-1.5, 1.5] },
        "Double Well (Non-Convex)": { func: x => 0.5*x**4 - x**2 + 0.5, domain: [-2, 2], convex: false, yRange: [-0.5, 2.5] }
    };

    let selectedName = Object.keys(functions)[0];
    let selectedFunc = functions[selectedName];

    Object.keys(functions).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        funcSelect.appendChild(opt);
    });

    let svg, x, y, defs;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        defs = svg.append("defs");
        defs.append("marker")
            .attr("id", "arrow-down")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5).attr("refY", 0)
            .attr("markerWidth", 4).attr("markerHeight", 4)
            .attr("orient", "90") // Pointing down
            .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#ff6b6b");

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        // Layers
        svg.append("path").attr("class", "epigraph-area")
            .attr("fill", "rgba(124, 197, 255, 0.3)")
            .style("opacity", 0);

        svg.append("g").attr("class", "grid-x");
        svg.append("g").attr("class", "grid-y");
        svg.append("g").attr("class", "axis-x").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis-y");

        svg.append("path").attr("class", "function-path")
            .attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        svg.append("line").attr("class", "slice-line")
            .attr("stroke", "#ff6b6b").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");

        svg.append("g").attr("class", "sublevel-set-group").attr("transform", `translate(0, ${height + 10})`); // Below axis

        svg.append("text").attr("class", "sublevel-label")
            .attr("x", width/2).attr("y", height + 35)
            .attr("text-anchor", "middle")
            .attr("fill", "#ff6b6b")
            .style("font-size", "0.85rem")
            .text("Sublevel Set S_α = { x | f(x) ≤ α }");
    }

    function update() {
        const { func, domain, yRange } = selectedFunc;
        const width = plotContainer.clientWidth - 70;
        const height = plotContainer.clientHeight - 60;

        x.domain(domain);
        y.domain(yRange).nice();

        // Update axes
        svg.select(".axis-x").call(d3.axisBottom(x));
        svg.select(".axis-y").call(d3.axisLeft(y));
        svg.select(".grid-x").call(d3.axisBottom(x).tickSize(-height).tickFormat("")).attr("transform", `translate(0,${height})`).attr("opacity", 0.1);
        svg.select(".grid-y").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

        const data = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / 200);
        data.push(domain[1]);

        // Draw function
        const line = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(data).attr("d", line);

        // Draw epigraph
        // Epigraph is area ABOVE curve, up to top of chart
        const area = d3.area()
            .x(d => x(d))
            .y0(d => y(func(d)))
            .y1(0); // SVG y=0 is top

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
        svg.select(".slice-line")
            .attr("x1", 0).attr("x2", plotContainer.clientWidth) // Full width
            .attr("y1", yAlpha).attr("y2", yAlpha);

        // Find Sublevel Set intervals { x | f(x) <= alpha }
        // Simple numerical scan
        const intervals = [];
        let inSet = false;
        let start = null;
        const step = (domain[1] - domain[0]) / 400;

        for(let t = domain[0]; t <= domain[1]; t += step) {
            const val = func(t);
            if (val <= alpha) {
                if (!inSet) { inSet = true; start = t; }
            } else {
                if (inSet) { inSet = false; intervals.push([start, t]); }
            }
        }
        if (inSet) intervals.push([start, domain[1]]);

        // Render intervals on x-axis
        const g = svg.select(".sublevel-set-group");
        g.selectAll("*").remove();

        intervals.forEach(interval => {
            const x1 = x(interval[0]);
            const x2 = x(interval[1]);
            if (Math.abs(x2-x1) < 1) return;

            g.append("rect")
                .attr("x", x1)
                .attr("y", 0)
                .attr("width", x2 - x1)
                .attr("height", 8)
                .attr("fill", "#ff6b6b")
                .attr("rx", 2);
        });
    }

    function updateText() {
        const alpha = parseFloat(alphaSlider.value);
        alphaDisplay.textContent = alpha.toFixed(1);

        let msg = "";
        if (toggle.checked) {
            msg += selectedFunc.convex
                ? `<span style="color: var(--color-success); font-weight: bold;">Epigraph is Convex.</span> `
                : `<span style="color: var(--color-error); font-weight: bold;">Epigraph is Non-Convex.</span> `;
        }

        msg += `Sublevel set S<sub>${alpha.toFixed(1)}</sub> is shown in red below axis.`;

        if (selectedFunc.convex) {
            msg += ` (Convex functions have convex sublevel sets for all α)`;
        } else {
            // Check if current sublevel set is convex (single interval)
            // Visually user can see.
        }

        output.innerHTML = msg;
    }

    // Event Listeners
    funcSelect.addEventListener("change", (e) => {
        selectedName = e.target.value;
        selectedFunc = functions[selectedName];

        // Reset slider
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
        updateText();
    });

    new ResizeObserver(() => {
        setupChart();
        // Re-set slider bounds
        const [min, max] = selectedFunc.yRange;
        alphaSlider.min = min;
        alphaSlider.max = max;
        if(!alphaSlider.value) alphaSlider.value = (min+max)/2;

        update();
    }).observe(plotContainer);

    // Initial trigger
    const [min, max] = selectedFunc.yRange;
    alphaSlider.min = min;
    alphaSlider.max = max;
    alphaSlider.value = 1.0; // Good default

    setupChart();
    update();
}
