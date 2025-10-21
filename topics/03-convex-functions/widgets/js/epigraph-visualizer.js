/**
 * Widget: Epigraph Visualizer
 *
 * Description: Shows the 2D graph of a function and allows the user to toggle the visualization of its epigraph.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initEpigraphVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="epigraph-visualizer-widget">
            <div class="widget-controls">
                <label for="epigraph-func-select">Function:</label>
                <select id="epigraph-func-select"></select>
                <label class="widget-toggle">
                    <input type="checkbox" id="show-epigraph-toggle">
                    <span>Show Epigraph</span>
                </label>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#epigraph-func-select");
    const toggle = container.querySelector("#show-epigraph-toggle");
    const plotContainer = container.querySelector("#plot-container");

    const functions = {
        "x² (Convex)": { func: x => x**2, domain: [-5, 5] },
        "|x| (Convex)": { func: x => Math.abs(x), domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), domain: [-3, 3] },
        "x³ (Non-Convex)": { func: x => x**3, domain: [-3, 3] },
    };
    let selectedFunctionName = Object.keys(functions)[0];

    Object.keys(functions).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        funcSelect.appendChild(option);
    });

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");

    const path = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 3);
    const epigraphArea = svg.append("path").attr("fill", "var(--color-primary-light)").attr("opacity", 0.7).style("display", "none");

    function draw() {
        const { func, domain } = functions[selectedFunctionName];
        x.domain(domain);
        const data = d3.range(domain[0], domain[1] + 0.1, 0.1);
        const yData = data.map(func);
        y.domain([d3.min(yData), d3.max(yData)]).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const lineGenerator = d3.line().x(d => x(d)).y(d => y(func(d)));
        path.datum(data).attr("d", lineGenerator);

        const areaGenerator = d3.area().x(d => x(d)).y0(d => y(func(d))).y1(0);
        epigraphArea.datum(data).attr("d", areaGenerator);

        epigraphArea.style("display", toggle.checked ? "block" : "none");
    }

    funcSelect.addEventListener("change", (e) => {
        selectedFunctionName = e.target.value;
        draw();
    });
    toggle.addEventListener("change", () => {
        epigraphArea.style("display", toggle.checked ? "block" : "none");
    });

    draw();
}
