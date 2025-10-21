/**
 * Widget: Feature Selection via Sparsity
 *
 * Description: Shows how L1 regularization in logistic regression can drive feature coefficients to zero, effectively performing feature selection.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initFeatureSelection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="feature-selection-widget">
            <div class="widget-controls">
                <label>Dataset:</label>
                <select id="fs-dataset-select">
                    <option value="informative">Informative Features</option>
                    <option value="redundant">Redundant Features</option>
                </select>
                <label>Regularization Strength (C⁻¹): smaller C = stronger regularization</label>
                <input type="range" id="fs-c-slider" min="-2" max="2" step="0.1" value="0">
                <span id="c-val-display">C = 1.0</span>
            </div>
            <div id="plot-container"></div>
            <div id="corr-matrix-container" style="width: 100%; height: 250px;"></div>
            <div class="widget-output" id="sparsity-output"></div>
        </div>
    `;

    const datasetSelect = container.querySelector("#fs-dataset-select");
    const cSlider = container.querySelector("#fs-c-slider");
    const cValDisplay = container.querySelector("#c-val-display");
    const plotContainer = container.querySelector("#plot-container");
    const sparsityOutput = container.querySelector("#sparsity-output");
    const corrMatrixContainer = container.querySelector("#corr-matrix-container");

    const margin = {top: 30, right: 20, bottom: 40, left: 50};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text").attr("x", width/2).attr("y", -10).attr("text-anchor", "middle").text("Logistic Regression Coefficients (L1 Penalty)");

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
import json

def generate_data(dataset_type):
    if dataset_type == 'informative':
        X, y = make_classification(n_samples=100, n_features=20, n_informative=8, n_redundant=2, n_classes=2, random_state=42)
    else: # redundant
        X, y = make_classification(n_samples=100, n_features=20, n_informative=4, n_redundant=8, n_repeated=4, n_classes=2, random_state=42)

    X = (X - X.mean(axis=0)) / X.std(axis=0)
    corr_matrix = np.corrcoef(X, rowvar=False).tolist()

    return {"X": X, "y": y, "corr": corr_matrix}

def get_coefs(X, y, C):
    clf = LogisticRegression(penalty='l1', C=C, solver='liblinear', random_state=42, tol=1e-6, max_iter=500)
    clf.fit(X, y)
    return clf.coef_.flatten().tolist()
`;
    await pyodide.runPythonAsync(pythonCode);
    const generate_data = pyodide.globals.get('generate_data');
    const get_coefs = pyodide.globals.get('get_coefs');

    let current_data;

    const n_features = 20;
    const x = d3.scaleBand().domain(d3.range(n_features)).range([0, width]).padding(0.3);
    const y = d3.scaleLinear().range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(i => `w${i}`));
    const yAxis = svg.append("g");
    const bars = svg.append("g");
    svg.append("line").attr("x1", 0).attr("x2", width).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", "var(--color-text-secondary)").attr("stroke-width", 0.5);

    function drawCorrMatrix(corr) {
        corrMatrixContainer.innerHTML = '';
        const size = corrMatrixContainer.clientHeight;
        const matrix_svg = d3.select(corrMatrixContainer).append("svg").attr("width", size).attr("height", size).attr("viewBox", `0 0 ${size} ${size}`);
        const color = d3.scaleDiverging(d3.interpolatePiYG).domain([-1, 0, 1]);
        const padding = 0.05;
        const x_corr = d3.scaleBand().domain(d3.range(n_features)).range([0, size]).padding(padding);

        for(let i=0; i<n_features; i++) {
            for(let j=0; j<n_features; j++) {
                matrix_svg.append("rect")
                    .attr("x", x_corr(i)).attr("y", x_corr(j))
                    .attr("width", x_corr.bandwidth()).attr("height", x_corr.bandwidth())
                    .attr("fill", color(corr[i][j]));
            }
        }
    }

    async function updateCoefficients(C) {
        cValDisplay.textContent = `C = ${C.toExponential(1)}`;

        const coefs = await get_coefs(current_data.X, current_data.y, C).then(c => c.toJs());
        const non_zero = coefs.filter(c => Math.abs(c) > 1e-5).length;
        sparsityOutput.textContent = `${non_zero} of ${n_features} features are non-zero.`;

        y.domain(d3.extent([-0.1, 0.1, ...coefs])).nice();
        yAxis.transition().duration(200).call(d3.axisLeft(y));

        bars.selectAll("rect").data(coefs).join("rect")
            .transition().duration(200)
            .attr("x", (d,i) => x(i))
            .attr("y", d => y(Math.max(0, d)))
            .attr("width", x.bandwidth())
            .attr("height", d => Math.abs(y(d) - y(0)))
            .attr("fill", d => d > 0 ? "var(--color-accent)" : "var(--color-primary)");
    }

    async function changeDataset() {
        const dataset_type = datasetSelect.value;
        current_data = await generate_data(dataset_type).then(d => d.toJs({create_proxies: false}));
        drawCorrMatrix(current_data.corr);
        const C = Math.pow(10, +cSlider.value);
        updateCoefficients(C);
    }

    cSlider.addEventListener("input", () => {
        const C = Math.pow(10, +cSlider.value);
        updateCoefficients(C);
    });

    datasetSelect.addEventListener("change", changeDataset);

    changeDataset();
}
