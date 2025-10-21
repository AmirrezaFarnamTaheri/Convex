import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initCoordinateDescent(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const restartBtn = container.querySelector("#restart-cd-btn");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#coordinate-descent-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const pythonSetupCode = `
import numpy as np

def get_cd_path():
    # f(x,y) = (x-1)**2 + (y-2)**2 + 0.1 * (x*y)
    # df/dx = 2*(x-1) + 0.1*y => x = 1 - 0.05*y
    # df/dy = 2*(y-2) + 0.1*x => y = 2 - 0.05*x

    path = [np.array([-3.0, -3.0])]
    for i in range(15):
        current_pos = path[-1].copy()
        if i % 2 == 0: # Update x
            current_pos[0] = 1 - 0.05 * current_pos[1]
        else: # Update y
            current_pos[1] = 2 - 0.05 * current_pos[0]
        path.append(current_pos)
    return [p.tolist() for p in path]

def get_contours():
    xx, yy = np.meshgrid(np.linspace(-4, 4, 100), np.linspace(-4, 4, 100))
    zz = (xx-1)**2 + (yy-2)**2 + 0.1 * (xx*yy)
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}

path_data = get_cd_path()
contour_data = get_contours()
`;
    await pyodide.runPythonAsync(pythonSetupCode);

    async function runAnimation() {
        svg.selectAll(".contour, .path-line, .path-point").remove();

        const pathPy = await pyodide.runPythonAsync('path_data');
        const contourPy = await pyodide.runPythonAsync('contour_data');
        const path = pathPy.toJs();
        const contourData = contourPy.toJs();

        // Draw contours
        const contours = d3.contours()
            .size([contourData.x.length, contourData.y.length])
            .thresholds(d3.range(0, 50, 2))
            (contourData.z);

        svg.append("g")
            .attr("class", "contour")
            .selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / contourData.x.length)))
            .attr("fill", "none")
            .attr("stroke", "var(--color-surface-1)");

        // Animate path
        const pathLine = svg.append("path")
            .attr("class", "path-line")
            .datum(path)
            .attr("fill", "none")
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

        const totalLength = pathLine.node().getTotalLength();

        pathLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    restartBtn.addEventListener("click", runAnimation);
    runAnimation();
}

initCoordinateDescent(".widget-container");
