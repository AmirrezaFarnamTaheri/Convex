/**
 * Widget: ROC Curve & Threshold Explorer
 *
 * Description: Interactive tool to explore the ROC curve and see how classification
 *              threshold affects True Positive Rate and False Positive Rate.
 * Version: 1.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";
import { showLoading, showError, createWidgetHeader, createInstructions } from "../../../../static/js/widget-enhancements.js";

export async function initROCCurveExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    showLoading(container, "Loading Pyodide & scikit-learn...");

    try {
        const pyodide = await getPyodide();
        await pyodide.loadPackage("scikit-learn");

        container.innerHTML = `
            <div class="roc-curve-widget">
                ${createWidgetHeader(
                    "ROC Curve & Classification Threshold Explorer",
                    "The Receiver Operating Characteristic (ROC) curve shows the trade-off between True Positive Rate (sensitivity) and False Positive Rate (1-specificity) as you vary the classification threshold. The Area Under Curve (AUC) measures overall classifier performance."
                )}
                <div class="widget-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label for="dataset-select">Dataset:</label>
                            <select id="dataset-select">
                                <option value="well_separated">Well Separated</option>
                                <option value="moderate">Moderate Overlap</option>
                                <option value="high_overlap">High Overlap</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label for="threshold-slider">
                                Classification Threshold: <span id="threshold-val" class="text-accent font-semibold">0.50</span>
                            </label>
                            <input type="range" id="threshold-slider" min="0" max="1" step="0.01" value="0.5">
                            <div class="range-labels">
                                <span>0.0 (All Positive)</span>
                                <span>1.0 (All Negative)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
                    <div>
                        <h4 style="margin: 0 0 10px 0; font-size: 1rem; font-weight: 600;">Score Distribution</h4>
                        <div id="histogram-container" style="height: 300px;"></div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 10px 0; font-size: 1rem; font-weight: 600;">ROC Curve</h4>
                        <div id="roc-container" style="height: 300px;"></div>
                    </div>
                </div>
                <div style="padding: 0 20px 20px 20px;">
                    ${createInstructions("Adjust the threshold to see how it affects the confusion matrix. Points above the threshold are classified as positive. The ROC curve shows performance across all thresholds.")}
                    <div id="metrics-output" class="widget-output mt-2"></div>
                </div>
            </div>
        `;

        const datasetSelect = container.querySelector("#dataset-select");
        const thresholdSlider = container.querySelector("#threshold-slider");
        const thresholdVal = container.querySelector("#threshold-val");
        const histContainer = container.querySelector("#histogram-container");
        const rocContainer = container.querySelector("#roc-container");
        const metricsOutput = container.querySelector("#metrics-output");

        // Python code for ROC computation
        const pythonCode = `
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve, roc_auc_score, confusion_matrix
import numpy as np
import json

def generate_roc_data(dataset_type, threshold):
    # Generate different datasets
    if dataset_type == "well_separated":
        X, y = make_classification(n_samples=300, n_features=2, n_redundant=0, n_informative=2,
                                   n_clusters_per_class=1, class_sep=2.0, random_state=42)
    elif dataset_type == "moderate":
        X, y = make_classification(n_samples=300, n_features=2, n_redundant=0, n_informative=2,
                                   n_clusters_per_class=1, class_sep=1.0, random_state=42)
    else:  # high_overlap
        X, y = make_classification(n_samples=300, n_features=2, n_redundant=0, n_informative=2,
                                   n_clusters_per_class=1, class_sep=0.5, random_state=42)

    # Train logistic regression
    model = LogisticRegression(random_state=42)
    model.fit(X, y)

    # Get prediction probabilities
    y_scores = model.predict_proba(X)[:, 1]

    # Compute ROC curve
    fpr, tpr, thresholds_roc = roc_curve(y, y_scores)
    auc = roc_auc_score(y, y_scores)

    # Apply threshold for current predictions
    y_pred = (y_scores >= threshold).astype(int)

    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y, y_pred).ravel()

    # Calculate metrics
    accuracy = (tp + tn) / (tp + tn + fp + fn)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    current_fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
    current_tpr = recall

    # Prepare histogram data
    scores_class0 = y_scores[y == 0].tolist()
    scores_class1 = y_scores[y == 1].tolist()

    return json.dumps({
        "roc_curve": {
            "fpr": fpr.tolist(),
            "tpr": tpr.tolist(),
            "auc": float(auc)
        },
        "scores": {
            "class0": scores_class0,
            "class1": scores_class1
        },
        "metrics": {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(f1),
            "tp": int(tp),
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "current_fpr": float(current_fpr),
            "current_tpr": float(current_tpr)
        }
    })
`;

        await pyodide.runPythonAsync(pythonCode);
        const generate_roc_data = pyodide.globals.get('generate_roc_data');

        // Setup histogram SVG
        const histMargin = {top: 10, right: 10, bottom: 30, left: 40};
        const histWidth = histContainer.clientWidth - histMargin.left - histMargin.right;
        const histHeight = 300 - histMargin.top - histMargin.bottom;

        const histSvg = d3.select(histContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${histContainer.clientWidth} 300`)
          .append("g")
            .attr("transform", `translate(${histMargin.left},${histMargin.top})`);

        // Setup ROC SVG
        const rocMargin = {top: 10, right: 10, bottom: 30, left: 40};
        const rocWidth = rocContainer.clientWidth - rocMargin.left - rocMargin.right;
        const rocHeight = 300 - rocMargin.top - rocMargin.bottom;

        const rocSvg = d3.select(rocContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${rocContainer.clientWidth} 300`)
          .append("g")
            .attr("transform", `translate(${rocMargin.left},${rocMargin.top})`);

        const rocX = d3.scaleLinear().domain([0, 1]).range([0, rocWidth]);
        const rocY = d3.scaleLinear().domain([0, 1]).range([rocHeight, 0]);

        // Add axes for ROC
        rocSvg.append("g")
            .attr("transform", `translate(0,${rocHeight})`)
            .call(d3.axisBottom(rocX).ticks(5))
          .append("text")
            .attr("x", rocWidth / 2)
            .attr("y", 25)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "0.75rem")
            .text("False Positive Rate");

        rocSvg.append("g")
            .call(d3.axisLeft(rocY).ticks(5))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -rocHeight / 2)
            .attr("y", -30)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "0.75rem")
            .text("True Positive Rate");

        // Add diagonal reference line
        rocSvg.append("line")
            .attr("x1", 0).attr("y1", rocHeight)
            .attr("x2", rocWidth).attr("y2", 0)
            .attr("stroke", "var(--color-surface-2)")
            .attr("stroke-dasharray", "4 4")
            .attr("stroke-width", 1.5);

        async function update() {
            const threshold = +thresholdSlider.value;
            const dataset = datasetSelect.value;
            thresholdVal.textContent = threshold.toFixed(2);

            try {
                const resultJson = await generate_roc_data(dataset, threshold);
                const data = JSON.parse(resultJson);

                // Update histogram
                histSvg.selectAll("*").remove();

                const histX = d3.scaleLinear().domain([0, 1]).range([0, histWidth]);
                const bins0 = d3.bin().domain([0, 1]).thresholds(20)(data.scores.class0);
                const bins1 = d3.bin().domain([0, 1]).thresholds(20)(data.scores.class1);
                const histY = d3.scaleLinear()
                    .domain([0, d3.max([...bins0, ...bins1], d => d.length)])
                    .range([histHeight, 0]);

                histSvg.append("g")
                    .attr("transform", `translate(0,${histHeight})`)
                    .call(d3.axisBottom(histX).ticks(5));

                histSvg.append("g").call(d3.axisLeft(histY).ticks(5));

                // Class 0 (negative) histogram
                histSvg.selectAll(".bar0")
                    .data(bins0)
                    .join("rect")
                    .attr("class", "bar0")
                    .attr("x", d => histX(d.x0))
                    .attr("width", d => Math.max(0, histX(d.x1) - histX(d.x0) - 1))
                    .attr("y", d => histY(d.length))
                    .attr("height", d => histHeight - histY(d.length))
                    .attr("fill", "var(--color-primary)")
                    .attr("opacity", 0.6);

                // Class 1 (positive) histogram
                histSvg.selectAll(".bar1")
                    .data(bins1)
                    .join("rect")
                    .attr("class", "bar1")
                    .attr("x", d => histX(d.x0))
                    .attr("width", d => Math.max(0, histX(d.x1) - histX(d.x0) - 1))
                    .attr("y", d => histY(d.length))
                    .attr("height", d => histHeight - histY(d.length))
                    .attr("fill", "var(--color-accent)")
                    .attr("opacity", 0.6);

                // Threshold line
                histSvg.append("line")
                    .attr("x1", histX(threshold))
                    .attr("x2", histX(threshold))
                    .attr("y1", 0)
                    .attr("y2", histHeight)
                    .attr("stroke", "var(--color-danger)")
                    .attr("stroke-width", 2.5)
                    .attr("stroke-dasharray", "5 5");

                // Update ROC curve
                rocSvg.selectAll(".roc-line").remove();
                rocSvg.selectAll(".current-point").remove();
                rocSvg.selectAll(".auc-text").remove();

                const rocLine = d3.line()
                    .x(d => rocX(d[0]))
                    .y(d => rocY(d[1]));

                const rocPoints = data.roc_curve.fpr.map((fpr, i) => [fpr, data.roc_curve.tpr[i]]);

                rocSvg.append("path")
                    .datum(rocPoints)
                    .attr("class", "roc-line")
                    .attr("fill", "none")
                    .attr("stroke", "var(--color-accent)")
                    .attr("stroke-width", 2.5)
                    .attr("d", rocLine);

                // Current operating point
                rocSvg.append("circle")
                    .attr("class", "current-point")
                    .attr("cx", rocX(data.metrics.current_fpr))
                    .attr("cy", rocY(data.metrics.current_tpr))
                    .attr("r", 6)
                    .attr("fill", "var(--color-danger)")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);

                // AUC text
                rocSvg.append("text")
                    .attr("class", "auc-text")
                    .attr("x", rocWidth - 10)
                    .attr("y", 20)
                    .attr("text-anchor", "end")
                    .attr("fill", "var(--color-text-primary)")
                    .style("font-size", "0.875rem")
                    .style("font-weight", "600")
                    .text(`AUC = ${data.roc_curve.auc.toFixed(3)}`);

                // Update metrics
                const m = data.metrics;
                metricsOutput.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <h5 style="margin: 0 0 8px 0; font-size: 0.8125rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Confusion Matrix</h5>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.875rem;">
                                <div style="padding: 8px; background: var(--color-surface-1); border-radius: 4px;">
                                    <strong>TN:</strong> ${m.tn}
                                </div>
                                <div style="padding: 8px; background: var(--color-surface-1); border-radius: 4px;">
                                    <strong>FP:</strong> ${m.fp}
                                </div>
                                <div style="padding: 8px; background: var(--color-surface-1); border-radius: 4px;">
                                    <strong>FN:</strong> ${m.fn}
                                </div>
                                <div style="padding: 8px; background: var(--color-surface-1); border-radius: 4px;">
                                    <strong>TP:</strong> ${m.tp}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 style="margin: 0 0 8px 0; font-size: 0.8125rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Performance Metrics</h5>
                            <div style="font-size: 0.875rem; line-height: 1.8;">
                                <div><strong>Accuracy:</strong> ${(m.accuracy * 100).toFixed(1)}%</div>
                                <div><strong>Precision:</strong> ${(m.precision * 100).toFixed(1)}%</div>
                                <div><strong>Recall (TPR):</strong> ${(m.recall * 100).toFixed(1)}%</div>
                                <div><strong>F1 Score:</strong> ${m.f1.toFixed(3)}</div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Update error:', error);
                metricsOutput.innerHTML = `<span style="color: var(--color-danger);">Error: ${error.message}</span>`;
            }
        }

        datasetSelect.addEventListener("change", update);
        thresholdSlider.addEventListener("input", update);

        await update();

    } catch (error) {
        console.error('Widget initialization error:', error);
        showError(container, 'Failed to initialize ROC Curve Explorer. Please refresh the page.', error);
    }
}
