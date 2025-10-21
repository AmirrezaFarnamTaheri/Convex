/**
 * Widget: QP Sandbox
 *
 * Description: An interactive sandbox for solving a simple 2D QP, showing the contour lines and constraints.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";


export async function initQPSandbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div id="plot"></div>
        <button id="solve_qp">Solve QP</button>
        <div id="output"></div>
    `;

    let pyodide = await getPyodide();
    await pyodide.loadPackage("cvxpy");

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Contour plot
    const contours = d3.contourDensity()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .size([width, height])
        .bandwidth(20)
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
            const px = Math.random() * 10 - 5;
            const py = Math.random() * 10 - 5;
            data.push({x: px, y: py, value: px*px + py*py});
        }
        return data;
    }

    // Constraint line
    svg.append("line")
        .attr("x1", x(-5))
        .attr("y1", y(3.5))
        .attr("x2", x(2))
        .attr("y2", y(0))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    d3.select("#solve_qp").on("click", async () => {
        const result = await pyodide.runPythonAsync(`
            import cvxpy as cp
            import numpy as np

            x = cp.Variable(2)
            objective = cp.Minimize(cp.sum_squares(x))
            constraints = [x[0] + 2*x[1] >= 2]
            prob = cp.Problem(objective, constraints)
            prob.solve()
            x.value.tolist()
        `);

        const sol = result.toJs();

        svg.selectAll(".solution").remove();
        svg.append("circle")
            .attr("class", "solution")
            .attr("cx", x(sol[0]))
            .attr("cy", y(sol[1]))
            .attr("r", 7)
            .attr("fill", "green");

        document.getElementById("output").innerHTML = \`Optimal solution: (\${sol[0].toFixed(2)}, \${sol[1].toFixed(2)})\`;
    });
}
