/**
 * Widget: Least Squares Playground and Regularization Path Explorer
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js";

export async function initLeastSquaresPlayground(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="ls-playground-widget">
            <div class="widget-controls">
                <div>
                    <label>Polynomial Degree: <span id="degree-val">1</span></label>
                    <input type="range" id="degree-slider" min="1" max="8" value="1">
                </div>
                <div>
                    <label>Regularization:</label>
                    <select id="reg-type-select">
                        <option value="None">None</option>
                        <option value="L2">L2 (Ridge)</option>
                        <option value="L1">L1 (Lasso)</option>
                    </select>
                </div>
                <div id="lambda-control">
                    <label>λ (lambda): <span id="lambda-val">0.1</span></label>
                    <input type="range" id="lambda-slider" min="0" max="2" step="0.05" value="0.1">
                </div>
                <button id="clear-points-btn">Clear Points</button>
            </div>
            <div id="plot-container"></div>
            <p class="widget-instructions">Click on the plot to add data points.</p>
        </div>
    `;

    const degreeSlider = container.querySelector("#degree-slider");
    const degreeVal = container.querySelector("#degree-val");
    const regTypeSelect = container.querySelector("#reg-type-select");
    const lambdaControl = container.querySelector("#lambda-control");
    const lambdaSlider = container.querySelector("#lambda-slider");
    const lambdaVal = container.querySelector("#lambda-val");
    const clearBtn = container.querySelector("#clear-points-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [];

    const margin = {top: 20, right: 20, bottom: 40, left: 50};
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

    const pointsGroup = svg.append("g");
    const regressionLine = svg.append("path").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 3);

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
        .on("click", (event) => {
            const [mx, my] = d3.pointer(event, svg.node());
            points.push({ x: x.invert(mx), y: y.invert(my) });
            drawPoints();
            updateRegression();
        });

    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");
    const pythonCode = `
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
import numpy as np

def fit_model(points_data, degree, reg_type, lambda_val):
    if not points_data or len(points_data) < degree + 1:
        return None

    X = np.array([p['x'] for p in points_data]).reshape(-1, 1)
    y = np.array([p['y'] for p in points_data])

    if reg_type == "None":
        model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
    else:
        model_class = Lasso if reg_type == 'L1' else Ridge
        alpha = lambda_val if lambda_val > 0 else 1e-10
        model = make_pipeline(PolynomialFeatures(degree), model_class(alpha=alpha, max_iter=10000))

    model.fit(X, y)

    line_x = np.linspace(-5, 5, 200).reshape(-1, 1)
    line_y = model.predict(line_x)
    return np.column_stack((line_x.flatten(), line_y)).tolist()
`;
    await pyodide.runPythonAsync(pythonCode);
    const fit_model = pyodide.globals.get('fit_model');

    function drawPoints() {
        pointsGroup.selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "var(--color-primary)");
    }

    async function updateRegression() {
        const degree = +degreeSlider.value;
        const regType = regTypeSelect.value;
        const lambda = +lambdaSlider.value;

        degreeVal.textContent = degree;
        lambdaVal.textContent = lambda.toFixed(2);
        lambdaControl.style.display = (regType === 'None') ? 'none' : 'block';

        const lineData = await fit_model(points, degree, regType, lambda).then(ld => ld ? ld.toJs() : null);

        if (lineData) {
            regressionLine.datum(lineData).attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])));
        } else {
            regressionLine.attr("d", null);
        }
    }

    degreeSlider.addEventListener("input", updateRegression);
    regTypeSelect.addEventListener("change", updateRegression);
    lambdaSlider.addEventListener("input", updateRegression);
    clearBtn.addEventListener("click", () => {
        points = [];
        drawPoints();
        updateRegression();
    });

    updateRegression();
}
