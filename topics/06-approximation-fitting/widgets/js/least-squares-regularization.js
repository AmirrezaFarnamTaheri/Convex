/**
 * Widget: Least Squares Playground and Regularization Path Explorer
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs";

async function initPyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage(["numpy", "scikit-learn"]);
    return pyodide;
}

const pyodidePromise = initPyodide();

export async function initLeastSquaresPlayground(containerId) {
    const container = document.getElementById(containerId);
    if (!container) { console.error(`Container #${containerId} not found.`); return; }

    let points = [];
    let degree = 1;
    let regularizationType = "L2";
    let lambda = 0.1;

    // --- UI CONTROLS ---
    const controls = document.createElement("div");
    controls.style.cssText = "padding: 10px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;";

    const degreeSlider = document.createElement("input");
    degreeSlider.type = "range";
    degreeSlider.min = 1;
    degreeSlider.max = 5;
    degreeSlider.value = degree;
    degreeSlider.oninput = () => { degree = parseInt(degreeSlider.value); updateRegression(); };

    const regTypeSelect = document.createElement("select");
    regTypeSelect.innerHTML = `<option value="L2">L2 (Ridge)</option><option value="L1">L1 (Lasso)</option>`;
    regTypeSelect.onchange = () => { regularizationType = regTypeSelect.value; updateRegression(); };

    const lambdaSlider = document.createElement("input");
    lambdaSlider.type = "range";
    lambdaSlider.min = 0;
    lambdaSlider.max = 1;
    lambdaSlider.step = 0.01;
    lambdaSlider.value = lambda;
    lambdaSlider.oninput = () => { lambda = parseFloat(lambdaSlider.value); updateRegression(); };

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.onclick = reset;

    controls.append("Degree:", degreeSlider, "Regularization:", regTypeSelect, "Lambda:", lambdaSlider, clearButton);
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

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const pointsGroup = svg.append("g");
    const regressionLine = svg.append("path").attr("fill", "none").attr("stroke", "red").attr("stroke-width", 2);

     svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event);
            points.push({ x: x.invert(mx), y: y.invert(my) });
            drawPoints();
            updateRegression();
        });

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "blue");
    }

    function reset() {
        points = [];
        regressionLine.attr("d", null);
        drawPoints();
    }

    async function updateRegression() {
        if (points.length < degree + 1) {
            regressionLine.attr("d", null);
            return;
        }

        const pyodide = await pyodidePromise;
        const model = regularizationType === "L1" ? "Lasso" : "Ridge";
        await pyodide.globals.set("points_data", points);
        await pyodide.globals.set("degree", degree);
        await pyodide.globals.set("lambda", lambda);
        await pyodide.globals.set("model_name", model);
        const code = `
from sklearn.linear_model import Lasso, Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
import numpy as np

X = np.array([p['x'] for p in points_data]).reshape(-1, 1)
y = np.array([p['y'] for p in points_data])

model_class = Lasso if model_name == 'Lasso' else Ridge
# Use a small alpha for Lasso if lambda is 0 to avoid warnings
alpha = lambda if model_name == 'Ridge' or lambda > 0 else 1e-10

model = make_pipeline(PolynomialFeatures(degree), model_class(alpha=alpha))
model.fit(X, y)

line_x = np.linspace(-5, 5, 100).reshape(-1, 1)
line_y = model.predict(line_x)
np.column_stack((line_x.flatten(), line_y)).tolist()
        `;
        const lineData = await pyodide.runPythonAsync(code).then(ld => ld.toJs());

        const lineGenerator = d3.line().x(d => x(d[0])).y(d => y(d[1]));
        regressionLine.datum(lineData).attr("d", lineGenerator);
    }
}
