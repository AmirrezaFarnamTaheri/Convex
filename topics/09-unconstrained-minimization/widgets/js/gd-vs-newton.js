/**
 * Widget: Gradient Descent vs. Newton's Method
 *
 * Description: A side-by-side animation comparing the convergence of Gradient Descent and Newton's method.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";


export async function initGDvsNewton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div id="plot"></div>
        <button id="run_comparison">Run Comparison</button>
    `;

    let pyodide = await getPyodide();
    await pyodide.loadPackage("numpy");

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-2, 2]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([-1, 3]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Rosenbrock function
    const rosenbrock = (x, y) => (1 - x)**2 + 100 * (y - x*x)**2;

    // Contour plot
    const contours = d3.contourDensity()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .size([width, height])
        .bandwidth(15)
        (getContourData());

    svg.selectAll("path.contour")
        .data(contours)
        .enter()
        .append("path")
        .attr("class", "contour")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "#ccc");

    function getContourData() {
        const data = [];
        for (let i = 0; i < 10000; i++) {
            const px = Math.random() * 4 - 2;
            const py = Math.random() * 4 - 1;
            data.push({x: px, y: py, value: rosenbrock(px, py)});
        }
        return data;
    }

    async function run_comparison() {
        svg.selectAll(".path").remove();

        const result = await pyodide.runPythonAsync(`
            import numpy as np

            def grad_rosenbrock(x):
                return np.array([-2*(1-x[0]) - 400*x[0]*(x[1]-x[0]**2), 200*(x[1]-x[0]**2)])

            def hess_rosenbrock(x):
                return np.array([[2 - 400*x[1] + 1200*x[0]**2, -400*x[0]], [-400*x[0], 200]])

            x_gd = np.array([-1.5, 2.5])
            path_gd = [x_gd.tolist()]
            for _ in range(100):
                x_gd = x_gd - 0.001 * grad_rosenbrock(x_gd)
                path_gd.append(x_gd.tolist())

            x_newton = np.array([-1.5, 2.5])
            path_newton = [x_newton.tolist()]
            for _ in range(5):
                x_newton = x_newton - np.linalg.inv(hess_rosenbrock(x_newton)) @ grad_rosenbrock(x_newton)
                path_newton.append(x_newton.tolist())

            {"gd": path_gd, "newton": path_newton}
        `);

        const path_gd = result.get("gd").toJs();
        const path_newton = result.get("newton").toJs();

        draw_path(path_gd, "blue", "Gradient Descent");
        draw_path(path_newton, "red", "Newton's Method");
    }

    const line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]));

    function draw_path(path_data, color, name) {
        svg.append("path")
            .datum(path_data)
            .attr("class", "path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);
    }


    d3.select("#run_comparison").on("click", run_comparison);
}
