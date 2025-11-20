/**
 * Widget: Tangent Line Explorer
 *
 * Description: Demonstrates the first-order condition for convexity: f(y) >= f(x) + f'(x)(y-x).
 *              Also explores Strong Convexity by showing the quadratic lower bound.
 * Version: 3.0.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initTangentLineExplorer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 400px; cursor: ew-resize;"></div>
            <div class="widget-controls">
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="tangent-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex-direction: row; align-items: center; gap: 8px;">
                    <input type="checkbox" id="show-quadratic-toggle" class="widget-checkbox">
                    <label for="show-quadratic-toggle" class="widget-label" style="cursor: pointer; margin: 0;">Show Strong Convexity Bound</label>
                </div>
            </div>
            <div id="inequality-text" class="widget-output" style="min-height: 4em; display: flex; flex-direction: column; justify-content: center;"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#tangent-func-select");
    const toggleQuadratic = container.querySelector("#show-quadratic-toggle");
    const plotContainer = container.querySelector("#plot-container");
    const inequalityText = container.querySelector("#inequality-text");

    const functions = {
        "x² (Convex)": { func: x => x**2, grad: x => 2*x, domain: [-2.5, 2.5], mu: 2 },
        "eˣ (Convex)": { func: x => Math.exp(x), grad: x => Math.exp(x), domain: [-2, 1.5], mu: 0 },
        "-log(x) (Convex)": { func: x => -Math.log(x), grad: x => -1/x, domain: [0.2, 4], mu: 0 },
        "x³ (Non-Convex)": { func: x => x**3, grad: x => 3*x**2, domain: [-1.8, 1.8], mu: 0 },
        "cos(x) (Non-Convex)": { func: x => Math.cos(x), grad: x => -Math.sin(x), domain: [-3.5, 3.5], mu: -1 }
    };
    let selectedFunc = functions[Object.keys(functions)[0]];
    let tangentX = 0.5;

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

        svg.append("path").attr("class", "quadratic-bound").attr("fill", "none")
            .attr("stroke", "#fbbf24").attr("stroke-width", 2).attr("stroke-dasharray", "4 4")
            .style("opacity", 0);

        svg.append("line").attr("class", "tangent-line")
            .attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "8 4");

        svg.append("circle").attr("class", "tangent-point").attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "var(--color-surface-1)").attr("stroke-width", 2);

        const drag = d3.drag()
            .container(plotContainer.querySelector('svg'))
            .on("drag", (event) => {
                const [mx, my] = d3.pointer(event, svg.node());
                tangentX = x.invert(mx);
                const { domain } = selectedFunc;
                tangentX = Math.max(domain[0], Math.min(domain[1], tangentX));
                update();
            });

        svg.append("rect").attr("width", width).attr("height", height)
           .style("fill", "transparent").style("cursor", "ew-resize").call(drag);
    }

    function update() {
        const { func, grad, domain, mu } = selectedFunc;
        x.domain(domain);

        const step = (domain[1] - domain[0]) / 200;
        const plotData = d3.range(domain[0], domain[1] + step, step);
        const yValues = plotData.map(func);

        const yExtent = d3.extent(yValues);
        const yPad = (yExtent[1] - yExtent[0]) * 0.1;
        y.domain([yExtent[0] - yPad, yExtent[1] + yPad]); // .nice() sometimes expands too much

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

        // Draw Linear Lower Bound (Tangent)
        const intercept = tangentY - slope * tangentX;
        const y1 = slope * domain[0] + intercept;
        const y2 = slope * domain[1] + intercept;
        svg.select(".tangent-line")
            .attr("x1", x(domain[0])).attr("y1", y(y1))
            .attr("x2", x(domain[1])).attr("y2", y(y2));

        // Draw Quadratic Lower Bound (Strong Convexity)
        if (toggleQuadratic.checked && mu > 0) {
             // Q(y) = f(x) + f'(x)(y-x) + (mu/2)(y-x)^2
             const quadLine = d3.line().x(d => x(d)).y(d => {
                 const linear = slope * (d - tangentX) + tangentY;
                 const quadratic = (mu / 2) * (d - tangentX)**2;
                 return y(linear + quadratic);
             });
             svg.select(".quadratic-bound")
                .style("opacity", 1)
                .datum(plotData).attr("d", quadLine);
        } else {
             svg.select(".quadratic-bound").style("opacity", 0);
        }

        // Check global underestimator property
        let isUnderestimator = true;
        for (const z of plotData) {
            if (func(z) < (slope * (z - tangentX) + tangentY) - 1e-4) {
                isUnderestimator = false;
                break;
            }
        }

        let html = `
            <div style="margin-bottom: 4px; font-size: 0.9rem;">
                <strong>Tangent at x=${tangentX.toFixed(2)}:</strong>
                <span style="color:${isUnderestimator ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: bold;">
                    ${isUnderestimator ? 'Global Underestimator (Convex)' : 'Crosses Function (Non-Convex)'}
                </span>
            </div>
            <div style="font-family: var(--widget-font-mono); font-size: 0.85rem; color: var(--color-text-muted);">
                Linear: f(y) ≥ f(x) + ∇f(x)ᵀ(y - x)
            </div>
        `;

        if (toggleQuadratic.checked) {
            if (mu > 0) {
                html += `
                <div style="font-family: var(--widget-font-mono); font-size: 0.85rem; color: #fbbf24; margin-top: 4px;">
                    Strong: f(y) ≥ f(x) + ∇f(x)ᵀ(y - x) + <sup>μ</sup>/<sub>2</sub>||y-x||²
                </div>`;
            } else {
                html += `<div style="color: var(--color-text-muted); font-size: 0.8rem; margin-top: 4px;">(Function is not strongly convex, μ ≤ 0)</div>`;
            }
        }

        inequalityText.innerHTML = html;
    }

    funcSelect.onchange = (e) => {
        selectedFunc = functions[e.target.value];
        const { domain } = selectedFunc;
        tangentX = (domain[0] + domain[1]) / 2;
        update();
    };

    toggleQuadratic.onchange = update;

    new ResizeObserver(() => { setupChart(); update(); }).observe(plotContainer);
    setupChart();
    update();
}
