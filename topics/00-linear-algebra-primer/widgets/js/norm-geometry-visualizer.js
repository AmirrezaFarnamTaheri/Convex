/**
 * Widget: Norm Geometry Visualizer
 *
 * Description: Interactively displays the unit balls for ℓ_p norms and allows users
 *              to explore the norm of a point in 2D space.
 * Version: 2.1.0 (Refined)
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function initNormGeometryVisualizer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    let p = 2; // Default to L2 norm
    let userPoint = { x: 0.8, y: 0.8 };

    // --- WIDGET LAYOUT ---
    container.innerHTML = `
        <div class="norm-visualizer-widget">
            <div class="plot-area" id="plot-container"></div>
            <div class="controls-area">
                <div class="p-control">
                    <label for="p-slider">p = <span id="p-value-label">2.0</span></label>
                    <input type="range" id="p-slider" min="1" max="10" step="0.1" value="2" class="styled-slider">
                </div>
                <div class="p-buttons" id="p-buttons-container"></div>
                <div class="output-box" id="output-container"></div>
            </div>
        </div>
    `;

    const plotContainer = container.querySelector("#plot-container");
    const pSlider = container.querySelector("#p-slider");
    const pValueLabel = container.querySelector("#p-value-label");
    const pButtonsContainer = container.querySelector("#p-buttons-container");
    const outputContainer = container.querySelector("#output-container");

    const buttons = [
        { label: "L¹ Norm (p=1)", value: 1 },
        { label: "L² Norm (p=2)", value: 2 },
        { label: "L¹⁰ Norm (p=10)", value: 10 },
        { label: "L∞ Norm", value: Infinity }
    ];

    buttons.forEach(btnInfo => {
        const button = document.createElement("button");
        button.textContent = btnInfo.label;
        button.className = 'widget-button';
        button.onclick = () => {
            p = btnInfo.value;
            if (p !== Infinity) {
                pSlider.value = p;
                pValueLabel.textContent = p.toFixed(1);
            } else {
                pValueLabel.textContent = "∞";
            }
            pSlider.disabled = (p === Infinity);
            update();
        };
        pButtonsContainer.appendChild(button);
    });

    pSlider.oninput = () => {
        p = parseFloat(pSlider.value);
        pValueLabel.textContent = p.toFixed(1);
        update();
    };

    let svg, x, y;

    function setupChart() {
        plotContainer.innerHTML = '';
        const margin = { top: 20, right: 20, bottom: 30, left: 30 };
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = plotContainer.clientHeight - margin.top - margin.bottom;

        svg = d3.select(plotContainer).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${plotContainer.clientWidth} ${plotContainer.clientHeight}`)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const domain = 1.6;
        x = d3.scaleLinear().domain([-domain, domain]).range([-width / 2, width / 2]);
        y = d3.scaleLinear().domain([-domain, domain]).range([height / 2, -height / 2]);

        const grid = svg.append("g").attr("class", "grid");
        grid.selectAll("line.x-grid")
            .data(x.ticks(10))
            .enter().append("line")
            .attr("class", "x-grid")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", -height / 2)
            .attr("y2", height / 2);

        grid.selectAll("line.y-grid")
            .data(y.ticks(10))
            .enter().append("line")
            .attr("class", "y-grid")
            .attr("x1", -width / 2)
            .attr("x2", width / 2)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d));

        svg.append("g").attr("class", "axis x-axis").attr("transform", `translate(0, ${height/2})`).call(d3.axisBottom(x).ticks(5));
        svg.append("g").attr("class", "axis y-axis").call(d3.axisLeft(y).ticks(5));
        svg.select(".x-axis").attr("transform", `translate(0, ${y(0)})`);
        svg.select(".y-axis").attr("transform", `translate(${x(0)}, 0)`);


        svg.append("path").attr("class", "unit-ball");
        svg.append("g").attr("class", "user-elements");
    }

    const drag = d3.drag()
        .on("start", (event) => d3.select(event.sourceEvent.target).raise().classed("active", true))
        .on("drag", function(event) {
            const [mx, my] = d3.pointer(event, svg.node());
            userPoint.x = x.invert(mx);
            userPoint.y = y.invert(my);
            update();
        })
        .on("end", (event) => d3.select(event.sourceEvent.target).classed("active", false));

    function update() {
        drawUnitBall();
        drawUserPoint();
        updateOutput();
    }

    function calculateNorm(point) {
        if (p === Infinity) {
            return Math.max(Math.abs(point.x), Math.abs(point.y));
        }
        return Math.pow(Math.pow(Math.abs(point.x), p) + Math.pow(Math.abs(point.y), p), 1 / p);
    }

    function drawUnitBall() {
        const points = [];
        const numPoints = 200;
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const cos_a = Math.cos(angle);
            const sin_a = Math.sin(angle);
            let r;
            if (p === Infinity) {
                r = 1 / Math.max(Math.abs(cos_a), Math.abs(sin_a));
            } else {
                r = Math.pow(Math.pow(Math.abs(cos_a), p) + Math.pow(Math.abs(sin_a), p), -1 / p);
            }
            points.push({ x: r * cos_a, y: r * sin_a });
        }
        const lineGenerator = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveLinearClosed);
        svg.select(".unit-ball").datum(points).attr("d", lineGenerator);
    }

    function drawUserPoint() {
        const userElements = svg.select(".user-elements");
        userElements.selectAll("*").remove();
        const norm = calculateNorm(userPoint);

        if (norm > 1.001) {
            const projectedPoint = { x: userPoint.x / norm, y: userPoint.y / norm };
            userElements.append("line")
                .attr("class", "projection-line")
                .attr("x1", x(userPoint.x)).attr("y1", y(userPoint.y))
                .attr("x2", x(projectedPoint.x)).attr("y2", y(projectedPoint.y));
            userElements.append("circle")
                .attr("class", "projected-point")
                .attr("cx", x(projectedPoint.x)).attr("cy", y(projectedPoint.y))
                .attr("r", 5);
        }

        const vector = userElements.append("line")
            .attr("class", "user-vector")
            .attr("x1", x(0)).attr("y1", y(0))
            .attr("x2", x(userPoint.x)).attr("y2", y(userPoint.y))
            .attr("marker-end", "url(#arrowhead)");

        const handle = userElements.append("circle")
            .attr("class", "handle")
            .attr("cx", x(userPoint.x)).attr("cy", y(userPoint.y))
            .attr("r", 8)
            .call(drag);
    }

    function updateOutput() {
        const norm = calculateNorm(userPoint);
        const pDisplay = p === Infinity ? "∞" : p.toFixed(1);
        outputContainer.innerHTML = `
            <div><strong>Point x:</strong> <code>[${userPoint.x.toFixed(2)}, ${userPoint.y.toFixed(2)}]</code></div>
            <div><strong>L<sub>${pDisplay}</sub> Norm ||x||<sub>${pDisplay}</sub>:</strong> <code>${norm.toFixed(3)}</code></div>
            <div class="status-text" style="color: ${norm <= 1.001 ? 'var(--color-success)' : 'var(--color-error)'};">
                ${norm <= 1.001 ? "✓ Inside unit ball" : "✗ Outside unit ball"}
            </div>
        `;
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === plotContainer) {
                setupChart();
                update();
            }
        }
    });
    resizeObserver.observe(plotContainer);

    setupChart();
    update();
}

// Adding styles dynamically
const style = document.createElement('style');
style.textContent = `
.norm-visualizer-widget { display: flex; flex-direction: column; height: 100%; background: var(--color-background); border-radius: var(--border-radius-lg); overflow: hidden; }
.plot-area { flex-grow: 1; position: relative; }
.controls-area { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); background: var(--color-surface-1); }
.p-control { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.p-control label { font-weight: 500; color: var(--color-text-main); }
#p-value-label { font-weight: bold; color: var(--color-primary); min-width: 40px; text-align: right; }
.p-buttons { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.widget-button { background-color: var(--color-surface-2); border: 1px solid var(--color-border); color: var(--color-text-muted); padding: 0.5rem 1rem; border-radius: var(--border-radius-sm); cursor: pointer; transition: all 0.2s ease; }
.widget-button:hover { background-color: var(--color-surface-3); color: var(--color-primary); border-color: var(--color-primary); }
.output-box { background-color: var(--color-surface-2); padding: 1rem; border-radius: var(--border-radius-sm); font-size: 0.9rem; }
.output-box div { margin-bottom: 0.5rem; }
.output-box code { background-color: var(--color-background); }
.status-text { font-weight: bold; }
/* D3 styles */
.axis path, .axis line { stroke: var(--color-border); }
.axis text { fill: var(--color-text-muted); }
.grid line { stroke: var(--color-surface-2); stroke-opacity: 0.7; shape-rendering: crispEdges; }
.unit-ball { fill: var(--color-primary); fill-opacity: 0.2; stroke: var(--color-primary); stroke-width: 2; }
.user-vector { stroke: var(--color-accent); stroke-width: 2.5; }
.handle { fill: var(--color-accent); cursor: grab; }
.handle:active { cursor: grabbing; }
.projection-line { stroke: var(--color-accent-secondary); stroke-width: 1.5; stroke-dasharray: 4 4; }
.projected-point { fill: var(--color-accent-secondary); }
`;
document.head.appendChild(style);
