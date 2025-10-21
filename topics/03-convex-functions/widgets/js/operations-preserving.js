/**
 * Widget: Operations Preserving Convexity
 *
 * Description: An interactive tool to show how operations like composition with an affine map preserve convexity.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOperationsPreserving(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="operations-preserving-widget">
            <div class="widget-controls">
                <label for="op-preserving-select">Operation:</label>
                <select id="op-preserving-select">
                    <option value="sum">Non-negative Weighted Sum</option>
                    <option value="affine">Composition with Affine Map</option>
                </select>
                <div id="op-specific-controls"></div>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const opSelect = container.querySelector("#op-preserving-select");
    const controlsContainer = container.querySelector("#op-specific-controls");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 25]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const path1 = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 1.5).attr("stroke-dasharray", "5,5");
    const path2 = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 1.5).attr("stroke-dasharray", "5,5");
    const resultPath = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 3);

    const funcs = {
        f1: x => x**2,
        f2: x => Math.exp(0.5 * x)
    };

    function update() {
        const operation = opSelect.value;
        controlsContainer.innerHTML = '';

        const data = d3.range(-5, 5.1, 0.1);
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));

        if (operation === 'sum') {
            controlsContainer.innerHTML = `
                <label>w₁:</label><input type="range" id="w1" min="0" max="5" step="0.1" value="1">
                <label>w₂:</label><input type="range" id="w2" min="0" max="5" step="0.1" value="1">
            `;
            const w1 = controlsContainer.querySelector("#w1");
            const w2 = controlsContainer.querySelector("#w2");

            const drawSum = () => {
                const weight1 = +w1.value;
                const weight2 = +w2.value;
                path1.datum(data.map(d => ({x: d, y: funcs.f1(d)}))).attr("d", line);
                path2.datum(data.map(d => ({x: d, y: funcs.f2(d)}))).attr("d", line);
                resultPath.datum(data.map(d => ({x: d, y: weight1 * funcs.f1(d) + weight2 * funcs.f2(d)}))).attr("d", line);
            };
            w1.addEventListener('input', drawSum);
            w2.addEventListener('input', drawSum);
            drawSum();

        } else if (operation === 'affine') {
            controlsContainer.innerHTML = `
                f(ax + b): <label>a:</label><input type="range" id="a" min="-2" max="2" step="0.1" value="1">
                <label>b:</label><input type="range" id="b" min="-3" max="3" step="0.1" value="0">
            `;
            const a = controlsContainer.querySelector("#a");
            const b = controlsContainer.querySelector("#b");

            const drawAffine = () => {
                const scale = +a.value;
                const translate = +b.value;
                path1.datum(data.map(d => ({x: d, y: funcs.f1(d)}))).attr("d", line);
                path2.attr("d", null);
                resultPath.datum(data.map(d => ({x: d, y: funcs.f1(scale * d + translate)}))).attr("d", line);
            };
            a.addEventListener('input', drawAffine);
            b.addEventListener('input', drawAffine);
            drawAffine();
        }
    }

    opSelect.addEventListener("change", update);
    update();
}
