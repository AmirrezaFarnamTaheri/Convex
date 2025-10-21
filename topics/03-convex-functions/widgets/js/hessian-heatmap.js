/**
 * Widget: Hessian Minimum Eigenvalue Heatmap
 *
 * Description: Visualizes the minimum eigenvalue of the Hessian for various functions.
 *              For a 2D function, convexity requires the Hessian to be positive semidefinite
 *              everywhere, which means its minimum eigenvalue must be non-negative.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initHessianHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="hessian-heatmap-widget">
            <div id="plot-container" style="width: 100%; height: 400px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="heatmap-function-select">Function f(x,y):</label>
                <select id="heatmap-function-select"></select>
                <div id="legend" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;

    const select = container.querySelector("#heatmap-function-select");
    const plotContainer = container.querySelector("#plot-container");
    const legendContainer = container.querySelector("#legend");

    const functions = {
        "x² + y² (Convex)": {
            func: (x, y) => x**2 + y**2,
            hessian_min_eig: (x, y) => 2
        },
        "x⁴ + y⁴ (Convex)": {
            func: (x, y) => x**4 + y**4,
            hessian_min_eig: (x, y) => Math.min(12 * x**2, 12 * y**2)
        },
        "x³ + y³ (Non-Convex)": {
            func: (x, y) => x**3 + y**3,
            hessian_min_eig: (x, y) => Math.min(6 * x, 6 * y)
        },
        "-exp(-(x² + y²)) (Non-Convex)": {
            func: (x, y) => -Math.exp(-(x**2 + y**2)),
            hessian_min_eig: (x, y) => {
                const e = Math.exp(-(x**2 + y**2));
                const H00 = e * (4*x**2 - 2);
                const H11 = e * (4*y**2 - 2);
                const H01 = e * (4*x*y);
                const trace = H00 + H11;
                const det = H00 * H11 - H01 * H01;
                return (trace - Math.sqrt(Math.max(0, trace**2 - 4 * det))) / 2;
            }
        },
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    Object.keys(functions).forEach(name => {
        select.innerHTML += `<option value="${name}">${name}</option>`;
    });

    let svg;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const colorScale = d3.scaleDiverging([-5, 0, 5], d3.interpolatePiYG);

        drawLegend(colorScale);
        draw(colorScale);
    }

    function draw(colorScale) {
        const gridSize = 50;
        const range = 2;
        const domain = d3.range(-range, range, 2 * range / gridSize);

        const minEigs = domain.flatMap(y => domain.map(x => selectedFunc.hessian_min_eig(x, y)));
        const funcVals = domain.flatMap(y => domain.map(x => selectedFunc.func(x, y)));

        const cellSize = (x,y) => (y(domain[1]) - y(domain[0])) / (gridSize-1);

        svg.selectAll("*").remove(); // Clear previous

        svg.append("g").selectAll("rect")
            .data(minEigs).enter().append("rect")
            .attr("x", (d, i) => (i % gridSize) * svg.attr("width") / gridSize)
            .attr("y", (d, i) => Math.floor(i / gridSize) * svg.attr("height") / gridSize)
            .attr("width", svg.attr("width") / gridSize)
            .attr("height", svg.attr("height") / gridSize)
            .attr("fill", d => colorScale(d))
            .append("title").text(d => `Min Eigenvalue: ${d.toFixed(2)}`);

        const contours = d3.contours().size([gridSize, gridSize]).thresholds(10)(funcVals);
        svg.append("g").selectAll("path").data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity().scale(svg.attr("width") / gridSize)))
            .attr("fill", "none").attr("stroke", "white").attr("stroke-opacity", 0.6);
    }

    function drawLegend(colorScale) {
        legendContainer.innerHTML = `
            <span>Min Eigenvalue of Hessian:</span>
            <span style="color: ${colorScale(-5)};">Negative</span> & Gradient & <span style="color: ${colorScale(5)};">Positive</span>
        `;
    }

    select.onchange = () => {
        selectedFunc = functions[select.value];
        setupChart();
    };
    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
}
