import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initPenaltyMethod(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#penalty-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([-1, 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-1, 4]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const pythonCode = `
import numpy as np

def get_penalty_path():
    # min (x-2)**2 + (y-2)**2 s.t. x+y=1
    # Penalty form: (x-2)**2 + (y-2)**2 + rho * (x+y-1)**2
    # grad_x = 2(x-2) + 2*rho*(x+y-1) = 0
    # grad_y = 2(y-2) + 2*rho*(x+y-1) = 0
    #
    # (1+rho)x + rho*y = 2+rho
    # rho*x + (1+rho)y = 2+rho
    #
    # Solving this system gives x=y
    # (1+2*rho)x = 2+rho => x = (2+rho)/(1+2*rho)

    path = []
    rhos = np.logspace(-1, 3, 20)
    for rho in rhos:
        x = (2 + rho) / (1 + 2 * rho)
        y = (2 + rho) / (1 + 2 * rho)
        path.append([x, y])
    return path

def get_contours():
    xx, yy = np.meshgrid(np.linspace(-1, 4, 100), np.linspace(-1, 4, 100))
    zz = (xx - 2)**2 + (yy - 2)**2
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}

path_data = get_penalty_path()
contour_data = get_contours()
`;
    await pyodide.runPythonAsync(pythonCode);
    const pathPy = await pyodide.runPythonAsync('path_data');
    const contourPy = await pyodide.runPythonAsync('contour_data');
    const path = pathPy.toJs();
    const contourData = contourPy.toJs();

    // Draw objective contours
    svg.append("g")
        .selectAll("path")
        .data(d3.contours().size([100, 100]).thresholds(d3.range(0, 20, 1))(contourData.z))
        .enter().append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 100)))
        .attr("fill", "none")
        .attr("stroke", "var(--color-surface-1)");

    // Draw constraint line x + y = 1
    svg.append("line")
        .attr("x1", xScale(-1))
        .attr("y1", yScale(2))
        .attr("x2", xScale(2))
        .attr("y2", yScale(-1))
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 2);

    // Draw penalty path
    svg.append("path")
        .datum(path)
        .attr("fill", "none")
        .attr("stroke", "var(--color-accent)")
        .attr("stroke-width", 2)
        .attr("d", d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

    svg.selectAll("circle.path-point")
        .data(path)
        .enter().append("circle")
        .attr("class", "path-point")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 4)
        .attr("fill", "var(--color-accent)");
}

initPenaltyMethod(".widget-container");
