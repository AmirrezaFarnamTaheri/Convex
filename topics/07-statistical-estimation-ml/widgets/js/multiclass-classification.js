/**
 * Widget: Multi-class Classification
 *
 * Description: Shows decision boundaries for one-vs-all or softmax classification on a multi-class dataset.
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initMultiClass(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="multiclass-widget">
            <div class="widget-controls">
                <label>Strategy:</label>
                <select id="mc-model-select">
                    <option value="ovr">One-vs-Rest (OvR)</option>
                    <option value="multinomial">Softmax (Multinomial)</option>
                </select>
                <label>Add Class:</label>
                <select id="mc-class-select"></select>
                <button id="mc-reset-btn">Reset Points</button>
            </div>
            <div id="plot-container"></div>
        </div>
    `;

    const modelSelect = container.querySelector("#mc-model-select");
    const classSelect = container.querySelector("#mc-class-select");
    const resetBtn = container.querySelector("#mc-reset-btn");
    const plotContainer = container.querySelector("#plot-container");

    const n_classes = 4;
    for(let i=0; i<n_classes; i++) {
        classSelect.innerHTML += `<option value="${i}">Class ${i}</option>`;
    }

    let points = [];
    const colors = d3.schemeTableau10;

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = plotContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(plotContainer).append("svg")
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-8, 8]).range([0, width]);
    const y = d3.scaleLinear().domain([-8, 8]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const backgroundGroup = svg.append("g");
    const pointsGroup = svg.append("g");

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push({ x: x.invert(mx), y: y.invert(my), class: +classSelect.value });
            drawPoints();
            updateBoundary();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
import numpy as np
from sklearn.linear_model import LogisticRegression
import json

def get_multiclass_boundary(points, model_type, domain_x, domain_y, grid_size=50):
    if len(points) < 2 or len(np.unique([p['class'] for p in points])) < 2:
        return None

    X = np.array([[p['x'], p['y']] for p in points])
    y = np.array([p['class'] for p in points])

    clf = LogisticRegression(multi_class=model_type, solver='lbfgs', C=1)
    clf.fit(X, y)

    xx, yy = np.meshgrid(np.linspace(domain_x[0], domain_x[1], grid_size),
                         np.linspace(domain_y[0], domain_y[1], grid_size))

    Z = clf.predict(np.c_[xx.ravel(), yy.ravel()])
    return json.dumps(Z.reshape(xx.shape).tolist())
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_multiclass_boundary = pyodide.globals.get('get_multiclass_boundary');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d=>x(d.x)).attr("cy", d=>y(d.y)).attr("r", 5)
            .attr("fill", d=>colors[d.class]);
    }

    async function updateBoundary() {
        const model_type = modelSelect.value;
        const boundary_json = await get_multiclass_boundary(points, model_type, x.domain(), y.domain());
        if (!boundary_json) return;
        const Z = JSON.parse(boundary_json);

        // This approach is more robust for showing decision regions
        backgroundGroup.selectAll("image").remove();
        const canvas = document.createElement("canvas");
        canvas.width = 50;
        canvas.height = 50;
        const context = canvas.getContext("2d");
        const imageData = context.createImageData(50, 50);
        for (let j = 0, k = 0; j < 50; ++j) {
            for (let i = 0; i < 50; ++i, ++k) {
                const c = d3.rgb(colors[Z[j][i]]);
                imageData.data[k * 4] = c.r;
                imageData.data[k * 4 + 1] = c.g;
                imageData.data[k * 4 + 2] = c.b;
                imageData.data[k * 4 + 3] = 128; // Opacity
            }
        }
        context.putImageData(imageData, 0, 0);

        backgroundGroup.append("image")
            .attr("width", width).attr("height", height)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", canvas.toDataURL());
    }

    resetBtn.addEventListener("click", () => {
        points = [];
        drawPoints();
        backgroundGroup.selectAll("*").remove();
    });
    modelSelect.addEventListener("change", updateBoundary);

    // Initial random data
    pyodide.runPythonAsync('make_blobs(n_samples=100, centers=4, random_state=1, cluster_std=1.5)').then(data => {
        const [X, y] = data.toJs();
        points = X.map((p, i) => ({x: p[0], y: p[1], class: y[i]}));
        drawPoints();
        updateBoundary();
    });
}
