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
                <div class="control-group">
                    <label>Initial ρ: <span id="rho-val">1.0</span></label>
                    <input type="range" id="rho-slider" min="0.5" max="10" step="0.5" value="1.0">
                </div>
                <button id="al-reset-btn">Reset</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point. Inner loops (green) minimize Lρ; outer steps update λ.</p>
            <div id="al-output" class="widget-output"></div>
        </div>
    `;

    const rhoSlider = container.querySelector("#rho-slider");
    const rhoVal = container.querySelector("#rho-val");
    const resetBtn = container.querySelector("#al-reset-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#al-output");

    let startPoint = [-1.5, -1.0];
    const defaultStartPoint = [-1.5, -1.0];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
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

    const pathGroup = svg.append("g");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def run_al(rho_init, start_point_list):
    outer_paths = []
    x_current = np.array(start_point_list)
    lam = 0.0
    rho = float(rho_init)

    for k in range(8): # Max outer loops
        inner_path = [x_current.copy()]
        for _ in range(20): # Inner loops (GD on L_rho)
            grad = np.array([2*x_current[0] + lam + rho*(x_current[0]+x_current[1]-1),
                             2*x_current[1] + lam + rho*(x_current[0]+x_current[1]-1)])
            x_next = x_current - 0.1 * grad
            inner_path.append(x_next.copy())
            if np.linalg.norm(x_next - x_current) < 1e-3:
                break
            x_current = x_next

        outer_paths.append(np.array(inner_path).tolist())

        residual = x_current[0] + x_current[1] - 1
        if np.abs(residual) < 1e-4:
            break

        lam += rho * residual
        rho *= 1.5

    return json.dumps({"paths": outer_paths, "final_x": x_current.tolist(), "final_lambda": lam, "outer_iter": k + 1})
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_al = pyodide.globals.get('run_al');

    async function update() {
        const rho_init = +rhoSlider.value;
        rhoVal.textContent = rho_init.toFixed(1);

        pathGroup.selectAll("*").remove();

        const result = await run_al(rho_init, startPoint).then(r => JSON.parse(r));

        const outer_color = d3.scaleSequential(d3.interpolateBlues).domain([0, result.paths.length]);

        result.paths.forEach((inner_path, i) => {
            const path = pathGroup.append("path").datum(inner_path)
                .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
                .attr("fill", "none")
                .attr("stroke", i === 0 ? "var(--color-accent)" : outer_color(i))
                .attr("stroke-width", 2);

            const totalLength = path.node().getTotalLength();
            if (totalLength > 0) {
                path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                    .attr("stroke-dashoffset", totalLength)
                    .transition().delay(i*500).duration(500).ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            }
        });

        pathGroup.append("circle").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1])).attr("r", 7)
            .attr("fill", "var(--color-danger)").style("cursor", "move")
            .call(d3.drag().on("drag", function(event) {
                startPoint = [x.invert(event.x), y.invert(event.y)];
                update();
            }));

        outputDiv.innerHTML = `Converged in <strong>${result.outer_iter}</strong> outer iterations.<br>
                               x ≈ (${result.final_x[0].toFixed(3)}, ${result.final_x[1].toFixed(3)}),
                               λ ≈ ${result.final_lambda.toFixed(3)}`;
    }

    // Draw static elements once
    const contours = d3.range(0.25, 4, 0.25).map(r => d3.range(0, 2 * Math.PI + 0.1, 0.1).map(a => [r * Math.cos(a), r * Math.sin(a)]));
    svg.append("g").selectAll("path").data(contours).join("path")
        .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
        .attr("stroke", "var(--color-surface-1)").attr("stroke-width", 0.5);
    svg.append("line").attr("x1", x(-2)).attr("y1", y(3)).attr("x2", x(3)).attr("y2", y(-2))
        .attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

    rhoSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        rhoSlider.value = 1.0;
        update();
    });
    update();
}
