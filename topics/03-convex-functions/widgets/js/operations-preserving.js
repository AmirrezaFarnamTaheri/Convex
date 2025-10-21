/**
 * Widget: Operations Preserving Convexity
 *
 * Description: Interactively demonstrates how convexity is preserved under operations
 *              like non-negative weighted sums and composition with affine maps.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOperationsPreserving(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="operations-preserving-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="op-preserving-select">Operation:</label>
                <select id="op-preserving-select">
                    <option value="sum">Non-negative Weighted Sum</option>
                    <option value="affine">Composition with Affine Map</option>
                </select>
                <div id="op-specific-controls" style="margin-top: 10px;"></div>
                 <div id="legend" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const opSelect = container.querySelector("#op-preserving-select");
    const controlsContainer = container.querySelector("#op-specific-controls");
    const plotContainer = container.querySelector("#plot-container");
    const legendContainer = container.querySelector("#legend");

    let svg, x, y;
    const funcs = { f1: x => x**2, f2: x => Math.exp(0.5 * x) };

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([0, 25]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path").attr("class", "path1").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 1.5).attr("stroke-dasharray", "5,5");
        svg.append("path").attr("class", "path2").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 1.5).attr("stroke-dasharray", "5,5");
        svg.append("path").attr("class", "result-path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 3);
    }

    function update() {
        const operation = opSelect.value;
        controlsContainer.innerHTML = '';
        const data = d3.range(-5, 5.1, 0.1);
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));

        if (operation === 'sum') {
            legendContainer.innerHTML = `
                <span style="color: var(--color-primary);">&#9472;</span> f₁(x) = x² |
                <span style="color: var(--color-accent);">&#9472;</span> f₂(x) = e⁰⁵ˣ |
                <span style="color: var(--color-danger); font-weight: bold;">&#9472;</span> Result
            `;
            controlsContainer.innerHTML = `
                <label>w₁: <span id="w1-val">1.0</span></label><input type="range" id="w1" min="0" max="5" step="0.1" value="1">
                <label>w₂: <span id="w2-val">1.0</span></label><input type="range" id="w2" min="0" max="5" step="0.1" value="1">
            `;
            const w1 = controlsContainer.querySelector("#w1");
            const w2 = controlsContainer.querySelector("#w2");

            const drawSum = () => {
                const w1_val = parseFloat(w1.value);
                const w2_val = parseFloat(w2.value);
                controlsContainer.querySelector('#w1-val').textContent = w1_val.toFixed(1);
                controlsContainer.querySelector('#w2-val').textContent = w2_val.toFixed(1);

                svg.select(".path1").datum(data.map(d => ({ x: d, y: funcs.f1(d) }))).attr("d", line);
                svg.select(".path2").datum(data.map(d => ({ x: d, y: funcs.f2(d) }))).attr("d", line);
                svg.select(".result-path").datum(data.map(d => ({ x: d, y: w1_val * funcs.f1(d) + w2_val * funcs.f2(d) }))).attr("d", line);
            };
            w1.oninput = drawSum;
            w2.oninput = drawSum;
            drawSum();

        } else if (operation === 'affine') {
            legendContainer.innerHTML = `
                <span style="color: var(--color-primary);">&#9472;</span> f(x) = x² |
                <span style="color: var(--color-danger); font-weight: bold;">&#9472;</span> f(ax+b)
            `;
            controlsContainer.innerHTML = `
                <label>a: <span id="a-val">1.0</span></label><input type="range" id="a" min="-2" max="2" step="0.1" value="1">
                <label>b: <span id="b-val">0.0</span></label><input type="range" id="b" min="-3" max="3" step="0.1" value="0">
            `;
            const a = controlsContainer.querySelector("#a");
            const b = controlsContainer.querySelector("#b");

            const drawAffine = () => {
                const a_val = parseFloat(a.value);
                const b_val = parseFloat(b.value);
                controlsContainer.querySelector('#a-val').textContent = a_val.toFixed(1);
                controlsContainer.querySelector('#b-val').textContent = b_val.toFixed(1);

                svg.select(".path1").datum(data.map(d => ({ x: d, y: funcs.f1(d) }))).attr("d", line);
                svg.select(".path2").attr("d", null);
                svg.select(".result-path").datum(data.map(d => ({ x: d, y: funcs.f1(a_val * d + b_val) }))).attr("d", line);
            };
            a.oninput = drawAffine;
            b.oninput = drawAffine;
            drawAffine();
        }
    }

    opSelect.onchange = update;
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
