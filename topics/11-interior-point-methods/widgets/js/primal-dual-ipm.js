import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initPrimalDualIpm(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const runBtn = container.querySelector("#run-pd-ipm-btn");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#pd-ipm-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 4]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const pythonCode = `
import numpy as np

def get_pd_ipm_path():
    # LP: max x + y s.t. x <= 2, y <= 3, x+y <= 4, x>=0, y>=0
    # True optimum is at (1, 3) where cost is 4, but let's change obj to max x+2y
    # so optimum is at (1,3)

    # This is a conceptual visualization, not a real IPM solver.
    # It shows a path moving through the interior towards the optimum.
    path = [
        np.array([0.5, 0.5]),
        np.array([0.8, 1.5]),
        np.array([1.0, 2.2]),
        np.array([1.0, 2.8]),
        np.array([1.0, 3.0])
    ]
    return [p.tolist() for p in path]

path_data = get_pd_ipm_path()
`;
    await pyodide.runPythonAsync(pythonCode);

    // Draw feasible region
    const feasibleRegion = [
        {x: 0, y: 0}, {x: 2, y: 0}, {x: 2, y: 2}, {x: 1, y: 3}, {x: 0, y: 3}
    ];
    svg.append("polygon")
        .datum(feasibleRegion)
        .attr("points", d => d.map(p => [xScale(p.x), yScale(p.y)].join(",")).join(" "))
        .attr("fill", "var(--color-primary)")
        .attr("opacity", 0.3);

    async function runAnimation() {
        svg.selectAll(".path-line, .path-point").remove();
        const pathPy = await pyodide.runPythonAsync('path_data');
        const path = pathPy.toJs();

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
            .transition().duration(2000).ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    runBtn.addEventListener("click", runAnimation);
    runAnimation();
}

initPrimalDualIpm(".widget-container");
