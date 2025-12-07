/**
 * Widget: Robust Regression vs. Least Squares
 *
 * Description: Compares standard least squares with a robust method (Huber regression)
 *              to show how the latter is less sensitive to outliers.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initRobustRegression(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="robust-regression-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <p class="widget-instructions">Click to add points. Try adding outliers far from the main trend.</p>
                <button id="clear-rr-btn">Clear Points</button>
                <div id="huber-delta-control">
                    <label>Huber Delta: <span id="huber-delta-val">1.0</span></label>
                    <input type="range" id="huber-delta-slider" min="0.1" max="3" step="0.1" value="1">
                </div>
                <div class="legend" style="margin-top: 10px;">
                    <span style="color:var(--color-primary); font-weight:bold;">●</span> Data Points |
                    <span style="color:var(--color-danger); margin-left: 10px; font-weight:bold;">―</span> Least Squares |
                    <span style="color:var(--color-success); margin-left: 10px; font-weight:bold;">―</span> Huber (Robust) |
                    <span style="color:var(--color-accent); margin-left: 10px; font-weight:bold;">―</span> RANSAC
                </div>
                 <div id="residuals-display"></div>
            </div>
        </div>
    `;

    const clearBtn = container.querySelector("#clear-rr-btn");
    const huberDeltaSlider = container.querySelector("#huber-delta-slider");
    const huberDeltaVal = container.querySelector("#huber-delta-val");
    const residualsDisplay = container.querySelector("#residuals-display");
    const plotContainer = container.querySelector("#plot-container");

    let points = [ {x: -3, y: -2.5}, {x: -2, y: -1.5}, {x: -1, y: -0.5}, {x: 0, y: 0.5}, {x: 1, y: 1.5}, {x: 2, y: 2.5} ];
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
        svg.append("path").attr("class", "ls-line").attr("stroke", "var(--color-danger)").attr("stroke-width", 2.5).attr("fill", "none");
        svg.append("path").attr("class", "huber-line").attr("stroke", "var(--color-success)").attr("stroke-width", 2.5).attr("fill", "none");
        svg.append("path").attr("class", "ransac-line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2.5).attr("fill", "none");

        svg.append("rect").attr("width", width).attr("height", height).style("fill", "none").style("pointer-events", "all")
            .on("click", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                points.push({ x: x.invert(mx), y: y.invert(my) });
                update();
            });
    }

    // --- JS REGRESSION IMPLEMENTATIONS ---
    function leastSquares(data) {
        if (data.length < 2) return null;
        const sumX = d3.sum(data, d => d.x);
        const sumY = d3.sum(data, d => d.y);
        const sumXY = d3.sum(data, d => d.x * d.y);
        const sumX2 = d3.sum(data, d => d.x * d.x);
        const n = data.length;

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;
        return { m, b };
    }

    function huberRegression(data, delta = 1.0, max_iter=100, tol=1e-4) {
        if (data.length < 2) return null;
        let { m, b } = leastSquares(data); // Start with LS solution

        for (let i = 0; i < max_iter; i++) {
            let weights = data.map(d => {
                const residual = Math.abs(d.y - (m * d.x + b));
                return residual < delta ? 1 : delta / residual;
            });

            const sumW = d3.sum(weights);
            const sumWX = d3.sum(data, (d, j) => weights[j] * d.x);
            const sumWY = d3.sum(data, (d, j) => weights[j] * d.y);
            const sumWXY = d3.sum(data, (d, j) => weights[j] * d.x * d.y);
            const sumWX2 = d3.sum(data, (d, j) => weights[j] * d.x * d.x);

            const new_m = (sumW * sumWXY - sumWX * sumWY) / (sumW * sumWX2 - sumWX * sumWX);
            const new_b = (sumWY - new_m * sumWX) / sumW;

            if (Math.abs(new_m - m) < tol && Math.abs(new_b - b) < tol) break;
            m = new_m; b = new_b;
        }
        return { m, b };
    }

    function ransac(data, n=2, k=10, t=1, d=Math.floor(data.length*0.6)) {
        if (data.length < 2) return null;
        let best_model = null;
        let best_inliers = [];

        for(let i=0; i<k; i++) {
            const sample = d3.shuffle(data.slice()).slice(0, n);
            const model = leastSquares(sample);
            if(!model) continue;

            const inliers = data.filter(p => Math.abs(p.y - (model.m*p.x + model.b)) < t);
            if (inliers.length > best_inliers.length) {
                best_inliers = inliers;
                best_model = model;
            }
        }
        return leastSquares(best_inliers);
    }

    function update() {
        huberDeltaVal.textContent = (+huberDeltaSlider.value).toFixed(1);
        svg.select(".points-group").selectAll("circle").data(points).join("circle")
            .attr("cx", d => x(d.x)).attr("cy", d => y(d.y))
            .attr("r", 5).attr("fill", "var(--color-primary)");

        const ls_params = leastSquares(points);
        const huber_params = huberRegression(points, +huberDeltaSlider.value);
        const ransac_params = ransac(points);

        const lineGenerator = (params) => {
            if (!params) return null;
            const [x1, x2] = x.domain();
            return d3.line()([[x1, params.m * x1 + params.b], [x2, params.m * x2 + params.b]]);
        };
        const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

        svg.select(".ls-line").datum(ls_params).transition().duration(200).attr("d", d => line(lineGenerator(d)));
        svg.select(".huber-line").datum(huber_params).transition().duration(200).attr("d", d => line(lineGenerator(d)));
        svg.select(".ransac-line").datum(ransac_params).transition().duration(200).attr("d", d => line(lineGenerator(d)));

        const mse = (data, model) => d3.mean(data, p => (p.y - (model.m*p.x + model.b))**2);
        residualsDisplay.innerHTML = `<strong>Mean Squared Error:</strong><br>
            LS: ${mse(points, ls_params).toFixed(3)} |
            Huber: ${mse(points, huber_params).toFixed(3)} |
            RANSAC: ${mse(points, ransac_params).toFixed(3)}`;
    }

    clearBtn.onclick = () => {
        points = [];
        update();
    };

    huberDeltaSlider.oninput = update;
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
