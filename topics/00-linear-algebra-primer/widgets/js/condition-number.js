import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function initConditionNumberRace(containerId) {
    const pyodide = await getPyodide();

    const pythonCode = `
import numpy as np
def run_gd(kappa):
    alpha = 1.8 / (1 + kappa)
    start_pos = np.array([3.5, 3.5])
    path = [start_pos]
    for _ in range(30):
        current_pos = path[-1]
        grad = np.array([current_pos[0], kappa * current_pos[1]])
        if np.linalg.norm(grad) < 1e-4: break
        path.append(current_pos - alpha * grad)
    return [p.tolist() for p in path]

def get_contours(kappa):
    f_lambda = lambda xv, yv: 0.5 * (xv**2 + kappa * yv**2)
    xx, yy = np.meshgrid(np.linspace(-4, 4, 100), np.linspace(-4, 4, 100))
    zz = f_lambda(xx, yy)
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}
`;
    await pyodide.runPythonAsync(pythonCode);

    function createPlot(containerId, kappa, title) {
        const margin = {top: 30, right: 20, bottom: 30, left: 40};
        const width = 400 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text(title).attr("fill", "var(--color-text-main)");

        const xScale = d3.scaleLinear().domain([-4, 4]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
        svg.append("g").call(d3.axisLeft(yScale));

        pyodide.runPythonAsync(`get_contours(${kappa})`).then(contourPy => {
            const contourData = contourPy.toJs();
            const contours = d3.contours()
                .size([100, 100])
                .thresholds(d3.range(0, 50, 2))
                (contourData.z);
            svg.append("g")
                .selectAll("path")
                .data(contours)
                .enter().append("path")
                .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 100)))
                .attr("fill", "none")
                .attr("stroke", "var(--color-surface-1)");
        });

        pyodide.runPythonAsync(`run_gd(${kappa})`).then(pathPy => {
            const path = pathPy.toJs();
            const pathLine = svg.append("path")
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
        });
    }

    createPlot("#low-cond-plot", 5, "Low Condition Number (κ=5)");
    createPlot("#high-cond-plot", 50, "High Condition Number (κ=50)");
}

initConditionNumberRace(".widget-container");
