import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initConditionNumberRace(containerId) {
    const container = document.querySelector(containerId);
    if (!container) return;

    const kappaSlider = container.querySelector("#kappa-slider");
    const kappaValueSpan = container.querySelector("#kappa-value");
    const plotContainer = container.querySelector("#plot-container");

    const pyodide = await getPyodide();

    const pythonCode = `
import numpy as np
def run_gd(kappa):
    A = np.array([[1, 0], [0, kappa]])
    # Optimal step size for quadratic: 2 / (lambda_min + lambda_max)
    # Using a slightly smaller one for stability
    alpha = 1.8 / (1 + kappa)

    x = np.array([3.5, 3.5])
    path = [x]
    for _ in range(50):
        grad = A @ x
        if np.linalg.norm(grad) < 1e-4: break
        x = x - alpha * grad
        path.append(x)
    return [p.tolist() for p in path]

def get_contours(kappa):
    f = lambda x, y: 0.5 * (x**2 + kappa * y**2)
    xx, yy = np.meshgrid(np.linspace(-4, 4, 50), np.linspace(-4, 4, 50))
    zz = f(xx, yy)
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}
`;
    await pyodide.runPythonAsync(pythonCode);
    const run_gd = pyodide.globals.get('run_gd');
    const get_contours = pyodide.globals.get('get_contours');

    const margin = {top: 40, right: 20, bottom: 40, left: 40};
    const width = 450 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([-4, 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-4, 4]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const title = svg.append("text")
        .attr("x", width/2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");

    const contourGroup = svg.append("g");
    const pathLine = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "var(--color-accent)")
        .attr("stroke-width", 2.5);

    async function updatePlot(kappa) {
        kappaValueSpan.textContent = kappa;
        title.text(`Gradient Descent Path (κ = ${kappa})`);

        const contourPy = await get_contours(kappa);
        const contourData = contourPy.toJs();
        contourPy.destroy();

        const contours = d3.contours()
            .size([50, 50])
            .thresholds(d3.range(0, 50, 2.5))
            (contourData.z);

        contourGroup.selectAll("path")
            .data(contours)
            .join("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 50)))
            .attr("fill", "none")
            .attr("stroke", "var(--color-surface-1)");

        const pathPy = await run_gd(kappa);
        const path = pathPy.toJs();
        pathPy.destroy();

        pathLine.datum(path)
            .attr("d", d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

        // Animate path drawing
        const totalLength = pathLine.node().getTotalLength();
        pathLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(1500).ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    kappaSlider.addEventListener("input", () => updatePlot(+kappaSlider.value));
    updatePlot(+kappaSlider.value);
}
