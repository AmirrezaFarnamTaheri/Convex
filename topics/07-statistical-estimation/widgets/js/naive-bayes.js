/**
 * Widget: Naive Bayes Visualization
 *
 * Description: Visualizes the conditional probabilities used in a Naive Bayes classifier.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initNaiveBayes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="naive-bayes-widget">
            <div id="nb-main-plot"></div>
            <div class="side-plots">
                <div id="nb-x1-plot"></div>
                <div id="nb-x2-plot"></div>
            </div>
        </div>
        <div class="widget-controls" style="padding: 15px;">
            <p><strong>Class 0 (Blue):</strong></p>
            <label>Mean (μ₀):</label> <input type="range" class="mean-slider" data-class="0" data-dim="0" min="-4" max="0" step="0.1" value="-2">
            <label>Var (σ₀²):</label> <input type="range" class="var-slider" data-class="0" data-dim="0" min="0.5" max="3" step="0.1" value="1.2">
            <p><strong>Class 1 (Green):</strong></p>
            <label>Mean (μ₁):</label> <input type="range" class="mean-slider" data-class="1" data-dim="0" min="0" max="4" step="0.1" value="2">
            <label>Var (σ₁²):</label> <input type="range" class="var-slider" data-class="1" data-dim="0" min="0.5" max="3" step="0.1" value="1.2">
            <div id="prior-display" class="widget-output"></div>
        </div>
        <p class="widget-instructions">Hover over the main plot to see the conditional probabilities for each feature.</p>
    `;

    const priorDisplay = container.querySelector("#prior-display");
    const mainPlot = container.querySelector("#nb-main-plot");
    const x1Plot = container.querySelector("#nb-x1-plot");
    const x2Plot = container.querySelector("#nb-x2-plot");

    const margin = {top: 30, right: 20, bottom: 40, left: 40};
    const width1 = 400 - margin.left - margin.right;
    const height1 = 400 - margin.top - margin.bottom;
    const width2 = 200 - margin.left - margin.right;
    const height2 = 200 - margin.top - margin.bottom;

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const data = await pyodide.runPythonAsync(`
        import numpy as np
        from sklearn.datasets import make_blobs
        from sklearn.naive_bayes import GaussianNB
        import json

        X, y = make_blobs(n_samples=100, centers=[[-2,-2],[2,2]], n_features=2, random_state=42, cluster_std=1.2)
        clf = GaussianNB().fit(X, y)

        json.dumps({
            "X": X.tolist(), "y": y.tolist(),
            "means": clf.theta_.tolist(),
            "vars": clf.var_.tolist()
        })
    `).then(r => JSON.parse(r));

    const colors = ["var(--color-primary)", "var(--color-accent)"];

    // Main Plot
    const svg1 = d3.select(mainPlot).append("svg").attr("width", width1 + margin.left + margin.right).attr("height", height1 + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x1 = d3.scaleLinear().domain(d3.extent(data.X, d=>d[0])).nice().range([0, width1]);
    const y1 = d3.scaleLinear().domain(d3.extent(data.X, d=>d[1])).nice().range([height1, 0]);
    svg1.append("g").attr("transform", `translate(0,${height1})`).call(d3.axisBottom(x1));
    svg1.append("g").call(d3.axisLeft(y1));
    svg1.selectAll("circle").data(data.X).join("circle").attr("cx", d=>x1(d[0])).attr("cy", d=>y1(d[1])).attr("r", 4).attr("fill", (d,i)=>colors[data.y[i]]);
    const hoverLineX = svg1.append("line").attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "3,3");
    const hoverLineY = svg1.append("line").attr("stroke", "var(--color-text-secondary)").attr("stroke-dasharray", "3,3");

    // Feature 1 Plot
    const svg2 = d3.select(x1Plot).append("svg").attr("width", width2 + margin.left + margin.right).attr("height", height2 + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x2 = d3.scaleLinear().domain(x1.domain()).range([0, width2]);
    const y2 = d3.scaleLinear().domain([0, 1]).range([height2, 0]);
    svg2.append("g").attr("transform", `translate(0,${height2})`).call(d3.axisBottom(x2));
    svg2.append("text").text("P(x₁|Class)").attr("x", width2/2).attr("y", -10).attr("text-anchor", "middle");
    const pdfPath1_c0 = svg2.append("path").attr("fill", "none").attr("stroke", colors[0]).attr("stroke-width", 2);
    const pdfPath1_c1 = svg2.append("path").attr("fill", "none").attr("stroke", colors[1]).attr("stroke-width", 2);
    const condProbLine1 = svg2.append("line").attr("stroke", "var(--color-danger)").attr("stroke-width", 1.5);

    // Feature 2 Plot
    const svg3 = d3.select(x2Plot).append("svg").attr("width", width2 + margin.left + margin.right).attr("height", height2 + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const x3 = d3.scaleLinear().domain(y1.domain()).range([0, width2]);
    const y3 = d3.scaleLinear().domain([0, 1]).range([height2, 0]);
    svg3.append("g").attr("transform", `translate(0,${height2})`).call(d3.axisBottom(x3));
    svg3.append("text").text("P(x₂|Class)").attr("x", width2/2).attr("y", -10).attr("text-anchor", "middle");
    const pdfPath2_c0 = svg3.append("path").attr("fill", "none").attr("stroke", colors[0]).attr("stroke-width", 2);
    const pdfPath2_c1 = svg3.append("path").attr("fill", "none").attr("stroke", colors[1]).attr("stroke-width", 2);
    const condProbLine2 = svg3.append("line").attr("stroke", "var(--color-danger)").attr("stroke-width", 1.5);

    const gaussianPDF = (x, mean, variance) => Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);

    // Draw PDFs
    const line = (x_scale, y_scale) => d3.line().x(d=>x_scale(d.x)).y(d=>y_scale(d.y));

    function updateDistributions() {
        const means = [[0,0],[0,0]];
        const variances = [[0,0],[0,0]];
        container.querySelectorAll(".mean-slider").forEach(s => means[+s.dataset.class][+s.dataset.dim] = +s.value);
        container.querySelectorAll(".var-slider").forEach(s => variances[+s.dataset.class][+s.dataset.dim] = +s.value);

        const pdfData1_c0 = x2.ticks(100).map(d => ({x:d, y:gaussianPDF(d, means[0][0], variances[0][0])}));
        const pdfData1_c1 = x2.ticks(100).map(d => ({x:d, y:gaussianPDF(d, means[1][0], variances[1][0])}));
        pdfPath1_c0.datum(pdfData1_c0).attr("d", line(x2, y2));
        pdfPath1_c1.datum(pdfData1_c1).attr("d", line(x2, y2));

        const pdfData2_c0 = x3.ticks(100).map(d => ({x:d, y:gaussianPDF(d, means[0][1], variances[0][1])}));
        const pdfData2_c1 = x3.ticks(100).map(d => ({x:d, y:gaussianPDF(d, means[1][1], variances[1][1])}));
        pdfPath2_c0.datum(pdfData2_c0).attr("d", line(x3, y3));
        pdfPath2_c1.datum(pdfData2_c1).attr("d", line(x3, y3));

        const n_c0 = data.y.filter(d=>d===0).length;
        const n_c1 = data.y.length - n_c0;
        priorDisplay.innerHTML = `Priors: P(C₀) = ${ (n_c0/data.y.length).toFixed(2) }, P(C₁) = ${ (n_c1/data.y.length).toFixed(2) }`;
    }

    container.querySelectorAll("input[type=range]").forEach(s => s.addEventListener("input", updateDistributions));
    updateDistributions();

    svg1.on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event, svg1.node());
        const x_val = x1.invert(mx);
        const y_val = y1.invert(my);

        hoverLineX.attr("x1", mx).attr("y1", 0).attr("x2", mx).attr("y2", height1);
        hoverLineY.attr("x1", 0).attr("y1", my).attr("x2", width1).attr("y2", my);

        condProbLine1.attr("x1", x2(x_val)).attr("y1", y2(0)).attr("x2", x2(x_val)).attr("y2", y2(1));
        condProbLine2.attr("x1", x3(y_val)).attr("y1", y3(0)).attr("x2", x3(y_val)).attr("y2", y3(1));
    });
}
