/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and visualizes its epigraph,
 *              illustrating the connection between a convex function and its convex epigraph.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="epigraph-visualizer-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="epigraph-func-select">Function:</label>
                <select id="epigraph-func-select"></select>
                <label class="widget-toggle" style="margin-left: 20px;">
                    <input type="checkbox" id="show-epigraph-toggle">
                    <span>Show Epigraph</span>
                </label>
                 <div id="epigraph-output" class="widget-output" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#epigraph-func-select");
    const toggle = container.querySelector("#show-epigraph-toggle");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#epigraph-output");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5], convex: true },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-5, 5], convex: true },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3], convex: true },
        "x³ (Non-Convex)": { func: x => x**3, domain: [-3, 3], convex: false },
    };
    let selectedFunc = functions[Object.keys(functions)[0]];

    Object.keys(functions).forEach(name => {
        funcSelect.innerHTML += `<option value="${name}">${name}</option>`;
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
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

        svg.append("path").attr("class", "epigraph-area").attr("fill", "var(--color-primary-light)").style("opacity", 0);
        svg.append("path").attr("class", "function-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);
    }

    function draw() {
        const { func, domain } = selectedFunc;
        x.domain(domain);
        const data = d3.range(domain[0], domain[1] + 0.1, (domain[1] - domain[0]) / 200);
        const yData = data.map(func);

        const yDomain = d3.extent(yData);
        yDomain[1] += (yDomain[1] - yDomain[0]) * 0.2; // Add some padding
        y.domain(yDomain).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const lineGenerator = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(data).attr("d", lineGenerator);

        const areaGenerator = d3.area().x(d => x(d)).y0(d => y(func(d))).y1(y(y.domain()[1]));
        svg.select(".epigraph-area").datum(data).attr("d", areaGenerator);

        toggleEpigraph();
    }

    function toggleEpigraph() {
        const show = toggle.checked;
        svg.select(".epigraph-area").transition().duration(300).style("opacity", show ? 0.7 : 0);

        if (show) {
            output.innerHTML = `The epigraph is the set of points lying on or above the function's graph.
                A function is convex if and only if its epigraph is a <strong>convex set</strong>.
                This function's epigraph is ${selectedFunc.convex ? "<strong>convex</strong>." : "<strong>not convex</strong>."}`;
        } else {
            output.innerHTML = '';
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
