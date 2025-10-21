/**
 * Widget: Augmented Lagrangian Method
 *
 * Description: Visualizes the convergence of the augmented Lagrangian method (Method of Multipliers).
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initAugmentedLagrangian(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="al-widget">
            <div class="widget-controls">
                <label>Initial ρ: <span id="rho-val">1.0</span></label>
                <input type="range" id="rho-slider" min="0.5" max="5" step="0.5" value="1.0">
                <button id="run-al-btn">Run</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Visualizes minimizing x₁²+x₂² s.t. x₁+x₂=1. The path shows the unconstrained minimization steps for Lρ before each λ update.</p>
        </div>
    `;

    const rhoSlider = container.querySelector("#rho-slider");
    const rhoVal = container.querySelector("#rho-val");
    const runBtn = container.querySelector("#run-al-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-2, 2]).range([0, width]);
    const y = d3.scaleLinear().domain([-2, 2]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def run_al(rho_init):
    path = [np.array([-1.5, -1.0])]
    lam = 0.0
    rho = rho_init

    for k in range(5): # Outer loops
        x = path[-1].copy()
        for _ in range(20): # Inner loops (GD on L_rho)
            grad = np.array([2*x[0] + lam + rho*(x[0]+x[1]-1),
                             2*x[1] + lam + rho*(x[0]+x[1]-1)])
            x = x - 0.1 * grad
            path.append(x.copy())
        lam += rho * (x[0] + x[1] - 1)
        rho *= 1.5

    return json.dumps(np.array(path).tolist())
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_al = pyodide.globals.get('run_al');

    async function run() {
        runBtn.disabled = true;
        const rho_init = +rhoSlider.value;
        rhoVal.textContent = rho_init.toFixed(1);

        svg.selectAll(".al-path, .contour, .constraint").remove();

        // Contours of original objective
        const contours = d3.range(0.5, 4, 0.5).map(r => d3.range(0,2*Math.PI+0.1,0.1).map(a => [r*Math.cos(a), r*Math.sin(a)]));
        svg.append("g").attr("class", "contour")
            .selectAll("path").data(contours).join("path")
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("stroke", "var(--color-surface-1)");

        // Constraint line
        svg.append("line").attr("class", "constraint")
            .attr("x1", x(-2)).attr("y1", y(3)).attr("x2", x(3)).attr("y2", y(-2))
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

        const path_data = await run_al(rho_init).then(r => JSON.parse(r));

        const path = svg.append("path").attr("class", "al-path").datum(path_data)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
            .transition().duration(2500).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

        setTimeout(() => runBtn.disabled = false, 2500);
    }

    rhoSlider.addEventListener("input", () => rhoVal.textContent = (+rhoSlider.value).toFixed(1));
    runBtn.addEventListener("click", run);
    run();
}
