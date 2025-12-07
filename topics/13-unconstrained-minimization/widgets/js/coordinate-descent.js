/**
 * Widget: Coordinate Descent Visualizer
 *
 * Description: Animates the steps of coordinate descent, showing how it optimizes along one axis at a time.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initCoordinateDescent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="cd-visualizer-widget">
            <div class="widget-controls">
                <div class="control-group">
                    <label>Coupling (c): <span id="cd-c-val">0.4</span></label>
                    <input type="range" id="cd-c-slider" min="-1.9" max="1.9" step="0.1" value="0.4">
                </div>
                <button id="cd-reset-btn">Reset Start</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Drag the start point. The algorithm alternates between optimizing x₁ and x₂.</p>
            <div id="cd-output" class="widget-output"></div>
        </div>
    `;

    const cSlider = container.querySelector("#cd-c-slider");
    const cVal = container.querySelector("#cd-c-val");
    const resetBtn = container.querySelector("#cd-reset-btn");
    const plotContainer = container.querySelector("#plot-container");
    const outputDiv = container.querySelector("#cd-output");

    let startPoint = [-3.5, -3.0];
    const defaultStartPoint = [-3.5, -3.0];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = (plotContainer.clientWidth || 600) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const y = d3.scaleLinear().domain([-4, 4]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const contourGroup = svg.append("g");
    const pathGroup = svg.append("g");

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_cd_data(c, start_point_list):
    c = float(c)
    path = [np.array(start_point_list)]

    for i in range(25): # Max 50 steps (25 pairs)
        p = path[-1].copy()
        # Update x1: min (x1-1)^2 + c*x1*p[1] => 2(x1-1) + c*p[1] = 0 => x1 = 1 - c/2 * p[1]
        p[0] = 1 - (c/2) * p[1]
        path.append(p.copy())

        # Update x2: min (x2-1)^2 + c*p[0]*x2 => 2(x2-1) + c*p[0] = 0 => x2 = 1 - c/2 * p[0]
        p[1] = 1 - (c/2) * p[0]
        path.append(p.copy())

        # Convergence check
        if np.linalg.norm(path[-1] - path[-3]) < 1e-4:
            break

    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = (xx - 1)**2 + (yy - 1)**2 + c * xx * yy

    return json.dumps({
        "path": np.array(path).tolist(),
        "contours": zz.tolist(),
        "iterations": len(path) - 1
    })
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_cd_data = pyodide.globals.get('get_cd_data');

    const drag = d3.drag().on("drag", function(event) {
        startPoint = [x.invert(event.x), y.invert(event.y)];
        update();
    });

    async function update() {
        const c = +cSlider.value;
        cVal.textContent = c.toFixed(2);

        const data = await get_cd_data(c, startPoint).then(r => JSON.parse(r));

        contourGroup.selectAll("*").remove();
        pathGroup.selectAll("*").remove();

        const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([d3.max(data.contours.flat()), 0]);
        contourGroup.selectAll("path")
            .data(d3.contours().thresholds(d3.range(0, 100, 2))(data.contours.flat()))
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 49).translate([0.5, 0.5])))
            .attr("fill", d => colorScale(d.value))
            .attr("stroke", "#000")
            .attr("stroke-width", 0.2);

        const path = pathGroup.append("path").datum(data.path)
            .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        pathGroup.append("circle").attr("cx", x(startPoint[0])).attr("cy", y(startPoint[1])).attr("r", 7)
            .attr("fill", "var(--color-accent-light)").attr("stroke", "var(--color-accent)").attr("stroke-width", 2)
            .style("cursor", "move").call(drag);

        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
            .transition().duration(1500).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

        outputDiv.innerHTML = `Iterations to converge: <strong>${data.iterations}</strong>`;
    }

    cSlider.addEventListener("input", update);
    resetBtn.addEventListener("click", () => {
        startPoint = [...defaultStartPoint];
        update();
    });
    update();
}
