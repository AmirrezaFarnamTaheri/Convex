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
            feasiblePath: "M-1,3 L3,-1 L3,3 Z",
            domain: {x: [-1, 3], y: [-1, 3]},
            solution: {x: 1, y: 1, mu: 2.0}
        },
        "QP2": {
            title: "Minimize (x-2)² + (y-2)² s.t. x² + y² ≤ 1",
            func: (x,y) => (x-2)**2 + (y-2)**2,
            grad_f: (x,y) => [2*(x-2), 2*(y-2)],
            g: (x,y) => x**2 + y**2 - 1,
            grad_g: (x,y) => [2*x, 2*y],
            domain: {x: [-2, 4], y: [-2, 4]},
            solution: {x: 1/Math.sqrt(2), y: 1/Math.sqrt(2), mu: 2*Math.sqrt(2)-2}
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
                <label for="problem-select">Select Problem:</label>
                <select id="problem-select"></select>
                <p><strong>Problem:</strong> <span id="problem-title"></span></p>
                <label>Lagrange multiplier μ = <span id="mu-val">2.0</span></label>
                <input id="mu-slider" type="range" min="0" max="4" step="0.1" value="2" style="width: 100%;">
                <button id="reset-kkt-btn">Reset to Solution</button>
                <div class="widget-output" id="kkt-status" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const problemSelect = container.querySelector("#problem-select");
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

        const content = svg.append("g").attr("class", "plot-content");

        // Feasible region
        if(selectedProblem.feasiblePath) {
            content.append("path").attr("d", selectedProblem.feasiblePath)
                .attr("transform", `scale(${x.range()[1]/selectedProblem.domain.x[1]}, ${y.range()[0]/selectedProblem.domain.y[1]})`)
                .attr("fill", "var(--color-primary-light)");
        } else {
             const g_boundary = d3.range(0, 2 * Math.PI, 0.1).map(a => [Math.cos(a), Math.sin(a)]);
             content.append("path").attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1]))(g_boundary)+"Z").attr("fill", "var(--color-primary-light)");
        }

        // Contours
        const contours = d3.contours().size([100, 100])
            .thresholds(d3.range(0, 20, 1))
            (d3.range(100*100).map(i => {
                const xi = x.invert(i%100 * x.range()[1]/100);
                const yi = y.invert(Math.floor(i/100) * y.range()[0]/100);
                return selectedProblem.func(xi, yi);
            }));
        content.selectAll("path.contour").data(contours).enter().append("path").attr("class", "contour")
           .attr("d", d3.geoPath(d3.geoIdentity().scale(x.range()[1]/100)))
           .attr("stroke", "var(--color-surface-1)").attr("fill", "none");

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
            "Stationarity (||∇L|| ≈ 0)": Math.sqrt(grad_L[0]**2 + grad_L[1]**2) < 0.1
        };

        kktStatus.innerHTML = "<h5>KKT Conditions Status:</h5><ul>" +
            Object.entries(conditions).map(([name, status]) => `
                <li>${name}: <strong style="color:${status ? 'var(--color-success)' : 'var(--color-danger)'};">
                ${status ? 'Satisfied' : 'Violated'}</strong></li>`).join('') + "</ul>";

        drawGradients(grad_f(x, y), grad_g(x, y), mu);
    }

    function drawGradients(gradf, gradg, mu) {
        const p = svg.select(".plot-content");
        p.selectAll(".gradient").remove();
        const {x: cx, y: cy} = candidate_x;

        const drawArrow = (vec, color, label) => {
            if (Math.sqrt(vec[0]**2 + vec[1]**2) < 1e-4) return;
            p.append("line").attr("class", "gradient")
                .attr("x1", x(cx)).attr("y1", y(cy))
                .attr("x2", x(cx + vec[0]*0.5)).attr("y2", y(cy + vec[1]*0.5))
                .attr("stroke", color).attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
            p.append("text").attr("class", "gradient").attr("x", x(cx + vec[0]*0.6)).attr("y", y(cy + vec[1]*0.6))
                .text(label).attr("fill", color);
        };

        drawArrow(gradf, "var(--color-primary)", "∇f");
        drawArrow(gradg.map(v => -mu*v), "var(--color-accent)", "-μ∇g");
    }

    function update() {
        mu = parseFloat(muSlider.value);
        muValSpan.textContent = mu.toFixed(1);
        svg.select(".candidate-point").attr("cx", x(candidate_x.x)).attr("cy", y(candidate_x.y));
        checkKKT();
    }

    function changeProblem(key) {
        selectedProblem = problems[key];
        document.getElementById('problem-title').textContent = selectedProblem.title;
        candidate_x = {x: selectedProblem.solution.x, y: selectedProblem.solution.y};
        muSlider.value = selectedProblem.solution.mu;
        mu = selectedProblem.solution.mu;

        setupChart();
        update();
    }

    Object.keys(problems).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = problems[key].title;
        problemSelect.appendChild(option);
    });

    problemSelect.addEventListener("change", (e) => changeProblem(e.target.value));
    muSlider.addEventListener("input", update);
    document.getElementById('reset-kkt-btn').addEventListener('click', () => changeProblem(problemSelect.value));

    new ResizeObserver(setupChart).observe(plotContainer);
    changeProblem("QP");
}
