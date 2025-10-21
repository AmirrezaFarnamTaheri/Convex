/**
 * Widget: Lagrangian Explainer
 *
 * Description: Visualizes the Lagrangian function for a simple constrained problem and show how the dual function is a pointwise infimum.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initLagrangianExplainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="lagrangian-explainer-widget">
            <div class="widget-controls">
                <p>Problem: Minimize <strong>x²</strong> subject to <strong>x ≥ 1</strong> (or 1-x ≤ 0)</p>
                <label for="nu-slider">Lagrange multiplier ν (must be ≥ 0):</label>
                <input id="nu-slider" type="range" min="0" max="10" value="2" step="0.1">
                <span id="nu-val-display">2.0</span>
            </div>
            <div id="plot-container-main"></div>
            <div id="plot-container-dual"></div>
            <div class="widget-output" id="lagrangian-formula"></div>
        </div>
    `;

    const nuSlider = container.querySelector("#nu-slider");
    const nuValDisplay = container.querySelector("#nu-val-display");
    const plotContainerMain = container.querySelector("#plot-container-main");
    const plotContainerDual = container.querySelector("#plot-container-dual");
    const formulaDisplay = container.querySelector("#lagrangian-formula");

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = plotContainerMain.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Main plot (L(x,ν) vs x)
    const svgMain = d3.select(plotContainerMain).append("svg").attr("width", "100%").attr("height", height + margin.top + margin.bottom).attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 10]).range([height, 0]);
    svgMain.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svgMain.append("g").call(d3.axisLeft(y));
    const f_path = svgMain.append("path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 1.5).attr("stroke-dasharray", "5,5");
    const lagrangianPath = svgMain.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5);
    const infimumPoint = svgMain.append("circle").attr("r", 5).attr("fill", "var(--color-danger)");

    // Dual plot (g(ν) vs ν)
    const svgDual = d3.select(plotContainerDual).append("svg").attr("width", "100%").attr("height", 200).attr("viewBox", `0 0 ${width + margin.left + margin.right} 200`).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const nu_scale = d3.scaleLinear().domain([0, 10]).range([0, width]);
    const g_scale = d3.scaleLinear().domain([-5, 2]).range([160, 0]);
    svgDual.append("g").attr("transform", `translate(0,160)`).call(d3.axisBottom(nu_scale).ticks(5));
    svgDual.append("g").call(d3.axisLeft(g_scale).ticks(5));
    svgDual.append("text").text("Dual function g(ν)").attr("x", width/2).attr("y", 0).attr("text-anchor", "middle");
    const dualPath = svgDual.append("path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2);
    const currentNuLine = svgDual.append("line").attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "4 4");

    function update(nu) {
        nuValDisplay.textContent = nu.toFixed(1);
        formulaDisplay.innerHTML = `<strong>L(x, ν) = x² + ${nu.toFixed(1)}(1 - x)</strong>`;

        // Main plot
        const f = x_val => x_val**2;
        const lagrangian = x_val => f(x_val) + nu * (1 - x_val);
        const data = d3.range(-3, 3.1, 0.1);
        f_path.datum(data).attr("d", d3.line().x(d => x(d)).y(d => y(f(d))));
        lagrangianPath.datum(data).attr("d", d3.line().x(d => x(d)).y(d => y(lagrangian(d))));

        // Infimum of L(x,ν) is at x = ν/2
        const min_x = nu / 2;
        const g_nu = lagrangian(min_x); // This is the value of the dual function
        infimumPoint.attr("cx", x(min_x)).attr("cy", y(g_nu));

        // Dual plot
        const dual_f = v => v - v**2 / 4;
        const dualData = d3.range(0, 10.1, 0.1);
        dualPath.datum(dualData).attr("d", d3.line().x(d => nu_scale(d)).y(d => g_scale(dual_f(d))));
        currentNuLine.attr("x1", nu_scale(nu)).attr("y1", g_scale.range()[0]).attr("x2", nu_scale(nu)).attr("y2", g_scale(g_nu));
    }

    nuSlider.addEventListener("input", (e) => update(+e.target.value));
    update(+nuSlider.value);
}
