/**
 * Widget: KKT Conditions Checker
 *
 * Description: An interactive tool to check the KKT conditions for a user-selected
 *              point and Lagrange multiplier in a simple constrained optimization problem.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initKKTChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const problems = {
        "QP": {
            title: "Minimize x² + y² s.t. x + y ≥ 2",
            func: (x, y) => x**2 + y**2,
            grad_f: (x, y) => [2*x, 2*y],
            g: (x, y) => 2 - (x + y), // g(x) <= 0
            grad_g: (x, y) => [-1, -1],
            domain: {x: [-1, 3], y: [-1, 3]}
        }
    };
    let selectedProblem = problems["QP"];
    let candidate_x = { x: 1, y: 1 };
    let mu = 2.0;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="kkt-checker-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <p><strong>Problem:</strong> ${selectedProblem.title}</p>
                <label>Lagrange multiplier μ = <span id="mu-val">2.0</span></label>
                <input id="mu-slider" type="range" min="0" max="4" step="0.1" value="2" style="width: 100%;">
                <div class="widget-output" id="kkt-status" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const muSlider = container.querySelector("#mu-slider");
    const muValSpan = container.querySelector("#mu-val");
    const kktStatus = container.querySelector("#kkt-status");

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 40};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain(selectedProblem.domain.x).range([0, width]);
        y = d3.scaleLinear().domain(selectedProblem.domain.y).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Feasible region
        const feasiblePath = "M" + [x(2), y(0)] + "L" + [x(3),y(0)] + "L" + [x(3),y(3)] + "L" + [x(0),y(3)] + "L" + [x(0),y(2)] + "Z";
        svg.append("path").attr("d", feasiblePath).attr("fill", "var(--color-primary-light)");

        // Contours
        const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0, 2*Math.PI, 0.1).map(a => [r*Math.cos(a), r*Math.sin(a)]));
        svg.selectAll("path.contour").data(contours).enter().append("path").attr("class", "contour")
           .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)");

        const drag = d3.drag().on("drag", (event) => {
            candidate_x = { x: x.invert(event.x), y: y.invert(event.y) };
            update();
        });
        svg.append("circle").attr("class", "candidate-point").attr("r", 6)
           .attr("fill", "var(--color-danger)").style("cursor", "move").call(drag);
    }

    function checkKKT() {
        const { func, grad_f, g, grad_g } = selectedProblem;
        const { x, y } = candidate_x;

        const grad_L = [
            grad_f(x, y)[0] + mu * grad_g(x, y)[0],
            grad_f(x, y)[1] + mu * grad_g(x, y)[1]
        ];

        const conditions = {
            "Primal Feasibility (g(x) ≤ 0)": g(x, y) <= 1e-6,
            "Dual Feasibility (μ ≥ 0)": mu >= 0,
            "Complementary Slackness (|μ * g(x)| ≈ 0)": Math.abs(mu * g(x, y)) < 1e-4,
            "Stationarity (||∇L|| ≈ 0)": Math.sqrt(grad_L[0]**2 + grad_L[1]**2) < 1e-4
        };

        kktStatus.innerHTML = "<h5>KKT Conditions Status:</h5><ul>" +
            Object.entries(conditions).map(([name, status]) => `
                <li>${name}: <strong style="color:${status ? 'var(--color-success)' : 'var(--color-danger)'};">
                ${status ? 'Satisfied' : 'Violated'}</strong></li>`).join('') + "</ul>";
    }

    function update() {
        mu = parseFloat(muSlider.value);
        muValSpan.textContent = mu.toFixed(1);
        svg.select(".candidate-point").attr("cx", x(candidate_x.x)).attr("cy", y(candidate_x.y));
        checkKKT();
    }

    muSlider.addEventListener("input", update);
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
