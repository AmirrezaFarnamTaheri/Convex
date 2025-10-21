import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function initHessianHeatmap(containerId) {
    const container = document.querySelector(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="hessian-heatmap-widget">
            <div class="widget-controls">
                <label for="heatmap-function-select">Function f(x,y):</label>
                <select id="heatmap-function-select">
                    <option value="x**2 + y**2">x² + y² (Convex)</option>
                    <option value="x**4 + y**4">x⁴ + y⁴ (Convex)</option>
                    <option value="x**3 + y**3">x³ + y³ (Non-Convex)</option>
                    <option value="-exp(-(x**2 + y**2))">Negative Gaussian (Non-Convex)</option>
                </select>
            </div>
            <div id="heatmap-plot-container"></div>
        </div>
    `;

    const select = container.querySelector("#heatmap-function-select");
    const plotContainer = container.querySelector("#heatmap-plot-container");

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const width = 450 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleSequential(d3.interpolatePiYG).domain([-5, 5]);

    const pyodide = await getPyodide();
    await pyodide.loadPackage("sympy");

    async function draw() {
        const funcStr = select.value;
        const gridSize = 50;
        const range = 2;

        svg.html('<text x="'+width/2+'" y="'+height/2+'" text-anchor="middle">Calculating...</text>');

        const result = await pyodide.runPythonAsync(`
            import numpy as np
            import sympy
            import json

            x, y = sympy.symbols('x y')
            f = sympy.sympify("${funcStr}")

            hess = sympy.hessian(f, (x, y))
            min_eig_func = sympy.lambdify((x, y), hess.eigenvals().keys().pop(), 'numpy')
            func_np = sympy.lambdify((x, y), f, 'numpy')

            grid = np.linspace(-${range}, ${range}, ${gridSize})
            xv, yv = np.meshgrid(grid, grid)

            min_eigs = min_eig_func(xv, yv)
            func_vals = func_np(xv, yv)

            json.dumps({
                "eigs": min_eigs.flatten().tolist(),
                "vals": func_vals.flatten().tolist()
            })
        `);

        const data = JSON.parse(result);
        const cellSize = width / gridSize;

        svg.html(""); // Clear loading text

        // Heatmap for min eigenvalue
        svg.append("g")
            .selectAll("rect")
            .data(data.eigs)
            .enter().append("rect")
            .attr("x", (d, i) => (i % gridSize) * cellSize)
            .attr("y", (d, i) => Math.floor(i / gridSize) * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => colorScale(d))
            .append("title")
            .text(d => `Min Eigenvalue: ${d.toFixed(2)}`);

        // Contour for function value
        const contours = d3.contours()
            .size([gridSize, gridSize])
            .thresholds(10)
            (data.vals);

        svg.append("g")
            .selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(cellSize)))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-opacity", 0.5);
    }

    select.addEventListener("change", draw);
    draw();
}
