/**
 * Widget: Classification Boundary Visualizer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

const pyodidePromise = getPyodide();

export async function initClassificationBoundaryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    let points = [];
    let currentClass = 0;
    let classifierType = "LogisticRegression";

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;";

    const classSelector = document.createElement("select");
    classSelector.innerHTML = `<option value="0">Class 0</option><option value="1">Class 1</option>`;
    classSelector.addEventListener("change", () => currentClass = parseInt(classSelector.value));

    const classifierSelector = document.createElement("select");
    classifierSelector.innerHTML = `<option value="LogisticRegression">Logistic Regression</option><option value="SVM">SVM</option>`;
    classifierSelector.addEventListener("change", () => classifierType = classifierSelector.value);

    const trainButton = document.createElement("button");
    trainButton.textContent = "Train & Visualize";
    trainButton.addEventListener("click", trainAndDrawBoundary);

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.addEventListener("click", reset);

    controls.append("Add points for:", classSelector, "Classifier:", classifierSelector, trainButton, resetButton);
    container.appendChild(controls);

    // --- D3.js PLOT ---
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    const y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

    const backgroundGroup = svg.append("g");
    const pointsGroup = svg.append("g");

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event);
            points.push({ x: x.invert(mx), y: y.invert(my), class: currentClass });
            drawPoints();
        });

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", d => d.class === 0 ? "blue" : "orange");
    }

    function reset() {
        points = [];
        backgroundGroup.selectAll("*").remove();
        drawPoints();
    }

    async function trainAndDrawBoundary() {
        if (points.length < 2) return;

        const pyodide = await pyodidePromise;
        await pyodide.globals.set("points_data", points);
        await pyodide.globals.set("classifier_type", classifierType);
        const classifierCode = `
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
import numpy as np

X = np.array([[p['x'], p['y']] for p in points_data])
y = np.array([p['class'] for p in points_data])

model = LogisticRegression() if classifier_type == 'LogisticRegression' else SVC()
model.fit(X, y)

xx, yy = np.meshgrid(np.linspace(-5, 5, 50), np.linspace(-5, 5, 50))
Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)
Z.tolist()
        `;

        const Z = await pyodide.runPythonAsync(classifierCode).then(z => z.toJs());
        const color = d3.scaleOrdinal(["lightblue", "moccasin"]);

        const contours = d3.contours()
            .size([50, 50])
            .thresholds([0.5])
            (Z.flat());

        backgroundGroup.selectAll("path").remove();
        backgroundGroup.selectAll("path")
            .data(contours)
            .join("path")
            .attr("d", d3.geoPath().transform({
                scale: [width / 49, height / 49], // scale factor adjusted for grid size
                translate: [0, 0]
            }))
            .attr("fill", d => color(d.value));
    }

    reset();
}
