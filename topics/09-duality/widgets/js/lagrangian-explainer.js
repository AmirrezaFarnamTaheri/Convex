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
    const problems = {
        "x_squared": {
            title: "Minimize x² s.t. x ≥ 1",
            f: x => x**2,
            g: x => 1 - x, // g(x) <= 0
            domain: {x: [-3, 3], y: [-5, 10]},
            dual_domain: {nu: [0, 10], g: [-5, 2]},
            dual_func: nu => nu - nu**2 / 4,
            inf_x: nu => nu/2
        },
        "neg_log": {
            title: "Minimize -log(x) s.t. x ≤ 2",
            f: x => -Math.log(x),
            g: x => x - 2,
            domain: {x: [0.1, 5], y: [-5, 5]},
            dual_domain: {nu: [0, 5], g: [-5, 2]},
            dual_func: nu => 1 - Math.log(1/nu) - 2*nu,
            inf_x: nu => 1/nu
        }
    };
    let selectedProblem = problems.x_squared;

    container.innerHTML = `
        <div class="lagrangian-explainer-widget">
            <div class="plots-container" style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div id="plot-main" style="flex: 2; min-width: 300px; height: 350px;"></div>
                <div id="plot-dual" style="flex: 1; min-width: 200px; height: 350px;"></div>
            </div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="problem-select">Select Problem:</label>
                <select id="problem-select"></select>
                <p><strong>Problem:</strong> <span id="problem-title"></span></p>
                <label for="nu-slider">Lagrange multiplier ν ≥ 0: <span id="nu-val-display">2.0</span></label>
                <input id="nu-slider" type="range" min="0" max="10" value="2" step="0.1" style="width: 100%;">
                <div class="widget-output" id="lagrangian-formula" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const problemSelect = container.querySelector("#problem-select");
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

        const x = d3.scaleLinear().domain(selectedProblem.domain.x).range([0, width]);
        const y = d3.scaleLinear().domain(selectedProblem.domain.y).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path").attr("class", "constraint-boundary").attr("fill", "var(--color-primary-light)").attr("opacity", 0.3);
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

        const nu = d3.scaleLinear().domain(selectedProblem.dual_domain.nu).range([0, width]);
        const g = d3.scaleLinear().domain(selectedProblem.dual_domain.g).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(nu).ticks(3)).append("text").text("ν").attr("x", width).attr("dx", "-0.5em").attr("fill", "currentColor");
        svg.append("g").call(d3.axisLeft(g).ticks(5));

        svg.append("path").attr("class", "dual-path").attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2);
        svg.append("g").attr("class", "current-nu-group");

        return { svg, nu, g };
    }

    function update() {
        const nu_val = parseFloat(nuSlider.value);
        nuValDisplay.textContent = nu_val.toFixed(1);

        const { f, g, inf_x, dual_func, domain } = selectedProblem;

        const lagrangian = x_val => f(x_val) + nu_val * g(x_val);
        const data = d3.range(domain.x[0], domain.x[1], 0.1);

        const area = d3.area()
            .x(d => mainPlot.x(d))
            .y0(mainPlot.y.range()[0])
            .y1(d => mainPlot.y(g(d) > 0 ? domain.y[1] : domain.y[0]));
        mainPlot.svg.select(".constraint-boundary").datum(data).attr("d", area);

        mainPlot.svg.select(".f-path").datum(data).attr("d", d3.line().x(d => mainPlot.x(d)).y(d => mainPlot.y(f(d))));
        mainPlot.svg.select(".lagrangian-path").datum(data).attr("d", d3.line().x(d => mainPlot.x(d)).y(d => mainPlot.y(lagrangian(d))));

        const min_x = inf_x(nu_val);
        const g_nu = lagrangian(min_x);
        mainPlot.svg.select(".infimum-point").attr("cx", mainPlot.x(min_x)).attr("cy", mainPlot.y(g_nu));

        const dualData = d3.range(selectedProblem.dual_domain.nu[0], selectedProblem.dual_domain.nu[1], 0.1);
        dualPlot.svg.select(".dual-path").datum(dualData).attr("d", d3.line().x(d => dualPlot.nu(d)).y(d => dualPlot.g(dual_func(d))));

        const nuGroup = dualPlot.svg.select(".current-nu-group");
        nuGroup.selectAll("*").remove();
        nuGroup.append("line").attr("x1", dualPlot.nu(nu_val)).attr("y1", dualPlot.g.range()[0])
            .attr("x2", dualPlot.nu(nu_val)).attr("y2", dualPlot.g(g_nu)).attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "4 4");
        nuGroup.append("circle").attr("cx", dualPlot.nu(nu_val)).attr("cy", dualPlot.g(g_nu)).attr("r", 5).attr("fill", "var(--color-danger)");

        formulaDisplay.innerHTML = `L(x, ν) = f(x) + ν*g(x) <br> Dual value g(ν) = infₓ L(x, ν) = <strong>${g_nu.toFixed(2)}</strong>`;
    }

    function setup() {
        mainPlot = createMainPlot();
        dualPlot = createDualPlot();
        update();
    }

    function changeProblem(key) {
        selectedProblem = problems[key];
        document.getElementById('problem-title').textContent = selectedProblem.title;
        nuSlider.max = selectedProblem.dual_domain.nu[1];
        setup();
    }

    Object.keys(problems).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = problems[key].title;
        problemSelect.appendChild(option);
    });

    problemSelect.addEventListener('change', e => changeProblem(e.target.value));
    nuSlider.oninput = update;
    new ResizeObserver(setup).observe(container);
    changeProblem('x_squared');
}
