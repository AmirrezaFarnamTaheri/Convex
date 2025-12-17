/**
 * Widget: Least Squares Playground with Regularization
 *
 * Description: An interactive tool to explore polynomial regression and the effects of L1 (Lasso)
 *              and L2 (Ridge) regularization on overfitting.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "/static/js/pyodide-manager.js";

export async function initLeastSquaresRegularization(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Data Science Engine (Pyodide)...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
            <div id="plot-container" style="width: 100%; height: 400px; cursor: crosshair;"></div>
            <div class="widget-controls" style="padding: 15px;">
                 <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div>
                        <label class="widget-label">Polynomial Degree: <span id="degree-val">3</span></label>
                        <input type="range" id="degree-slider" min="1" max="15" value="3" class="widget-slider">
                    </div>
                    <div>
                        <label class="widget-label">Regularization</label>
                        <select id="reg-type-select" class="widget-select">
                            <option value="None">None (OLS)</option>
                            <option value="L2">Ridge (L2 Penalty)</option>
                            <option value="L1">Lasso (L1 Penalty)</option>
                        </select>
                    </div>
                    <div id="lambda-control" style="display:none;">
                        <label class="widget-label">Lambda (λ): <span id="lambda-val">0.1</span></label>
                        <input type="range" id="lambda-slider" min="0" max="5" step="0.1" value="0.1" class="widget-slider">
                    </div>
                </div>

                <div style="display:flex; gap:8px; margin-top:16px;">
                    <button id="clear-points-btn" class="widget-btn">Clear Points</button>
                    <button id="add-noise-btn" class="widget-btn primary">Add Noisy Sine Data</button>
                </div>

                <div class="widget-output" id="error-display" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const errorDisplay = container.querySelector("#error-display");
    const degreeSlider = container.querySelector("#degree-slider");
    const degreeVal = container.querySelector("#degree-val");
    const regTypeSelect = container.querySelector("#reg-type-select");
    const lambdaControl = container.querySelector("#lambda-control");
    const lambdaSlider = container.querySelector("#lambda-slider");
    const lambdaVal = container.querySelector("#lambda-val");
    const clearBtn = container.querySelector("#clear-points-btn");
    const addNoiseBtn = container.querySelector("#add-noise-btn");
    const plotContainer = container.querySelector("#plot-container");

    let points = [];
    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        y = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        // Grid
        svg.append("g").attr("class", "grid-line").call(d3.axisBottom(x).tickSize(-height).tickFormat("")).attr("opacity", 0.1);
        svg.append("g").attr("class", "grid-line").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).attr("opacity", 0.1);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("g").attr("class", "points-group");

        // Path for ground truth (if using synthetic data)
        svg.append("path").attr("class", "ground-truth").attr("fill", "none").attr("stroke", "var(--text-tertiary)").attr("stroke-width", 1).attr("stroke-dasharray", "4,4").style("opacity", 0.5);

        // Path for prediction
        svg.append("path").attr("class", "regression-line").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 3);

        svg.append("rect").attr("width", width).attr("height", height).style("fill", "transparent").style("pointer-events", "all")
            .on("click", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                points.push({ x: x.invert(mx), y: y.invert(my) });
                drawPoints();
                updateRegression();
            });
    }

    const pythonCode = `
        from sklearn.linear_model import LinearRegression, Lasso, Ridge
        from sklearn.preprocessing import PolynomialFeatures
        from sklearn.pipeline import make_pipeline
        from sklearn.metrics import mean_squared_error
        import numpy as np

        def fit_model(points_data, degree, reg_type, lambda_val):
            if not points_data or len(points_data) < 2:
                return {"line": None, "train_error": 0}

            X_train = np.array([p['x'] for p in points_data]).reshape(-1, 1)
            y_train = np.array([p['y'] for p in points_data])

            # Use more lambda range for python
            alpha = lambda_val if lambda_val > 1e-4 else 1e-4

            if reg_type == "None":
                model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
            else:
                model_class = Lasso if reg_type == 'L1' else Ridge
                model = make_pipeline(PolynomialFeatures(degree), model_class(alpha=alpha, max_iter=50000, tol=1e-3))

            try:
                model.fit(X_train, y_train)
                line_x = np.linspace(-5, 5, 200).reshape(-1, 1)
                line_y = model.predict(line_x)

                train_error = mean_squared_error(y_train, model.predict(X_train))

                return {
                    "line": np.column_stack((line_x.flatten(), line_y)).tolist(),
                    "train_error": train_error,
                    "coeffs": model.named_steps[model_class.__name__.lower() if reg_type != 'None' else 'linearregression'].coef_.tolist() if reg_type != 'None' else [] # simplified coeff extraction
                }
            except Exception as e:
                return {"line": None, "train_error": 0}
    `;
    await pyodide.runPythonAsync(pythonCode);
    const fit_model = pyodide.globals.get('fit_model');

    function drawPoints() {
        if (!svg) return;
        svg.select(".points-group").selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "var(--color-primary)")
            .attr("stroke", "var(--bg-surface-1)").attr("stroke-width", 1);
    }

    async function updateRegression() {
        const degree = +degreeSlider.value;
        const regType = regTypeSelect.value;
        const lambda = +lambdaSlider.value;

        degreeVal.textContent = degree;
        lambdaVal.textContent = lambda.toFixed(2);
        lambdaControl.style.display = (regType === 'None') ? 'none' : 'block';

        if (points.length < 2) {
            svg.select(".regression-line").attr("d", null);
            errorDisplay.textContent = "Add at least 2 points.";
            return;
        }

        const result = await fit_model(points.map(p => ({x:p.x, y:p.y})), degree, regType, lambda).then(r => r.toJs({create_proxies: false}));

        if (result && result.line) {
            svg.select(".regression-line")
                .transition().duration(200)
                .attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])));
        }

        errorDisplay.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span><strong>Training MSE:</strong> ${result.train_error.toFixed(4)}</span>
                <span style="font-size:0.8rem; color:var(--text-secondary);">${regType === 'L1' ? 'Lasso promotes sparsity.' : (regType === 'L2' ? 'Ridge shrinks coefficients.' : 'OLS minimizes training error.')}</span>
            </div>
        `;
    }

    function generateSineData() {
        points = [];
        for (let i = -4.5; i <= 4.5; i += 0.5) {
            points.push({ x: i, y: Math.sin(i) * 2 + (Math.random() - 0.5) * 1.5 });
        }

        // Draw true sine for reference
        const sineData = d3.range(-5, 5.1, 0.1).map(val => ({x: val, y: Math.sin(val) * 2}));
        svg.select(".ground-truth").datum(sineData).attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)));

        drawPoints();
        updateRegression();
    }

    const setupAndUpdate = () => {
        setupChart();
        drawPoints();
        if (points.length > 0) updateRegression();
    };

    degreeSlider.oninput = updateRegression;
    regTypeSelect.onchange = updateRegression;
    lambdaSlider.oninput = updateRegression;

    clearBtn.onclick = () => {
        points = [];
        svg.select(".ground-truth").attr("d", null);
        drawPoints();
        updateRegression();
    };

    addNoiseBtn.onclick = generateSineData;

    new ResizeObserver(setupAndUpdate).observe(plotContainer);
    setupAndUpdate();

    // Initial data
    generateSineData();
}
