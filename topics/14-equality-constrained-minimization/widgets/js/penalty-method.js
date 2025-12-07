/**
 * Widget: Penalty Method Path
 *
 * Description: Shows the path of solutions as the penalty parameter increases in the penalty method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initPenaltyMethod(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="penalty-method-widget">
            <div class="widget-controls">
                <label>Penalty ρ: <span id="rho-val-pm">1.0</span></label>
                <input type="range" id="rho-slider-pm" min="-1" max="3" step="0.1" value="0">
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Adjust ρ to see how the minimum of the penalized function approaches the true optimum.</p>
        </div>
    `;

    const rhoSlider = container.querySelector("#rho-slider-pm");
    const rhoVal = container.querySelector("#rho-val-pm");
    const plotContainer = container.querySelector("#plot-container");

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

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_penalty_contours(rho):
    xx, yy = np.meshgrid(np.linspace(-1, 3, 50), np.linspace(-1, 3, 50))
    # f(x,y) = (x-2)^2 + (y-2)^2 + rho*(x+y-1)^2
    zz = (xx - 2)**2 + (yy - 2)**2 + rho * ((xx + yy - 1)**2)
    return json.dumps(zz.flatten().tolist())

def get_penalty_path():
    path = []
    for rho_exp in np.linspace(-1, 3, 40):
        rho = 10**rho_exp
        # minimizer of penalized function is x=y=(2+rho)/(1+2*rho)
        x = (2 + rho) / (1 + 2 * rho)
        path.append([x, x])
    return json.dumps(path)
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_penalty_contours = pyodide.globals.get('get_penalty_contours');
    const get_penalty_path = pyodide.globals.get('get_penalty_path');

    const path_data = await get_penalty_path().then(r => JSON.parse(r));

    // Draw central path
    svg.append("path").datum(path_data)
        .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
        .attr("fill", "none").attr("stroke", "var(--color-danger)").attr("stroke-width", 2).attr("stroke-dasharray", "4 4");

    // Draw constraint line x+y=1
    svg.append("line").attr("x1", x(-1)).attr("y1", y(2)).attr("x2", x(2)).attr("y2", y(-1))
        .attr("stroke", "var(--color-primary)").attr("stroke-width", 2);

    // Draw true optimum (0.5, 0.5)
    svg.append("circle").attr("cx", x(0.5)).attr("cy", y(0.5)).attr("r", 5).attr("fill", "var(--color-success)");

    async function update() {
        const rho = 10**(+rhoSlider.value);
        rhoVal.textContent = rho.toExponential(1);

        const contours_json = await get_penalty_contours(rho);
        const contours_data = JSON.parse(contours_json);

        svg.selectAll(".contour").remove();
        svg.append("g").attr("class", "contour")
            .selectAll("path").data(d3.contours().size([50,50]).thresholds(20)(contours_data)).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)").attr("opacity", 0.7);

        // Show current point on path
        const current_x = (2 + rho) / (1 + 2 * rho);
        svg.selectAll(".current-pt").remove();
        svg.append("circle").attr("class", "current-pt")
            .attr("cx", x(current_x)).attr("cy", y(current_x))
            .attr("r", 5).attr("fill", "var(--color-accent)");
    }

    rhoSlider.addEventListener("input", update);
    update();
}
