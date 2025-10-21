/**
 * Widget: Lagrangian and Dual Function Explainer
 *
 * Description: Visualizes the Lagrangian function L(x, ν) for a simple constrained problem.
 *              Shows how the dual function g(ν) is the pointwise infimum of L(x, ν) over x.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initLagrangianExplainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="lagrangian-explainer-widget">
            <div class="plots-container" style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div id="plot-main" style="flex: 2; min-width: 300px; height: 350px;"></div>
                <div id="plot-dual" style="flex: 1; min-width: 200px; height: 350px;"></div>
            </div>
            <div class="widget-controls" style="padding: 15px;">
                <p><strong>Problem:</strong> Minimize x² s.t. x ≥ 1</p>
                <label for="nu-slider">Lagrange multiplier ν ≥ 0: <span id="nu-val-display">2.0</span></label>
                <input id="nu-slider" type="range" min="0" max="10" value="2" step="0.1" style="width: 100%;">
                <div class="widget-output" id="lagrangian-formula" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const nuSlider = container.querySelector("#nu-slider");
    const nuValDisplay = container.querySelector("#nu-val-display");
    const plotMainDiv = container.querySelector("#plot-main");
    const plotDualDiv = container.querySelector("#plot-dual");
    const formulaDisplay = container.querySelector("#lagrangian-formula");

    let mainPlot, dualPlot;

    function createMainPlot() {
        plotMainDiv.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotMainDiv.clientWidth - margin.left - margin.right;
        const height = plotMainDiv.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(plotMainDiv).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotMainDiv.clientWidth} ${plotMainDiv.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
        const y = d3.scaleLinear().domain([-5, 10]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path").attr("class", "f-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-dasharray", "4 4");
        svg.append("path").attr("class", "lagrangian-path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
        svg.append("circle").attr("class", "infimum-point").attr("r", 5).attr("fill", "var(--color-danger)");

        return { svg, x, y };
    }

    function createDualPlot() {
        plotDualDiv.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 40};
        const width = plotDualDiv.clientWidth - margin.left - margin.right;
        const height = plotDualDiv.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(plotDualDiv).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotDualDiv.clientWidth} ${plotDualDiv.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const nu = d3.scaleLinear().domain([0, 10]).range([0, width]);
        const g = d3.scaleLinear().domain([-5, 2]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(nu).ticks(3)).append("text").text("ν").attr("x", width).attr("dx", "-0.5em").attr("fill", "currentColor");
        svg.append("g").call(d3.axisLeft(g).ticks(5));

        svg.append("path").attr("class", "dual-path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2);
        svg.append("g").attr("class", "current-nu-group");

        return { svg, nu, g };
    }

    function update() {
        const nu_val = parseFloat(nuSlider.value);
        nuValDisplay.textContent = nu_val.toFixed(1);

        // --- Main Plot Calculations & Drawing ---
        const f = x_val => x_val**2;
        const lagrangian = x_val => f(x_val) + nu_val * (1 - x_val);
        const data = d3.range(-3, 3.1, 0.1);

        mainPlot.svg.select(".f-path").datum(data).attr("d", d3.line().x(d => mainPlot.x(d)).y(d => mainPlot.y(f(d))));
        mainPlot.svg.select(".lagrangian-path").datum(data).attr("d", d3.line().x(d => mainPlot.x(d)).y(d => mainPlot.y(lagrangian(d))));

        const min_x = nu_val / 2;
        const g_nu = lagrangian(min_x);
        mainPlot.svg.select(".infimum-point").attr("cx", mainPlot.x(min_x)).attr("cy", mainPlot.y(g_nu));

        // --- Dual Plot Calculations & Drawing ---
        const dual_f = v => v - v**2 / 4;
        const dualData = d3.range(0, 10.1, 0.1);
        dualPlot.svg.select(".dual-path").datum(dualData).attr("d", d3.line().x(d => dualPlot.nu(d)).y(d => dualPlot.g(dual_f(d))));

        const nuGroup = dualPlot.svg.select(".current-nu-group");
        nuGroup.selectAll("*").remove();
        nuGroup.append("line").attr("x1", dualPlot.nu(nu_val)).attr("y1", dualPlot.g.range()[0])
            .attr("x2", dualPlot.nu(nu_val)).attr("y2", dualPlot.g(g_nu)).attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "4 4");
        nuGroup.append("circle").attr("cx", dualPlot.nu(nu_val)).attr("cy", dualPlot.g(g_nu)).attr("r", 5).attr("fill", "var(--color-danger)");

        formulaDisplay.innerHTML = `L(x, ν) = x² + ${nu_val.toFixed(1)}(1 - x)<br>
                                  Dual value g(ν) = infₓ L(x, ν) = <strong>${g_nu.toFixed(2)}</strong>`;
    }

    function setup() {
        mainPlot = createMainPlot();
        dualPlot = createDualPlot();
        update();
    }

    nuSlider.oninput = update;
    new ResizeObserver(setup).observe(container);
    setup();
}
