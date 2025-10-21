/**
 * Widget: KKT Checker
 *
 * Description: Allows users to input a problem and a potential solution, and the widget checks which KKT conditions are satisfied.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initKKTChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="kkt-checker-widget">
            <div class="widget-controls">
                <p><strong>Problem:</strong> Minimize x² + y² s.t. x + y ≥ 2</p>
                <label>Lagrange multiplier μ:</label>
                <input id="mu-slider" type="range" min="0" max="4" step="0.1" value="2">
                <span id="mu-val">2.0</span>
            </div>
            <div id="plot-container"></div>
            <div class="widget-output" id="kkt-status"></div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const muSlider = container.querySelector("#mu-slider");
    const muValSpan = container.querySelector("#mu-val");
    const kktStatus = container.querySelector("#kkt-status");

    let candidate_x = { x: 1, y: 1 };

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-1, 3]).range([0, width]);
    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Feasible region (x+y >= 2)
    const feasibleRegion = d3.polygonHull([[3, -1], [3, 3], [-1, 3]]);
    svg.append("path").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))(feasibleRegion) + "Z").attr("fill", "var(--color-primary-light)");

    // Objective contours
    const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0, 2*Math.PI, 0.1).map(a => [r*Math.cos(a), r*Math.sin(a)]));
    svg.selectAll("path.contour").data(contours).enter().append("path").attr("class", "contour").attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1]))).attr("stroke", "var(--color-surface-1)");

    const drag = d3.drag().on("drag", (event) => {
        const [mx, my] = d3.pointer(event, svg.node());
        candidate_x = { x: x.invert(mx), y: y.invert(my) };
        update();
    });
    const candidatePoint = svg.append("circle").attr("r", 6).attr("fill", "var(--color-danger)").style("cursor", "move").call(drag);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("sympy");
    const pythonCode = `
import sympy
def check_kkt(x_val, y_val, mu_val):
    x, y, mu = sympy.symbols('x y mu')
    f = x**2 + y**2
    g = 2 - (x + y)  # Constraint in g(x) <= 0 form
    sol = {x: x_val, y: y_val, mu: mu_val}

    primal_feas = g.subs(sol) <= 1e-6
    dual_feas = sol[mu] >= 0
    comp_slack = abs(sol[mu] * g.subs(sol)) < 1e-6

    L = f + mu * g
    grad_L_x = sympy.diff(L, x).subs(sol)
    grad_L_y = sympy.diff(L, y).subs(sol)
    stationarity = abs(grad_L_x) < 1e-6 and abs(grad_L_y) < 1e-6

    return {
        "Primal Feasibility (x+y≥2)": primal_feas,
        "Dual Feasibility (μ≥0)": dual_feas,
        "Complementary Slackness": comp_slack,
        "Stationarity (∇L=0)": stationarity
    }
`;
    await pyodide.runPythonAsync(pythonCode);
    const check_kkt = pyodide.globals.get('check_kkt');

    async function update() {
        const mu = +muSlider.value;
        muValSpan.textContent = mu.toFixed(1);
        candidatePoint.attr("cx", x(candidate_x.x)).attr("cy", y(candidate_x.y));

        const results = await check_kkt(candidate_x.x, candidate_x.y, mu).then(r => r.toJs());

        kktStatus.innerHTML = "<h5>KKT Conditions Status:</h5><ul>" +
            Object.entries(results).map(([name, status]) => `
                <li>${name}:
                    <strong style="color:${status ? 'var(--color-success)' : 'var(--color-danger)'};">
                    ${status ? 'Satisfied' : 'Violated'}
                    </strong>
                </li>
            `).join('') + "</ul>";
    }

    muSlider.addEventListener("input", update);
    update();
}
