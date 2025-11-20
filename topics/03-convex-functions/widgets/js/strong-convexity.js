/**
 * Widget: Strong Convexity Explorer
 *
 * Description: Compares a convex function against its strong convexity lower bound.
 *              f(y) ≥ f(x) + ∇f(x)ᵀ(y - x) + m/2 ||y - x||²
 * Version: 2.1.0
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initStrongConvexity(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="widget-container">
             <div class="widget-canvas-container" id="plot-container" style="height: 350px; cursor: crosshair;"></div>
            <div class="widget-controls">
                 <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Function</label>
                    <select id="sc-func-select" class="widget-select"></select>
                </div>
                <div class="widget-control-group" style="flex: 1;">
                    <label class="widget-label">Strong Convexity Parameter m = <span id="m-value-display" class="widget-value-display">0.0</span></label>
                    <input type="range" id="m-slider" min="0" max="4" step="0.1" value="0" class="widget-slider">
                </div>
            </div>

            <div id="sc-output" class="widget-output"></div>
        </div>
    `;

    const funcSelect = container.querySelector("#sc-func-select");
    const mSlider = container.querySelector("#m-slider");
    const mDisplay = container.querySelector("#m-value-display");
    const plotContainer = container.querySelector("#plot-container");
    const output = container.querySelector("#sc-output");

    const functions = {
        "f(x) = x² (m=2)": { func: x => x**2, grad: x => 2*x, domain: [-2.5, 2.5], range: [-1, 6] },
        "f(x) = eˣ (Not Strongly Convex on R)": { func: x => Math.exp(x), grad: x => Math.exp(x), domain: [-2, 2], range: [0, 8] },
        "f(x) = x⁴ (Strictly, not Strongly Convex)": { func: x => x**4, grad: x => 4*x**3, domain: [-2, 2], range: [0, 16] },
        "f(x) = 0.5x² + cos(3x) (Non-convex)": { func: x => 0.5*x**2 + Math.cos(3*x), grad: x => x - 3*Math.sin(3*x), domain: [-3, 3], range: [-2, 6] }
    };

    let selectedFunc = functions[Object.keys(functions)[0]];
    let pointX = 0.5; // Center point for quadratic lower bound

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

        // Grid
        svg.append("g").attr("class", "grid-line x-grid");
        svg.append("g").attr("class", "grid-line y-grid");

        // Axes
        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0,${height})`);
        svg.append("g").attr("class", "axis y-axis");

        // Function
        svg.append("path").attr("class", "function-path").attr("fill", "none")
            .attr("stroke", "var(--color-primary)").attr("stroke-width", 3);

        // Lower Bound Quadratic
        svg.append("path").attr("class", "bound-path").attr("fill", "none")
            .attr("stroke", "var(--color-accent)").attr("stroke-width", 2).attr("stroke-dasharray", "5 5");

        // Point
        svg.append("circle").attr("class", "center-point").attr("r", 6).attr("fill", "var(--color-accent)").attr("stroke", "#fff").attr("stroke-width", 2);

        const drag = d3.drag()
            .container(plotContainer.querySelector('svg'))
            .on("drag", (event) => {
                const [mx] = d3.pointer(event, svg.node());
                pointX = x.invert(mx);
                // Clamp
                const d = selectedFunc.domain;
                pointX = Math.max(d[0], Math.min(d[1], pointX));
                update();
            });

        svg.append("rect").attr("width", width).attr("height", height)
           .style("fill", "transparent").style("cursor", "ew-resize").call(drag);
    }

    function update() {
        const { func, grad, domain, range } = selectedFunc;
        const m = parseFloat(mSlider.value);
        mDisplay.textContent = m.toFixed(1);

        x.domain(domain);
        y.domain(range);

        const height = plotContainer.clientHeight - 50;
        const width = plotContainer.clientWidth - 60;

        // Update Axes
        svg.select(".x-axis").call(d3.axisBottom(x).ticks(5));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(5));
        svg.select(".x-grid").call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(""));
        svg.select(".y-grid").call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""));

        // Draw Function
        const plotData = d3.range(domain[0], domain[1] + 0.05, (domain[1]-domain[0])/100);
        const line = d3.line().x(d => x(d)).y(d => y(func(d)));
        svg.select(".function-path").datum(plotData).attr("d", line);

        // Draw Quadratic Lower Bound Q(y) = f(x) + grad(x)(y-x) + m/2(y-x)^2
        const fx = func(pointX);
        const gx = grad(pointX);

        const qData = plotData.map(val => {
            const diff = val - pointX;
            return { x: val, y: fx + gx*diff + 0.5*m*diff*diff };
        });

        const qLine = d3.line().x(d => x(d.x)).y(d => y(d.y));
        svg.select(".bound-path").datum(qData).attr("d", qLine);

        svg.select(".center-point").attr("cx", x(pointX)).attr("cy", y(fx));

        // Check condition locally on plot
        let holds = true;
        for(let pt of qData) {
            if (pt.y > func(pt.x) + 1e-2) { // Allow tolerance for visual
                holds = false; break;
            }
        }

        output.innerHTML = `
            <div style="margin-bottom: 4px;">
                <strong>Quadratic Lower Bound:</strong> Q(y) = f(x) + ∇f(x)(y-x) + <span style="color: var(--color-accent);">m/2 (y-x)²</span>
            </div>
            <div>
                Condition f(y) ≥ Q(y) is
                <span style="color:${holds ? 'var(--color-success)' : 'var(--color-error)'}; font-weight: bold;">
                    ${holds ? 'SATISFIED' : 'VIOLATED'}
                </span> for visible range.
            </div>
        `;
    }

    funcSelect.onchange = (e) => {
        selectedFunc = functions[e.target.value];
        update();
    };
    mSlider.oninput = update;

    new ResizeObserver(() => { setupChart(); update(); }).observe(plotContainer);
    setupChart();
    update();
}
