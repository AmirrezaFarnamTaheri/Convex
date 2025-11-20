/**
 * Widget: Tangent Line Explorer
 *
 * Description: Demonstrates the first-order condition for convexity: f(y) >= f(x) + f'(x)(y-x).
 *              The tangent line at any point on a convex function is a global underestimator.
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initTangentLineExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 350px; cursor: ew-resize;"></div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="tangent-func-select" class="widget-select"></select>
                </div>
            </div>
            <div id="inequality-text" class="widget-output" style="min-height: 3em; display: flex; flex-direction: column; justify-content: center;"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#tangent-func-select");
    const plotContainer = container.querySelector("#plot-container");
    const inequalityText = container.querySelector("#inequality-text");

    const functions = {
        "x² (Convex)": { func: x => x**2, grad: x => 2*x, domain: [-2.5, 2.5] },
        "eˣ (Convex)": { func: x => Math.exp(x), grad: x => Math.exp(x), domain: [-2, 2] },
        "-log(x) (Convex)": { func: x => -Math.log(x), grad: x => -1/x, domain: [0.1, 5] },
        "x³ (Non-Convex)": { func: x => x**3, grad: x => 3*x**2, domain: [-2, 2] },
        "cos(x) (Non-Convex)": { func: x => Math.cos(x), grad: x => -Math.sin(x), domain: [-4, 4]},
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let tangentX = 1;

    Object.keys(functions).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        funcSelect.appendChild(opt);
    });

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = {top: 20, right: 20, bottom: 30, left: 40};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("class", "widget-svg")
            .attr("width", "100%").attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        svg.append("g").attr("class", "grid-line x-grid");
        svg.append("g").attr("class", "grid-line y-grid");

        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis y-axis");

        svg.append("path").attr("class", "function-path").attr("fill", "none")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        svg.append("line").attr("class", "tangent-line")
            .attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "8 4");

        svg.append("circle").attr("class", "tangent-point").attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "#fff").attr("stroke-width", 2);

        const drag = d3.drag()
            .container(plotContainer.querySelector('svg'))
            .on("drag", (event) => {
                // Inverse X relative to graph area (margin compensated by d3.pointer on g,
                // but here we catch on rect? Let's use pointer relative to g)
                const [mx, my] = d3.pointer(event, svg.node());
                tangentX = x.invert(mx);

                // Clamp to domain
                const { domain } = selectedFunc;
                tangentX = Math.max(domain[0], Math.min(domain[1], tangentX));

                update();
            });

        svg.append("rect").attr("width", width).attr("height", height)
           .style("fill", "transparent").style("cursor", "ew-resize").call(drag);
    }

    function update() {
        const { func, grad, domain } = selectedFunc;
        x.domain(domain);
        const plotData = d3.range(domain[0], domain[1] + 0.05, (domain[1]-domain[0])/100);
        const yData = plotData.map(func);

        const yExtent = d3.extent(yData);
        const yPad = (yExtent[1] - yExtent[0]) * 0.1;
        y.domain([yExtent[0] - yPad, yExtent[1] + yPad]).nice();

        const width = plotContainer.clientWidth - 60;
        const height = plotContainer.clientHeight - 50;

        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));

        svg.select(".x-grid").call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

        const lineGen = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(plotData).attr("d", lineGen);

        const tangentY = func(tangentX);
        const slope = grad(tangentX);

        svg.select(".tangent-point").attr("cx", x(tangentX)).attr("cy", y(tangentY));

        // Draw line across domain
        const intercept = tangentY - slope * tangentX;

        // Clip line to plot box visually?
        // Just calculating start/end points at x domain boundaries
        const y1 = slope * domain[0] + intercept;
        const y2 = slope * domain[1] + intercept;

        svg.select(".tangent-line")
            .attr("x1", x(domain[0])).attr("y1", y(y1))
            .attr("x2", x(domain[1])).attr("y2", y(y2));

        // Check global underestimator property
        // Sample points and check f(z) >= L(z)
        let isUnderestimator = true;
        for (const z of plotData) {
            // Allow small epsilon
            if (func(z) < (slope * (z - tangentX) + tangentY) - 1e-5) {
                isUnderestimator = false;
                break;
            }
        }

        inequalityText.innerHTML = `
            <div style="margin-bottom: 4px;">
                <strong>First-Order Condition:</strong> f(y) ≥ f(x) + ∇f(x)ᵀ(y - x)
            </div>
            <div>
                Tangent at x=${tangentX.toFixed(2)} is
                <span style="color:${isUnderestimator ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: bold;">
                    ${isUnderestimator ? 'BELOW' : 'NOT BELOW'}
                </span> the function everywhere.
            </div>
        `;
    }

    funcSelect.onchange = (e) => {
        selectedFunc = functions[e.target.value];
        const { domain } = selectedFunc;
        tangentX = (domain[0] + domain[1]) / 2;
        update();
    };

    new ResizeObserver(() => { setupChart(); update(); }).observe(plotContainer);
    setupChart();
    update();
}
