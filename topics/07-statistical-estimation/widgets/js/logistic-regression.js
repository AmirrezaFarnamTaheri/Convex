/**
 * Widget: Logistic Regression Solver
 *
 * Description: An interactive solver for logistic regression, showing the likelihood function and convergence.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLogisticRegression(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<div class="widget-loading-indicator">Initializing Pyodide...</div>`;

    const pyodide = await getPyodide();

    container.innerHTML = `
        <div id="plot_boundary" style="width: 500px; height: 500px;"></div>
        <div id="plot_likelihood" style="width: 500px; height: 200px;"></div>
        <button id="start_training">Start Training</button>
    `;

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svgBoundary = d3.select("#plot_boundary")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top - margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    svgBoundary.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
    svgBoundary.append("g")
        .call(d3.axisLeft(y));

    // Likelihood plot
    const svgLikelihood = d3.select("#plot_likelihood")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 200)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x_like = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const y_like = d3.scaleLinear().domain([0, 100]).range([150, 0]);
    svgLikelihood.append("g").attr("transform", `translate(0,150)`).call(d3.axisBottom(x_like));
    svgLikelihood.append("g").call(d3.axisLeft(y_like));


    // Generate data
    pyodide.runPython(`
        import numpy as np
        np.random.seed(0)
        X = np.r_[np.random.randn(50, 2) - [2, 2], np.random.randn(50, 2) + [2, 2]]
        y = np.r_[np.zeros(50), np.ones(50)]
    `);

    const X = pyodide.globals.get("X").toJs();
    const y_data = pyodide.globals.get("y").toJs();

    svgBoundary.selectAll(".datapoint")
        .data(X)
        .enter()
        .append("circle")
        .attr("class", "datapoint")
        .attr("cx", d => x(d[0]))
        .attr("cy", d => y(d[1]))
        .attr("r", 4)
        .attr("fill", (d, i) => y_data[i] === 0 ? "red" : "blue");

    async function train() {
        const likelihood_path = [];
        for (let i = 0; i < 100; i++) {
            pyodide.globals.set("iter", i);
            const result = await pyodide.runPythonAsync(`
                def sigmoid(z):
                    return 1 / (1 + np.exp(-z))

                if iter == 0:
                    w = np.zeros(2)
                    b = 0
                else:
                    w = globals().get('w')
                    b = globals().get('b')

                z = X @ w + b
                h = sigmoid(z)
                gradient_w = (1/y.size) * X.T @ (h - y)
                gradient_b = (1/y.size) * np.sum(h - y)

                w -= 0.1 * gradient_w
                b -= 0.1 * gradient_b

                log_likelihood = -np.mean(y * np.log(h) + (1 - y) * np.log(1 - h))

                globals()['w'] = w
                globals()['b'] = b

                {"w": w.tolist(), "b": b, "log_likelihood": log_likelihood}
            `);

            const w = result.get("w");
            const b = result.get("b");
            const log_likelihood = result.get("log_likelihood");

            likelihood_path.push({iter: i, val: log_likelihood});

            const x1 = -10;
            const y1 = (-b - w[0] * x1) / w[1];
            const x2 = 10;
            const y2 = (-b - w[0] * x2) / w[1];

            svgBoundary.selectAll(".boundary").remove();
            svgBoundary.append("line")
                .attr("class", "boundary")
                .attr("x1", x(x1))
                .attr("y1", y(y1))
                .attr("x2", x(x2))
                .attr("y2", y(y2))
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            const like_line = d3.line()
                .x(d => x_like(d.iter))
                .y(d => y_like(d.val));

            svgLikelihood.selectAll(".like-path").remove();
            svgLikelihood.append("path")
                .datum(likelihood_path)
                .attr("class", "like-path")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("d", like_line);

            await new Promise(r => setTimeout(r, 50));
        }

    }

    d3.select("#start_training").on("click", train);
}
