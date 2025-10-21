import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initConditionNumberImpact(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const slider = container.querySelector("#condition-number-slider");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#condition-number-plot-container").append("svg")
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
import sympy

x, y = sympy.symbols('x y')

def get_gd_path_and_contours(kappa):
    # f(x,y) = 0.5 * (x^2 + kappa * y^2)
    # Gradient is [x, kappa*y]
    # Optimal step size for this function is 2 / (1 + kappa)

    alpha = 1.8 / (1 + kappa) # slightly less than optimal to show steps
    start_pos = np.array([3.5, 3.5])
    path = [start_pos]

    for _ in range(50):
        current_pos = path[-1]
        grad = np.array([current_pos[0], kappa * current_pos[1]])
        if np.linalg.norm(grad) < 1e-4: break
        path.append(current_pos - alpha * grad)

    # Contours
    f_lambda = lambda xv, yv: 0.5 * (xv**2 + kappa * yv**2)
    xx, yy = np.meshgrid(np.linspace(-4, 4, 100), np.linspace(-4, 4, 100))
    zz = f_lambda(xx, yy)

    return {
        "path": [p.tolist() for p in path],
        "contours": {
            "x": xx[0].tolist(),
            "y": yy[:,0].tolist(),
            "z": zz.flatten().tolist()
        }
    }
`;
    await pyodide.runPythonAsync(pythonSetupCode);

    async function draw(kappa) {
        svg.selectAll(".contour, .path-line, .path-point").remove();

        const dataPy = await pyodide.runPythonAsync(`get_gd_path_and_contours(${kappa})`);
        const { path, contours: contourData } = dataPy.toJs();

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

        // Draw GD Path
        svg.append("path")
            .attr("class", "path-line")
            .datum(path)
            .attr("fill", "none")
            .attr("stroke", "var(--color-accent)")
            .attr("stroke-width", 2)
            .attr("d", d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

        svg.selectAll(".path-point")
            .data(path)
            .enter().append("circle")
            .attr("class", "path-point")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 4)
            .attr("fill", "var(--color-primary)");
    }

    slider.addEventListener("input", () => {
        draw(+slider.value);
    });

    draw(+slider.value);
}

initConditionNumberImpact(".widget-container");
