import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initStepSize(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);

    const functionSelect = container.querySelector("#function-select");
    const stepSizeSlider = container.querySelector("#step-size-slider");
    const startXSlider = container.querySelector("#start-x-slider");
    const startYSlider = container.querySelector("#start-y-slider");
    const restartBtn = container.querySelector("#restart-btn");

    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#step-size-plot-container").append("svg")
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

def get_gradient_func(f_str):
    f = sympy.sympify(f_str)
    grad = [sympy.diff(f, var) for var in (x, y)]
    return sympy.lambdify((x, y), grad, 'numpy')

def run_gd(f_str, start_x, start_y, alpha, iters=50):
    grad_func = get_gradient_func(f_str)
    path = [np.array([start_x, start_y])]
    for _ in range(iters):
        current_pos = path[-1]
        step = alpha * np.array(grad_func(current_pos[0], current_pos[1]))
        if np.linalg.norm(step) < 1e-4:
            break
        path.append(current_pos - step)
        if np.linalg.norm(path[-1]) > 1e4: # Divergence check
            break
    return [p.tolist() for p in path]

def get_contour_data(f_str):
    f = sympy.sympify(f_str)
    f_lambda = sympy.lambdify((x, y), f, 'numpy')
    xx, yy = np.meshgrid(np.linspace(-4, 4, 100), np.linspace(-4, 4, 100))
    zz = f_lambda(xx, yy)
    return {"x": xx[0].tolist(), "y": yy[:,0].tolist(), "z": zz.flatten().tolist()}
`;
    await pyodide.runPythonAsync(pythonSetupCode);

    let animationPath;

    async function runAnimation() {
        svg.selectAll(".contour, .path-line, .path-point").remove();

        const funcStr = functionSelect.value;
        const alpha = +stepSizeSlider.value;
        const startX = +startXSlider.value;
        const startY = +startYSlider.value;

        // Draw contours
        const contourDataPy = await pyodide.runPythonAsync(`get_contour_data('${funcStr}')`);
        const { x: contourX, y: contourY, z: contourZ } = contourDataPy.toJs();

        const contours = d3.contours()
            .size([contourX.length, contourY.length])
            .thresholds(d3.range(0, 100, 2))
            (contourZ);

        svg.append("g")
            .attr("class", "contour")
            .selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(width / contourX.length)))
            .attr("fill", "none")
            .attr("stroke", "var(--color-surface-1)");

        // Get GD Path
        const pathPy = await pyodide.runPythonAsync(`run_gd('${funcStr}', ${startX}, ${startY}, ${alpha})`);
        const path = pathPy.toJs();

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
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        svg.selectAll(".path-point")
            .data(path)
            .enter().append("circle")
            .attr("class", "path-point")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 0)
            .transition()
            .delay((d, i) => i * (2000 / path.length))
            .attr("r", 4)
            .attr("fill", "var(--color-primary)");
    }

    [stepSizeSlider, startXSlider, startYSlider, functionSelect].forEach(el => {
        el.addEventListener("input", runAnimation);
    });
    restartBtn.addEventListener("click", runAnimation);

    runAnimation();
}

initStepSize(".widget-container");
