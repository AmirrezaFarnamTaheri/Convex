/**
 * Widget: Tangent Line Explorer
 *
 * Description: Demonstrates the first-order condition for convexity: f(y) >= f(x) + f'(x)(y-x).
 *              The tangent line at any point on a convex function is a global underestimator.
 * Version: 2.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initTangentLineExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="tangent-explorer-widget">
            <div id="plot-container" style="width: 100%; height: 350px;"></div>
            <div class="widget-controls" style="padding: 15px;">
                <label for="tangent-func-select">Function:</label>
                <select id="tangent-func-select"></select>
                <div id="inequality-text" class="widget-output" style="margin-top: 10px; min-height: 4em;"></div>
            </div>
        </div>
    `;

    const funcSelect = container.querySelector("#tangent-func-select");
    const plotContainer = container.querySelector("#plot-container");
    const inequalityText = container.querySelector("#inequality-text");

    const functions = {
        "x² (Convex)": { func: x => x**2, grad: x => 2*x, domain: [-5, 5] },
        "eˣ (Convex)": { func: x => Math.exp(x), grad: x => Math.exp(x), domain: [-3, 3] },
        "x³ (Non-Convex)": { func: x => x**3, grad: x => 3*x**2, domain: [-3, 3] },
        "cos(x) (Non-Convex)": { func: x => Math.cos(x), grad: x => -Math.sin(x), domain: [-6, 6]},
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let tangentX = 1;

    Object.keys(functions).forEach(name => {
        funcSelect.innerHTML += `<option value="${name}">${name}</option>`;
    });

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

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "y-axis");
        svg.append("path").attr("class", "function-path").attr("fill", "none").attr("stroke", "var(--color-primary)").attr("stroke-width", 2.5);
        svg.append("line").attr("class", "tangent-line").attr("stroke", "var(--color-accent)").attr("stroke-width", 2);
        svg.append("circle").attr("class", "tangent-point").attr("r", 6).attr("fill", "var(--color-accent)").style("cursor", "pointer");

        const drag = d3.drag().on("drag", (event) => {
            tangentX = x.invert(event.x);
            const { domain } = selectedFunc;
            tangentX = Math.max(domain[0], Math.min(domain[1], tangentX));
            update();
        });
        svg.append("rect").attr("width", width).attr("height", height)
           .style("fill", "none").style("pointer-events", "all").call(drag);
    }

    function update() {
        const { func, grad, domain } = selectedFunc;
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1] + 0.1, 0.1);
        const yData = plotData.map(func);
        y.domain(d3.extent(yData)).nice();

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));
        svg.select(".function-path").datum(plotData).attr("d", d3.line().x(d => x(d)).y(d => y(func(d))));

        const tangentY = func(tangentX);
        const slope = grad(tangentX);
        svg.select(".tangent-point").attr("cx", x(tangentX)).attr("cy", y(tangentY));

        const intercept = tangentY - slope * tangentX;
        const y1 = slope * domain[0] + intercept;
        const y2 = slope * domain[1] + intercept;
        svg.select(".tangent-line").attr("x1", x(domain[0])).attr("y1", y(y1)).attr("x2", x(domain[1])).attr("y2", y(y2));

        let isUnderestimator = true;
        for (const d of plotData) {
            if (func(d) < tangentY + slope * (d - tangentX) - 1e-6) {
                isUnderestimator = false;
                break;
            }
        }

        inequalityText.innerHTML = `
            <strong>Tangent at x = ${tangentX.toFixed(2)}:</strong>
            y = ${slope.toFixed(2)}(z - ${tangentX.toFixed(2)}) + ${tangentY.toFixed(2)}<br>
            Status: <strong style="color:${isUnderestimator ? 'var(--color-success)' : 'var(--color-danger)'};">
            ${isUnderestimator ? 'Global Underestimator (Convex)' : 'Not a Global Underestimator'}
            </strong>`;
    }

    funcSelect.onchange = (e) => {
        selectedFunc = functions[e.target.value];
        const { domain } = selectedFunc;
        tangentX = (domain[0] + domain[1]) / 2;
        update();
    };

    new ResizeObserver(setupChart).observe(plotContainer);
    setupChart();
    update();
}
