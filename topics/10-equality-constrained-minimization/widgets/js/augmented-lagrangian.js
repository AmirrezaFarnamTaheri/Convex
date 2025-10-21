import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initAugmentedLagrangian(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const runBtn = container.querySelector("#run-al-btn");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#al-plot-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([-2, 2]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-2, 2]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    const pythonCode = `
import numpy as np

def run_augmented_lagrangian():
    # min x1**2 + x2**2 s.t. x1 + x2 = 1
    # L_rho(x, lambda) = x1**2 + x2**2 + lambda*(x1+x2-1) + (rho/2)*(x1+x2-1)**2
    # grad_x L_rho = [2*x1 + lambda + rho*(x1+x2-1), 2*x2 + lambda + rho*(x1+x2-1)]
    # Setting grad to 0 gives:
    # x1 = (-lambda + rho) / (2 + rho)
    # x2 = (-lambda + rho) / (2 + rho)
    # (substituting into constraint is not the method of multipliers, we do unconstrained min first)

    rho = 1.0
    lam = 0.0
    x = np.array([-1.0, -1.0]) # starting point for inner loop
    path = [x.copy()]

    for k in range(10): # Outer loop (lambda update)
        # Inner loop: Minimize L_rho w.r.t x (e.g., via gradient descent)
        for _ in range(20):
            grad = np.array([2*x[0] + lam + rho*(x[0]+x[1]-1), 2*x[1] + lam + rho*(x[0]+x[1]-1)])
            x = x - 0.1 * grad
            path.append(x.copy())

        # Update lambda
        lam = lam + rho * (x[0] + x[1] - 1)
        rho = rho * 1.5 # increase rho

    return [p.tolist() for p in path]

def get_contours():
    xx, yy = np.meshgrid(np.linspace(-2, 2, 100), np.linspace(-2, 2, 100))
    zz = xx**2 + yy**2
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}

path_data = run_augmented_lagrangian()
contour_data = get_contours()
`;
    await pyodide.runPythonAsync(pythonCode);

    async function runAnimation() {
        svg.selectAll(".contour, .constraint-line, .path-line, .path-point").remove();

        const pathPy = await pyodide.runPythonAsync('path_data');
        const contourPy = await pyodide.runPythonAsync('contour_data');
        const path = pathPy.toJs();
        const contourData = contourPy.toJs();

        // Draw objective contours
        svg.append("g")
            .attr("class", "contour")
            .selectAll("path")
            .data(d3.contours().size([100, 100]).thresholds(d3.range(0, 8, 0.5))(contourData.z))
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 100)))
            .attr("fill", "none")
            .attr("stroke", "var(--color-surface-1)");

        // Draw constraint line x1 + x2 = 1
        svg.append("line")
            .attr("class", "constraint-line")
            .attr("x1", xScale(-2))
            .attr("y1", yScale(3))
            .attr("x2", xScale(3))
            .attr("y2", yScale(-2))
            .attr("stroke", "var(--color-primary)")
            .attr("stroke-width", 2);

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

    runBtn.addEventListener("click", runAnimation);
    runAnimation();
}

initAugmentedLagrangian(".widget-container");
