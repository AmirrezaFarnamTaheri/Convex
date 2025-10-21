/**
 * Widget: Logistic Regression Solver
 *
 * Description: An interactive solver for logistic regression, showing the likelihood function and convergence.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLogisticRegression(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="logistic-regression-widget">
            <div class="widget-controls">
                <label>Add Points for:</label>
                <select id="logreg-class-select">
                    <option value="0">Class 0</option>
                    <option value="1">Class 1</option>
                </select>
                <label>Optimizer:</label>
                <select id="optimizer-select">
                    <option value="SGD">SGD</option>
                    <option value="Adam">Adam</option>
                </select>
                <button id="logreg-train-btn">Train Model</button>
                <button id="logreg-reset-btn">Reset</button>
            </div>
            <div class="plots-container">
                <div id="logreg-boundary-plot"></div>
                <div id="logreg-likelihood-plot"></div>
            </div>
        </div>
    `;

    const classSelect = container.querySelector("#logreg-class-select");
    const trainBtn = container.querySelector("#logreg-train-btn");
    const resetBtn = container.querySelector("#logreg-reset-btn");
    const optimizerSelect = container.querySelector("#optimizer-select");
    const boundaryPlot = container.querySelector("#logreg-boundary-plot");
    const likelihoodPlot = container.querySelector("#logreg-likelihood-plot");

    let points = [];

    // SVG Setup
    const margin = {top: 30, right: 20, bottom: 40, left: 50};
    const width = boundaryPlot.clientWidth - margin.left - margin.right;
    const height1 = 350 - margin.top - margin.bottom;
    const height2 = 200 - margin.top - margin.bottom;

    const svgBoundary = d3.select(boundaryPlot).append("svg").attr("width", "100%").attr("height", height1+margin.top+margin.bottom).attr("viewBox", `0 0 ${width+margin.left+margin.right} ${height1+margin.top+margin.bottom}`).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    svgBoundary.append("text").text("Decision Boundary").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle");

    const svgLike = d3.select(likelihoodPlot).append("svg").attr("width", "100%").attr("height", height2+margin.top+margin.bottom).attr("viewBox", `0 0 ${width+margin.left+margin.right} ${height2+margin.top+margin.bottom}`).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    svgLike.append("text").text("Negative Log-Likelihood").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle");

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y1 = d3.scaleLinear().domain([-5, 5]).range([height1, 0]);
    svgBoundary.append("g").attr("transform", `translate(0,${height1})`).call(d3.axisBottom(x));
    svgBoundary.append("g").call(d3.axisLeft(y1));

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");

    // Python code for training
    const pythonCode = `
import numpy as np
from sklearn.linear_model import SGDClassifier
import json

def train_logistic_step(X, y, optimizer, iter):
    # Use SGDClassifier to train incrementally
    model = SGDClassifier(loss='log_loss', learning_rate='constant', eta0=0.1, max_iter=1, warm_start=True)
    if optimizer == 'Adam':
        model.learning_rate = 'adaptive'

    likelihoods = []
    coefs = []

    for i in range(iter):
        model.fit(X, y)
        p = model.predict_proba(X)
        # Avoid log(0)
        p = np.clip(p, 1e-9, 1 - 1e-9)
        likelihood = -np.mean(y * np.log(p[:,1]) + (1-y) * np.log(p[:,0]))
        likelihoods.append(likelihood)
        coefs.append(model.coef_[0].tolist() + [model.intercept_[0]])

    return json.dumps({"likelihoods": likelihoods, "coefs": coefs})
`;
    await pyodide.runPythonAsync(pythonCode);
    const train_logistic_step = pyodide.globals.get('train_logistic_step');

    function drawPoints() {
        svgBoundary.selectAll(".datapoint").data(points).join("circle").attr("class", "datapoint")
            .attr("cx", d=>x(d.x)).attr("cy", d=>y1(d.y)).attr("r", 5)
            .attr("fill", d=>d.class === 0 ? "var(--color-primary)" : "var(--color-accent)");
    }

    async function train() {
        if (points.length < 2 || d3.group(points, d => d.class).size < 2) return;
        trainBtn.disabled = true;

        const X = points.map(p => [p.x, p.y]);
        const y = points.map(p => p.class);
        const optimizer = optimizerSelect.value;

        const result = await train_logistic_step(X, y, optimizer, 100).then(r => JSON.parse(r));
        const n_iter = result.likelihoods.length;

        const x_like = d3.scaleLinear().domain([0, n_iter]).range([0, width]);
        const y_like = d3.scaleLinear().domain(d3.extent(result.likelihoods)).nice().range([height2, 0]);
        svgLike.selectAll("*").remove(); // Clear previous
        svgLike.append("g").attr("transform", `translate(0,${height2})`).call(d3.axisBottom(x_like));
        svgLike.append("g").call(d3.axisLeft(y_like));

        const line = d3.line().x((d,i) => x_like(i)).y(d => y_like(d));
        svgLike.append("path").datum(result.likelihoods).attr("d", line).attr("fill", "none").attr("stroke", "var(--color-success)").attr("stroke-width", 2);

        // Draw coefficient path
        const coef_x = d3.scaleLinear().domain(d3.extent(result.coefs, d => d[0])).range([0, width]);
        const coef_y = d3.scaleLinear().domain(d3.extent(result.coefs, d => d[1])).range([height2, 0]);
        svgLike.append("path").datum(result.coefs).attr("d", d3.line().x(d => coef_x(d[0])).y(d => coef_y(d[1])))
            .attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 1).attr("opacity", 0.5);

        // Animate boundary
        result.coefs.forEach((coef, i) => {
            setTimeout(() => {
                const [w1, w2, b] = coef;
                const y_start = (-b - w1 * -5) / w2;
                const y_end = (-b - w1 * 5) / w2;
                svgBoundary.selectAll(".boundary").remove();
                svgBoundary.append("line").attr("class", "boundary")
                    .attr("x1", x(-5)).attr("y1", y1(y_start))
                    .attr("x2", x(5)).attr("y2", y1(y_end))
                    .attr("stroke", "var(--color-danger)").attr("stroke-width", 2);
            }, i * 20);
        });

        setTimeout(() => trainBtn.disabled = false, result.coefs.length * 20);
    }

    svgBoundary.append("rect").attr("width", width).attr("height", height1).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svgBoundary.node());
            points.push({x: x.invert(mx), y: y1.invert(my), class: +classSelect.value});
            drawPoints();
        });

    resetBtn.addEventListener("click", () => {
        points = [];
        svgBoundary.selectAll(".datapoint").remove();
        svgBoundary.selectAll(".boundary").remove();
        svgLike.selectAll("*").remove();
    });

    trainBtn.addEventListener("click", train);
}
