/**
 * Widget: Operations Preserving Convexity
 *
 * Description: Interactively demonstrates how convexity is preserved under operations
 *              like non-negative weighted sums, composition with affine maps, and pointwise maximum.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initOperationsPreserving(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 350px;"></div>
            <div class="widget-controls">
                <div class="widget-control-group">
                    <label class="widget-label">Operation</label>
                    <select id="op-preserving-select" class="widget-select">
                         <option value="sum">Non-negative Weighted Sum</option>
                         <option value="affine">Composition with Affine Map</option>
                         <option value="max">Pointwise Maximum</option>
                    </select>
                </div>
                 <div class="widget-control-group" id="op-specific-controls" style="flex: 2; flex-direction: row; gap: 16px;"></div>
            </div>

            <div id="legend-output" class="widget-output"></div>
        </div>
    `;

    const opSelect = container.querySelector("#op-preserving-select");
    const controlsContainer = container.querySelector("#op-specific-controls");
    const plotContainer = container.querySelector("#plot-container");
    const legendOutput = container.querySelector("#legend-output");

    let svg, x, y;
    const funcs = {
        f1: x => x**2 - 1,
        f2: x => Math.exp(0.6 * x),
        f3: x => Math.abs(x) - 1
    };

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

        x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
        y = d3.scaleLinear().domain([-2, 8]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).ticks(10).tickSize(-width).tickFormat(""));

        // Axes
        svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));

        // Paths
        svg.append("path").attr("class", "path1").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
        svg.append("path").attr("class", "path2").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "5,5");
        svg.append("path").attr("class", "result-path").attr("fill", "none").attr("stroke", "var(--color-success)").attr("stroke-width", 4).attr("opacity", 0.9);
    }

    function update() {
        const operation = opSelect.value;
        controlsContainer.innerHTML = '';

        const data = d3.range(-3, 3.1, 0.1);
        const line = d3.line().x(d => x(d.x)).y(d => y(d.y));

        if (operation === 'sum') {
            // Controls
            const w1Div = document.createElement('div');
            w1Div.style.flex = "1";
            w1Div.innerHTML = `<label class="widget-label">w₁: <span id="w1-val" class="widget-value-display">1.0</span></label><input type="range" id="w1" min="0" max="2" step="0.1" value="1" class="widget-slider">`;

            const w2Div = document.createElement('div');
            w2Div.style.flex = "1";
            w2Div.innerHTML = `<label class="widget-label">w₂: <span id="w2-val" class="widget-value-display">1.0</span></label><input type="range" id="w2" min="0" max="2" step="0.1" value="1" class="widget-slider">`;

            controlsContainer.appendChild(w1Div);
            controlsContainer.appendChild(w2Div);

            const w1Input = w1Div.querySelector("input");
            const w2Input = w2Div.querySelector("input");
            const w1Val = w1Div.querySelector("span");
            const w2Val = w2Div.querySelector("span");

            const drawSum = () => {
                const w1 = parseFloat(w1Input.value);
                const w2 = parseFloat(w2Input.value);
                w1Val.textContent = w1.toFixed(1);
                w2Val.textContent = w2.toFixed(1);

                svg.select(".path1").style("display", null).datum(data.map(d => ({ x: d, y: funcs.f1(d) }))).attr("d", line);
                svg.select(".path2").style("display", null).datum(data.map(d => ({ x: d, y: funcs.f2(d) }))).attr("d", line);

                // Result
                svg.select(".result-path").datum(data.map(d => ({ x: d, y: w1 * funcs.f1(d) + w2 * funcs.f2(d) }))).attr("d", line);

                legendOutput.innerHTML = `
                    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
                        <div style="color: var(--color-primary);">f₁(x) = x²-1</div>
                        <div style="color: var(--color-accent);">f₂(x) = e⁰·⁶ˣ</div>
                    </div>
                    <div style="text-align: center; margin-top: 6px;">
                        <div style="color: var(--color-success); font-weight: bold;">h(x) = ${w1.toFixed(1)}f₁ + ${w2.toFixed(1)}f₂</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted);">Weighted sum is convex if w₁, w₂ ≥ 0.</div>
                    </div>
                `;
            };

            w1Input.oninput = drawSum;
            w2Input.oninput = drawSum;
            drawSum();

        } else if (operation === 'affine') {
            const aDiv = document.createElement('div');
            aDiv.style.flex = "1";
            aDiv.innerHTML = `<label class="widget-label">Scale a: <span id="a-val" class="widget-value-display">1.0</span></label><input type="range" id="a" min="-2" max="2" step="0.1" value="1" class="widget-slider">`;

            const bDiv = document.createElement('div');
            bDiv.style.flex = "1";
            bDiv.innerHTML = `<label class="widget-label">Shift b: <span id="b-val" class="widget-value-display">0.0</span></label><input type="range" id="b" min="-2" max="2" step="0.1" value="0" class="widget-slider">`;

            controlsContainer.appendChild(aDiv);
            controlsContainer.appendChild(bDiv);

            const aInput = aDiv.querySelector("input");
            const bInput = bDiv.querySelector("input");
            const aVal = aDiv.querySelector("span");
            const bVal = bDiv.querySelector("span");

            const drawAffine = () => {
                const a = parseFloat(aInput.value);
                const b = parseFloat(bInput.value);
                aVal.textContent = a.toFixed(1);
                bVal.textContent = b.toFixed(1);

                svg.select(".path1").style("display", null).datum(data.map(d => ({ x: d, y: funcs.f1(d) }))).attr("d", line);
                svg.select(".path2").style("display", "none");

                // Result: f(ax+b)
                svg.select(".result-path").datum(data.map(d => ({ x: d, y: funcs.f1(a * d + b) }))).attr("d", line);

                legendOutput.innerHTML = `
                    <div style="text-align: center;">
                        <div style="color: var(--color-primary);">f(z) = z²-1</div>
                        <div style="color: var(--color-success); font-weight: bold; margin-top: 4px;">g(x) = f(${a.toFixed(1)}x + ${b.toFixed(1)})</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted);">Composition with affine map preserves convexity.</div>
                    </div>
                `;
            };
            aInput.oninput = drawAffine;
            bInput.oninput = drawAffine;
            drawAffine();
        } else if (operation === 'max') {
             controlsContainer.innerHTML = `<div class="widget-label" style="align-self: center; color: var(--color-text-muted);">Comparing f₁(x) and f₃(x)</div>`;

             const drawMax = () => {
                svg.select(".path1").style("display", null).datum(data.map(d => ({ x: d, y: funcs.f1(d) }))).attr("d", line);
                svg.select(".path2").style("display", null).datum(data.map(d => ({ x: d, y: funcs.f3(d) }))).attr("d", line);

                svg.select(".result-path").datum(data.map(d => ({ x: d, y: Math.max(funcs.f1(d), funcs.f3(d)) }))).attr("d", line);

                legendOutput.innerHTML = `
                    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
                        <div style="color: var(--color-primary);">f₁(x) = x²-1</div>
                        <div style="color: var(--color-accent);">f₃(x) = |x|-1</div>
                    </div>
                    <div style="text-align: center; margin-top: 6px;">
                        <div style="color: var(--color-success); font-weight: bold;">h(x) = max(f₁, f₃)</div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted);">Pointwise maximum preserves convexity.</div>
                    </div>
                `;
             }
             drawMax();
        }
    }

    opSelect.addEventListener("change", update);
    new ResizeObserver(() => { setupChart(); update(); }).observe(plotContainer);
    setupChart();
    update();
}
