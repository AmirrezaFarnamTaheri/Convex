/**
 * Widget: Classification Boundary Visualizer
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initClassificationBoundaryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="classification-boundary-widget">
            <div class="widget-controls">
                <div>
                    <label>Classifier:</label>
                    <select id="classifier-select">
                        <option value="LogisticRegression">Logistic Regression</option>
                        <option value="SVC">SVM (RBF Kernel)</option>
                    </select>
                </div>
                <div>
                    <label>Add Points for:</label>
                    <select id="class-select">
                        <option value="0">Class 0</option>
                        <option value="1">Class 1</option>
                    </select>
                </div>
                <button id="clear-boundary-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to add data points. The boundary will update automatically.</p>
        </div>
    `;

    const classifierSelect = container.querySelector("#classifier-select");
    const classSelect = container.querySelector("#class-select");
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
        .attr("width", "100%").attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const backgroundGroup = svg.append("g");
    const pointsGroup = svg.append("g");
    const colors = ["var(--color-primary)", "var(--color-accent)"];

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push({ x: x.invert(mx), y: y.invert(my), class: +classSelect.value });
            drawPoints();
            trainAndDrawBoundary();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
import numpy as np
import json

def get_boundary(points_data, classifier_type, domain_x, domain_y, grid_size=50):
    if len(points_data) < 2: return None

    X = np.array([[p['x'], p['y']] for p in points_data])
    y = np.array([p['class'] for p in points_data])

    # Check if we have both classes
    if len(np.unique(y)) < 2: return None

    model_map = {"LogisticRegression": LogisticRegression(), "SVC": SVC(gamma='auto')}
    model = model_map.get(classifier_type, LogisticRegression())
    model.fit(X, y)

    xx, yy = np.meshgrid(np.linspace(domain_x[0], domain_x[1], grid_size),
                         np.linspace(domain_y[0], domain_y[1], grid_size))

    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    return json.dumps(Z.reshape(xx.shape).tolist())
`;
    await pyodide.runPythonAsync(pythonCode);
    const get_boundary = pyodide.globals.get('get_boundary');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", d => colors[d.class]);
    }

    async function trainAndDrawBoundary() {
        const boundary_json = await get_boundary(points, classifierSelect.value, x.domain(), y.domain());
        if (!boundary_json) return;
        const Z = JSON.parse(boundary_json);

        const color = d3.scaleOrdinal(["var(--color-primary-light)", "var(--color-accent-light)"]);
        const contours = d3.contours().size([50, 50]).thresholds([0.5])(Z.flat());

        backgroundGroup.selectAll("path").data(contours).join("path")
            .attr("d", d3.geoPath().transform({ scale: [width / 49, height / 49] }))
            .attr("fill", d => color(d.value)).attr("opacity", 0.5);
    }

    classifierSelect.addEventListener("change", trainAndDrawBoundary);
    clearBtn.addEventListener("click", () => {
        points = [];
        backgroundGroup.selectAll("*").remove();
        drawPoints();
    });

    drawPoints();
    trainAndDrawBoundary();
}
