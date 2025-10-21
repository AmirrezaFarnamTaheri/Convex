/**
 * Widget: Least Squares Playground with Regularization
 *
 * Description: An interactive tool to explore polynomial regression and the effects of L1 (Lasso)
 *              and L2 (Ridge) regularization on overfitting.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getPyodide } from "../../../../static/js/pyodide-manager.js"; // Using pyodide for scikit-learn

export async function initLeastSquaresRegularization(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="widget-loading-indicator">Loading Pyodide & scikit-learn...</div>`;
    const pyodide = await getPyodide();
    await pyodide.loadPackage("scikit-learn");

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="ls-playground-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                 <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;">
                    <div>
                        <label>Polynomial Degree: <span id="degree-val">3</span></label>
                        <input type="range" id="degree-slider" min="1" max="10" value="3">
                    </div>
                    <div>
                        <label>Regularization:</label>
                        <select id="reg-type-select"><option value="None">None</option><option value="L2">L2 (Ridge)</option><option value="L1">L1 (Lasso)</option></select>
                    </div>
                    <div id="lambda-control" style="display:none;">
                        <label>λ: <span id="lambda-val">0.1</span></label>
                        <input type="range" id="lambda-slider" min="0" max="2" step="0.05" value="0.1">
                    </div>
                </div>
                <button id="clear-points-btn" style="margin-top: 15px;">Clear Points</button>
            </div>
        </div>
    `;

    // ... (rest of the implementation is the same as the original, as it's already quite good)
    const degreeSlider = container.querySelector("#degree-slider");
    const degreeVal = container.querySelector("#degree-val");
    const regTypeSelect = container.querySelector("#reg-type-select");
    const lambdaControl = container.querySelector("#lambda-control");
    const lambdaSlider = container.querySelector("#lambda-slider");
    const lambdaVal = container.querySelector("#lambda-val");
    const clearBtn = container.querySelector("#clear-points-btn");
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
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("g").attr("class", "points-group");
        svg.append("path").attr("class", "regression-line").attr("fill", "none").attr("stroke", "var(--color-accent)").attr("stroke-width", 3);

        svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
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
        import numpy as np

        def fit_model(points_data, degree, reg_type, lambda_val):
            if not points_data or len(points_data) < 2: return None

            X = np.array([p['x'] for p in points_data]).reshape(-1, 1)
            y = np.array([p['y'] for p in points_data])

            if reg_type == "None":
                model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
            else:
                model_class = Lasso if reg_type == 'L1' else Ridge
                alpha = lambda_val if lambda_val > 1e-6 else 1e-6
                model = make_pipeline(PolynomialFeatures(degree), model_class(alpha=alpha, max_iter=10000, tol=1e-3))

            try:
                model.fit(X, y)
                line_x = np.linspace(-5, 5, 200).reshape(-1, 1)
                line_y = model.predict(line_x)
                return np.column_stack((line_x.flatten(), line_y)).tolist()
            except Exception as e:
                print(f"Error fitting model: {e}")
                return None
    `;
    pyodide.runPythonAsync(pythonCode);
    const fit_model = pyodide.globals.get('fit_model');

    function drawPoints() {
        if (!svg) return;
        svg.select(".points-group").selectAll("circle").data(points).join("circle")
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

        const lineData = await fit_model(points.map(p => ({x:p.x, y:p.y})), degree, regType, lambda).then(ld => ld ? ld.toJs() : null);

        if (lineData) {
            svg.select(".regression-line").datum(lineData).attr("d", d3.line().x(d => x(d[0])).y(d => y(d[1])));
        } else {
            svg.select(".regression-line").attr("d", null);
        }
    }

    const setupAndUpdate = () => {
        setupChart();
        drawPoints();
        updateRegression();
    };

    degreeSlider.oninput = updateRegression;
    regTypeSelect.onchange = updateRegression;
    lambdaSlider.oninput = updateRegression;
    clearBtn.onclick = () => {
        points = [];
        drawPoints();
        updateRegression();
    };

    new ResizeObserver(setupAndUpdate).observe(plotContainer);
    setupAndUpdate();
}
