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
                <button id="run-cd-btn">Run Coordinate Descent</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">The algorithm alternates between optimizing with respect to x₁ and x₂.</p>
        </div>
    `;

    const runBtn = container.querySelector("#run-cd-btn");
    const plotContainer = container.querySelector("#plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
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

    const pyodide = await getPyodide();
    const pythonCode = `
import numpy as np
import json

def get_cd_data():
    path = [np.array([-3.5, -3.0])]
    for i in range(10):
        p = path[-1].copy()
        if i % 2 == 0: # Update x1
            p[0] = 1 - 0.2 * p[1]
        else: # Update x2
            p[1] = 1 - 0.2 * p[0]
        path.append(p)

    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = (xx-1)**2 + (yy-1)**2 + 0.4 * (xx*yy)

    return json.dumps({"path": np.array(path).tolist(), "contours": zz.flatten().tolist()})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_cd_data = pyodide.globals.get('get_cd_data');

    async function run() {
        runBtn.disabled = true;
        svg.selectAll(".contour, .cd-path").remove();

        const data = await get_cd_data().then(r => JSON.parse(r));

        svg.append("g").attr("class", "contour")
            .selectAll("path").data(d3.contours().size([50,50]).thresholds(20)(data.contours)).join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width/49)))
            .attr("fill", "none").attr("stroke", "var(--color-surface-1)");

        const path = svg.append("path").attr("class", "cd-path").datum(data.path)
            .attr("d", d3.line().x(d=>x(d[0])).y(d=>y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);

        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
            .transition().duration(2000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

        setTimeout(() => runBtn.disabled = false, 2000);
    }

    runBtn.addEventListener("click", run);
    run();
}
