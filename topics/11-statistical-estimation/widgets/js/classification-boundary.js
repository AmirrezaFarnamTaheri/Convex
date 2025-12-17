/**
 * Widget: Classification Boundary Visualizer
 *
 * Description: Interactive classification playground using Pyodide (scikit-learn).
 *              Supports Logistic Regression and SVM with visual decision boundaries.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "/static/js/pyodide-manager.js";

export async function initClassificationBoundaryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Data Science Engine (Pyodide)...</div>`;

    let pyodide;
    try {
        pyodide = await getPyodide();
        await pyodide.loadPackage("scikit-learn");
    } catch (e) {
        container.innerHTML = `<div style="padding:20px; color:var(--error);">Failed to load Pyodide. Please refresh the page.</div>`;
        return;
    }

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div>
                        <label class="widget-label">Classifier</label>
                        <select id="classifier-select" class="widget-select">
                            <option value="LogisticRegression">Logistic Regression</option>
                            <option value="SVC">SVM (RBF Kernel)</option>
                        </select>
                    </div>
                    <div id="svm-c-control" style="display:none;">
                        <label class="widget-label">Regularization (C): <span id="svm-c-val">1.0</span></label>
                        <input type="range" id="svm-c-slider" min="-1" max="3" step="0.1" value="0" class="widget-slider">
                    </div>
                    <div>
                        <label class="widget-label">Adding Points For:</label>
                        <div style="display:flex; gap:10px;">
                            <label class="radio-label" style="color:var(--color-primary);">
                                <input type="radio" name="class-select" value="0" checked> Class 0 (Blue)
                            </label>
                            <label class="radio-label" style="color:var(--color-accent);">
                                <input type="radio" name="class-select" value="1"> Class 1 (Green)
                            </label>
                        </div>
                    </div>
                </div>

                <div style="display:flex; gap:8px; margin-top:16px;">
                    <button id="clear-boundary-btn" class="widget-btn">Clear Points</button>
                </div>

                <div class="widget-output" id="accuracy-display" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const classifierSelect = container.querySelector("#classifier-select");
    const svmCControl = container.querySelector("#svm-c-control");
    const svmCSlider = container.querySelector("#svm-c-slider");
    const svmCVal = container.querySelector("#svm-c-val");
    const accuracyDisplay = container.querySelector("#accuracy-display");
    const clearBtn = container.querySelector("#clear-boundary-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [
        {x:-2, y:-2, class:0}, {x:-1, y:-2.5, class:0}, {x:-2.5, y:-1, class:0},
        {x:2, y:2, class:1}, {x:1, y:2.5, class:1}, {x:2.5, y:1, class:1},
    ];

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

    // Grid
    svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).tickSize(-height).tickFormat("")).attr("opacity", 0.1);
    svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const backgroundGroup = svg.append("g");
    const pointsGroup = svg.append("g");
    const colors = ["var(--color-primary)", "var(--color-accent)"];

    // Click handler
    d3.select(plotContainer).select("svg").on("click", (event) => {
        // Only trigger if clicking on the background (approx)
        // Transform click coords
        const [mx, my] = d3.pointer(event, svg.node());
        // Check bounds
        if (mx < 0 || mx > width || my < 0 || my > height) return;

        const cls = document.querySelector('input[name="class-select"]:checked').value;
        points.push({ x: x.invert(mx), y: y.invert(my), class: +cls });
        drawPoints();
        trainAndDrawBoundary();
    });

    const pythonCode = `
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import numpy as np
import json

def get_boundary(points_data, classifier_type, C, domain_x, domain_y, grid_size=50):
    if len(points_data) < 2: return None

    X = np.array([[p['x'], p['y']] for p in points_data])
    y = np.array([p['class'] for p in points_data])

    if len(np.unique(y)) < 2: return None

    if classifier_type == "LogisticRegression":
        model = LogisticRegression(C=C) # C applies to LogReg too (inverse regularization)
    else:
        model = SVC(gamma='auto', C=C, probability=True)

    model.fit(X, y)

    accuracy = accuracy_score(y, model.predict(X))

    xx, yy = np.meshgrid(np.linspace(domain_x[0], domain_x[1], grid_size),
                         np.linspace(domain_y[0], domain_y[1], grid_size))

    # Decision function distance or probability
    if hasattr(model, "decision_function"):
        Z = model.decision_function(np.c_[xx.ravel(), yy.ravel()])
    else:
        Z = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]

    return json.dumps({"Z": Z.reshape(xx.shape).tolist(), "accuracy": accuracy})
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_boundary = pyodide.globals.get('get_boundary');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 6)
            .attr("fill", d => colors[d.class])
            .attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 2);
    }

    async function trainAndDrawBoundary() {
        const clsType = classifierSelect.value;
        svmCControl.style.display = 'block'; // Always show C (inverse regularization)
        const C = Math.pow(10, +svmCSlider.value);
        svmCVal.textContent = C.toFixed(2);

        // Loading state
        accuracyDisplay.innerHTML = `<span style="color:var(--text-tertiary);">Training...</span>`;

        const result_json = await get_boundary(points, clsType, C, x.domain(), y.domain());

        if (!result_json) {
            backgroundGroup.selectAll("*").remove();
            accuracyDisplay.textContent = "Add points of both classes to train.";
            return;
        }

        const result = JSON.parse(result_json);
        accuracyDisplay.innerHTML = `<strong>Training Accuracy:</strong> ${(result.accuracy * 100).toFixed(1)}%`;

        // Render Contours
        // We need to map Z values to a path. D3 Contours expects a flat array of values [0, 1] usually?
        // Z from sklearn is distance (unbounded) or probability (0-1).

        // Let's normalize Z for visualization if using decision_function
        const Z = result.Z.flat();

        // Use d3.contours
        const contours = d3.contours()
            .size([50, 50])
            .thresholds([0]) // For decision_function, 0 is the boundary
            (Z);

        // If probability, thresholds should be [0.5]
        // Our python code returns decision_function for SVC/LogReg usually,
        // wait LogReg decision_function is distance.
        // Let's assume 0 is boundary.

        // Color regions:
        // Everything < 0 is Class 0 area
        // Everything > 0 is Class 1 area
        // We can draw filled contours.

        // Actually, let's create a canvas heatmap for better performance and gradient?
        // Sticking to SVG contours for consistency with existing code.

        backgroundGroup.selectAll("*").remove();

        // Draw regions (approximated by drawing contour > 0)
        // This is tricky with d3.contours for filled regions of arbitrary range.
        // Alternative: Color dots grid? No, too many nodes.
        // Let's rely on single boundary line for simplicity + faint shading?

        // Correct approach for filled contours:
        // Use thresholds like [-10, 0, 10] or whatever range Z has.
        // Let's stick to drawing the boundary line clearly.

        const boundary = d3.contours()
            .size([50, 50])
            .thresholds([0])
            (Z);

        // Scale 50x50 to width x height
        const projection = d3.geoIdentity().scale(width / 50);
        const pathGen = d3.geoPath(projection);

        backgroundGroup.selectAll("path").data(boundary).join("path")
            .attr("d", pathGen)
            // Fix vertical scaling if needed (d3 contours are square aspect usually)
            // Actually, we can just use SVG transform on the group or path.
            .attr("transform", `scale(1, ${height/width})`) // Fix aspect ratio
            .attr("fill", "none")
            .attr("stroke", "var(--text-primary)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4,4");

        if (clsType === 'SVC') {
             const margins = d3.contours().size([50, 50]).thresholds([-1, 1])(Z);
             backgroundGroup.selectAll(".margin").data(margins).join("path")
                .attr("class", "margin")
                .attr("d", pathGen)
                .attr("transform", `scale(1, ${height/width})`)
                .attr("fill", "none")
                .attr("stroke", "var(--text-secondary)")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "2,2");
        }
    }

    classifierSelect.addEventListener("change", trainAndDrawBoundary);
    svmCSlider.addEventListener("input", trainAndDrawBoundary);
    clearBtn.addEventListener("click", () => {
        points = [];
        backgroundGroup.selectAll("*").remove();
        accuracyDisplay.textContent = "";
        drawPoints();
    });

    const resizeObserver = new ResizeObserver(() => {
        // setupChart(); // Re-setup if resizing needed, simplified here
    });
    resizeObserver.observe(plotContainer);

    drawPoints();
    trainAndDrawBoundary();
}
