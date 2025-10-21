import { getPyodide } from "../../../../static/js/pyodide-manager.js";

async function initHessianHeatmap(containerId) {
    const pyodide = await getPyodide();
    const container = document.querySelector(containerId);
    const select = container.querySelector("#function-select");
    const svg = d3.select("#heatmap-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 500 500");

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([-2, 2]);

    async function drawHeatmap() {
        const funcStr = select.value;
        const gridSize = 50;
        const range = 2;

        const result = await pyodide.runPythonAsync(`
            import numpy as np
            import sympy

            x, y = sympy.symbols('x y')
            f = sympy.sympify("${funcStr}")

            hess = sympy.hessian(f, (x, y))
            min_eig_func = sympy.lambdify((x, y), min(hess.eigenvals()), 'numpy')

            grid = np.linspace(-${range}, ${range}, ${gridSize})
            min_eigs = np.zeros((${gridSize}, ${gridSize}))

            for i, xv in enumerate(grid):
                for j, yv in enumerate(grid):
                    min_eigs[j, i] = min_eig_func(xv, yv)

            min_eigs.flatten().tolist()
        `);

        const heatmapData = result.toJs();
        const cellSize = 500 / gridSize;

        svg.selectAll("*").remove();

        svg.selectAll("rect")
            .data(heatmapData)
            .enter().append("rect")
            .attr("x", (d, i) => (i % gridSize) * cellSize)
            .attr("y", (d, i) => Math.floor(i / gridSize) * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => colorScale(d));
    }

    select.addEventListener("change", drawHeatmap);
    drawHeatmap();
}

initHessianHeatmap(".widget-container");
