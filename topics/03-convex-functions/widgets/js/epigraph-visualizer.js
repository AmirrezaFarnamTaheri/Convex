/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and visualizes its epigraph,
 *              illustrating the connection between a convex function and its convex epigraph.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 350px;"></div>
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="epigraph-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex-direction: row; align-items: center; gap: 8px;">
                    <input type="checkbox" id="show-epigraph-toggle" class="widget-checkbox">
                    <label for="show-epigraph-toggle" class="widget-label" style="cursor: pointer; margin: 0;">Show Epigraph (epi f)</label>
                </div>
            </div>
             <div id="epigraph-output" class="widget-output" style="min-height: 3em; display: flex; align-items: center;">
                Select 'Show Epigraph' to visualize the set of points above the graph.
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#epigraph-func-select");
    const toggle = container.querySelector("#show-epigraph-toggle");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#epigraph-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-2.5, 2.5], convex: true },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-3, 3], convex: true },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-2, 2], convex: true },
        "x³ (Non-Convex)": { func: x => x**3, domain: [-2, 2], convex: false },
        "sin(x) (Non-Convex)": { func: x => Math.sin(x), domain: [-Math.PI, Math.PI], convex: false }
    };
    let selectedFunc = functions[Object.keys(functions)[0]];

    Object.keys(functions).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        funcSelect.appendChild(opt);
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

        // Grid
        svg.append("g").attr("class", "grid-line x-grid");
        svg.append("g").attr("class", "grid-line y-grid");

        // Axes
        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis y-axis");

        // Layers
        svg.append("path").attr("class", "epigraph-area").attr("fill", "rgba(124, 197, 255, 0.3)").style("opacity", 0);
        svg.append("path").attr("class", "function-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);

        const data = d3.range(domain[0], domain[1] + 0.05, (domain[1] - domain[0]) / 200);
        const yVals = data.map(func);

        const yExtent = d3.extent(yVals);
        // Pad Y to show area above
        const yPadding = (yExtent[1] - yExtent[0]) * 0.5;
        y.domain([yExtent[0], yExtent[1] + yPadding]).nice();

        const width = plotContainer.clientWidth - 60;
        const height = plotContainer.clientHeight - 50;

        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));

        svg.select(".x-grid").call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

        const lineGenerator = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(data).attr("d", lineGenerator);

        const areaGenerator = d3.area()
            .x(d => x(d))
            .y0(d => y(func(d)))
            .y1(0); // Top of chart is y=0 in SVG coords? No, scale is inverted.
            // d3 area y1 is the "top" line. In SVG, y=0 is top.
            // y-scale(max) is 0.
            // So y1 should be y(y.domain()[1]) which is 0.

        svg.select(".epigraph-area").datum(data).attr("d", areaGenerator);

        toggleEpigraph();
    }

    function toggleEpigraph() {
        const show = toggle.checked;
        svg.select(".epigraph-area").transition().duration(300).style("opacity", show ? 1 : 0);

        if (show) {
            const msg = selectedFunc.convex
                ? `<span style="color: var(--color-success); font-weight: bold;">Convex Set!</span>`
                : `<span style="color: var(--color-error); font-weight: bold;">Non-Convex Set.</span>`;

            output.innerHTML = `
                <div>
                    <p><strong>epi f = { (x,t) | f(x) ≤ t }</strong> is shaded.</p>
                    <p>Function is convex ⟺ Epigraph is convex. Result: ${msg}</p>
                </div>
            `;
        } else {
            output.innerHTML = `<span style="color: var(--color-text-muted);">Select 'Show Epigraph' to visualize.</span>`;
        }
    }

    funcSelect.onchange = (e) => {
        selectedFunc = functions[e.target.value];
        draw();
    };
    toggle.onchange = toggleEpigraph;

    new ResizeObserver(() => {
        setupChart();
        draw();
    }).observe(plotContainer);

    setupChart();
    draw();
}
